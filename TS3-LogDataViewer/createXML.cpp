// createXML.cpp : Creation of the XML.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <vector>
#include <string>
#include "Constants.h"
#include "ServerGroup.h"
#include "Client.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "Upload.h"
#include "timeFunctions.h"
#include "customStreams.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>

namespace bpt = boost::property_tree;

extern std::vector <std::string> parsedLogs;
extern std::vector <ServerGroup> ServerGroupList;
extern std::vector <Client> ClientList;
extern std::vector <Ban> BanList;
extern std::vector <Kick> KickList;
extern std::vector <Complaint> ComplaintList;
extern std::vector <Upload> UploadList;
extern unsigned int VIRTUALSERVER;
extern TeeStream outputStream;

// Creates a XML for storing the data extracted from the logs.
void createXML() {
	outputStream << "Preparing XML-Creation..." << std::endl;

	bpt::ptree PropertyTree;
	bpt::ptree& Data = PropertyTree.add("Data", "");
	bpt::ptree& AttributesNode = Data.add("Attributes", "");
	AttributesNode.add("Generated", "by TS3-LogDataViewer");
	AttributesNode.add("VirtualServer", VIRTUALSERVER);

	AttributesNode.add("CreationTimestamp_Localtime", getCurrentLocaltime());
	AttributesNode.add("CreationTimestamp_UTC", getCurrentUTC());
	AttributesNode.add("SKIPLOCKFILE", SKIPLOCKFILE);
	AttributesNode.add("DEBUGGINGXML", DEBUGGINGXML);

	bpt::ptree& ParsedLogs = AttributesNode.add("ParsedLogs", "");
	for (unsigned i = 0; i < parsedLogs.size(); i++) {
		ParsedLogs.add("P", parsedLogs[i]);
	}
	for (unsigned int i = 0; i < ServerGroupList.size(); i++) {
		bpt::ptree& ServerGroupNode = Data.add("ServerGroup", "");
		if (ServerGroupList[i].getID() != 0) {
			ServerGroupNode.add("ID", ServerGroupList[i].getID());
			ServerGroupNode.add("ServerGroupName", ServerGroupList[i].getServerGroupName());
			ServerGroupNode.add("CreationDateTime", ServerGroupList[i].getCreationDateTime());
			if (ServerGroupList[i].isDeleted()) {
				ServerGroupNode.add("Deleted", 1);
			}
		}
		else ServerGroupNode.add("ID", "-1");
	}

	for (unsigned int i = 0; i < ClientList.size(); i++) {
		bpt::ptree& ClientNode = Data.add("Client", "");
		if (ClientList[i].getID() != 0) {
			ClientNode.add("ID", ClientList[i].getID());

			bpt::ptree& Nicknames = ClientNode.add("Nicknames", "");
			for (unsigned int j = 0; j < ClientList[i].getNicknameCount(); j++) {
				Nicknames.add("N", ClientList[i].getUniqueNickname(j));
			}

			bpt::ptree& Connections = ClientNode.add("Connections", "");
			for (unsigned int j = 0; j < ClientList[i].getDateTimeCount(); j++) {
				Connections.add("C", ClientList[i].getUniqueDateTime(j));
			}

			bpt::ptree& IPs = ClientNode.add("IPs", "");
			for (unsigned int j = 0; j < ClientList[i].getIPCount(); j++) {
				IPs.add("I", ClientList[i].getUniqueIP(j));
			}

			if (ClientList[i].getConnectedState()) {
				ClientNode.add("Connected", 1);
			}

			if (ClientList[i].isDeleted()) {
				ClientNode.add("Deleted", 1);
			}

			bpt::ptree& ServerGroupIDs = ClientNode.add("ServerGroupIDs", "");
			for (unsigned int j = 0; j < ClientList[i].getServerGroupIDCount(); j++) {
				ServerGroupIDs.add("S", ClientList[i].getUniqueServerGroupID(j));
			}

			bpt::ptree& ServerGroupAssignmentDateTimes = ClientNode.add("ServerGroupAssignmentDateTimes", "");
			for (unsigned int j = 0; j < ClientList[i].getServerGroupAssignmentDateTimeCount(); j++) {
				ServerGroupAssignmentDateTimes.add("A", ClientList[i].getUniqueServerGroupAssignmentDateTime(j));
			}
		}
		else ClientNode.add("ID", "-1");
	}

	for (unsigned int i = 0; i < BanList.size(); i++) {
		bpt::ptree& BanNode = Data.add("Ban", "");
		BanNode.add("DateTime", BanList[i].getBanDateTime());
		BanNode.add("ID", BanList[i].getBannedID());
		BanNode.add("Nickname", BanList[i].getBannedNickname());
		BanNode.add("UID", BanList[i].getBannedUID());
		BanNode.add("IP", BanList[i].getBannedIP());
		BanNode.add("ByNickname", BanList[i].getBannedByNickname());
		BanNode.add("ByID", BanList[i].getBannedByID());
		BanNode.add("ByUID", BanList[i].getBannedByUID());
		BanNode.add("Reason", BanList[i].getBanReason());
		BanNode.add("Bantime", BanList[i].getBantime());
	}

	for (unsigned int i = 0; i < KickList.size(); i++) {
		bpt::ptree& KickNode = Data.add("Kick", "");
		KickNode.add("DateTime", KickList[i].getKickDateTime());
		KickNode.add("ID", KickList[i].getKickedID());
		KickNode.add("Nickname", KickList[i].getKickedNickname());
		KickNode.add("ByNickname", KickList[i].getKickedByNickname());
		KickNode.add("ByUID", KickList[i].getKickedByUID());
		KickNode.add("Reason", KickList[i].getKickReason());
	}

	for (unsigned int i = 0; i < ComplaintList.size(); i++) {
		bpt::ptree& ComplaintNode = Data.add("Complaint", "");
		ComplaintNode.add("DateTime", ComplaintList[i].getComplaintDateTime());
		ComplaintNode.add("AboutNickname", ComplaintList[i].getComplaintAboutNickname());
		ComplaintNode.add("AboutID", ComplaintList[i].getComplaintAboutID());
		ComplaintNode.add("Reason", ComplaintList[i].getComplaintReason());
		ComplaintNode.add("ByNickname", ComplaintList[i].getComplaintByNickname());
		ComplaintNode.add("ByID", ComplaintList[i].getComplaintByID());
	}

	for (unsigned int i = 0; i < UploadList.size(); i++) {
		bpt::ptree& UploadNode = Data.add("Upload", "");
		UploadNode.add("DateTime", UploadList[i].getUploadDateTime());
		UploadNode.add("ChannelID", UploadList[i].getChannelID());
		UploadNode.add("Filename", UploadList[i].getFilename());
		UploadNode.add("UplByNickname", UploadList[i].getUploadedByNickname());
		UploadNode.add("UplByID", UploadList[i].getUploadedByID());
		if (UploadList[i].getDeletedByID() != 0) {
			UploadNode.add("DelByNickname", UploadList[i].getDeletedByNickname());
			UploadNode.add("DelByID", UploadList[i].getDeletedByID());
		}
	}

	outputStream << "Creating XML..." << std::endl;

	try {
		if (DEBUGGINGXML) {
			outputStream << "DEBUGGINXML is set to true --> larger XML for debugging" << std::endl;
			write_xml(XMLFILE, PropertyTree, std::locale(), boost::property_tree::xml_writer_make_settings<std::string>('\t', 1));
		}
		else write_xml(XMLFILE, PropertyTree);

		outputStream << "XML Creation completed." << std::endl;
	}
	catch (bpt::xml_parser_error error) {
		outputStream << "An error occured while creating the xml:" << std::endl << error.what() << std::endl;
	}
}
