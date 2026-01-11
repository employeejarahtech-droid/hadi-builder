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
 $id			= htmlspecialchars(trim($_POST['id']));
 $name				= htmlspecialchars(trim($_POST['name']));

 
 $output = "0";
 
 $today = date("YmdHis"); 
 

		if( $action == "addnew") {
	
			$arr_lang = array("name" => $name);  
						
			$insert_wholedata = $insert->mysql_insert_array($arr_lang, "pages");
			
			
			if($insert_wholedata) { 
				$output = 1;
			} else {
				$output = 0;
			}
					
	  	}
		
	if( $action == "update") {
	
			$arr_lang = array("name" => $name);  
						
			$table = "pages";
            $field = "id";
            $value =  $id;

            $update_master_category = $update->mysql_update_array($arr_lang, $table, $field, $value);

			if($update_master_category) { 
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