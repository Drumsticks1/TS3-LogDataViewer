// Upload.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer
#pragma once

#include <string>

// Class for the upload data.
class Upload {
private:
	unsigned int channelID, uploadedByID, deletedByID = 0;
	std::string uploadDateTime, filename, uploadedByNickname, deletedByNickname = " ";
	bool deleted = false;

public:
	void addUpload(std::string uploadDateTime, unsigned int channelID, std::string filename, std::string uploadedByNickname, unsigned int uploadedByID);
	void addUpload(std::string uploadDateTime, unsigned int channelID, std::string filename, std::string uploadedByNickname, unsigned int uploadedByID, std::string deletedByNickname, unsigned int deletedByID);

	std::string getUploadDateTime();
	unsigned int getChannelID();
	std::string getFilename();
	std::string getUploadedByNickname();
	unsigned int getUploadedByID();
	std::string getDeletedByNickname();
	unsigned int getDeletedByID();
	void deleteUpload();
	void addDeletedByNickname(std::string deletedByNickname);
	void addDeletedByID(unsigned int deletedByID);
};

// Adds the deletedByNickname and deletedByID data to the matching Upload.
void addDeletedBy(unsigned int channelID, std::string filename, std::string deletedByNickname, unsigned int deletedByID);
