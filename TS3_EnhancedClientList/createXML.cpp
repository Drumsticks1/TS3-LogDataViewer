// createXML.cpp : Creation of the XML.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <string>
#include <vector>
#include "Constants.h"
#include "User.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "File.h"
#include "timeFunctions.h"
#include "customStreams.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>

using namespace std;
using namespace boost::property_tree;

extern vector <string> parsedLogs;
extern vector <User> UserList;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <Complaint> ComplaintList;
extern vector <File> FileList;
extern unsigned int VIRTUALSERVER;
extern TeeStream outputStream;

// Creates a XML for storing the data extracted from the logs.
void createXML() {
	outputStream << "Preparing XML-Creation..." << endl;

	ptree PropertyTree;
	ptree& Data = PropertyTree.add("Data", "");
	ptree& AttributesNode = Data.add("Attributes", "");
	AttributesNode.add("Generated", "by TS3 Enhanced Client List");
	AttributesNode.add("VirtualServer", VIRTUALSERVER);

	AttributesNode.add("CreationTimestamp_Localtime", getCurrentLocaltime());
	AttributesNode.add("CreationTimestamp_UTC", getCurrentUTC());

	ptree& ParsedLogs = AttributesNode.add("ParsedLogs", "");
	for (unsigned i = 0; i < parsedLogs.size(); i++) {
		ParsedLogs.add("P", parsedLogs[i]);
	}

	for (unsigned int i = 0; i < UserList.size(); i++) {
		ptree& UserNode = Data.add("User", "");
		if (UserList[i].getID() != 0) {
			UserNode.add("ID", UserList[i].getID());

			ptree& Nicknames = UserNode.add("Nicknames", "");
			for (unsigned int j = 0; j < UserList[i].getNicknameCount(); j++) {
				Nicknames.add("N", UserList[i].getUniqueNickname(j));
			}

			ptree& Connections = UserNode.add("Connections", "");
			for (unsigned int j = 0; j < UserList[i].getDateTimeCount(); j++) {
				Connections.add("C", UserList[i].getUniqueDateTime(j));
			}

			ptree& IPs = UserNode.add("IPs", "");
			for (unsigned int j = 0; j < UserList[i].getIPCount(); j++) {
				IPs.add("I", UserList[i].getUniqueIP(j));
			}

			UserNode.add("Connection_Count", UserList[i].getDateTimeCount());
			UserNode.add("Connected", UserList[i].getCurrentConnectionsCount());
			UserNode.add("Deleted", UserList[i].isDeleted());
		}
		else UserNode.add("ID", "-1");
	}

	for (unsigned int i = 0; i < BanList.size(); i++) {
		ptree& BanNode = Data.add("Ban", "");
		BanNode.add("BanDateTime", BanList[i].getBanDateTime());
		BanNode.add("BannedNickname", BanList[i].getBannedNickname());
		BanNode.add("BannedID", BanList[i].getBannedID());
		BanNode.add("BannedByInvokerID", BanList[i].getbannedByInvokerID());
		BanNode.add("BannedByNickname", BanList[i].getBannedByNickname());
		BanNode.add("BannedByUID", BanList[i].getBannedByUID());
		BanNode.add("BanReason", BanList[i].getBanReason());
		BanNode.add("Bantime", BanList[i].getBantime());
	}

	for (unsigned int i = 0; i < KickList.size(); i++) {
		ptree& KickNode = Data.add("Kick", "");
		KickNode.add("KickDateTime", KickList[i].getKickDateTime());
		KickNode.add("KickedID", KickList[i].getKickedID());
		KickNode.add("KickedNickname", KickList[i].getKickedNickname());
		KickNode.add("KickedByNickname", KickList[i].getKickedByNickname());
		KickNode.add("KickedByUID", KickList[i].getKickedByUID());
		KickNode.add("KickReason", KickList[i].getKickReason());
	}

	for (unsigned int i = 0; i < ComplaintList.size(); i++) {
		ptree& ComplaintNode = Data.add("Complaint", "");
		ComplaintNode.add("ComplaintDateTime", ComplaintList[i].getComplaintDateTime());
		ComplaintNode.add("ComplaintForNickname", ComplaintList[i].getComplaintForNickname());
		ComplaintNode.add("ComplaintForID", ComplaintList[i].getComplaintForID());
		ComplaintNode.add("ComplaintReason", ComplaintList[i].getComplaintReason());
		ComplaintNode.add("ComplaintByNickname", ComplaintList[i].getComplaintByNickname());
		ComplaintNode.add("ComplaintByID", ComplaintList[i].getComplaintByID());
	}

	for (unsigned int i = 0; i < FileList.size(); i++) {
		ptree& FileNode = Data.add("File", "");
		FileNode.add("UploadDateTime", FileList[i].getUploadDateTime());
		FileNode.add("ChannelID", FileList[i].getChannelID());
		FileNode.add("Filename", FileList[i].getFilename());
		FileNode.add("UploadedByNickname", FileList[i].getUploadedByNickname());
		FileNode.add("UploadedByID", FileList[i].getUploadedByID());
	}

	outputStream << "Creating XML..." << endl;

	try {
		write_xml(XMLFILE, PropertyTree);
		outputStream << "XML Creation completed." << endl;
	}
	catch (xml_parser_error error) {
		outputStream << "An error occured while creating the xml:" << endl << error.what() << endl;
	}
}
