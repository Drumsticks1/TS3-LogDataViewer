// Constants.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {
    // Configuration json:
    configJSON: "../config.json",

    // JSON output path and file name.
    outputJSON: "../output.json",

    // The following settings can be overwritten in the config.json.
    // Program log path and file name.
    programLogfile: "/var/log/ts3-ldv/ts3-ldv.log",

    // Default logDirectory and virtual server.
    logDirectory: "/home/teamspeak/teamspeak3-server_linux-amd64/logs/",
    virtualServer: 1,

    // Buffer data between rebuildJSON calls for increased performance.
    bufferData: true,

    // Minimum time between rebuilds, number in milliseconds.
    timeBetweenRebuilds: 5000,

    // Port on which the program listens.
    usedPort: 3000
};
