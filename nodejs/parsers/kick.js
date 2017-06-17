// parsers/kick.js : Parsing of Kick events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const miscFunctions = require('../miscFunctions.js');

module.exports = {
  /**
   * Parses the Kick data from the given logLine.
   * Requires the boundaries object from the previous client.parseClientDisconnect call.
   * @param {string} logLine
   * @param {object} boundaries boundaries object from the previous client.parseClientDisconnect call.
   * @returns {{kickedByNickname: string, kickedByUID: string, kickReason: string}} the extracted data.
   */
  parseKick: function (logLine, boundaries) {
    let kickReason = "";

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
    };

    if (logLine.lastIndexOf(" reasonmsg=") !== -1) {
      boundaries.kickReason = [
        logLine.lastIndexOf(" reasonmsg=") + 11,
        logLine.length - 1];

      kickReason = getSubstring("kickReason");
    }

    boundaries.kickedByNickname = [
      logLine.lastIndexOf(" invokername=") + 13,
      logLine.lastIndexOf(" invokeruid=")];

    boundaries.kickedByUID = [boundaries.kickedByNickname[1] + 12, 0];

    if (logLine.indexOf("invokeruid=serveradmin") === -1)
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
