// createXML.cpp : Creation of the XML.

#include <iostream>
#include <fstream>
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
// DEV: Add later.
#define TITLE "Created by TS3_EnhancedClientList"

// Creates a XML for storing the data extracted from the logs.
void createXML(){
	ptree PropertyTree, UserListNode, UserNode, AttributesNode;
	ptree fieldID, fieldNickname, fieldDateTime, fieldIP, fieldConnectionCount, fieldConnected;

	cout << "Preparing XML-Creation..." << endl;
	for (unsigned int i = 0; i < UserList.size(); i++){
		if (UserList[i].getID() != 0){
			fieldNickname.clear();
			fieldDateTime.clear();
			fieldIP.clear();

			fieldID.put("ID", UserList[i].getID());

			for (unsigned int j = 0; j < UserList[i].getNicknameCount(); j++){
				fieldNickname.add("Nicknames", UserList[i].getUniqueNickname(j));
			}

			for (unsigned int j = 0; j < UserList[i].getDateTimeCount(); j++){
				fieldDateTime.add("Connections", UserList[i].getUniqueDateTime(j));
			}

			for (unsigned int j = 0; j < UserList[i].getIPCount(); j++){
				fieldIP.add("IPs", UserList[i].getUniqueIP(j));
			}

			fieldConnectionCount.put("Connection_Count", UserList[i].getDateTimeCount());
			fieldConnected.put("Connected", UserList[i].getCurrentConnectionsCount());

			UserNode.put_child("ID", fieldID);
			UserNode.put_child("Nicknames", fieldNickname);
			UserNode.put_child("Connections", fieldDateTime);
			UserNode.put_child("IPs", fieldIP);
			UserNode.put_child("Connection_Count", fieldConnectionCount);
			UserNode.put_child("Connected", fieldConnected);

			UserListNode.add_child("User", UserNode);
		}
	}
	UserList.clear();

	ptime now = second_clock::local_time();
	stringstream currentTimeStringStream;
	currentTimeStringStream << now.date().day() << "." << static_cast<int>(now.date().month()) << "." << now.date().year() << " "
		<< now.time_of_day().hours() << ":" << now.time_of_day().minutes() << ":" << now.time_of_day().seconds();
	string currentTimeString = currentTimeStringStream.str();

	AttributesNode.put("CreationTimestamp", currentTimeString);
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