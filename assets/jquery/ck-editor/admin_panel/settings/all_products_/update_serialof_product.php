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
  
 $id				= htmlspecialchars(trim($_POST['id']));

 $action			= htmlspecialchars(trim($_POST['action']));
 $output = "0";
 
 if( $action == "update") {
 	
			$serial			= htmlspecialchars(trim($_POST['serial']));

	
			$arr_master_category = array("serial" => $serial);  
		
			$table = "product";
            $field = "id";
            $value =  $id;

            $update_master_category = $update->mysql_update_array($arr_master_category, $table, $field, $value);

			if($update_master_category) {
				$output = "1";
			} else {
				$output = "0";
			}

 }
 
  if( $action == "delete") {
  
  	 $del =  mysql_query("DELETE FROM product where id = $id");
	 
	 if($del) {
	 	$output = "1";
	 } else {
		$output = "0";
	 }
  
  }
  
   if( $action == "addnew") {
  
		$arr_master_category = array("profile_id" => $id);  
						
			$insert_master_category = $insert->mysql_insert_array($arr_master_category, "product");
			
			if($insert_master_category) { 
				$output = 1;
			} else {
				$output = 0;
			}
  
  }
 
 
 
 echo $output;
 
@mysql_close();
 
 ?>