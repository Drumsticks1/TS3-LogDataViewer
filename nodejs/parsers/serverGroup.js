// serverGroup.js :
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

function parseServerGroupAssignmentOrRemoval(logLine, boundaries) {
  boundaries.ServerGroupName[1] = logLine.lastIndexOf("'(id:", logLine.lastIndexOf(") by client '"));

  boundaries.ServerGroupID = [
    boundaries.ServerGroupName[1] + 5,
    logLine.indexOf(")", boundaries.ServerGroupName[0])];

  boundaries.clientId = [
    logLine.indexOf("client (id:") + 11,
    logLine.indexOf(") was ")];

  function getSubstring(boundariesIdentifier) {
    return logLine.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
  }

  return {
    clientId: Number(getSubstring("clientId")),
    ServerGroupID: Number(getSubstring("ServerGroupID")),
    ServerGroupName: getSubstring("ServerGroupName")
  };
}

function parseServerGroupModification(logLine, boundaries) {
  boundaries.ServerGroupID[0] = logLine.indexOf("'(id:") + 5;

  function getSubstring(boundariesIdentifier) {
    return logLine.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
  }

  return {
    ServerGroupID: Number(getSubstring("ServerGroupID")),
    ServerGroupName: getSubstring("ServerGroupName")
  };
}

/**
 *
 * @param logLine
 */
module.exports = {
  parseServerGroupCreation: function (logLine) {
    var boundaries = {};
    boundaries.ServerGroupID = [0, logLine.indexOf(") was added by '")];

    boundaries.ServerGroupName = [
      logLine.indexOf("servergroup '") + 13,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(logLine, boundaries);
  },

  parseServerGroupDeletion: function (logLine) {
    var boundaries = {};
    boundaries.ServerGroupID = [0, logLine.indexOf(") was deleted by '")];

    boundaries.ServerGroupName = [
      logLine.indexOf("servergroup '") + 13,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(logLine, boundaries);
  },

  parseServerGroupRenaming: function (logLine) {
    var boundaries = {};

    boundaries.ServerGroupID = [0, logLine.indexOf(") was renamed to '")];

    boundaries.ServerGroupName = [
      logLine.indexOf(") was renamed to '") + 18,
      logLine.lastIndexOf("' by '", logLine.length - 1)];

    return parseServerGroupModification(logLine, boundaries);
  },

  parseServerGroupCopying: function (logLine) {
    var boundaries = {};

    boundaries.ServerGroupID = [0, logLine.length - 1];

    boundaries.ServerGroupName = [
      logLine.indexOf(") to '") + 6,
      boundaries.ServerGroupID[0] - 5];

    return parseServerGroupModification(logLine, boundaries);
  },

  parseServerGroupAssignment: function (logLine) {
    return parseServerGroupAssignmentOrRemoval(logLine,
      {ServerGroupName: [logLine.indexOf(") was added to servergroup '") + 28, 0]});
  },

  parseServerGroupRemoval: function (logLine) {
    return parseServerGroupAssignmentOrRemoval(logLine,
      {ServerGroupName: [logLine.indexOf(") was removed from servergroup '") + 32, 0]});
  }
};