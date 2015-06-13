// TS3_EnhancedClientList.cpp
//
// Author:
// Date:	

#include <iostream>
#include "fetchLogs.h"
#include "parseLogs.h"
#include "createXML.h"

using namespace std;

int main(int argc, char* argv[]){
	string LOGDIRECTORY;
	if (argc > 1){ LOGDIRECTORY = argv[1]; }
	else{ LOGDIRECTORY = "./logs/"; }

	if (!fetchLogs(LOGDIRECTORY)){
		cout << "The programm will now exit.";
		return 0;
	}
	parseLogs(LOGDIRECTORY);
	createXML();
	return 0;
}