// createXML.cpp : Creation of the XML.
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <string>
#include <vector>
#include "Constants.h"
#include "User.h"
#include "Kick.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>
#include <boost/date_time.hpp>

using namespace std;
using namespace boost::property_tree;
using namespace boost::posix_time;

extern vector <User> UserList;
extern vector <string> parsedLogs;
extern vector <Kick> KickList;

// Returns the given time structure as string in the format "dd.mm.yyyy hh:mm:ss".
string timeToString(ptime t){
	unsigned short year, month, day, hours, minutes, seconds;
	year = t.date().year();
	month = t.date().month();
	day = t.date().day();
	hours = t.time_of_day().hours();
	minutes = t.time_of_day().minutes();
	seconds = t.time_of_day().seconds();

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
	return curTime;
}

// Creates a XML for storing the data extracted from the logs.
void createXML(){
	ptree PropertyTree, UserListNode, KickNode, UserNode, AttributesNode;
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

	for (unsigned int i = 0; i < KickList.size(); i++){
		KickNode.put("KickDateTime", KickList[i].getKickDateTime());
		KickNode.put("KickedID", KickList[i].getKickedID());
		KickNode.put("KickedNickname", KickList[i].getKickedNickname());
		KickNode.put("KickedByNickname", KickList[i].getKickedByNickname());
		KickNode.put("KickedByUID", KickList[i].getKickedByUID());
		KickNode.put("KickReason", KickList[i].getKickReason());

		UserListNode.add_child("Kick", KickNode);
	}
	KickList.clear();

	AttributesNode.put("Generated", "by TS3_EnhancedClientList");

	for (unsigned i = 0; i < parsedLogs.size(); i++){
		fieldParsedLogs.add("ParsedLogs", parsedLogs[i]);
	}

	AttributesNode.put_child("ParsedLogs", fieldParsedLogs);

	ptime currentLocaltime = second_clock::local_time();
	ptime currentUTC = second_clock::universal_time();

	AttributesNode.put("CreationTimestamp_Localtime", timeToString(currentLocaltime));
	AttributesNode.put("CreationTimestamp_UTC", timeToString(currentUTC));

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
