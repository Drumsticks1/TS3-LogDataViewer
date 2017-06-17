// createJSON.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  Constants = require("./Constants.js"),
  globalVariables = require("./globalVariables.js"),
  miscFunctions = require("./miscFunctions.js"),
  log = require("./log.js");

/**
 * Creates a json containing the data extracted from the logs.
 */
exports.createJSON = function () {
  log.info("Starting JSON creation.");

  const timestamps = miscFunctions.getCurrentTimestamps();
  const json = {
    "ProgramInfo": {
      "Name": "TS3-LogDataViewer",
      "Author": "Drumsticks",
      "GitHub": "https://github.com/Drumsticks1/TS3-LogDataViewer"
    },
    "Attributes": {
      "virtualServer": globalVariables.virtualServer,
      "creationTime": {
        "localTime": timestamps.local,
        "UTC": timestamps.utc
      }
    },
    "ClientList": globalVariables.ClientList,
    "ServerGroupList": globalVariables.ServerGroupList,
    "BanList": globalVariables.BanList,
    "KickList": globalVariables.KickList,
    "ComplaintList": globalVariables.ComplaintList,
    "UploadList": globalVariables.UploadList,
    "ChannelList": globalVariables.ChannelList
  };

  try {
    fs.writeFileSync(Constants.outputJSON, JSON.stringify(json), 'utf8');
  }
  catch (error) {
    log.error("An error occurred while creating the JSON:\n\t" + error.message);
    return 0;
  }

  log.info("JSON creation completed.");
};