# TODO.md
Author: Drumsticks
<br>
GitHub: https://github.com/Drumsticks1/TS3-LogDataViewer

This todo list is not a binding list of things that will be done, but more a little overview of what I have planned for this project.
<br>
<i>(Italic entries will likely require more time and have a low priority)</i>

- general / server- & client-side
  - check older javascript code for constructs than can be replaced with easier standard methods (e.g. <code>x.substr(a,x.indexOf(b))</code> --> <code>x.slice(a, -4)</code> if always <code>x.indexOf(b) === x.length - 4</code>)
  - rename class variables to be more intuitive (e.g. DateTime --> Timestamp or BanTime --> BanDuration) (includes client-side because of the div names (e.g. cell_BanTime))
  - <i>add ServerGroupName history like for the nicknames in the client list</i>
  - <i>add ServerGroup table (maybe with rights and so on)</i>
  - <i>add Channel table (the data could already be part of the json)</i>
  - <i>check options regarding multiple virtual servers</i>

- server-side code
  - improve logging (define boundaries for the different logging levels, add more logging)
  - parse Ban expiration and deletion and add it to the Ban class
    - currently only includes the bans that kicked the banned client (= the banned client had to be online when he got banned)
    - add custom bans (if they cannot be reconstructed completely: add a simple list with the log lines)
  - (optional) log directory watcher for automatic parsing on log updates - only building of json required when calling buildJSON and no parsing
  - (optional) time timeBetweenBuildsWithoutBuffer for "Build JSON without buffer" (as it results in a higher cpu load)
  
- client-side code
  - outsource the creation of the control sections for the tables
  - clean up style.scss
  - check filter type (e.g regex) compatibility for the Nicknames, Connections, IPs and Server Group column
  - check sorting possibilities for the server group data in the client table
