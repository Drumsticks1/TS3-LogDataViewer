// getConf.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  Constants = require("./Constants.js"),
  globalVariables = require("./globalVariables.js"),
  log = require("./log.js");

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
      if (globalVariables[settingName] != confJSON[settingName]) {
        globalVariables[settingName] = confJSON[settingName];
        log.debug("Configuration variable \"" + settingName + "\" is set to \"" + confJSON[settingName] + "\".");
      } else {
        log.debug("Configuration variable \"" + settingName + "\" already equals the default value.");
      }
    } else {
      log.debug("Configuration variable \"" + settingName + "\" is not specified as a valid " + settingValueType + ", using default value.");
      globalVariables[settingName] = Constants[settingName];
    }
  } else {
    log.debug("Configuration variable \"" + settingName + "\" is not specified, using default value.");
    globalVariables[settingName] = Constants[settingName];
  }
}

/**
 * Resets the configuration to the default values set in Constants.js.
 */
function resetToDefaultConfiguration() {
  log.debug("Ignoring the conf.json and using default settings.");
  globalVariables.programLogfile = Constants.programLogfile;
  globalVariables.logDirectory = Constants.logDirectory;
  globalVariables.virtualServer = Constants.virtualServer;
  globalVariables.bufferData = Constants.bufferData;
  globalVariables.timeBetweenBuilds = Constants.timeBetweenBuilds;
  globalVariables.disableLastModificationCheck = Constants.disableLastModificationCheck;
  globalVariables.usedPort = Constants.usedPort;
  globalVariables.logLevel = Constants.logLevel;
  globalVariables.ignoredLogs.length = 0;
  log.updateWriteStream();
}

module.exports = {
  /**
   * Fetches and processes the conf.json.
   * @returns {boolean} true if no error occurs.
   */
  getConf: function () {
    log.info("Fetching and checking configuration file.");
    try {
      var fileStats = fs.statSync(Constants.confJSON);
      if (fileStats.isFile()) {
        confJSON = require(Constants.confJSON);

        acquireSetting("programLogfile", "string");
        acquireSetting("logLevel", "number");
        if (globalVariables.logLevel != 0 && globalVariables.logLevel != 1 && globalVariables.logLevel != 2 && globalVariables.logLevel != 3) {
          log.info("logLevel setting \"" + globalVariables.logLevel + "\" is invalid, setting default value.");
          globalVariables.logLevel = Constants.logLevel;
        }
        log.updateWriteStream();
        acquireSetting("logDirectory", "string");
        acquireSetting("virtualServer", "number");
        acquireSetting("bufferData", "boolean");
        acquireSetting("timeBetweenBuilds", "number");
        acquireSetting("disableLastModificationCheck", "boolean");
        acquireSetting("usedPort", "number");

        if (Array.isArray(confJSON.ignoredLogs) && confJSON.ignoredLogs.length != 0) {
          for (var i = 0; i < confJSON.ignoredLogs.length; i++) {
            var ignoredLog = confJSON.ignoredLogs[i];
            globalVariables.ignoredLogs.push(ignoredLog);
            log.debug("Added ignored log: \"" + ignoredLog + "\".");
          }
        }
        else {
          log.debug("No ignored logs specified.");
          globalVariables.ignoredLogs.length = 0;
        }
      } else {
        log.info("conf.json is not a file, using default values for the settings!");
        resetToDefaultConfiguration();
      }
    } catch (error) {
      log.warn("An error occurred while fetching and parsing conf.json:\n\t" + error.message);
      resetToDefaultConfiguration();
    }
  }
};