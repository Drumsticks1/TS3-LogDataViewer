// Constants.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {
    // Configuration json:
    configJSON: "../config.json",

    // XML output path and file name.
    outputXML: "../output.xml",

    // Program log path and file name.
    programLogfile: "/var/log/ts3-ldv.log",

    // Default settings that can be changed with the config.json.
    // Default logDirectory and virtual server.
    defaultLogDirectory: "/home/teamspeak/teamspeak3-server_linux-amd64/logs/",
    defaultVirtualServer: 1,

    // Buffer data between rebuildXML call.
    // Faster, but needs more buffer, you may want to disable this (via config.json) for machines with less RAM.
    bufferData: true,

    // Debugging options, keep them disabled for production.
    // Option for building a bigger xml which can be used for easier debugging than the release one-liner xml.
    debuggingXML: false
};
