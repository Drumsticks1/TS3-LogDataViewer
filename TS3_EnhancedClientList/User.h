// User.h

#include <iostream>
#include <vector>

using namespace std;

// Class for the user data.
class User{
private:
	unsigned int ID;
	vector <string> DateTime, Nickname, IP;

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

	bool addNewUser(unsigned int ID, string Nickname, string DateTime, string IP);
};