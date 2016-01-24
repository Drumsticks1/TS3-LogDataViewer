// outputHandling.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require('fs');
const Constants = require('./Constants.js');

var programLogfile = fs.createWriteStream(Constants.PROGRAMLOGFILE);

exports.output = output;

/**
 * Writes the text to the console and the logfile.
 * Adds \n after the text when writing to the logfile.
 * @param {string} text
 */
function output(text) {
    console.log(text);
    programLogfile.write(text + "\n");
}
