// Complaint.cpp : Methods of the Complaint class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <vector>
#include <string>
#include "Complaint.h"

std::vector <Complaint> ComplaintList;

// Adds a new complaint with the given data to the list.
void Complaint::addComplaint(std::string complaintDateTime, std::string complaintAboutNickname, unsigned int complaintAboutID, std::string complaintReason, std::string complaintByNickname, unsigned int complaintByID) {
	this->complaintDateTime = complaintDateTime;
	this->complaintAboutNickname = complaintAboutNickname;
	this->complaintAboutID = complaintAboutID;
	this->complaintReason = complaintReason;
	this->complaintByNickname = complaintByNickname;
	this->complaintByID = complaintByID;
}

// Returns the requested information.
std::string Complaint::getComplaintDateTime() { return complaintDateTime; }
std::string Complaint::getComplaintAboutNickname() { return complaintAboutNickname; }
unsigned int Complaint::getComplaintAboutID() { return complaintAboutID; }
std::string Complaint::getComplaintReason() { return complaintReason; }
std::string Complaint::getComplaintByNickname() { return complaintByNickname; }
unsigned int Complaint::getComplaintByID() { return complaintByID; }
