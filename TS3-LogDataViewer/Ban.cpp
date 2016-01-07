// Ban.cpp : Methods of the Ban class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <vector>
#include <string>
#include "Ban.h"

std::vector <Ban> BanList;

// Sets the data of the current Ban object according to the given data.
void Ban::addBan(std::string banDateTime, unsigned int bannedID, std::string bannedNickname, std::string bannedUID, std::string bannedIP, std::string bannedByNickname, unsigned int bannedByID, std::string bannedByUID, std::string banReason, unsigned int bantime) {
	this->banDateTime = banDateTime;
	this->bannedID = bannedID;
	this->bannedNickname = bannedNickname;
	this->bannedUID = bannedUID;
	this->bannedIP = bannedIP;
	this->bannedByID = bannedByID;
	this->bannedByNickname = bannedByNickname;
	this->bannedByUID = bannedByUID;
	this->banReason = banReason;
	this->bantime = bantime;
}

// Returns the requested information.
std::string Ban::getBanDateTime() { return banDateTime; }
unsigned int Ban::getBannedID() { return bannedID; }
std::string Ban::getBannedNickname() { return bannedNickname; }
std::string Ban::getBannedUID() { return bannedUID; }
std::string Ban::getBannedIP() { return bannedIP; }
std::string Ban::getBannedByNickname() { return bannedByNickname; }
unsigned int Ban::getBannedByID() { return bannedByID; }
std::string Ban::getBannedByUID() { return bannedByUID; }
std::string Ban::getBanReason() { return banReason; }
unsigned int Ban::getBantime() { return bantime; }
