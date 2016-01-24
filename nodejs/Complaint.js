// Complaint.js: Complaint class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

"use strict";

/**
 * Default constructor.
 * @constructor
 */
var Complaint = function() {
    this.complaintDateTime = "";
    this.complaintAboutNickname = "";
    this.complaintReason = "";
    this.complaintByNickname = "";
    this.complaintAboutID = 0;
    this.complaintByID = 0;
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
Complaint.prototype.addComplaint = function(complaintDateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID) {
    this.complaintDateTime = complaintDateTime;
    this.complaintAboutNickname = complaintAboutNickname;
    this.complaintAboutID = complaintAboutID;
    this.complaintReason = complaintReason;
    this.complaintByNickname = complaintByNickname;
    this.complaintByID = complaintByID;
};

// Returns the requested information.
Complaint.prototype.getComplaintDateTime = function() {
    return this.complaintDateTime;
};
Complaint.prototype.getComplaintAboutNickname = function() {
    return this.complaintAboutNickname;
};
Complaint.prototype.getComplaintAboutID = function() {
    return this.complaintAboutID;
};
Complaint.prototype.getComplaintReason = function() {
    return this.complaintReason;
};
Complaint.prototype.getComplaintByNickname = function() {
    return this.complaintByNickname;
};
Complaint.prototype.getComplaintByID = function() {
    return this.complaintByID;
};

exports.Complaint = Complaint;