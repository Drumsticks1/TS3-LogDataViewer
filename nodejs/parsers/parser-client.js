// parsers/parser-client.js : Parsing of Client events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../misc-functions.js');
var Client = require("../classes/client.js");
var data = require("../data.js");
var checkFunctions = require("../check-functions.js");

module.exports = {

  parseClientConnect: function (message, dateTime, isLastLog) {
    let res = this.parseMessageClientConnect(message);

    Client.fillArrayWithDummyClients(data.ClientList, res.clientId);

    if (data.ClientList[res.clientId].clientId === -1)
      data.ClientList[res.clientId].updateClientId(res.clientId);

    data.ClientList[res.clientId].addNickname(res.Nickname);

    if (data.bufferData) {
      if (!checkFunctions.isDuplicateConnection(res.clientId, dateTime))
        data.ClientList[res.clientId].addConnection(dateTime);
    }
    else data.ClientList[res.clientId].addConnection(dateTime);

    data.ClientList[res.clientId].addIP(res.IP);

    if (isLastLog)
      data.ClientList[res.clientId].connect();
  },

  /**
   * Parses the ClientConnect data from the given message.
   * @param {string} message
   * @returns {{clientId: number, Nickname: string, IP: string}} the extracted data.
   */
  parseMessageClientConnect: function (message) {
    const boundaries = {};

    boundaries.IP = [
      message.lastIndexOf(" ") + 1,
      message.length - 6]; // -6 for ignoring the port.

    boundaries.Nickname = [
      message.indexOf("client connected '") + 18,
      message.lastIndexOf("'(id:")];

    boundaries.clientId = [
      boundaries.Nickname[1] + 5,
      boundaries.IP[0] - 7];

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
    };

    // quick fix for "using a myTeamSpeak ID connects".
    if (isNaN(Number(getSubstring("clientId")))) {
      boundaries.clientId[1] = message.lastIndexOf(") using a myTeamSpeak ID from")
    }

    return {
      clientId: Number(getSubstring("clientId")),
      Nickname: getSubstring("Nickname"),
      IP: getSubstring("IP")
    };
  },

  parseQueryClientConnect: function (message, dateTime) {
    let res = this.parseMessageQueryClientConnect(message);

    Client.fillArrayWithDummyClients(data.ClientList, res.clientId);

    if (data.ClientList[res.clientId].clientId === -1)
      data.ClientList[res.clientId].updateClientId(res.clientId);

    data.ClientList[res.clientId].addNickname(res.Nickname);

    if (data.bufferData) {
      if (!checkFunctions.isDuplicateConnection(res.clientId, dateTime))
        data.ClientList[res.clientId].addConnection(dateTime);
    }
    else data.ClientList[res.clientId].addConnection(dateTime);

    data.ClientList[res.clientId].addIP(res.IP);
  },

  /**
   * Parses the QueryClientConnect data from the given message.
   * @param {string} message
   * @returns {{clientId: number, Nickname: string, IP: string}} the extracted data.
   */
  parseMessageQueryClientConnect: function (message) {
    const boundaries = {};

    boundaries.Nickname = [
      message.indexOf("query client connected '") + 24,
      message.lastIndexOf("'(id:") - 6]; // -6 for ignoring the port.

    boundaries.clientId = [
      boundaries.Nickname[1] + 11,
      message.length - 1];

    boundaries.IP = [
      message.lastIndexOf(" from ") + 6,
      boundaries.Nickname[1]];

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
    };

    return {
      clientId: Number(getSubstring("clientId")),
      Nickname: getSubstring("Nickname"),
      IP: getSubstring("IP")
    };
  },

  parseClientDisconnect: function (message, dateTime, isLastLog) {
    let res = this.parseMessageClientDisconnect(message);

    if (data.ClientList.length < res.clientId + 1) {
      Client.fillArrayWithDummyClients(data.ClientList, res.clientId);
      data.ClientList[res.clientId].updateClientId(res.clientId);
    }

    if (data.ClientList[res.clientId].getNicknameCount() === 0 || data.ClientList[res.clientId].getNicknameByID(0) !== res.Nickname)
      data.ClientList[res.clientId].addNickname(res.Nickname);

    if (isLastLog)
      data.ClientList[res.clientId].disconnect();

    return res;
  },

  /**
   * Parses the ClientDisconnect data from the given message.
   * @param {string} message
   * @returns {{clientId: number, Nickname: string, boundaries: {}}} the extracted data and the boundaries object.
   */
  parseMessageClientDisconnect: function (message) {
    const boundaries = {};

    boundaries.Nickname = [
      message.indexOf("client disconnected '") + 21,
      message.indexOf("'(id:")];

    boundaries.clientId = [boundaries.Nickname[1] + 5, 0];

    // Compatible with regular disconnects, bans and kicks.
    if (!message.includes(") reason 'reasonmsg"))
      boundaries.clientId[1] = message.lastIndexOf(") reason 'invokerid=");
    else
      boundaries.clientId[1] = message.lastIndexOf(") reason 'reasonmsg");

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
    };

    return {
      clientId: Number(getSubstring("clientId")),
      Nickname: getSubstring("Nickname"),
      boundaries: boundaries
    };
  },

  parseClientDeletion: function (message) {
    data.ClientList[this.parseMessageClientDeletion(message)].deleteClient();
  },

  /**
   * Parses the ClientDeletion data from the given message.
   * @param {string} message
   * @returns {number} the clientId of the deleted client.
   */
  parseMessageClientDeletion: function (message) {
    const boundaries = {};

    boundaries.clientId = [0, message.lastIndexOf(") got deleted by client '")];
    boundaries.clientId[0] = message.lastIndexOf("'(id:", boundaries.clientId[1]) + 5;

    return Number(miscFunctions.getSubstring(boundaries, message, "clientId"));
  }
};
