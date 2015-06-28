// Kick.h
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
using namespace std;

// Class for the kick data.
class Kick{
private:
	unsigned int kickedID;
	string kickDateTime, kickedNickname, kickedByNickname, kickReason;

public:
	void addKick(string kickDateTime, unsigned int kickedID, string kickedNickname, string kickedByNickname, string kickReason);

	string getKickDateTime();
	unsigned int getKickedID();
	string getKickedNickname();
	string getKickedByNickname();
	string getKickReason();
};
