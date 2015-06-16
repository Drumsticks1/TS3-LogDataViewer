// checkFunctions.h

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