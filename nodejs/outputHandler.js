// outputHandling.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require('fs'),
    globalVariables = require("./globalVariables.js"),
    miscFunctions = require("./miscFunctions.js");

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
                programLogfile.write(logBuffer.shift());
            }
        }
    },

    /**
     * Logs the text to the specified programLogfile.
     * Adds \n after the text.
     * If the programLogfile (write stream) is undefined the text is instead stored in the logBuffer array.
     *
     * @param {string} text the text to be logged
     */
    output: function(text) {
        var logLine = "[" + miscFunctions.getCurrentUTC() + "] " + text + "\n";

        if (programLogfile != undefined)
            programLogfile.write(logLine);
        else
            logBuffer.push(logLine);
    }
};