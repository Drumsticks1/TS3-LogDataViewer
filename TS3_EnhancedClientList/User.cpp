// User.cpp :

#include <iostream>
#include <vector>
#include <string>
#include "User.h"
#include "checkFunctions.h"

using namespace std;

vector <User> UserList;

// 
unsigned int User::getID(){ return ID; }

// Returns the count of the DateTime-/Nickname-/IP-entries of the current user.
unsigned int User::getDateTimeCount(){ return DateTime.size(); }
unsigned int User::getNicknameCount(){return Nickname.size(); }
unsigned int User::getIPCount(){ return IP.size(); }

//
string User::getUniqueDateTime(unsigned int DateTimeNumber){ return DateTime.at(DateTimeNumber); }
string User::getUniqueNickname(unsigned int NicknameNumber){ return Nickname.at(NicknameNumber); }
string User::getUniqueIP(unsigned int IPNumber){ return IP.at(IPNumber); }

// DEV: Maybe add check if ID already exists in the list.
void User::addID(unsigned int ID){
	this->ID = ID;
}

// Adds the new Nickname at the front of the IP-List.
void User::addNickname(string Nickname){
	this->Nickname.insert(this->Nickname.begin(), Nickname);
}

//
void User::addDateTime(string DateTime){
	this->DateTime.insert(this->DateTime.begin(), DateTime);
}

// Adds the new IP at the front of the IP-List.
void User::addIP(string IP){
	this->IP.insert(this->IP.begin(), IP);
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