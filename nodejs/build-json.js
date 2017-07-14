// build.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  data = require("./data.js"),
  log = require("./log.js"),
  fetchLogs = require("./fetch-logs.js"),
  Parser = require("./parser.js"),
  writeJSON = require("./write-json.js"),
  Constants = require("./constants.js"),
  miscFunctions = require("./misc-functions.js");

/**
 * Builds the JSON.
 * @param {boolean} clearBuffer if true: the buffer is cleared before the build
 * @returns {number} the according constants.tokens constant (see constants.js)
 */
module.exports = function (clearBuffer) {
  if (clearBuffer)
    miscFunctions.clearGlobalArrays();

  log.info(module, "Starting JSON build.");
  miscFunctions.setProgramStartDate();

  const fetchLogsReturn = fetchLogs();
  if (fetchLogsReturn === Constants.tokens.ERROR) {
    log.info(module, "The build function will now exit!\n");
    return Constants.tokens.ERROR;
  }

  const lastModification = fs.statSync(data.TS3LogDirectory + data.Logs[data.Logs.length - 1].logName).mtime.valueOf();

  if (fetchLogsReturn === Constants.tokens.REBUILD_REQUIRED)
    log.warn(module, "Rebuild required, log order changed or logs were deleted, skipping lastModification check.");

  else if (clearBuffer || data.disableLastModificationCheck)
    log.debug(module, "Skipping lastModification check.");

  else if (!fs.existsSync(Constants.outputJSON))
    log.debug(module, "Didn't find output.json, skipping lastModification check.");

  else if (lastModification === data.lastModificationOfTheLastLog) {
    log.info(module, "No modifications to the last log since the last request, stopping build process.");
    return Constants.tokens.NOT_NECESSARY;
  }

  data.lastModificationOfTheLastLog = lastModification;

  Parser.parseLogs();

  if (writeJSON() === Constants.tokens.ERROR) {
    return Constants.tokens.ERROR;
  }

  if (!data.bufferData) {
    miscFunctions.clearGlobalArrays();
    log.debug(module, "Cleared buffer arrays.");
  }

  miscFunctions.resetConnectedStates();

  log.info(module, "Finished JSON build (" + miscFunctions.getProgramRuntime() + " ms).");
  return Constants.tokens.SUCCESS;
};