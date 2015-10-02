// Upload.cpp : Methods of the Upload class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <iostream>
#include <vector>
#include <string>
#include "Upload.h"

using namespace std;

vector <Upload> UploadList;

// Sets the data of the current Upload object according to the given data.
void Upload::addUpload(string uploadDateTime, unsigned int channelID, string filename, string uploadedByNickname, unsigned int uploadedByID) {
	this->uploadDateTime = uploadDateTime;
	this->channelID = channelID;
	this->filename = filename;
	this->uploadedByNickname = uploadedByNickname;
	this->uploadedByID = uploadedByID;
}

// Overloaded version of the previous function for the parseXML data.
void Upload::addUpload(string uploadDateTime, unsigned int channelID, string filename, string uploadedByNickname, unsigned int uploadedByID, string deletedByNickname, unsigned int deletedByID) {
	this->uploadDateTime = uploadDateTime;
	this->channelID = channelID;
	this->filename = filename;
	this->uploadedByNickname = uploadedByNickname;
	this->uploadedByID = uploadedByID;
	this->deletedByNickname = deletedByNickname;
	this->deletedByID = deletedByID;
}

// Returns the requested information.
string Upload::getUploadDateTime() { return uploadDateTime; }
unsigned int Upload::getChannelID() { return channelID; }
string Upload::getFilename() { return filename; }
string Upload::getUploadedByNickname() { return uploadedByNickname; }
unsigned int Upload::getUploadedByID() { return uploadedByID; }
string Upload::getDeletedByNickname() { return deletedByNickname; }
unsigned int Upload::getDeletedByID() { return deletedByID; }

// Sets the deleted flag to true
void Upload::deleteUpload() { deleted = true; }

// Adds the deletedByNickname / deletedByID to the object.
void Upload::addDeletedByNickname(string deletedByNickname) { this->deletedByNickname = deletedByNickname; }
void Upload::addDeletedByID(unsigned int deletedByID) { this->deletedByID = deletedByID; }

// Adds the deletedByNickname and deletedByID data to the matching Upload.
void addDeletedBy(unsigned int channelID, string filename, string deletedByNickname, unsigned int deletedByID) {
	string shortFilename;
	if (filename.find("//") != string::npos) {
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
