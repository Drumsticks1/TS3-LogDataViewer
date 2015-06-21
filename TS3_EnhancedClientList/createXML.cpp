// createXML.cpp : Creation of the XML.

#include <iostream>
#include <string>
#include <vector>
#include "Constants.h"
#include "User.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>
#include <boost/date_time.hpp>

using namespace std;
using namespace boost::property_tree;
using namespace boost::posix_time;

extern vector <User> UserList;
extern vector <string> parsedLogs;

// DEV: Add later.
#define TITLE 

// Creates a XML for storing the data extracted from the logs.
void createXML(){
	ptree PropertyTree, UserListNode, UserNode, AttributesNode;
	ptree fieldNickname, fieldDateTime, fieldIP, fieldParsedLogs;

	cout << "Preparing XML-Creation..." << endl;
	for (unsigned int i = 0; i < UserList.size(); i++){
		if (UserList[i].getID() != 0){
			fieldNickname.clear();
			fieldDateTime.clear();
			fieldIP.clear();

			for (unsigned int j = 0; j < UserList[i].getNicknameCount(); j++){
				fieldNickname.add("Nicknames", UserList[i].getUniqueNickname(j));
			}

			for (unsigned int j = 0; j < UserList[i].getDateTimeCount(); j++){
				fieldDateTime.add("Connections", UserList[i].getUniqueDateTime(j));
			}

			for (unsigned int j = 0; j < UserList[i].getIPCount(); j++){
				fieldIP.add("IPs", UserList[i].getUniqueIP(j));
			}

			UserNode.put("ID", UserList[i].getID());
			UserNode.put_child("Nicknames", fieldNickname);
			UserNode.put_child("Connections", fieldDateTime);
			UserNode.put_child("IPs", fieldIP);
			UserNode.put("Connection_Count", UserList[i].getDateTimeCount());
			UserNode.put("Connected", UserList[i].getCurrentConnectionsCount());
			UserNode.put("Deleted", UserList[i].isDeleted());

			UserListNode.add_child("User", UserNode);
		}
		else{
			UserNode.clear();
			UserNode.put("ID", "-1");
			UserListNode.add_child("User", UserNode);
		}
	}
	UserList.clear();

	AttributesNode.put("Generated", "by TS3_EnhancedClientList");

	for (unsigned i = 0; i < parsedLogs.size(); i++){
		fieldParsedLogs.add("ParsedLogs", parsedLogs[i]);
	}

	AttributesNode.put_child("ParsedLogs", fieldParsedLogs);

	ptime now = second_clock::local_time();

	unsigned short year, month, day, hours, minutes, seconds;
	year = now.date().year();
	month = now.date().month();
	day = now.date().day();
	hours = now.time_of_day().hours();
	minutes = now.time_of_day().minutes();
	seconds = now.time_of_day().seconds();

	string curTime = "";
	if (day < 10){ curTime += "0"; }
	curTime += to_string(day) + ".";
	if (month < 10){ curTime += "0"; }
	curTime += to_string(month) + "." + to_string(year) + " ";
	if (hours < 10){ curTime += "0"; }
	curTime += to_string(hours) + ":";
	if (minutes < 10){ curTime += "0"; }
	curTime += to_string(minutes) + ":";
	if (seconds < 10){ curTime += "0"; }
	curTime += to_string(seconds);

	AttributesNode.put("CreationTimestamp", curTime);
	UserListNode.add_child("Attributes", AttributesNode);
	PropertyTree.add_child("UserList", UserListNode);

	cout << "Creating XML..." << endl;
	auto settings = boost::property_tree::xml_writer_make_settings<std::string>('\t', 1);
	try{
		write_xml(XMLFILE, PropertyTree, std::locale(), settings);
	}
	catch (xml_parser_error error){
		cout << "xml_parser_error";
	}
}