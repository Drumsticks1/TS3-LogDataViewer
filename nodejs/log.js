// log.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require('fs'),
    globalVariables = require("./globalVariables.js"),
    miscFunctions = require("./miscFunctions.js");

const logLevelString = ["ERROR", "WARN", "INFO", "DEBUG"];

var programLogfile, logBuffer = [];

module.exports = {
    /**
     * Updates the programLogfile write stream.
     * Logs the logBuffer entries after updating the write stream.
     * Required when the log file get deleted while the process is running or when the programLogfile paths changed.
     */
    updateWriteStream: function() {
        programLogfile = fs.createWriteStream(globalVariables.programLogfile, {flags: 'a'});
        if (logBuffer.length != 0) {
            while (logBuffer.length != 0) {
                var logBufferObject = logBuffer.shift();
                log(logBufferObject[0], logBufferObject[1], true);
            }
        }
    },

    /**
     * Functions for calling the log functions with different log levels:
     * - 0 error
     * - 1 warn
     * - 2 info
     * - 3 debug
     */
    error: function(message) {
        log(message, 0, false);
    },

    warn: function(message) {
        log(message, 1, false);
    },

    info: function(message) {
        log(message, 2, false);
    },

    debug: function(message) {
        log(message, 3, false);
    }
};

/**
 * Logs the message to the specified programLogfile.
 * Adds the current UTC time before and \n after the message.
 * If the programLogfile (write stream) is undefined the message is instead stored in the logBuffer array.
 *
 * @param {string} message the message to be logged
 * @param {number} logLevel
 * @param {boolean} alreadyProcessed
 */
function log(message, logLevel, alreadyProcessed) {
    var processedMessage = message;
    if (!alreadyProcessed)
        processedMessage = "[" + miscFunctions.getCurrentUTC() + "|" + logLevelString[logLevel] + "] " + message + "\n";

    if (programLogfile == undefined)
        logBuffer.push([processedMessage, logLevel]);
    else if (logLevel <= globalVariables.logLevel)
        programLogfile.write(processedMessage);
}