// Client.js : Client class.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Default constructor.
 * @constructor
 */
var Client = function() {
    this.ID = 0;
    this.Nicknames = [];
    this.Connections = [];
    this.IPs = [];
    this.ConnectedState = 0;
    this.ServerGroupIDs = [];
    this.ServerGroupAssignmentDateTimes = [];
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
 * Returns the count of the Connections.
 * @returns {number}
 */
Client.prototype.getConnectionCount = function() {
    return this.Connections.length;
};

/**
 * Returns the count of the Nicknames.
 * @returns {number}
 */
Client.prototype.getNicknameCount = function() {
    return this.Nicknames.length;
};

/**
 * Returns the Connection in the ConnectionID slot.
 * @param {number} ConnectionID
 * @returns {string}
 */
Client.prototype.getConnectionByID = function(ConnectionID) {
    return this.Connections[ConnectionID];
};

/**
 * Returns the Nickname in the NicknameID slot.
 * @param {number} NicknameID
 * @returns {string}
 */
Client.prototype.getNicknameByID = function(NicknameID) {
    return this.Nicknames[NicknameID];
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
    for (var i = 0; i < this.Nicknames.length; i++) {
        if (this.Nicknames[i] == Nickname) {
            this.Nicknames.splice(i, 1);
        }
    }
    this.Nicknames.unshift(Nickname);
};

/**
 * Adds the given Connection at the beginning of the Connections list.
 * @param {string} Connection the given Connection.
 */
Client.prototype.addConnection = function(Connection) {
    this.Connections.unshift(Connection);
};

/**
 * Adds the given IP at the beginning of the IPs list.
 * @param {string} IP the given IP.
 */
Client.prototype.addIP = function(IP) {
    for (var i = 0; i < this.IPs.length; i++) {
        if (this.IPs[i] == IP) {
            this.IPs.splice(i, 1);
        }
    }
    this.IPs.unshift(IP);
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
    // Check is required when a client disconnects without connection first.
    // At least occurs once when the server is started and the logging settings are set by the server admin.
    // As his connect isn't logged this would result in a negative ConnectedState and cause further issues.
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
    this.ServerGroupIDs.push(ServerGroupID);
    this.ServerGroupAssignmentDateTimes.push(ServerGroupAssignmentDateTime);
};

/**
 * Removes the ServerGroup data with the given ServerGroupID from the Client.
 * @param {number} ServerGroupID
 */
Client.prototype.removeServerGroupByID = function(ServerGroupID) {
    var done = false;
    for (var i = 0; i < this.ServerGroupIDs.length && !done; i++) {
        if (this.getServerGroupIDByID(i) == ServerGroupID) {
            this.ServerGroupIDs.splice(i, 1);
            this.ServerGroupAssignmentDateTimes.splice(i, 1);
            done = true;
        }
    }
};

/**
 * Returns the count of the ServerGroupIDs.
 * @returns {Number}
 */
Client.prototype.getServerGroupIDCount = function() {
    return this.ServerGroupIDs.length;
};

/**
 * Returns the ServerGroupID in the ServerGroupIDsID slot.
 * @param {number} ServerGroupIDsID
 * @returns {String}
 */
Client.prototype.getServerGroupIDByID = function(ServerGroupIDsID) {
    return this.ServerGroupIDs[ServerGroupIDsID];
};

exports.Client = Client;