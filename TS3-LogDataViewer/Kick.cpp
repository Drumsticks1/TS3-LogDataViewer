// Kick.cpp : Methods of the Kick class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <vector>
#include <string>
#include "Kick.h"

std::vector <Kick> KickList;

// Sets the data of the current Kick object according to the given data.
void Kick::addKick(std::string kickDateTime, unsigned int kickedID, std::string kickedNickname, std::string kickedByNickname, std::string kickedByUID, std::string kickReason) {
	this->kickDateTime = kickDateTime;
	this->kickedID = kickedID;
	this->kickedNickname = kickedNickname;
	this->kickedByNickname = kickedByNickname;
	this->kickedByUID = kickedByUID;
	this->kickReason = kickReason;
}

// Returns the requested information.
std::string Kick::getKickDateTime() { return kickDateTime; }
unsigned int Kick::getKickedID() { return kickedID; }
std::string Kick::getKickedNickname() { return kickedNickname; }
std::string Kick::getKickedByNickname() { return kickedByNickname; }
std::string Kick::getKickedByUID() { return kickedByUID; }
std::string Kick::getKickReason() { return kickReason; }
