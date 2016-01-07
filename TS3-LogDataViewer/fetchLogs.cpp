// fetchLogs.cpp : Fetching of the log files.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <fstream>
#include <vector>
#include <string>
#include <algorithm>
#include <boost/filesystem.hpp>
#include "checkFunctions.h"
#include "customStreams.h"

namespace bf = boost::filesystem;

std::vector <std::string> Logs;
std::vector <std::string> ignoreLogs;
extern unsigned int VIRTUALSERVER;
extern TeeStream outputStream;

// Fetches the list of log files that are in the log directory and saves it in a std::vector.
bool fetchLogs(std::string LOGDIRECTORY) {
	outputStream << "Checking logdirectory..." << std::endl;

	bf::path log_directory(LOGDIRECTORY);
	try {
		if (bf::exists(log_directory)) {
			if (bf::is_directory(log_directory)) {
				if (!bf::is_empty(log_directory)) {
					outputStream << "Fetching logignore..." << std::endl;
					std::string LogignorePath = LOGDIRECTORY + "logignore";
					if (bf::is_regular_file(LogignorePath)) {
						if (!bf::is_empty(LogignorePath)) {
							std::ifstream logignore(LogignorePath);
							unsigned int logignoreLength;
							std::string buffer_logignore;

							logignore.seekg(0, logignore.end);
							logignoreLength = (unsigned int)logignore.tellg();
							logignore.seekg(0, logignore.beg);

							for (unsigned int i = 0; i < logignoreLength;) {
								getline(logignore, buffer_logignore);
								i += buffer_logignore.size() + 2;
								ignoreLogs.push_back(buffer_logignore);
							}
						}
						else outputStream << "The logignore seems to be empty - skipping..." << std::endl;
					}
					else outputStream << "No valid logignore found - skipping..." << std::endl;

					outputStream << "Fetching logs..." << std::endl;
					bf::directory_iterator LogDirectory(LOGDIRECTORY);
					std::string VS_log;
					while (LogDirectory != bf::directory_iterator()) {
						if (bf::is_regular_file(LogDirectory->status()) && !bf::is_empty(LogDirectory->path()) && LogDirectory->path().extension() == ".log") {
							VS_log.clear();
							short VSEndPos = (short)LogDirectory->path().filename().string().find(".log");

							for (short i = 38; i < VSEndPos; i++) {
								VS_log += LogDirectory->path().filename().string()[i];
							}

							if (VS_log == std::to_string(VIRTUALSERVER) && !isIgnoredLog(LogDirectory->path().filename().string())) {
								Logs.push_back((LogDirectory->path().filename().string()));
							}
						}
						LogDirectory++;
					}
				}
				else {
					outputStream << "The log directory seems to be empty." << std::endl;
					return false;
				}
			}
			else {
				outputStream << "The log directory seems not to be a directory." << std::endl;
				return false;
			}
		}
		else {
			outputStream << "The log directory seems not to exist." << std::endl;
			return false;
		}
	}
	catch (const bf::filesystem_error& error) {
		outputStream << "An error ocurred while fetching the logfiles:" << std::endl << error.what() << std::endl;
		return false;
	}

	if (Logs.size() == 0) {
		outputStream << "The log directory contains no valid logs." << std::endl;
		return false;
	}

	outputStream << "Sorting logs..." << std::endl;
	sort(Logs.begin(), Logs.end());
	return true;
}
