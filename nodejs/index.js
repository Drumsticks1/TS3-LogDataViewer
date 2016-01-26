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
    createJSON = require("./createJSON.js"),
    miscFunctions = require("./miscFunctions.js"),
    getConfig = require("./getConfig.js");

exports.rebuildJSON = function() {
    var programStart = new Date();

    miscFunctions.updateCurrentDate();
    outputHandler.output("\n" + miscFunctions.getCurrentUTC() + " (UTC)\n" + miscFunctions.getCurrentLocaltime() + " (Local time)\n");

    // Currently requires an app restart until changed settings are detected!
    if (!getConfig.getConfig()) {
        outputHandler.output("Ignoring the config.json and using default settings...");
        globalVariables.logDirectory = Constants.defaultLogDirectory;
        globalVariables.virtualServer = Constants.defaultVirtualServer;
        globalVariables.bufferData = Constants.bufferData;
    }

    if (!fetchLogs.fetchLogs()) {
        outputHandler.output("The program will now exit...");
        return 0;
    }

    parseLogs.parseLogs();

    createJSON.createJSON();

    if (!globalVariables.bufferData) {
        miscFunctions.clearGlobalArrays();
        outputHandler.output("Cleared buffer arrays...");
    }

    miscFunctions.resetConnectedStates();

    outputHandler.output("Program runtime: " + miscFunctions.getProgramRuntime(programStart) + " ms.");
    return 1;
};