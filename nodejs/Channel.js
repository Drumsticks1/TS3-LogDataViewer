// Channel.js: Channel class.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Default constructor.
 * @constructor
 */
var Channel = function () {
  this.ID = -1;
  this.creationDateTime = "";
  this.channelName = "";
  this.deleted = false;
};

/**
 * Adds the given information to the Channel object.
 * @param {number} ID
 * @param {string} creationDateTime
 * @param {string} channelName
 */
Channel.prototype.addChannel = function (ID, creationDateTime, channelName) {
  this.ID = ID;
  this.channelName = channelName;
  this.creationDateTime = creationDateTime;
};

/**
 * Sets the data of the current Channel according to the data in the given channelObject.
 * @param {object} channelObject containing the channel data.
 */
Channel.prototype.addChannelViaObject = function (channelObject) {
  this.ID = channelObject.ID;
  this.channelName = channelObject.channelName;
  this.creationDateTime = channelObject.creationDateTime;
  this.deleted = channelObject.deleted;
};

/**
 * Changes the channelName to the new name.
 * @param {string} channelName the new name.
 */
Channel.prototype.renameChannel = function (channelName) {
  this.channelName = channelName;
};

/**
 * Returns the ID of the Channel.
 * @returns {number|*} the ID.
 */
Channel.prototype.getID = function () {
  return this.ID;
};

/**
 * Sets the deleted flag to true.
 */
Channel.prototype.deleteChannel = function () {
  this.deleted = true;
};

exports.Channel = Channel;