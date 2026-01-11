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
  
 $id				= $_SESSION[topleveladmincokieid];
 $action			= mysql_real_escape_string(htmlspecialchars(trim($_POST['action'])));
 $output = "0";
 
 $today = date("YmdHis"); 
 
 if( $action == "save_map") {
 	
	
			$tittle_common	= mysql_real_escape_string(htmlspecialchars(trim($_POST['tittle_common'])));
			$detail_common	= mysql_real_escape_string(htmlspecialchars(trim($_POST['detail_common'])));
			$latFld			= mysql_real_escape_string(htmlspecialchars(trim($_POST['latFld'])));
			$lngFld			= mysql_real_escape_string(htmlspecialchars(trim($_POST['lngFld'])));
	
			$arr_master_category = array("titile" => str_replace("^^^", "&", $tittle_common),
										"detail" => str_replace("^^^", "&", $detail_common),
										"langitute" => $latFld,
										"longitute" => $lngFld
											);  
		
			$table = "locationmap";
            $field = "profile_id";
            $value =  $id;

            $update_master_category = $update->mysql_update_array($arr_master_category, $table, $field, $value);

			if($update_master_category) {
				$output = "1";
			} else {
				$output = "0";
			}

 }
 
 
 
 echo $output;
 
@mysql_close();
 
 ?>