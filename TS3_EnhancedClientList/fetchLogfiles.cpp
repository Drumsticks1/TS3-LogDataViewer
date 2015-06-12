// fetchLogfiles.cpp : [Description pending]

#include <iostream>
#include <string>
#include <boost/filesystem.hpp>
#include "Constants.h"

using namespace boost::filesystem;
using namespace std;

vector <string> LogFiles;

// Fetches the list of log files in the log directory and saves it in a vector.
void fetchLogfiles(string LOGDIRECTORY){
	cout << "Fetching logfiles..." << endl;

	path log_directory(LOGDIRECTORY);
	if (exists(log_directory)){
		if (is_directory(log_directory)){
			if (!boost::filesystem::is_empty(log_directory)){
				directory_iterator LogDirectory(LOGDIRECTORY);
				while (LogDirectory != directory_iterator()){
					// Filters out the unneccesary .ts3server_xxxx-xx-xx__xx_xx_xx.xxxxxx_1 logs.)
					if (LogDirectory->path().filename().string().at(38) == '1'){
						LogFiles.push_back((LogDirectory->path().filename().string()));
					}
					LogDirectory++;
				}
			}
			else cout << "The log directory is empty." << endl;
		}
		// Change output.
		else cout << "The log directory isn't a directory." << endl;
	}
	else cout << "The log directory doesn't exist." << endl;
}