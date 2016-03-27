// Constants.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {
  // Configuration JSON:
  confJSON: "../conf/conf.json",

  // JSON output path and file name.
  outputJSON: "../output.json",

  // The following settings can be overwritten in the conf.json.
  // Program log path and file name.
  programLogfile: "/var/log/ts3-ldv/ts3-ldv.log",

  // Default logDirectory and virtual server.
  logDirectory: "/home/teamspeak/teamspeak3-server_linux_amd64/logs/",
  virtualServer: 1,

  // Buffer data between buildJSON calls for increased performance.
  bufferData: true,

  // Minimum time between builds, number in milliseconds.
  timeBetweenBuilds: 2000,

  // Disables the check that checks if the last log has changed since the last build, used for debugging.
  disableLastModificationCheck: false,

  // Port on which the program listens.
  usedPort: 3000,

  // Log level, see log.js for a list of the possible options.
  logLevel: 2
};
