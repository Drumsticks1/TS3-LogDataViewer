// outputHandling.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

// Todo: maybe move to miscFunctions.

const fs = require('fs'),
    Constants = require('./Constants.js');

// Todo: Don't overwrite previous log but append the new output to the old file.
var programLogfile = fs.createWriteStream(Constants.programLogfile);

/**
 * Writes the text to the console and the logfile.
 * Adds \n after the text when writing to the logfile.
 * @param {string} text
 */
function output(text) {
    console.log(text);
    programLogfile.write(text + "\n");
}

exports.output = output;