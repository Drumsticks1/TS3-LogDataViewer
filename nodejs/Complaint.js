// Complaint.js: Complaint class.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * @param {number} complaintListId
 * @param {string} complaintDateTime
 * @param {string} complaintAboutNickname
 * @param {number} complaintAboutID
 * @param {string} complaintReason
 * @param {string} complaintByNickname
 * @param {number} complaintByID
 * @constructor
 */
const Complaint = function (complaintListId, complaintDateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID) {
  this.complaintListId = complaintListId;
  this.complaintDateTime = complaintDateTime;
  this.complaintAboutID = complaintAboutID;
  this.complaintAboutNickname = complaintAboutNickname;
  this.complaintReason = complaintReason;
  this.complaintByNickname = complaintByNickname;
  this.complaintByID = complaintByID;
};

// Returns the requested information.
Complaint.prototype.getComplaintDateTime = function () {
  return this.complaintDateTime;
};
Complaint.prototype.getComplaintAboutNickname = function () {
  return this.complaintAboutNickname;
};
Complaint.prototype.getComplaintAboutID = function () {
  return this.complaintAboutID;
};
Complaint.prototype.getComplaintReason = function () {
  return this.complaintReason;
};
Complaint.prototype.getComplaintByNickname = function () {
  return this.complaintByNickname;
};
Complaint.prototype.getComplaintByID = function () {
  return this.complaintByID;
};

module.exports = {
  Complaint: Complaint,

  /**
   * Adds a new Complaint with the given data to the array.
   * @param {Array} array
   * @param {string} complaintDateTime
   * @param {string} complaintAboutNickname
   * @param {number} complaintAboutID
   * @param {string} complaintReason
   * @param {string} complaintByNickname
   * @param {number} complaintByID
   */
  addComplaint: function (array, complaintDateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID) {
    array.push(
      new Complaint(
        array.length + 1,
        complaintDateTime,
        complaintAboutNickname,
        complaintAboutID,
        complaintReason,
        complaintByNickname,
        complaintByID
      ));
  }
};
