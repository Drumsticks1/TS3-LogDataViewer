// kick.js :
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {

  // Uses the boundaries from the previous parseClientDisconnect call.
  parseKick: function (logLine, boundaries) {
    var kickReason = "";

    function getSubstring(boundariesIdentifier) {
      return logLine.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
    }

    if (logLine.lastIndexOf(" reasonmsg=") != -1) {
      boundaries.kickReason = [
        logLine.lastIndexOf(" reasonmsg=") + 11,
        logLine.length - 1];

      kickReason = getSubstring("kickReason");
    }

    boundaries.kickedByNickname = [
      logLine.lastIndexOf(" invokername=") + 13,
      logLine.lastIndexOf(" invokeruid=")];

    boundaries.kickedByUID = [boundaries.kickedByNickname[1] + 12, 0];

    if (logLine.indexOf("invokeruid=serveradmin") == -1)
      boundaries.kickedByUID[1] = logLine.indexOf("=", boundaries.kickedByUID[0]) + 1;
    else
      boundaries.kickedByUID[1] = logLine.indexOf("reasonmsg") - 1;

    // Todo: kickedId and kickedNickname may not be required, already parsed in parseClientDisconnect.
    return {
      kickedId: getSubstring("clientId"),
      kickedNickname: getSubstring("Nickname"),
      kickedByNickname: getSubstring("kickedByNickname"),
      kickedByUID: getSubstring("kickedByUID"),
      kickReason: kickReason
    };
  }
};

