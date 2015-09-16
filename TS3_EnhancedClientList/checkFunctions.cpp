// checkFunctions.cpp : Control Functions.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <vector>
#include "Client.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "Upload.h"

using namespace std;

extern vector <string> Logs;
extern vector <string> parsedLogs;
extern vector <string> ignoreLogs;
extern vector <Client> ClientList;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <Complaint> ComplaintList;
extern vector <Upload> UploadList;

// Checks if a DateTime is already existing for the current client.
bool isDuplicateDateTime(unsigned int ID, string DateTime) {
	for (unsigned int i = 0; i < ClientList[ID].getDateTimeCount(); i++) {
		if (ClientList[ID].getUniqueDateTime(i) == DateTime) {
			return true;
		}
	}
	return false;
}

// Checks if a log is already existing in the parsedLogs list.
bool isDuplicateLog(string log) {
	for (unsigned int i = 0; i < parsedLogs.size(); i++) {
		if (log == parsedLogs[i]) return true;
	}
	return false;
}

// Checks if a log is existing in the ignoreLogs list.
bool isIgnoredLog(string log) {
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
bool isMatchingBanRules(string bannedByNickname, string banReason, string bantime, string lastUIDBanRule, string lastIPBanRule) {
	string UID = lastUIDBanRule, IP = lastIPBanRule;
	if (bannedByNickname == "Server") {
		bannedByNickname = "server";
	}

	if (UID.find(" by client '" + bannedByNickname + "'(") != string::npos && IP.find(" by client '" + bannedByNickname + "'(") != string::npos) {
		if (UID.find("| ban added reason='" + banReason + "' cluid='") != string::npos && IP.find("| ban added reason='" + banReason + "' ip='") != string::npos) {
			if (UID.find("bantime=" + bantime + " ") != string::npos && IP.find("bantime=" + bantime + " ") != string::npos) {
				return true;
			}
		}
	}
	return false;
}

// Checks if a ban is already existing in the BanList.
bool isDuplicateBan(string banDateTime, unsigned int bannedID, string bannedNickname, string bannedUID, string bannedIP, string bannedByNickname, unsigned int bannedByID, string bannedByUID, string banReason, unsigned int bantime) {
	for (unsigned int i = 0; i < BanList.size(); i++) {
		if (BanList[i].getBanDateTime() == banDateTime && BanList[i].getBannedID() == bannedID && BanList[i].getBannedNickname() == bannedNickname &&
			BanList[i].getBannedUID() == bannedUID && BanList[i].getBannedIP() == bannedIP && BanList[i].getBannedByID() == bannedByID &&
			BanList[i].getBannedByNickname() == bannedByNickname && BanList[i].getBannedByUID() == bannedByUID && BanList[i].getBanReason() == banReason &&
			BanList[i].getBantime() == bantime) return true;
	}
	return false;
}

// Checks if a kick is already existing in the KickList.
bool isDuplicateKick(string kickDateTime, unsigned int kickedID, string kickedNickname, string kickedByNickname, string kickedByUID, string kickReason) {
	for (unsigned int i = 0; i < KickList.size(); i++) {
		if (KickList[i].getKickDateTime() == kickDateTime && KickList[i].getKickedID() == kickedID && KickList[i].getKickedNickname() == kickedNickname &&
			KickList[i].getKickedByNickname() == kickedByNickname && KickList[i].getKickedByUID() == kickedByUID && KickList[i].getKickReason() == kickReason) return true;
	}
	return false;
}

// Checks if a complaint is already existing in the ComplaintList
bool isDuplicateComplaint(string complaintDateTime, string complaintAboutNickname, unsigned int complaintAboutID, string complaintReason, string complaintByNickname, unsigned int complaintByID) {
	for (unsigned int i = 0; i < ComplaintList.size(); i++) {
		if (ComplaintList[i].getComplaintDateTime() == complaintDateTime && ComplaintList[i].getComplaintAboutNickname() == complaintAboutNickname &&
			ComplaintList[i].getComplaintAboutID() == complaintAboutID && ComplaintList[i].getComplaintReason() == complaintReason &&
			ComplaintList[i].getComplaintByNickname() == complaintByNickname && ComplaintList[i].getComplaintByID() == complaintByID) return true;
	}
	return false;
}

// Checks if an upload is already existing in the UploadList.
bool isDuplicateUpload(string uploadDateTime, unsigned int channelID, string filename, string uploadedByNickname, unsigned int uploadedByID) {
	for (unsigned int i = 0; i < UploadList.size(); i++) {
		if (UploadList[i].getUploadDateTime() == uploadDateTime && UploadList[i].getChannelID() == channelID && UploadList[i].getFilename() == filename &&
			UploadList[i].getUploadedByNickname() == uploadedByNickname && UploadList[i].getUploadedByID() == uploadedByID) return true;
	}
	return false;
}
