// timeFunctions.cpp: Functions for getting times as strings.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <boost/date_time.hpp>

// Returns the given ptime structure as std::string in the format "dd.mm.yyyy hh:mm:ss".
std::string ptimeToString(boost::posix_time::ptime t) {
	unsigned short year = t.date().year(), month = t.date().month(), day = t.date().day(), hours = t.time_of_day().hours(), minutes = t.time_of_day().minutes(), seconds = t.time_of_day().seconds();

	std::string t_string = "";
	if (day < 10) { t_string += "0"; }
	t_string += std::to_string(day) + ".";
	if (month < 10) { t_string += "0"; }
	t_string += std::to_string(month) + "." + std::to_string(year) + " ";
	if (hours < 10) { t_string += "0"; }
	t_string += std::to_string(hours) + ":";
	if (minutes < 10) { t_string += "0"; }
	t_string += std::to_string(minutes) + ":";
	if (seconds < 10) { t_string += "0"; }
	t_string += std::to_string(seconds);
	return t_string;
}

// Returns the current UTC time as std::string in the format "dd.mm.yyyy hh:mm:ss".
std::string getCurrentUTC() {
	return ptimeToString(boost::posix_time::second_clock::universal_time());
}

// Returns the current local time as std::string in the format "dd.mm.yyyy hh:mm:ss".
std::string getCurrentLocaltime() {
	return ptimeToString(boost::posix_time::second_clock::local_time());
}
