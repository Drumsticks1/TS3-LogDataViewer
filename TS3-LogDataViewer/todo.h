// todo.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

/*
general (sorted by priority):
	- finish the ServerGroup implementation.
	- add information about the greyed out and green rows.
	- add a button for sorting after the connected state and remove the "connected" column afterwards.
	- add warning for true DEBUGGINGXML constant to the js.
	- move (at least the duplicate) checkFunctions into the checked classes.
	- add server groups to the client table (with the date of the assignment).
	- add button for resetting the sort orders. (for mobile devices without CTRL).
	- add button for switching between bantime in seconds and bantime in x.

Bans: Currently only includes the bans that kicked the banned client (= the banned client had to be online when he got banned).
	- add custom bans.

maybe:
	- add ServerGroupName history like for the nicknames in the client list.
	- add additional optional ignore files for the tables.
	- limit rebuilds on serverside, maybe add cron.
	- add query clients to client list or a query client list?
	- make it possible to switch between the virtual servers via Webinterface.
		- check what virtual servers are / were running by observing the logs filename endings.
	- create a standalone using electron with access to the server logs or with local logs.
*/
