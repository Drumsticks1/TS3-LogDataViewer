// ServerGroup.js: ServerGroup class.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * @param {number} serverGroupListId
 * @param {number} serverGroupId
 * @param {string} creationDateTime
 * @param {string} serverGroupName
 * @constructor
 */
var ServerGroup = function (serverGroupListId, serverGroupId, creationDateTime, serverGroupName) {
  this.serverGroupListId = serverGroupListId;
  this.serverGroupId = serverGroupId;
  this.creationDateTime = creationDateTime;
  this.serverGroupName = serverGroupName;
  this.deleted = false;
};

/**
 * Changes the channelName to the new name.
 * @param {string} serverGroupName the new name.
 */
ServerGroup.prototype.renameServerGroup = function (serverGroupName) {
  this.serverGroupName = serverGroupName;
};

/**
 * Sets the deleted flag to true.
 */
ServerGroup.prototype.deleteServerGroup = function () {
  this.deleted = true;
};

module.exports = {
  ServerGroup: ServerGroup,

  /**
   * Adds a new ServerGroup with the given data to the array.
   * @param {Array} array
   * @param {number} serverGroupId
   * @param {string} creationDateTime
   * @param {string} serverGroupName
   */
  addServerGroup: function (array, serverGroupId, creationDateTime, serverGroupName) {
    array.push(
      new ServerGroup(
        array.length + 1,
        serverGroupId,
        creationDateTime,
        serverGroupName));
  },

  /**
   * Adds a new ServerGroup containing the data of the serverGroupObject to the array.
   * @param {Array} array
   * @param {object} serverGroupObject containing the serverGroup data.
   */
  addServerGroupViaObject: function (array, serverGroupObject) {
    var serverGroup = new ServerGroup(
      serverGroupObject.serverGroupListId,
      serverGroupObject.serverGroupId,
      serverGroupObject.creationDateTime,
      serverGroupObject.serverGroupName
    );
    
    serverGroup.deleted = serverGroupObject.deleted;
    array.push(serverGroup);
  },

  /**
   * Returns the object in the array with the given serverGroupId.
   * @param {Array} array
   * @param {number} serverGroupId
   * @returns {object}
   */
  getServerGroupByServerGroupId: function (array, serverGroupId) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].serverGroupId == serverGroupId)
        return array[i];
    }
    return null;
  }
};