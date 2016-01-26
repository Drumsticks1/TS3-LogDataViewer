// Upload.js: Upload class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const globalVariables = require("./globalVariables.js");

/**
 * Default constructor.
 * @constructor
 */
var Upload = function() {
    this.channelID = 0;
    this.uploadedByID = 0;
    this.deletedByID = 0;
    this.uploadDateTime = "";
    this.filename = "";
    this.uploadedByNickname = "";
    this.deletedByNickname = "";
    this.deleted = false;
};

// Sets the data of the current Upload object according to the given data.
Upload.prototype.addUpload = function(uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID) {
    this.uploadDateTime = uploadDateTime;
    this.channelID = channelID;
    this.filename = filename;
    this.uploadedByNickname = uploadedByNickname;
    this.uploadedByID = uploadedByID;
};

// Returns the requested information.
Upload.prototype.getUploadDateTime = function() {
    return this.uploadDateTime;
};
Upload.prototype.getChannelID = function() {
    return this.channelID;
};
Upload.prototype.getFilename = function() {
    return this.filename;
};
Upload.prototype.getUploadedByNickname = function() {
    return this.uploadedByNickname;
};
Upload.prototype.getUploadedByID = function() {
    return this.uploadedByID;
};
Upload.prototype.getDeletedByNickname = function() {
    return this.deletedByNickname;
};
Upload.prototype.getDeletedByID = function() {
    return this.deletedByID;
};

// Sets the deleted flag to true
Upload.prototype.deleteUpload = function() {
    this.deleted = true;
};

// Adds the deletedByNickname / deletedByID to the object.
Upload.prototype.addDeletedByNickname = function(deletedByNickname) {
    this.deletedByNickname = deletedByNickname;
};
Upload.prototype.addDeletedByID = function(deletedByID) {
    this.deletedByID = deletedByID;
};

// Adds the deletedByNickname and deletedByID data to the matching Upload.
function addDeletedBy (channelID, filename, deletedByNickname, deletedByID) {
    var shortFilename, UploadList = globalVariables.UploadList;
    if (filename.indexOf("//") != -1) {
        shortFilename = filename.substr(filename.indexOf("//") + 1);
    }
    else {
        shortFilename = filename.substr(filename.indexOf("\\/") + 1);
    }
    for (var i = 0; i < UploadList.length; i++) {
        if (UploadList[i].getChannelID() == channelID && UploadList[i].getFilename() == shortFilename) {
            UploadList[i].addDeletedByNickname(deletedByNickname);
            UploadList[i].addDeletedByID(deletedByID);
            UploadList[i].deleteUpload();
            break;
        }
    }
}

exports.addDeletedBy = addDeletedBy;

exports.Upload = Upload;