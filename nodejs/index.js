// main.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    Constants = require("./Constants.js"),
    globalVariables = require("./globalVariables.js"),
    outputHandler = require("./outputHandler.js"),
    fetchLogs = require("./fetchLogs.js"),
    parseLogs = require("./parseLogs.js"),
    createXML = require("./createXML.js"),
    miscFunctions = require("./miscFunctions.js");

/**
 * Main function
 */
exports.rebuildXML = function() {
    var programStart = new Date();

    miscFunctions.updateCurrentDate();

    outputHandler.output("Last program run\n\n" + miscFunctions.getCurrentUTC() + " (UTC)\n" + miscFunctions.getCurrentLocaltime() + " (Local time)\n");

    // Todo: Modify for a call with the options.
    var setLD = false, setVS = false;
    for (var i = 0; i < process.argv.length; i++) {
        if (process.argv[i].indexOf("--logdirectory=") == 0) {
            globalVariables.LOGDIRECTORY = process.argv[i].substring(15);
            setLD = true;
        } else if (process.argv[i].indexOf("--virtualserver=") == 0) {
            globalVariables.VIRTUALSERVER = process.argv[i].substring(16);
            setVS = true;
        }
    }

    if (!setLD) {
        outputHandler.output("No logdirectory specified - using default path...");
    }

    if (!setVS) {
        outputHandler.output("No virtual server specified - using default value...");
    }

    if (!fetchLogs.fetchLogs()) {
        outputHandler.output("The program will now exit...");
        return 0;
    }

    parseLogs.parseLogs();

    createXML.createXML();

    if(!Constants.bufferData){
        miscFunctions.clearGlobalArrays();
        outputHandler.output("Cle" + "ared buffer arrays...");
    }

    outputHandler.output("Program runtime: " + miscFunctions.getProgramRuntime(programStart) + " ms.");
    return 1;
};