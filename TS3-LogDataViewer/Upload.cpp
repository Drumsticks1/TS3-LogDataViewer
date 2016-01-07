// Upload.cpp : Methods of the Upload class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <vector>
#include <string>
#include "Upload.h"

std::vector <Upload> UploadList;

// Sets the data of the current Upload object according to the given data.
void Upload::addUpload(std::string uploadDateTime, unsigned int channelID, std::string filename, std::string uploadedByNickname, unsigned int uploadedByID) {
	this->uploadDateTime = uploadDateTime;
	this->channelID = channelID;
	this->filename = filename;
	this->uploadedByNickname = uploadedByNickname;
	this->uploadedByID = uploadedByID;
}

// Overloaded version of the previous function for the parseXML data.
void Upload::addUpload(std::string uploadDateTime, unsigned int channelID, std::string filename, std::string uploadedByNickname, unsigned int uploadedByID, std::string deletedByNickname, unsigned int deletedByID) {
	this->uploadDateTime = uploadDateTime;
	this->channelID = channelID;
	this->filename = filename;
	this->uploadedByNickname = uploadedByNickname;
	this->uploadedByID = uploadedByID;
	this->deletedByNickname = deletedByNickname;
	this->deletedByID = deletedByID;
}

// Returns the requested information.
std::string Upload::getUploadDateTime() { return uploadDateTime; }
unsigned int Upload::getChannelID() { return channelID; }
std::string Upload::getFilename() { return filename; }
std::string Upload::getUploadedByNickname() { return uploadedByNickname; }
unsigned int Upload::getUploadedByID() { return uploadedByID; }
std::string Upload::getDeletedByNickname() { return deletedByNickname; }
unsigned int Upload::getDeletedByID() { return deletedByID; }

// Sets the deleted flag to true
void Upload::deleteUpload() { deleted = true; }

// Adds the deletedByNickname / deletedByID to the object.
void Upload::addDeletedByNickname(std::string deletedByNickname) { this->deletedByNickname = deletedByNickname; }
void Upload::addDeletedByID(unsigned int deletedByID) { this->deletedByID = deletedByID; }

// Adds the deletedByNickname and deletedByID data to the matching Upload.
void addDeletedBy(unsigned int channelID, std::string filename, std::string deletedByNickname, unsigned int deletedByID) {
	std::string shortFilename;
	if (filename.find("//") != std::string::npos) {
		shortFilename = filename.substr(filename.find("//") + 1);
	}
	else {
		shortFilename = filename.substr(filename.find("\\/") + 1);
	}
	for (unsigned int i = 0; i < UploadList.size(); i++) {
		if (UploadList[i].getChannelID() == channelID && UploadList[i].getFilename() == shortFilename) {
			UploadList[i].addDeletedByNickname(deletedByNickname);
			UploadList[i].addDeletedByID(deletedByID);
			UploadList[i].deleteUpload();
			break;
		}
	}
}
