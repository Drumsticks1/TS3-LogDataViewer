/* Todo:
important:
	- Logging of Clients has to be enabled in Server options !

general
	- Prevent errors when handling files (fstream) - should only occur if files are deleted / made invalid after fetching them.
	- Find out why deleting messages for multiple users are missing in the server logs!

parseXML
	- check if new logfiles were put in between old ones (would mess up the order of entries --> new XML).
	- check if old logfiles were deleted (--> new XML).

parseLogs
	- Outsource functions and/or change loop parameter names for better overview.
	- Change finding of the Virtual Server messages according to servers with multiple virtual servers.
		How many virtual servers are possible ?

webinterface
	- Add button for collapsing all connections.
	- Only show + or - button (according to current state).
	- Optionally add the pager plugin.
	- HTML Responsive Web Design.
*/