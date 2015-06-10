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

	for (unsigned int i = 0; i < UserList.size(); i++){
		NicknameVar = DateTimeVar = IPVar = "";
		UserNode.put("<xmlattr>.ID", UserList[i].getID());
		UserNode.put("<xmlattr>.Last_Nickname", UserList[i].getUniqueNickname(0));

		for (unsigned int j = 0; j < UserList[i].getNicknameCount(); j++){
			NicknameVar += UserList[i].getUniqueNickname(j);
			if(j < UserList[i].getNicknameCount() - 1) NicknameVar += ", ";
		}

		for (unsigned int j = 0; j < UserList[i].getDateTimeCount(); j++){
			DateTimeVar += UserList[i].getUniqueDateTime(j);
			if (j < UserList[i].getDateTimeCount() - 1) DateTimeVar += ", ";
		}

		for (unsigned int j = 0; j < UserList[i].getIPCount(); j++){
			IPVar += UserList[i].getUniqueIP(j);
			if (j < UserList[i].getIPCount() - 1) IPVar += ", ";
		}

		fieldID.put_value(UserList[i].getID());
		fieldNickname.put_value(NicknameVar);
		fieldDateTime.put_value(DateTimeVar);
		fieldIP.put_value(IPVar);
		fieldConnectionCount.put_value(UserList[i].getDateTimeCount());
		fieldConnected.put_value(UserList[i].isConnected());

		UserNode.put_child("ID", fieldID);
		UserNode.put_child("Nicknames", fieldNickname);
		UserNode.put_child("Connections", fieldDateTime);
		UserNode.put_child("IPs", fieldIP);
		UserNode.put_child("Connection_Count", fieldConnectionCount);
		UserNode.put_child("Connected", fieldConnected);

		UserListNode.add_child("User", UserNode);
	}

	PropertyTree.add_child("UserList", UserListNode);
	
	auto settings = boost::property_tree::xml_writer_make_settings<std::string>('\t', 1);
	write_xml(XMLFILE, PropertyTree, std::locale(), settings);
}

/* Planned Tree:
<UserList>
	<Title>Created by TS3_EnhancedClientList</Title>
	<User> ID, Nickname
		<ID></ID>
		<Nicknames></Nicknames>
		<Connections></Connections>
		<IPs></IPs>
		<Number_of_Connections></Number_of_Connections>
		<Connected></Connected>
	</User>
</UserList>
*/