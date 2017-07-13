// write-json.js
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const fs = require("fs"),
  Constants = require("./constants.js"),
  data = require("./data.js"),
  miscFunctions = require("./misc-functions.js"),
  log = require("./log.js");

/**
 * Creates a json containing the data extracted from the logs.
 */
module.exports = function () {
  log.debug(module, "Starting JSON creation.");

  const timestamps = miscFunctions.getCurrentTimestamps();
  const json = {
    "ProgramInfo": {
      "Name": "TS3-LogDataViewer",
      "Author": "Drumsticks",
      "GitHub": "https://github.com/Drumsticks1/TS3-LogDataViewer"
    },
    "Attributes": {
      "virtualServer": data.virtualServer,
      "creationTime": {
        "localTime": timestamps.local,
        "UTC": timestamps.utc
      }
    },
    "ClientList": data.ClientList,
    "ServerGroupList": data.ServerGroupList,
    "BanList": data.BanList,
    "KickList": data.KickList,
    "ComplaintList": data.ComplaintList,
    "UploadList": data.UploadList,
    "ChannelList": data.ChannelList
  };

  try {
    fs.writeFileSync(Constants.outputJSON, JSON.stringify(json), 'utf8');
  }
  catch (error) {
    log.error(module, "An error occurred while creating the JSON:\n\t" + error.message);
    return 0;
  }

  log.debug(module, "JSON creation completed.");
};