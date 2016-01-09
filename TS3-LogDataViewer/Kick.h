// Kick.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <string>

// Class for the kick data.
class Kick {
private:
	unsigned int kickedID;
	std::string kickDateTime, kickedNickname, kickedByNickname, kickedByUID, kickReason;

public:
	void addKick(std::string kickDateTime, unsigned int kickedID, std::string kickedNickname, std::string kickedByNickname, std::string kickedByUID, std::string kickReason);

	std::string getKickDateTime();
	unsigned int getKickedID();
	std::string getKickedNickname();
	std::string getKickedByNickname();
	std::string getKickedByUID();
	std::string getKickReason();
};
