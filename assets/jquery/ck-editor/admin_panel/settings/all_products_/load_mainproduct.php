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


 @include('../../Insert.php');
 @include('../../update_plugins.php');

 $insert = new Insert(); 
 $update = new update_plugins(); 
 
 
 $id       		= htmlspecialchars(trim($_GET['id']));
 $action    	= htmlspecialchars(trim($_GET['action']));

 $output ="";
 
 if($action == "mainproduct") {
 	
	$previous_img = ReturnAnyOneFieldFromAnyTable("product", "image1", "id", $id);
	$output = $previous_img;
	
 }
 if($action == "cart_fact") {
 
 	$send_data   = htmlspecialchars(trim($_GET['send_data']));
 	
	$del =  mysql_query("UPDATE product  set cart_enable = $send_data  where id = $id");
	 
	 if($del) {
	 	$output = "1";
	 } else {
		$output = "0";
	 }
	
 }
 
  if($action == "delete") {
  
  			 $current_img   = htmlspecialchars(trim($_GET['current_img']));
 	
			$current_img = $_GET["current_img"];
			$current_field = "";
			if($current_img  == "1") {
				$current_field ="image1";
			}
			if($current_img  == "2") {
				$current_field ="image2";
			}
			if($current_img  == "3") {
				$current_field ="image3";
			}
			if($current_img  == "4") {
				$current_field ="image4";
			}
			if($current_img  == "5") {
				$current_field ="image5";
			}
			if($current_img  == "6") {
				$current_field ="image6";
			}
			
	
			// delete previous image
			$previous_img = ReturnAnyOneFieldFromAnyTable("product", $current_field, "id", $id);	
			
			 // Delete previous imagge
			 $del_file = "primages/thumb/$previous_img"; 
			 @unlink($del_file);
			 // Delete previous imagge
			 $del_file = "primages/small/$previous_img"; 
			 @unlink($del_file);
			 // Delete previous imagge
			 $del_file = "primages/fixed/$previous_img"; 
			 @unlink($del_file);
			 
	
	 $del =  mysql_query("UPDATE product  set $current_field = ''  where id = $id");
	 
	 if($del) {
	 	$output = "1";
	 } else {
		$output = "0";
	 }
	//$output = $previous_img;
 }
 
 
  if($action == "addnew_tittle") {
 
 		$arr_product = array("titile" => "title",
			"detail" => "detail",
			"product_id" => $id);  
					
		$insert_product = $insert->mysql_insert_array($arr_product, "product_detail");
		
		
		if($insert_product) { 
			$output = "1";
		} else {
			$output = "0";
		}
   }
   
    if($action == "saveall_tittle") {
 
 
		$tittle_name 			= htmlspecialchars(trim($_GET['tittle_name']));
		$tittle_detail_common	= str_replace("\n", "<br />", htmlspecialchars(trim($_POST['tittle_detail_common'])));
		$serial 	= htmlspecialchars(trim($_GET['serial']));
 
 		$arr_product = array("titile" => str_replace("^^^", "&", $tittle_name),
			"detail" => str_replace("^^^", "&", $tittle_detail_common),
			"serial" => $serial);  
					
			$table = "product_detail";
            $field = "id";
            $value =  $id;

            $update_master_category = $update->mysql_update_array($arr_product, $table, $field, $value);

			if($update_master_category) {
				$output = "1";
			} else {
				$output = "0";
			}

   }
   
  
   
 
 
 
 echo $output;
 

function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}


	@mysql_close($conn);
	
?>
