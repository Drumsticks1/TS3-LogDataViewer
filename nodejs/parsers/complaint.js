// parsers/complaint.js : Parsing of Complaint events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../miscFunctions.js');
var checkFunctions = require("../checkFunctions.js");
var Complaint = require("../Complaint.js");
var globalVariables = require("../globalVariables.js");

module.exports = {

  parseComplaint: function (message, dateTime) {
    let res = this.parseMessageComplaint(message);

    // Todo: Modify check functions so that they accept objects, maybe also change the addObject functions.
    if (!checkFunctions.isDuplicateComplaint(dateTime, res.complaintAboutNickname, res.complaintAboutID, res.complaintReason, res.complaintByNickname, res.complaintByID))
      Complaint.addComplaint(globalVariables.ComplaintList, dateTime, res.complaintAboutNickname, res.complaintAboutID, res.complaintReason, res.complaintByNickname, res.complaintByID);
  },

  /**
   * Parses the Complaint data from the given logLine.
   * @param {string} logLine
   * @returns {{complaintAboutNickname: string, complaintAboutID: number, complaintReason: string, complaintByNickname: string, complaintByID: number}} the extracted data
   */
  parseMessageComplaint: function (logLine) {
    const boundaries = {};

    boundaries.complaintAboutNickname = [
      logLine.indexOf("complaint added for client '") + 28,
      logLine.indexOf("'(id:")];

    boundaries.complaintAboutID = [
      boundaries.complaintAboutNickname[1] + 5,
      logLine.indexOf(") reason '")];

    boundaries.complaintReason = [
      boundaries.complaintAboutID[1] + 10,
      logLine.lastIndexOf("' by client '")];

    boundaries.complaintByNickname = [
      boundaries.complaintReason[1] + 13,
      logLine.lastIndexOf("'(id:")];

    boundaries.complaintByID = [
      boundaries.complaintByNickname[1] + 5,
      logLine.length - 1];

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, logLine, boundariesIdentifier);
    };

    return {
      complaintAboutNickname: getSubstring("complaintAboutNickname"),
      complaintAboutID: Number(getSubstring("complaintAboutID")),
      complaintReason: getSubstring("complaintReason"),
      complaintByNickname: getSubstring("complaintByNickname"),
      complaintByID: Number(getSubstring("complaintByID"))
    };
  }
};
