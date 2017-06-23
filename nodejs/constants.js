// constants.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {
  // Configuration JSON
  confJSON: "../local/conf.json",

  // JSON output file
  outputJSON: "../local/output.json",

  /**
   * USER CONFIGURABLE SETTINGS
   * The following settings can be modified in an optional configuration json file (see confJSON above for the path)
   **/

  // Program log file
  programLogfile: "../local/ts3-ldv.log",

  // TeamSpeak3 log directory and virtual server.
  TS3LogDirectory: "/home/teamspeak/teamspeak3-server_linux_amd64/logs/",
  virtualServer: 1,

  // Buffer data between buildJSON calls for increased performance.
  bufferData: true,

  // Minimum time between requests, time in milliseconds.
  timeBetweenRequests: 2000,

  // Disables the check that checks if the last log has changed since the last build, used for debugging.
  disableLastModificationCheck: false,

  // Port on which the program listens.
  usedPort: 3000,

  // Log level, see log.js for a list of the possible options.
  logLevel: 2
};
