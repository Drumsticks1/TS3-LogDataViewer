// Ban.h
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
using namespace std;

// Class for the ban data.
class Ban {
private:
	unsigned int bannedID, bannedByInvokerID, bantime;
	string banDateTime, bannedNickname, bannedByNickname, bannedByUID, banReason;

public:
	void addBan(string banDateTime, string bannedNickname, unsigned int bannedID, unsigned int bannedByInvokerID, string bannedByNickname, string bannedByUID, string banReason, unsigned int bantime);

	string getBanDateTime();
	string getBannedNickname();
	unsigned int getBannedID();
	unsigned int getbannedByInvokerID();
	string getBannedByNickname();
	string getBannedByUID();
	string getBanReason();
	unsigned int getBantime();
};
