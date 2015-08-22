// Complaint.h
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
using namespace std;

// Class for the complaint data.
class Complaint {
private:
	string complaintDateTime, complaintForNickname, complaintReason, complaintByNickname;
	unsigned int complaintForID, complaintByID;

public:
	void addComplaint(string complaintDateTime, string complaintForNickname, unsigned int complaintForID, string complaintReason, string complaintByNickname, unsigned int complaintByID);

	string getComplaintDateTime();
	string getComplaintForNickname();
	unsigned int getComplaintForID();
	string getComplaintReason();
	string getComplaintByNickname();
	unsigned int getComplaintByID();
};
