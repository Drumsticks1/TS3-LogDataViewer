// timeFunctions.cpp: Functions for getting times as strings.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include "boost/date_time.hpp"

using namespace std;
using namespace boost::posix_time;

// Returns the given ptime structure as string in the format "dd.mm.yyyy hh:mm:ss".
string ptimeToString(ptime t) {
	unsigned short year = t.date().year(), month = t.date().month(), day = t.date().day(), hours = t.time_of_day().hours(), minutes = t.time_of_day().minutes(), seconds = t.time_of_day().seconds();

	string t_string = "";
	if (day < 10) { t_string += "0"; }
	t_string += to_string(day) + ".";
	if (month < 10) { t_string += "0"; }
	t_string += to_string(month) + "." + to_string(year) + " ";
	if (hours < 10) { t_string += "0"; }
	t_string += to_string(hours) + ":";
	if (minutes < 10) { t_string += "0"; }
	t_string += to_string(minutes) + ":";
	if (seconds < 10) { t_string += "0"; }
	t_string += to_string(seconds);
	return t_string;
}

// Returns the current UTC time as string in the format "dd.mm.yyyy hh:mm:ss".
string getCurrentUTC() {
	return ptimeToString(second_clock::universal_time());
}

// Returns the current local time as string in the format "dd.mm.yyyy hh:mm:ss".
string getCurrentLocaltime() {
	return ptimeToString(second_clock::local_time());
}
