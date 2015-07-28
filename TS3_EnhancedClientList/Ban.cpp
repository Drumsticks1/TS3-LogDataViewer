// Ban.cpp : Methods of the Ban class.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <vector>
#include <string>
#include "Ban.h"

vector <Ban> BanList;

void Ban::addBan(string banDateTime, string bannedNickname, unsigned int bannedID, unsigned int bannedByInvokerID, string bannedByNickname, string bannedByUID, string banReason, unsigned int bantime) {
	this->banDateTime = banDateTime;
	this->bannedNickname = bannedNickname;
	this->bannedID = bannedID;
	this->bannedByInvokerID = bannedByInvokerID;
	this->bannedByNickname = bannedByNickname;
	this->bannedByUID = bannedByUID;
	this->banReason = banReason;
	this->bantime = bantime;
}

// Returns the requested information.
string Ban::getBanDateTime() { return banDateTime; }
string Ban::getBannedNickname() { return bannedNickname; }
unsigned int Ban::getBannedID() { return bannedID; }
unsigned int Ban::getbannedByInvokerID() { return bannedByInvokerID; }
string Ban::getBannedByNickname() { return bannedByNickname; }
string Ban::getBannedByUID() { return bannedByUID; }
string Ban::getBanReason() { return banReason; }
unsigned int Ban::getBantime() { return bantime; }
