/* Todo:

general
	- find and sort out old IDs for the same person or merge them, or:
	- Maybe later: Compare actual database with the IDs and gray out / delete the deleted IDs.
	- maybe sort the UserList by ID.
	- Connected / Disconnected Flag --> Online status possible
		- Add compatibility to multiple connects before disconnecting (e.g. User and User1 with the same ID).
	- Relative and absolute directory linking. (relative for development and absolute for final version).
	- Add missing descriptions (found by searching for the [Description pending] tag).

User
	- Change DateTime to Date and Time and maybe include <time.h> later.
		- Maybe add total connection time.
	- Add possibility to ignore IDs (e.g. obsolete ones from old identities).

readLogs
	- Extend use of disconnect-messages.

readLogs && checkFunctions
	- Add right order sorting to the duplicate checking functions.

Use last xml to read in the data and just analyze logs which has changed after the last read-in.
*/