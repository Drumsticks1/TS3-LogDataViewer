// Channel.js: Channel class.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * @param {number} channelListId
 * @param {number} channelId
 * @param {string} creationDateTime
 * @param {string} channelName
 * @constructor
 */
const Channel = function (channelListId, channelId, creationDateTime, channelName) {
  this.channelListId = channelListId;
  this.channelId = channelId;
  this.creationDateTime = creationDateTime;
  this.channelName = channelName;
  this.deleted = false;
};

/**
 * Changes the channelName to the new name.
 * @param {string} channelName the new name.
 */
Channel.prototype.renameChannel = function (channelName) {
  this.channelName = channelName;
};

/**
 * Sets the deleted flag to true.
 */
Channel.prototype.deleteChannel = function () {
  this.deleted = true;
};

module.exports = {
  Channel: Channel,

  /**
   * Adds a new Channel with the given data to the array.
   * @param {Array} array
   * @param {number} channelId
   * @param {string} creationDateTime
   * @param {string} channelName
   */
  addChannel: function (array, channelId, creationDateTime, channelName) {
    array.push(
      new Channel(
        array.length + 1,
        channelId,
        creationDateTime,
        channelName
      ));
  },

  /**
   * Returns the object in the array with the given channelId.
   * @param {Array} array
   * @param {number} channelId
   * @returns {object}
   */
  getChannelByChannelId: function (array, channelId) {
    for (let i = 0; i < array.length; i++) {
      if (array[i].channelId === channelId)
        return array[i];
    }
    return null;
  }
};
