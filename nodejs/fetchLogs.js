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
 * @returns {number}
 * 0 --> error occurred
 * 1 --> No rebuild needed, no logs deleted, no changed log order
 * 2 --> Rebuild required, isMatchingLogOrder failed
 */
exports.fetchLogs = function () {
  log.debug(module, "Checking log directory.");
  let rebuildRequired = false;

  try {
    if (!fs.statSync(globalVariables.TS3LogDirectory).isDirectory()) {
      log.warn(module, "The log directory seems not to be a directory!");
      return 0;
    }
  }
  catch (error) {
    log.error(module, "An error occurred while fetching the logs:\n\t" + error.message);
    return 0;
  }

  let logFiles;
  try {
    logFiles = fs.readdirSync(globalVariables.TS3LogDirectory);
  } catch (error) {
    log.error(module, "An error occurred while reading the directory:\n\t" + error.message);
  }

  const newLogObjects = [];

  log.debug(module, "Fetching logs.");
  for (let i = 0; i < logFiles.length; i++) {
    if (logFiles[i].endsWith(String(globalVariables.virtualServer) + ".log")) {
      newLogObjects.push({
        logName: logFiles[i],
        ignored: checkFunctions.isIgnoredLog(logFiles[i]),
        parsed: false
      });
    }
  }

  if (newLogObjects.length === 0) {
    log.warn(module, "The log directory contains no valid logs for the specified virtual server.");
    return 0;
  }

  log.debug(module, "Sorting logs.");
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
      log.debug(module, "Comparing new and old logs.");

      // The last parsed log might contain new data, don't modify it's parsed state.
      for (let i = 0; i < globalVariables.Logs.length - 1; i++) {
        newLogObjects[i].parsed = globalVariables.Logs[i].parsed;
      }
    }
    else {
      log.warn(module, "Logs parsed for the last json build were deleted or the log order changed, clearing buffered data.");
      rebuildRequired = true;
      miscFunctions.clearGlobalArrays();
    }
  }

  globalVariables.Logs = newLogObjects;

  return rebuildRequired ? 2 : 1;
};