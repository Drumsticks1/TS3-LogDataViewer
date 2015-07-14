/* Todo:
general
	- add userignore and make it possible to add IDs via the Webinterface.
	- add kickignore and make it possible to add kicks via the Webinterface.
	- add fileignore and make it possible to add files via the Webinterface.
	- optimize the code for faster performance.

Bans:
	- postponed.

parseLogs
	- Change finding of the Virtual Server messages according to servers with multiple virtual servers.
		How many virtual servers are possible ?

TS3_EnhancedClientList.js
	- Add button for collapsing all expanded lists.
	- Add custom parser for Nicknames, Connections and IPs (multi line).
	- Add support for different timezones with moment.js and/or moment-timezone.js
		- Get timezone offset by comparing UTC and server localtime timestamps.
		- Add possibility to display all DateTimes in the UTC format.
	- Add short online list (ID, lastNickname).
	- Add offset at the end of the last table to ensure that the last table lines are not hidden after the navbar.
*/
