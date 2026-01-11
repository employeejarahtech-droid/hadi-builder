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
  
 $id			= mysql_real_escape_string(htmlspecialchars(trim($_POST['id'])));
 $action		= mysql_real_escape_string(htmlspecialchars(trim($_POST['action'])));
 $val		= mysql_real_escape_string(htmlspecialchars(trim($_POST['val'])));
 $output = "";
 
 $today = date("Y-m-d H:i:s"); 
 
 $output ="";
 

   if( $action == "addnew") {
   		
			$arr_lang = array("image1" => "no_image.jpg");  
						
			$insert_wholedata = $insert->mysql_insert_array($arr_lang, "gallery");
			
			
			if($insert_wholedata) { 
				$output = 1;
			} else {
				$output = 0;
			}
   
   }
 
	if( $action == "update_category") {
	
		$arr_lang = array("category" => $val);  
					
		$table = "gallery";
		$field = "id";
		$value =  $id;
	
		$update_master_category = $update->mysql_update_array($arr_lang, $table, $field, $value);
		
		if($update_master_category) { 
			$output = 1;
		} else {
			$output = 0;
		}
				
	}
	
	if( $action == "update_subcategory") {
	
		$arr_lang = array("sub_category" => $val);  
					
		$table = "gallery";
		$field = "id";
		$value =  $id;
	
		$update_master_category = $update->mysql_update_array($arr_lang, $table, $field, $value);
		
		if($update_master_category) { 
			$output = 1;
		} else {
			$output = 0;
		}
				
	}
	
	if( $action == "update_subcategory2") {
	
		$arr_lang = array("more_sub_category" => $val);  
					
		$table = "gallery";
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
 

	@mysql_close($conn);
 
 ?>