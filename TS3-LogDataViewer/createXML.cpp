// createXML.cpp : Creation of the XML.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <iostream>
#include <string>
#include <vector>
#include "Constants.h"
#include "Client.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "Upload.h"
#include "timeFunctions.h"
#include "customStreams.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>

using namespace std;
using namespace boost::property_tree;

extern vector <string> parsedLogs;
extern vector <Client> ClientList;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <Complaint> ComplaintList;
extern vector <Upload> UploadList;
extern unsigned int VIRTUALSERVER;
extern TeeStream outputStream;

// Creates a XML for storing the data extracted from the logs.
void createXML() {
	outputStream << "Preparing XML-Creation..." << endl;

	ptree PropertyTree;
	ptree& Data = PropertyTree.add("Data", "");
	ptree& AttributesNode = Data.add("Attributes", "");
	AttributesNode.add("Generated", "by TS3-LogDataViewer");
	AttributesNode.add("VirtualServer", VIRTUALSERVER);

	AttributesNode.add("CreationTimestamp_Localtime", getCurrentLocaltime());
	AttributesNode.add("CreationTimestamp_UTC", getCurrentUTC());
	AttributesNode.add("SKIPLOCKFILE", SKIPLOCKFILE);

	ptree& ParsedLogs = AttributesNode.add("ParsedLogs", "");
	for (unsigned i = 0; i < parsedLogs.size(); i++) {
		ParsedLogs.add("P", parsedLogs[i]);
	}

	for (unsigned int i = 0; i < ClientList.size(); i++) {
		ptree& ClientNode = Data.add("Client", "");
		if (ClientList[i].getID() != 0) {
			ClientNode.add("ID", ClientList[i].getID());

			ptree& Nicknames = ClientNode.add("Nicknames", "");
			for (unsigned int j = 0; j < ClientList[i].getNicknameCount(); j++) {
				Nicknames.add("N", ClientList[i].getUniqueNickname(j));
			}

			ptree& Connections = ClientNode.add("Connections", "");
			for (unsigned int j = 0; j < ClientList[i].getDateTimeCount(); j++) {
				Connections.add("C", ClientList[i].getUniqueDateTime(j));
			}

			ptree& IPs = ClientNode.add("IPs", "");
			for (unsigned int j = 0; j < ClientList[i].getIPCount(); j++) {
				IPs.add("I", ClientList[i].getUniqueIP(j));
			}

			if (ClientList[i].getConnectedState()) {
				ClientNode.add("Connected", 1);
			}

			if (ClientList[i].isDeleted()) {
				ClientNode.add("Deleted", 1);
			}
		}
		else ClientNode.add("ID", "-1");
	}

	for (unsigned int i = 0; i < BanList.size(); i++) {
		ptree& BanNode = Data.add("Ban", "");
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
		ptree& KickNode = Data.add("Kick", "");
		KickNode.add("DateTime", KickList[i].getKickDateTime());
		KickNode.add("ID", KickList[i].getKickedID());
		KickNode.add("Nickname", KickList[i].getKickedNickname());
		KickNode.add("ByNickname", KickList[i].getKickedByNickname());
		KickNode.add("ByUID", KickList[i].getKickedByUID());
		KickNode.add("Reason", KickList[i].getKickReason());
	}

	for (unsigned int i = 0; i < ComplaintList.size(); i++) {
		ptree& ComplaintNode = Data.add("Complaint", "");
		ComplaintNode.add("DateTime", ComplaintList[i].getComplaintDateTime());
		ComplaintNode.add("AboutNickname", ComplaintList[i].getComplaintAboutNickname());
		ComplaintNode.add("AboutID", ComplaintList[i].getComplaintAboutID());
		ComplaintNode.add("Reason", ComplaintList[i].getComplaintReason());
		ComplaintNode.add("ByNickname", ComplaintList[i].getComplaintByNickname());
		ComplaintNode.add("ByID", ComplaintList[i].getComplaintByID());
	}

	for (unsigned int i = 0; i < UploadList.size(); i++) {
		ptree& UploadNode = Data.add("Upload", "");
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

	outputStream << "Creating XML..." << endl;

	try {
		write_xml(XMLFILE, PropertyTree);
		outputStream << "XML Creation completed." << endl;
	}
	catch (xml_parser_error error) {
		outputStream << "An error occured while creating the xml:" << endl << error.what() << endl;
	}
}
