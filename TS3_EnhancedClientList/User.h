// User.h
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <vector>

using namespace std;

// Class for the User data.
class User {
private:
	unsigned int ID = 0;
	vector <string> DateTime, Nickname, IP;
	int CurrentConnectionsCount = 0;
	bool deleted = false;

public:
	unsigned int getID();

	unsigned int getDateTimeCount();
	unsigned int getNicknameCount();
	unsigned int getIPCount();

	string getUniqueDateTime(unsigned int DateTimeNumber);
	string getUniqueNickname(unsigned int NicknameNumber);
	string getUniqueIP(unsigned int IPNumber);

	void addID(unsigned int ID);
	void addNickname(string Nickname);
	void addDateTime(string DateTime);
	void addIP(string IP);

	void addNicknameReverse(string Nickname);
	void addDateTimeReverse(string DateTime);
	void addIPReverse(string IP);

	void connect();
	void disconnect();
	int getCurrentConnectionsCount();

	void deleteUser();
	bool isDeleted();
};