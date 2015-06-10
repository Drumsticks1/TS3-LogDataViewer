// readLogs.cpp : [Description pending]

#include <iostream>
#include <fstream>
#include <string>
#include "Constants.h"
#include "User.h"
#include "checkFunctions.h"

using namespace std;

extern vector <User> UserList;
extern vector <string> LogFiles;

#define LOGMATCHCONNECT		"|VirtualServerBase|  1| client connected"
#define LOGMATCHDISCONNECT	"|VirtualServerBase|  1| client disconnected"

// [Description pending]
void readLogs(){
	unsigned int FoundID, UserListSize = 1, i_ID = 0;
	string buffer_logline;
	string DateTime, Nickname, ID, IP;
	unsigned int NicknameLength, IDLength, IPLength;
	unsigned long logfileLength, currentPos, IDStartPos, IDEndPos, NicknameStartPos, IPStartPos;

	for (unsigned int i = 0; i < LogFiles.size(); i++){
		cout << "Reading Logfiles...\t\t" << i + 1 << "\t of\t" << LogFiles.size() << endl;

		DateTime = Nickname = IP = "";
		currentPos = 0;

		fstream logfile(LogFiles.at(i), fstream::in | fstream::app);

		logfile.seekg(0, logfile.end);
		logfileLength = (unsigned long)logfile.tellg();
		logfile.seekg(0, logfile.beg);

		for (unsigned long i = 0; i < logfileLength; i++){
			getline(logfile, buffer_logline);

			DateTime.clear();
			Nickname.clear();
			ID.clear();
			IP.clear();

			// Relevant Connection line found.
			if (buffer_logline.find(LOGMATCHCONNECT) != string::npos){
				NicknameStartPos = 77;

				IPStartPos = 1 + (unsigned long)buffer_logline.rfind(" ");
				IPLength = buffer_logline.length() - IPStartPos - 6; // - 6 for ignoring the port.

				IDStartPos = 5 + (unsigned long)buffer_logline.rfind("'(id:");
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

				if (!IDAlreadyExisting(stoul(ID), FoundID)){
					UserList.resize(UserListSize);
					UserList[i_ID].addNewUser(stoul(ID), Nickname, DateTime, IP);
					UserList[i_ID].connect();
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
					UserList[FoundID].connect();
				}
			}

			// WIP: Disconnecting matches
			// For now: Just Nickname adding if Nickname was changed since connect --> creats kind of nickname history.
			// May cause problems: Multiple connects before disconnecting (should be added later).
			// DEV: Add sorting of the Nickname - for now it's only adding one more at the beginning of the vector if it differs with the newest one !
			if (buffer_logline.find(LOGMATCHDISCONNECT) != string::npos){
				NicknameStartPos = 80;

				IDStartPos = (unsigned long)buffer_logline.rfind("'(id:") + 5;

				// Added to cover kick / ban disconnects as well
				if (buffer_logline.rfind(") reason 'reasonmsg") == string::npos){
					IDEndPos = (unsigned long)buffer_logline.rfind(") reason 'invokerid=");
				}
				else{
					IDEndPos = (unsigned long)buffer_logline.rfind(") reason 'reasonmsg");
				}

				IDLength = IDEndPos - IDStartPos;
				NicknameLength = IDStartPos - NicknameStartPos - 5;

				// Nickname
				for (unsigned int i = 0; i < NicknameLength; i++){
					Nickname += buffer_logline[NicknameStartPos + i];
				}

				// ID
				for (unsigned int i = 0; i < IDLength; i++){
					ID += buffer_logline[IDStartPos + i];
				}

				// ID must already exist, otherwise the log isn't valid!
				if (IDAlreadyExisting(stoul(ID), FoundID)){
					if (UserList[FoundID].getUniqueNickname(0) != Nickname){
						UserList[FoundID].addNickname(Nickname);
					}
					UserList[FoundID].disconnect();
				}
			}
			currentPos += buffer_logline.length() + 1;
			logfile.seekg(currentPos);
		}
		logfile.close();
	}
}