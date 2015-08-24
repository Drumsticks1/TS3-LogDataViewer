// timeFunctions.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <iostream>
#include <boost/date_time.hpp>

using namespace std;
using namespace boost::posix_time;

// Returns the given ptime structure as string in the format "dd.mm.yyyy hh:mm:ss".
string ptimeToString(ptime t);

// Returns the current UTC time as string in the format "dd.mm.yyyy hh:mm:ss".
string getCurrentUTC();

// Returns the current local time as string in the format "dd.mm.yyyy hh:mm:ss".
string getCurrentLocaltime();
