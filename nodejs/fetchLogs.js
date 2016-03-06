// fetchLogs.js: Fetching of the log files.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    util = require("util"),
    Constants = require("./Constants.js"),
    globalVariables = require("./globalVariables.js"),
    outputHandler = require("./outputHandler.js"),
    checkFunctions = require("./checkFunctions.js");

/**
 * Fetches the logs.
 * @returns {boolean} true if no error occurred.
 */
exports.fetchLogs = function() {
    outputHandler.output("Checking log directory...");
    globalVariables.Logs.length = 0;

    try {
        if (!fs.statSync(globalVariables.logDirectory).isDirectory()) {
            outputHandler.output("The log directory seems not to be a directory.");
            return false;
        }

        try {
            var logFiles = fs.readdirSync(globalVariables.logDirectory);

            if (logFiles.length > 0) {
                outputHandler.output("Fetching logs...");
                for (var i = 0; i < logFiles.length; i++) {
                    if (logFiles[i].lastIndexOf(".log") == logFiles[i].length - 4
                        && logFiles[i].substring(38, logFiles[i].length - 4) == String(globalVariables.virtualServer)
                        && !checkFunctions.isIgnoredLog(logFiles[i])) {
                        globalVariables.Logs.push(logFiles[i]);
                    }
                }
            } else
                outputHandler.output("The log directory seems to be empty.");

        } catch (error) {
            outputHandler.output("An error occurred while reading the director:\n" + error.message);
        }
    }
    catch (error) {
        outputHandler.output("An error occurred while fetching the logs:");
        outputHandler.output(error.message);
        return false;
    }

    if (globalVariables.Logs.length == 0) {
        outputHandler.output("The log directory contains no valid logs.");
        return false;
    }

    outputHandler.output("Sorting logs...");
    globalVariables.Logs.sort();
    return true;
};