// createXML.cpp :

#include <iostream>
#include <fstream>
#include <string>
#include "Constants.h"
#include "User.h"

using namespace std;

extern vector <User> UserList;

// Currently only creating a log for testing.
void createXML(){
	fstream XMLfile(XMLFILE, fstream::out);

	XMLfile << "Test File" << endl << endl;

	for (unsigned int i = 0; i < UserList.size(); i++){

		XMLfile << "ID: " << UserList[i].getID() << endl << "Known Nicknames: ";
		for (unsigned int j = 0; j < UserList[i].getNicknameCount(); j++){
			XMLfile << UserList[i].getUniqueNickname(j) << " , ";
		}

		XMLfile << endl << "Known Connections (DateTime): ";
		for (unsigned int j = 0; j < UserList[i].getDateTimeCount(); j++){
			XMLfile << UserList[i].getUniqueDateTime(j) << " , ";
		}

		XMLfile << endl << "Known IPs: ";
		for (unsigned int j = 0; j < UserList[i].getIPCount(); j++){
			XMLfile << UserList[i].getUniqueIP(j) << " , ";
		}

		XMLfile << endl << "Connected: ";
		switch (UserList[i].isConnected()){
		case true: XMLfile << "yes";
			break;
		case false: XMLfile << "no";
			break;
		}

		XMLfile << endl << endl;
	}
	XMLfile.close();
}