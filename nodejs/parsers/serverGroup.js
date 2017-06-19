// parsers/serverGroup.js : Parsing of ServerGroup events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../miscFunctions.js');
var ServerGroup = require("../ServerGroup.js");
var Client = require("../Client.js");
var checkFunctions = require("../checkFunctions.js");
var globalVariables = require("../globalVariables.js");

/**
 * Parses the ServerGroup assignment or removal data from the given logLine.
 * Requires a boundaries object containing the positions for the clientId, ServerGroupID and ServerGroupName data.
 * @param {string} logLine
 * @param {object} boundaries boundaries object containing the positions for the clientId, Nickname and IP data.
 * @returns {{clientId: number, ServerGroupID: number, ServerGroupName: string}} the extracted data.
 */
function parseServerGroupAssignmentOrRemoval(logLine, boundaries) {
  boundaries.ServerGroupName[1] = logLine.lastIndexOf("'(id:", logLine.lastIndexOf(") by client '"));

  boundaries.ServerGroupID = [
    boundaries.ServerGroupName[1] + 5,
    logLine.indexOf(")", boundaries.ServerGroupName[0])];

  boundaries.clientId = [
    logLine.indexOf("client (id:") + 11,
    logLine.indexOf(") was ")];


  const getSubstring = function (boundariesIdentifier) {
    return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
  };

  return {
    clientId: Number(getSubstring("clientId")),
    ServerGroupID: Number(getSubstring("ServerGroupID")),
    ServerGroupName: getSubstring("ServerGroupName")
  };
}

/**
 * Parses the ServerGroup modification data from the given logLine.
 * Requires a boundaries object containing the positions for the ServerGroupID and ServerGroupName data.
 * @param {string} logLine
 * @param {object} boundaries boundaries object containing the positions for the clientId, Nickname and IP data.
 * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
 */
function parseServerGroupModification(logLine, boundaries) {
  const getSubstring = function (boundariesIdentifier) {
    return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
  };

  return {
    ServerGroupID: Number(getSubstring("ServerGroupID")),
    ServerGroupName: getSubstring("ServerGroupName")
  };
}

module.exports = {

  parseServerGroupCreation: function (message, dateTime) {
    const res = this.parseMessageServerGroupCreation(message);

    ServerGroup.addServerGroup(globalVariables.ServerGroupList, res.ServerGroupID, dateTime, res.ServerGroupName);
  },

  /**
   * Parses the ServerGroupCreation data from the given logLine.
   * @param {string} logLine
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupCreation: function (logLine) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      logLine.indexOf("'(id:") + 5,
      logLine.indexOf(") was added by '")];

    boundaries.ServerGroupName = [
      logLine.indexOf("servergroup '") + 13,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(logLine, boundaries);
  },

  parseServerGroupDeletion: function (message) {
    const res = this.parseMessageServerGroupDeletion(message);

    if (ServerGroup.getServerGroupByServerGroupId(globalVariables.ServerGroupList, res.ServerGroupID) === null)
      ServerGroup.addServerGroup(globalVariables.ServerGroupList, res.ServerGroupID, "Unknown", res.ServerGroupName);

    ServerGroup.getServerGroupByServerGroupId(globalVariables.ServerGroupList, res.ServerGroupID).deleteServerGroup();

  },

  /**
   * Parses the ServerGroupDeletion data from the given logLine.
   * @param {string} logLine
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupDeletion: function (logLine) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      logLine.indexOf("'(id:") + 5,
      logLine.indexOf(") was deleted by '")];

    boundaries.ServerGroupName = [
      logLine.indexOf("servergroup '") + 13,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(logLine, boundaries);
  },

  parseServerGroupRenaming: function (message) {
    const res = this.parseMessageServerGroupRenaming(message);

    if (ServerGroup.getServerGroupByServerGroupId(globalVariables.ServerGroupList, res.ServerGroupID) === null)
      ServerGroup.addServerGroup(globalVariables.ServerGroupList, res.ServerGroupID, "Unknown", res.ServerGroupName);

    ServerGroup.getServerGroupByServerGroupId(globalVariables.ServerGroupList, res.ServerGroupID).renameServerGroup(res.ServerGroupName);
  },

  /**
   * Parses the ServerGroupRenaming data from the given logLine.
   * @param {string} logLine
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupRenaming: function (logLine) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      logLine.indexOf("'(id:") + 5,
      logLine.indexOf(") was renamed to '")];

    boundaries.ServerGroupName = [
      logLine.indexOf(") was renamed to '") + 18,
      logLine.lastIndexOf("' by '", logLine.length - 1)];

    return parseServerGroupModification(logLine, boundaries);
  },

  parseServerGroupCopying: function (message, dateTime) {
    const res = this.parseMessageServerGroupCopying(message);

    ServerGroup.addServerGroup(globalVariables.ServerGroupList, res.ServerGroupID, dateTime, res.ServerGroupName);
  },

  /**
   * Parses the ServerGroupCopying data from the given logLine.
   * @param {string} logLine
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupCopying: function (logLine) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      logLine.lastIndexOf("'(id:") + 5,
      logLine.length - 1];

    boundaries.ServerGroupName = [
      logLine.indexOf(") to '") + 6,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(logLine, boundaries);
  },

  parseServerGroupAssignment: function (message, dateTime) {
    let res = this.parseMessageServerGroupAssignment(message);

    // Checks if the server group exists and if not, ... TODO
    if (ServerGroup.getServerGroupByServerGroupId(globalVariables.ServerGroupList, res.ServerGroupID) === null)
      ServerGroup.addServerGroup(globalVariables.ServerGroupList, res.ServerGroupID, "Unknown", res.ServerGroupName);

    Client.fillArrayWithDummyClients(globalVariables.ClientList, res.clientId);

    if (!checkFunctions.isDuplicateServerGroup(res.clientId, res.ServerGroupID))
      globalVariables.ClientList[res.clientId].addServerGroup(res.ServerGroupID, dateTime);
  },

  // todo: add test case
  /**
   * Parses the ServerGroupAssignment data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupAssignment: function (logLine) {
    return parseServerGroupAssignmentOrRemoval(logLine,
      {ServerGroupName: [logLine.indexOf(") was added to servergroup '") + 28, 0]});
  },

  parseServerGroupRemoval: function (message) {
    let res = this.parseMessageServerGroupRemoval(message);

    // Checks if the server group exists and if not, ... TODO
    const serverGroupObject = ServerGroup.getServerGroupByServerGroupId(globalVariables.ServerGroupList, res.ServerGroupID);

    if (serverGroupObject === null)
      ServerGroup.addServerGroup(globalVariables.ServerGroupList, res.ServerGroupID, "Unknown", res.ServerGroupName);

    Client.fillArrayWithDummyClients(globalVariables.ClientList, res.clientId);

    globalVariables.ClientList[res.clientId].removeServerGroupByID(res.ServerGroupID);
  },

  // todo: add test case
  /**
   * Parses the ServerGroupRemoval data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseMessageServerGroupRemoval: function (logLine) {
    return parseServerGroupAssignmentOrRemoval(logLine,
      {ServerGroupName: [logLine.indexOf(") was removed from servergroup '") + 32, 0]});
  }
};
