// User.cpp :

#include <iostream>
#include <vector>
#include <string>
#include "User.h"

using namespace std;

vector <User> UserList;

// 
unsigned int User::getID(){ return ID; }
string User::getLastDateTime(){ return DateTime.front(); }
string User::getLastNickname(){ return Nickname.front(); }
string User::getLastIP(){ return IP.front(); }

// Checks if an ID is already in use.
bool User::IDAlreadyExisting(unsigned int ID){
	for (unsigned int i = 0; i < UserList.size(); i++){
		if (UserList[i].getID() == ID){
			return true;
		}
	}
	return false;
}

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
	if (!IDAlreadyExisting(ID)){
		addID(ID);
		addNickname(Nickname);
		addDateTime(DateTime);
		addIP(IP);

		return true;
	}
	else return false;
}