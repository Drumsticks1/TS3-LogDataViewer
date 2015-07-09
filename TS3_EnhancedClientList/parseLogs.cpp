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
#include "File.h"
#include "checkFunctions.h"

using namespace std;

extern vector <User> UserList;
extern vector <string> Logs;
extern vector <string> parsedLogs;
extern vector <Kick> KickList;
extern vector <File> FileList;
extern bool validXML;

// DEV: Make compatible with multiple virtual servers.
//		How many virtual servers are possible ?
#define LOGMATCHCONNECT			"|INFO    |VirtualServerBase|  1| client connected '"
#define LOGMATCHDISCONNECT		"|INFO    |VirtualServerBase|  1| client disconnected '"
#define LOGMATCHDELETEUSER1		"|INFO    |VirtualServer |  1| client '"
#define LOGMATCHDELETEUSER2		") got deleted by client '"
#define LOGMATCHFILEUPLOAD			"|INFO    |VirtualServer |  1| file upload to ("
#define LOGMATCHFILEDOWNLOAD		"|INFO    |VirtualServer |  1| file download from ("
#define LOGMATCHFILERENAMEDMOVED	"|INFO    |VirtualServer |  1| file renamed/moved from ("
#define LOGMATCHFILEDELETION			"|INFO    |VirtualServer |  1| file deleted from ("

// Parses the logs and stores the data in the UserList.
void parseLogs(string LOGDIRECTORY){
	string buffer_logline, buffer_XMLInfoInput, LogFilePath, DateTime, Nickname, ID_string, IP, kickedByNickname, kickedByUID, kickReason, uploadDateTime, channelID_string, filename, uploadedByNickname, uploadedByID_string;
	unsigned int ID, KickListID, FileListID, NicknameLength, IDLength, IPLength, IDStartPos, IDEndPos, NicknameStartPos, IPStartPos, kickReasonStartPos, kickedByNicknameStartPos, kickedByNicknameEndPos, kickedByUIDEndPos, channelIDEndPos, filenameEndPos, uploadedByIDStartPos;
	unsigned long logfileLength;
	bool kickMatch;

	if (KickList.size() > 0) KickListID = KickList.size();
	else KickListID = 0;

	if (FileList.size() > 0) FileListID = FileList.size();
	else FileListID = 0;

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
				kickMatch = false;
				uploadDateTime.clear();
				channelID_string.clear();
				filename.clear();
				uploadedByNickname.clear();
				uploadedByID_string.clear();

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

					if (UserList[ID].getID() != ID){
						UserList[ID].addID(ID);
					}
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

				// Disconnecting matches, including kick and ban matches.
				else if (buffer_logline.find(LOGMATCHDISCONNECT) != string::npos){
					NicknameStartPos = 80;

					IDStartPos = (unsigned int)buffer_logline.rfind("'(id:") + 5;

					if (buffer_logline.rfind(") reason 'reasonmsg") == string::npos){
						IDEndPos = (unsigned int)buffer_logline.rfind(") reason 'invokerid=");
						if (buffer_logline.rfind(" bantime=") == string::npos){
							kickMatch = true;
						}
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

					// kick matches.
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

				/* DEV: File transfer loglines:
				2013-11-13 16:10:50.316177|INFO    |VirtualServer |  1| file upload to (id:4), '/ts3_recording_13_11_13_17_9_6.wav' by client 'drumstick'(id:3)
				2013-11-13 16:11:08.080776|INFO    |VirtualServer |  1| file download from (id:4), '/ts3_recording_13_11_13_17_9_6.wav' by client 'Helloagain'(id:5)
				2013-11-13 16:11:57.708621|INFO    |VirtualServer |  1| file download from (id:4), '/ts3_recording_13_11_13_17_9_6.wav' by client 'Helloagain'(id:5)
				2013-11-13 16:12:40.740670|INFO    |VirtualServer |  1| file renamed/moved from (id:4), 'files/virtualserver_1/channel_4//ts3_recording_13_11_13_17_9_6.wav' to (id:4)
				2013-11-22 16:39:58.898810|INFO    |VirtualServer |  1| file deleted from (id:4), 'files/virtualserver_1/channel_4//ts3_recording_13_11_22_17_34_18.wav' by client 'Helloagain'(id:5)
				*/

				else if (buffer_logline.find(LOGMATCHFILEUPLOAD) != string::npos){
					channelIDEndPos = (unsigned int)buffer_logline.find(")");
					filenameEndPos = (unsigned int)buffer_logline.rfind("' by client '");
					uploadedByIDStartPos = 5 + (unsigned int)buffer_logline.rfind("'(id:");

					for (unsigned int j = 0; j < 19; j++){
						uploadDateTime += buffer_logline[j];
					}

					for (unsigned int j = 75; j < channelIDEndPos; j++){
						channelID_string += buffer_logline[j];
					}

					for (unsigned int j = channelIDEndPos + 4; j < filenameEndPos; j++){
						filename += buffer_logline[j];
					}

					for (unsigned int j = filenameEndPos + 13; j < uploadedByIDStartPos - 5; j++){
						uploadedByNickname += buffer_logline[j];
					}

					for (unsigned int j = uploadedByIDStartPos; j < buffer_logline.size() - 1; j++){
						uploadedByID_string += buffer_logline[j];
					}

					if (!IsDuplicateFile(uploadDateTime, stoul(channelID_string), filename, uploadedByNickname, stoul(uploadedByID_string))){
						FileList.resize(FileListID + 1);
						FileList[FileListID].uploadFile(uploadDateTime, stoul(channelID_string), filename, uploadedByNickname, stoul(uploadedByID_string));
						FileListID++;
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
