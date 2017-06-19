# Changelog
Versions: <a href="#v2.1.1">2.1.1</a> | <a href="#v2.1.0">2.1.0</a> | <a href="#v2.0.8">2.0.8</a> | <a href="#v2.0.7">2.0.7</a> | <a href="#v2.0.6">2.0.6</a> | <a href="#v2.0.5">2.0.5</a> | <a href="#v2.0.4">2.0.4</a> | <a href="#v2.0.3">2.0.3</a> | <a href="#v2.0.2">2.0.2</a> | <a href="#v2.0.1">2.0.1</a> | <a href="#v2.0.0">2.0.0</a> | <a href="#v1.x.x">1.0.0 - 1.7.3.1</a>

### <a name="v2.1.1">Version 2.1.1</a> (next release)
Changes:
- Javascript code:
    - Migrated to ECMAScript 6
    - Replaced occurrences of
      - <code>string.substring(a,b)</code> with <code>string.slice(a,b)</code>
      - <code>string.charAt(x)</code> with array-like <code>string[x]</code> indexation
      - comparisons of <code>string.indexOf(str)</code> with <code>-1</code> with the usage of <code>string.includes(str)</code>
    - Server-Side:
      - Renamed the old parser methods in nodejs/parsers/*.js that extract and return the parsed data from the message of a log line from parseX() to parseMessageX()
      - Moved the parser actions from nodejs/Parser.js into the nodejs/parsers files, naming example of the methods: parsers.client.parseConnect()


### <a name="v2.1.0">Version 2.1.0</a> (17.06.2017)
Changes:
- Modified project structure:
    - Local files (conf.json, output.json, ts3-ldv logs (unless specified otherwise)) are now stored in the TS3-LogDataViewer/local folder

- Javascript code:
    - Replaced in-/equality checks with strict in-/equality checks (== --> ===, != --> !==)
    - Added .editorconfig for unified code style settings

- Client-Side app:
    - Refactored code from TS3-LogDataViewer.js into multiple modules
    - Tables and their occurrences in control sections are now ordered alphabetically
    - Functions are now rather working on modules and their attributes as parameters than on strings that then are modified in order to access objects
    - Removed the constant updating of the moment.js time difference regarding the build time of the json ("x ago"), this now only happens when the tables are build
    - The number of connected Clients is now always calculated in buildTables regardless of the build state of the clientTable
    - Merged the localStorage and sessionStorage data into one json object for each storage type
    - Moved the navbar (now called navBar) out of the controlSection, it is now added directly to the document
    - Removed minimized css files, not really necessary for small files like they are used in this project
    - Replaced the use of .innerHTML with the jquery $(div).text(text) function or .innerText to prevent execution of malicious input
    - Replaced the use of 3rd-party package nanobar with a simple callout that is shown when ts3ldv.tables.build() is in progress
    - Updated foundation.css and style.css for the release

- Server-Side app:
    - Removed obsolete addViaObject methods from the Ban, Channel, Client, Complaint, Kick, ServerGroup and Upload classes
    - Renamed configuration settings:
        - logDirectory --> TS3LogDirectory
    - Added: TS3LogDirectory values without trailing "/" now have a "/" appended at the end
    - Fixed: non-empty TS3LogDirectory directory without valid logs for the selected virtual server not causing fetchLogs.fetchLogs() to log a warn message and return 0

- General:
    - Renamed changelog.md to CHANGELOG.md
    - package.json:
        - Added version restrictions to dependencies and devDependencies for preventing installation of future versions of third party packages that may break parts of this project (now using "^ver" instead of "latest")
        - Updated npm dependency versions 
        - Updated included files
        - Removed dependency nanobar
    - Updated install instructions and renamed the file to INSTALL.md
    - Updated README.md
    - Renamed Todo to TODO.md
    - Renamed conf/ts3.ldv.logrotate to conf/ts3-ldv.logrotate
    - Updated conf/ts3-ldv.logrotate and conf/ts3-ldv.service for better use with the updated install instructions
    - Simplified scripts/generateCss.js


### <a name="v2.0.8">Version 2.0.8</a> (05.08.2016)
Changes:
- README.md: Added a development activity notice.
- Generated the foundation css files for foundation-sites v6.2.3.

Security improvements:
- Restricted access to the socket opened by express on port 3000 to localhost.


### <a name="v2.0.7">Version 2.0.7</a> (09.04.2016)
Additions:
- Added tests for the parsers, using mocha
- Added .gitlab-ci.yml for GitLab Continuous Integration (running the tests)

Changes:
- Reworked parsing
    - Moved the parsing blocks (that are using boundaries objects) from parseLogs.js into new files in the folder nodejs/parsers
    - Moved the part for parsing the filename from Upload.addDeletedBy to parsers/upload.js and modified the code.
    - parseLogs.js --> Parser.js
       - Moved log pattern parsing to the new function parseLogPattern
       - Moved timestamp parsing to the new function parseDateTime
       - Moved the parsing part of the parseLog function into the parseLogData function, the function receives the data
       from a parsed Log as first parameter, calls the parser functions in the parsers folder and uses the extracted data
       - Moved serverGroup creation, deletion, renaming and copying patterns into the match object
       - Updated the Client Deletion section
- Renamed the setting timeBetweenBuilds to timeBetweenRequests
- Updated script 'test' in package.json, now running the mocha tests
- Updated css files for foundation for sites v6.2.1
- Moved nanobar background color setting from TS3-LogDataViewer.js to style.scss (for nanobar v0.4.0)

Fixes:
- ChannelList not being cleared by clearGlobalArrays


### <a name="v2.0.6">Version 2.0.6</a> (27.03.2016)
Fixes:
- conf.json being packed instead of being ignored


### <a name="v2.0.5">Version 2.0.5</a> (27.03.2016)
Additions:
- parseLogs.js
    - Added parsing of query client connects
- Configuration
    - Added new configuration setting "disableLastModificationCheck" (boolean, default: false) that can be set to true for disabling the lastModification check
- TS3-LogDataViewer.js
    - Added a check in the addCallout function to prevent duplicate callouts

Fixes:
- miscFunctions.js
    - Fixed ignoredLogs being reset by the miscFunctions.clearGlobalArrays function


### <a name="v2.0.4">Version 2.0.4</a> (24.03.2016)
Additions:
- TS3-LogDataViewer.js
    - Added a lookup object which is created for the ClientList, the ChannelList and the ServerGroupList making the lookups easy and independent from the order of the entries
    - Manually added the channel lookup entry with the index 0 for the server (containing icons)
- parseLogs.js
    - Now adding a new Channel entry when a file is uploaded to an unknown channelID
    - Added check if a channel already exists before adding it (wasn't necessary before the class changes)
- All classes
    - Added addViaObject functions to all classes, preparation for future database implementation

Changes:
- Changed Indentation of the js code: 4 --> 2 spaces
- fetchLogs.js
    - Improved code structure
- globalVariables:
    - The Logs array now contains objects with the properties logListId, logName, an ignored and a parsed flag
- Classes
    - Changes to classes as preparation for a future database integration
        - Modified classes, for all classes expect the Client class new objects are now added at the end of their list arrays instead of filling the arrays with empty objects and then adding the data to this objects
        - Added and removed several functions
        - Renamed several variables (e.g. ID to clientID in Client.js and parseLogs.js)
        - Modified the order of some function parameters
- TS3-LogsDataViewer.js
    - Renamed the column "Kicked Client ID" to "Kicked ID" and "Kicked Client Nickname" to "Kicked Nickname"

Removals:
- globalVariables
    - parsedLogs, there is now a parsed property in the new Log objects
- checkFunctions.js
    - Removed the isDuplicateLog function, obsolete
- TS3-LogDataViewer.js
    - Removed the getChannelNameById and getServerGroupNameByID functions, obsolete, see the new lookup system.
- miscFunctions.js
    - Removed the resizeFill function, obsolete


### <a name="v2.0.3">Version 2.0.3</a> (15.03.2016)
Additions:
- Added logLevel to Constants, globalVariables and as setting for conf.json - Available values: 0: ERROR | 1: WARN | 2: INFO (default) | 3: DEBUG
- TS3-LogDataViewer.js
    - Added custom filter functions for the Connections and IPs columns, now filtering through all connections and ips (processing json instead of cell content)
    - Set filter_searchDelay to 0 (was 300 by default) for all tables
- log.js (former outputHandler.js)
    - Added parameters logLevel and alreadyProcessed to the log function
    - Added the log functions error, warn, info and debug to the module exports, they call the log function with the according logLevel
    - Added utc timestamps to each message logged to the program log.

Changes:
- Updated several log messages
- Renamed outputHandler.js to log.js and redesigned logging
    - Renamed the output function to log and moved it out of the module exports of log.js
    - Now buffering log messages until the programLogfile and the logLevel settings from conf.json are processed
- miscFunctions.js
    - Several changes regarding the time functions
- getConf.js
    - Made resetToDefaultConfiguration local, it's now only called by the getConf function.

Fixes:
- parseLogs.js
    - Fixed match rules only matching logs from virtual server 1
- getConf.js
    - Fixed specified ignoredLogs not being ignored
    - Fixed usedPort setting not being checked and configured in getConf
    - Fixed global variables programLogfile and timeBetweenBuilds not being reset to their Constants value upon calling the resetToDefaultConfiguration function


### <a name="v2.0.2">Version 2.0.2</a> (13.03.2016)
Additions:
- Added extra check if output.json exists before the lastModification checks in order to always build the output.json when it does not exist, regardless of the lastModification check

Changes:
- Updated Readme and install instructions

Fixes:
- Fixed server accepting too frequent requests, was caused by the lastBuild variable not being updated in all possible cases


### <a name="v2.0.1">Version 2.0.1</a> (13.03.2016)
Changes:
- Modified the way of accessing the ts3-ldv package installed with npm
- Updated install instructions, especially the nginx configuration template


### <a name="v2.0.0">Version 2.0.0</a> (13.03.2016)
There were 75 commits between v1.7.3.1 and v2.0.0 with (according to git) more than 5500 additions and almost 3400 deletions.

Some changes between this two versions may have been overlooked as there were many big changes, especially the rewrite
from c++ to (node)js as well as structural adjustments.

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
    - Added the setFilterPlaceholders function that sets the placeholder text for the tablesorter filter cells of the given table according to their column titles
    - Added the addPagerSection function that adds a pager section to the given control section
    - All tables
        - Added tablesorter filter widget
        - Added tablesorter pager plugin
    - Client Table
        - Added Server groups column containing server groups of the client and the dateTime of assignment (most recent date when assigned to a group multiple times)
        - Added description section for colored rows
        - Rows with connected clients now have a green colored background
        - Rows with deleted clients now have a grey colored background
    - Upload Table
        - Added Channel name column - now you can see where the upload is instead of checking all channels ;)
        - Rows with deleted clients now have a grey colored background
    - Control Section
        - Added the "Reset table sorting" button for resetting the sorting of all tables (especially for mobile devices without CTRL + left click)
- index.html:
    - Added calloutDiv
- Added package.json for npm
- Added foundation.scss and style.scss
- Added generateCss.js, script for generating uncompressed and minified css files out of style.scss and foundation.scss
- Added foundation.css, foundation.min.css and style.min.css
- Added folder conf with this files:
    - default-conf.json as default template for a conf.json file
    - ts3-ldv.service as a systemd service script template
    - ts3-ldv.logrotate as a logrotate configuration template
- Added changelog.md

Changes:
- Added support for the new file transfer logging introduced in 3.0.12.0
- Rewrote the server-side code from c++ to (node)js
    - Files that are not mentioned in the Removals section were renamed from fileName.cpp to fileName.js and the code was rewritten into javascript
- Renamed multiple variables and functions
- Started documentation with JSDoc
- using strict mode in all js files
- Client.js
    - Renamed DateTime to Connections (also for any occurrences in other files)
- Constants.js
    - Renamed the XMLFILE, PROGRAMLOGFILE, DEFAULTLOGDIRECTORY and DEFAULTVIRTUALSERVER constants
- parseLogs.js
    - Renamed multiple constants and variables
    - Replaced function-global variables in the parseLogs function with local variables
    - Replaced startPos and endPos variables with the boundaries object that stores this data
    - Replaced messy substring parsing with the standard method getSubstring that uses the data stored in the boundaries object
    - The isMatchingLogOrder check is only run if bufferData is set to true
    - Modified way to iterate through the file data (more memory efficient)
    - Optimized parsing (including, not limited to:)
        - Separated else if structure into VirtualServer and VirtualServerBase switch.
- css in general
    - Now generating css via generateCss.js out of style.scss and foundation.scss
    - Added asc.png, bg.png and desc.png as base64 data string to style.(s)css
    - Multiple style changes
- index.html
    - Updated dependency links (linking to node_modules subdirectories containing the dependencies).
- TS3-LogDataViewer.js (client-side)
    - Replaced all single quotes around strings with double quotes
    - Replaced the xml interactions with json interactions
    - Replaced the rebuildXML with the buildJSON function that interacts with the server-side app using express behind a nginx proxy
        - Only sends requests if the time since the last request is at least timeBetweenBuilds
        - Requests are only allowed when none are in progress
        - The tables are just rebuild when the data has changed since the last build (check is ignored for "Build JSON without buffer" calls)
            - This rule only applies to requests that don't have the clearBuffer flag set to true
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
- Updated gh-pages to the newest version (removed old branch and added a fresh one)
- Updated .gitignore, README and install instructions

Removals:
- Removed obsolete class functions (mostly getters)
- Constants.js:
    - Removed LOCKFILEEXPIRATION and SKIPLOCKFILE as the lockfile functionality is obsolete
- Removed TS3-LogDataViewer.cpp (see buildJSON.js for similar functionality)
- Removed createXML.cpp and createXML.h (see createJSON.js for similar functionality)
- Removed customStreams.h (was used for creating a logging stream to the console and the logfile, see outputHandler.js for similar functionality)
- fetchLogs.js
    - Removed logignore functionality, ignored logs are now specified in conf.json
- Removed parseXML.cpp and parseXML.h as this functionality is obsolete, buffering the data is far more efficient
- Removed timeFunctions.cpp and timeFunctions.h (see miscFunctions for similar functionality)
- Removed todo.h (see Todo)
- Removed deleteXML.php and rebuildXML.php
- Removed asc.png, bg.png, desc.png (see changes, section css)
- TS3-LogDataViewer.js (client-side)
    - Removed the localStorageAndTableCheckboxListener function
    - Removed the addExpandCollapseConnectionsButton and the addExpandCollapseIPsButton functions, they were only called once
    - Client Table
        - Removed deleted column, obsolete
- Removed makefile, obsolete
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
