// parseXML.cpp : Parsing of the XML.

#include <iostream>
#include <string>
#include <vector>
#include "Constants.h"
#include "User.h"
#include <boost/property_tree/ptree.hpp>
#include <boost/property_tree/xml_parser.hpp>
#include <boost/filesystem.hpp>
#include <boost/foreach.hpp>

using namespace std;
using namespace boost::property_tree;
using namespace boost::filesystem;

extern vector <User> UserList;
vector <string> parsedLogs;

// Parses the XML if existing.
bool parseXML(){
	if (exists(XMLFILE)){
		if (is_regular_file(XMLFILE)){
			if (!boost::filesystem::is_empty(XMLFILE)){
				cout << "Parsing the last created XML..." << endl;
				unsigned int ID = 0;
				ptree PropertyTree;

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
						BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("")){
							if (vs.first == "ID"){
								ID = stoul(vs.second.data());
								UserList.resize(ID + 1);
								UserList[ID].addID(stoul(vs.second.data()));
							}
							else if(vs.first == "Deleted"){
								if (vs.second.data() == "true"){
									UserList[ID].deleteUser();
								}
							}
						}
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
					else if (Node.first == "Attributes"){
						BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("ParsedLogs")){
							parsedLogs.emplace_back(vs.second.data());
						}
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