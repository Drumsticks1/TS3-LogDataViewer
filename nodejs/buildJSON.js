// main.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    globalVariables = require("./globalVariables.js"),
    outputHandler = require("./outputHandler.js"),
    fetchLogs = require("./fetchLogs.js"),
    parseLogs = require("./parseLogs.js"),
    createJSON = require("./createJSON.js"),
    miscFunctions = require("./miscFunctions.js");

/**
 * Builds the JSON.
 * @returns {number}
 *      0 if fetching the logs fails.
 *      1 if building the json completes successfully.
 *      2 if building wasn't necessary because there are no new log lines.
 */
exports.buildJSON = function() {
    var programStart = new Date();

    miscFunctions.updateCurrentDate();
    outputHandler.updateWriteStream();
    outputHandler.output("\n" + miscFunctions.getCurrentUTC() + " (UTC)\n" + miscFunctions.getCurrentLocaltime() + " (Local time)\n");

    if (!fetchLogs.fetchLogs()) {
        outputHandler.output("The build function will now exit!");
        return 0;
    }

    var lastModification = fs.statSync(globalVariables.logDirectory + globalVariables.Logs[globalVariables.Logs.length - 1]).mtime.valueOf();

    if (lastModification == globalVariables.lastModificationOfTheLastLog) {
        outputHandler.output("No modifications to the last log since the last request - skipping building a new json!");
        return 2;
    }

    globalVariables.lastModificationOfTheLastLog = lastModification;

    parseLogs.parseLogs();
    createJSON.createJSON();

    if (!globalVariables.bufferData) {
        miscFunctions.clearGlobalArrays();
        outputHandler.output("Cleared buffer arrays...");
    }

    miscFunctions.resetConnectedStates();

    outputHandler.output("Program runtime: " + miscFunctions.getProgramRuntime(programStart) + " ms.");
    return 1;
};