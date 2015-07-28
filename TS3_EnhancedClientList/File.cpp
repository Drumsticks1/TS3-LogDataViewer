// File.cpp : Methods of the File class.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <vector>
#include <string>
#include "File.h"

using namespace std;

vector <File> FileList;

// Adds a new file with the given data to the list.
void File::uploadFile(string uploadDateTime, unsigned int channelID, string filename, string uploadedByNickname, unsigned int uploadedByID) {
	this->uploadDateTime = uploadDateTime;
	this->channelID = channelID;
	this->filename = filename;
	this->uploadedByNickname = uploadedByNickname;
	this->uploadedByID = uploadedByID;
}

// Returns the requested information.
string File::getUploadDateTime() { return uploadDateTime; }
unsigned int File::getChannelID() { return channelID; }
string File::getFilename() { return filename; }
string File::getUploadedByNickname() { return uploadedByNickname; }
unsigned int File::getUploadedByID() { return uploadedByID; }
