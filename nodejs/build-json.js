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
 * @returns {number}
 *      0 if fetching the logs fails.
 *      1 if building the json completes successfully.
 *      2 if building wasn't necessary because there are no new log lines.
 */
module.exports = function (clearBuffer) {
  if (clearBuffer)
    miscFunctions.clearGlobalArrays();

  log.info(module, "Starting JSON build.");
  miscFunctions.setProgramStartDate();

  let rebuildRequired = false;
  switch (fetchLogs()) {
    case 0:
      log.info(module, "The build function will now exit!\n");
      return 0;

    case 1:
      break;

    case 2:
      rebuildRequired = true;
  }

  const lastModification = fs.statSync(data.TS3LogDirectory + data.Logs[data.Logs.length - 1].logName).mtime.valueOf();

  if (rebuildRequired)
    log.warn(module, "Rebuild required, log order changed or logs were deleted, skipping lastModification check.");

  else if (clearBuffer || data.disableLastModificationCheck)
    log.debug(module, "Skipping lastModification check.");

  else if (!fs.existsSync(Constants.outputJSON))
    log.debug(module, "Didn't find output.json, skipping lastModification check.");

  else if (lastModification === data.lastModificationOfTheLastLog) {
    log.info(module, "No modifications to the last log since the last request, stopping build process.");
    return 2;
  }

  data.lastModificationOfTheLastLog = lastModification;

  Parser.parseLogs();
  writeJSON();

  if (!data.bufferData) {
    miscFunctions.clearGlobalArrays();
    log.debug(module, "Cleared buffer arrays.");
  }

  miscFunctions.resetConnectedStates();

  log.info(module, "Finished JSON build (" + miscFunctions.getProgramRuntime() + " ms).");
  return 1;
};