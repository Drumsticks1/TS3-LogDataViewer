// parsers/client.js : Parsing of Client events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../miscFunctions.js');
var Client = require("../Client.js");
var globalVariables = require("../globalVariables.js");
var checkFunctions = require("../checkFunctions.js");

/**
 * Parses the Client data from the given logLine.
 * Requires a boundaries object containing the positions for the clientId, Nickname and IP data.
 * @param {string} logLine
 * @param {object} boundaries boundaries object containing the positions for the clientId, Nickname and IP data.
 * @returns {{clientId: number, Nickname: string, IP: string}} the extracted data.
 */
function parseAnyClientConnect(boundaries, logLine) {
  const getSubstring = function (boundariesIdentifier) {
    return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
  };

  return {
    clientId: Number(getSubstring("clientId")),
    Nickname: getSubstring("Nickname"),
    IP: getSubstring("IP")
  };
}

module.exports = {

  parseClientConnect: function (message, dateTime, isLastLog) {
    let res = this.parseMessageClientConnect(message);

    Client.fillArrayWithDummyClients(globalVariables.ClientList, res.clientId);

    if (globalVariables.ClientList[res.clientId].clientId === -1)
      globalVariables.ClientList[res.clientId].updateClientId(res.clientId);

    globalVariables.ClientList[res.clientId].addNickname(res.Nickname);

    if (globalVariables.bufferData) {
      if (!checkFunctions.isDuplicateConnection(res.clientId, dateTime))
        globalVariables.ClientList[res.clientId].addConnection(dateTime);
    }
    else globalVariables.ClientList[res.clientId].addConnection(dateTime);

    globalVariables.ClientList[res.clientId].addIP(res.IP);

    if (isLastLog)
      globalVariables.ClientList[res.clientId].connect();
  },

  /**
   * Parses the ClientConnect data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, Nickname: string, IP: string}} the extracted data.
   */
  parseMessageClientConnect: function (logLine) {
    const boundaries = {};

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

  parseQueryClientConnect: function (message, dateTime) {
    let res = this.parseMessageQueryClientConnect(message);

    Client.fillArrayWithDummyClients(globalVariables.ClientList, res.clientId);

    if (globalVariables.ClientList[res.clientId].clientId === -1)
      globalVariables.ClientList[res.clientId].updateClientId(res.clientId);

    globalVariables.ClientList[res.clientId].addNickname(res.Nickname);

    if (globalVariables.bufferData) {
      if (!checkFunctions.isDuplicateConnection(res.clientId, dateTime))
        globalVariables.ClientList[res.clientId].addConnection(dateTime);
    }
    else globalVariables.ClientList[res.clientId].addConnection(dateTime);

    globalVariables.ClientList[res.clientId].addIP(res.IP);
  },

  /**
   * Parses the QueryClientConnect data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, Nickname: string, IP: string}} the extracted data.
   */
  parseMessageQueryClientConnect: function (logLine) {
    const boundaries = {};

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

  parseClientDisconnect: function (message, dateTime, isLastLog) {
    let res = this.parseMessageClientDisconnect(message);

    if (globalVariables.ClientList.length < res.clientId + 1) {
      Client.fillArrayWithDummyClients(globalVariables.ClientList, res.clientId);
      globalVariables.ClientList[res.clientId].updateClientId(res.clientId);
    }

    if (globalVariables.ClientList[res.clientId].getNicknameCount() === 0 || globalVariables.ClientList[res.clientId].getNicknameByID(0) !== res.Nickname)
      globalVariables.ClientList[res.clientId].addNickname(res.Nickname);

    if (isLastLog)
      globalVariables.ClientList[res.clientId].disconnect();

    return res.boundaries;
  },

  /**
   * Parses the ClientDisconnect data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, Nickname: string, boundaries: {}}} the extracted data and the boundaries object.
   */
  parseMessageClientDisconnect: function (logLine) {
    const boundaries = {};

    boundaries.Nickname = [
      logLine.indexOf("client disconnected '") + 21,
      logLine.indexOf("'(id:")];

    boundaries.clientId = [boundaries.Nickname[1] + 5, 0];

    // Compatible with regular disconnects, bans and kicks.
    if (!logLine.includes(") reason 'reasonmsg"))
      boundaries.clientId[1] = logLine.lastIndexOf(") reason 'invokerid=");
    else
      boundaries.clientId[1] = logLine.lastIndexOf(") reason 'reasonmsg");

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
    };

    return {
      clientId: Number(getSubstring("clientId")),
      Nickname: getSubstring("Nickname"),
      boundaries: boundaries
    };
  },

  parseClientDeletion: function (message) {
    globalVariables.ClientList[this.parseMessageClientDeletion(message)].deleteClient();
  },

  /**
   * Parses the ClientDeletion data from the given logLine.
   * @param {string} logLine
   * @returns {number} the clientId of the deleted client.
   */
  parseMessageClientDeletion: function (logLine) {
    const boundaries = {};

    boundaries.clientId = [0, logLine.lastIndexOf(") got deleted by client '")];
    boundaries.clientId[0] = logLine.lastIndexOf("'(id:", boundaries.clientId[1]) + 5;

    return Number(miscFunctions.getSubstring(boundaries, logLine, "clientId"));
  }
};
