// deleteXML.php
// Author : Drumsticks1
// GitHub : https://github.com/Drumsticks1/TS3-LogDataViewer

<?php
	// Your LogDataViewer directory - please modify the path according to your system.
	$LDVDIRECTORY = "/var/www/LogDataViewer";
		
	if(file_exists("$LDVDIRECTORY/output.xml")){
	exec("rm $LDVDIRECTORY/output.xml");
	}
 ?>
