// Kick.js: Kick class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Default constructor.
 * @constructor
 */
var Kick = function() {
    this.kickedID = 0;
    this.kickDateTime = "";
    this.kickedNickname = "";
    this.kickedByNickname = "";
    this.kickedByUID = "";
    this.kickReason = "";
};

// Sets the data of the current Kick object according to the given data.
Kick.prototype.addKick = function(kickDateTime, kickedID, kickedNickname, kickedByNickname, kickedByUID, kickReason) {
    this.kickDateTime = kickDateTime;
    this.kickedID = kickedID;
    this.kickedNickname = kickedNickname;
    this.kickedByNickname = kickedByNickname;
    this.kickedByUID = kickedByUID;
    this.kickReason = kickReason;
};

// Returns the requested information.
Kick.prototype.getKickDateTime = function() {
    return this.kickDateTime;
};
Kick.prototype.getKickedID = function() {
    return this.kickedID;
};
Kick.prototype.getKickedNickname = function() {
    return this.kickedNickname;
};
Kick.prototype.getKickedByNickname = function() {
    return this.kickedByNickname;
};
Kick.prototype.getKickedByUID = function() {
    return this.kickedByUID;
};
Kick.prototype.getKickReason = function() {
    return this.kickReason;
};

exports.Kick = Kick;