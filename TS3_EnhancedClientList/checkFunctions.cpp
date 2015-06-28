// checkFunctions.cpp : Control Functions.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <vector>
#include "User.h"
#include "Kick.h"

extern vector <User> UserList;
extern vector <string> Logs;
extern vector <string> parsedLogs;
extern vector <string> ignoreLogs;
extern vector <Kick> KickList;

// Checks if a DateTime is already existing for the current user.
bool IsDuplicateDateTime(unsigned int ID, string DateTime){
	for (unsigned int i = 0; i < UserList[ID].getDateTimeCount(); i++){
		if (UserList[ID].getUniqueDateTime(i) == DateTime){
			return true;
		}
	}
	return false;
}

// Checks if a Nickname is already existing for the current User.
bool IsDuplicateNickname(unsigned int ID, string Nickname){
	for (unsigned int i = 0; i < UserList[ID].getNicknameCount(); i++){
		if (UserList[ID].getUniqueNickname(i) == Nickname){
			return true;
		}
	}
	return false;
}

// Checks if an IP is already existing for the current User.
bool IsDuplicateIP(unsigned int ID, string IP){
	for (unsigned int i = 0; i < UserList[ID].getIPCount(); i++){
		if (UserList[ID].getUniqueIP(i) == IP){
			return true;
		}
	}
	return false;
}

// Checks if a log is already existing in the parsedLogs list.
bool IsDuplicateLog(string log){
	for (unsigned int i = 0; i < parsedLogs.size(); i++){
		if (log == parsedLogs[i]) return true;
	}
	return false;
}

// Checks if a log is existing in the ignoreLogs list.
bool IsIgnoredLog(string log){
	for (unsigned int i = 0; i < ignoreLogs.size(); i++){
		if (log == ignoreLogs[i]) return true;
	}
	return false;
}

// Checks if the order of Logs and ParsedLogs is matching.
bool IsMatchingLogOrder(){
	for (unsigned int i = 0; i < parsedLogs.size(); i++){
		if (i < Logs.size()){
			if (parsedLogs[i] != Logs[i]){
				return false;
			}
		}
		else return false;
	}
	return true;
}

// Checks if a kick is already existing in the KickList.
bool IsDuplicateKick(string kickDateTime, unsigned int kickedID, string kickedNickname, string kickedByNickname, string kickReason){
	for (unsigned int i = 0; i < KickList.size(); i++){
		if (KickList[i].getKickDateTime() == kickDateTime && KickList[i].getKickedID() == kickedID && KickList[i].getKickedNickname() == kickedNickname &&
			KickList[i].getKickedByNickname() == kickedByNickname && KickList[i].getKickReason() == kickReason) return true;
	}
	return false;
}
