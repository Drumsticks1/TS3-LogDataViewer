// User.cpp : [Description pending]

#include <iostream>
#include <vector>
#include <string>
#include "User.h"
#include "checkFunctions.h"

using namespace std;

vector <User> UserList;

// Returns the ID of the current user.
unsigned int User::getID(){ return ID; }

// Returns the count of the DateTime-/Nickname-/IP-entries of the current user.
unsigned int User::getDateTimeCount(){ return DateTime.size(); }
unsigned int User::getNicknameCount(){return Nickname.size(); }
unsigned int User::getIPCount(){ return IP.size(); }

// Returns the information stored in the given ID slot.
string User::getUniqueDateTime(unsigned int DateTimeNumber){ return DateTime.at(DateTimeNumber); }
string User::getUniqueNickname(unsigned int NicknameNumber){ return Nickname.at(NicknameNumber); }
string User::getUniqueIP(unsigned int IPNumber){ return IP.at(IPNumber); }

// DEV: Maybe add check if ID already exists in the list.
void User::addID(unsigned int ID){
	this->ID = ID;
}

// Adds the new Nickname at the beginning of the Nickname list.
void User::addNickname(string Nickname){
	for (unsigned int i = 1; i < this->Nickname.size(); i++){
		if (this->Nickname.at(i) == Nickname){
			this->Nickname.erase(this->Nickname.begin() + i);
		}
	}
	this->Nickname.insert(this->Nickname.begin(), Nickname);
}

// Adds the new DateTime at the beginning of the DateTime list.
void User::addDateTime(string DateTime){
	for (unsigned int i = 1; i < this->DateTime.size(); i++){
		if (this->DateTime.at(i) == DateTime){
			this->DateTime.erase(this->DateTime.begin() + i);
		}
	}
	this->DateTime.insert(this->DateTime.begin(), DateTime);
}

// Adds the new IP at the beginning of the IP list.
void User::addIP(string IP){
	for (unsigned int i = 1; i < this->IP.size(); i++){
		if (this->IP.at(i) == IP){
			this->IP.erase(this->IP.begin() + i);
		}
	}
	this->IP.insert(this->IP.begin(), IP);
}

// Adds the new Nickname at the end of the IP list.
void User::addNicknameReverse(string Nickname){
	this->Nickname.push_back(Nickname);
}

// Adds the new DateTime at the end of the DateTime list.
void User::addDateTimeReverse(string DateTime){
	this->DateTime.push_back(DateTime);
}

// Adds the new IP at the end of the IP list.
void User::addIPReverse(string IP){
	this->IP.push_back(IP);
}

// Adds a new user (If successfully added --> True | If already existing --> False).
bool User::addNewUser(unsigned int ID, string Nickname, string DateTime, string IP){
	unsigned int dump;
	if (!IDAlreadyExisting(ID, dump)){
		addID(ID);
		addNickname(Nickname);
		addDateTime(DateTime);
		addIP(IP);

		return true;
	}
	else return false;
}