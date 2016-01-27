// outputHandling.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

// Todo: maybe move to miscFunctions.

const fs = require('fs'),
    Constants = require('./Constants.js');

var programLogfile;

module.exports = {
    /**
     * Updates the programLogfile write stream.
     * Required when the log file get deleted while the process is running.
     */
    updateWriteStream: function() {
        programLogfile = fs.createWriteStream(Constants.programLogfile, {flags: 'a'});
    },

    /**
     * Writes the text to the console and the logfile.
     * Adds \n after the text when writing to the logfile.
     * @param {string} text
     */
    output: function(text) {
        console.log(text);
        programLogfile.write(text + "\n");
    }
};