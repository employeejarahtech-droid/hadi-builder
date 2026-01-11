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

  
   // Global Initialization
  $entry_limit = 100;
  
  
  // -----------------------------
  
  
 @include('../../update_plugins.php');
 @include('../../Insert.php');
 
 $insert = new Insert(); 
 $update = new update_plugins(); 
 $update2 = new update_plugins(); 
  
 $id			= htmlspecialchars(trim($_POST['id']));
 $action		= htmlspecialchars(trim($_POST['action']));
 $output 		= "0";
 
 if( $action == "update") {
 	
			$tittle_common	= htmlspecialchars(trim($_POST['tittle_common']));
			$serial			= htmlspecialchars(trim($_POST['serial']));

			$arr_master_category = array("name" => str_replace("^^^", "&", $tittle_common),
										"serial" => $serial	
											);  
		
			$table = "product_category";
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
  
  	 $del =  mysql_query("DELETE FROM product_category where id = $id");
	 
	 if($del) {
	 	$output = "1";
	 } else {
		$output = "0";
	 }
  
  }
  
   if( $action == "addnew") {
  
  		// Global Change are
		// checktotal category
		$check_sql = "select * from product_category ";
	
		$check_retult = mysql_query($check_sql);
		$total_data = mysql_num_rows($check_retult);
	
		// checktotal category
	
		if($total_data < $entry_limit) {

			$arr_master_category = array("name" => "");  
						
			$insert_master_category = $insert->mysql_insert_array($arr_master_category, "product_category");
			
			
			if($insert_master_category) { 
				$output = 1;
			} else {
				$output = 0;
			}
			
		} else {
			$output = "3";
		}
  
  }
  
  if( $action == "initial_main_cat") {
  
			$id			= htmlspecialchars(trim($_POST['id']));
			$maincat	= htmlspecialchars(trim($_POST['maincat']));

			$arr_master_category = array(
										"main" => $maincat	
											);  
		
			$table = "product_category";
            $field = "id";
            $value =  $id;

            $update_main_category = $update->mysql_update_array($arr_master_category, $table, $field, $value);

			if($update_main_category) {
				$output = "1";
			} else {
				$output = "0";
			}

  }
  
  
 
 
 
 echo $output;
 
@mysql_close();
 
 ?>