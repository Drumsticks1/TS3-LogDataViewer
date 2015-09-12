// parseXML.cpp : Parsing of the XML.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <string>
#include <vector>
#include "Constants.h"
#include "Client.h"
#include "Ban.h"
#include "Kick.h"
#include "Complaint.h"
#include "File.h"
#include "customStreams.h"
#include <boost/filesystem.hpp>
#include "src/pugixml.hpp"
#define PUGIXML_HEADER_ONLY
#include "src/pugixml.cpp"

using namespace std;
using namespace pugi;

vector <string> parsedLogs;
extern vector <Client> ClientList;
extern vector <Ban> BanList;
extern vector <Kick> KickList;
extern vector <Complaint> ComplaintList;
extern vector <File> FileList;
extern unsigned int VIRTUALSERVER;
extern TeeStream outputStream;

// Parses the XML if existing.
bool parseXML() {
	if (boost::filesystem::exists(XMLFILE)) {
		if (boost::filesystem::is_regular_file(XMLFILE)) {
			if (!boost::filesystem::is_empty(XMLFILE)) {
				unsigned int ID, BanListID = 0, KickListID = 0, ComplaintListID = 0, FileListID = 0, bannedID, bannedByID, bantime, kickedID, complaintAboutID, complaintByID, channelID, uploadedByID;
				string banDateTime, bannedNickname, bannedIP, bannedUID, bannedByNickname, bannedByUID, banReason,
					kickDateTime, kickedNickname, kickedByNickname, kickedByUID, kickReason,
					complaintDateTime, complaintAboutNickname, complaintReason, complaintByNickname,
					uploadDateTime, filename, uploadedByNickname;
				xml_document oldXML;

				outputStream << "Parsing old XML..." << endl;

				xml_parse_result result = oldXML.load_file(XMLFILE);
				if (!result) {
					outputStream << "An error occured while parsing the XML:" << endl << result.description() << endl;
					return false;
				}

				try {
					for (xml_node AttributesNode = oldXML.child("Data").child("Attributes"); AttributesNode; AttributesNode = AttributesNode.next_sibling("Attributes")) {
						if (AttributesNode.child("VirtualServer").first_child().value() != to_string(VIRTUALSERVER)) {
							outputStream << "The last XML was created for another virtual server - skipping use of XML..." << endl;
							return false;
						}

						for (xml_node ParsedLogs = AttributesNode.child("ParsedLogs").child("P"); ParsedLogs; ParsedLogs = ParsedLogs.next_sibling("P")) {
							parsedLogs.emplace_back(ParsedLogs.first_child().value());
						}
					}

					for (xml_node ClientNode = oldXML.child("Data").child("Client"); ClientNode; ClientNode = ClientNode.next_sibling("Client")) {
						if ((string)ClientNode.child("ID").first_child().value() != "-1") {
							ID = stoul(ClientNode.child("ID").first_child().value());
							ClientList.resize(ID + 1);
							ClientList[ID].addID(ID);

							for (xml_node Nicknames = ClientNode.child("Nicknames").child("N"); Nicknames; Nicknames = Nicknames.next_sibling("N")) {
								ClientList[ID].addNicknameReverse(Nicknames.first_child().value());
							}

							for (xml_node Connections = ClientNode.child("Connections").child("C"); Connections; Connections = Connections.next_sibling("C")) {
								ClientList[ID].addDateTimeReverse(Connections.first_child().value());
							}

							for (xml_node IPs = ClientNode.child("IPs").child("I"); IPs; IPs = IPs.next_sibling("I")) {
								ClientList[ID].addIPReverse(IPs.first_child().value());
							}

							if ((string)ClientNode.child("Deleted").first_child().value() == "1") {
								ClientList[ID].deleteClient();
							}
						}
					}

					for (xml_node BanNode = oldXML.child("Data").child("Ban"); BanNode; BanNode = BanNode.next_sibling("Ban")) {
						banDateTime = BanNode.child("BanDateTime").first_child().value();
						bannedID = stoul(BanNode.child("BannedID").first_child().value());
						bannedNickname = BanNode.child("BannedNickname").first_child().value();
						bannedUID = BanNode.child("BannedUID").first_child().value();
						bannedIP = BanNode.child("BannedIP").first_child().value();
						bannedByNickname = BanNode.child("BannedByNickname").first_child().value();
						bannedByID = stoul(BanNode.child("BannedByID").first_child().value());
						bannedByUID = BanNode.child("BannedByUID").first_child().value();
						banReason = BanNode.child("BanReason").first_child().value();
						bantime = stoul(BanNode.child("Bantime").first_child().value());

						BanList.resize(BanListID + 1);
						BanList[BanListID].addBan(banDateTime, bannedID, bannedNickname, bannedUID, bannedIP, bannedByNickname, bannedByID, bannedByUID, banReason, bantime);
						BanListID++;
					}

					for (xml_node KickNode = oldXML.child("Data").child("Kick"); KickNode; KickNode = KickNode.next_sibling("Kick")) {
						kickDateTime = KickNode.child("KickDateTime").first_child().value();
						kickedID = stoul(KickNode.child("KickedID").first_child().value());
						kickedNickname = KickNode.child("KickedNickname").first_child().value();
						kickedByNickname = KickNode.child("KickedByNickname").first_child().value();
						kickedByUID = KickNode.child("KickedByUID").first_child().value();
						kickReason = KickNode.child("KickReason").first_child().value();

						KickList.resize(KickListID + 1);
						KickList[KickListID].addKick(kickDateTime, kickedID, kickedNickname, kickedByNickname, kickedByUID, kickReason);
						KickListID++;
					}

					for (xml_node ComplaintNode = oldXML.child("Data").child("Complaint"); ComplaintNode; ComplaintNode = ComplaintNode.next_sibling("Complaint")) {
						complaintDateTime = ComplaintNode.child("ComplaintDateTime").first_child().value();
						complaintAboutNickname = ComplaintNode.child("ComplaintAboutNickname").first_child().value();
						complaintAboutID = stoul(ComplaintNode.child("ComplaintAboutID").first_child().value());
						complaintReason = ComplaintNode.child("ComplaintReason").first_child().value();
						complaintByNickname = ComplaintNode.child("ComplaintByNickname").first_child().value();
						complaintByID = stoul(ComplaintNode.child("ComplaintByID").first_child().value());

						ComplaintList.resize(ComplaintListID + 1);
						ComplaintList[ComplaintListID].addComplaint(complaintDateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID);
						ComplaintListID++;
					}

					for (xml_node FileNode = oldXML.child("Data").child("File"); FileNode; FileNode = FileNode.next_sibling("File")) {
						uploadDateTime = FileNode.child("UploadDateTime").first_child().value();
						channelID = stoul(FileNode.child("ChannelID").first_child().value());
						filename = FileNode.child("Filename").first_child().value();
						uploadedByNickname = FileNode.child("UploadedByNickname").first_child().value();
						uploadedByID = stoul(FileNode.child("UploadedByID").first_child().value());

						FileList.resize(FileListID + 1);
						FileList[FileListID].addFile(uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID);
						FileListID++;
					}
					return true;
				}
				catch (exception& ex) {
					outputStream << "An error occured while parsing the XML:" << endl << ex.what() << endl;
					ClientList.clear();
					BanList.clear();
					KickList.clear();
					ComplaintList.clear();
					FileList.clear();
					return false;
				}
			}
			else return false;
		}
		else return false;
	}
	else return false;
}
