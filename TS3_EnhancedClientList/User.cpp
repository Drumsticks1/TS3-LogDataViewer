// User.cpp : Methods of the User class.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <vector>
#include <string>
#include "User.h"

using namespace std;

vector <User> UserList;

// Returns the ID of the current user.
unsigned int User::getID() { return ID; }

// Returns the count of the DateTime-/Nickname-/IP-entries of the current user.
unsigned int User::getDateTimeCount() { return DateTime.size(); }
unsigned int User::getNicknameCount() { return Nickname.size(); }
unsigned int User::getIPCount() { return IP.size(); }

// Returns the information stored in the given ID slot.
string User::getUniqueDateTime(unsigned int DateTimeNumber) { return DateTime.at(DateTimeNumber); }
string User::getUniqueNickname(unsigned int NicknameNumber) { return Nickname.at(NicknameNumber); }
string User::getUniqueIP(unsigned int IPNumber) { return IP.at(IPNumber); }

// Sets the given ID as user ID.
void User::addID(unsigned int ID) {
	this->ID = ID;
}

// Adds the new Nickname at the beginning of the Nickname list.
void User::addNickname(string Nickname) {
	for (unsigned int i = 0; i < this->Nickname.size(); i++) {
		if (this->Nickname.at(i) == Nickname) {
			this->Nickname.erase(this->Nickname.begin() + i);
		}
	}
	this->Nickname.insert(this->Nickname.begin(), Nickname);
}

// Adds the new DateTime at the beginning of the DateTime list.
void User::addDateTime(string DateTime) {
	this->DateTime.insert(this->DateTime.begin(), DateTime);
}

// Adds the new IP at the beginning of the IP list.
void User::addIP(string IP) {
	for (unsigned int i = 0; i < this->IP.size(); i++) {
		if (this->IP.at(i) == IP) {
			this->IP.erase(this->IP.begin() + i);
		}
	}
	this->IP.insert(this->IP.begin(), IP);
}

// Adds the new Nickname at the end of the IP list.
void User::addNicknameReverse(string Nickname) {
	this->Nickname.push_back(Nickname);
}

// Adds the new DateTime at the end of the DateTime list.
void User::addDateTimeReverse(string DateTime) {
	this->DateTime.push_back(DateTime);
}

// Adds the new IP at the end of the IP list.
void User::addIPReverse(string IP) {
	this->IP.push_back(IP);
}

// Adjusts the CurrentConnectionsCount.
void User::connect() { CurrentConnectionsCount++; }
void User::disconnect() {
	if (CurrentConnectionsCount > 0)
		CurrentConnectionsCount--;
}

// Returns the CurrentConnectionsCount.
int User::getCurrentConnectionsCount() {
	return CurrentConnectionsCount;
}

// Sets the Deleted Flag to true.
void User::deleteUser() {
	deleted = true;
}

// Returns true if the user has been deleted.
bool User::isDeleted() {
	if (deleted == true) {
		return true;
	}
	else return false;
}