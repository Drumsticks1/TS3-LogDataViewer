// TS3_EnhancedClientList.cpp
// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include "fetchLogs.h"
#include "parseXML.h"
#include "parseLogs.h"
#include "createXML.h"
#include "boost/program_options.hpp"

using namespace std;
using namespace boost::program_options;

bool validXML = false;

int main(int argc, char* argv[]){
	string LOGDIRECTORY;

	options_description description("Program options");
	description.add_options()
		("help", "returns this help screen.")
		("logdirectory", value<string>(), "Specify directory containing the logs.");

	variables_map vm;
	positional_options_description logdirectory;
	logdirectory.add("logdirectory", -1);
	
	try{
		store(command_line_parser(argc, argv).options(description).positional(logdirectory).run(), vm);
		notify(vm);

		if (vm.count("help")){
			cout << description;
			return 0;
		}

		if (vm.count("logdirectory")){
			LOGDIRECTORY = vm["logdirectory"].as<string>();
		}
	}
	catch (error& e){
		cout << e.what() << endl;
		cout << "Skipping use of command line..." << endl;
	}

	if (LOGDIRECTORY.size() == 0){
		cout << "Using default logdirectory..." << endl;
		LOGDIRECTORY = "./logs/";
	}

	if (!fetchLogs(LOGDIRECTORY)){
		cout << "The program will now exit..." << endl;
		return 0;
	}

	if (!parseXML()){
		cout << "XML isn't valid - skipping... " << endl;
	}
	else validXML = true;

	parseLogs(LOGDIRECTORY);
	createXML();
	return 0;
}
