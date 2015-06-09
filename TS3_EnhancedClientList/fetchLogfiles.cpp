// fetchLogfiles.cpp : 

#include <iostream>
#include <string>
#include <boost/filesystem.hpp>
#include "Constants.h"

using namespace boost::filesystem;
using namespace std;

vector <string> LogFiles;

// Fetches the list of log files in the log directory and saves it in a vector.
void fetchLogfiles(){
	directory_iterator LogDirectory(LOGDIRECTOY);
	while (LogDirectory != directory_iterator()){
		LogFiles.push_back((LogDirectory->path().string()));
			LogDirectory++;
	}
}