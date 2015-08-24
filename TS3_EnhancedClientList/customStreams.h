// customStreams.h: [Description pending]
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

#include <fstream>
#include <boost/iostreams/tee.hpp>
#include <boost/iostreams/stream.hpp>

using namespace std;
using namespace boost::iostreams;

typedef tee_device<ostream, ofstream> TeeDevice;
typedef stream<TeeDevice> TeeStream;
