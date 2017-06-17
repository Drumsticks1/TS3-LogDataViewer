// parsers/serverGroup.js : Parsing of ServerGroup events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const miscFunctions = require('../miscFunctions.js');

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
  /**
   * Parses the ServerGroupCreation data from the given logLine.
   * @param {string} logLine
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseServerGroupCreation: function (logLine) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      logLine.indexOf("'(id:") + 5,
      logLine.indexOf(") was added by '")];

    boundaries.ServerGroupName = [
      logLine.indexOf("servergroup '") + 13,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(logLine, boundaries);
  },

  /**
   * Parses the ServerGroupDeletion data from the given logLine.
   * @param {string} logLine
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseServerGroupDeletion: function (logLine) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      logLine.indexOf("'(id:") + 5,
      logLine.indexOf(") was deleted by '")];

    boundaries.ServerGroupName = [
      logLine.indexOf("servergroup '") + 13,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(logLine, boundaries);
  },

  /**
   * Parses the ServerGroupRenaming data from the given logLine.
   * @param {string} logLine
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseServerGroupRenaming: function (logLine) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      logLine.indexOf("'(id:") + 5,
      logLine.indexOf(") was renamed to '")];

    boundaries.ServerGroupName = [
      logLine.indexOf(") was renamed to '") + 18,
      logLine.lastIndexOf("' by '", logLine.length - 1)];

    return parseServerGroupModification(logLine, boundaries);
  },

  /**
   * Parses the ServerGroupCopying data from the given logLine.
   * @param {string} logLine
   * @returns {{ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseServerGroupCopying: function (logLine) {
    const boundaries = {};

    boundaries.ServerGroupID = [
      logLine.lastIndexOf("'(id:") + 5,
      logLine.length - 1];

    boundaries.ServerGroupName = [
      logLine.indexOf(") to '") + 6,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(logLine, boundaries);
  },

  /**
   * Parses the ServerGroupAssignment data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseServerGroupAssignment: function (logLine) {
    return parseServerGroupAssignmentOrRemoval(logLine,
      {ServerGroupName: [logLine.indexOf(") was added to servergroup '") + 28, 0]});
  },

  /**
   * Parses the ServerGroupRemoval data from the given logLine.
   * @param {string} logLine
   * @returns {{clientId: number, ServerGroupID: number, ServerGroupName: string}} the extracted data.
   */
  parseServerGroupRemoval: function (logLine) {
    return parseServerGroupAssignmentOrRemoval(logLine,
      {ServerGroupName: [logLine.indexOf(") was removed from servergroup '") + 32, 0]});
  }
};
