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
 
 
 $id       		= htmlspecialchars(trim($_POST['id']));
 $action    	= htmlspecialchars(trim($_POST['action']));
 $output        = "";
 
 
    if($action == "saveall_tittle") {
 
 
		$tittle_name 			= htmlspecialchars(trim($_POST['tittle_name']));
		$tittle_detail_common	= str_replace("\n", "<br />", htmlspecialchars(trim($_POST['tittle_detail_common'])));
		$serial 				= htmlspecialchars(trim($_POST['serial']));
 
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
			
			echo $output;

   }
   
   if( $action == "delete_product") {
   
   		$del =  mysql_query("DELETE FROM product where id = $id");
		 
		 if($del) {
			$output = "1";
		 } else {
			$output = "0";
		 }

   
   }
   
   
    if( $action == "delete_tittle") {
  
		 $del =  mysql_query("DELETE FROM product_detail where id = $id");
		 
		 if($del) {
			$output = "1";
		 } else {
			$output = "0";
		 }
  
  }
  
   if( $action == "change_category") {
  
 		 $cuttent_cat 				= htmlspecialchars(trim($_POST['cuttent_cat']));
		 $del =  mysql_query("UPDATE product set pro_category_id = $cuttent_cat where id = $id");
		 
		 if($del) {
			$output = "1";
		 } else {
			$output = "0";
		 }
  
  }
  
   if( $action == "update_search_category") {
  
 		 $cuttent_cat 				= htmlspecialchars(trim($_POST['cuttent_cat']));
		 $del =  mysql_query("UPDATE product set search_cat_id = $cuttent_cat, search_subcat_id=0  where id = $id");
		 
		 if($del) {
			$output = "1";
		 } else {
			$output = "0";
		 }
  
  }
  
  if( $action == "update_search_subcategory") {
  
 		 $cuttent_subcat 				= htmlspecialchars(trim($_POST['cuttent_subcat']));
		 $del =  mysql_query("UPDATE product set search_subcat_id = $cuttent_subcat where id = $id");
		 
		 if($del) {
			$output = "1";
		 } else {
			$output = "0";
		 }
  
  }
  
  
  echo $output;
   
   
   ?>
   