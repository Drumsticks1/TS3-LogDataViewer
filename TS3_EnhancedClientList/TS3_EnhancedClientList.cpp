// TS3_EnhancedClientList.cpp
//
// Author:
// Date:	

#include "fetchLogfiles.h"
#include "readLogs.h"
#include "createXML.h"

int main(){
	fetchLogfiles();
	readLogs();
	createXML();
	return 0;
}