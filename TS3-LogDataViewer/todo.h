// todo.h
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

/*
general (sorted by priority):
	- replace the desciption divs with buttons for sorting after the connected and deleted state and remove the "connected" column afterwards.
		- also include a resetSort option.
	- add button for switching between bantime in seconds and bantime in x.
	- move (at least the duplicate) checkFunctions into the checked classes.
	- make the server group data in the client table sortable.
	- outsource the parsing in parseLogs to extra functions.
	- add a ServerGroup table (maybe with rights and so on - would be long-term).
	- expand documentation of the functions.

Bans: Currently only includes the bans that kicked the banned client (= the banned client had to be online when he got banned).
	- add custom bans.

maybe:
	- add ServerGroupName history like for the nicknames in the client list.
	- add additional optional ignore files for the tables.
	- limit rebuilds on serverside, maybe add cron.
	- add query clients to client list or a query client list?
	- make it possible to switch between the virtual servers via Webinterface.
		- check what virtual servers are / were running by observing the logs filename endings.
	- C++ --> nodejs (if, than very very long-term)
	- create a standalone using electron with access to the server logs or with local logs.
*/
