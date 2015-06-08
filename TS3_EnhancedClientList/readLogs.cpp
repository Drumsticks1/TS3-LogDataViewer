// readLogs.cpp : 

#include <iostream>
#include <fstream>
#include <string>
#include "Constants.h"
#include "User.h"

using namespace std;

User TestUserList[1000];

#define LOGMATCHCONNECT		"|VirtualServerBase|  1| client connected"
#define LOGMATCHDISCONNECT	"|VirtualServerBase|  1| client disconnected"


// DEV: For now not outsourced - Add &Variable with ID-Slot when already existing - outsource later.
bool IDAlreadyUsed(unsigned int ID, unsigned int &FoundID){
	for (unsigned i = 0; i < 201; i++){
		if (TestUserList[i].getID() == ID){
			FoundID = i;
			return true;
		}
	}
	return false;
}

// Function for readingthe logs and filtering out the relevant lines.
void readLogs(){
	int j = 0;
	string buffer_logline;
	string DateTime, Nickname, ID, IP;
	DateTime = Nickname = IP = "";

	unsigned int NicknameLength = 0, IDLength, IPLength;
	unsigned long logfileLength, currentPos = 0, IDStartPos, NicknameStartPos = 77, IPStartPos;

	fstream logfile(LOGPATH, fstream::in | fstream::app);

	logfile.seekg(0, logfile.end);
	logfileLength = (unsigned long)logfile.tellg();
	logfile.seekg(0, logfile.beg);

	for (unsigned long i = 0; i < logfileLength; i++){
		getline(logfile, buffer_logline);

		DateTime.clear();
		Nickname.clear();
		ID.clear();
		IP.clear();

		// Relevant line found.
		// Currently disabled Disconnect matches (buffer_logline.find(LOGMATCHDISCONNECT) != string::npos) because of the unfinished line-finding.
		if (buffer_logline.find(LOGMATCHCONNECT) != string::npos){

			IPStartPos = 1 + (unsigned long)buffer_logline.find_last_of(" ");
			IPLength = buffer_logline.length() - IPStartPos;

			IDStartPos = 2 + (unsigned long)buffer_logline.find_last_of("id");
			IDLength = IPStartPos - IDStartPos - 7;

			NicknameLength = IDStartPos - NicknameStartPos - 5;

			// Date & Time - just as a string until seperation.
			for (int i = 0; i < 19; i++){
				DateTime += buffer_logline[i];
			}

			// Nickname
			for (unsigned int i = 0; i < NicknameLength; i++){
				Nickname += buffer_logline[NicknameStartPos + i];
			}

			// ID
			for (unsigned int i = 0; i < IDLength; i++){
				ID += buffer_logline[IDStartPos + i];
			}

			// IP (if connecting)
			for (unsigned int i = 0; i < IPLength; i++){
				IP += buffer_logline[IPStartPos + i];
			}

			// ID-Slot with already existing ID.
			unsigned int FoundID;

			if (IDAlreadyUsed(stoul(ID), FoundID) == false){
				TestUserList[j].addNewUser(stoul(ID), Nickname, DateTime, IP);
			}
			else{
				// DEV: Prevent Duplicates, but get the right order!
				TestUserList[FoundID].addDateTime(DateTime);
				TestUserList[FoundID].addNickname(Nickname);
				TestUserList[FoundID].addIP(IP);
			}
			j++;
		}
		currentPos += buffer_logline.length() + 1;
		logfile.seekg(currentPos);
	}
	logfile.close();
}