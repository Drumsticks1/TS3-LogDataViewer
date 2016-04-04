// client.js :
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

function parseAnyClientConnect(boundaries, logLine) {
  function getSubstring(boundariesIdentifier) {
    return logLine.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
  }

  return {
    clientId: Number(getSubstring("clientId")),
    Nickname: getSubstring("Nickname"),
    IP: getSubstring("IP")
  };
}

/**
 *
 * @param logLine
 */
module.exports = {
  parseClientConnect: function (logLine) {
    var boundaries = {};

    boundaries.IP = [
      logLine.lastIndexOf(" ") + 1,
      logLine.length - 6]; // -6 for ignoring the port.

    boundaries.Nickname = [
      logLine.indexOf("client connected '") + 18,
      logLine.lastIndexOf("'(id:")];

    boundaries.clientId = [
      boundaries.Nickname[1] + 5,
      boundaries.IP[0] - 7];

    return parseAnyClientConnect(boundaries, logLine);
  },

  parseQueryClientConnect: function (logLine) {
    var boundaries = {};

    boundaries.Nickname = [
      logLine.indexOf("query client connected '") + 24,
      logLine.lastIndexOf("'(id:") - 6]; // -6 for ignoring the port.

    boundaries.clientId = [
      boundaries.Nickname[1] + 11,
      logLine.length - 1];

    boundaries.IP = [
      logLine.lastIndexOf(" from ") + 6,
      boundaries.Nickname[1]];

    return parseAnyClientConnect(boundaries, logLine);
  },

  parseClientDisconnect: function (logLine) {
    var boundaries = {};

    boundaries.Nickname = [
      logLine.indexOf("client disconnected '") + 21,
      logLine.lastIndexOf("'(id:")];

    boundaries.clientId = [boundaries.Nickname[1] + 5, 0];

    // Compatible with normal disconnects as well as with bans and kicks.
    if (logLine.lastIndexOf(") reason 'reasonmsg") == -1)
      boundaries.clientId[1] = logLine.lastIndexOf(") reason 'invokerid=");
    else
      boundaries.clientId[1] = logLine.lastIndexOf(") reason 'reasonmsg");

    function getSubstring(boundariesIdentifier) {
      return logLine.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
    }

    return {
      clientId: Number(getSubstring("clientId")),
      Nickname: getSubstring("Nickname"),
      boundaries: boundaries
    };
  },

  parseClientDeletion: function (logLine) {
    var boundaries = {};

    boundaries.clientId = [logLine.lastIndexOf(") got deleted by client '"), 0];
    boundaries.clientId[1] = logLine.lastIndexOf("'(id:", boundaries.clientId[0]) + 5;

    function getSubstring(boundariesIdentifier) {
      return logLine.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
    }

    return {
      clientId: Number(getSubstring("clientId"))
    };
  }
};