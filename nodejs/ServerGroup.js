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


// Adds the given information to the ServerGroup
ServerGroup.prototype.addServerGroupInformation = function(ID, ServerGroupName, CreationDateTime) {
    this.ID = ID;
    this.ServerGroupName = ServerGroupName;
    this.CreationDateTime = CreationDateTime;
};

//
ServerGroup.prototype.renameServerGroup = function(newServerGroupName) {
    this.ServerGroupName = newServerGroupName;
};

//
ServerGroup.prototype.getID = function() {
    return this.ID;
};
ServerGroup.prototype.getServerGroupName = function() {
    return this.ServerGroupName;
};
ServerGroup.prototype.getCreationDateTime = function() {
    return this.CreationDateTime;
};


// Sets the deleted flag to true.
ServerGroup.prototype.deleteServerGroup = function() {
    this.deleted = true;
};

//
ServerGroup.prototype.isDeleted = function() {
    return this.deleted;
};

var ServerGroupList = [];

exports.ServerGroup = ServerGroup;
exports.ServerGroupList = ServerGroupList;