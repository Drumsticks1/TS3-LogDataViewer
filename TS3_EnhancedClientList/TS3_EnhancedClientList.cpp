// TS3_EnhancedClientList.cpp
//
// Author:
// Date:	

#include <iostream>
#include "fetchLogs.h"
#include "parseXML.h"
#include "parseLogs.h"
#include "createXML.h"

using namespace std;

bool validXML = false;

int main(int argc, char* argv[]){
	string LOGDIRECTORY;
	if (argc > 1){ LOGDIRECTORY = argv[1]; }
	else{ LOGDIRECTORY = "./logs/"; }

	if (!fetchLogs(LOGDIRECTORY)){
		cout << "The program will now exit." << endl;
		return 0;
	}
	
	if (!parseXML()){
		cout << "No valid XML found... " << endl;
	}
	else validXML = true;

	parseLogs(LOGDIRECTORY);
	createXML();
	return 0;
}