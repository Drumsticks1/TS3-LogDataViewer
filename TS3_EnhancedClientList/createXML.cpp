// createXML.cpp : Creation of the XML.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <string>
#include <vector>
#include "Constants.h"
#include "User.h"
#include "Ban.h"
#include "Kick.h"
#include "File.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>
#include <boost/date_time.hpp>

using namespace std;
using namespace boost::property_tree;
using namespace boost::posix_time;

extern vector <string> parsedLogs;
extern vector <User> UserList;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <File> FileList;
extern unsigned int VIRTUALSERVER;

// Returns the given time structure as string in the format "dd.mm.yyyy hh:mm:ss".
string timeToString(ptime t) {
	unsigned short year, month, day, hours, minutes, seconds;
	year = t.date().year();
	month = t.date().month();
	day = t.date().day();
	hours = t.time_of_day().hours();
	minutes = t.time_of_day().minutes();
	seconds = t.time_of_day().seconds();

	string curTime = "";
	if (day < 10) { curTime += "0"; }
	curTime += to_string(day) + ".";
	if (month < 10) { curTime += "0"; }
	curTime += to_string(month) + "." + to_string(year) + " ";
	if (hours < 10) { curTime += "0"; }
	curTime += to_string(hours) + ":";
	if (minutes < 10) { curTime += "0"; }
	curTime += to_string(minutes) + ":";
	if (seconds < 10) { curTime += "0"; }
	curTime += to_string(seconds);
	return curTime;
}

// Creates a XML for storing the data extracted from the logs.
void createXML() {
	cout << "Preparing XML-Creation..." << endl;

	ptree PropertyTree;
	ptree& Data = PropertyTree.add("Data", "");
	ptree& AttributesNode = Data.add("Attributes", "");
	AttributesNode.add("Generated", "by TS3 Enhanced Client List");
	AttributesNode.add("VirtualServer", VIRTUALSERVER);

	ptime currentLocaltime = second_clock::local_time();
	ptime currentUTC = second_clock::universal_time();

	AttributesNode.add("CreationTimestamp_Localtime", timeToString(currentLocaltime));
	AttributesNode.add("CreationTimestamp_UTC", timeToString(currentUTC));

	ptree& ParsedLogs = AttributesNode.add("ParsedLogs", "");
	for (unsigned i = 0; i < parsedLogs.size(); i++) {
		ParsedLogs.add("ParsedLogs", parsedLogs[i]);
	}

	for (unsigned int i = 0; i < UserList.size(); i++) {
		ptree& UserNode = Data.add("User", "");
		if (UserList[i].getID() != 0) {
			UserNode.add("ID", UserList[i].getID());

			ptree& Nicknames = UserNode.add("Nicknames", "");
			for (unsigned int j = 0; j < UserList[i].getNicknameCount(); j++) {
				Nicknames.add("Nicknames", UserList[i].getUniqueNickname(j));
			}

			ptree& Connections = UserNode.add("Connections", "");
			for (unsigned int j = 0; j < UserList[i].getDateTimeCount(); j++) {
				Connections.add("Connections", UserList[i].getUniqueDateTime(j));
			}

			ptree& IPs = UserNode.add("IPs", "");
			for (unsigned int j = 0; j < UserList[i].getIPCount(); j++) {
				IPs.add("IPs", UserList[i].getUniqueIP(j));
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

	for (unsigned int i = 0; i < FileList.size(); i++) {
		ptree& FileNode = Data.add("File", "");
		FileNode.add("UploadDateTime", FileList[i].getUploadDateTime());
		FileNode.add("ChannelID", FileList[i].getChannelID());
		FileNode.add("Filename", FileList[i].getFilename());
		FileNode.add("UploadedByNickname", FileList[i].getUploadedByNickname());
		FileNode.add("UploadedByID", FileList[i].getUploadedByID());
	}

	cout << "Creating XML..." << endl;

	try {
		write_xml(XMLFILE, PropertyTree, locale(), xml_writer_make_settings<string>('\t', 1));
	}
	catch (xml_parser_error error) {
		cout << "An error occured while creating the xml:" << endl << error.what() << endl;
	}
}
