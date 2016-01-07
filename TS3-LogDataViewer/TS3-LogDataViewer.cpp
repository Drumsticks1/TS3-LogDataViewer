// TS3-LogDataViewer.cpp
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <fstream>
#include <string>
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

namespace bpo = boost::program_options;

bool validXML = false;
unsigned int VIRTUALSERVER = 0;

std::ofstream programLogfile(PROGRAMLOGFILE);
TeeDevice fileOutput(std::cout, programLogfile);
TeeStream outputStream(fileOutput);

int main(int argc, char* argv[]) {
	programLogfile << "Last program run" << std::endl << std::endl << getCurrentUTC() << " (UTC)" << std::endl << getCurrentLocaltime() << " (Local time)" << std::endl << std::endl;
	if (boost::filesystem::exists("lockfile")) {
		time_t currentTime, lockfileCreation = boost::filesystem::last_write_time("lockfile");
		time(&currentTime);
		if (difftime(currentTime, lockfileCreation) > LOCKFILEEXPIRATION) {
			outputStream << "The lockfile is older than " << LOCKFILEEXPIRATION << " seconds - removing..." << std::endl;
			remove("lockfile");
		}
	}

	if (!boost::filesystem::exists("lockfile") || SKIPLOCKFILE == true) {
		std::fstream lockfile("lockfile", std::fstream::out);
		std::string LOGDIRECTORY;
		bpo::variables_map vm;

		bpo::options_description description("TS3 Enhanced Client List - Program options");
		description.add_options()
			("help", "Shows this help screen.")
			("logdirectory", bpo::value<std::string>()->default_value(DEFAULTLOGDIRECTORY), "Specify the directory containing the logs.")
			("virtualserver", bpo::value<unsigned int>()->default_value(DEFAULTVIRTUALSERVER), "Specify the virtual server.");

		try {
			store(parse_command_line(argc, argv, description), vm);
			notify(vm);

			if (vm.count("help")) {
				outputStream << std::endl << description << std::endl;
				lockfile.close();
				remove("lockfile");
				return 0;
			}

			if (vm.count("logdirectory")) {
				LOGDIRECTORY = vm["logdirectory"].as<std::string>();
				// Prevents errors when '.../logs' is used instead of '.../logs/'.
				if (LOGDIRECTORY[LOGDIRECTORY.size() - 1] != '/') {
					outputStream << "'" + LOGDIRECTORY + "' is an invalid path - trying '" + LOGDIRECTORY + "/'." << std::endl;
					LOGDIRECTORY.push_back('/');
				}
			}

			if (vm.count("virtualserver")) {
				VIRTUALSERVER = vm["virtualserver"].as<unsigned int>();
			}
		}
		catch (std::exception& ex) {
			outputStream << "An error occurred: " << ex.what() << std::endl << "Skipping command line parameters..." << std::endl;
			LOGDIRECTORY = DEFAULTLOGDIRECTORY;
			VIRTUALSERVER = DEFAULTVIRTUALSERVER;
		}

		if (vm["logdirectory"].defaulted()) {
			outputStream << "No logdirectory specified - using default path..." << std::endl;
		}

		if (vm["virtualserver"].defaulted()) {
			outputStream << "No virtual server specified - using default value..." << std::endl;
		}

		if (!fetchLogs(LOGDIRECTORY)) {
			outputStream << "The program will now exit..." << std::endl;
			lockfile.close();
			remove("lockfile");
			return 0;
		}

		if (!parseXML()) {
			outputStream << "XML isn't valid - skipping XML parsing..." << std::endl;
		}
		else validXML = true;

		parseLogs(LOGDIRECTORY);
		createXML();

		lockfile.close();
		remove("lockfile");
		return 0;
	}
	else {
		outputStream << "The program is already running..." << std::endl << "This program instance will now exit..." << std::endl;
		return 0;
	}
}
