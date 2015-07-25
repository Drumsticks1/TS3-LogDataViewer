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

bool validXML = false;

int main(int argc, char* argv[]) {
	if (exists("lockfile")) {
		time_t currentTime, lockfileCreation = last_write_time("lockfile");
		time(&currentTime);
		if (difftime(currentTime, lockfileCreation) > 300) {
			cout << "lockfile is older than 5 minutes - removing..." << endl;
			remove("lockfile");
		}
	}

	if (!exists("lockfile")) {

		fstream lockfile("lockfile", fstream::out);
		string LOGDIRECTORY;

		options_description description("Program options:");
		description.add_options()
			("help", "Shows this help screen.")
			("logdirectory", value<string>(), "Specify directory containing the logs.");

		variables_map vm;
		positional_options_description logdirectory;
		logdirectory.add("logdirectory", -1);

		try {
			store(command_line_parser(argc, argv).options(description).positional(logdirectory).run(), vm);
			notify(vm);

			if (vm.count("help")) {
				cout << description;
				lockfile.close();
				remove("lockfile");
				return 0;
			}

			if (vm.count("logdirectory")) {
				LOGDIRECTORY = vm["logdirectory"].as<string>();
			}
		}
		catch (error& e) {
			cout << e.what() << endl;
			cout << "Skipping use of command line..." << endl;
		}

		if (LOGDIRECTORY.size() == 0) {
			cout << "Using default logdirectory..." << endl;
			LOGDIRECTORY = "./logs/";
		}

		if (!fetchLogs(LOGDIRECTORY)) {
			cout << "The program will now exit..." << endl;
			lockfile.close();
			remove("lockfile");
			return 0;
		}

		if (!parseXML()) {
			cout << "XML isn't valid - skipping... " << endl;
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
			<< "The program will now exit..." << endl;
		return 0;
	}
}
