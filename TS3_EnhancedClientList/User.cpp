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

// Adds the new Nickname at the front of the IP list.
void User::addNickname(string Nickname){
	for (unsigned int i = 1; i < this->Nickname.size(); i++){
		if (this->Nickname.at(i) == Nickname){
			this->Nickname.erase(this->Nickname.begin() + i);
		}
	}
	this->Nickname.insert(this->Nickname.begin(), Nickname);
}

// Adds the new DateTime at the front of the DateTime list.
void User::addDateTime(string DateTime){
	this->DateTime.insert(this->DateTime.begin(), DateTime);
}

// Adds the new IP at the front of the IP list.
void User::addIP(string IP){
	for (unsigned int i = 1; i < this->IP.size(); i++){
		if (this->IP.at(i) == IP){
			this->IP.erase(this->IP.begin() + i);
		}
	}
	this->IP.insert(this->IP.begin(), IP);
}

// DEV: Prevent negative CurrentClientConnects or stop the program when it occurs.
// Toggles the Connection flag for the current user.
void User::connect(){ CurrentClientConnects++; }
void User::disconnect(){ CurrentClientConnects--; }

// Checks the connection status of the user.
bool User::isConnected(){
	if (CurrentClientConnects == 0){
		return false;
	}
	else return true;
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