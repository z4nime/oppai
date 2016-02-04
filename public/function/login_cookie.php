<?php
	session_start();
	include("config.inc.php");
	$postdata = file_get_contents("php://input");
	$request = json_decode($postdata);
	@$email = $request->email;
	@$pass = $request->password;
	$sql = "select * from user where email = '".addslashes(trim($email))."' and password =  '".addslashes(trim($pass))."'";
	$query = mysql_query($sql);
	$result = mysql_fetch_array($query);

	if(!$result)
		echo "email or password incorrect";
	else
		{
			$json = array();
			$json[] = array('uid' => $result['uid'] , 'email' => $result['email'] , 'name' => $result['name'] , 'avatar' => $result['avatar'] , 'status' => $result['status'] , 'permission' => $result['permission']);
			//setcookie($cookie_name, $cookie_value, time() + (86400 * 30), "/"); // 86400 = 1 day
			setcookie("data",json_encode($json),time() + (86400 * 7));
			echo json_encode($json);
		}
?>