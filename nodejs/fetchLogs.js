// fetchLogs.js: Fetching of the log files.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    globalVariables = require("./globalVariables.js"),
    log = require("./log.js"),
    checkFunctions = require("./checkFunctions.js");

/**
 * Fetches the logs.
 * @returns {boolean} true if no error occurred.
 */
exports.fetchLogs = function () {
    log.info("Checking log directory.");
    globalVariables.Logs.length = 0;

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

    log.info("Fetching logs.");
    for (var i = 0; i < logFiles.length; i++) {
        if (logFiles[i].lastIndexOf(".log") == logFiles[i].length - 4
            && logFiles[i].substring(38, logFiles[i].length - 4) == String(globalVariables.virtualServer)
            && !checkFunctions.isIgnoredLog(logFiles[i])) {
            globalVariables.Logs.push(logFiles[i]);
        }
    }

    log.info("Sorting logs.");
    globalVariables.Logs.sort();
    return true;
};