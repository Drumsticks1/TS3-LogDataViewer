// TS3_EnhancedClientList.cpp
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <fstream>
#include <time.h>
#include "Constants.h"
#include "fetchLogs.h"
#include "parseXML.h"
#include "parseLogs.h"
#include "createXML.h"
#include "boost/filesystem.hpp"
#include "boost/program_options.hpp"

using namespace std;
using namespace boost::filesystem;
using namespace boost::program_options;

bool validXML = false;
unsigned int VIRTUALSERVER = 0;

int main(int argc, char* argv[]) {
	if (exists("lockfile")) {
		time_t currentTime, lockfileCreation = last_write_time("lockfile");
		time(&currentTime);
		if (difftime(currentTime, lockfileCreation) > 300) {
			cout << "The lockfile is older than 5 minutes - removing..." << endl;
			remove("lockfile");
		}
	}

	if (!exists("lockfile") || SKIPLOCKFILE == true) {
		fstream lockfile("lockfile", fstream::out);
		string LOGDIRECTORY;
		variables_map vm;

		options_description description("TS3 Enhanced Client List - Program options");
		description.add_options()
			("help", "Shows this help screen.")
			("logdirectory", value<string>()->default_value(DEFAULTLOGDIRECTORY), "Specify the directory containing the logs.")
			("virtualserver", value<unsigned int>()->default_value(DEFAULTVIRTUALSERVER), "Specify the virtual server.");

		try {
			store(command_line_parser(argc, argv).options(description).run(), vm);
			notify(vm);

			if (vm.count("help")) {
				cout << endl << description << endl;
				lockfile.close();
				remove("lockfile");
				return 0;
			}

			if (vm.count("logdirectory")) {
				string x = vm["logdirectory"].as<string>();
				LOGDIRECTORY = vm["logdirectory"].as<string>();
				// Prevents errors when '.../logs' is used instead of '.../logs/'.
				if (LOGDIRECTORY[LOGDIRECTORY.size() - 1] != '/') {
					cout << "'" + LOGDIRECTORY + "' is an invalid path - trying '" + LOGDIRECTORY + "/'." << endl;
					LOGDIRECTORY.push_back('/');
				}
			}

			if (vm.count("virtualserver")) {
				VIRTUALSERVER = vm["virtualserver"].as<unsigned int>();
			}
		}
		catch (error& error) {
			cout << error.what() << endl << "Skipping command line parameters and using their default values..." << endl;
			LOGDIRECTORY = DEFAULTLOGDIRECTORY;
			VIRTUALSERVER = DEFAULTVIRTUALSERVER;
		}

		if (vm["logdirectory"].defaulted()) {
			cout << "No logdirectory specified - using default path..." << endl;
		}

		if (vm["virtualserver"].defaulted()) {
			cout << "No virtual server specified - using default value..." << endl;
		}

		if (!fetchLogs(LOGDIRECTORY)) {
			cout << "The program will now exit..." << endl;
			lockfile.close();
			remove("lockfile");
			return 0;
		}

		if (!parseXML()) {
			cout << "XML isn't valid - skipping XML parsing..." << endl;
		}
		else validXML = true;

		parseLogs(LOGDIRECTORY);
		createXML();

		lockfile.close();
		remove("lockfile");
		return 0;
	}
	else {
		cout << "The program is already running..." << endl
			<< "This program instance will now exit..." << endl;
		return 0;
	}
}
