// Complaint.js: Complaint class.
// Author : Drumsticks
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Default constructor.
 * @constructor
 */
var Complaint = function () {
  this.complaintDateTime = "";
  this.complaintAboutID = 0;
  this.complaintAboutNickname = "";
  this.complaintReason = "";
  this.complaintByID = 0;
  this.complaintByNickname = "";
};

/**
 * Adds the complaint data to the current complaint.
 * @param {string} complaintDateTime
 * @param {string} complaintAboutNickname
 * @param {number} complaintAboutID
 * @param {string} complaintReason
 * @param {string} complaintByNickname
 * @param {number} complaintByID
 */
Complaint.prototype.addComplaint = function (complaintDateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID) {
  this.complaintDateTime = complaintDateTime;
  this.complaintAboutNickname = complaintAboutNickname;
  this.complaintAboutID = complaintAboutID;
  this.complaintReason = complaintReason;
  this.complaintByNickname = complaintByNickname;
  this.complaintByID = complaintByID;
};

/**
 * Sets the data of the current Complaint according to the data in the given complaintObject.
 * @param {object} complaintObject containing the complaint data.
 */
Complaint.prototype.addComplaintViaObject = function (complaintObject) {
  this.complaintDateTime = complaintObject.complaintDateTime;
  this.complaintAboutID = complaintObject.complaintAboutID;
  this.complaintAboutNickname = complaintObject.complaintAboutNickname;
  this.complaintReason = complaintObject.complaintReason;
  this.complaintByID = complaintObject.complaintByID;
  this.complaintByNickname = complaintObject.complaintByNickname;
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

exports.Complaint = Complaint;