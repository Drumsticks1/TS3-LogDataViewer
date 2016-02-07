// ServerGroup.js: ServerGroup class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Default constructor.
 * @constructor
 */
var ServerGroup = function() {
    this.ID = 0;
    this.ServerGroupName = "";
    this.CreationDateTime = "";
    this.deleted = false;
};

/**
 * Adds the given information to the ServerGroup object.
 * @param {number} ID
 * @param {string} ServerGroupName
 * @param {string} CreationDateTime
 */
ServerGroup.prototype.addServerGroupInformation = function(ID, ServerGroupName, CreationDateTime) {
    this.ID = ID;
    this.ServerGroupName = ServerGroupName;
    this.CreationDateTime = CreationDateTime;
};

/**
 * Renames the ServerGroup to the new name.
 * @param {string} newServerGroupName the new name.
 */
ServerGroup.prototype.renameServerGroup = function(newServerGroupName) {
    this.ServerGroupName = newServerGroupName;
};

/**
 * Returns the ID of the ServerGroup.
 * @returns {number|*} the ID.
 */
ServerGroup.prototype.getID = function() {
    return this.ID;
};

/**
 * Sets the deleted flag to true.
 */
ServerGroup.prototype.deleteServerGroup = function() {
    this.deleted = true;
};

exports.ServerGroup = ServerGroup;