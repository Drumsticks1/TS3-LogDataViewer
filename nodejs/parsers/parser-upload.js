// parsers/parser-upload.js : Parsing of Upload events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../misc-functions.js');
var Channel = require("../classes/channel.js");
var Upload = require("../classes/upload.js");
var checkFunctions = require("../check-functions.js");
var data = require("../data.js");

// Todo: Eliminate duplicates after the boundaries objects.
module.exports = {

  parseUpload: function (message, dateTime) {
    let res = this.parseMessageUpload(message);

    if (Channel.getChannelByChannelId(data.ChannelList, res.channelID) === null)
      Channel.addChannel(data.ChannelList, res.channelID, "Unknown", "Unknown");

    if (!checkFunctions.isDuplicateUpload(dateTime, res.channelID, res.filename, res.uploadedByID, res.uploadedByNickname))
      Upload.addUpload(data.UploadList, dateTime, res.channelID, res.filename, res.uploadedByID, res.uploadedByNickname);
  },

  /**
   * Parses the Upload data from the given message.
   * @param {string} message
   * @returns {{channelID: number, filename: string, uploadedByNickname: string, uploadedByID: number}} the extracted data.
   */
  parseMessageUpload: function (message) {
    const boundaries = {};

    boundaries.channelID = [
      message.indexOf("file upload to (id:") + 19,
      message.indexOf(")")];

    boundaries.filename = [
      boundaries.channelID[1] + 4,
      message.lastIndexOf("' by client '")];

    boundaries.uploadedByNickname = [
      boundaries.filename[1] + 13,
      message.lastIndexOf("'(id:")];

    boundaries.uploadedByID = [
      boundaries.uploadedByNickname[1] + 5,
      message.length - 1];

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
    };

    return {
      channelID: Number(getSubstring("channelID")),
      filename: getSubstring("filename"),
      uploadedByNickname: getSubstring("uploadedByNickname"),
      uploadedByID: Number(getSubstring("uploadedByID"))
    };
  },

  parseUploadDeletion: function (message) {
    let res = this.parseMessageUploadDeletion(message);

    Upload.addDeletedBy(res.channelID, res.filename, res.deletedByID, res.deletedByNickname);
  },

  /**
   * Parses the UploadDeletion data from the given message.
   * @param {string} message
   * @returns {{channelID: number, filename: string, deletedByNickname: string, deletedByID: number}} extracted data.
   */
  parseMessageUploadDeletion: function (message) {
    const boundaries = {};

    boundaries.channelID = [
      message.indexOf("file deleted from (id:") + 22,
      message.indexOf(")")];

    boundaries.filename = [
      boundaries.channelID[1] + 4,
      message.lastIndexOf("' by client '")];

    boundaries.deletedByNickname = [
      boundaries.filename[1] + 13,
      message.lastIndexOf("'(id:")];

    boundaries.deletedByID = [
      boundaries.deletedByNickname[1] + 5,
      message.length - 1];

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
    };

    let filename = getSubstring("filename");

    // A longer path is logged and needs to be removed in order to get the filename only.
    // Unix
    if (filename.includes("//"))
      filename = filename.substr(filename.indexOf("//") + 1);
    // Windows
    else
      filename = filename.substr(filename.indexOf("\/"));

    return {
      channelID: Number(getSubstring("channelID")),
      filename: filename,
      deletedByNickname: getSubstring("deletedByNickname"),
      deletedByID: Number(getSubstring("deletedByID"))
    };
  }
};
