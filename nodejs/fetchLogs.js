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
        var logDirectoryStats = fs.statSync(globalVariables.logDirectory);
        if (logDirectoryStats.isDirectory()) {
            try {
                var logFiles = fs.readdirSync(globalVariables.logDirectory);

                if (logFiles.length > 0) {
                    outputHandler.output("Fetching logignore...");

                    var LogignorePath = globalVariables.logDirectory + "logignore";
                    try {
                        var LogignoreData = fs.readFileSync(LogignorePath, "utf8");

                        if (LogignoreData.length > 0) {
                            var buffer_logignore, prevLineEnd = -1, currentLineEnd = LogignoreData.indexOf("\n");

                            for (var i = 0; i < LogignoreData.length;) {
                                buffer_logignore = LogignoreData.substring(prevLineEnd + 1, currentLineEnd);

                                i += buffer_logignore.length + 1;
                                prevLineEnd = currentLineEnd;
                                currentLineEnd = LogignoreData.indexOf("\n", prevLineEnd + 1);

                                globalVariables.ignoredLogs.push(buffer_logignore);
                            }
                        } else {
                            outputHandler.output("The logignore seems to be empty - skipping...");
                        }

                    } catch (error) {
                        outputHandler.output("No valid logignore found - skipping...");
                    }

                    outputHandler.output("Fetching logs...");
                    for (i = 0; i < logFiles.length; i++) {
                        if (logFiles[i].lastIndexOf(".log") == logFiles[i].length - 4) {
                            if (!checkFunctions.isIgnoredLog(logFiles[i])) {
                                if (logFiles[i].substring(38, logFiles[i].length - 4) == String(globalVariables.virtualServer)) {
                                    globalVariables.Logs.push(logFiles[i]);
                                }
                            }
                        }
                    }
                } else {
                    outputHandler.output("The log directory seems to be empty.");
                }

            } catch (error) {
                outputHandler.output("An error occurred while reading the director:\n" + error.message);
            }

        } else {
            outputHandler.output("The log directory seems not to be a directory.");
            return false;
        }
    }
    catch (error) {
        outputHandler.output("An error occurred while fetching the logfiles:");
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