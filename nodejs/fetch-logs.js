// fetch-logs.js: Fetching of the log files.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  constants = require("./constants.js"),
  data = require("./data.js"),
  log = require("./log.js"),
  checkFunctions = require("./check-functions.js"),
  miscFunctions = require("./misc-functions.js");

/**
 * Fetches the logs.
 * @returns {number} the according constants.tokens.fetch_logs constant (see constants.js)
 */
module.exports = function () {
  log.debug(module, "Checking log directory.");
  let rebuildRequired = false;

  try {
    if (!fs.statSync(data.TS3LogDirectory).isDirectory()) {
      log.warn(module, "The log directory seems not to be a directory!");
      return constants.tokens.ERROR;
    }
  }
  catch (error) {
    log.error(module, "An error occurred while fetching the logs:\n\t" + error.message);
    return constants.tokens.ERROR;
  }

  let logFiles;
  try {
    logFiles = fs.readdirSync(data.TS3LogDirectory);
  } catch (error) {
    log.error(module, "An error occurred while reading the directory:\n\t" + error.message);
  }

  const newLogObjects = [];

  log.debug(module, "Fetching logs.");
  for (let i = 0; i < logFiles.length; i++) {
    if (logFiles[i].endsWith(String(data.virtualServer) + ".log")) {
      newLogObjects.push({
        logName: logFiles[i],
        ignored: checkFunctions.isIgnoredLog(logFiles[i]),
        parsed: false
      });
    }
  }

  if (newLogObjects.length === 0) {
    log.warn(module, "The log directory contains no valid logs for the specified virtual server.");
    return constants.tokens.ERROR;
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

  if (data.bufferData) {
    if (checkFunctions.isMatchingLogOrder(newLogObjects)) {
      log.debug(module, "Comparing new and old logs.");

      // The last parsed log might contain new data, don't modify it's parsed state.
      for (let i = 0; i < data.Logs.length - 1; i++) {
        newLogObjects[i].parsed = data.Logs[i].parsed;
      }
    }
    else {
      log.warn(module, "Logs parsed for the last json build were deleted or the log order changed, clearing buffered data.");
      rebuildRequired = true;
      miscFunctions.clearGlobalArrays();
    }
  }

  data.Logs = newLogObjects;

  if (rebuildRequired)
    return constants.tokens.REBUILD_REQUIRED;
  else
    return constants.tokens.SUCCESS;
};