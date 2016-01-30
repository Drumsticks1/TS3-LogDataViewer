// Ban.js: Ban class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Default constructor.
 * @constructor
 */
var Ban = function() {
    this.bannedID = 0;
    this.bannedByID = 0;
    this.banTime = 0;
    this.banDateTime = "";
    this.bannedIP = "";
    this.bannedUID = "";
    this.bannedNickname = "";
    this.bannedByNickname = "";
    this.bannedByUID = "";
    this.banReason = "";
};

/**
 * Sets the data of the current Ban object according to the given data.
 * @param {string} banDateTime
 * @param {number} bannedID
 * @param {string} bannedNickname
 * @param {string} bannedUID
 * @param {string} bannedIP
 * @param {string} bannedByNickname
 * @param {number} bannedByID
 * @param {string} bannedByUID
 * @param {string} banReason
 * @param {number} banTime
 */
Ban.prototype.addBan = function(banDateTime, bannedID, bannedNickname, bannedUID, bannedIP, bannedByNickname, bannedByID, bannedByUID, banReason, banTime) {
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
Ban.prototype.getBanDateTime = function() {
    return this.banDateTime;
};
Ban.prototype.getBannedID = function() {
    return this.bannedID;
};
Ban.prototype.getBannedNickname = function() {
    return this.bannedNickname;
};
Ban.prototype.getBannedUID = function() {
    return this.bannedUID;
};
Ban.prototype.getBannedIP = function() {
    return this.bannedIP;
};
Ban.prototype.getBannedByNickname = function() {
    return this.bannedByNickname;
};
Ban.prototype.getBannedByID = function() {
    return this.bannedByID;
};
Ban.prototype.getBannedByUID = function() {
    return this.bannedByUID;
};
Ban.prototype.getBanReason = function() {
    return this.banReason;
};
Ban.prototype.getBanTime = function() {
    return this.banTime;
};

exports.Ban = Ban;