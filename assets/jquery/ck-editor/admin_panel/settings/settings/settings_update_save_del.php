<?php @session_start();
@include('../../../connection.php');

  $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
         && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	  	if (!$isAjax) {  ?>
  
			 <script language="javascript">
				window.location.href="<?php echo $url_link; ?>";
			</script> 
	  
 <?php  }
 
 @include('../../update_plugins.php');
 @include('../../Insert.php');

if(!isset($_SESSION[$secrete]) || ($_SESSION[$secrete]=="")) { ?>
 			<script language="javascript">
				window.location.href="<?php echo $url_link; ?>";
			</script> 
<?php
}
   

 
 $insert = new Insert(); 
 $update = new update_plugins(); 
  
 $action	= htmlspecialchars(trim($_POST['action']));
 $name		= htmlspecialchars(trim($_POST['name']));
 $address	= htmlspecialchars(trim($_POST['address']));
 $sdate		= htmlspecialchars(trim($_POST['sdate']));
 $u_name	= htmlspecialchars(trim($_POST['u_name']));
 $u_pass	= htmlspecialchars(trim($_POST['u_pass']));
 $email		= htmlspecialchars(trim($_POST['email']));
	  

 $output = "";
 $table ="settings";
		
		if( $action == "update") {
	
	
			UpdateAnyOneFieldFromAnyTable($table, "valuess", $name, "name", "name");
			UpdateAnyOneFieldFromAnyTable($table, "valuess", $address, "name", "address");
			UpdateAnyOneFieldFromAnyTable($table, "valuess", $sdate, "name", "selecteddate");
			UpdateAnyOneFieldFromAnyTable($table, "valuess", $u_name, "name", "username");
			UpdateAnyOneFieldFromAnyTable($table, "valuess", $u_pass, "name", "password");
			UpdateAnyOneFieldFromAnyTable($table, "valuess", $email, "name", "email");

			$output = 1;

					
	  	}
		
		
		
		
		
		
		
 

 
 echo $output;
 
function UpdateAnyOneFieldFromAnyTable($table, $field, $values, $wherefieldname, $passid){
	$result2 = mysql_query("UPDATE ".$table." SET ".$field."='".$values."' WHERE  ". $wherefieldname." = '".$passid."'");
	//$result2 = mysql_query("UPDATE settings SET values='babu' WHERE   name= 'name'");
	//return $result2; 
}

@mysql_close();
?>