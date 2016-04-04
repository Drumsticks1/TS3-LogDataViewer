// complaint.js :
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

module.exports = {

  parseComplaint: function (logLine) {
    var boundaries = {};

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

    function getSubstring(boundariesIdentifier) {
      return logLine.substring(boundaries[boundariesIdentifier][0], boundaries[boundariesIdentifier][1]);
    }

    return {
      complaintAboutNickname: getSubstring("complaintAboutNickname"),
      complaintAboutID: Number(getSubstring("complaintAboutID")),
      complaintReason: getSubstring("complaintReason"),
      complaintByNickname: getSubstring("complaintByNickname"),
      complaintByID: Number(getSubstring("complaintByID"))
    };
  }
};