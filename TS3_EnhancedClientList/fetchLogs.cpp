// fetchLogs.cpp : Fetching of the log files.

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <boost/filesystem.hpp>
#include "Constants.h"

using namespace boost::filesystem;
using namespace std;

vector <string> Logs;

// Fetches the list of log files that are in the log directory and saves it in a vector.
bool fetchLogs(string LOGDIRECTORY){
	cout << "Fetching logs..." << endl;

	path log_directory(LOGDIRECTORY);
	if (exists(log_directory)){
		if (is_directory(log_directory)){
			if (!boost::filesystem::is_empty(log_directory)){
				directory_iterator LogDirectory(LOGDIRECTORY);
				while (LogDirectory != directory_iterator()){
					if (is_regular_file(LogDirectory->status()) && !boost::filesystem::is_empty(LogDirectory->path()) && LogDirectory->path().extension() == ".log"){
						// Filters out the unneccesary .ts3server_xxxx-xx-xx__xx_xx_xx.xxxxxx_0 logs.
						if (LogDirectory->path().filename().string().at(38) == '1'){
							Logs.push_back((LogDirectory->path().filename().string()));
						}
					}
					LogDirectory++;
				}
			}
			else{
				cout << "The log directory is empty." << endl;
				return false;
			}
		}
		else{
			cout << "The log directory isn't a directory." << endl;
			return false;
		}
	}
	else{
		cout << "The log directory doesn't exist." << endl;
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