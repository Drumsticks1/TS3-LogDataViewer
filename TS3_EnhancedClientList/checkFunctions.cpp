// checkFunctions.cpp : Control Functions.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <vector>
#include "User.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "File.h"

using namespace std;

extern vector <string> Logs;
extern vector <string> parsedLogs;
extern vector <string> ignoreLogs;
extern vector <User> UserList;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <Complaint> ComplaintList;
extern vector <File> FileList;

// Checks if a DateTime is already existing for the current user.
bool IsDuplicateDateTime(unsigned int ID, string DateTime) {
	for (unsigned int i = 0; i < UserList[ID].getDateTimeCount(); i++) {
		if (UserList[ID].getUniqueDateTime(i) == DateTime) {
			return true;
		}
	}
	return false;
}

// Checks if a log is already existing in the parsedLogs list.
bool IsDuplicateLog(string log) {
	for (unsigned int i = 0; i < parsedLogs.size(); i++) {
		if (log == parsedLogs[i]) return true;
	}
	return false;
}

// Checks if a log is existing in the ignoreLogs list.
bool IsIgnoredLog(string log) {
	for (unsigned int i = 0; i < ignoreLogs.size(); i++) {
		if (log == ignoreLogs[i]) return true;
	}
	return false;
}

// Checks if the order of Logs and ParsedLogs is matching.
bool IsMatchingLogOrder() {
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

// Checks if a ban is already existing in the BanList.
bool IsDuplicateBan(string banDateTime, string bannedNickname, unsigned int bannedID, unsigned int bannedByInvokerID, string bannedByNickname, string bannedByUID, string banReason, unsigned int bantime) {
	for (unsigned int i = 0; i < BanList.size(); i++) {
		if (BanList[i].getBanDateTime() == banDateTime && BanList[i].getBannedNickname() == bannedNickname && BanList[i].getBannedID() == bannedID &&
			BanList[i].getbannedByInvokerID() == bannedByInvokerID && BanList[i].getBannedByNickname() == bannedByNickname &&
			BanList[i].getBannedByUID() == bannedByUID && BanList[i].getBanReason() == banReason && BanList[i].getBantime() == bantime) return true;
	}
	return false;
}

// Checks if a kick is already existing in the KickList.
bool IsDuplicateKick(string kickDateTime, unsigned int kickedID, string kickedNickname, string kickedByNickname, string kickedByUID, string kickReason) {
	for (unsigned int i = 0; i < KickList.size(); i++) {
		if (KickList[i].getKickDateTime() == kickDateTime && KickList[i].getKickedID() == kickedID && KickList[i].getKickedNickname() == kickedNickname &&
			KickList[i].getKickedByNickname() == kickedByNickname && KickList[i].getKickedByUID() == kickedByUID && KickList[i].getKickReason() == kickReason) return true;
	}
	return false;
}

// Checks if a complaint is already existing in the ComplaintList
bool IsDuplicateComplaint(string complaintDateTime, string complaintForNickname, unsigned int complaintForID, string complaintReason, string complaintByNickname, unsigned int complaintByID) {
	for (unsigned int i = 0; i < ComplaintList.size(); i++) {
		if (ComplaintList[i].getComplaintDateTime() == complaintDateTime && ComplaintList[i].getComplaintForNickname() == complaintForNickname &&
			ComplaintList[i].getComplaintForID() == complaintForID && ComplaintList[i].getComplaintReason() == complaintReason &&
			ComplaintList[i].getComplaintByNickname() == complaintByNickname && ComplaintList[i].getComplaintByID() == complaintByID) return true;
	}
	return false;
}

// Checks if a file is already existing in the FileList.
bool IsDuplicateFile(string uploadDateTime, unsigned int channelID, string filename, string uploadedByNickname, unsigned int uploadedByID) {
	for (unsigned int i = 0; i < FileList.size(); i++) {
		if (FileList[i].getUploadDateTime() == uploadDateTime && FileList[i].getChannelID() == channelID && FileList[i].getFilename() == filename &&
			FileList[i].getUploadedByNickname() == uploadedByNickname && FileList[i].getUploadedByID() == uploadedByID) return true;
	}
	return false;
}