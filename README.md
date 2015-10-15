# TS3-LogDataViewer

## Short description
TS3-LogDataViewer creates detailed lists using the data written to the log files of the TeamSpeak3 server. The provided index.html includes a control section and the following tables:
- Client table
- Ban table
- Kick table
- Complaint table
- File upload table

## [Demo](http://drumsticks1.github.io/TS3-LogDataViewer/index.html)
This demo is set up with gh-pages and shows the design as well as all features of the latest release version.<br />As it is set up with gh-pages the rebuild XML options aren't available but you can mess around with all other options.

## How does it work ?
The program requires the log files of the TS3 server (logging has to be enabled in the server settings - enabling all logging options is recommended). The log files are analyzed and the relevant information (e.g. Nicknames and IPs) is collected. After all log files are parsed a XML file is created which then is used for displaying the tables in the web interface or in your custom HTML.

## Current Features
### [Responsive web design](http://www.w3schools.com/html/html_responsive.asp)
The responsive front-end framework was used for a smooth change between various display sizes.
On displays with a width smaller than 1024px the tables are switching to another layout which is optimized for smaller displays.
### Multiple sortable tables
- Client list
- Ban list
- Kick list
- Complaint list
- File upload list

#### Control Section
- Select which tables you want to be built and displayed.
- Update the current XML via a button.
- Generate a new XML via a button (useful when changing log directories or after an failed database migration).
- Timestamps of the XML creation (local time of the server and UTC).
- Count of the currently connected clients.
- Navbar (fixed at the bottom of the page) which contains the following buttons (scroll buttons of unselected tables won't appear):
  - Scroll back to top
  - Scroll to client table
  - Scroll to ban table
  - Scroll to kick table
  - Scroll to complaint table
  - Scroll to upload table

### Overall Program Features
- You can select which tables you want to be built and displayed. This selection is saved to your local storage.
- You can sort the tables and this sort order is saved to your local storage (this includes the sort type of the connections (= sort by the last or the first connects)).
- You can change the virtual server whose logs will be analyzed by adjusting the value of  the VIRTUALSERVER variable in the rebuildXML.php.
- You can manually create a logignore and list the log files (one each line) that you want to be ignored (e.g. invalid logs as result of a messed up database migration following a reset to the last backup state).
- In order to save time the program uses the information from the last created XML instead of parsing all logs again.
- Lockfile: Only one instance of the program can run at once.
  - If a lockfile is older that 5 minutes it is deleted when running the program.<br />This prevents problems caused by lockfiles remaining when the program is terminated manually / an uncaught exception occurs.
- Log file containing the console output of the last program run.

### Planned Features
See the latest todo.h for planned features.

### It does not contain and never will
Any information that isn't logged.

## Installation
As the file name already implies, the install instructions can be found in the file "Install Instructions".<br /> For now there are only installation instructions available for Linux but experienced users should still be able to set it up on Windows by following the Linux steps (I can't provide support for Mac as I didn't yet work with it, but this may change in the future).<br /><br/> NOTE: Compiled files for Linux and Windows can be downloaded via the release tab on GitHub since v1.3.0 (TS3-LogDataViewer.gz for Linux and TS3-LogDataViewer.exe.gz for Windows).

### Dependencies
All dependencies are covered in the install instructions.<br /> You will need to download the following external files:
- jQuery:
  - [jquery-2.1.4.min.js](https://code.jquery.com/jquery-2.1.4.min.js)
- Two files from [this fork](https://mottie.github.io/tablesorter/docs/) for the jquery plugin "tablesorter":
  - [jquery.tablesorter.min.js](https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.5/js/jquery.tablesorter.min.js)
  - [jquery.tablesorter.widgets.min.js](https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.23.5/js/jquery.tablesorter.widgets.min.js)
- One file for the loading bar:
  - [nanobar.min.js](https://cdnjs.cloudflare.com/ajax/libs/nanobar/0.2.1/nanobar.min.js)
- One file for moment.js:
  - [moment.min.js](https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js)
- The front-end framework Foundation (Please only select "Grid", "Buttons" and "Tables" for the custom download):
  - [Foundation custom download](http://foundation.zurb.com/develop/download.html#customizeFoundation)

#### Teamspeak 3 server settings
It is recommended to enable all logging options in the server options.<br />
Otherwise you can enable the logging options according to the tables you use (e.g. complaints have to be logged for the complaint table).

## Support
If there are any problems, improvement suggestions or feature requests feel free to open an Issue on GitHub.
