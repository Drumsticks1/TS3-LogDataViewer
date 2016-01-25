// Constants.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {
    // XML output path and file name.
    outputXML: "../output.xml",

    // Program log path and file name.
    programLogfile: "/var/log/ts3-ldv.log",

    // Default logDirectory and virtual server.
    defaultLogDirectory: "/home/teamspeak/teamspeak3-server_linux-amd64/logs/",
    defaultVirtualServer: 1,

    // Buffer data for the next rebuildXML call.
    bufferData: true,

    // Debugging options, default option for release versions should always be false:
    // Option for building a bigger xml which can be used for easier debugging than the release one-liner xml.
    debuggingXML: false
};
