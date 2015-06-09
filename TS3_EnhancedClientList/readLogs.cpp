// readLogs.cpp : 

#include <iostream>
#include <fstream>
#include <string>
#include "Constants.h"
#include "User.h"
#include "checkFunctions.h"

using namespace std;

extern vector <User> UserList;

#define LOGMATCHCONNECT		"|VirtualServerBase|  1| client connected"
#define LOGMATCHDISCONNECT	"|VirtualServerBase|  1| client disconnected"

// Function for reading the logs and filtering out the relevant lines.
void readLogs(){
	unsigned int FoundID, UserListSize = 1, i_ID = 0;
	string buffer_logline;
	string DateTime, Nickname, ID, IP;
	DateTime = Nickname = IP = "";

	unsigned int NicknameLength = 0, IDLength, IPLength;
	unsigned long logfileLength, currentPos = 0, IDStartPos, NicknameStartPos = 77, IPStartPos;

	fstream logfile(LOGFILE, fstream::in | fstream::app);

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

			// DEV: Outsource.

			if (IDAlreadyExisting(stoul(ID), FoundID) == false){
				UserList.resize(UserListSize);
				UserList[i_ID].addNewUser(stoul(ID), Nickname, DateTime, IP);
				i_ID++;
				UserListSize++;
			}
			else{
				// Currently no duplicate check for DateTime as it shouldn't happen. Maybe add for duplicated logfiles ?
				UserList[FoundID].addDateTime(DateTime);

				// DEV: Get the right order (Last used Nickname should be the first in the vector).
				if (!IsDuplicateNickname(FoundID, Nickname)){
					UserList[FoundID].addNickname(Nickname);
				}

				if (!IsDuplicateIP(FoundID, IP)){
					UserList[FoundID].addIP(IP);
				}
			}
		}
		currentPos += buffer_logline.length() + 1;
		logfile.seekg(currentPos);
	}
	logfile.close();
}