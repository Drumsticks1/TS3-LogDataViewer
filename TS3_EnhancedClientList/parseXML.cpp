// parseXML.cpp : [Description pending]

#include <iostream>
#include <fstream>
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

// [Description pending]
bool parseXML(){
	if (exists(XMLFILE)){
		if (is_regular_file(XMLFILE)){
			if (!boost::filesystem::is_empty(XMLFILE)){
				cout << "Parsing the last created XML..." << endl;
				unsigned int ID = 0;

				ptree PropertyTree;
				read_xml(XMLFILE, PropertyTree);

				BOOST_FOREACH(ptree::value_type const& Node, PropertyTree.get_child("UserList")){
					// resize earlier.
					ptree subtree = Node.second;
					if (Node.first == "User"){
						BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("ID")){
							ID = stoul(vs.second.data());
							UserList.resize(ID + 1);
							UserList[ID].addID(stoul(vs.second.data()));
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
						// Connected Flag is currently disabled until reimplemented.
						//BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("Connected")){
						//
						//	if (vs.second.data() == "true") UserList[i].connect();
						//}
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