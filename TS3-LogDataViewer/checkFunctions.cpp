// checkFunctions.cpp : Control Functions.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <vector>
#include <string>
#include "ServerGroup.h"
#include "Client.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "Upload.h"

extern std::vector <std::string> Logs;
extern std::vector <std::string> parsedLogs;
extern std::vector <std::string> ignoreLogs;
extern std::vector <ServerGroup> ServerGroupList;
extern std::vector <Client> ClientList;
extern std::vector <Ban> BanList;
extern std::vector <Kick> KickList;
extern std::vector <Complaint> ComplaintList;
extern std::vector <Upload> UploadList;

// Checks if a MemberID is already existing in the current ServerGroup.
bool isDuplicateMemberID(unsigned int ID, unsigned int MemberID) {
	for (unsigned int i = 0; i < ServerGroupList[ID].getMemberIDCount(); i++) {
		if (ServerGroupList[ID].getUniqueMemberID(i) == MemberID) {
			return true;
		}
	}
	return false;
}

// Checks if a DateTime is already existing for the current client.
bool isDuplicateDateTime(unsigned int ID, std::string DateTime) {
	for (unsigned int i = 0; i < ClientList[ID].getDateTimeCount(); i++) {
		if (ClientList[ID].getUniqueDateTime(i) == DateTime) {
			return true;
		}
	}
	return false;
}

// Checks if a log is already existing in the parsedLogs list.
bool isDuplicateLog(std::string log) {
	for (unsigned int i = 0; i < parsedLogs.size(); i++) {
		if (log == parsedLogs[i]) return true;
	}
	return false;
}

// Checks if a log is existing in the ignoreLogs list.
bool isIgnoredLog(std::string log) {
	for (unsigned int i = 0; i < ignoreLogs.size(); i++) {
		if (log == ignoreLogs[i]) return true;
	}
	return false;
}

// Checks if the order of Logs and ParsedLogs is matching.
bool isMatchingLogOrder() {
	for (unsigned int i = 0; i < parsedLogs.size(); i++) {
		if (i < Logs.size()) {
			if (parsedLogs[i] != Logs[i]) {
				return false;
			}
		}
		else return false;
	}
	return true;
}

// Checks if the two ban rules are matching with a ban disconnect.
bool isMatchingBanRules(std::string bannedByNickname, std::string banReason, std::string bantime, std::string lastUIDBanRule, std::string lastIPBanRule) {
	std::string UID = lastUIDBanRule, IP = lastIPBanRule;
	if (bannedByNickname == "Server") {
		bannedByNickname = "server";
	}

	if (UID.find(" by client '" + bannedByNickname + "'(") != std::string::npos && IP.find(" by client '" + bannedByNickname + "'(") != std::string::npos) {
		if (UID.find("| ban added reason='" + banReason + "' cluid='") != std::string::npos && IP.find("| ban added reason='" + banReason + "' ip='") != std::string::npos) {
			if (UID.find("bantime=" + bantime + " ") != std::string::npos && IP.find("bantime=" + bantime + " ") != std::string::npos) {
				return true;
			}
		}
	}
	return false;
}

// Checks if a ban is already existing in the BanList.
bool isDuplicateBan(std::string banDateTime, unsigned int bannedID, std::string bannedNickname, std::string bannedUID, std::string bannedIP, std::string bannedByNickname, unsigned int bannedByID, std::string bannedByUID, std::string banReason, unsigned int bantime) {
	for (unsigned int i = 0; i < BanList.size(); i++) {
		if (BanList[i].getBanDateTime() == banDateTime && BanList[i].getBannedID() == bannedID && BanList[i].getBannedNickname() == bannedNickname &&
			BanList[i].getBannedUID() == bannedUID && BanList[i].getBannedIP() == bannedIP && BanList[i].getBannedByID() == bannedByID &&
			BanList[i].getBannedByNickname() == bannedByNickname && BanList[i].getBannedByUID() == bannedByUID && BanList[i].getBanReason() == banReason &&
			BanList[i].getBantime() == bantime) return true;
	}
	return false;
}

// Checks if a kick is already existing in the KickList.
bool isDuplicateKick(std::string kickDateTime, unsigned int kickedID, std::string kickedNickname, std::string kickedByNickname, std::string kickedByUID, std::string kickReason) {
	for (unsigned int i = 0; i < KickList.size(); i++) {
		if (KickList[i].getKickDateTime() == kickDateTime && KickList[i].getKickedID() == kickedID && KickList[i].getKickedNickname() == kickedNickname &&
			KickList[i].getKickedByNickname() == kickedByNickname && KickList[i].getKickedByUID() == kickedByUID && KickList[i].getKickReason() == kickReason) return true;
	}
	return false;
}

// Checks if a complaint is already existing in the ComplaintList
bool isDuplicateComplaint(std::string complaintDateTime, std::string complaintAboutNickname, unsigned int complaintAboutID, std::string complaintReason, std::string complaintByNickname, unsigned int complaintByID) {
	for (unsigned int i = 0; i < ComplaintList.size(); i++) {
		if (ComplaintList[i].getComplaintDateTime() == complaintDateTime && ComplaintList[i].getComplaintAboutNickname() == complaintAboutNickname &&
			ComplaintList[i].getComplaintAboutID() == complaintAboutID && ComplaintList[i].getComplaintReason() == complaintReason &&
			ComplaintList[i].getComplaintByNickname() == complaintByNickname && ComplaintList[i].getComplaintByID() == complaintByID) return true;
	}
	return false;
}

// Checks if an upload is already existing in the UploadList.
bool isDuplicateUpload(std::string uploadDateTime, unsigned int channelID, std::string filename, std::string uploadedByNickname, unsigned int uploadedByID) {
	for (unsigned int i = 0; i < UploadList.size(); i++) {
		if (UploadList[i].getUploadDateTime() == uploadDateTime && UploadList[i].getChannelID() == channelID && UploadList[i].getFilename() == filename &&
			UploadList[i].getUploadedByNickname() == uploadedByNickname && UploadList[i].getUploadedByID() == uploadedByID) return true;
	}
	return false;
}
