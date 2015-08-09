// parseXML.cpp : Parsing of the XML.
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
#include <boost/filesystem.hpp>
#include <boost/foreach.hpp>

using namespace std;
using namespace boost::property_tree;
using namespace boost::filesystem;

vector <string> parsedLogs;
extern vector <User> UserList;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <File> FileList;

// Parses the XML if existing.
bool parseXML() {
	if (exists(XMLFILE)) {
		if (is_regular_file(XMLFILE)) {
			if (!boost::filesystem::is_empty(XMLFILE)) {
				cout << endl << "Parsing the old XML...";
				unsigned int ID, BanListID = 0, KickListID = 0, FileListID = 0, bannedID, bannedByInvokerID, bantime, kickedID, channelID, uploadedByID;
				ptree PropertyTree;
				string banDateTime, bannedNickname, bannedByNickname, bannedByUID, banReason, kickDateTime, kickedNickname, kickedByNickname, kickedByUID, kickReason, uploadDateTime, filename, uploadedByNickname;

				try {
					read_xml(XMLFILE, PropertyTree);
				}
				catch (xml_parser_error error) {
					cout << "An error occured while parsing the XML:" << endl << error.what() << endl << "Skipping the XML-Parsing...";
					return false;
				}

				BOOST_FOREACH(ptree::value_type const& Node, PropertyTree.get_child("UserList")) {
					ptree subtree = Node.second;
					if (Node.first == "User") {
						if (subtree.get_child("ID").data() != "-1") {
							ID = stoul(subtree.get_child("ID").data());
							UserList.resize(ID + 1);
							UserList[ID].addID(ID);

							BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("Nicknames")) {
								UserList[ID].addNicknameReverse(vs.second.data());
							}
							BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("Connections")) {
								UserList[ID].addDateTimeReverse(vs.second.data());
							}
							BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("IPs")) {
								UserList[ID].addIPReverse(vs.second.data());
							}

							if (subtree.get_child("Deleted").data() == "true") {
								UserList[ID].deleteUser();
							}
						}
					}
					else if (Node.first == "Ban") {
						banDateTime = subtree.get_child("BanDateTime").data();
						bannedNickname = subtree.get_child("BannedNickname").data();
						bannedID = stoul(subtree.get_child("BannedID").data());
						bannedByInvokerID = stoul(subtree.get_child("BannedByInvokerID").data());
						bannedByNickname = subtree.get_child("BannedByNickname").data();
						bannedByUID = subtree.get_child("BannedByUID").data();
						banReason = subtree.get_child("BanReason").data();
						bantime = stoul(subtree.get_child("Bantime").data());

						BanList.resize(BanListID + 1);
						BanList[BanListID].addBan(banDateTime, bannedNickname, bannedID, bannedByInvokerID, bannedByNickname, bannedByUID, banReason, bantime);
						BanListID++;
					}
					else if (Node.first == "Kick") {
						kickDateTime = subtree.get_child("KickDateTime").data();
						kickedID = stoul(subtree.get_child("KickedID").data());
						kickedNickname = subtree.get_child("KickedNickname").data();
						kickedByNickname = subtree.get_child("KickedByNickname").data();
						kickedByUID = subtree.get_child("KickedByUID").data();
						kickReason = subtree.get_child("KickReason").data();

						KickList.resize(KickListID + 1);
						KickList[KickListID].addKick(kickDateTime, kickedID, kickedNickname, kickedByNickname, kickedByUID, kickReason);
						KickListID++;
					}
					else if (Node.first == "File") {
						uploadDateTime = subtree.get_child("UploadDateTime").data();
						channelID = stoul(subtree.get_child("ChannelID").data());
						filename = subtree.get_child("Filename").data();
						uploadedByNickname = subtree.get_child("UploadedByNickname").data();
						uploadedByID = stoul(subtree.get_child("UploadedByID").data());

						FileList.resize(FileListID + 1);
						FileList[FileListID].uploadFile(uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID);
						FileListID++;
					}
					else if (Node.first == "Attributes") {
						BOOST_FOREACH(ptree::value_type const& vs, subtree.get_child("ParsedLogs")) {
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
