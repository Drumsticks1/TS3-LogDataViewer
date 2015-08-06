# TS3_EnhancedClientList
Enhanced Client List for Teamspeak3 Server.

## Short description
TS3_EnhancedClientList creates an enhanced client list using the information written to the logfiles of the server.<br />
It currently provides three detailed tables that can be included in an existing website or be used with the provided Webinterface (index.html):
- Client list
- Ban list
- Kick list 
- File upload list

## How does it work ?
The program needs the logfiles of the TS3 server (logging has to be enabled in the server settings - enabling all logging options is recommended).<br />
The logfiles are analyzed and the relevant information from the logmessages (e.g. Nicknames and IPs) is collected.<br />
After all logfiles are parsed a XML file is created which then is used for displaying the tables in the Webinterface or in your custom webpage.

## Current Features
### Multiple sortable tables
- Client List
- Ban List
- Kick List
- File upload List

### Custom implemention or provided Webinterface
You can either use the provided Webinterface (index.html) or implement the control section and the different tables into you existing website (see "Install Instructions").

#### Control Section
- Reload the Table via a button.
- Complete rebuild of the XML via a button (useful when changing log directories or after an failed database migration).
- Timestamps of the XML creation (local time of the server and UTC).
- Count of currently connected clients.
- Scroll to the client table position of an ID.
- Collapse all extended lists.
- Switch between sorting by first or last Connections.
- Navbar fixed at the bottom of the page which contains the following buttons (scroll buttons of unused tables won't appear):
	* Scroll back to top
	* Scroll to control section
	* Scroll to client table
	* Scroll to ban table
	* Scroll to kick table
	* Scroll to upload table

#### Client table layout and features
ID | Nicknames | Connections | IPs | Connections Count | Connected | Deleted
---|---|:---:|---|---|---|---
3  | Drumsticks<br />TotallyNotDrumsticks<br />Drumsticks (AFK)<br />Teamspeakuser | ( + 34 ) <br/ >2015-24-06 23:11:02<br />2013-03-11 19:46:07 | ( + 6 )<br />88.888.888.75 | 36 |true | false
4  | Random User | 2015-18-07 15:11:02<br />2015-18-07 13:56:25 | 99.999.999.31 | 2 | false | false
5  | Teamspeakuser | ( - 1 )<br />2015-05-08 16:06:31<br />2015-05-08 10:13:54<br />2015-05-08 09:34:12 | ( - 1 )<br />12.345.678.90<br />217.000.000.000 | 3 | false | false

- Chronological nickname history without duplicates.
- Last and first connection time.
- Last IP.
- Expanding and Collapsing the Connections and the IPs list (expanding to a chronologial list of all connections / IPs | collapsing back to the last and the first connections / the last IP).
	- The button shows how many entries will be shown / hidden.
- Connected flag which shows if a user is currently connected.
- Deleted flag which shows if the user got deleted (only works if this is logged --> user must be deleted while the server is running).

#### Ban table layout
Date and Time | Banned User (ID) | Banned User (Nickname) | Banned by (Nickname) | Banned by (InvokerID) | Banned by (UID) | Reason | Bantime
---|---|---|---|---|---|---|---
2015-07-28 13:32:32<br />(about 3 hours ago) | Drumsticks-Test | 12 | 3 | Drumsticks | XXXXXXXXXXXXXXXXXX= | Testban | 1800

#### Kick table layout
Date and Time | Kicked User (ID) | Kicked User (Nickname) | Kicked by (Nickname) | Kicked by (UID) | Reason
---|---|---|---|---|---
2015-04-23 15:22:39<br/>(about three months ago) | 285 | TrollingTrollUser | Drumsticks | XXXXXXXXXXXXXXXXXX= | Trolling

#### File upload table layout
Date and Time | Channel ID | Filename | Uploaded by (Nickname) | Uploaded by (ID)
---|---|---|---|---|---
2015-07-09 19:17:58<br />(about 4 days ago) | 2 | /file_sample.txt | Drumsticks | 3
2015-07-09 19:18:18<br />(about 4 days ago) | 2 | /directory_sample/file_sample.txt | Drumsticks | 3

### Overall Program Features
- You can manually create a logignore and list the logfiles (one each line) that you want to be ignored (e.g. invalid logs as result of a messed up database migration following a reset to the last backup state).
- In order to save time the program uses the information from the last created XML instead of parsing all logs again.
- Lockfile: Only one instance of the program can run at once.
	- If a lockfile is older that 5 minutes it is deleted when running the program.<br />This prevents problems caused by lockfiles remaining when the program is terminated manually / an uncaught exception occurs.

### Planned Features
See the todo.h for planned features.

### It does not contain and never will
- Any information that isn't logged (e.g. nickname changes while connected, but the new nickname still is added to the list when disconnecting).

## Installation
As the file name already implies, the install instructions can be found in the file "Install Instructions".<br />
For now there are only installation instructions available for Linux.<br />
Experienced Users should still be able to set it up on Windows by following the Linux steps (I can't provide support for Mac as I didn't yet work with it, but this may change in the future).

### Dependencies
All dependencies are covered in the install instructions.<br />
You will need to download the following extern files:
- One file for jquery:
	- [jquery-latest.min.js](http://code.jquery.com/jquery-latest.min.js)
- Two files from [this fork](http://mottie.github.io/tablesorter/docs/) for the jquery plugin "tablesorter":
	- [jquery.tablesorter.min.js](http://mottie.github.io/tablesorter/dist/js/jquery.tablesorter.min.js)
	- [jquery.tablesorter.widgets.js](http://mottie.github.io/tablesorter/js/jquery.tablesorter.widgets.js)
- One file for the loading bar:
	- [nanobar.min.js](http://raw.githubusercontent.com/jacoborus/nanobar/master/nanobar.min.js)
- One file for moment.js:
	- [moment.min.js](http://momentjs.com/downloads/moment.min.js)
- On UNIX systems: the UNIX packages "libboost-filesystem1.55.0" and "libboost-program-options1.55.0" (you may need to adjust the version numbers) (There seems to be no need for this on Windows).

#### Teamspeak 3 server settings
Logging of Clients and File transfer must be enabled in the server settings as the program depends on this information. <br />
It is recommended to enable all logging options in the server options.

## Support
If there are any problems, improvement suggestions or feature requests feel free to open an Issue on Github.
