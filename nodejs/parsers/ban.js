// parsers/ban.js : Parsing of Ban events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

var checkFunctions = require("../checkFunctions.js"),
  miscFunctions = require('../miscFunctions.js');

module.exports = {
  /**
   * Parses the Ban data from the given logLine.
   * Requires the boundaries object from the previous client.parseClientDisconnect call.
   * @param {string} logLine
   * @param {object} boundaries boundaries object from the previous client.parseClientDisconnect call.
   * @param {string} lastUIDBanRule
   * @param {string} lastIPBanRule
   * @returns {{bannedUID: string, bannedIP: string, bannedByID: string, bannedByNickname: string, bannedByUID: string, banReason: string, banTime: number}} the extracted data.
   */
  parseBan: function (logLine, boundaries, lastUIDBanRule, lastIPBanRule) {
    var validUID = true;

    boundaries.bannedByNickname = [logLine.indexOf(" invokername=", boundaries.clientId[1]) + 13, 0];

    if (logLine.indexOf("invokeruid=") !== -1) {
      boundaries.bannedByNickname[1] = logLine.indexOf(" invokeruid=", boundaries.bannedByNickname[0]);
      boundaries.bannedByUID = [
        boundaries.bannedByNickname[1] + 12,
        logLine.indexOf(" reasonmsg", boundaries.bannedByNickname[1])];
    }
    else {
      boundaries.bannedByNickname[1] = logLine.indexOf(" reasonmsg");
      boundaries.bannedByUID = [0, logLine.indexOf(" reasonmsg")];
      validUID = false;
    }

    boundaries.banReason = [boundaries.bannedByUID[1] + 11, 0];
    if (logLine.indexOf("reasonmsg=") !== -1) {
      boundaries.banReason[1] = logLine.indexOf(" bantime=", boundaries.bannedByUID[1]);
      boundaries.banTime = [boundaries.banReason[1] + 9, 0];
    }
    else {
      boundaries.banReason[1] = boundaries.banReason[0];
      boundaries.banTime = [boundaries.banReason[1] + 8, 0];
    }

    boundaries.banTime[1] = logLine.length - 1;

    var getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
    };

    var bannedByNickname = getSubstring("bannedByNickname"),
      banReason = getSubstring("banReason"),
      banTime = Number(getSubstring("banTime")),
      bannedByUID, bannedUID, bannedIP, bannedByID;

    if (validUID)
      bannedByUID = getSubstring("bannedByUID");
    else
      bannedByUID = "No UID";

    if (lastUIDBanRule.length !== 0 && lastIPBanRule.length !== 0) {
      if (checkFunctions.isMatchingBanRules(bannedByNickname, banReason, banTime, lastUIDBanRule, lastIPBanRule)) {
        boundaries.bannedUID = [
          lastUIDBanRule.indexOf("' cluid='") + 9,
          lastUIDBanRule.lastIndexOf("' bantime=")];

        boundaries.bannedIP = [
          lastIPBanRule.indexOf("' ip='") + 6,
          lastIPBanRule.lastIndexOf("' bantime=")];

        boundaries.bannedByID = [
          lastIPBanRule.lastIndexOf("'(id:") + 5,
          lastIPBanRule.length - 1];

        bannedUID = lastUIDBanRule.substring(boundaries.bannedUID[0], boundaries.bannedUID[1]);
        bannedIP = lastIPBanRule.substring(boundaries.bannedIP[0], boundaries.bannedIP[1]);
        bannedByID = Number(lastIPBanRule.substring(boundaries.bannedByID[0], boundaries.bannedByID[1]));
      }
      else {
        bannedUID = bannedIP = "Unknown";
        bannedByID = 0;
      }
    }

    return {
      bannedUID: bannedUID,
      bannedIP: bannedIP,
      bannedByID: bannedByID,
      bannedByNickname: bannedByNickname,
      bannedByUID: bannedByUID,
      banReason: banReason,
      banTime: banTime
    };
  }
};
