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
#include "Upload.h"
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
extern vector <Upload> UploadList;
extern unsigned int VIRTUALSERVER;
extern TeeStream outputStream;

// Parses the XML if existing.
bool parseXML() {
	if (boost::filesystem::exists(XMLFILE)) {
		if (boost::filesystem::is_regular_file(XMLFILE)) {
			if (!boost::filesystem::is_empty(XMLFILE)) {
				unsigned int ID, BanListID = 0, KickListID = 0, ComplaintListID = 0, UploadListID = 0, bannedID, bannedByID, bantime, kickedID, complaintAboutID, complaintByID, channelID, uploadedByID, deletedByID;
				string banDateTime, bannedNickname, bannedIP, bannedUID, bannedByNickname, bannedByUID, banReason,
					kickDateTime, kickedNickname, kickedByNickname, kickedByUID, kickReason,
					complaintDateTime, complaintAboutNickname, complaintReason, complaintByNickname,
					uploadDateTime, filename, uploadedByNickname, deletedByNickname;
				xml_document oldXML;

				outputStream << "Parsing old XML..." << endl;

				xml_parse_result result = oldXML.load_file(XMLFILE);
				if (!result) {
					outputStream << "An error occured while parsing the XML:" << endl << result.description() << endl;
					return false;
				}

				try {
					for (xml_node AttributesNode = oldXML.first_child().child("Attributes"); AttributesNode; AttributesNode = AttributesNode.next_sibling("Attributes")) {
						if (AttributesNode.child("VirtualServer").first_child().value() != to_string(VIRTUALSERVER)) {
							outputStream << "The last XML was created for another virtual server - skipping use of XML..." << endl;
							return false;
						}

						for (xml_node ParsedLogs = AttributesNode.child("ParsedLogs").child("P"); ParsedLogs; ParsedLogs = ParsedLogs.next_sibling("P")) {
							parsedLogs.emplace_back(ParsedLogs.first_child().value());
						}
					}

					for (xml_node ClientNode = oldXML.first_child().child("Client"); ClientNode; ClientNode = ClientNode.next_sibling("Client")) {
						if ((string)ClientNode.child("ID").first_child().value() != "-1") {
							ID = stoul(ClientNode.child("ID").first_child().value());
							ClientList.resize(ID + 1);
							ClientList[ID].addID(ID);

							for (xml_node Nicknames = ClientNode.child("Nicknames").first_child(); Nicknames; Nicknames = Nicknames.next_sibling()) {
								ClientList[ID].addNicknameReverse(Nicknames.first_child().value());
							}

							for (xml_node Connections = ClientNode.child("Connections").first_child(); Connections; Connections = Connections.next_sibling()) {
								ClientList[ID].addDateTimeReverse(Connections.first_child().value());
							}

							for (xml_node IPs = ClientNode.child("IPs").first_child(); IPs; IPs = IPs.next_sibling()) {
								ClientList[ID].addIPReverse(IPs.first_child().value());
							}

							if ((string)ClientNode.child("Deleted").first_child().value() == "1") {
								ClientList[ID].deleteClient();
							}
						}
					}

					for (xml_node BanNode = oldXML.first_child().child("Ban"); BanNode; BanNode = BanNode.next_sibling("Ban")) {
						banDateTime = BanNode.child("DateTime").first_child().value();
						bannedID = stoul(BanNode.child("ID").first_child().value());
						bannedNickname = BanNode.child("Nickname").first_child().value();
						bannedUID = BanNode.child("UID").first_child().value();
						bannedIP = BanNode.child("IP").first_child().value();
						bannedByNickname = BanNode.child("ByNickname").first_child().value();
						bannedByID = stoul(BanNode.child("ByID").first_child().value());
						bannedByUID = BanNode.child("ByUID").first_child().value();
						banReason = BanNode.child("Reason").first_child().value();
						bantime = stoul(BanNode.child("Bantime").first_child().value());

						BanList.resize(BanListID + 1);
						BanList[BanListID].addBan(banDateTime, bannedID, bannedNickname, bannedUID, bannedIP, bannedByNickname, bannedByID, bannedByUID, banReason, bantime);
						BanListID++;
					}

					for (xml_node KickNode = oldXML.first_child().child("Kick"); KickNode; KickNode = KickNode.next_sibling("Kick")) {
						kickDateTime = KickNode.child("DateTime").first_child().value();
						kickedID = stoul(KickNode.child("ID").first_child().value());
						kickedNickname = KickNode.child("Nickname").first_child().value();
						kickedByNickname = KickNode.child("ByNickname").first_child().value();
						kickedByUID = KickNode.child("ByUID").first_child().value();
						kickReason = KickNode.child("Reason").first_child().value();

						KickList.resize(KickListID + 1);
						KickList[KickListID].addKick(kickDateTime, kickedID, kickedNickname, kickedByNickname, kickedByUID, kickReason);
						KickListID++;
					}

					for (xml_node ComplaintNode = oldXML.first_child().child("Complaint"); ComplaintNode; ComplaintNode = ComplaintNode.next_sibling("Complaint")) {
						complaintDateTime = ComplaintNode.child("DateTime").first_child().value();
						complaintAboutNickname = ComplaintNode.child("AboutNickname").first_child().value();
						complaintAboutID = stoul(ComplaintNode.child("AboutID").first_child().value());
						complaintReason = ComplaintNode.child("Reason").first_child().value();
						complaintByNickname = ComplaintNode.child("ByNickname").first_child().value();
						complaintByID = stoul(ComplaintNode.child("ByID").first_child().value());

						ComplaintList.resize(ComplaintListID + 1);
						ComplaintList[ComplaintListID].addComplaint(complaintDateTime, complaintAboutNickname, complaintAboutID, complaintReason, complaintByNickname, complaintByID);
						ComplaintListID++;
					}

					for (xml_node UploadNode = oldXML.first_child().child("Upload"); UploadNode; UploadNode = UploadNode.next_sibling("Upload")) {
						uploadDateTime = UploadNode.child("DateTime").first_child().value();
						channelID = stoul(UploadNode.child("ChannelID").first_child().value());
						filename = UploadNode.child("Filename").first_child().value();
						uploadedByNickname = UploadNode.child("UplByNickname").first_child().value();
						uploadedByID = stoul(UploadNode.child("UplByID").first_child().value());
						deletedByNickname = UploadNode.child("DelByNickname").first_child().value();
						deletedByID = stoul(UploadNode.child("DelByID").first_child().value());

						UploadList.resize(UploadListID + 1);
						UploadList[UploadListID].addUpload(uploadDateTime, channelID, filename, uploadedByNickname, uploadedByID, deletedByNickname, deletedByID);
						UploadListID++;
					}
					return true;
				}
				catch (exception& ex) {
					outputStream << "An error occured while parsing the XML:" << endl << ex.what() << endl;
					ClientList.clear();
					BanList.clear();
					KickList.clear();
					ComplaintList.clear();
					UploadList.clear();
					return false;
				}
			}
			else return false;
		}
		else return false;
	}
	else return false;
}
