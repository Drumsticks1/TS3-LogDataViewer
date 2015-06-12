/* Todo:

general
	- find and sort out old IDs for the same person or merge them, or:
	- Maybe later: Compare actual database with the IDs and gray out / delete the deleted IDs.
	- maybe sort the UserList by ID.
	- Connected / Disconnected Flag --> Online status possible
		- Add compatibility to multiple connects before disconnecting (e.g. User and User1 with the same ID).
	- Add missing descriptions (found by searching for the [Description pending] tag).

Boost-Filesystem
	- Sort logsfiles after reading them in to guarantee a proper created client list.

User
	- Change DateTime to Date and Time and maybe include <time.h> later.
		- Maybe add total connection time.
	- Add possibility to ignore IDs (e.g. obsolete ones from old identities).

readLogs
	- Extend use of disconnect-messages.

fetchLogfiles
	- Maybe use ts3server_xxxx-xx-xx__xx_xx_xx.xxxxxx_1 logs for indication if the last logfile has to be read in again (server shutdown).

readLogs && checkFunctions
	- Add right order sorting to the duplicate checking functions.

webinterface
	- Add sorting options.
	- Possibility to hide duplicate Names like Drumsticks1 or Drumsticks11 in the webinterface.
	- Add timer for creation of XML-File (runtime of program) and update table automatically afterwards.

Use last xml to read in the data and just analyze logs which has changed after the last read-in.
	- Problem: chronological order will be out of order!
	- Read in the last x logs and sort out the duplicates.
	- Use vector <string> LogFiles2 for this (other serverlogs)

Plattform compatibility:
	- Specify different logpaths for Windows and Linux (maybe also Mac).
*/