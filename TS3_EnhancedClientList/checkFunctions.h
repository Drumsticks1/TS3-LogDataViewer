// checkFunctions.h
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
using namespace std;

// Checks if a DateTime is already existing for the current user.
bool IsDuplicateDateTime(unsigned int ID, string DateTime);

// Checks if a log is already existing in the parsedLogs list.
bool IsDuplicateLog(string log);

// Checks if a log is existing in the ignoreLogs list.
bool IsIgnoredLog(string log);

// Checks if the order of Logs and ParsedLogs is matching.
bool IsMatchingLogOrder();

// Checks if a kick is already existing in the KickList.
bool IsDuplicateKick(string kickDateTime, unsigned int kickedID, string kickedNickname, string kickedByNickname, string kickedByUID, string kickReason);

// Checks if a file is already existing in the FileList.
bool IsDuplicateFile(string uploadDateTime, unsigned int channelID, string filename, string uploadedByNickname, unsigned int uploadedByID);