// customStreams.h: Custom streams for synchronous output to the console and the program logfile.
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

#include <fstream>
#include <boost/iostreams/tee.hpp>
#include <boost/iostreams/stream.hpp>

using namespace std;
using namespace boost::iostreams;

typedef tee_device<ostream, ofstream> TeeDevice;
typedef stream<TeeDevice> TeeStream;
