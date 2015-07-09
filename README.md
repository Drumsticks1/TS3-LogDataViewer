# TS3_EnhancedClientList
Enhanced Client List for Teamspeak3 Server.

## Short description
TS3_EnhancedClientList creates an enhanced client list using the information written to the logfiles of the server.<br />
It currently provides three detailed tables that can be included in an existing website or be used with the provided Webinterface.html:
- Client list
- Kick list 
- File upload List

## How does it work ?
The program needs the logfiles of the teamspeak3 server (logging has to be enabled in the server settings, checking all logging options is recommended).<br />
The logfiles are analyzed and the relevant information that can be found in the logmessages (e.g. Nicknames and IPs) is collected.<br />
After all logfiles are parsed a XML file is created which then is used to display the tables in the Webinterface or in your custom webpage.

## Current Features
### Multiple tables
- Client List
- Kick List
- File upload List

### Custom implemention or provided Webinterface
You can either use the provided Webinterface.html or implement the control section and the different tables into you existing website (see "Install Instructions").

#### Control Section
- Reload the Table via a button.
- Complete rebuild of the XML via a button (useful when changing log directories or after an failed database migration).
- Timestamps of the XML creation (local time of the server and UTC).
- Count of currently connected clients.
- Scroll to the client table position of an ID.
- Scroll to the beginning of a table via a button (e.g. "Scroll to kick list").
- Scroll back to top.

#### Client table layout and features
ID | Nicknames | Connections | IPs | Connected | Deleted
---|---|:---:|:---:|---|---
3  | Drumsticks<br />TotallyNotDrumsticks<br />Drumsticks (AFK)<br />Teamspeakuser | + -<br />2015-24-06 23:11:02<br />2013-03-11 19:46:07 | + -<br />88.888.888.75<br />99.999.999.31 | True | False

- Chronological Nickname history.
- Last and first connection time.
- Last and first IP.
- Expanding and Collapsing the Connections list and the IPs list (to a chronologial list of all connections / IPs | back to the last and the first connections / IPs).
- Connected flag which shows if the user is currently connected.
- Deleted flag which shows if the user got deleted (only works if this is logged).

#### Kick table layout
Date and Time | Kicked User (ID) | Kicked User (Nickname) | Kicked by (Nickname) | Kicked by (UID) | Reason
---|---|---|---|---|---
2015-04-23 15:22:39 | 285 | TrollingTrollUser | Drumsticks | XXXXXXXXXXXXXXXXXX= | Trolling

#### File upload table layout
Upload DateTime | Channel ID | Filename | Uploaded by (Nickname) | Uploaded by (ID)
---|---|---|---|---|---
2015-07-09 19:17:58 | 2 | /file_sample.txt | Drumsticks | 3
2015-07-09 19:18:18 | 2 | /directory_sample/file_sample.txt | Drumsticks | 3


### Program Features
- You can manually create a logignore and list the logfiles (one each line) taht you want to be ignored (e.g. invalid logs as result of a messed up database migration following a backup reset).
- In order to save time the program uses the information from the last created XML instead of parsing all logs again.

### Planned Features
See the todo.h for planned features.

###It does not contain:
- Any information which isn't logged.
- Detection of Nickname changes while connected (but the new nickname is added to the list when disconnecting with a new nickname).

## Installation
As the file name already implies, the install instructions can be found in the file "Install Instructions".
For now there are only installation instructions available for Linux.<br />
Experienced Users should be able to set it up on Windows / Mac by following the Linux steps.

### Dependencies
All dependencies are covered in the install instructions.<br />
You will need to downloads the jquery plugin ["tablesorter"](http://tablesorter.com) if you use a precompiled version of TS3_EnhancedClientList.
You will also need to download the packages "libboost-filesystem1.55.0" and "libboost-program-options1.55.0" (you may need to update the version numbers).

#### Teamspeak3 server settings
Logging of Clients and File transfer must be enabled in the server settings as the program depends on this information.
It is recommended to tick all the checkboxes in the server options.