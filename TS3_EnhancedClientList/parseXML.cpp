// parseXML.cpp : Parsing of the XML.
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
#include <boost/filesystem.hpp>
#include <boost/foreach.hpp>

using namespace std;
using namespace boost::property_tree;
using namespace boost::filesystem;

extern vector <User> UserList;
extern vector <Kick> KickList;
vector <string> parsedLogs;

// Parses the XML if existing.
bool parseXML(){
	bool blankUser;
	if (exists(XMLFILE)){
		if (is_regular_file(XMLFILE)){
			if (!boost::filesystem::is_empty(XMLFILE)){
				cout << "Parsing the last created XML..." << endl;
				unsigned int ID = 0, KickListID = 0, kickedID;
				ptree PropertyTree;
				string kickDateTime, kickedNickname, kickedByNickname, kickReason;

				try{
					read_xml(XMLFILE, PropertyTree);
				}
				catch (xml_parser_error error){
					cout << "Error reading out the XML - skipping..." << endl;
					return false;
				}

				BOOST_FOREACH(ptree::value_type const& Node, PropertyTree.get_child("UserList")){
					ptree subtree = Node.second;
					if (Node.first == "User"){
						blankUser = false;
						BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("")){
							if (vs.first == "ID"){
								if (vs.second.data() != "-1"){
									ID = stoul(vs.second.data());
									UserList.resize(ID + 1);
									UserList[ID].addID(stoul(vs.second.data()));
								}
								else{
									blankUser = true;
								}
							}
							else if (vs.first == "Deleted"){
								if (vs.second.data() == "true"){
									UserList[ID].deleteUser();
								}
							}
						}
						if (!blankUser){
							BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("Nicknames")){
								UserList[ID].addNicknameReverse(vs.second.data());
							}
							BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("Connections")){
								UserList[ID].addDateTimeReverse(vs.second.data());
							}
							BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("IPs")){
								UserList[ID].addIPReverse(vs.second.data());
							}
						}
					}
					else if (Node.first == "Attributes"){
						BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("ParsedLogs")){
							parsedLogs.emplace_back(vs.second.data());
						}
					}
					else if (Node.first == "Kick"){
						BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("")){
							if (vs.first == "KickDateTime"){
								kickDateTime = vs.second.data();
							}
							else if (vs.first == "KickedID"){
								kickedID = stoul(vs.second.data());
							}
							else if (vs.first == "KickedNickname"){
								kickedNickname = vs.second.data();
							}
							else if (vs.first == "KickedByNickname"){
								kickedByNickname = vs.second.data();
							}
							else if (vs.first == "KickReason"){
								kickReason = vs.second.data();
							}
						}
							KickList.resize(KickListID + 1);
							KickList[KickListID].addKick(kickDateTime, kickedID, kickedNickname, kickedByNickname, kickReason);
							KickListID++;
						}
				}
				return true;
			}
			else return false;
		}
		else return false;
	}
	else return false;
}
