// Complaint.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
using namespace std;

// Class for the complaint data.
class Complaint {
private:
	string complaintDateTime, complaintAboutNickname, complaintReason, complaintByNickname;
	unsigned int complaintAboutID, complaintByID;

public:
	void addComplaint(string complaintDateTime, string complaintAboutNickname, unsigned int complaintAboutID, string complaintReason, string complaintByNickname, unsigned int complaintByID);

	string getComplaintDateTime();
	string getComplaintAboutNickname();
	unsigned int getComplaintAboutID();
	string getComplaintReason();
	string getComplaintByNickname();
	unsigned int getComplaintByID();
};
