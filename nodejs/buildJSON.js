// main.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  globalVariables = require("./globalVariables.js"),
  log = require("./log.js"),
  fetchLogs = require("./fetchLogs.js"),
  parseLogs = require("./parseLogs.js"),
  createJSON = require("./createJSON.js"),
  Constants = require("./Constants.js"),
  miscFunctions = require("./miscFunctions.js");

/**
 * Builds the JSON.
 * @param {boolean} ignoreLastModificationCheck the lastModification check is ignored if true
 * @returns {number}
 *      0 if fetching the logs fails.
 *      1 if building the json completes successfully.
 *      2 if building wasn't necessary because there are no new log lines.
 */
exports.buildJSON = function (ignoreLastModificationCheck) {
  miscFunctions.setProgramStartDate();
  log.info("Processing build request.");

  if (!fetchLogs.fetchLogs()) {
    log.info("The build function will now exit!\n");
    return 0;
  }

  var lastModification = fs.statSync(globalVariables.logDirectory + globalVariables.Logs[globalVariables.Logs.length - 1].logName).mtime.valueOf();

  if (fs.existsSync(Constants.outputJSON)) {
    if (!ignoreLastModificationCheck) {
      if (lastModification == globalVariables.lastModificationOfTheLastLog) {
        log.info("No modifications to the last log since the last request, stopping build process.\n");
        return 2;
      }
    } else
      log.debug("Skipping lastModification check.");
  } else
    log.debug("Didn't find output.json, skipping lastModification check.");

  globalVariables.lastModificationOfTheLastLog = lastModification;

  parseLogs.parseLogs();
  createJSON.createJSON();

  if (!globalVariables.bufferData) {
    miscFunctions.clearGlobalArrays();
    log.debug("Cleared buffer arrays.");
  }

  miscFunctions.resetConnectedStates();

  log.info("Build process runtime: " + miscFunctions.getProgramRuntime() + " ms.\n");
  return 1;
};