// Ban.cpp : Methods of the Ban class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <iostream>
#include <vector>
#include <string>
#include "Ban.h"

vector <Ban> BanList;

// Sets the data of the current Ban object according to the given data.
void Ban::addBan(string banDateTime, unsigned int bannedID, string bannedNickname, string bannedUID, string bannedIP, string bannedByNickname, unsigned int bannedByID, string bannedByUID, string banReason, unsigned int bantime) {
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
string Ban::getBanDateTime() { return banDateTime; }
unsigned int Ban::getBannedID() { return bannedID; }
string Ban::getBannedNickname() { return bannedNickname; }
string Ban::getBannedUID() { return bannedUID; }
string Ban::getBannedIP() { return bannedIP; }
string Ban::getBannedByNickname() { return bannedByNickname; }
unsigned int Ban::getBannedByID() { return bannedByID; }
string Ban::getBannedByUID() { return bannedByUID; }
string Ban::getBanReason() { return banReason; }
unsigned int Ban::getBantime() { return bantime; }
