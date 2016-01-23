// Constants.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {
    // XML output file.
    XMLFILE: "output.xml",

    // Program log file.
    PROGRAMLOGFILE: "TS3-LDV.log",

    // Default logdirectory and virtual server.
    DEFAULTLOGDIRECTORY: "./logs/",
    DEFAULTVIRTUALSERVER: 1,

    // Lockfile expiration time (in seconds).
    LOCKFILEEXPIRATION: 300,

    // Debugging options, default option for release versions should always be false:
    // Option for skipping the lockfile check
    SKIPLOCKFILE: true,
    // Option for building a bigger xml which can be used for easier debugging than the release one-liner xml.
    DEBUGGINGXML: false
};

