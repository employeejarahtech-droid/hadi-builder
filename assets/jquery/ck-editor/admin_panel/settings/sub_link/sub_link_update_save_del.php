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
 $id				= htmlspecialchars(trim($_POST['id']));
 $name				= htmlspecialchars(trim($_POST['name']));
 $otherename		= htmlspecialchars(trim($_POST['otherename']));
   $bi		= htmlspecialchars(trim($_POST['bi']));
   $ind		= htmlspecialchars(trim($_POST['ind']));
    $bn		= htmlspecialchars(trim($_POST['bn']));
	 $kr		= htmlspecialchars(trim($_POST['kr']));
	  $sp		= htmlspecialchars(trim($_POST['sp']));
	   $pr		= htmlspecialchars(trim($_POST['pr']));
	    $jp		= htmlspecialchars(trim($_POST['jp']));
		 $dt		= htmlspecialchars(trim($_POST['dt']));
		  $it		= htmlspecialchars(trim($_POST['it']));
		   $chi		= htmlspecialchars(trim($_POST['chi']));
		   
 $main_link			= htmlspecialchars(trim($_POST['main_link']));
 $link_page			= htmlspecialchars(trim($_POST['link_page']));

 $idvalue			= htmlspecialchars(trim($_POST['idvalue']));
 
 $output = "0";
 
 $today = date("YmdHis"); 
 

		if( $action == "addnew") {
	
			$arr_lang = array(
								"name_en" => $name,
								"name_ar" => $otherename,
								"name_bi" => $bi,
								"name_ind" => $ind,
								"name_bn" => $bn,
								"name_kr" => $kr,
								"name_sp" => $sp,
								"name_pr" => $pr,
								"name_jp" => $jp,
								"name_dt" => $dt,
								"name_it" => $it,
								"name_chi" => $chi,
								"page_name" => $link_page,
								"link_id" => $main_link);  
						
			$insert_wholedata = $insert->mysql_insert_array($arr_lang, "link_sub");
			
			
			if($insert_wholedata) { 
				$output = 1;
			} else {
				$output = 0;
			}
					
	  	}
		
		if( $action == "update") {
	
			$arr_lang = array("name_en" => $name,
								"name_ar" => $otherename,
								"name_bi" => $bi,
								"name_ind" => $ind,
								"name_bn" => $bn,
								"name_kr" => $kr,
								"name_sp" => $sp,
								"name_pr" => $pr,
								"name_jp" => $jp,
								"name_dt" => $dt,
								"name_it" => $it,
								"name_chi" => $chi,
								"page_name" => $link_page,
								"link_id" => $main_link);  
						
			$table = "link_sub";
            $field = "id";
            $value =  $id;

            $update_master_category = $update->mysql_update_array($arr_lang, $table, $field, $value);
			
/*			$sql = "update pages set short_note_en = 'Maksud' where id = 1";
			$result = mysql_query($sql );*/
			
			if($update_master_category) {
				$output = "1";
			} else {
				$output = "0";
			}
					
	  	}
		
		if( $action == "update_p") {
	
			$arr_lang = array("publish" => $idvalue);  
						
			$table = "link_sub";
            $field = "id";
            $value =  $id;

            $update_master_category = $update->mysql_update_array($arr_lang, $table, $field, $value);
			
			if($update_master_category) { 
				$output = 1;
			} else {
				$output = 0;
			}
					
	  	}
		
		if( $action == "update_c") {
	
			$arr_lang = array("custompage" => $idvalue);  
						
			$table = "link_sub";
            $field = "id";
            $value =  $id;

            $update_master_category = $update->mysql_update_array($arr_lang, $table, $field, $value);
			
			if($update_master_category) { 
				$output = 1;
			} else {
				$output = 0;
			}
					
	  	}
		
		if( $action == "update_t") {
	
			$arr_lang = array("target" => $idvalue);  
						
			$table = "link_sub";
            $field = "id";
            $value =  $id;

            $update_master_category = $update->mysql_update_array($arr_lang, $table, $field, $value);
			
			if($update_master_category) { 
				$output = 1;
			} else {
				$output = 0;
			}
					
	  	}
 
		if( $action == "update_null") {
	
			$arr_lang = array("null_yes" => $idvalue);  
						
			$table = "link_sub";
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
 
 function sanitize($text) {
	$text = htmlspecialchars($text, ENT_QUOTES);
	$text = str_replace("\n\r","\n",$text);
	$text = str_replace("\r\n","\n",$text);
	$text = str_replace("\n","<br>",$text);
	return $text;
}
 
function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}

@mysql_close();
?>