// TS3_EnhancedClientList.cpp
//
// Author:
// Date:	

#include <iostream>
#include "fetchLogfiles.h"
#include "readLogs.h"
#include "createXML.h"

using namespace std;

int main(int argc, char* argv[]){
	string LOGDIRECTORY;
	if (argc > 1){ LOGDIRECTORY = argv[1]; }
	else{ LOGDIRECTORY = "./logs/"; }

	fetchLogfiles(LOGDIRECTORY);
	readLogs(LOGDIRECTORY);
	createXML();
	return 0;
}