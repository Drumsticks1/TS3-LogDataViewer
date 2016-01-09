// Constants.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer
#pragma once

// XML output file.
#define XMLFILE "output.xml"

// Program log file.
#define PROGRAMLOGFILE "TS3-LDV.log"

// Default logdirectory and virtual server.
#define DEFAULTLOGDIRECTORY "./logs/"
#define DEFAULTVIRTUALSERVER 1

// Lockfile expiration time (in seconds).
#define LOCKFILEEXPIRATION 300

// Debugging options, default option for release versions should always be false:
// Option for skipping the lockfile check 
#define SKIPLOCKFILE true
// Option for building a bigger xml which can be used for easier debugging than the release one-liner xml.
#define DEBUGGINGXML true
