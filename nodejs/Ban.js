// Ban.js: Ban class.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * @param {number} banListId
 * @param {string} banDateTime
 * @param {number} bannedID
 * @param {string} bannedNickname
 * @param {string} bannedUID
 * @param {string} bannedIP
 * @param {number} bannedByID
 * @param {string} bannedByNickname
 * @param {string} bannedByUID
 * @param {string} banReason
 * @param {number} banTime
 * @constructor
 */
const Ban = function (banListId, banDateTime, bannedID, bannedNickname, bannedUID, bannedIP, bannedByID, bannedByNickname, bannedByUID, banReason, banTime) {
  this.banListId = banListId;
  this.banDateTime = banDateTime;
  this.bannedID = bannedID;
  this.bannedNickname = bannedNickname;
  this.bannedUID = bannedUID;
  this.bannedIP = bannedIP;
  this.bannedByID = bannedByID;
  this.bannedByNickname = bannedByNickname;
  this.bannedByUID = bannedByUID;
  this.banReason = banReason;
  this.banTime = banTime;
};

// Returns the requested information.
Ban.prototype.getBanDateTime = function () {
  return this.banDateTime;
};
Ban.prototype.getBannedID = function () {
  return this.bannedID;
};
Ban.prototype.getBannedNickname = function () {
  return this.bannedNickname;
};
Ban.prototype.getBannedUID = function () {
  return this.bannedUID;
};
Ban.prototype.getBannedIP = function () {
  return this.bannedIP;
};
Ban.prototype.getBannedByNickname = function () {
  return this.bannedByNickname;
};
Ban.prototype.getBannedByID = function () {
  return this.bannedByID;
};
Ban.prototype.getBannedByUID = function () {
  return this.bannedByUID;
};
Ban.prototype.getBanReason = function () {
  return this.banReason;
};
Ban.prototype.getBanTime = function () {
  return this.banTime;
};

module.exports = {
  Ban: Ban,

  /**
   * Adds a new Ban with the given data to the array.
   * @param {Array} array
   * @param {string} banDateTime
   * @param {number} bannedID
   * @param {string} bannedNickname
   * @param {string} bannedUID
   * @param {string} bannedIP
   * @param {number} bannedByID
   * @param {string} bannedByNickname
   * @param {string} bannedByUID
   * @param {string} banReason
   * @param {number} banTime
   */
  addBan: function (array, banDateTime, bannedID, bannedNickname, bannedUID, bannedIP, bannedByID, bannedByNickname, bannedByUID, banReason, banTime) {
    array.push(
      new Ban(
        array.length + 1,
        banDateTime,
        bannedID,
        bannedNickname,
        bannedUID,
        bannedIP,
        bannedByID,
        bannedByNickname,
        bannedByUID,
        banReason,
        banTime
      ));
  }
};
