// Upload.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <iostream>
using namespace std;

// Class for the upload data.
class Upload {
private:
	unsigned int channelID, uploadedByID, deletedByID = 0;
	string uploadDateTime, filename, uploadedByNickname, deletedByNickname = " ";
	bool deleted = false;

public:
	void addUpload(string uploadDateTime, unsigned int channelID, string filename, string uploadedByNickname, unsigned int uploadedByID);
	void addUpload(string uploadDateTime, unsigned int channelID, string filename, string uploadedByNickname, unsigned int uploadedByID, string deletedByNickname, unsigned int deletedByID);

	string getUploadDateTime();
	unsigned int getChannelID();
	string getFilename();
	string getUploadedByNickname();
	unsigned int getUploadedByID();
	string getDeletedByNickname();
	unsigned int getDeletedByID();
	void deleteUpload();
	void addDeletedByNickname(string deletedByNickname);
	void addDeletedByID(unsigned int deletedByID);
};

// Adds the deletedByNickname and deletedByID data to the matching Upload.
void addDeletedBy(unsigned int channelID, string filename, string deletedByNickname, unsigned int deletedByID);
