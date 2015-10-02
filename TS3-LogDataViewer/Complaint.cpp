// Complaint.cpp : Methods of the Complaint class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <iostream>
#include <vector>
#include <string>
#include "Complaint.h"

using namespace std;

vector <Complaint> ComplaintList;

// Adds a new complaint with the given data to the list.
void Complaint::addComplaint(string complaintDateTime, string complaintAboutNickname, unsigned int complaintAboutID, string complaintReason, string complaintByNickname, unsigned int complaintByID) {
	this->complaintDateTime = complaintDateTime;
	this->complaintAboutNickname = complaintAboutNickname;
	this->complaintAboutID = complaintAboutID;
	this->complaintReason = complaintReason;
	this->complaintByNickname = complaintByNickname;
	this->complaintByID = complaintByID;
}

// Returns the requested information.
string Complaint::getComplaintDateTime() { return complaintDateTime; }
string Complaint::getComplaintAboutNickname() { return complaintAboutNickname; }
unsigned int Complaint::getComplaintAboutID() { return complaintAboutID; }
string Complaint::getComplaintReason() { return complaintReason; }
string Complaint::getComplaintByNickname() { return complaintByNickname; }
unsigned int Complaint::getComplaintByID() { return complaintByID; }
