// parseLogs.cpp : Parsing of the logs.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <fstream>
#include <vector>
#include <string>
#include <boost/filesystem.hpp>
#include "Client.h"
#include "ServerGroup.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "Upload.h"
#include "checkFunctions.h"
#include "customStreams.h"

extern std::vector <std::string> Logs, parsedLogs;
extern std::vector <Client> ClientList;
extern std::vector <ServerGroup> ServerGroupList;
extern std::vector <Ban> BanList;
extern std::vector <Kick> KickList;
extern std::vector <Complaint> ComplaintList;
extern std::vector <Upload> UploadList;
extern bool validXML;
extern unsigned int VIRTUALSERVER;
extern TeeStream outputStream;

#define match_banRule				"|INFO    |VirtualServer |  " + std::to_string(VIRTUALSERVER) + "| ban added reason='"
#define match_complaint				"|INFO    |VirtualServer |  " + std::to_string(VIRTUALSERVER) + "| complaint added for client '"
#define match_connect				"|INFO    |VirtualServerBase|  " + std::to_string(VIRTUALSERVER) + "| client connected '"
#define match_disconnect			"|INFO    |VirtualServerBase|  " + std::to_string(VIRTUALSERVER) + "| client disconnected '"
#define match_serverGroupEvent		"|INFO    |VirtualServer |  " + std::to_string(VIRTUALSERVER) + "| servergroup '"
#define match_serverGroupAssignment	") was added to servergroup '"
#define match_serverGroupRemoval	") was removed from servergroup '"
#define match_deleteUser1			"|INFO    |VirtualServer |  " + std::to_string(VIRTUALSERVER) + "| client '"
#define match_deleteUser2			") got deleted by client '"
#define match_upload				"|INFO    |VirtualServer |  " + std::to_string(VIRTUALSERVER) + "| file upload to"
#define match_uploadDeletion		"|INFO    |VirtualServer |  " + std::to_string(VIRTUALSERVER) + "| file deleted from"

// Parses the logs and stores the data in the ClientList.
void parseLogs(std::string LOGDIRECTORY) {
	std::string buffer_logline, LogFilePath, DateTime, Nickname, IP,
		ServerGroupName,
		lastUIDBanRule, lastIPBanRule, bannedUID, bannedIP, bannedByID, bannedByNickname, bannedByUID, banReason, bantime,
		kickedByNickname, kickedByUID, kickReason,
		complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID,
		channelID, filename, uploadedByNickname, uploadedByID,
		deletedByNickname, deletedByID;
	unsigned int BanListID, KickListID, ComplaintListID, UploadListID, ID, virtualServerLength = std::to_string(VIRTUALSERVER).size(),
		ID_StartPos, ID_EndPos, Nickname_StartPos, IP_StartPos, ID_Length, Nickname_Length, IP_Length,
		ServerGroupName_StartPos, ServerGroupName_EndPos, ServerGroupName_Length,
		bannedByNickname_StartPos, bannedByNickname_EndPos, bannedByUID_StartPos, bannedByUID_EndPos, banReason_StartPos, banReason_EndPos, bannedIP_StartPos, bannedUID_StartPos, bannedByID_StartPos,
		bantime_StartPos, bantime_EndPos, bannedByNickname_Length, bannedByUID_Length, banReason_Length, bantime_Length, bannedUID_Length, bannedIP_Length, bannedByID_Length,
		kickReason_StartPos, kickedByNickname_StartPos, kickedByNickname_EndPos, kickedByUID_StartPos, kickedByUID_EndPos, kickReason_Length, kickedByNickname_Length, kickedByUID_Length,
		complaintAboutNickname_StartPos, complaintAboutNickname_EndPos, complaintAboutID_StartPos, complaintReason_StartPos, complaintReason_EndPos, complaintAboutID_EndPos,
		complaintByNickname_StartPos, complaintByNickname_EndPos, complaintByID_StartPos, complaintByID_EndPos,
		complaintAboutNickname_Length, complaintAboutID_Length, complaintReason_Length, complaintByNickname_Length, complaintByID_Length,
		channelID_StartPos, channelID_EndPos, filename_StartPos, filename_EndPos, uploadedByNickname_StartPos, uploadedByNickname_EndPos, uploadedByID_StartPos, uploadedByID_EndPos,
		channelID_Length, filename_Length, uploadedByNickname_Length, uploadedByID_Length, deletedByNickname_StartPos, deletedByNickname_EndPos, deletedByID_StartPos, deletedByID_EndPos,
		deletedByNickname_Length, deletedByID_Length;
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
			outputStream << "Comparing new and old logs..." << std::endl;
			for (unsigned int i = 0; i < parsedLogs.size(); i++) {
				for (unsigned int j = 0; j < Logs.size() - 1; j++) {
					if (Logs[j] == parsedLogs[i]) {
						Logs[j].erase();
					}
				}
			}
		}
		else {
			outputStream << "Logs parsed for the last XML were deleted or the log order changed - skipping use of old XML..." << std::endl;
			parsedLogs.clear();
		}
	}

	outputStream << "Parsing new logs..." << std::endl;
	for (unsigned int i = 0; i < Logs.size(); i++) {
		if (!Logs[i].empty()) {
			LogFilePath = LOGDIRECTORY + Logs.at(i);

			std::ifstream logfile(LogFilePath);

			logfile.seekg(0, logfile.end);
			logfileLength = (unsigned long)logfile.tellg();
			logfile.seekg(0, logfile.beg);

			for (unsigned long currentPos = 0; currentPos < logfileLength;) {
				getline(logfile, buffer_logline);

				// Connects
				if (buffer_logline.find(match_connect) != std::string::npos) {
					IP_StartPos = buffer_logline.rfind(" ") + 1;
					Nickname_StartPos = virtualServerLength + 76;
					ID_StartPos = buffer_logline.rfind("'(id:") + 5;
					ID_Length = IP_StartPos - ID_StartPos - 7;
					Nickname_Length = ID_StartPos - Nickname_StartPos - 5;
					IP_Length = buffer_logline.size() - IP_StartPos - 6; // - 6 for ignoring the port.

					DateTime = buffer_logline.substr(0, 19);
					Nickname = buffer_logline.substr(Nickname_StartPos, Nickname_Length);
					ID = std::stoul(buffer_logline.substr(ID_StartPos, ID_Length));
					IP = buffer_logline.substr(IP_StartPos, IP_Length);

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
				else if (buffer_logline.find(match_disconnect) != std::string::npos) {
					banMatch = kickMatch = false;

					Nickname_StartPos = virtualServerLength + 79;
					ID_StartPos = buffer_logline.rfind("'(id:") + 5;

					if (buffer_logline.rfind(") reason 'reasonmsg") == std::string::npos) {
						ID_EndPos = buffer_logline.rfind(") reason 'invokerid=");
						if (buffer_logline.rfind(" bantime=") == std::string::npos) {
							kickMatch = true;
						}
						else banMatch = true;
					}
					else ID_EndPos = buffer_logline.rfind(") reason 'reasonmsg");

					ID_Length = ID_EndPos - ID_StartPos;
					Nickname_Length = ID_StartPos - Nickname_StartPos - 5;

					DateTime = buffer_logline.substr(0, 19);
					Nickname = buffer_logline.substr(Nickname_StartPos, Nickname_Length);
					ID = std::stoul(buffer_logline.substr(ID_StartPos, ID_Length));

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
						bool validUID = true;
						bannedByNickname_StartPos = buffer_logline.find(" invokername=", ID_EndPos) + 13;

						if (buffer_logline.find("invokeruid=") != std::string::npos) {
							bannedByNickname_EndPos = buffer_logline.find(" invokeruid=", bannedByNickname_StartPos);
							bannedByUID_StartPos = bannedByNickname_EndPos + 12;
							bannedByUID_EndPos = buffer_logline.find(" reasonmsg", bannedByNickname_EndPos);
						}
						else {
							bannedByNickname_EndPos = bannedByUID_EndPos = buffer_logline.find(" reasonmsg");
							validUID = false;
						}

						banReason_StartPos = bannedByUID_EndPos + 11;
						if (buffer_logline.find("reasonmsg=") != std::string::npos) {
							banReason_EndPos = buffer_logline.find(" bantime=", bannedByUID_EndPos);
							bantime_StartPos = banReason_EndPos + 9;
						}
						else {
							banReason_EndPos = banReason_StartPos;
							bantime_StartPos = banReason_EndPos + 8;
						}

						bantime_EndPos = buffer_logline.size() - 1;

						bannedByNickname_Length = bannedByNickname_EndPos - bannedByNickname_StartPos;
						banReason_Length = banReason_EndPos - banReason_StartPos;
						bantime_Length = bantime_EndPos - bantime_StartPos;

						bannedByNickname = buffer_logline.substr(bannedByNickname_StartPos, bannedByNickname_Length);
						banReason = buffer_logline.substr(banReason_StartPos, banReason_Length);
						bantime = buffer_logline.substr(bantime_StartPos, bantime_Length);

						if (validUID) {
							bannedByUID_Length = bannedByUID_EndPos - bannedByUID_StartPos;
							bannedByUID = buffer_logline.substr(bannedByUID_StartPos, bannedByUID_Length);
						}
						else bannedByUID = "No UID";

						if (lastUIDBanRule.size() != 0 && lastIPBanRule.size() != 0) {
							if (isMatchingBanRules(bannedByNickname, banReason, bantime, lastUIDBanRule, lastIPBanRule)) {
								bannedUID_StartPos = lastUIDBanRule.find("' cluid='") + 9;
								bannedUID_Length = lastUIDBanRule.rfind("' bantime=") - bannedUID_StartPos;
								bannedIP_StartPos = lastIPBanRule.find("' ip='") + 6;
								bannedIP_Length = lastIPBanRule.rfind("' bantime=") - bannedIP_StartPos;
								bannedByID_StartPos = lastIPBanRule.rfind("'(id:") + 5;
								bannedByID_Length = lastIPBanRule.size() - bannedByID_StartPos - 1;

								bannedUID = lastUIDBanRule.substr(bannedUID_StartPos, bannedUID_Length);
								bannedIP = lastIPBanRule.substr(bannedIP_StartPos, bannedIP_Length);
								bannedByID = lastIPBanRule.substr(bannedByID_StartPos, bannedByID_Length);
							}
							else {
								bannedUID = bannedIP = "Unknown";
								bannedByID = "0";
							}
						}

						if (!isDuplicateBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, std::stoul(bannedByID), bannedByUID, banReason, std::stoul(bantime))) {
							BanList.resize(BanListID + 1);
							BanList[BanListID].addBan(DateTime, ID, Nickname, bannedUID, bannedIP, bannedByNickname, std::stoul(bannedByID), bannedByUID, banReason, std::stoul(bantime));
							BanListID++;
						}
					}

					// Kicks
					else if (kickMatch) {
						if (buffer_logline.rfind(" reasonmsg=") != std::string::npos) {
							kickReason_StartPos = buffer_logline.rfind(" reasonmsg=") + 11;
							kickReason_Length = buffer_logline.size() - kickReason_StartPos - 1;
							kickReason = buffer_logline.substr(kickReason_StartPos, kickReason_Length);
						}
						else kickReason = "";

						kickedByNickname_StartPos = buffer_logline.rfind(" invokername=") + 13;
						kickedByNickname_EndPos = buffer_logline.rfind(" invokeruid=");
						kickedByNickname_Length = kickedByNickname_EndPos - kickedByNickname_StartPos;
						kickedByUID_StartPos = kickedByNickname_EndPos + 12;
						if (buffer_logline.find("invokeruid=serveradmin") == std::string::npos) {
							kickedByUID_EndPos = buffer_logline.find("=", kickedByUID_StartPos) + 1;
						}
						else kickedByUID_EndPos = buffer_logline.find("reasonmsg") - 1;
						kickedByUID_Length = kickedByUID_EndPos - kickedByUID_StartPos;

						kickedByNickname = buffer_logline.substr(kickedByNickname_StartPos, kickedByNickname_Length);
						kickedByUID = buffer_logline.substr(kickedByUID_StartPos, kickedByUID_Length);

						if (!isDuplicateKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason)) {
							KickList.resize(KickListID + 1);
							KickList[KickListID].addKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason);
							KickListID++;
						}
					}
				}

				// Client assignments to and client removals from a server group
				else if (buffer_logline.find(match_serverGroupAssignment) != std::string::npos || buffer_logline.find(match_serverGroupRemoval) != std::string::npos) {
					ID_StartPos = buffer_logline.find("'(id:") + 5;
					ID_EndPos = buffer_logline.find(") was added to servergroup '") - 1;

					// Removal
					if (ID_EndPos > buffer_logline.length()) {
						ID_EndPos = buffer_logline.find(") was removed from servergroup '") - 1;
						ServerGroupName_StartPos = ID_EndPos + 33;
					}
					else ServerGroupName_StartPos = ID_EndPos + 29;

					ServerGroupName_EndPos = buffer_logline.rfind("'(id:", buffer_logline.rfind(") by client '"));
					ServerGroupName_Length = ServerGroupName_EndPos - ServerGroupName_StartPos;

					ID_Length = ID_EndPos - ID_StartPos;

					DateTime = buffer_logline.substr(0, 19);
					ID = std::stoul(buffer_logline.substr(ID_StartPos, ID_Length));
					ServerGroupName = buffer_logline.substr(ServerGroupName_StartPos, ServerGroupName_Length);

					unsigned int clientID = std::stoul(buffer_logline.substr(67, buffer_logline.find(") was ") - 67));

					if (ServerGroupList.size() < ID + 1) {
						ServerGroupList.resize(ID + 1);
					}

					if (ServerGroupList[ID].getID() == 0) {
						ServerGroupList[ID].addServerGroupInformation(ID, ServerGroupName, "Unknown");
					}

					// Todo: Add client to list if not already existing?
					// Currently only reserving the vector buffer to prevent out of bounds exception.
					if (ClientList.size() < clientID + 1)
						ClientList.resize(clientID + 1);

					if (buffer_logline.find(match_serverGroupAssignment) != std::string::npos) {
						if (!isDuplicateServerGroup(clientID, ID))
							ClientList[clientID].addServerGroup(ID, DateTime);
					}
					// extra check, may be removed later
					else if (isDuplicateServerGroup(clientID, ID)) {
						ClientList[clientID].removeServerGroupByID(ID);
					}
				}

				// Ban Rules
				// Currently only used for rules of 'direct' (= right click on client and "ban client") bans.
				else if (buffer_logline.find(match_banRule) != std::string::npos) {
					if (buffer_logline.find("' cluid='") != std::string::npos && buffer_logline.find("' ip='") == std::string::npos) {
						lastUIDBanRule = buffer_logline;
					}
					else if (buffer_logline.find("' ip='") != std::string::npos && buffer_logline.find("' cluid='") == std::string::npos) {
						lastIPBanRule = buffer_logline;
					}
				}

				// Complaints
				else if (buffer_logline.find(match_complaint) != std::string::npos) {
					complaintAboutNickname_StartPos = virtualServerLength + 83;
					complaintAboutNickname_EndPos = buffer_logline.find("'(id:");
					complaintAboutID_StartPos = complaintAboutNickname_EndPos + 5;
					complaintAboutID_EndPos = buffer_logline.find(") reason '");
					complaintReason_StartPos = complaintAboutID_EndPos + 10;
					complaintReason_EndPos = buffer_logline.rfind("' by client '");
					complaintByNickname_StartPos = complaintReason_EndPos + 13;
					complaintByNickname_EndPos = buffer_logline.rfind("'(id:");
					complaintByID_StartPos = complaintByNickname_EndPos + 5;
					complaintByID_EndPos = buffer_logline.size() - 1;

					complaintAboutNickname_Length = complaintAboutNickname_EndPos - complaintAboutNickname_StartPos;
					complaintAboutID_Length = complaintAboutID_EndPos - complaintAboutID_StartPos;
					complaintReason_Length = complaintReason_EndPos - complaintReason_StartPos;
					complaintByNickname_Length = complaintByNickname_EndPos - complaintByNickname_StartPos;
					complaintByID_Length = complaintByID_EndPos - complaintByID_StartPos;

					DateTime = buffer_logline.substr(0, 19);
					complaintAboutNickname = buffer_logline.substr(complaintAboutNickname_StartPos, complaintAboutNickname_Length);
					complaintAboutID = buffer_logline.substr(complaintAboutID_StartPos, complaintAboutID_Length);
					complaintReason = buffer_logline.substr(complaintReason_StartPos, complaintReason_Length);
					complaintByNickname = buffer_logline.substr(complaintByNickname_StartPos, complaintByNickname_Length);
					complaintByID = buffer_logline.substr(complaintByID_StartPos, complaintByID_Length);

					if (!isDuplicateComplaint(DateTime, complaintAboutNickname, std::stoul(complaintAboutID), complaintReason, complaintByNickname, std::stoul(complaintByID))) {
						ComplaintList.resize(ComplaintListID + 1);
						ComplaintList[ComplaintListID].addComplaint(DateTime, complaintAboutNickname, std::stoul(complaintAboutID), complaintReason, complaintByNickname, std::stoul(complaintByID));
						ComplaintListID++;
					}
				}

				// Uploads
				else if (buffer_logline.find(match_upload) != std::string::npos) {
					channelID_StartPos = virtualServerLength + 74;
					channelID_EndPos = buffer_logline.find(")");
					filename_StartPos = channelID_EndPos + 4;
					filename_EndPos = buffer_logline.rfind("' by client '");
					uploadedByNickname_StartPos = filename_EndPos + 13;
					uploadedByNickname_EndPos = buffer_logline.rfind("'(id:");
					uploadedByID_StartPos = uploadedByNickname_EndPos + 5;
					uploadedByID_EndPos = buffer_logline.size() - 1;

					channelID_Length = channelID_EndPos - channelID_StartPos;
					filename_Length = filename_EndPos - filename_StartPos;
					uploadedByNickname_Length = uploadedByNickname_EndPos - uploadedByNickname_StartPos;
					uploadedByID_Length = uploadedByID_EndPos - uploadedByID_StartPos;

					DateTime = buffer_logline.substr(0, 19);
					channelID = buffer_logline.substr(channelID_StartPos, channelID_Length);
					filename = buffer_logline.substr(filename_StartPos, filename_Length);
					uploadedByNickname = buffer_logline.substr(uploadedByNickname_StartPos, uploadedByNickname_Length);
					uploadedByID = buffer_logline.substr(uploadedByID_StartPos, uploadedByID_Length);

					if (!isDuplicateUpload(DateTime, std::stoul(channelID), filename, uploadedByNickname, std::stoul(uploadedByID))) {
						UploadList.resize(UploadListID + 1);
						UploadList[UploadListID].addUpload(DateTime, std::stoul(channelID), filename, uploadedByNickname, std::stoul(uploadedByID));
						UploadListID++;
					}
				}

				// Client Deletions
				else if (buffer_logline.find(match_deleteUser1) != std::string::npos) {
					if (buffer_logline.find(match_deleteUser2) != std::string::npos) {
						ID_EndPos = buffer_logline.rfind(") got deleted by client '");
						ID_StartPos = buffer_logline.rfind("'(id:", ID_EndPos) + 5;
						ID_Length = ID_EndPos - ID_StartPos;
						ID = std::stoul(buffer_logline.substr(ID_StartPos, ID_Length));
						ClientList[ID].deleteClient();
					}
				}

				// Upload Deletions
				else if (buffer_logline.find(match_uploadDeletion) != std::string::npos) {
					channelID_StartPos = virtualServerLength + 77;
					channelID_EndPos = buffer_logline.find(")");
					filename_StartPos = channelID_EndPos + 4;
					filename_EndPos = buffer_logline.rfind("' by client '");
					deletedByNickname_StartPos = filename_EndPos + 13;
					deletedByNickname_EndPos = buffer_logline.rfind("'(id:");
					deletedByID_StartPos = deletedByNickname_EndPos + 5;
					deletedByID_EndPos = buffer_logline.size() - 1;

					channelID_Length = channelID_EndPos - channelID_StartPos;
					filename_Length = filename_EndPos - filename_StartPos;
					deletedByNickname_Length = deletedByNickname_EndPos - deletedByNickname_StartPos;
					deletedByID_Length = deletedByID_EndPos - deletedByID_StartPos;

					channelID = buffer_logline.substr(channelID_StartPos, channelID_Length);
					filename = buffer_logline.substr(filename_StartPos, filename_Length);
					deletedByNickname = buffer_logline.substr(deletedByNickname_StartPos, deletedByNickname_Length);
					deletedByID = buffer_logline.substr(deletedByID_StartPos, deletedByID_Length);

					addDeletedBy(std::stoul(channelID), filename, deletedByNickname, std::stoul(deletedByID));
				}

				// Servergroup additions, deletions, renamings and copying
				else if (buffer_logline.find(match_serverGroupEvent) != std::string::npos) {
					// 0 --> added
					// 1 --> deleted
					// 2 --> renamed
					// 3 --> copied // just like "added"
					int eventType = -1;

					ID_StartPos = buffer_logline.find("'(id:") + 5;

					if (buffer_logline.find(") was added by '") != std::string::npos) {
						ID_EndPos = buffer_logline.find(") was added by '");
						eventType = 0;
					}
					else if (buffer_logline.find(") was deleted by '") != std::string::npos) {
						ID_EndPos = buffer_logline.find(") was deleted by '");
						eventType = 1;
					}
					else if (buffer_logline.find(") was renamed to '") != std::string::npos) {
						ID_EndPos = buffer_logline.find(") was renamed to '");
						ServerGroupName_StartPos = buffer_logline.find(") was renamed to '") + 18;
						ServerGroupName_EndPos = buffer_logline.rfind("' by '", buffer_logline.length() - 1);
						ServerGroupName_Length = ServerGroupName_EndPos - ServerGroupName_StartPos;
						eventType = 2;
					}
					else if (buffer_logline.find(") was copied by '") != std::string::npos) {
						ID_StartPos = buffer_logline.rfind("'(id:") + 5;
						ID_EndPos = buffer_logline.length() - 1;
						ServerGroupName_StartPos = buffer_logline.find(") to '") + 6;
						ServerGroupName_Length = ID_StartPos - 5 - ServerGroupName_StartPos;
						eventType = 3;
					}
					else outputStream << "this shouldn't happen (servergroup parsing)" << std::endl;

					if (eventType != -1) {
						if (eventType == 0 || eventType == 1) {
							ServerGroupName_StartPos = buffer_logline.find("| servergroup '") + 15;
							ServerGroupName_Length = ID_StartPos - 5 - ServerGroupName_StartPos;
						}

						ID_Length = ID_EndPos - ID_StartPos;

						DateTime = buffer_logline.substr(0, 19);
						ID = std::stoul(buffer_logline.substr(ID_StartPos, ID_Length));
						ServerGroupName = buffer_logline.substr(ServerGroupName_StartPos, ServerGroupName_Length);

						switch (eventType) {
						case 0:
						case 3:
							ServerGroupList.resize(ID + 1);
							ServerGroupList[ID].addServerGroupInformation(ID, ServerGroupName, DateTime);
							break;

						case 1:
							ServerGroupList[ID].deleteServerGroup();
							break;

						case 2:
							ServerGroupList[ID].renameServerGroup(ServerGroupName);
							break;
						}
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
