<?php
	$con = mysql_connect("localhost","root","1234");
	mysql_query("SET character_set_results='utf8'");
	mysql_query("SET character_set_client='utf8'");
	mysql_query("SET character_set_connection='utf8'");
	mysql_query("collation_connection = 'utf8'");
	mysql_query("collation_database = 'utf8'");
	mysql_query("collation_server = 'utf8'");
	mysql_select_db("anime",$con);
?>