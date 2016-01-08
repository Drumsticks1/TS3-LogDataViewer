// Ban.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer
#pragma once

#include <string>

// Class for the ban data.
class Ban {
private:
	unsigned int bannedID, bannedByID, bantime;
	std::string banDateTime, bannedIP, bannedUID, bannedNickname, bannedByNickname, bannedByUID, banReason;

public:
	void addBan(std::string banDateTime, unsigned int bannedID, std::string bannedNickname, std::string bannedUID, std::string bannedIP, std::string bannedByNickname, unsigned int bannedByID, std::string bannedByUID, std::string banReason, unsigned int bantime);

	std::string getBanDateTime();
	unsigned int getBannedID();
	std::string getBannedNickname();
	std::string getBannedUID();
	std::string getBannedIP();
	std::string getBannedByNickname();
	unsigned int getBannedByID();
	std::string getBannedByUID();
	std::string getBanReason();
	unsigned int getBantime();
};
