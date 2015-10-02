// TS3-LogDataViewer.cpp
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <iostream>
#include <fstream>
#include <time.h>
#include "Constants.h"
#include "fetchLogs.h"
#include "parseXML.h"
#include "parseLogs.h"
#include "createXML.h"
#include "timeFunctions.h"
#include "customStreams.h"
#include <boost/filesystem.hpp>
#include <boost/program_options.hpp>

using namespace std;
using namespace boost::filesystem;
using namespace boost::program_options;

bool validXML = false;
unsigned int VIRTUALSERVER = 0;

ofstream programLogfile(PROGRAMLOGFILE);
TeeDevice fileOutput(cout, programLogfile);
TeeStream outputStream(fileOutput);

int main(int argc, char* argv[]) {
	programLogfile << "Last program run" << endl << endl << getCurrentUTC() << " (UTC)" << endl << getCurrentLocaltime() << " (Local time)" << endl << endl;
	if (exists("lockfile")) {
		time_t currentTime, lockfileCreation = last_write_time("lockfile");
		time(&currentTime);
		if (difftime(currentTime, lockfileCreation) > LOCKFILEEXPIRATION) {
			outputStream << "The lockfile is older than " << LOCKFILEEXPIRATION << " seconds - removing..." << endl;
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
			store(parse_command_line(argc, argv, description), vm);
			notify(vm);

			if (vm.count("help")) {
				outputStream << endl << description << endl;
				lockfile.close();
				remove("lockfile");
				return 0;
			}

			if (vm.count("logdirectory")) {
				LOGDIRECTORY = vm["logdirectory"].as<string>();
				// Prevents errors when '.../logs' is used instead of '.../logs/'.
				if (LOGDIRECTORY[LOGDIRECTORY.size() - 1] != '/') {
					outputStream << "'" + LOGDIRECTORY + "' is an invalid path - trying '" + LOGDIRECTORY + "/'." << endl;
					LOGDIRECTORY.push_back('/');
				}
			}

			if (vm.count("virtualserver")) {
				VIRTUALSERVER = vm["virtualserver"].as<unsigned int>();
			}
		}
		catch (exception& ex) {
			outputStream << "An error occurred: " << ex.what() << endl << "Skipping command line parameters..." << endl;
			LOGDIRECTORY = DEFAULTLOGDIRECTORY;
			VIRTUALSERVER = DEFAULTVIRTUALSERVER;
		}

		if (vm["logdirectory"].defaulted()) {
			outputStream << "No logdirectory specified - using default path..." << endl;
		}

		if (vm["virtualserver"].defaulted()) {
			outputStream << "No virtual server specified - using default value..." << endl;
		}

		if (!fetchLogs(LOGDIRECTORY)) {
			outputStream << "The program will now exit..." << endl;
			lockfile.close();
			remove("lockfile");
			return 0;
		}

		if (!parseXML()) {
			outputStream << "XML isn't valid - skipping XML parsing..." << endl;
		}
		else validXML = true;

		parseLogs(LOGDIRECTORY);
		createXML();

		lockfile.close();
		remove("lockfile");
		return 0;
	}
	else {
		outputStream << "The program is already running..." << endl << "This program instance will now exit..." << endl;
		return 0;
	}
}
