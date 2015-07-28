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
#include "File.h"
#include "checkFunctions.h"

using namespace std;

extern vector <User> UserList;
extern vector <string> Logs;
extern vector <string> parsedLogs;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <File> FileList;
extern bool validXML;

// DEV: Make compatible with multiple virtual servers.
//		How many virtual servers are possible ?
#define LOGMATCHCONNECT			"|INFO    |VirtualServerBase|  1| client connected '"
#define LOGMATCHDISCONNECT		"|INFO    |VirtualServerBase|  1| client disconnected '"
#define LOGMATCHDELETEUSER1		"|INFO    |VirtualServer |  1| client '"
#define LOGMATCHDELETEUSER2		") got deleted by client '"
#define LOGMATCHFILEUPLOAD		"|INFO    |VirtualServer |  1| file upload to ("

// Parses the logs and stores the data in the UserList.
void parseLogs(string LOGDIRECTORY) {
	string buffer_logline, buffer_XMLInfoInput, LogFilePath, DateTime, Nickname, ID_string, IP, bannedByInvokerID, bannedByNickname, bannedByUID, banReason, bantime, kickedByNickname, kickedByUID, kickReason, uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID;
	unsigned int ID, BanListID, KickListID, FileListID, NicknameLength, IDLength, IPLength, IDStartPos, IDEndPos, NicknameStartPos, IPStartPos, bannedByInvokerIDEndPos, bannedByNicknameEndPos, bannedByUIDEndPos, banReasonEndPos, kickReasonStartPos, kickedByNicknameStartPos, kickedByNicknameEndPos, kickedByUIDEndPos, channelIDEndPos, filenameEndPos, uploadedByIDStartPos;
	unsigned long logfileLength;
	bool kickMatch, banMatch;

	if (BanList.size() > 0) BanListID = BanList.size();
	else BanListID = 0;

	if (KickList.size() > 0) KickListID = KickList.size();
	else KickListID = 0;

	if (FileList.size() > 0) FileListID = FileList.size();
	else FileListID = 0;

	if (validXML) {
		if (IsMatchingLogOrder()) {
			cout << "Comparing logs..." << endl;
			for (unsigned int i = 0; i < parsedLogs.size(); i++) {
				for (unsigned int j = 0; j < Logs.size() - 1; j++) {
					if (Logs[j] == parsedLogs[i]) {
						Logs[j].erase();
					}
				}
			}
		}
		else cout << "Logs parsed for the last XML were deleted or the log order changed - skipping use of old XML..." << endl;
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
				banMatch = kickMatch = false;
				bannedByInvokerID.clear();
				bannedByNickname.clear();
				bannedByUID.clear();
				banReason.clear();
				bantime.clear();
				kickedByNickname.clear();
				kickedByUID.clear();
				kickReason.clear();
				uploadDateTime.clear();
				channelID.clear();
				filename.clear();
				uploadedByNickname.clear();
				uploadedByID.clear();

				// Connection matches.
				if (buffer_logline.find(LOGMATCHCONNECT) != string::npos) {
					NicknameStartPos = 77;

					IPStartPos = 1 + (unsigned int)buffer_logline.rfind(" ");
					IPLength = buffer_logline.length() - IPStartPos - 6; // - 6 for ignoring the port.

					IDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:");
					IDLength = IPStartPos - IDStartPos - 7;

					NicknameLength = IDStartPos - NicknameStartPos - 5;

					// Date & Time - just as a string until seperation.
					for (unsigned int j = 0; j < 19; j++) {
						DateTime += buffer_logline[j];
					}

					// Nickname
					for (unsigned int j = 0; j < NicknameLength; j++) {
						Nickname += buffer_logline[NicknameStartPos + j];
					}

					// ID
					for (unsigned int j = 0; j < IDLength; j++) {
						ID_string += buffer_logline[IDStartPos + j];
					}

					// IP (if connecting)
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

				// Disconnecting matches, including kick and ban matches.
				else if (buffer_logline.find(LOGMATCHDISCONNECT) != string::npos) {
					NicknameStartPos = 80;

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
					if (UserList[ID].getUniqueNickname(0) != Nickname) {
						UserList[ID].addNickname(Nickname);
					}
					if (i + 1 == Logs.size()) {
						UserList[ID].disconnect();
					}

					// Ban matches.
					if (banMatch) {
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

					// Kick matches.
					else if (kickMatch) {
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

				// Upload matches.
				else if (buffer_logline.find(LOGMATCHFILEUPLOAD) != string::npos) {
					channelIDEndPos = (unsigned int)buffer_logline.find(")");
					filenameEndPos = (unsigned int)buffer_logline.rfind("' by client '");
					uploadedByIDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:");

					for (unsigned int j = 0; j < 19; j++) {
						uploadDateTime += buffer_logline[j];
					}

					for (unsigned int j = 75; j < channelIDEndPos; j++) {
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
						FileList[FileListID].uploadFile(uploadDateTime, stoul(channelID), filename, uploadedByNickname, stoul(uploadedByID));
						FileListID++;
					}
				}

				// User Deletion matches.
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
