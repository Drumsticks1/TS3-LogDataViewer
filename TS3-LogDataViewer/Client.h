// Client.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer
#pragma once

#include <vector>
#include <string>

// Class for the Client data.
class Client {
private:
	unsigned int ID = 0;
	std::vector <std::string> DateTime, Nickname, IP;
	int ConnectedState = 0;
	bool deleted = false;

public:
	unsigned int getID();

	unsigned int getDateTimeCount();
	unsigned int getNicknameCount();
	unsigned int getIPCount();

	std::string getUniqueDateTime(unsigned int DateTimeNumber);
	std::string getUniqueNickname(unsigned int NicknameNumber);
	std::string getUniqueIP(unsigned int IPNumber);

	void addID(unsigned int ID);
	void addNickname(std::string Nickname);
	void addDateTime(std::string DateTime);
	void addIP(std::string IP);

	void addNicknameReverse(std::string Nickname);
	void addDateTimeReverse(std::string DateTime);
	void addIPReverse(std::string IP);

	void connect();
	void disconnect();
	int getConnectedState();

	void deleteClient();
	int isDeleted();
};
