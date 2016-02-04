<?php
	// session_start();
	// if($_SESSION['data'] != null)
	// 	echo json_encode($_SESSION['data']);
?>
<?php 
//setcookie("data");
//header('Content-Type: application/json');
echo stripslashes($_COOKIE["data"]);
?>
