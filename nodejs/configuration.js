// configuration.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  Constants = require("./constants.js"),
  data = require("./data.js"),
  log = require("./log.js");

// TODO: maybe make local
let confJSON;

/**
 * Checks if a setting with the given name is part of the conf.json and saves the value of the setting in the
 * data array if it's value has the same type as settingValueType.
 * @param {string} settingName
 * @param {string} settingValueType
 */
function acquireSetting(settingName, settingValueType) {
  if (confJSON[settingName] !== undefined) {
    if (typeof confJSON[settingName] === settingValueType) {
      if (data[settingName] !== confJSON[settingName]) {
        data[settingName] = confJSON[settingName];
        log.debug(module, "Configuration variable \"" + settingName + "\" is set to \"" + confJSON[settingName] + "\".");
      } else {
        log.debug(module, "Configuration variable \"" + settingName + "\" already equals the default value.");
      }
    } else {
      log.debug(module, "Configuration variable \"" + settingName + "\" is not specified as a valid " + settingValueType + ", using default value.");
      data[settingName] = Constants[settingName];
    }
  } else {
    log.debug(module, "Configuration variable \"" + settingName + "\" is not specified, using default value.");
    data[settingName] = Constants[settingName];
  }
}

/**
 * Resets the configuration to the default values set in constants.js.
 */
function resetToDefaultConfiguration() {
  log.debug(module, "Ignoring the conf.json and using default settings.");
  data.programLogfile = Constants.programLogfile;
  data.TS3LogDirectory = Constants.TS3LogDirectory;
  data.virtualServer = Constants.virtualServer;
  data.bufferData = Constants.bufferData;
  data.timeBetweenRequests = Constants.timeBetweenRequests;
  data.disableLastModificationCheck = Constants.disableLastModificationCheck;
  data.usedPort = Constants.usedPort;
  data.logLevel = Constants.logLevel;
  data.ignoredLogs.length = 0;
  log.updateWriteStream();
}

module.exports = {
  /**
   * Fetches and processes the conf.json.
   * @returns {boolean} true if no error occurs.
   */
  getConf: function () {
    log.debug(module, "Fetching and checking configuration file.");
    try {
      const fileStats = fs.statSync(Constants.confJSON);
      if (fileStats.isFile()) {
        confJSON = require(Constants.confJSON);

        acquireSetting("programLogfile", "string");
        acquireSetting("logLevel", "number");
        if (data.logLevel !== 0 && data.logLevel !== 1 && data.logLevel !== 2 && data.logLevel !== 3) {
          log.warn(module, "logLevel setting \"" + data.logLevel + "\" is invalid, using default value!");
          data.logLevel = Constants.logLevel;
        }
        log.updateWriteStream();
        acquireSetting("TS3LogDirectory", "string");

        // Add trailing "/" to the log directory path (if not already existing)
        if (!data.TS3LogDirectory.endsWith("/")) {
          data.TS3LogDirectory = data.TS3LogDirectory + "/";
        }

        acquireSetting("virtualServer", "number");
        acquireSetting("bufferData", "boolean");
        acquireSetting("timeBetweenRequests", "number");
        acquireSetting("disableLastModificationCheck", "boolean");
        acquireSetting("usedPort", "number");

        if (Array.isArray(confJSON.ignoredLogs) && confJSON.ignoredLogs.length !== 0) {
          for (let i = 0; i < confJSON.ignoredLogs.length; i++) {
            data.ignoredLogs.push(confJSON.ignoredLogs[i]);
            log.debug(module, "Added ignored log: \"" + confJSON.ignoredLogs[i] + "\".");
          }
        }
        else {
          log.debug(module, "No ignored logs specified.");
          data.ignoredLogs.length = 0;
        }
      } else {
        log.warn(module, "conf.json is not a file, using default values for the settings!");
        resetToDefaultConfiguration();
      }
    } catch (error) {
      log.warn(module, "An error occurred while fetching and parsing conf.json:\n\t" + error.message);
      log.warn(module, "Falling back to the default configuration!");
      resetToDefaultConfiguration();
    }
  }
};