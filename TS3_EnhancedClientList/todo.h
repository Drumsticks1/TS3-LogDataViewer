/* Todo:

general
	- find and sort out old IDs for the same person or merge them, or:
	- Maybe later: Compare actual database with the IDs and gray out / delete the deleted IDs.
	- maybe sort the UserList by ID.
	- Add missing descriptions (found by searching for the [Description pending] tag).
	- Limit to singleinstance.
	- Add try catch handler.

User
	- Change DateTime to Date and Time and maybe include <time.h> later.
		- Maybe add total connection time.
	- Add possibility to ignore IDs (e.g. obsolete ones from old identities).
	- Prevent negative CurrentClientConnects.

parseLogs
	- Outsource functions and/or change loop parameter names for better overview.
	- Extend use of disconnect-messages.

fetchLogs
	- Maybe use ts3server_xxxx-xx-xx__xx_xx_xx.xxxxxx_1 logs for indication if the last logfile has to be read in again (server shutdown).

webinterface
	- Add sorting options.
	- Possibility to hide duplicate Names like Drumsticks1 or Drumsticks11 in the webinterface.
	- Add timer for creation of XML-File (runtime of program) and update table automatically afterwards.
	- Prevent duplicate processes.

Use last xml to read in the data and just analyze logs which has changed after the last read-in.
	- Problem: chronological order will be out of order!
	- Read in the last x logs and sort out the duplicates.
	- Use other serverlogs for this.

Plattform compatibility
*/