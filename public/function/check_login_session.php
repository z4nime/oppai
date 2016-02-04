<?php
	session_start();
	if($_SESSION['data'] != null)
		echo json_encode($_SESSION['data']);
?>
