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

// Returns the count of the MemberIDs of the current ServerGroup.
unsigned int ServerGroup::getMemberIDCount() { return MemberID.size(); };

// Returns the MemberId stored in the given ID slot.
unsigned int ServerGroup::getUniqueMemberID(unsigned int MemberIDNumber) { return MemberID.at(MemberIDNumber); };

// Adds the new MemberID at the end of the MemberID list.
void ServerGroup::addMemberID(unsigned int MemberID) {
	this->MemberID.push_back(MemberID);
}

//
void ServerGroup::removeMemberID(unsigned int MemberID) {
	bool done = false;
	for (unsigned int i = 0; i < this->getMemberIDCount() && !done; i++) {
		if (this->getUniqueMemberID(i) == MemberID) {
			this->MemberID.erase(this->MemberID.begin() + i);
			done = true;
		}
	}
};

//
unsigned int ServerGroup::getID() { return ID; };
std::string ServerGroup::getServerGroupName() { return ServerGroupName; };
std::string ServerGroup::getCreationDateTime() { return CreationDateTime; };


// Sets the deleted flag to true.
void ServerGroup::deleteServerGroup() { deleted = true; }

//
bool ServerGroup::isDeleted() { return deleted; };
