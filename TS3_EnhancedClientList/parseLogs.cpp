// parseLogs.cpp : Parsing of the logs.

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <boost/filesystem.hpp>
#include "Constants.h"
#include "User.h"
#include "checkFunctions.h"

using namespace std;

extern vector <User> UserList;
extern vector <string> Logs;
extern vector <string> parsedLogs;
extern bool validXML;

#define LOGMATCHCONNECT		"|VirtualServerBase|  1| client connected"
#define LOGMATCHDISCONNECT	"|VirtualServerBase|  1| client disconnected"
#define LOGMATCHDELETEUSER1 "|VirtualServer |  1| client '"
#define LOGMATCHDELETEUSER2 ") got deleted by client '"

// Parses the logs and stores the data in the UserList.
void parseLogs(string LOGDIRECTORY){
	string buffer_logline, buffer_XMLInfoInput, LogFilePath, DateTime, Nickname, ID_string, IP;
	unsigned int ID, NicknameLength, IDLength, IPLength, IDStartPos, IDEndPos, NicknameStartPos, IPStartPos;
	unsigned long logfileLength, currentPos;

	if (validXML){
		cout << "Comparing logs..." << endl;
		for (unsigned int i = 0; i < parsedLogs.size(); i++){
			// Last parsed logfile is parsed again as it may have changed.
			for (unsigned int j = 0; j < Logs.size() - 1; j++){
				if (Logs[j] == parsedLogs[i]){
					Logs[j].erase();
				}
			}
		}
	}

	cout << "Parsing new logs..." << endl;
	for (unsigned int i = 0; i < Logs.size(); i++){
		if (!Logs[i].empty()){
			LogFilePath = LOGDIRECTORY + Logs.at(i);
			DateTime = Nickname = IP = "";
			currentPos = 0;

			ifstream logfile(LogFilePath);

			logfile.seekg(0, logfile.end);
			logfileLength = (unsigned long)logfile.tellg();
			logfile.seekg(0, logfile.beg);

			for (unsigned long j = 0; j < logfileLength;){
				getline(logfile, buffer_logline);
				j += buffer_logline.size() + 1;

				ID_string.clear();
				Nickname.clear();
				DateTime.clear();
				IP.clear();

				// Connection matches.
				if (buffer_logline.find(LOGMATCHCONNECT) != string::npos){
					NicknameStartPos = 77;

					IPStartPos = 1 + (unsigned int)buffer_logline.rfind(" ");
					IPLength = buffer_logline.length() - IPStartPos - 6; // - 6 for ignoring the port.

					IDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:");
					IDLength = IPStartPos - IDStartPos - 7;

					NicknameLength = IDStartPos - NicknameStartPos - 5;

					// Date & Time - just as a string until seperation.
					for (unsigned int i = 0; i < 19; i++){
						DateTime += buffer_logline[i];
					}

					// Nickname
					for (unsigned int i = 0; i < NicknameLength; i++){
						Nickname += buffer_logline[NicknameStartPos + i];
					}

					// ID
					for (unsigned int i = 0; i < IDLength; i++){
						ID_string += buffer_logline[IDStartPos + i];
					}

					// IP (if connecting)
					for (unsigned int i = 0; i < IPLength; i++){
						IP += buffer_logline[IPStartPos + i];
					}

					// DEV: Outsource.
					ID = stoul(ID_string);
					if (UserList.size() < ID + 1) UserList.resize(ID + 1);
					// Duplicate check ? So that ID isn't overwritten every time information is added ?
					UserList[ID].addID(ID);
					if (!IsDuplicateNickname(ID, Nickname)){
						UserList[ID].addNickname(Nickname);
					}
					if (!IsDuplicateDateTime(ID, DateTime)){
						UserList[ID].addDateTime(DateTime);
					}
					if (!IsDuplicateIP(ID, IP)){
						UserList[ID].addIP(IP);
					}
					if (i + 1 == Logs.size()){
						UserList[ID].connect();
					}
				}

				// Disconnecting matches
				if (buffer_logline.find(LOGMATCHDISCONNECT) != string::npos){
					NicknameStartPos = 80;

					IDStartPos = (unsigned int)buffer_logline.rfind("'(id:") + 5;

					// Added to cover kick / ban disconnects as well
					if (buffer_logline.rfind(") reason 'reasonmsg") == string::npos){
						IDEndPos = (unsigned int)buffer_logline.rfind(") reason 'invokerid=");
					}
					else{
						IDEndPos = (unsigned int)buffer_logline.rfind(") reason 'reasonmsg");
					}

					IDLength = IDEndPos - IDStartPos;
					NicknameLength = IDStartPos - NicknameStartPos - 5;

					// Nickname
					for (unsigned int i = 0; i < NicknameLength; i++){
						Nickname += buffer_logline[NicknameStartPos + i];
					}

					// ID
					for (unsigned int i = 0; i < IDLength; i++){
						ID_string += buffer_logline[IDStartPos + i];
					}

					ID = stoul(ID_string);
					if (UserList.size() < ID + 1){
						UserList.resize(ID + 1);
						UserList[ID].addID(ID);
					}
					if (UserList[ID].getUniqueNickname(0) != Nickname){
						UserList[ID].addNickname(Nickname);
					}
					if (i + 1 == Logs.size()){
						UserList[ID].disconnect();
					}
				}

				// User Deletion matches.
				if (buffer_logline.find(LOGMATCHDELETEUSER1) != string::npos){
					if (buffer_logline.find(LOGMATCHDELETEUSER2) != string::npos){
						IDEndPos = (unsigned int)buffer_logline.rfind(") got deleted by client '");
						IDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:", IDEndPos);
						IDLength = IDEndPos - IDStartPos;

						// ID
						for (unsigned int i = 0; i < IDLength; i++){
							ID_string += buffer_logline[IDStartPos + i];
						}

						ID = stoul(ID_string);
						UserList[ID].deleteUser();
					}
				}
				currentPos += buffer_logline.length() + 1;
				logfile.seekg(currentPos);
			}
			logfile.close();
			if (!IsDuplicateLog(Logs[i])){
				parsedLogs.emplace_back(Logs[i]);
			}
		}
	}
}