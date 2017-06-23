// parsers/parser-server-group.js : Parsing of ServerGroup events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../misc-functions.js');
var ServerGroup = require("../classes/server-group.js");
var Client = require("../classes/client.js");
var checkFunctions = require("../check-functions.js");
var data = require("../data.js");

/**
 * Parses the ServerGroup assignment or removal data from the given message.
 * Requires a boundaries object containing the positions for the clientId, ServerGroupID and ServerGroupName data.
 * @param {string} message
 * @param {object} boundaries boundaries object containing the positions for the clientId, Nickname and IP data.
 * @returns {{clientId: number, ServerGroupID: number, ServerGroupName: string}} the extracted data.
 */
function parseServerGroupAssignmentOrRemoval(message, boundaries) {
  boundaries.ServerGroupName[1] = message.lastIndexOf("'(id:", message.lastIndexOf(") by client '"));

  boundaries.ServerGroupID = [
    boundaries.ServerGroupName[1] + 5,
    message.indexOf(")", boundaries.ServerGroupName[0])];

  boundaries.clientId = [
    message.indexOf("client (id:") + 11,
    message.indexOf(") was ")];


  const getSubstring = function (boundariesIdentifier) {
    return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
  };

  return {
    clientId: Number(getSubstring("clientId")),
    ServerGroupID: Number(getSubstring("ServerGroupID")),
    ServerGroupName: getSubstring("ServerGroupName")
  };
}

/**
 * Parses the ServerGroup modification data from the given message.
 * Requires a boundaries object containing the positions for the ServerGroupID and ServerGroupName data.
 * @param {string} message
 * @param {object} boundaries boundaries object containing the positions for the clientId, Nickname and IP data.
 * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
 */
function parseServerGroupModification(message, boundaries) {
  const getSubstring = function (boundariesIdentifier) {
    return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
  };

  return {
    ServerGroupID: Number(getSubstring("ServerGroupID")),
    ServerGroupName: getSubstring("ServerGroupName")
  };
}

module.exports = {

  parseServerGroupCreation: function (message, dateTime) {
    const res = this.parseMessageServerGroupCreation(message);

    ServerGroup.addServerGroup(data.ServerGroupList, res.ServerGroupID, dateTime, res.ServerGroupName);
  },

  /**
   * Parses the ServerGroupCreation data from the given message.
   * @param {string} message
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupCreation: function (message) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      message.indexOf("'(id:") + 5,
      message.indexOf(") was added by '")];

    boundaries.ServerGroupName = [
      message.indexOf("servergroup '") + 13,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(message, boundaries);
  },

  parseServerGroupDeletion: function (message) {
    const res = this.parseMessageServerGroupDeletion(message);

    if (ServerGroup.getServerGroupByServerGroupId(data.ServerGroupList, res.ServerGroupID) === null)
      ServerGroup.addServerGroup(data.ServerGroupList, res.ServerGroupID, "Unknown", res.ServerGroupName);

    ServerGroup.getServerGroupByServerGroupId(data.ServerGroupList, res.ServerGroupID).deleteServerGroup();

  },

  /**
   * Parses the ServerGroupDeletion data from the given message.
   * @param {string} message
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupDeletion: function (message) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      message.indexOf("'(id:") + 5,
      message.indexOf(") was deleted by '")];

    boundaries.ServerGroupName = [
      message.indexOf("servergroup '") + 13,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(message, boundaries);
  },

  parseServerGroupRenaming: function (message) {
    const res = this.parseMessageServerGroupRenaming(message);

    if (ServerGroup.getServerGroupByServerGroupId(data.ServerGroupList, res.ServerGroupID) === null)
      ServerGroup.addServerGroup(data.ServerGroupList, res.ServerGroupID, "Unknown", res.ServerGroupName);

    ServerGroup.getServerGroupByServerGroupId(data.ServerGroupList, res.ServerGroupID).renameServerGroup(res.ServerGroupName);
  },

  /**
   * Parses the ServerGroupRenaming data from the given message.
   * @param {string} message
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupRenaming: function (message) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      message.indexOf("'(id:") + 5,
      message.indexOf(") was renamed to '")];

    boundaries.ServerGroupName = [
      message.indexOf(") was renamed to '") + 18,
      message.lastIndexOf("' by '", message.length - 1)];

    return parseServerGroupModification(message, boundaries);
  },

  parseServerGroupCopying: function (message, dateTime) {
    const res = this.parseMessageServerGroupCopying(message);

    ServerGroup.addServerGroup(data.ServerGroupList, res.ServerGroupID, dateTime, res.ServerGroupName);
  },

  /**
   * Parses the ServerGroupCopying data from the given message.
   * @param {string} message
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupCopying: function (message) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      message.lastIndexOf("'(id:") + 5,
      message.length - 1];

    boundaries.ServerGroupName = [
      message.indexOf(") to '") + 6,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(message, boundaries);
  },

  parseServerGroupAssignment: function (message, dateTime) {
    let res = this.parseMessageServerGroupAssignment(message);

    // Checks if the server group exists and if not, ... TODO
    if (ServerGroup.getServerGroupByServerGroupId(data.ServerGroupList, res.ServerGroupID) === null)
      ServerGroup.addServerGroup(data.ServerGroupList, res.ServerGroupID, "Unknown", res.ServerGroupName);

    Client.fillArrayWithDummyClients(data.ClientList, res.clientId);

    if (!checkFunctions.isDuplicateServerGroup(res.clientId, res.ServerGroupID))
      data.ClientList[res.clientId].addServerGroup(res.ServerGroupID, dateTime);
  },

  // todo: add test case
  /**
   * Parses the ServerGroupAssignment data from the given message.
   * @param {string} message
   * @returns {{clientId: number, ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupAssignment: function (message) {
    return parseServerGroupAssignmentOrRemoval(message,
      {ServerGroupName: [message.indexOf(") was added to servergroup '") + 28, 0]});
  },

  parseServerGroupRemoval: function (message) {
    let res = this.parseMessageServerGroupRemoval(message);

    // Checks if the server group exists and if not, ... TODO
    const serverGroupObject = ServerGroup.getServerGroupByServerGroupId(data.ServerGroupList, res.ServerGroupID);

    if (serverGroupObject === null)
      ServerGroup.addServerGroup(data.ServerGroupList, res.ServerGroupID, "Unknown", res.ServerGroupName);

    Client.fillArrayWithDummyClients(data.ClientList, res.clientId);

    data.ClientList[res.clientId].removeServerGroupByID(res.ServerGroupID);
  },

  // todo: add test case
  /**
   * Parses the ServerGroupRemoval data from the given message.
   * @param {string} message
   * @returns {{clientId: number, ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupRemoval: function (message) {
    return parseServerGroupAssignmentOrRemoval(message,
      {ServerGroupName: [message.indexOf(") was removed from servergroup '") + 32, 0]});
  }
};
