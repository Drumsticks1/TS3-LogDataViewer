// parsers/kick.js : Parsing of Kick events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../miscFunctions.js');
var checkFunctions = require("../checkFunctions.js");
var Kick = require("../Kick.js");
var globalVariables = require("../globalVariables.js");

module.exports = {

  parseKick: function(message, dateTime, disconnectBoundaries) {
    let res = this.parseMessageKick(message, disconnectBoundaries);

    if (!checkFunctions.isDuplicateKick(dateTime, res.clientId, res.Nickname, res.kickedByNickname, res.kickedByUID, res.kickReason))
      Kick.addKick(globalVariables.KickList, dateTime, res.clientId, res.Nickname, res.kickedByNickname, res.kickedByUID, res.kickReason);
  },

  /**
   * Parses the Kick data from the given logLine.
   * Requires the boundaries object from the previous client.parseMessageClientDisconnect call.
   * @param {string} logLine
   * @param {object} boundaries boundaries object from the previous client.parseMessageClientDisconnect call.
   * @returns {{kickedByNickname: string, kickedByUID: string, kickReason: string}} the extracted data.
   */
  parseMessageKick: function (logLine, boundaries) {
    let kickReason = "";

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
    };

    if (logLine.includes(" reasonmsg=")) {
      boundaries.kickReason = [
        logLine.lastIndexOf(" reasonmsg=") + 11,
        logLine.length - 1];

      kickReason = getSubstring("kickReason");
    }

    boundaries.kickedByNickname = [
      logLine.lastIndexOf(" invokername=") + 13,
      logLine.lastIndexOf(" invokeruid=")];

    boundaries.kickedByUID = [boundaries.kickedByNickname[1] + 12, 0];

    if (!logLine.includes("invokeruid=serveradmin"))
      boundaries.kickedByUID[1] = logLine.indexOf("=", boundaries.kickedByUID[0]) + 1;
    else
      boundaries.kickedByUID[1] = logLine.indexOf("reasonmsg") - 1;

    return {
      kickedByNickname: getSubstring("kickedByNickname"),
      kickedByUID: getSubstring("kickedByUID"),
      kickReason: kickReason
    };
  }
};
