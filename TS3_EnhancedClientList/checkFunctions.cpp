// checkFunctions.cpp : [Description pending]

#include <iostream>
#include "User.h"

extern vector <User> UserList;

// Checks if an ID is already existing.
bool IDAlreadyExisting(unsigned int ID, unsigned int &FoundID){
	for (unsigned int i = 0; i < UserList.size(); i++){
		if (UserList[i].getID() == ID){
			FoundID = i;
			return true;
		}
	}
	return false;
}

// Checks if a Nickname is already existing for the current User.
bool IsDuplicateNickname(unsigned int ID, string Nickname){
	for (unsigned int i = 0; i < UserList[ID].getNicknameCount(); i++){
		if (UserList[ID].getUniqueNickname(i) == Nickname){
			return true;
		}
	}
	return false;
}

// Checks if an IP is already existing for the current User.
bool IsDuplicateIP(unsigned int ID, string IP){
	for (unsigned int i = 0; i < UserList[ID].getIPCount(); i++){
		if (UserList[ID].getUniqueIP(i) == IP){
			return true;
		}
	}
	return false;
}