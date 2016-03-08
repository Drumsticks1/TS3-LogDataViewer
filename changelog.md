# Changelog
Versions: <a href="#v2.0.0">2.0.0</a> | <a href="#v1.x.x">1.0.0 - 1.7.3.1</a>

### <a name="v2.0.0">Version 2.0.0</a> (??.03.2016)
There were more than 60 commits between v2.0.0 and v1.7.3.1 with more than 5500 code line additions and 3400 deletions.

Some changes between this two versions may have been overlooked as there were many big changes, especially the rewrite
from c++ to (node)js as well as structural adjustments.

<br>

Additions:
- Client.js
    - Added ServerGroupIDs and ServerGroupAssignmentDateTimes
    - Added addServerGroup, removeServerGroupByID, getServerGroupIDCount and getServerGroupIDByID functions
- Constants.js
    - Added confJSON, bufferData, timeBetweenBuilds and usedPort constants
- checkFunctions.js
    - Added isDuplicateServerGroup function
- parseLogs.js
    - Added parsing of server group events
        - Creation of a server group
        - Renaming of a server group
        - Deletion of a server group
        - Client assignments to a server group
        - Client removals from a server group
    - Added parsing of channel events (currently only used in the upload table)
        - Creation of a channel
        - Edit of a channel
        - Deletion of a channel
    - Added resetBoundaries function for resetting the boundaries object
- Added Channel.js, class for storing channel data
- Added ServerGroup.js, class for storing server group data
- Added app.js, part of the server-side app that is running all the time, executes several commands on the startup and listens for requests from the client
- Added buildJSON.js, is called when a json build is requested and coordinates the build process from fetching the logs to creating the JSON
- Added createJSON.js, creates the output.json with the data stored in globalVariables
- Added getConf.js, fetches, processes and applies the settings from the conf.json
- Added globalVariables.js, storing all the persistent data including configuration settings
- Added miscFunctions.js, multiple functions
    - Added resizeFill function, similar to the C++ push_back function
    - Added multiple time functions for setting and getting time values
    - Added clearGlobalArrays function for clearing the data in globalVariables (excluding configuration settings)
    - Added resetConnectedStates function for resetting the connectedState variables for each client
- Added outputHandler.js for creating a writeStream and writing to it (used for the program log)
- TS3-LogDataViewer.js (client-side)
    - Added a constants section for strings that are used multiple times.
    - Added the updateTimeBetweenBuilds function.
    - Added the addCallout function for displaying messages instead of using the unhandy alert function
    - Added the addOnClickEvent function that adds an onclick event to an object and adds the object to the eventListeners array
    - Added the removeEventListeners function that destroys all onclick listeners that are listed in the eventListeners array
    - Added the getServerGroupNameByID function that returns the server group name for the given ID (the ID of the server group)
    - Added the getChannelNameByID function that returns the channel name for the given ID (the ID of the channel)
    - Added the resetSorting functions that resets the sorting of all tables
    - Added the setFilterPlaceholders function that sets the placeholder text for the tablesorter filter cells of the given table according to their column name
    - Added the addPagerSection function that adds a pager section to the given control section
    - All Tables
        - Added tablesorter filter widget
        - Added tablesorter pager plugin
    - Client Table
        - Added Server groups column containing server groups of the client and the dateTime of assignment
        - Added description section for colored rows
        - Connected clients now have a green colored background
        - Deleted clients now have a green colored background
    - Upload Table
        - Added Channel name column - now you can see where the upload is instead of checking all channels ;)
        - Deleted clients now have a green colored background
    - Control Section
        - Added the "Reset table sorting" button for resetting the sorting of all tables
- Added package.json for npm
- Added foundation.scss and style.scss
- Added generateCss.js, script for generating uncompressed and minified css files out of style.scss and foundation.scss
- Added foundation.css, foundation.min.css and style.min.css
- Added folder conf with this files:
    - conf.json as (default) template for a conf file
    - ts3-ldv.server as a systemd service script template
    - ts3-ldv.logrotate as a logrotate configuration template
- Added changelog.md

<br>

Changes:
- Rewrote the server-side code from c++ to (node)js
    - Files that are not mentioned in the Removals section were renamed from fileName.cpp to fileName.js and the code was rewritten to js
- Renamed multiple variables and functions
- Started documentation with JSDoc
- Client.js
    - Renamed DateTime to Connections (also for any occurrences in other files)
- Constants.js
    - Renamed the XMLFILE, PROGRAMLOGFILE, DEFAULTLOGDIRECTORY and DEFAULTVIRTUALSERVER constants
- parseLogs.js
    - Renamed multiple constants and variables
    - Replaced function-global variables with local variables
    - Replaced startPos and endPos variables with the boundaries object that stores this data
    - Replaced messy substring parsing with the standard method getSubstring that uses the data stored in the boundaries object
    - The isMatchingLogOrder check is only run if bufferData is set to true
    - Modified way to iterate through the file data (more memory efficient)
- css in general
    - Now generating css via generateCss.js out of style.scss and foundation.scss
    - Added asc.png, bg.png and desc.png as base64 data string to style.(s)css
    - Multiple style changes
- index.html
    - Updated dependency links.
    - Added calloutDiv.
- TS3-LogDataViewer.js (client-side)
    - using strict mode
    - Replaced all single quotes around strings with double quotes
    - Replaced the xml interactions with json interactions
    - Replaced the rebuildXML with the buildJSON function that interacts with the server-side app using express behind proxies
        - Only sends requests if the time since the last request is at least timeBetweenBuilds
        - Requests are only allowed when none are in progress
        - The tables are just rebuild when the data has changed since the last build
    - Modified the functions for collapsing and expanding lists
    - Replaced the addIgnoreMomentParser, addConnectionsParser and addIPsParser with the addCustomParsers function that is only called once on the page load
    - Modified the switchBetweenIDAndUID function
    - Modified the addTableCheckboxListener function
    - Modified the dateTime converting functions
    - Modified the buildTableWithAlertCheckAndLocalStorage function
    - Modified the buildTables function
    - Modified the buildControlSection function
- All dependencies are now automatically installed by npm
    - Updated from foundation 5 to foundation 6
- Updated .gitignore, README and Install Instructions

<br>

Removals:
- Removed obsolete class functions (mostly getters)
- Constants.js:
    - Removed LOCKFILEEXPIRATION and SKIPLOCKFILE as the lockfile functionality is obsolete
- Removed TS3-LogDataViewer.cpp (see buildJSON.js for a similar functionality)
- Removed createXML.cpp and createXML.h (see createJSON.js for a similar functionality)
- Removed customStreams.h (was used for creating a logging stream to the console and the logfile, see outputHandler.js for a similar functionality)
- fetchLogs.js
    - Removed logignore functionality, ignored logs are now specified in conf.json
- Removed parseXML.cpp and parseXML.h as this functionality is obsolete, buffering is far more efficient
- Removed timeFunctions.cpp and timeFunctions.h (see miscFunctions for a similar functionality)
- Removed todo.h (see Todo)
- Removed deleteXML.php and rebuildXML.php
- Removed asc.png, bg.png, desc.png (see changes, css)
- TS3-LogDataViewer.js (client-side)
    - Removed the localStorageAndTableCheckboxListener function
    - Removed the addExpandCollapseConnectionsButton and the addExpandCollapseIPsButton functions, they were only called once in the code
    - Client Table
        - Removed deleted column, obsolete
- Removed makefile
- Removed need to download dependencies manually, praise npm!


## <a name="v1.x.x">The following versions are 1.x.x versions (before the rewrite from c++ to (node)js)</a>
Versions: <a href="#v1.7.3.1">1.7.3.1</a> | <a href="#v1.7.3">1.7.3</a> | <a href="#v1.7.2">1.7.2</a> | <a href="#v1.7.1">1.7.1</a> | <a href="#v1.7.0">1.7.0</a> | <a href="#v1.7.0">1.6.1</a> | <a href="#v1.6.0">1.6.0</a> | <a href="#v1.5.0">1.5.0</a> | <a href="#v1.4.0">1.4.0</a> | <a href="#v1.3.1">1.3.1</a> | <a href="#v1.3.0">1.3.0</a> | <a href="#v1.2.0">1.2.0</a> | <a href="#v1.1.0">1.1.0</a> | <a href="#v1.0.0">1.0.0</a>


### <a name="v1.7.3.1">Version 1.7.3.1</a> (03.10.2015)
- Fixed parsing error for "You received too many complaints" bans.


### <a name="v1.7.3">Version 1.7.3</a> (03.10.2015)
##### Changes
- Outsourced the functions adding the onclick functions out of buildClientTable().
- The deleted flags for Uploads are now only written to the XML if the Upload was deleted.
- Updated favicon.

##### Fixes
- Fixed bug which occurred when the client table wasn't displayed.
- Fixed parsing for kicks where the client was kicked by a serveradmin (= no real UID).
- Fixed switching between IDs and UIDs for the ban table.


### <a name="v1.7.2">Version 1.7.2</a> (02.10.2015)
- Renamed the project from TS3_EnhancedClientList to TS3-LogDataViewer.

##### Changes
- Modified parsing of logs and existing XMLs for a better performance.
- Shortened XML node names for a smaller filesize.
- The Connected and the Deleted nodes are now only added to the XML if the client is connected / deleted.

##### Removals
- Removed the Connection_Count nodes from the XML (now calculated in the TS3-LogDataViewer.js).

##### Fixes
- Fixed wrong Connected flag when the same identity is connected more than once.
- Fixed sorting when changing the connections sort direction.


### <a name="v1.7.1">Version 1.7.1</a> (25.09.2015)
- Fixed filename problem occuring on windows.


### <a name="v1.7.0">Version 1.7.0</a> (25.09.2015)
##### Additions
- Added deletedByID and deletedByNickname columns to the uploadTable.
- Added headlines to all tables.
- Added sortOrders and the UIDState to the localStorage (see changes).
- Added function toDoubleDigit().

##### Changes
- Replaced all jquery functions that weren't necessary for tablesorter, foundation and ajax requests with native js for a much better performance.
- Code cleanup with performance improvements.
- The sortOrders and the connectionsSortType are now saved to the localStorage.
- The sortOrders are now applied on the table creation and saved when they are changed.
- Added UIDState to local storage replacing the prior UIDState from the banTable.
- Shortened functions UTCDateStringToLocaltimeString() and UTCDateStringToDate().
- The connections are now left-aligned in the small display layout.
- Updated tablesorter download links.
- Updated todo.

##### Removals
- Removed the functions saveSortOrder() and applySortOrder().
- Removed table examples from the readme (see gh-pages example instead).


### <a name="v1.6.1">Version 1.6.1</a> (17.09.2015)
- Small style changes and fixes.
- Added link to gh-pages example to readme.


### <a name="v1.6.0">Version 1.6.0</a> (16.09.2015)
##### Dependency changes
- Now using the front-end framework Foundation (Please only select "Grid", "Buttons" and "Tables" for the custom download): [Foundation custom download](http://foundation.zurb.com/develop/download.html#customizeFoundation)
- Updated download links for dependencies.

##### Additions
- Implemented tablesorter reflow widget for responsive tables (for displays with a width smaller than 1024px).
- Added possibility to select which tables are built and shown. Using local storage for saving this selection and session storage for the built state of the tables.
- Added favicon.
- Added function buildTableWithAlertCheckAndLocalStorage(table).
- Added warning bar which is displayed when no data for a table is found.
- Added the functions UTCDateStringToDate(dateString) and UTCDateStringToLocaltimeString(dateString) for custom DateTime parsing (increased performance).

##### Changes
- Complete style rework with a responsive web design using foundation.
- Redesigned the folder structure ("css", "img" and "js" folders).
- Moved the .js and .css includes into the index.html.
- Moved the controls for certain tables to the top of this certain tables.
- Improved performance by replacing the jquery functions ".hide()" and ".show()"  with native javascript.
- Improved performance by replacing the moment.js format parsing with a custom DateTime parsing (see Additions).
- Updated table column order (IDs before corresponding Nicknames).
- Replaced the switch for switching between sorting by the first or the last connect with a button.
- Renamed "User" to "Client" and "File" to "Upload".
- Modified the navbar button creation (now all navbar buttons are created in buildControlSection()).
- Shortened navbar button texts.
- Merged many jquery multiline commands to singleline commands.
- Renamed "CurrentConnectionsCount" to "ConnectedState" to prevent mismatching.
- Now writing the deleted flag as integer to the xml.
- Renamed the visual studio project filters from german to english.
- Updated makefile.
- Updated readme and install instructions.

##### Removals
- Removed the "Scroll to ID in the client list" button.
- Removed the "Scroll to control section" button.
- Removed the scrollToDiv(div_ID) function.

##### Fixes
- Fixed the problem with expanding connections when the total count of connections was three.


### <a name="v1.5.0">Version 1.5.0</a> (28.08.2015)
##### Dependency changes
- The unix packages "libboost-system1.55-dev", "libboost-filesystem1.55-dev" and "libboost-program-options1.55-dev" are now only necessary on machines used for compiling.
- (Only relevant for self compiling) now using boost 1.59.0 instead of boost 1.58.0.

##### Additions
- Added complaint table.
- Added parsing of ban rules that are added when a client is banned 'directly' (= via right click menu) and added "Banned IP" and "Banned by ID" to the ban table using the additonal information from this ban rules.
- Added button for switching between the IDs and UIDs in the ban table.
- Added alert that triggers if the debug variable SKIPLOCKFILE is set to true in the current XML.
- Added logging to a log file (ECL.log) using boost tee (syncronous output to the console and the log). The last program run is logged and an UTC and a localtime timestamp are included.
- Added timeFunctions.cpp and timeFunctions.h containing the functions ptimeToString, getCurrentUTC and getCurrentUTC.
- Added a try catch handler for errors occuring while trying to access the parsed xml.
- Added a LOCKFILEEXPIRATION definition to Constants.h.

##### Changes
- Already parsed data is now removed when the xml parsing fails and all ts3 logs are parsed again.
- XMLs are now smaller because of shorter subtree names.
- Redesigned the control section in order to use the available horizontal space.
- Several style changes.
- Several renamings.

##### Removals
- Removed the timeToString function from createXML.
- Removed the "Banned by (InvokerID)" column from the ban table.


### <a name="v1.4.0">Version 1.4.0</a> (19.08.2015)
##### Dependency changes
Updated links can be found in the README.
- Now using jquery version 2.1.4.
- Now using the minimized version of the jquery.tablesorter.widgets.js.

##### Additions
- Added Virtual Server support (still quite untested - first parts were already introduced in the v1.3.1 Hotfix).
- Added program parameter option "virtualserver" which sets the virtual server to the delivered value.
- Added a virtual server variable with 1 as default value to the rebuildXML.php.
- Added default logdirectoy and default virtual server definitions to Constants.h (you can use this if you compile the program yourself or just use the parameter options by editing the rebuildXML.php).
- Added debug option SKIPLOCKFILE for lockfile skipping to Constants.h.

##### Changes
- Now using pugixml instead of boost for much faster xml parsing.
- Massively increased xml creation speed by adding the content directly to the PropertyTree via pointers instead of adding it to another tree and then adding this tree to the PropertyTree.
- Moved the Attributes section to the beginning of the xml.
- The sections are now included by adding divs with the ids (e.g. ``<div id="ts3-control">``) instead of adding divs with classes.
- Updated style.css according to the classes-to-id changes and removed blank lines between rules.
- Updated default log directory to "/home/teamspeak/teamspeak3-server_linux-amd64/logs/" in the rebuildXML.php.
- Removed unneccesary checks inside the User methods getUniqueDateTime, getUniqueNickname and getUniqueIP.
- Made script fetching slightly faster.
- Overall code and text reformatting.

##### Fixes
- Fixed timestamps in expanded lists.
- Fixed multiple typos.


### <a name="v1.3.1">Version 1.3.1</a> (09.08.2015)
- Fixed messed up program parameters.
- The parts of the control section that wouldn't make sense without the client table are now only shown when the client table is existing.


### <a name="v1.3.0">Version 1.3.0</a> (08.08.2015)
- Added button for collapsing all expanded lists to the control section.
- Replaced the old expand / collapse button ( + / - ) with a new button which shows how many entries will be shown additionally / hidden when clicking the button depending on the current button state (e.g. '+ 35' or '- 12' ).
- The connected client count is now also shown when the client table isn't included.
- If the control section isn't included an alert will tell the user to include the control section and no tables will be built.
- Fixed existence checks of divs to prevent errors.
- Removed compiled files from the repository as they will be added as binary files to the releases (beginning with this release).


### <a name="v1.2.0">Version 1.2.0</a> (29.07.2015)
- Added ban table.
- Timestamps in the tables are now displayed in the user's timezone.
- Lockfiles older than 5 minutes are now ignored to make manual deletion after an error unnecessary.
- Fixed problem where the webinterface wouldn't load when there was no output.xml existing.
- Removed unnecessary duplicate checking functions.
- Code Reformatting (Now using VS 15 instead of VS 13).


### <a name="v1.1.0">Version 1.1.0</a> (20.07.2015)
#### Additions
- Added switch to swap between sorting by the first or the last connect.
- Added moment.js to show how long ago the XML was created and how long ago the DateTimes in the kick and the upload table were.
- Added list of required files and their download links to the Install Instructions and the README.
- Added custom parser to make the Connections and the IPs row sortable ignoring the expand/collapse-button.
- Added storage of the current sort order which is applied after a XML reload or a change of the connections sorting type.
- Added modern loading bar (similar to the youtube loading bar).
- Added sticky headers to the tables.

#### Changes
- Complete style refactoring making the webinterface looking much modern.
- Completely refactored the creation of the control sections and the tables.
- The XML isn't rebuild on a page reload anymore but only when using the rebuild buttons.
- Made huge changes to the control sections including a more modern style and a clearer layout.
- The required javascript files except the jquery-latest.min.js are now included in the TS3_EnhancedClientList.js .
- The style.css is now included in the TS3_EnhancedClientList.js .
- Replaced the two expand and collapse button with a single expand/collapse button.
- Replaced the fixed scroll buttons with a modern navbar which includes buttons to scroll to the control section and all tables.
- Now using a fork of the original tablesorter instead of the original tablesorter as it provides more features.
- For better perfomance: Connections and IPs divs are now only created on expansion and not when building the client table.
- Changed the default font-family to 'Open Sans'.
- Only the last IP is shown in the client table instead of the first and the last IP.


### <a name="v1.0.0">Version 1.0.0</a> (10.07.2015)
Initial release, the release message was the complete README:

#### TS3_EnhancedClientList
Enhanced Client List for Teamspeak3 Server.

#### Short description
TS3_EnhancedClientList creates an enhanced client list using the information written to the logfiles of the server.<br>
It currently provides three detailed tables that can be included in an existing website or be used with the provided Webinterface (index.html):
- Client list
- Kick list 
- File upload list

#### How does it work ?
The program needs the logfiles of the ts3 server (logging has to be enabled in the server settings - enabling all logging options is recommended).<br>
The logfiles are analyzed and the relevant information from the logmessages (e.g. Nicknames and IPs) is collected.
After all logfiles are parsed a XML file is created which then is used for displaying the tables in the Webinterface or in your custom webpage.

#### Current Features
#### Multiple tables
- Client List
- Kick List
- File upload List

#### Custom implemention or provided Webinterface
You can either use the provided Webinterface (index.html) or implement the control section and the different tables into you existing website (see "Install Instructions").

#### Control Section
- Reload the Table via a button.
- Complete rebuild of the XML via a button (useful when changing log directories or after an failed database migration).
- Timestamps of the XML creation (local time of the server and UTC).
- Count of currently connected clients.
- Scroll to the client table position of an ID.
- Navbar fixed at the bottom of the page which contains the following buttons (scroll buttons of unused tables won't appear):
	* Scroll back to top
	* Scroll to client table
	* Scroll to kick table
	* Scroll to upload table

#### Client table layout and features
ID | Nicknames | Connections | IPs | Connected | Deleted
---|---|:---:|:---:|---|---
3  | Drumsticks<br>TotallyNotDrumsticks<br>Drumsticks (AFK)<br>Teamspeakuser | + -<br>2015-24-06 23:11:02<br>2013-03-11 19:46:07 | + -<br>88.888.888.75<br>99.999.999.31 | true | false

- Chronological nickname history.
- Last and first connection time.
- Last and first IP.
- Expanding and Collapsing the Connections and the IPs list (expanding to a chronologial list of all connections / IPs | collapsing back to the last and the first connections / IPs).
- Connected flag which shows if a user is currently connected.
- Deleted flag which shows if the user got deleted (only works if this is logged --> user must be deleted while the server is online).

#### Kick table layout
Date and Time | Kicked User (ID) | Kicked User (Nickname) | Kicked by (Nickname) | Kicked by (UID) | Reason
---|---|---|---|---|---
2015-04-23 15:22:39 | 285 | TrollingTrollUser | Drumsticks | XXXXXXXXXXXXXXXXXX= | Trolling

#### File upload table layout
Upload DateTime | Channel ID | Filename | Uploaded by (Nickname) | Uploaded by (ID)
---|---|---|---|---|---
2015-07-09 19:17:58 | 2 | /file_sample.txt | Drumsticks | 3
2015-07-09 19:18:18 | 2 | /directory_sample/file_sample.txt | Drumsticks | 3


#### Overall Program Features
- You can manually create a logignore and list the logfiles (one each line) that you want to be ignored (e.g. invalid logs as result of a messed up database migration following a reset to the last backup state).
- In order to save time the program uses the information from the last created XML instead of parsing all logs again.
- Lockfile: Only one instance of the program can run at once.

#### Planned Features
See the todo.h for planned features.

#### It does not contain and never will
- Any information that isn't logged (e.g. nickname changes while connected, but the new nickname still is added to the list when disconnecting)

#### Installation
As the file name already implies, the install instructions can be found in the file "Install Instructions".<br>
For now there are only installation instructions available for Linux.<br>
Experienced Users should still be able to set it up on Windows / Mac by following the Linux steps.

#### Dependencies
All dependencies are covered in the install instructions.<br>
You will need to downloads the jquery plugin ["tablesorter"](http://tablesorter.com) if you use a precompiled version of TS3_EnhancedClientList. <br>
You will also need to download the packages "libboost-filesystem1.55.0" and "libboost-program-options1.55.0" (you may need to adjust the version numbers).

#### Teamspeak3 server settings
Logging of Clients and File transfer must be enabled in the server settings as the program depends on this information. <br>
It is recommended to enable all logging options in the server options.

#### Support
If there are any problems or improvement suggestions feel free to open an Issue on Github.
