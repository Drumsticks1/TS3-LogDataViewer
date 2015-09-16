// parseLogs.cpp : Parsing of the logs.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <boost/filesystem.hpp>
#include "Client.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "Upload.h"
#include "checkFunctions.h"
#include "customStreams.h"

using namespace std;

extern vector <string> Logs;
extern vector <string> parsedLogs;
extern vector <Client> ClientList;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <Complaint> ComplaintList;
extern vector <Upload> UploadList;
extern bool validXML;
extern unsigned int VIRTUALSERVER;
extern TeeStream outputStream;

#define LOGMATCHBANRULE			"|INFO    |VirtualServer |  " + to_string(VIRTUALSERVER) + "| ban added reason='"
#define LOGMATCHCOMPLAINT		"|INFO    |VirtualServer |  " + to_string(VIRTUALSERVER) + "| complaint added for client '"
#define LOGMATCHCONNECT			"|INFO    |VirtualServerBase|  " + to_string(VIRTUALSERVER) + "| client connected '"
#define LOGMATCHDISCONNECT		"|INFO    |VirtualServerBase|  " + to_string(VIRTUALSERVER) + "| client disconnected '"
#define LOGMATCHDELETEUSER1		"|INFO    |VirtualServer |  " + to_string(VIRTUALSERVER) + "| client '"
#define LOGMATCHDELETEUSER2		") got deleted by client '"
#define LOGMATCHFILEUPLOAD		"|INFO    |VirtualServer |  " + to_string(VIRTUALSERVER) + "| file upload to ("

// Parses the logs and stores the data in the ClientList.
void parseLogs(string LOGDIRECTORY) {
	string buffer_logline, LogFilePath, DateTime, Nickname, ID_string, IP,
		lastUIDBanRule, lastIPBanRule, bannedUID, bannedIP, bannedByID, bannedByNickname, bannedByUID, banReason, bantime,
		kickedByNickname, kickedByUID, kickReason,
		complaintDateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID,
		uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID;
	unsigned int BanListID, KickListID, ComplaintListID, UploadListID, ID, virtualServerLength = to_string(VIRTUALSERVER).size(),
		NicknameLength, IDLength, IPLength,
		IDStartPos, IDEndPos, NicknameStartPos, IPStartPos,
		bannedByNicknameStartPos, bannedByNicknameEndPos, bannedByUIDEndPos, banReasonEndPos, bannedIPStartPos, bannedIPEndPos, bannedUIDStartPos, bannedUIDEndPos, bannedByIDStartPos,
		kickReasonStartPos, kickedByNicknameStartPos, kickedByNicknameEndPos, kickedByUIDEndPos,
		complaintAboutNicknameEndPos, complaintAboutIDEndPos, complaintByNicknameStartPos, complaintByIDStartPos,
		uploadedByIDStartPos, channelIDEndPos, filenameEndPos;
	unsigned long logfileLength;
	bool kickMatch, banMatch;

	if (BanList.size() > 0) BanListID = BanList.size();
	else BanListID = 0;

	if (KickList.size() > 0) KickListID = KickList.size();
	else KickListID = 0;

	if (ComplaintList.size() > 0) ComplaintListID = ComplaintList.size();
	else ComplaintListID = 0;

	if (UploadList.size() > 0) UploadListID = UploadList.size();
	else UploadListID = 0;

	if (validXML) {
		if (isMatchingLogOrder()) {
			outputStream << "Comparing new and old logs..." << endl;
			for (unsigned int i = 0; i < parsedLogs.size(); i++) {
				for (unsigned int j = 0; j < Logs.size() - 1; j++) {
					if (Logs[j] == parsedLogs[i]) {
						Logs[j].erase();
					}
				}
			}
		}
		else {
			outputStream << "Logs parsed for the last XML were deleted or the log order changed - skipping use of old XML..." << endl;
			parsedLogs.clear();
		}
	}

	outputStream << "Parsing new logs..." << endl;
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

					IPStartPos = 1 + buffer_logline.rfind(" ");
					IPLength = buffer_logline.size() - IPStartPos - 6; // - 6 for ignoring the port.

					IDStartPos = 5 + buffer_logline.rfind("'(id:");
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
					if (ClientList.size() < ID + 1) ClientList.resize(ID + 1);

					if (ClientList[ID].getID() != ID) {
						ClientList[ID].addID(ID);
					}

					ClientList[ID].addNickname(Nickname);

					if (validXML) {
						if (!isDuplicateDateTime(ID, DateTime)) {
							ClientList[ID].addDateTime(DateTime);
						}
					}
					else ClientList[ID].addDateTime(DateTime);

					ClientList[ID].addIP(IP);

					if (i + 1 == Logs.size()) {
						ClientList[ID].connect();
					}
				}

				// Disconnects (including kicks and bans)
				else if (buffer_logline.find(LOGMATCHDISCONNECT) != string::npos) {
					banMatch = kickMatch = false;

					NicknameStartPos = 79 + virtualServerLength;
					IDStartPos = 5 + buffer_logline.rfind("'(id:");

					if (buffer_logline.rfind(") reason 'reasonmsg") == string::npos) {
						IDEndPos = buffer_logline.rfind(") reason 'invokerid=");
						if (buffer_logline.rfind(" bantime=") == string::npos) {
							kickMatch = true;
						}
						else banMatch = true;
					}
					else IDEndPos = buffer_logline.rfind(") reason 'reasonmsg");

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
					if (ClientList.size() < ID + 1) {
						ClientList.resize(ID + 1);
						ClientList[ID].addID(ID);
					}

					if (ClientList[ID].getNicknameCount() == 0 || ClientList[ID].getUniqueNickname(0) != Nickname) {
						ClientList[ID].addNickname(Nickname);
					}

					if (i + 1 == Logs.size()) {
						ClientList[ID].disconnect();
					}

					// Bans
					if (banMatch) {
						bannedUID.clear();
						bannedIP.clear();
						bannedByNickname.clear();
						bannedByID.clear();
						bannedByUID.clear();
						banReason.clear();
						bantime.clear();

						bannedByNicknameStartPos = buffer_logline.find(" invokername=", IDEndPos) + 13;

						if (buffer_logline.find("invokeruid=") != string::npos) {
							bannedByNicknameEndPos = buffer_logline.find(" invokeruid=", bannedByNicknameStartPos);
						}
						else bannedByNicknameEndPos = bannedByUIDEndPos = buffer_logline.find(" reasonmsg");

						bannedByUIDEndPos = buffer_logline.find(" reasonmsg", bannedByNicknameEndPos);

						if (buffer_logline.find("reasonmsg=") != string::npos) {
							banReasonEndPos = buffer_logline.find(" bantime=", bannedByUIDEndPos);
						}
						else banReasonEndPos = bannedByUIDEndPos + 10;

						for (unsigned j = bannedByNicknameStartPos; j < bannedByNicknameEndPos; j++) {
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

						if (lastUIDBanRule.size() != 0 && lastIPBanRule.size() != 0) {
							if (isMatchingBanRules(bannedByNickname, banReason, bantime, lastUIDBanRule, lastIPBanRule)) {
								bannedUIDStartPos = 9 + lastUIDBanRule.find("' cluid='");
								bannedUIDEndPos = lastUIDBanRule.rfind("' bantime=");
								bannedIPStartPos = 6 + lastIPBanRule.find("' ip='");
								bannedIPEndPos = lastIPBanRule.rfind("' bantime=");
								bannedByIDStartPos = 5 + lastIPBanRule.rfind("'(id:");

								for (unsigned j = bannedUIDStartPos; j < bannedUIDEndPos; j++) {
									bannedUID += lastUIDBanRule[j];
								}

								for (unsigned j = bannedIPStartPos; j < bannedIPEndPos; j++) {
									bannedIP += lastIPBanRule[j];
								}

								for (unsigned int j = bannedByIDStartPos; j < lastIPBanRule.size() - 1; j++) {
									bannedByID += lastIPBanRule[j];
								}
							}
							else {
								bannedUID = bannedIP = "Unknown";
								bannedByID = "0";
							}
						}

						if (!isDuplicateBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, stoul(bannedByID), bannedByUID, banReason, stoul(bantime))) {
							BanList.resize(BanListID + 1);
							BanList[BanListID].addBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, stoul(bannedByID), bannedByUID, banReason, stoul(bantime));
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

						if (!isDuplicateKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason)) {
							KickList.resize(KickListID + 1);
							KickList[KickListID].addKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason);
							KickListID++;
						}
					}
				}

				// Ban Rules
				// Currently only used for rules of 'direct' (= right click on client and "ban client") bans.
				else if (buffer_logline.find(LOGMATCHBANRULE) != string::npos) {
					if (buffer_logline.find("' cluid='") != string::npos && buffer_logline.find("' ip='") == string::npos) {
						lastUIDBanRule = buffer_logline;
					}
					else if (buffer_logline.find("' ip='") != string::npos && buffer_logline.find("' cluid='") == string::npos) {
						lastIPBanRule = buffer_logline;
					}
				}

				// Complaints
				else if (buffer_logline.find(LOGMATCHCOMPLAINT) != string::npos) {
					complaintDateTime.clear();
					complaintAboutNickname.clear();
					complaintAboutID.clear();
					complaintReason.clear();
					complaintByNickname.clear();
					complaintByID.clear();

					complaintAboutNicknameEndPos = buffer_logline.find("'(id:");
					complaintAboutIDEndPos = buffer_logline.find(") reason '");
					complaintByNicknameStartPos = 13 + buffer_logline.rfind("' by client '");
					complaintByIDStartPos = 5 + buffer_logline.rfind("'(id:");

					for (unsigned int j = 0; j < 19; j++) {
						complaintDateTime += buffer_logline[j];
					}

					for (unsigned int j = 83 + virtualServerLength; j < complaintAboutNicknameEndPos; j++) {
						complaintAboutNickname += buffer_logline[j];
					}

					for (unsigned int j = complaintAboutNicknameEndPos + 5; j < complaintAboutIDEndPos; j++) {
						complaintAboutID += buffer_logline[j];
					}

					for (unsigned int j = complaintAboutIDEndPos + 10; j < complaintByNicknameStartPos - 13; j++) {
						complaintReason += buffer_logline[j];
					}

					for (unsigned int j = complaintByNicknameStartPos; j < complaintByIDStartPos - 5; j++) {
						complaintByNickname += buffer_logline[j];
					}

					for (unsigned int j = complaintByIDStartPos; j < buffer_logline.size() - 1; j++) {
						complaintByID += buffer_logline[j];
					}

					if (!isDuplicateComplaint(complaintDateTime, complaintAboutNickname, stoul(complaintAboutID), complaintReason, complaintByNickname, stoul(complaintByID))) {
						ComplaintList.resize(ComplaintListID + 1);
						ComplaintList[ComplaintListID].addComplaint(complaintDateTime, complaintAboutNickname, stoul(complaintAboutID), complaintReason, complaintByNickname, stoul(complaintByID));
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

					channelIDEndPos = buffer_logline.find(")");
					filenameEndPos = buffer_logline.rfind("' by client '");
					uploadedByIDStartPos = 5 + buffer_logline.rfind("'(id:");

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

					if (!isDuplicateUpload(uploadDateTime, stoul(channelID), filename, uploadedByNickname, stoul(uploadedByID))) {
						UploadList.resize(UploadListID + 1);
						UploadList[UploadListID].addUpload(uploadDateTime, stoul(channelID), filename, uploadedByNickname, stoul(uploadedByID));
						UploadListID++;
					}
				}

				// Client Deletions
				else if (buffer_logline.find(LOGMATCHDELETEUSER1) != string::npos) {
					if (buffer_logline.find(LOGMATCHDELETEUSER2) != string::npos) {
						IDEndPos = buffer_logline.rfind(") got deleted by client '");
						IDStartPos = 5 + buffer_logline.rfind("'(id:", IDEndPos);
						IDLength = IDEndPos - IDStartPos;

						// ID
						for (unsigned int j = 0; j < IDLength; j++) {
							ID_string += buffer_logline[IDStartPos + j];
						}

						ID = stoul(ID_string);
						ClientList[ID].deleteClient();
					}
				}

				currentPos += buffer_logline.size() + 1;
				logfile.seekg(currentPos);
			}
			logfile.close();
			if (!isDuplicateLog(Logs[i])) {
				parsedLogs.emplace_back(Logs[i]);
			}
		}
	}
}
