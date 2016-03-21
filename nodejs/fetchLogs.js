// fetchLogs.js: Fetching of the log files.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  globalVariables = require("./globalVariables.js"),
  log = require("./log.js"),
  checkFunctions = require("./checkFunctions.js"),
  miscFunctions = require("./miscFunctions.js");

/**
 * Fetches the logs.
 * @returns {boolean} true if no error occurred.
 */
exports.fetchLogs = function () {
  log.info("Checking log directory.");

  try {
    if (!fs.statSync(globalVariables.logDirectory).isDirectory()) {
      log.warn("The log directory seems not to be a directory.");
      return false;
    }
  }
  catch (error) {
    log.error("An error occurred while fetching the logs:\n\t" + error.message);
    return false;
  }

  try {
    var logFiles = fs.readdirSync(globalVariables.logDirectory);
  } catch (error) {
    log.error("An error occurred while reading the directory:\n\t" + error.message);
  }

  if (logFiles.length == 0) {
    log.warn("The log directory contains no valid logs.");
    return false;
  }

  var newLogObjects = [];

  log.info("Fetching logs.");
  for (var i = 0; i < logFiles.length; i++) {
    var currentLog = logFiles[i];
    if (currentLog.lastIndexOf(".log") == currentLog.length - 4
      && currentLog.substring(38, currentLog.length - 4) == String(globalVariables.virtualServer)) {
      newLogObjects.push({
        logName: currentLog,
        ignored: checkFunctions.isIgnoredLog(currentLog),
        parsed: false
      });
    }
  }

  log.info("Sorting logs.");
  newLogObjects.sort(
    /**
     * Custom sort function for the newLogObjects array, using logNames for sorting.
     * @param {object} a
     * @param {object} b
     * @returns {number}
     */
    function (a, b) {
      return a.logName.localeCompare(b.logName);
    });

  if (globalVariables.bufferData) {
    if (checkFunctions.isMatchingLogOrder(newLogObjects)) {
      log.debug("Comparing new and old logs.");

      // The last parsed log might contain new data, don't modify it's ignored state.
      for (i = 0; i < globalVariables.Logs.length - 1; i++) {
        newLogObjects[i].parsed = globalVariables.Logs[i].parsed;
      }
    }
    else {
      log.warn("Logs parsed for the last json build were deleted or the log order changed, clearing buffered data.");
      miscFunctions.clearGlobalArrays();
    }
  }

  globalVariables.Logs.length = 0;
  for (i = 0; i < newLogObjects.length; i++) {
    globalVariables.Logs.push(newLogObjects[i]);
  }

  return true;
};