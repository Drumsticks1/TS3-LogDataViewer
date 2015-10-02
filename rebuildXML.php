// rebuildXML.php
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

<?php
	// Directory containing the ts3 logs - please modify the path according to your system.
	// The permissions have to be adjusted - see Install Instructions for more information.
	$LOGDIRECTORY = "/home/teamspeak/teamspeak3-server_linux-amd64/logs/";
	
	// Your LogDataViewer directory - please modify the path according to your system.
	$LDVDIRECTORY = "/var/www/LogDataViewer";

	// The default virtual server whose logfiles will be analyzed.
	// Change the virtual server by modifying the following value.
	$VIRTUALSERVER = "1";
	
	exec("$LDVDIRECTORY/TS3-LogDataViewer --logdirectory=$LOGDIRECTORY --virtualserver=$VIRTUALSERVER");
?>
