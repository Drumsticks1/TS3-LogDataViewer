// checkFunctions.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
using namespace std;

// Checks if a DateTime is already existing for the current user.
bool isDuplicateDateTime(unsigned int ID, string DateTime);

// Checks if a log is already existing in the parsedLogs list.
bool isDuplicateLog(string log);

// Checks if a log is existing in the ignoreLogs list.
bool isIgnoredLog(string log);

// Checks if the order of Logs and ParsedLogs is matching.
bool isMatchingLogOrder();

// Checks if two ban rules are matching with a ban disconnect.
bool isMatchingBanRules(string bannedByNickname, string banReason, string bantime, string lastUIDBanRule, string lastIPBanRule);

// Checks if a ban is already existing in the BanList.
bool isDuplicateBan(string banDateTime, unsigned int bannedID, string bannedNickname, string bannedUID, string bannedIP, string bannedByNickname, unsigned int bannedByID, string bannedByUID, string banReason, unsigned int bantime);

// Checks if a kick is already existing in the KickList.
bool isDuplicateKick(string kickDateTime, unsigned int kickedID, string kickedNickname, string kickedByNickname, string kickedByUID, string kickReason);

// Checks if a complaint is already existing in the ComplaintList
bool isDuplicateComplaint(string complaintDateTime, string complaintAboutNickname, unsigned int complaintAboutID, string complaintReason, string complaintByNickname, unsigned int complaintByID);

// Checks if a file is already existing in the FileList.
bool isDuplicateFile(string uploadDateTime, unsigned int channelID, string filename, string uploadedByNickname, unsigned int uploadedByID);
