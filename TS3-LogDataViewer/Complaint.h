// Complaint.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer
#pragma once

#include <string>

// Class for the complaint data.
class Complaint {
private:
	std::string complaintDateTime, complaintAboutNickname, complaintReason, complaintByNickname;
	unsigned int complaintAboutID, complaintByID;

public:
	void addComplaint(std::string complaintDateTime, std::string complaintAboutNickname, unsigned int complaintAboutID, std::string complaintReason, std::string complaintByNickname, unsigned int complaintByID);

	std::string getComplaintDateTime();
	std::string getComplaintAboutNickname();
	unsigned int getComplaintAboutID();
	std::string getComplaintReason();
	std::string getComplaintByNickname();
	unsigned int getComplaintByID();
};
