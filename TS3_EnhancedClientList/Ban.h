// Ban.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
using namespace std;

// Class for the ban data.
class Ban {
private:
	unsigned int bannedID, bannedByID, bantime;
	string banDateTime, bannedIP, bannedUID, bannedNickname, bannedByNickname, bannedByUID, banReason;

public:
	void addBan(string banDateTime, unsigned int bannedID, string bannedNickname, string bannedUID, string bannedIP, string bannedByNickname, unsigned int bannedByID, string bannedByUID, string banReason, unsigned int bantime);

	string getBanDateTime();
	unsigned int getBannedID();
	string getBannedNickname();
	string getBannedUID();
	string getBannedIP();
	string getBannedByNickname();
	unsigned int getBannedByID();
	string getBannedByUID();
	string getBanReason();
	unsigned int getBantime();
};
