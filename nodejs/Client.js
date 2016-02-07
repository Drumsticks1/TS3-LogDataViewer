// Client.js : Client class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Default constructor.
 * @constructor
 */
var Client = function() {
    this.ID = 0;
    this.Nickname = [];
    this.DateTime = [];
    this.IP = [];
    this.ConnectedState = 0;
    this.ServerGroupID = [];
    this.ServerGroupAssignmentDateTime = [];
    this.deleted = false;
};

/**
 * Returns the ID of the Client.
 * @returns {number|*}
 */
Client.prototype.getID = function() {
    return this.ID;
};

/**
 * Returns the count of the DateTime entries of the Client.
 * @returns {Number}
 */
Client.prototype.getDateTimeCount = function() {
    return this.DateTime.length;
};

/**
 * Returns the count of the Nickname entries of the Client.
 * @returns {Number}
 */
Client.prototype.getNicknameCount = function() {
    return this.Nickname.length;
};

/**
 * Returns the DateTime in the DateTimeID slot.
 * @param {number} DateTimeID
 * @returns {string}
 */
Client.prototype.getUniqueDateTime = function(DateTimeID) {
    return this.DateTime[DateTimeID];
};

/**
 * Returns the Nickname in the NicknameID slot.
 * @param {number} NicknameID
 * @returns {string}
 */
Client.prototype.getUniqueNickname = function(NicknameID) {
    return this.Nickname[NicknameID];
};

/**
 * Sets the given ID as Client ID.
 * @param {number} ID the given ID.
 */
Client.prototype.addID = function(ID) {
    this.ID = ID;
};

/**
 * Adds the given Nickname at the beginning of the Nickname list.
 * @param {string} Nickname the given Nickname.
 */
Client.prototype.addNickname = function(Nickname) {
    for (var i = 0; i < this.Nickname.length; i++) {
        if (this.Nickname[i] == Nickname) {
            this.Nickname.splice(i, 1);
        }
    }
    this.Nickname.unshift(Nickname);
};

/**
 * Adds the given DateTime at the beginning of the DateTime list.
 * @param {string} DateTime the given DateTime.
 */
Client.prototype.addDateTime = function(DateTime) {
    this.DateTime.unshift(DateTime);
};

/**
 * Adds the given IP at the beginning of the IP list.
 * @param {string} IP the given IP.
 */
Client.prototype.addIP = function(IP) {
    for (var i = 0; i < this.IP.length; i++) {
        if (this.IP[i] == IP) {
            this.IP.splice(i, 1);
        }
    }
    this.IP.unshift(IP);
};

/**
 * Increments the ConnectedState counter.
 */
Client.prototype.connect = function() {
    this.ConnectedState++;
};

/**
 * Decrements the ConnectedState counter.
 */
Client.prototype.disconnect = function() {
    // Todo: Check if necessary.
    if (this.ConnectedState > 0)
        this.ConnectedState--;
};

/**
 * Resets the ConnectedState counter to 0.
 */
Client.prototype.resetConnectedState = function() {
    this.ConnectedState = 0;
};

/**
 * Sets the deleted flag to true.
 */
Client.prototype.deleteClient = function() {
    this.deleted = true;
};

/**
 * Adds the given ServerGroup data to the Client.
 * @param {number} ServerGroupID
 * @param {string} ServerGroupAssignmentDateTime
 */
Client.prototype.addServerGroup = function(ServerGroupID, ServerGroupAssignmentDateTime) {
    this.ServerGroupID.push(ServerGroupID);
    this.ServerGroupAssignmentDateTime.push(ServerGroupAssignmentDateTime);
};

/**
 * Removes the ServerGroup data with the given ServerGroupID from the Client.
 * @param {number} ServerGroupID
 */
Client.prototype.removeServerGroupByID = function(ServerGroupID) {
    var done = false;
    for (var i = 0; i < this.ServerGroupID.length && !done; i++) {
        if (this.getUniqueServerGroupID(i) == ServerGroupID) {
            this.ServerGroupID.splice(i, 1);
            this.ServerGroupAssignmentDateTime.splice(i, 1);
            done = true;
        }
    }
};

/**
 * Returns the count of the ServerGroupIDs.
 * @returns {Number}
 */
Client.prototype.getServerGroupIDCount = function() {
    return this.ServerGroupID.length;
};

/**
 * Returns the ServerGroupID in the ServerGroupIDPos slot.
 * @param {number} ServerGroupIDPos
 * @returns {String}
 */
Client.prototype.getUniqueServerGroupID = function(ServerGroupIDPos) {
    return this.ServerGroupID[ServerGroupIDPos];
};

exports.Client = Client;