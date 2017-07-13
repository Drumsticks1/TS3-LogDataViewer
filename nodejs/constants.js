// constants.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {
  // Configuration JSON
  confJSON: "../local/conf.json",

  // JSON output file
  outputJSON: "../local/output.json",

  // Communication tokens used for human-readable communication between methods
  tokens: {
    build_json: {
      // the json build was successful
      SUCCESS: 0,
      // building was not necessary (no new log lines since the last build)
      NOT_NECESSARY: 1,
      // fetching the logs in fetch-logs.js failed
      ERROR_LOG_FETCHING: 2
    }, fetch_logs: {
      // the log fetching was successful
      SUCCESS: 0,
      // the log fetching was successful but a rebuild is required
      REBUILD_REQUIRED: 1,
      // fetching the logs failed
      ERROR_LOG_FETCHING: 2,
    }
  },

  /**
   * OVERWRITABLE SETTINGS
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
