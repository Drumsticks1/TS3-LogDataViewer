// parsers/parser-complaint.js : Parsing of Complaint events.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";
// TODO: doc
const miscFunctions = require('../misc-functions.js');
var checkFunctions = require("../check-functions.js");
var Complaint = require("../classes/complaint.js");
var data = require("../data.js");

module.exports = {

  parseComplaint: function (message, dateTime) {
    let res = this.parseMessageComplaint(message);

    // Todo: Modify check functions so that they accept objects, maybe also change the addObject functions.
    if (!checkFunctions.isDuplicateComplaint(dateTime, res.complaintAboutNickname, res.complaintAboutID, res.complaintReason, res.complaintByNickname, res.complaintByID))
      Complaint.addComplaint(data.ComplaintList, dateTime, res.complaintAboutNickname, res.complaintAboutID, res.complaintReason, res.complaintByNickname, res.complaintByID);
  },

  /**
   * Parses the Complaint data from the given message.
   * @param {string} message
   * @returns {{complaintAboutNickname: string, complaintAboutID: number, complaintReason: string, complaintByNickname: string, complaintByID: number}} the extracted data
   */
  parseMessageComplaint: function (message) {
    const boundaries = {};

    boundaries.complaintAboutNickname = [
      message.indexOf("complaint added for client '") + 28,
      message.indexOf("'(id:")];

    boundaries.complaintAboutID = [
      boundaries.complaintAboutNickname[1] + 5,
      message.indexOf(") reason '")];

    boundaries.complaintReason = [
      boundaries.complaintAboutID[1] + 10,
      message.lastIndexOf("' by client '")];

    boundaries.complaintByNickname = [
      boundaries.complaintReason[1] + 13,
      message.lastIndexOf("'(id:")];

    boundaries.complaintByID = [
      boundaries.complaintByNickname[1] + 5,
      message.length - 1];

    const getSubstring = function (boundariesIdentifier) {
      return miscFunctions.getSubstring(boundaries, message, boundariesIdentifier);
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
