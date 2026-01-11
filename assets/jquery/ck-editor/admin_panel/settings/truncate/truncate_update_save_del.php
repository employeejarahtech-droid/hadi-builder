<?php @session_start();
@include('../../../connection.php');


  $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
         && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	  	if (!$isAjax) {  ?>
  
			 <script language="javascript">
				window.location.href="<?php echo $url_link; ?>";
			</script> 
	  
<?php  }
  
if(!isset($_SESSION[$secrete]) || ($_SESSION[$secrete]=="")) { ?>
 			<script language="javascript">
				window.location.href="<?php echo $url_link; ?>";
			</script> 
<?php
}


 @include('../../update_plugins.php');
 @include('../../Insert.php');
 
 $insert = new Insert(); 
 $update = new update_plugins(); 
  
 $action			= htmlspecialchars(trim($_POST['action']));
 $tables				= htmlspecialchars(trim($_POST['tables']));


 
 $output = "";
 
 $today = date("YmdHis"); 
 

		if( $action == "addnew") {
	
			$sql = "TRUNCATE TABLE  ".$tables."";
			$result = mysql_query($sql);
		
			if($result) { 
				$output = 1;
			} else {
				$output = 0;
			}
					
	  	}
		
 

 
 echo $output;
 
function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}

@mysql_close();
?>