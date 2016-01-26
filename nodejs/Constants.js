// Constants.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {
    // Configuration json:
    configJSON: "../config.json",

    // JSON output path and file name.
    outputJSON: "../output.json",

    // Program log path and file name.
    programLogfile: "/var/log/ts3-ldv.log",

    // Default settings that can be changed with the config.json.
    // Default logDirectory and virtual server.
    defaultLogDirectory: "/home/teamspeak/teamspeak3-server_linux-amd64/logs/",
    defaultVirtualServer: 1,

    // Buffer data between rebuildJSON calls for increased performance.
    bufferData: true
};
