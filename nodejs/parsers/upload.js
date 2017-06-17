// parsers/upload.js : Parsing of Upload events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

const miscFunctions = require('../miscFunctions.js');

// Todo: Eliminate duplicates after the boundaries objects.
module.exports = {
  /**
   * Parses the Upload data from the given logLine.
   * @param {string} logLine
   * @returns {{channelID: number, filename: string, uploadedByNickname: string, uploadedByID: number}} the extracted data.
   */
  parseUpload: function (logLine) {
    const boundaries = {};

    boundaries.channelID = [
      logLine.indexOf("file upload to (id:") + 19,
      logLine.indexOf(")")];

    boundaries.filename = [
      boundaries.channelID[1] + 4,
      logLine.lastIndexOf("' by client '")];

    boundaries.uploadedByNickname = [
      boundaries.filename[1] + 13,
      logLine.lastIndexOf("'(id:")];

    boundaries.uploadedByID = [
      boundaries.uploadedByNickname[1] + 5,
      logLine.length - 1];

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
    };

    return {
      channelID: Number(getSubstring("channelID")),
      filename: getSubstring("filename"),
      uploadedByNickname: getSubstring("uploadedByNickname"),
      uploadedByID: Number(getSubstring("uploadedByID"))
    };
  },

  /**
   * Parses the UploadDeletion data from the given logLine.
   * @param {string} logLine
   * @returns {{channelID: number, filename: string, deletedByNickname: string, deletedByID: number}} extracted data.
   */
  parseUploadDeletion: function (logLine) {
    const boundaries = {};

    boundaries.channelID = [
      logLine.indexOf("file deleted from (id:") + 22,
      logLine.indexOf(")")];

    boundaries.filename = [
      boundaries.channelID[1] + 4,
      logLine.lastIndexOf("' by client '")];

    boundaries.deletedByNickname = [
      boundaries.filename[1] + 13,
      logLine.lastIndexOf("'(id:")];

    boundaries.deletedByID = [
      boundaries.deletedByNickname[1] + 5,
      logLine.length - 1];

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
    };

    let filename = getSubstring("filename");

    // A longer path is logged and needs to be removed in order to get the filename only.
    // Unix
    if (filename.includes("//") )
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
