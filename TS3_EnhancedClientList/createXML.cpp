// createXML.cpp : [Description pending]

#include <iostream>
#include <fstream>
#include <string>
#include "Constants.h"
#include "User.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>

using namespace std;
using namespace boost::property_tree;

extern vector <User> UserList;
// Add later.
#define TITLE "Created by TS3_EnhancedClientList"

// [Description pending]
void createXML(){
	ptree PropertyTree;
	ptree UserListNode;
	ptree UserNode;
	ptree fieldID;
	ptree fieldNickname;
	ptree fieldDateTime;
	ptree fieldIP;
	ptree fieldConnectionCount;
	ptree fieldConnected;

	string NicknameVar, DateTimeVar, IPVar;

	cout << "Preparing XML-Creation..." << endl;
	for (unsigned int i = 0; i < UserList.size(); i++){
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
		fieldConnected.put("Connected", UserList[i].isConnected());

		UserNode.put_child("ID", fieldID);
		UserNode.put_child("Nicknames", fieldNickname);
		UserNode.put_child("Connections", fieldDateTime);
		UserNode.put_child("IPs", fieldIP);
		UserNode.put_child("Connection_Count", fieldConnectionCount);
		UserNode.put_child("Connected", fieldConnected);

		UserListNode.add_child("User", UserNode);
	}
	PropertyTree.add_child("UserList", UserListNode);
	
	cout << "Creating XML..." << endl;

	auto settings = boost::property_tree::xml_writer_make_settings<std::string>('\t', 1);
	write_xml(XMLFILE, PropertyTree, std::locale(), settings);
}

