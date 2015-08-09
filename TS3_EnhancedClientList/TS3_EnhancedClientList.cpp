// TS3_EnhancedClientList.cpp
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <fstream>
#include <time.h>
#include "fetchLogs.h"
#include "parseXML.h"
#include "parseLogs.h"
#include "createXML.h"
#include "boost/filesystem.hpp"
#include "boost/program_options.hpp"

using namespace std;
using namespace boost::filesystem;
using namespace boost::program_options;

#define DEFAULTLOGDIRECTORY "./logs/"
#define DEFAULTVIRTUALSERVER 1

bool validXML = false;
unsigned int VIRTUALSERVER = 0;

int main(int argc, char* argv[]) {
	if (exists("lockfile")) {
		time_t currentTime, lockfileCreation = last_write_time("lockfile");
		time(&currentTime);
		if (difftime(currentTime, lockfileCreation) > 300) {
			cout << endl << "The lockfile is older than 5 minutes - removing...";
			remove("lockfile");
		}
	}

	if (!exists("lockfile")) {
		fstream lockfile("lockfile", fstream::out);
		string LOGDIRECTORY;
		variables_map vm;

		options_description description("TS3 Enhanced Client List - Program options");
		description.add_options()
			("help", "Shows this help screen.")
			("logdirectory", value<string>()->default_value(DEFAULTLOGDIRECTORY), "Specify directory containing the logs.")
			("virtualserver", value<unsigned int>()->default_value(DEFAULTVIRTUALSERVER), "Specify the virtual server (currently only supports numbers between 1 and 9).");

		try {
			store(command_line_parser(argc, argv).options(description).run(), vm);
			notify(vm);

			if (vm.count("help")) {
				cout << endl << description;
				lockfile.close();
				remove("lockfile");
				return 0;
			}

			if (vm.count("logdirectory")) {
				string x = vm["logdirectory"].as<string>();
				LOGDIRECTORY = vm["logdirectory"].as<string>();
				// Prevents errors when '.../logs' is used instead of '.../logs/'.
				if (LOGDIRECTORY[LOGDIRECTORY.size() - 1] != '/') {
					cout << endl << "'" + LOGDIRECTORY + "' is an invalid path - trying '" + LOGDIRECTORY + "/'.";
					LOGDIRECTORY.push_back('/');
				}
			}

			if (vm.count("virtualserver")) {
				VIRTUALSERVER = vm["virtualserver"].as<unsigned int>();
			}
		}
		catch (error& error) {
			cout << endl << error.what() << endl << "Skipping command line parameters and using their default values...";
			LOGDIRECTORY = DEFAULTLOGDIRECTORY;
			VIRTUALSERVER = DEFAULTVIRTUALSERVER;
		}

		if (vm["logdirectory"].defaulted()) {
			cout << endl << "No logdirectory specified - using default path...";
		}

		if (vm["virtualserver"].defaulted()) {
			cout << endl << "No virtualserver specified - using default value...";
		}

		if (!fetchLogs(LOGDIRECTORY)) {
			cout << endl << "The program will now exit...";
			lockfile.close();
			remove("lockfile");
			return 0;
		}

		if (!parseXML()) {
			cout << endl << "XML isn't valid - skipping XML parsing...";
		}
		else validXML = true;

		parseLogs(LOGDIRECTORY);
		createXML();

		lockfile.close();
		remove("lockfile");
		return 0;
	}
	else {
		cout << endl << "The program is already running..." << endl
			<< "This program instance will now exit...";
		return 0;
	}
}
