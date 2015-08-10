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
	ptree PropertyTree, DataNode, AttributesNode, UserNode, BanNode, KickNode, FileNode;
	ptree fieldNickname, fieldDateTime, fieldIP, fieldParsedLogs;

	cout << "Preparing XML-Creation..." << endl;

	AttributesNode.put("Generated", "by TS3 Enhanced Client List");
	AttributesNode.put("VirtualServer", VIRTUALSERVER);

	ptime currentLocaltime = second_clock::local_time();
	ptime currentUTC = second_clock::universal_time();

	AttributesNode.put("CreationTimestamp_Localtime", timeToString(currentLocaltime));
	AttributesNode.put("CreationTimestamp_UTC", timeToString(currentUTC));

	for (unsigned i = 0; i < parsedLogs.size(); i++) {
		fieldParsedLogs.add("ParsedLogs", parsedLogs[i]);
	}

	AttributesNode.put_child("ParsedLogs", fieldParsedLogs);
	DataNode.add_child("Attributes", AttributesNode);

	for (unsigned int i = 0; i < UserList.size(); i++) {
		if (UserList[i].getID() != 0) {
			fieldNickname.clear();
			fieldDateTime.clear();
			fieldIP.clear();

			for (unsigned int j = 0; j < UserList[i].getNicknameCount(); j++) {
				fieldNickname.add("Nicknames", UserList[i].getUniqueNickname(j));
			}

			for (unsigned int j = 0; j < UserList[i].getDateTimeCount(); j++) {
				fieldDateTime.add("Connections", UserList[i].getUniqueDateTime(j));
			}

			for (unsigned int j = 0; j < UserList[i].getIPCount(); j++) {
				fieldIP.add("IPs", UserList[i].getUniqueIP(j));
			}

			UserNode.put("ID", UserList[i].getID());
			UserNode.put_child("Nicknames", fieldNickname);
			UserNode.put_child("Connections", fieldDateTime);
			UserNode.put_child("IPs", fieldIP);
			UserNode.put("Connection_Count", UserList[i].getDateTimeCount());
			UserNode.put("Connected", UserList[i].getCurrentConnectionsCount());
			UserNode.put("Deleted", UserList[i].isDeleted());
			DataNode.add_child("User", UserNode);
		}
		else {
			UserNode.clear();
			UserNode.put("ID", "-1");
			DataNode.add_child("User", UserNode);
		}
	}
	UserList.clear();

	for (unsigned int i = 0; i < BanList.size(); i++) {
		BanNode.put("BanDateTime", BanList[i].getBanDateTime());
		BanNode.put("BannedNickname", BanList[i].getBannedNickname());
		BanNode.put("BannedID", BanList[i].getBannedID());
		BanNode.put("BannedByInvokerID", BanList[i].getbannedByInvokerID());
		BanNode.put("BannedByNickname", BanList[i].getBannedByNickname());
		BanNode.put("BannedByUID", BanList[i].getBannedByUID());
		BanNode.put("BanReason", BanList[i].getBanReason());
		BanNode.put("Bantime", BanList[i].getBantime());
		DataNode.add_child("Ban", BanNode);
	}
	BanList.clear();

	for (unsigned int i = 0; i < KickList.size(); i++) {
		KickNode.put("KickDateTime", KickList[i].getKickDateTime());
		KickNode.put("KickedID", KickList[i].getKickedID());
		KickNode.put("KickedNickname", KickList[i].getKickedNickname());
		KickNode.put("KickedByNickname", KickList[i].getKickedByNickname());
		KickNode.put("KickedByUID", KickList[i].getKickedByUID());
		KickNode.put("KickReason", KickList[i].getKickReason());
		DataNode.add_child("Kick", KickNode);
	}
	KickList.clear();

	for (unsigned int i = 0; i < FileList.size(); i++) {
		FileNode.put("UploadDateTime", FileList[i].getUploadDateTime());
		FileNode.put("ChannelID", FileList[i].getChannelID());
		FileNode.put("Filename", FileList[i].getFilename());
		FileNode.put("UploadedByNickname", FileList[i].getUploadedByNickname());
		FileNode.put("UploadedByID", FileList[i].getUploadedByID());
		DataNode.add_child("File", FileNode);
	}
	FileList.clear();

	PropertyTree.add_child("Data", DataNode);
	cout << "Creating XML..." << endl;

	try {
		write_xml(XMLFILE, PropertyTree, locale(), xml_writer_make_settings<string>('\t', 1));
	}
	catch (xml_parser_error error) {
		cout << "An error occured while creating the xml:" << endl << error.what() << endl;
	}
}
