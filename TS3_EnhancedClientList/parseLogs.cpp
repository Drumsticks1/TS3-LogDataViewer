// parseLogs.cpp : Parsing of the logs.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <boost/filesystem.hpp>
#include "User.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "File.h"
#include "checkFunctions.h"

using namespace std;

extern vector <string> Logs;
extern vector <string> parsedLogs;
extern vector <User> UserList;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <Complaint> ComplaintList;
extern vector <File> FileList;
extern bool validXML;
extern unsigned int VIRTUALSERVER;

#define LOGMATCHCONNECT			"|INFO    |VirtualServerBase|  " + to_string(VIRTUALSERVER) + "| client connected '"
#define LOGMATCHDISCONNECT		"|INFO    |VirtualServerBase|  " + to_string(VIRTUALSERVER) + "| client disconnected '"
#define LOGMATCHDELETEUSER1		"|INFO    |VirtualServer |  " + to_string(VIRTUALSERVER) + "| client '"
#define LOGMATCHDELETEUSER2		") got deleted by client '"
#define LOGMATCHCOMPLAINT		"|INFO    |VirtualServer |  " + to_string(VIRTUALSERVER) + "| complaint added for client '"
#define LOGMATCHFILEUPLOAD		"|INFO    |VirtualServer |  " + to_string(VIRTUALSERVER) + "| file upload to ("

// Parses the logs and stores the data in the UserList.
void parseLogs(string LOGDIRECTORY) {
	string buffer_logline, buffer_XMLInfoInput, LogFilePath, DateTime, Nickname, ID_string, IP,
		bannedByInvokerID, bannedByNickname, bannedByUID, banReason, bantime,
		kickedByNickname, kickedByUID, kickReason,
		complaintDateTime, complaintForNickname, complaintForID, complaintReason, complaintByNickname, complaintByID,
		uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID;
	unsigned int BanListID, KickListID, ComplaintListID, FileListID, ID,
		virtualServerLength = to_string(VIRTUALSERVER).length(), NicknameLength, IDLength, IPLength,
		IDStartPos, IDEndPos, NicknameStartPos, IPStartPos,
		bannedByInvokerIDEndPos, bannedByNicknameEndPos, bannedByUIDEndPos, banReasonEndPos,
		kickReasonStartPos, kickedByNicknameStartPos, kickedByNicknameEndPos, kickedByUIDEndPos,
		complaintForNicknameEndPos, complaintForIDEndPos, complaintByNicknameStartPos, complaintByIDStartPos,
		uploadedByIDStartPos, channelIDEndPos, filenameEndPos;

	unsigned long logfileLength;
	bool kickMatch, banMatch;

	if (BanList.size() > 0) BanListID = BanList.size();
	else BanListID = 0;

	if (KickList.size() > 0) KickListID = KickList.size();
	else KickListID = 0;

	if (ComplaintList.size() > 0) ComplaintListID = ComplaintList.size();
	else ComplaintListID = 0;

	if (FileList.size() > 0) FileListID = FileList.size();
	else FileListID = 0;

	if (validXML) {
		if (IsMatchingLogOrder()) {
			cout << "Comparing new and old logs..." << endl;
			for (unsigned int i = 0; i < parsedLogs.size(); i++) {
				for (unsigned int j = 0; j < Logs.size() - 1; j++) {
					if (Logs[j] == parsedLogs[i]) {
						Logs[j].erase();
					}
				}
			}
		}
		else {
			cout << "Logs parsed for the last XML were deleted or the log order changed - skipping use of old XML..." << endl;
			parsedLogs.clear();
		}
	}

	cout << "Parsing new logs..." << endl;
	for (unsigned int i = 0; i < Logs.size(); i++) {
		if (!Logs[i].empty()) {
			LogFilePath = LOGDIRECTORY + Logs.at(i);

			ifstream logfile(LogFilePath);

			logfile.seekg(0, logfile.end);
			logfileLength = (unsigned long)logfile.tellg();
			logfile.seekg(0, logfile.beg);

			for (unsigned long currentPos = 0; currentPos < logfileLength;) {
				getline(logfile, buffer_logline);

				ID_string.clear();
				Nickname.clear();
				DateTime.clear();
				IP.clear();

				// Connects
				if (buffer_logline.find(LOGMATCHCONNECT) != string::npos) {
					NicknameStartPos = 76 + virtualServerLength;

					IPStartPos = 1 + (unsigned int)buffer_logline.rfind(" ");
					IPLength = buffer_logline.length() - IPStartPos - 6; // - 6 for ignoring the port.

					IDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:");
					IDLength = IPStartPos - IDStartPos - 7;

					NicknameLength = IDStartPos - NicknameStartPos - 5;

					for (unsigned int j = 0; j < 19; j++) {
						DateTime += buffer_logline[j];
					}

					for (unsigned int j = 0; j < NicknameLength; j++) {
						Nickname += buffer_logline[NicknameStartPos + j];
					}

					for (unsigned int j = 0; j < IDLength; j++) {
						ID_string += buffer_logline[IDStartPos + j];
					}

					for (unsigned int j = 0; j < IPLength; j++) {
						IP += buffer_logline[IPStartPos + j];
					}

					ID = stoul(ID_string);
					if (UserList.size() < ID + 1) UserList.resize(ID + 1);

					if (UserList[ID].getID() != ID) {
						UserList[ID].addID(ID);
					}

					UserList[ID].addNickname(Nickname);

					if (validXML) {
						if (!IsDuplicateDateTime(ID, DateTime)) {
							UserList[ID].addDateTime(DateTime);
						}
					}
					else UserList[ID].addDateTime(DateTime);

					UserList[ID].addIP(IP);

					if (i + 1 == Logs.size()) {
						UserList[ID].connect();
					}
				}

				// Disconnects (including kicks and bans)
				else if (buffer_logline.find(LOGMATCHDISCONNECT) != string::npos) {
					banMatch = kickMatch = false;

					NicknameStartPos = 79 + virtualServerLength;
					IDStartPos = (unsigned int)buffer_logline.rfind("'(id:") + 5;

					if (buffer_logline.rfind(") reason 'reasonmsg") == string::npos) {
						IDEndPos = (unsigned int)buffer_logline.rfind(") reason 'invokerid=");
						if (buffer_logline.rfind(" bantime=") == string::npos) {
							kickMatch = true;
						}
						else banMatch = true;
					}
					else IDEndPos = (unsigned int)buffer_logline.rfind(") reason 'reasonmsg");

					IDLength = IDEndPos - IDStartPos;
					NicknameLength = IDStartPos - NicknameStartPos - 5;

					for (unsigned int j = 0; j < 19; j++) {
						DateTime += buffer_logline[j];
					}

					for (unsigned int j = 0; j < NicknameLength; j++) {
						Nickname += buffer_logline[NicknameStartPos + j];
					}

					for (unsigned int j = 0; j < IDLength; j++) {
						ID_string += buffer_logline[IDStartPos + j];
					}

					ID = stoul(ID_string);
					if (UserList.size() < ID + 1) {
						UserList.resize(ID + 1);
						UserList[ID].addID(ID);
					}

					if (UserList[ID].getNicknameCount() == 0 || UserList[ID].getUniqueNickname(0) != Nickname) {
						UserList[ID].addNickname(Nickname);
					}

					if (i + 1 == Logs.size()) {
						UserList[ID].disconnect();
					}

					// Bans
					if (banMatch) {
						bannedByInvokerID.clear();
						bannedByNickname.clear();
						bannedByUID.clear();
						banReason.clear();
						bantime.clear();

						bannedByInvokerIDEndPos = buffer_logline.find(" invokername=", IDEndPos);

						if (buffer_logline.find("invokeruid=") != string::npos) {
							bannedByNicknameEndPos = buffer_logline.find(" invokeruid=", bannedByInvokerIDEndPos);
						}
						else bannedByNicknameEndPos = bannedByUIDEndPos = buffer_logline.find(" reasonmsg");

						bannedByUIDEndPos = buffer_logline.find(" reasonmsg", bannedByNicknameEndPos);

						if (buffer_logline.find("reasonmsg=") != string::npos) {
							banReasonEndPos = buffer_logline.find(" bantime=", bannedByUIDEndPos);
						}
						else banReasonEndPos = bannedByUIDEndPos + 10;

						for (unsigned j = IDEndPos + 20; j < bannedByInvokerIDEndPos; j++) {
							bannedByInvokerID += buffer_logline[j];
						}

						for (unsigned j = bannedByInvokerIDEndPos + 13; j < bannedByNicknameEndPos; j++) {
							bannedByNickname += buffer_logline[j];
						}

						for (unsigned j = bannedByNicknameEndPos + 12; j < bannedByUIDEndPos; j++) {
							bannedByUID += buffer_logline[j];
						}

						for (unsigned j = bannedByUIDEndPos + 11; j < banReasonEndPos; j++) {
							banReason += buffer_logline[j];
						}

						for (unsigned j = banReasonEndPos + 9; j < buffer_logline.size() - 1; j++) {
							bantime += buffer_logline[j];
						}

						if (!IsDuplicateBan(DateTime, Nickname, ID, stoul(bannedByInvokerID), bannedByNickname, bannedByUID, banReason, stoul(bantime))) {
							BanList.resize(BanListID + 1);
							BanList[BanListID].addBan(DateTime, Nickname, ID, stoul(bannedByInvokerID), bannedByNickname, bannedByUID, banReason, stoul(bantime));
							BanListID++;
						}
					}

					// Kicks
					else if (kickMatch) {
						kickedByNickname.clear();
						kickedByUID.clear();
						kickReason.clear();

						if (buffer_logline.rfind(" reasonmsg=") != string::npos) {
							kickReasonStartPos = 11 + buffer_logline.rfind(" reasonmsg=");
							for (unsigned int j = kickReasonStartPos; j < buffer_logline.size() - 1; j++) {
								kickReason += buffer_logline[j];
							}
						}
						else kickReason = "";

						kickedByNicknameStartPos = 13 + buffer_logline.rfind(" invokername=");
						kickedByNicknameEndPos = buffer_logline.rfind(" invokeruid=");
						if (buffer_logline.find("invokeruid=serveradmin") == string::npos) {
							kickedByUIDEndPos = buffer_logline.find("=", kickedByNicknameEndPos + 12) + 1;
						}
						else kickedByUIDEndPos = kickedByNicknameEndPos + 23;

						for (unsigned j = kickedByNicknameStartPos; j < kickedByNicknameEndPos; j++) {
							kickedByNickname += buffer_logline[j];
						}

						for (unsigned j = kickedByNicknameEndPos + 12; j < kickedByUIDEndPos; j++) {
							kickedByUID += buffer_logline[j];
						}

						if (!IsDuplicateKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason)) {
							KickList.resize(KickListID + 1);
							KickList[KickListID].addKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason);
							KickListID++;
						}
					}
				}

				// Complaints
				else if (buffer_logline.find(LOGMATCHCOMPLAINT) != string::npos) {
					complaintDateTime.clear();
					complaintForNickname.clear();
					complaintForID.clear();
					complaintReason.clear();
					complaintByNickname.clear();
					complaintByID.clear();

					complaintForNicknameEndPos = (unsigned int)buffer_logline.find("'(id:");
					complaintForIDEndPos = (unsigned int)buffer_logline.find(") reason '");
					complaintByNicknameStartPos = (unsigned int)buffer_logline.rfind("' by client '") + 13;
					complaintByIDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:");

					for (unsigned int j = 0; j < 19; j++) {
						complaintDateTime += buffer_logline[j];
					}

					for (unsigned int j = 83 + virtualServerLength; j < complaintForNicknameEndPos; j++) {
						complaintForNickname += buffer_logline[j];
					}

					for (unsigned int j = complaintForNicknameEndPos + 5; j < complaintForIDEndPos; j++) {
						complaintForID += buffer_logline[j];
					}

					for (unsigned int j = complaintForIDEndPos + 10; j < complaintByNicknameStartPos - 13; j++) {
						complaintReason += buffer_logline[j];
					}

					for (unsigned int j = complaintByNicknameStartPos; j < complaintByIDStartPos - 5; j++) {
						complaintByNickname += buffer_logline[j];
					}

					for (unsigned int j = complaintByIDStartPos; j < buffer_logline.size() - 1; j++) {
						complaintByID += buffer_logline[j];
					}

					if (!IsDuplicateComplaint(complaintDateTime, complaintForNickname, stoul(complaintForID), complaintReason, complaintByNickname, stoul(complaintByID))) {
						ComplaintList.resize(ComplaintListID + 1);
						ComplaintList[ComplaintListID].addComplaint(complaintDateTime, complaintForNickname, stoul(complaintForID), complaintReason, complaintByNickname, stoul(complaintByID));
						ComplaintListID++;
					}
				}

				// Uploads
				else if (buffer_logline.find(LOGMATCHFILEUPLOAD) != string::npos) {
					uploadDateTime.clear();
					channelID.clear();
					filename.clear();
					uploadedByNickname.clear();
					uploadedByID.clear();

					channelIDEndPos = (unsigned int)buffer_logline.find(")");
					filenameEndPos = (unsigned int)buffer_logline.rfind("' by client '");
					uploadedByIDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:");

					for (unsigned int j = 0; j < 19; j++) {
						uploadDateTime += buffer_logline[j];
					}

					for (unsigned int j = 74 + virtualServerLength; j < channelIDEndPos; j++) {
						channelID += buffer_logline[j];
					}

					for (unsigned int j = channelIDEndPos + 4; j < filenameEndPos; j++) {
						filename += buffer_logline[j];
					}

					for (unsigned int j = filenameEndPos + 13; j < uploadedByIDStartPos - 5; j++) {
						uploadedByNickname += buffer_logline[j];
					}

					for (unsigned int j = uploadedByIDStartPos; j < buffer_logline.size() - 1; j++) {
						uploadedByID += buffer_logline[j];
					}

					if (!IsDuplicateFile(uploadDateTime, stoul(channelID), filename, uploadedByNickname, stoul(uploadedByID))) {
						FileList.resize(FileListID + 1);
						FileList[FileListID].addFile(uploadDateTime, stoul(channelID), filename, uploadedByNickname, stoul(uploadedByID));
						FileListID++;
					}
				}

				// User Deletions
				else if (buffer_logline.find(LOGMATCHDELETEUSER1) != string::npos) {
					if (buffer_logline.find(LOGMATCHDELETEUSER2) != string::npos) {
						IDEndPos = (unsigned int)buffer_logline.rfind(") got deleted by client '");
						IDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:", IDEndPos);
						IDLength = IDEndPos - IDStartPos;

						// ID
						for (unsigned int j = 0; j < IDLength; j++) {
							ID_string += buffer_logline[IDStartPos + j];
						}

						ID = stoul(ID_string);
						UserList[ID].deleteUser();
					}
				}

				currentPos += buffer_logline.length() + 1;
				logfile.seekg(currentPos);
			}
			logfile.close();
			if (!IsDuplicateLog(Logs[i])) {
				parsedLogs.emplace_back(Logs[i]);
			}
		}
	}
}
