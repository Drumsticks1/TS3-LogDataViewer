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
	// DEV: Add constructor.

	unsigned int getID();
	string getLastDateTime();
	string getLastNickname();
	string getLastIP();

	bool IDAlreadyExisting(unsigned int ID);

	void addID(unsigned int ID);
	void addNickname(string Nickname);
	void addDateTime(string DateTime);
	void addIP(string IP);

	bool addNewUser(unsigned int ID, string Nickname, string DateTime, string IP);

	// DEV: still not done.
	void sortUsers();
};