// checkFunctions.h
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
using namespace std;

// Checks if a DateTime is already existing for the current user.
bool IsDuplicateDateTime(unsigned int ID, string DateTime);

// Checks if a Nickname is already existing for the current User.
bool IsDuplicateNickname(unsigned int ID, string Nickname);

// Checks if an IP is already existing for the current User.
bool IsDuplicateIP(unsigned int ID, string IP);

// Checks if a log is already existing in the parsedLogs list.
bool IsDuplicateLog(string log);

// Checks if a log is existing in the ignoreLogs list.
bool IsIgnoredLog(string log);

// Checks if the order of Logs and ParsedLogs is matching.
bool IsMatchingLogOrder();

// Checks if a kick is already existing in the KickList.
bool IsDuplicateKick(string kickDateTime, unsigned int kickedID, string kickedNickname, string kickedByNickname, string kickedByUID, string kickReason);
