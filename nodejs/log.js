// log.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require('fs'),
  globalVariables = require("./globalVariables.js"),
  miscFunctions = require("./miscFunctions.js"),
  path = require("path");

let programLogfile;
const logBuffer = [];

/**
 * Description of the different log levels:
 * error: only used when an error occurred that the program can't recover from and has to abort
 * warn: used when something happened/was detected that is probably undesired behaviour or may lead to errors in the future
 * info: basic information (e.g. the program startup, a successful build)
 * debug: additional logging (e.g. more details about the program flow)
 * @type {{error: number, warn: number, info: number, debug: number}}
 */
const logLevel = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3
};

/**
 * Logs the message to the specified programLogfile.
 * Adds the current UTC time before and \n after the message.
 * If the programLogfile (write stream) is undefined the message is instead stored in the logBuffer array.
 *
 * @param {string} message the message to be logged
 * @param {number} logLevel
 * @param {boolean} alreadyProcessed
 */
/**
 *
 * @param timestamp
 * @param level
 * @param module
 * @param message
 */
/**
 * Logs the information to the programLogfile (write stream).
 * If the writeStream is undefined, the information is instead stored in the logBuffer array and logged as soon as the
 * writeStream is created.
 *
 * Format:  "timestamp|logLevelString|moduleName|message"
 * Example: "01.01.1970 00:00:00|INFO|app.js|Program Startup"
 * @param timestamp
 * @param level
 * @param module
 * @param message
 */
function log(timestamp, level, module, message) {
  // Buffer log messages prior to calling the updateWriteStream function
  if (programLogfile === undefined) {
    logBuffer.push([timestamp, level, module, message]);
    return;
  }

  // Only log if above the minim
  if (level > globalVariables.logLevel)
    return;

  let logLevelString;
  switch (level) {
    case logLevel.error:
      logLevelString = "ERROR";
      break;
    case logLevel.warn:
      logLevelString = "WARN";
      break;
    case logLevel.info:
      logLevelString = "INFO";
      break;
    case logLevel.debug:
      logLevelString = "DEBUG";
      break;
    default:
      logLevelString = "UNKNOWN";
  }

  programLogfile.write(timestamp + "|" + logLevelString + "|" + path.basename(module.filename) + "|" + message + "\n");
}

module.exports = {

  /**
   * Updates the programLogfile write stream.
   * Logs the logBuffer entries after updating the write stream.
   * Required when the log file get deleted while the process is running or when the programLogfile paths changed.
   */
  updateWriteStream: function () {
    programLogfile = fs.createWriteStream(globalVariables.programLogfile, {flags: 'a'});

    while (logBuffer.length > 0) {
      const buff = logBuffer.shift();
      log(buff[0], buff[1], buff[2], buff[3]);
    }
  },

  error: function (module, message) {
    log(miscFunctions.getCurrentUTC(), logLevel.error, module, message);
  },

  warn: function (module, message) {
    log(miscFunctions.getCurrentUTC(), logLevel.warn, module, message);
  },

  info: function (module, message) {
    log(miscFunctions.getCurrentUTC(), logLevel.info, module, message);
  },

  debug: function (module, message) {
    log(miscFunctions.getCurrentUTC(), logLevel.debug, module, message);
  }
};
