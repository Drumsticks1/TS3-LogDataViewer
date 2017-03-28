// Upload.js: Upload class.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const globalVariables = require("./globalVariables.js");

/**
 * @param {number} uploadListId
 * @param {string} uploadDateTime
 * @param {number} channelID
 * @param {string} filename
 * @param {number} uploadedByID
 * @param {string} uploadedByNickname
 * @constructor
 */
var Upload = function (uploadListId, uploadDateTime, channelID, filename, uploadedByID, uploadedByNickname) {
  this.uploadListId = uploadListId;
  this.uploadDateTime = uploadDateTime;
  this.channelID = channelID;
  this.filename = filename;
  this.uploadedByID = uploadedByID;
  this.uploadedByNickname = uploadedByNickname;
  this.deletedByID = 0;
  this.deletedByNickname = "";
  this.deleted = false;
};

// Returns the requested information.
Upload.prototype.getUploadDateTime = function () {
  return this.uploadDateTime;
};
Upload.prototype.getChannelID = function () {
  return this.channelID;
};
Upload.prototype.getFilename = function () {
  return this.filename;
};
Upload.prototype.getUploadedByNickname = function () {
  return this.uploadedByNickname;
};
Upload.prototype.getUploadedByID = function () {
  return this.uploadedByID;
};

Upload.prototype.isDeleted = function () {
  return this.deleted;
};

module.exports = {
  Upload: Upload,

  /**
   * Adds a new Upload with the given data to the array.
   * @param {Array} array
   * @param {string} uploadDateTime
   * @param {number} channelID
   * @param {string} filename
   * @param {number} uploadedByID
   * @param {string} uploadedByNickname
   */
  addUpload: function (array, uploadDateTime, channelID, filename, uploadedByID, uploadedByNickname) {
    array.push(
      new Upload(
        array.length + 1,
        uploadDateTime,
        channelID,
        filename,
        uploadedByID,
        uploadedByNickname
      ));
  },

  /**
   * Adds a new Upload containing the data of the uploadObject to the array.
   * @param {Array} array
   * @param {object} uploadObject containing the upload data.
   */
  addUploadViaObject: function (array, uploadObject) {
    var upload = new Upload(
      uploadObject.uploadListId,
      uploadObject.uploadDateTime,
      uploadObject.channelID,
      uploadObject.filename,
      uploadObject.uploadedByID,
      uploadObject.uploadedByNickname
    );

    if (uploadObject.deleted) {
      upload.deletedByID = uploadObject.deletedByID;
      upload.deletedByNickname = uploadObject.deletedByNickname;
      upload.deleted = uploadObject.deleted;
    }

    array.push(upload);
  },
  
  /**
   * Adds the deletedByNickname and deletedByID data to the matching Upload in the UploadList.
   * @param {number} channelID
   * @param {string} filename
   * @param {number} deletedByID
   * @param {string} deletedByNickname
   */
  addDeletedBy: function (channelID, filename, deletedByID, deletedByNickname) {
    var UploadList = globalVariables.UploadList;

    for (var i = 0; i < UploadList.length; i++) {
      if (UploadList[i].getChannelID() === channelID && UploadList[i].getFilename() === filename && !UploadList[i].isDeleted()) {
        UploadList[i].deletedByID = deletedByID;
        UploadList[i].deletedByNickname = deletedByNickname;
        UploadList[i].deleted = true;
        return;
      }
    }
  }
};