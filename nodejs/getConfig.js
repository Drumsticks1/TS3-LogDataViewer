// getConfig.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    Constants = require("./Constants.js"),
    globalVariables = require("./globalVariables.js"),
    outputHandler = require("./outputHandler.js"),
    miscFunctions = require("./miscFunctions.js");

/**
 * Fetches and processes the config.json.
 * @returns {boolean} true if no error occurred.
 */
exports.getConfig = function() {
    outputHandler.output("Fetching and checking configuration file...");
    try {
        var fileStats = fs.statSync(Constants.configJSON);
        if (fileStats.isFile()) {
            var configJSON = require(Constants.configJSON);

            if (configJSON.logDirectory != undefined) {
                globalVariables.logDirectory = configJSON.logDirectory;
            } else {
                outputHandler.output("No log directory specified - using default path...");
                globalVariables.logDirectory = Constants.logDirectory;
            }

            if (configJSON.virtualServer != undefined) {
                var buffer = Number(configJSON.virtualServer);
                if (buffer != "NaN") {
                    globalVariables.virtualServer = buffer;
                } else {
                    outputHandler.output("Virtual server is not specified as a valid number - using default value...");
                    globalVariables.virtualServer = Constants.defaultVirtualServer;
                }
            } else {
                outputHandler.output("No virtual server specified - using default value...");
            }

            if (configJSON.bufferData != undefined) {
                buffer = configJSON.bufferData;
                if (buffer == false || buffer == true) {
                    globalVariables.bufferData = buffer;
                } else {
                    outputHandler.output("bufferData is not specified as a valid boolean (true|0|false|1) - using default value...");
                    globalVariables.bufferData = Constants.bufferData;
                }
            } else {
                outputHandler.output("No virtual server specified - using default value...");
            }

        } else {
            outputHandler.output("config.json is not a file...\nUsing default values for logDirectory, virtualServer and bufferData.");
            return false;
        }
    } catch (error) {
        outputHandler.output("An error occurred while fetching the config.json:\n" + error.message);
        return false;
    }

    return true;
};