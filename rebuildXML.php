// rebuildXML.php
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3_EnhancedClientList

<?php
	// Directory containing the ts3 logs - please modify the path according to your system.
	// The permissions have to be adjusted - see Install Instructions for more information.
	$LOGDIRECTORY = "/home/teamspeak/teamspeak3-server_linux-amd64/logs/";
	
	// Created EnhancedClientList directory - please modify the path according to your system.
	$ECLDIRECTORY = "/var/www/EnhancedClientList";

	// The default virtual server whose logfiles will be analyzed.
	// Change the virtual server by modifying the following value.
	$VIRTUALSERVER = "1";
	
	// You may need to adjust the path to your EnhancedClientList directory in the following line.
	exec("$ECLDIRECTORY/TS3_EnhancedClientList --logdirectory=$LOGDIRECTORY --virtualserver=$VIRTUALSERVER");
?>
