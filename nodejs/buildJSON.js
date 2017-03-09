// main.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  globalVariables = require("./globalVariables.js"),
  log = require("./log.js"),
  fetchLogs = require("./fetchLogs.js"),
  Parser = require("./Parser.js"),
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

  var rebuildRequired = false;
  switch (fetchLogs.fetchLogs()) {
    case 0:
      log.info("The build function will now exit!\n");
      return 0;

    case 1:
      break;

    case 2:
      rebuildRequired = true;
  }

  var lastModification = fs.statSync(globalVariables.TS3LogDirectory + globalVariables.Logs[globalVariables.Logs.length - 1].logName).mtime.valueOf();

  if (rebuildRequired)
    log.warn("Rebuild required, log order changed or logs were deleted, skipping lastModification check.");

  else if (ignoreLastModificationCheck || globalVariables.disableLastModificationCheck)
    log.debug("Skipping lastModification check.");

  else if (!fs.existsSync(Constants.outputJSON))
    log.debug("Didn't find output.json, skipping lastModification check.");

  else if (lastModification == globalVariables.lastModificationOfTheLastLog) {
    log.info("No modifications to the last log since the last request, stopping build process.\n");
    return 2;
  }

  globalVariables.lastModificationOfTheLastLog = lastModification;

  Parser.parseLogs();
  createJSON.createJSON();

  if (!globalVariables.bufferData) {
    miscFunctions.clearGlobalArrays();
    log.debug("Cleared buffer arrays.");
  }

  miscFunctions.resetConnectedStates();

  log.info("Build process runtime: " + miscFunctions.getProgramRuntime() + " ms.\n");
  return 1;
};