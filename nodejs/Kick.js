// Kick.js: Kick class.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * @param {number} kickId
 * @param {string} kickDateTime
 * @param {number} kickedID
 * @param {string} kickedNickname
 * @param {string} kickedByNickname
 * @param {string} kickedByUID
 * @param {string} kickReason
 * @constructor
 */
var Kick = function (kickId, kickDateTime, kickedID, kickedNickname, kickedByNickname, kickedByUID, kickReason) {
  this.kickId = kickId;
  this.kickDateTime = kickDateTime;
  this.kickedID = kickedID;
  this.kickedNickname = kickedNickname;
  this.kickedByNickname = kickedByNickname;
  this.kickedByUID = kickedByUID;
  this.kickReason = kickReason;
};

// Returns the requested information.
Kick.prototype.getKickDateTime = function () {
  return this.kickDateTime;
};
Kick.prototype.getKickedID = function () {
  return this.kickedID;
};
Kick.prototype.getKickedNickname = function () {
  return this.kickedNickname;
};
Kick.prototype.getKickedByNickname = function () {
  return this.kickedByNickname;
};
Kick.prototype.getKickedByUID = function () {
  return this.kickedByUID;
};
Kick.prototype.getKickReason = function () {
  return this.kickReason;
};

module.exports = {
  Kick: Kick,

  /**
   * Adds a new Kick with the given data to the array.
   * @param {Array} array
   * @param {string} kickDateTime
   * @param {number} kickedID
   * @param {string} kickedNickname
   * @param {string} kickedByNickname
   * @param {string} kickedByUID
   * @param {string} kickReason
   */
  addKick: function (array, kickDateTime, kickedID, kickedNickname, kickedByNickname, kickedByUID, kickReason) {
    array.push(
      new Kick(
        array.length + 1,
        kickDateTime,
        kickedID,
        kickedNickname,
        kickedByNickname,
        kickedByUID,
        kickReason
      ));
  },

  /**
   * Adds a new Kick containing the data of the kickObject to the array.
   * @param {Array} array
   * @param {object} kickObject containing the kick data.
   */
  addKickViaObject: function (array, kickObject) {
    array.push(
      new Kick(
        kickObject.kickId,
        kickObject.kickDateTime,
        kickObject.kickedID,
        kickObject.kickedNickname,
        kickObject.kickedByNickname,
        kickObject.kickedByUID,
        kickObject.kickReason
      ));
  }
};
