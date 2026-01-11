<?php  @session_start();

  $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
         && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	  	if (!$isAjax) {  ?>
  
			 <script language="javascript">
				window.location.href="";
			</script> 
	  
<?php  }
  
@include('../connection.php'); 



 $u_id			= mysql_real_escape_string(trim($_POST['u_id']));
 $u_pass		= mysql_real_escape_string(trim($_POST['u_pass']));
 $action		= mysql_real_escape_string(trim($_POST['action']));
 $output 		= 0;


	if($action=="userlogin"){
	
		$u = trim(ReturnAnyOneFieldFromAnyTable("settings", "valuess", "name", "username"));
		$p = trim(ReturnAnyOneFieldFromAnyTable("settings", "valuess", "name", "password"));
		
		if(($u==$u_id) && ($p==$u_pass)){
			$output	 = 1 ;
			$_SESSION[$secrete] ="allow";
		} else {
			$output	 = 0;
			$_SESSION[$secrete] ="";
		}

			
	}



	echo $output;



 	function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
		$result2 = @mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
		$row2 = @mysql_fetch_assoc($result2);
		@mysql_free_result($result2);
		
		return $row2[$field];
	}
	
?>