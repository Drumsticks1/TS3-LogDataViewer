// checkFunctions.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <string>

// Checks if a ServerGroup is already existing in the Client ServerListID vector.
bool isDuplicateServerGroup(unsigned int clientID, unsigned int serverID);

// Checks if a DateTime is already existing for the current client.
bool isDuplicateDateTime(unsigned int ID, std::string DateTime);

// Checks if a log is already existing in the parsedLogs list.
bool isDuplicateLog(std::string log);

// Checks if a log is existing in the ignoreLogs list.
bool isIgnoredLog(std::string log);

// Checks if the order of Logs and ParsedLogs is matching.
bool isMatchingLogOrder();

// Checks if two ban rules are matching with a ban disconnect.
bool isMatchingBanRules(std::string bannedByNickname, std::string banReason, std::string bantime, std::string lastUIDBanRule, std::string lastIPBanRule);

// Checks if a ban is already existing in the BanList.
bool isDuplicateBan(std::string banDateTime, unsigned int bannedID, std::string bannedNickname, std::string bannedUID, std::string bannedIP, std::string bannedByNickname, unsigned int bannedByID, std::string bannedByUID, std::string banReason, unsigned int bantime);

// Checks if a kick is already existing in the KickList.
bool isDuplicateKick(std::string kickDateTime, unsigned int kickedID, std::string kickedNickname, std::string kickedByNickname, std::string kickedByUID, std::string kickReason);

// Checks if a complaint is already existing in the ComplaintList
bool isDuplicateComplaint(std::string complaintDateTime, std::string complaintAboutNickname, unsigned int complaintAboutID, std::string complaintReason, std::string complaintByNickname, unsigned int complaintByID);

// Checks if an upload is already existing in the UploadList.
bool isDuplicateUpload(std::string uploadDateTime, unsigned int channelID, std::string filename, std::string uploadedByNickname, unsigned int uploadedByID);
