// timeFunctions.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <boost/date_time.hpp>

// Returns the given ptime structure as std::string in the format "dd.mm.yyyy hh:mm:ss".
std::string ptimeToString(boost::posix_time::ptime t);

// Returns the current UTC time as std::string in the format "dd.mm.yyyy hh:mm:ss".
std::string getCurrentUTC();

// Returns the current local time as std::string in the format "dd.mm.yyyy hh:mm:ss".
std::string getCurrentLocaltime();
