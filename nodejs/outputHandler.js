// outputHandling.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

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
     * Writes the text to the logfile.
     * Adds \n after the text.
     * @param {string} text
     */
    output: function(text) {
        programLogfile.write(text + "\n");
    }
};