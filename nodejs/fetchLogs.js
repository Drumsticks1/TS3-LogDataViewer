// fetchLogs.js: Fetching of the log files.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs");
const util = require("util");
const main = require('./main.js');
const Constants = require("./Constants.js");
const outputHandler = require("./outputHandler.js");
const checkFunctions = require("./checkFunctions.js");

var Logs = [], ignoreLogs = [];

/**
 *
 * @param {string} LOGDIRECTORY
 * @returns {boolean}
 */
function fetchLogs(LOGDIRECTORY) {
    outputHandler.output("Checking logdirectory...");

    try {
        var logDirectoryStats = fs.statSync(LOGDIRECTORY);
        if (logDirectoryStats.isDirectory()) {
            try {
                var logFiles = fs.readdirSync(LOGDIRECTORY);

                if (logFiles.length > 0) {
                    outputHandler.output("Fetching logignore...");

                    var LogignorePath = LOGDIRECTORY + "logignore";
                    try {
                        // Todo: Check if needed for additional tests.
                        // var LogignoreStats = fs.statSync(LogignorePath);

                        var LogignoreData = fs.readFileSync(LogignorePath, "utf8");

                        if (LogignoreData.length > 0) {
                            var buffer_logignore, prevLineEnd = -1, currentLineEnd = LogignoreData.indexOf("\n");

                            for (var i = 0; i < LogignoreData.length;) {
                                buffer_logignore = LogignoreData.substring(prevLineEnd + 1, currentLineEnd);

                                i += buffer_logignore.length + 1;
                                prevLineEnd = currentLineEnd;
                                currentLineEnd = LogignoreData.indexOf("\n", prevLineEnd + 1);

                                ignoreLogs.push(buffer_logignore);
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
                            // Todo: Add check if log is ignored!
                            if (!checkFunctions.isIgnoredLog(logFiles[i])) {
                                if (logFiles[i].substring(38, logFiles[i].length - 4) == String(main.VIRTUALSERVER)) {
                                    Logs.push(logFiles[i]);
                                }
                            }
                        }
                    }

                } else {
                    outputHandler.output("The log directory seems to be empty.");
                }

            } catch (error) {
                outputHandler.output(error.message);
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

    if (Logs.length == 0) {
        outputHandler.output("The log directory contains no valid logs.");
        return false;
    }

    outputHandler.output("Sorting logs...");
    Logs.sort();
    return true;
}

exports.fetchLogs = fetchLogs;
exports.Logs = Logs;
exports.ignoreLogs = ignoreLogs;