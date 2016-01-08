// ServerGroup.cpp : Methods of the ServerGroup class.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <vector>
#include <string>
#include "ServerGroup.h"

std::vector <ServerGroup> ServerGroupList;

// Adds the given information to the ServerGroup
void ServerGroup::addServerGroupInformation(unsigned int ID, std::string ServerGroupName, std::string CreationDateTime) {
	this->ID = ID;
	this->ServerGroupName = ServerGroupName;
	this->CreationDateTime = CreationDateTime;
};

//
void ServerGroup::renameServerGroup(std::string newServerGroupName) { this->ServerGroupName = newServerGroupName; }

// Copy the data from the ServerGroup item with the given ID from the ServerGroupList to the current object.
void ServerGroup::copyFromServerGroup(unsigned int ID) {
	this->ServerGroupName = ServerGroupList[ID].getServerGroupName();
	this->CreationDateTime = ServerGroupList[ID].getCreationDateTime();;
}

// Sets the deleted flag to true.
void ServerGroup::deleteServerGroup() { deleted = true; }

unsigned int ServerGroup::getID() { return ID; };
std::string ServerGroup::getServerGroupName() { return ServerGroupName; };
std::string ServerGroup::getCreationDateTime() { return CreationDateTime; };

bool ServerGroup::isDeleted() { return deleted; };
