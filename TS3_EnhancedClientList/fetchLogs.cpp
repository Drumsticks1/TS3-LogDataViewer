// fetchLogs.cpp : Fetching of the log files.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <boost/filesystem.hpp>
#include "Constants.h"
#include "checkFunctions.h"

using namespace boost::filesystem;
using namespace std;

vector <string> Logs;
vector <string> ignoreLogs;

// Fetches the list of log files that are in the log directory and saves it in a vector.
bool fetchLogs(string LOGDIRECTORY){
	cout << "Fetching logs..." << endl;

	path log_directory(LOGDIRECTORY);
	try{
		if (exists(log_directory)){
			if (is_directory(log_directory)){
				if (!boost::filesystem::is_empty(log_directory)){
					string LogignorePath = LOGDIRECTORY + "logignore";
					if (is_regular_file(LogignorePath)){
						if (!boost::filesystem::is_empty(LogignorePath)){
							ifstream logignore(LogignorePath);
							unsigned int logignoreLength;
							string buffer_logignore;

							logignore.seekg(0, logignore.end);
							logignoreLength = (unsigned long)logignore.tellg();
							logignore.seekg(0, logignore.beg);

							for (unsigned long i = 0; i < logignoreLength;){
								getline(logignore, buffer_logignore);
								i += buffer_logignore.size() + 2;
								ignoreLogs.push_back(buffer_logignore);
							}
						}
						else cout << "The logignore seems to be empty - skipping ..." << endl;
					}
					else cout << "No valid logignore found - skipping ..." << endl;
					
					directory_iterator LogDirectory(LOGDIRECTORY);
					while (LogDirectory != directory_iterator()){
						if (is_regular_file(LogDirectory->status()) && !boost::filesystem::is_empty(LogDirectory->path()) && LogDirectory->path().extension() == ".log"){
							if (LogDirectory->path().filename().string().at(38) == '1' && !IsIgnoredLog(LogDirectory->path().filename().string())){
								Logs.push_back((LogDirectory->path().filename().string()));
							}
						}
						LogDirectory++;
					}
				}
				else{
					cout << "The log directory seems to be empty." << endl;
					return false;
				}
			}
			else{
				cout << "The log directory seems not to be a directory." << endl;
				return false;
			}
		}
		else{
			cout << "The log directory seems not to exist." << endl;
			return false;
		}
	}
	catch (const filesystem_error& error){
		cout << "An error ocurred while fetching the logfiles:" << endl
			<< error.what() << endl;
		return false;
	}

	if (Logs.size() == 0){
		cout << "The log directory contains no valid logs." << endl;
		return false;
	}

	cout << "Sorting logs..." << endl;
	sort(Logs.begin(), Logs.end());
	return true;
}