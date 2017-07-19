// parsers/parser-kick.js : Parsing of Kick events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../misc-functions.js');
var checkFunctions = require("../check-functions.js");
var Kick = require("../classes/kick.js");
var data = require("../data.js");

module.exports = {

  parseKick: function(message, dateTime, disconnectRes) {
    let res = this.parseMessageKick(message, disconnectRes.boundaries);

    if (!checkFunctions.isDuplicateKick(dateTime, disconnectRes.clientId, disconnectRes.Nickname, res.kickedByNickname, res.kickedByUID, res.kickReason))
      Kick.addKick(data.KickList, dateTime, disconnectRes.clientId, disconnectRes.Nickname, res.kickedByNickname, res.kickedByUID, res.kickReason);
  },

  /**
   * Parses the Kick data from the given message.
   * Requires the boundaries object from the previous client.parseMessageClientDisconnect call.
   * @param {string} message
   * @param {object} boundaries boundaries object from the previous client.parseMessageClientDisconnect call.
   * @returns {{kickedByNickname: string, kickedByUID: string, kickReason: string}} the extracted data.
   */
  parseMessageKick: function (message, boundaries) {
    let kickReason = "";

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
    };

    if (message.includes(" reasonmsg=")) {
      boundaries.kickReason = [
        message.lastIndexOf(" reasonmsg=") + 11,
        message.length - 1];

      kickReason = getSubstring("kickReason");
    }

    boundaries.kickedByNickname = [
      message.lastIndexOf(" invokername=") + 13,
      message.lastIndexOf(" invokeruid=")];

    boundaries.kickedByUID = [boundaries.kickedByNickname[1] + 12, 0];

    if (!message.includes("invokeruid=serveradmin"))
      boundaries.kickedByUID[1] = message.indexOf("=", boundaries.kickedByUID[0]) + 1;
    else
      boundaries.kickedByUID[1] = message.indexOf("reasonmsg") - 1;

    return {
      kickedByNickname: getSubstring("kickedByNickname"),
      kickedByUID: getSubstring("kickedByUID"),
      kickReason: kickReason
    };
  }
};
