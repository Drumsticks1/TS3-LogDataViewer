// Kick.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <iostream>
using namespace std;

// Class for the kick data.
class Kick {
private:
	unsigned int kickedID;
	string kickDateTime, kickedNickname, kickedByNickname, kickedByUID, kickReason;

public:
	void addKick(string kickDateTime, unsigned int kickedID, string kickedNickname, string kickedByNickname, string kickedByUID, string kickReason);

	string getKickDateTime();
	unsigned int getKickedID();
	string getKickedNickname();
	string getKickedByNickname();
	string getKickedByUID();
	string getKickReason();
};
