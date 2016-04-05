// parsers/client.js : Parsing of Client events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Parses the Client data from the given logLine.
 * Requires a boundaries object containing the positions for the clientId, Nickname and IP data.
 * @param {string} logLine
 * @param {object} boundaries boundaries object containing the positions for the clientId, Nickname and IP data.
 * @returns {{clientId: number, Nickname: string, IP: string}} the extracted data.
 */
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

module.exports = {
  /**
   * Parses the ClientConnect data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, Nickname: string, IP: string}} the extracted data.
   */
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

  /**
   * Parses the QueryClientConnect data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, Nickname: string, IP: string}} the extracted data.
   */
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

  /**
   * Parses the ClientDisconnect data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, Nickname: string, boundaries: {}}} the extracted data and the boundaries object.
   */
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


  /**
   * Parses the ClientDeletion data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, Nickname: string, IP: string}} the extracted data.
   */
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