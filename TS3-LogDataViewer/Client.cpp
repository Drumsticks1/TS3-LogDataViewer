// Client.cpp : Methods of the Client class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <iostream>
#include <vector>
#include <string>
#include "Client.h"

using namespace std;

vector <Client> ClientList;

// Returns the ID of the current client.
unsigned int Client::getID() { return ID; }

// Returns the count of the DateTime-/Nickname-/IP-entries of the current client.
unsigned int Client::getDateTimeCount() { return DateTime.size(); }
unsigned int Client::getNicknameCount() { return Nickname.size(); }
unsigned int Client::getIPCount() { return IP.size(); }

// Returns the information stored in the given ID slot.
string Client::getUniqueDateTime(unsigned int DateTimeNumber) { return DateTime.at(DateTimeNumber); }
string Client::getUniqueNickname(unsigned int NicknameNumber) { return Nickname.at(NicknameNumber); }
string Client::getUniqueIP(unsigned int IPNumber) { return IP.at(IPNumber); }

// Sets the given ID as client ID.
void Client::addID(unsigned int ID) {
	this->ID = ID;
}

// Adds the new Nickname at the beginning of the Nickname list.
void Client::addNickname(string Nickname) {
	for (unsigned int i = 0; i < this->Nickname.size(); i++) {
		if (this->Nickname.at(i) == Nickname) {
			this->Nickname.erase(this->Nickname.begin() + i);
		}
	}
	this->Nickname.insert(this->Nickname.begin(), Nickname);
}

// Adds the new DateTime at the beginning of the DateTime list.
void Client::addDateTime(string DateTime) {
	this->DateTime.insert(this->DateTime.begin(), DateTime);
}

// Adds the new IP at the beginning of the IP list.
void Client::addIP(string IP) {
	for (unsigned int i = 0; i < this->IP.size(); i++) {
		if (this->IP.at(i) == IP) {
			this->IP.erase(this->IP.begin() + i);
		}
	}
	this->IP.insert(this->IP.begin(), IP);
}

// Adds the new Nickname at the end of the IP list.
void Client::addNicknameReverse(string Nickname) {
	this->Nickname.push_back(Nickname);
}

// Adds the new DateTime at the end of the DateTime list.
void Client::addDateTimeReverse(string DateTime) {
	this->DateTime.push_back(DateTime);
}

// Adds the new IP at the end of the IP list.
void Client::addIPReverse(string IP) {
	this->IP.push_back(IP);
}

// Adjusts the CurrentConnectionsCount.
void Client::connect() { ConnectedState++; }
void Client::disconnect() {
	if (ConnectedState > 0)
		ConnectedState--;
}

// Returns the CurrentConnectionsCount.
int Client::getConnectedState() {
	return ConnectedState;
}

// Sets the Deleted Flag to true.
void Client::deleteClient() {
	deleted = true;
}

// Returns 1 if the client has been deleted.
int Client::isDeleted() {
	if (deleted) {
		return 1;
	}
	else return 0;
}
