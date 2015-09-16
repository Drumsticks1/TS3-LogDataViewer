// Upload.cpp : Methods of the Upload class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

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

// Returns the requested information.
string Upload::getUploadDateTime() { return uploadDateTime; }
unsigned int Upload::getChannelID() { return channelID; }
string Upload::getFilename() { return filename; }
string Upload::getUploadedByNickname() { return uploadedByNickname; }
unsigned int Upload::getUploadedByID() { return uploadedByID; }
