// getConf.js
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
    Constants = require("./Constants.js"),
    globalVariables = require("./globalVariables.js"),
    outputHandler = require("./outputHandler.js"),
    miscFunctions = require("./miscFunctions.js");

var confJSON;

/**
 * Checks if a setting with the given name is part of the conf.json and saves the value of the setting in the
 * globalVariables array if it's value has the same type as settingValueType.
 * @param {string} settingName
 * @param {string} settingValueType
 */
function acquireSetting(settingName, settingValueType) {
    if (confJSON[settingName] != undefined) {
        if (typeof confJSON[settingName] == settingValueType) {
            globalVariables[settingName] = confJSON[settingName];
            // Todo: optional debug logging.
            // outputHandler.output("Configuration variable \"" + settingName + "\" is set to " + confJSON[settingName]);
        }
        else {
            outputHandler.output("Configuration variable \"" + settingName + "\" is not specified as a valid " + settingValueType + " - using default value!");
            globalVariables[settingName] = Constants[settingName];
        }
    } else {
        outputHandler.output("Configuration variable \"" + settingName + "\" is not specified - using default value!");
        globalVariables[settingName] = Constants[settingName];
    }
}

module.exports = {
    /**
     * Resets the configuration to the default values set in Constants.js.
     */
    resetToDefaultConfiguration: function() {
        outputHandler.output("Ignoring the conf.json and using default settings...");
        globalVariables.logDirectory = Constants.logDirectory;
        globalVariables.virtualServer = Constants.virtualServer;
        globalVariables.bufferData = Constants.bufferData;
        globalVariables.usedPort = Constants.usedPort;
        globalVariables.ignoredLogs = [];
    },

    /**
     * Fetches and processes the conf.json.
     * @returns {boolean} true if no error occurs.
     */
    getConf: function() {
        outputHandler.output("Fetching and checking configuration file...");
        try {
            var fileStats = fs.statSync(Constants.confJSON);
            if (fileStats.isFile()) {
                confJSON = require(Constants.confJSON);

                acquireSetting("programLogfile", "string");
                acquireSetting("logDirectory", "string");
                acquireSetting("virtualServer", "number");
                acquireSetting("bufferData", "boolean");
                acquireSetting("timeBetweenBuilds", "number");

                if(Array.isArray(confJSON.ignoredLogs) && confJSON.ignoredLogs.length != 0)
                    globalVariables.ignoredLogs = confJSON.ignoredLogs;
                else {
                    outputHandler.output("No ignored logs specified...");
                    globalVariables.ignoredLogs = [];
                }

            } else {
                outputHandler.output("conf.json is not a file...\nUsing default values for the settings!");
                return false;
            }
        } catch (error) {
            outputHandler.output("An error occurred while fetching the conf.json:\n" + error.message);
            return false;
        }

        return true;
    }
};