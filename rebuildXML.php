// Author : Drumsticks1
// Github : https://github.com/Drumsticks1/TS3_EnhancedClientList

<?php
	// Directory containing the ts3 logs - please modify the path according to your system.
	// The permissions have to be adjusted - see howto for more information.
	$LOGDIRECTORY = "./logs/";
	
	exec("/var/www/EnhancedClientList/TS3_EnhancedClientList --logdirectory=$LOGDIRECTORY");
?>
