# TS3_EnhancedClientList
Enhanced Client List for Teamspeak3 Server.

## Short description
TS3_EnhancedClientList creates an enhanced client list using the information written to the logfiles of the server.<br />
This information can be accessed by the Webinterface.

## How does it work ?
The program only needs the logfiles of the teamspeak3 server (logging of clients has to be enabled).<br />
It analyzes the logfiles for connect and disconnect messages (including kicks and bans) and collects the information that can be found in this messages (e.g. Nicknames and IPs).<br />
After all logfiles were parsed a XML file is created which then is fetched by the Webinterface in which the more detailed user list is displayed as a table.

## Current Features
### Webinterface Features
- Reloading the Table via a button in the Webinterface.
- Complete rebuild of the XML via a button in the Webinterface (useful when changing log directories or after an failed database migration).
- A local time (of the server) timestamp and an UTC timestamp of the last XML creation/update.
- The count of currently connected clients.
- Scrolling to the table position of an chosen ID.

#### Short table layout example
	ID | Nicknames | Connections | IPs | Connected | Deleted
	---|---|:---:|:---:|---|---
	2  | Drumsticks<br />TotallyNotDrumsticks<br />Drumsticks (AFK)<br />Teamspeakuser | + -<br />24.06.2015 23:11<br />11.03.2013 19:46 | + -<br />88.888.888.75<br />99.999.999.31 | True | False

### Table Features
- A chronological Nickname history.
- The last and the first connection time.
- The connection list can be expanded to a chronologial list of all connection (and collapsed after).
- The last and the first IP.
- The IP list can be expandedand collapsed like the connection list.
- A Connected flag which shows if the user is currently connected.
- A Deleted flag which shows if the user got deleted (only works if this is logged).

### Program Features
- You can manually create a logignore and list the logfiles (one each line) taht you want to be ignored (e.g. invalid logs as result of a messed up database migration following a backup reset).
- In order to save time the program uses the information from the last created XML instead of parsing all logs again.

###It does not contain:
- Detection of Nickname changes while connected (but the new nickname is added to the list when disconnecting with a new nickname).
- Unique Teamspeak3 IDs.

## Example
Coming soon...

## Installation
As the file name already implies, the install instructions can be found in the file ["Install Instructions"](https://github.com/Drumsticks1/TS3_EnhancedClientList/blob/master/Install%20Instructions)<br />
For now there are only installation instructions available for Linux.<br />
Experienced Users should be able to set it up on Windows / Mac by following the Linux steps.

### Dependencies
All dependencies are covered in the install instructions.<br />
You will only need to downloads the jquery plugin ["tablesorter"](http://tablesorter.com) if you use a precompiled version of TS3_EnhancedClientList.

#### Teamspeak3 server settings
Logging of Clients must be enabled in the server settings as the program depends on this information.