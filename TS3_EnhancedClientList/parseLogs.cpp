// parseLogs.cpp : Parsing of the logs.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <boost/filesystem.hpp>
#include "Constants.h"
#include "User.h"
#include "Kick.h"
#include "Ban.h"
#include "checkFunctions.h"

using namespace std;

extern vector <User> UserList;
extern vector <string> Logs;
extern vector <string> parsedLogs;
extern vector <Kick> KickList;
extern bool validXML;

// DEV: Make compatible with multiple virtual servers.
#define LOGMATCHCONNECT		"|VirtualServerBase|  1| client connected"
#define LOGMATCHDISCONNECT	"|VirtualServerBase|  1| client disconnected"
#define LOGMATCHDELETEUSER1 "|VirtualServer |  1| client '"
#define LOGMATCHDELETEUSER2 ") got deleted by client '"

// Parses the logs and stores the data in the UserList.
void parseLogs(string LOGDIRECTORY){
	string buffer_logline, buffer_XMLInfoInput, LogFilePath, DateTime, Nickname, ID_string, IP, kickedByNickname, kickedByUID, kickReason;
	unsigned int ID, KickListID, NicknameLength, IDLength, IPLength, IDStartPos, IDEndPos, NicknameStartPos, IPStartPos, kickReasonStartPos, kickedByNicknameStartPos, kickedByNicknameEndPos, kickedByUIDEndPos;
	unsigned long logfileLength;
	bool banMatch, kickMatch;

	if (KickList.size() > 0) KickListID = KickList.size();
	else KickListID = 0;

	if (validXML){
		if (IsMatchingLogOrder()){
			cout << "Comparing logs..." << endl;
			for (unsigned int i = 0; i < parsedLogs.size(); i++){
				for (unsigned int j = 0; j < Logs.size() - 1; j++){
					if (Logs[j] == parsedLogs[i]){
						Logs[j].erase();
					}
				}
			}
		}
		else cout << "Logs parsed for the last XML were deleted or the log order changed - skipping use of old XML..." << endl;
	}

	cout << "Parsing new logs..." << endl;
	for (unsigned int i = 0; i < Logs.size(); i++){
		if (!Logs[i].empty()){
			LogFilePath = LOGDIRECTORY + Logs.at(i);
			DateTime = Nickname = IP = "";

			ifstream logfile(LogFilePath);

			logfile.seekg(0, logfile.end);
			logfileLength = (unsigned long)logfile.tellg();
			logfile.seekg(0, logfile.beg);

			for (unsigned long currentPos = 0; currentPos < logfileLength;){
				getline(logfile, buffer_logline);

				ID_string.clear();
				Nickname.clear();
				DateTime.clear();
				IP.clear();
				kickedByNickname.clear();
				kickedByUID.clear();
				kickReason.clear();
				banMatch = false;
				kickMatch = false;

				// Connection matches.
				if (buffer_logline.find(LOGMATCHCONNECT) != string::npos){
					NicknameStartPos = 77;

					IPStartPos = 1 + (unsigned int)buffer_logline.rfind(" ");
					IPLength = buffer_logline.length() - IPStartPos - 6; // - 6 for ignoring the port.

					IDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:");
					IDLength = IPStartPos - IDStartPos - 7;

					NicknameLength = IDStartPos - NicknameStartPos - 5;

					// Date & Time - just as a string until seperation.
					for (unsigned int j = 0; j < 19; j++){
						DateTime += buffer_logline[j];
					}

					// Nickname
					for (unsigned int j = 0; j < NicknameLength; j++){
						Nickname += buffer_logline[NicknameStartPos + j];
					}

					// ID
					for (unsigned int j = 0; j < IDLength; j++){
						ID_string += buffer_logline[IDStartPos + j];
					}

					// IP (if connecting)
					for (unsigned int j = 0; j < IPLength; j++){
						IP += buffer_logline[IPStartPos + j];
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

				// Disconnecting matches, including kick matches.
				else if (buffer_logline.find(LOGMATCHDISCONNECT) != string::npos){
					NicknameStartPos = 80;

					IDStartPos = (unsigned int)buffer_logline.rfind("'(id:") + 5;

					// Added to cover kick / ban disconnects as well
					if (buffer_logline.rfind(") reason 'reasonmsg") == string::npos){
						IDEndPos = (unsigned int)buffer_logline.rfind(") reason 'invokerid=");
						if (buffer_logline.rfind(" bantime=") != string::npos){
							banMatch = true;
						}
						else kickMatch = true;
					}
					else IDEndPos = (unsigned int)buffer_logline.rfind(") reason 'reasonmsg");

					IDLength = IDEndPos - IDStartPos;
					NicknameLength = IDStartPos - NicknameStartPos - 5;

					// Nickname
					for (unsigned int j = 0; j < NicknameLength; j++){
						Nickname += buffer_logline[NicknameStartPos + j];
					}

					// ID
					for (unsigned int j = 0; j < IDLength; j++){
						ID_string += buffer_logline[IDStartPos + j];
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

					if (kickMatch){
						if (buffer_logline.rfind(" reasonmsg=") != string::npos){
							kickReasonStartPos = 11 + buffer_logline.rfind(" reasonmsg=");
							for (unsigned int j = kickReasonStartPos; j < buffer_logline.size() - 1; j++){
								kickReason += buffer_logline[j];
							}
						}
						else kickReason = "";

						kickedByNicknameStartPos = 13 + buffer_logline.rfind(" invokername=");
						kickedByNicknameEndPos = buffer_logline.rfind(" invokeruid=");
						if (buffer_logline.find("invokeruid=serveradmin") == string::npos){
							kickedByUIDEndPos = buffer_logline.find("=", kickedByNicknameEndPos + 12) + 1;
						}
						else kickedByUIDEndPos = kickedByNicknameEndPos + 23;

						for (unsigned int j = 0; j < 19; j++){
							DateTime += buffer_logline[j];
						}

						for (unsigned j = kickedByNicknameStartPos; j < kickedByNicknameEndPos; j++){
							kickedByNickname += buffer_logline[j];
						}

						for (unsigned j = kickedByNicknameEndPos + 12; j < kickedByUIDEndPos; j++){
							kickedByUID += buffer_logline[j];
						}

						if (!IsDuplicateKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason)){
							KickList.resize(KickListID + 1);
							KickList[KickListID].addKick(DateTime, ID, Nickname, kickedByNickname, kickedByUID, kickReason);
							KickListID++;
						}
					}
				}

				// User Deletion matches.
				else if (buffer_logline.find(LOGMATCHDELETEUSER1) != string::npos){
					if (buffer_logline.find(LOGMATCHDELETEUSER2) != string::npos){
						IDEndPos = (unsigned int)buffer_logline.rfind(") got deleted by client '");
						IDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:", IDEndPos);
						IDLength = IDEndPos - IDStartPos;

						// ID
						for (unsigned int j = 0; j < IDLength; j++){
							ID_string += buffer_logline[IDStartPos + j];
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
