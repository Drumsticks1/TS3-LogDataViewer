// parseLogs.cpp : Parsing of the logs.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

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
#define LOGMATCHUPLOAD			"|INFO    |VirtualServer |  " + to_string(VIRTUALSERVER) + "| file upload to"
#define LOGMATCHUPLOADDELETION	"|INFO    |VirtualServer |  " + to_string(VIRTUALSERVER) + "| file deleted from"

// Parses the logs and stores the data in the ClientList.
void parseLogs(string LOGDIRECTORY) {
	string buffer_logline, LogFilePath, DateTime, Nickname, IP,
		lastUIDBanRule, lastIPBanRule, bannedUID, bannedIP, bannedByID, bannedByNickname, bannedByUID, banReason, bantime,
		kickedByNickname, kickedByUID, kickReason,
		complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID,
		channelID, filename, uploadedByNickname, uploadedByID,
		deletedByNickname, deletedByID;
	unsigned int BanListID, KickListID, ComplaintListID, UploadListID, ID, virtualServerLength = to_string(VIRTUALSERVER).size(),
		IDStartPos, IDEndPos, NicknameStartPos, IPStartPos, IDLength, NicknameLength, IPLength,
		bannedByNicknameStartPos, bannedByNicknameEndPos, bannedByUIDStartPos, bannedByUIDEndPos, banReasonStartPos, banReasonEndPos, bannedIPStartPos, bannedUIDStartPos, bannedByIDStartPos,
		bantimeStartPos, bantimeEndPos, bannedByNicknameLength, bannedByUIDLength, banReasonLength, bantimeLength, bannedUIDLength, bannedIPLength, bannedByIDLength,
		kickReasonStartPos, kickedByNicknameStartPos, kickedByNicknameEndPos, kickedByUIDStartPos, kickedByUIDEndPos, kickReasonLength, kickedByNicknameLength, kickedByUIDLength,
		complaintAboutNicknameStartPos, complaintAboutNicknameEndPos, complaintAboutIDStartPos, complaintReasonStartPos, complaintReasonEndPos, complaintAboutIDEndPos,
		complaintByNicknameStartPos, complaintByNicknameEndPos, complaintByIDStartPos, complaintByIDEndPos,
		complaintAboutNicknameLength, complaintAboutIDLength, complaintReasonLength, complaintByNicknameLength, complaintByIDLength,
		channelIDStartPos, channelIDEndPos, filenameStartPos, filenameEndPos, uploadedByNicknameStartPos, uploadedByNicknameEndPos, uploadedByIDStartPos, uploadedByIDEndPos,
		channelIDLength, filenameLength, uploadedByNicknameLength, uploadedByIDLength, deletedByNicknameStartPos, deletedByNicknameEndPos, deletedByIDStartPos, deletedByIDEndPos,
		deletedByNicknameLength, deletedByIDLength;
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

				// Connects
				if (buffer_logline.find(LOGMATCHCONNECT) != string::npos) {
					IPStartPos = buffer_logline.rfind(" ") + 1;
					NicknameStartPos = virtualServerLength + 76;
					IDStartPos = buffer_logline.rfind("'(id:") + 5;
					IDLength = IPStartPos - IDStartPos - 7;
					NicknameLength = IDStartPos - NicknameStartPos - 5;
					IPLength = buffer_logline.size() - IPStartPos - 6; // - 6 for ignoring the port.

					DateTime = buffer_logline.substr(0, 19);
					Nickname = buffer_logline.substr(NicknameStartPos, NicknameLength);
					ID = stoul(buffer_logline.substr(IDStartPos, IDLength));
					IP = buffer_logline.substr(IPStartPos, IPLength);

					if (ClientList.size() < ID + 1) ClientList.resize(ID + 1);
					if (ClientList[ID].getID() != ID) ClientList[ID].addID(ID);

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

					NicknameStartPos = virtualServerLength + 79;
					IDStartPos = buffer_logline.rfind("'(id:") + 5;

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

					DateTime = buffer_logline.substr(0, 19);
					Nickname = buffer_logline.substr(NicknameStartPos, NicknameLength);
					ID = stoul(buffer_logline.substr(IDStartPos, IDLength));

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
						bannedByNicknameStartPos = buffer_logline.find(" invokername=", IDEndPos) + 13;

						if (buffer_logline.find("invokeruid=") != string::npos) {
							bannedByNicknameEndPos = buffer_logline.find(" invokeruid=", bannedByNicknameStartPos);
						}
						else bannedByNicknameEndPos = bannedByUIDEndPos = buffer_logline.find(" reasonmsg");

						bannedByUIDStartPos = bannedByNicknameEndPos + 12;
						bannedByUIDEndPos = buffer_logline.find(" reasonmsg", bannedByNicknameEndPos);

						banReasonStartPos = bannedByUIDEndPos + 11;
						if (buffer_logline.find("reasonmsg=") != string::npos) {
							banReasonEndPos = buffer_logline.find(" bantime=", bannedByUIDEndPos);
							bantimeStartPos = banReasonEndPos + 9;
						}
						else {
							banReasonEndPos = banReasonStartPos; 
							bantimeStartPos = banReasonEndPos + 8;
						}

						bantimeEndPos = buffer_logline.size() - 1;

						bannedByNicknameLength = bannedByNicknameEndPos - bannedByNicknameStartPos;
						bannedByUIDLength = bannedByUIDEndPos - bannedByUIDStartPos;
						banReasonLength = banReasonEndPos - banReasonStartPos;
						bantimeLength = bantimeEndPos - bantimeStartPos;

						bannedByNickname = buffer_logline.substr(bannedByNicknameStartPos, bannedByNicknameLength);
						bannedByUID = buffer_logline.substr(bannedByUIDStartPos, bannedByUIDLength);
						banReason = buffer_logline.substr(banReasonStartPos, banReasonLength);
						bantime = buffer_logline.substr(bantimeStartPos, bantimeLength);

						if (lastUIDBanRule.size() != 0 && lastIPBanRule.size() != 0) {
							if (isMatchingBanRules(bannedByNickname, banReason, bantime, lastUIDBanRule, lastIPBanRule)) {
								bannedUIDStartPos = lastUIDBanRule.find("' cluid='") + 9;
								bannedUIDLength = lastUIDBanRule.rfind("' bantime=") - bannedUIDStartPos;
								bannedIPStartPos = lastIPBanRule.find("' ip='") + 6;
								bannedIPLength = lastIPBanRule.rfind("' bantime=") - bannedIPStartPos;
								bannedByIDStartPos = lastIPBanRule.rfind("'(id:") + 5;
								bannedByIDLength = lastIPBanRule.size() - bannedByIDStartPos - 1;

								bannedUID = lastUIDBanRule.substr(bannedUIDStartPos, bannedUIDLength);
								bannedIP = lastIPBanRule.substr(bannedIPStartPos, bannedIPLength);
								bannedByID = lastIPBanRule.substr(bannedByIDStartPos, bannedByIDLength);
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
						if (buffer_logline.rfind(" reasonmsg=") != string::npos) {
							kickReasonStartPos = buffer_logline.rfind(" reasonmsg=") + 11;
							kickReasonLength = buffer_logline.size() - kickReasonStartPos - 1;
							kickReason = buffer_logline.substr(kickReasonStartPos, kickReasonLength);
						}
						else kickReason = "";

						kickedByNicknameStartPos = buffer_logline.rfind(" invokername=") + 13;
						kickedByNicknameEndPos = buffer_logline.rfind(" invokeruid=");
						kickedByNicknameLength = kickedByNicknameEndPos - kickedByNicknameStartPos;
						kickedByUIDStartPos = kickedByNicknameEndPos + 12;
						if (buffer_logline.find("invokeruid=serveradmin") == string::npos) {
							kickedByUIDEndPos = buffer_logline.find("=", kickedByUIDStartPos) + 1;
						}
						else kickedByUIDEndPos = kickedByUIDStartPos + 35;
						kickedByUIDLength = kickedByUIDEndPos - kickedByUIDStartPos;

						kickedByNickname = buffer_logline.substr(kickedByNicknameStartPos, kickedByNicknameLength);
						kickedByUID = buffer_logline.substr(kickedByUIDStartPos, kickedByUIDLength);

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
					complaintAboutNicknameStartPos = virtualServerLength + 83;
					complaintAboutNicknameEndPos = buffer_logline.find("'(id:");
					complaintAboutIDStartPos = complaintAboutNicknameEndPos + 5;
					complaintAboutIDEndPos = buffer_logline.find(") reason '");
					complaintReasonStartPos = complaintAboutIDEndPos + 10;
					complaintReasonEndPos = buffer_logline.rfind("' by client '");
					complaintByNicknameStartPos = complaintReasonEndPos + 13;
					complaintByNicknameEndPos = buffer_logline.rfind("'(id:");
					complaintByIDStartPos = complaintByNicknameEndPos + 5;
					complaintByIDEndPos = buffer_logline.size() - 1;

					complaintAboutNicknameLength = complaintAboutNicknameEndPos - complaintAboutNicknameStartPos;
					complaintAboutIDLength = complaintAboutIDEndPos - complaintAboutIDStartPos;
					complaintReasonLength = complaintReasonEndPos - complaintReasonStartPos;
					complaintByNicknameLength = complaintByNicknameEndPos - complaintByNicknameStartPos;
					complaintByIDLength = complaintByIDEndPos - complaintByIDStartPos;

					DateTime = buffer_logline.substr(0, 19);
					complaintAboutNickname = buffer_logline.substr(complaintAboutNicknameStartPos, complaintAboutNicknameLength);
					complaintAboutID = buffer_logline.substr(complaintAboutIDStartPos, complaintAboutIDLength);
					complaintReason = buffer_logline.substr(complaintReasonStartPos, complaintReasonLength);
					complaintByNickname = buffer_logline.substr(complaintByNicknameStartPos, complaintByNicknameLength);
					complaintByID = buffer_logline.substr(complaintByIDStartPos, complaintByIDLength);

					if (!isDuplicateComplaint(DateTime, complaintAboutNickname, stoul(complaintAboutID), complaintReason, complaintByNickname, stoul(complaintByID))) {
						ComplaintList.resize(ComplaintListID + 1);
						ComplaintList[ComplaintListID].addComplaint(DateTime, complaintAboutNickname, stoul(complaintAboutID), complaintReason, complaintByNickname, stoul(complaintByID));
						ComplaintListID++;
					}
				}

				// Uploads
				else if (buffer_logline.find(LOGMATCHUPLOAD) != string::npos) {
					channelIDStartPos = virtualServerLength + 74;
					channelIDEndPos = buffer_logline.find(")");
					filenameStartPos = channelIDEndPos + 4;
					filenameEndPos = buffer_logline.rfind("' by client '");
					uploadedByNicknameStartPos = filenameEndPos + 13;
					uploadedByNicknameEndPos = buffer_logline.rfind("'(id:");
					uploadedByIDStartPos = uploadedByNicknameEndPos + 5;
					uploadedByIDEndPos = buffer_logline.size() - 1;

					channelIDLength = channelIDEndPos - channelIDStartPos;
					filenameLength = filenameEndPos - filenameStartPos;
					uploadedByNicknameLength = uploadedByNicknameEndPos - uploadedByNicknameStartPos;
					uploadedByIDLength = uploadedByIDEndPos - uploadedByIDStartPos;

					DateTime = buffer_logline.substr(0, 19);
					channelID = buffer_logline.substr(channelIDStartPos, channelIDLength);
					filename = buffer_logline.substr(filenameStartPos, filenameLength);
					uploadedByNickname = buffer_logline.substr(uploadedByNicknameStartPos, uploadedByNicknameLength);
					uploadedByID = buffer_logline.substr(uploadedByIDStartPos, uploadedByIDLength);

					if (!isDuplicateUpload(DateTime, stoul(channelID), filename, uploadedByNickname, stoul(uploadedByID))) {
						UploadList.resize(UploadListID + 1);
						UploadList[UploadListID].addUpload(DateTime, stoul(channelID), filename, uploadedByNickname, stoul(uploadedByID));
						UploadListID++;
					}
				}

				// Client Deletions
				else if (buffer_logline.find(LOGMATCHDELETEUSER1) != string::npos) {
					if (buffer_logline.find(LOGMATCHDELETEUSER2) != string::npos) {
						IDEndPos = buffer_logline.rfind(") got deleted by client '");
						IDStartPos = buffer_logline.rfind("'(id:", IDEndPos) + 5;
						IDLength = IDEndPos - IDStartPos;
						ID = stoul(buffer_logline.substr(IDStartPos, IDLength));
						ClientList[ID].deleteClient();
					}
				}

				// Upload Deletions
				else if (buffer_logline.find(LOGMATCHUPLOADDELETION) != string::npos) {
					channelIDStartPos = virtualServerLength + 77;
					channelIDEndPos = buffer_logline.find(")");
					filenameStartPos = channelIDEndPos + 4;
					filenameEndPos = buffer_logline.rfind("' by client '");
					deletedByNicknameStartPos = filenameEndPos + 13;
					deletedByNicknameEndPos = buffer_logline.rfind("'(id:");
					deletedByIDStartPos = deletedByNicknameEndPos + 5;
					deletedByIDEndPos = buffer_logline.size() - 1;

					channelIDLength = channelIDEndPos - channelIDStartPos;
					filenameLength = filenameEndPos - filenameStartPos;
					deletedByNicknameLength = deletedByNicknameEndPos - deletedByNicknameStartPos;
					deletedByIDLength = deletedByIDEndPos - deletedByIDStartPos;

					channelID = buffer_logline.substr(channelIDStartPos, channelIDLength);
					filename = buffer_logline.substr(filenameStartPos, filenameLength);
					deletedByNickname = buffer_logline.substr(deletedByNicknameStartPos, deletedByNicknameLength);
					deletedByID = buffer_logline.substr(deletedByIDStartPos, deletedByIDLength);

					addDeletedBy(stoul(channelID), filename, deletedByNickname, stoul(deletedByID));
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
