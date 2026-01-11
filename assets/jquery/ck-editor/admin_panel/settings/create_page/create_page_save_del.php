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
  
 $action				= htmlspecialchars(trim($_POST['action']));
 $page_name				= htmlspecialchars(trim($_POST['page_name']));
 $lang_name				= htmlspecialchars(trim($_POST['lang_name']));
 $title_en				= htmlspecialchars(trim($_POST['title_en']));
 $title_ar				= htmlspecialchars(trim($_POST['title_ar']));
 $sh_detail_common_en	= htmlspecialchars(trim($_POST['sh_detail_common_en']));
 $sh_detail_common_ar	= htmlspecialchars(trim($_POST['sh_detail_common_ar']));
 $detail_common_en		= htmlspecialchars(trim($_POST['detail_common_en']));
 $detail_common_ar		= htmlspecialchars(trim($_POST['detail_common_ar']));
 
  $view		= htmlspecialchars(trim($_POST['detail_view']));
 
 $title_en2 = sanitize($title_en);
 $title_ar2 = sanitize($title_ar);
 $short_note_en = sanitize($sh_detail_common_en);
 $short_note_ar = sanitize($sh_detail_common_ar);
 $page_data_en = sanitize($detail_common_en);
 $page_data_ar = sanitize($detail_common_ar);
 
 $view_after =  sanitize_view($view);

 
 $output = "0";
 
 $today = date("YmdHis"); 
 

		if( $action == "update") {
			$title = "title_".$lang_name;
			$short_note = "short_note_".$lang_name;
			$page_data = "page_data_".$lang_name;
			
			$arr_lang = array("short_note_en" => $short_note_en,
								$short_note => $short_note_ar,
								"title_en" => $title_en2,
								$title => $title_ar2,
								"page_data_en" => $page_data_en,
								$page_data => $page_data_ar);  
						
			$table = "pages";
            $field = "id";
            $value =  $page_name;

            $update_master_category = $update->mysql_update_array($arr_lang, $table, $field, $value);
			
/*			$sql = "update pages set short_note_en = 'Maksud' where id = 1";
			$result = mysql_query($sql );*/
			
			if($update_master_category) {
				$output = "1";
			} else {
				$output = "0";
			}
					
	  	}
		
		if( $action == "sh_detail_common_en") {
		
			$table = "pages";
            $field = "id";
            $value =  $page_name;
			
			$output = html_entity_decode(desanitize(ReturnAnyOneFieldFromAnyTable($table, "short_note_en", $field, $value)));
			
			//$output = 	$action;	
	  	}
		
		if( $action == "sh_detail_common_ar") {
		
			$table = "pages";
            $field = "id";
            $value =  $page_name;
			$short_note = "short_note_".$lang_name;
			$output = html_entity_decode(desanitize(ReturnAnyOneFieldFromAnyTable($table, "short_note_".$lang_name."", $field, $value)));
			
			//$output = 	$action;	
	  	}
		
		if( $action == "detail_common_en") {
		
			$table = "pages";
            $field = "id";
            $value =  $page_name;
			
			$output = html_entity_decode(desanitize(ReturnAnyOneFieldFromAnyTable($table, "page_data_en", $field, $value)));
			
			//$output = 	$action;	
	  	}
		
		if( $action == "detail_common_ar") {
		
			$table = "pages";
            $field = "id";
            $value =  $page_name;
			$page_data = "page_data_".$lang_name;
			
			$output = html_entity_decode(desanitize(ReturnAnyOneFieldFromAnyTable($table, $page_data, $field, $value)));
			
			//$output = 	$action;	
	  	}
		
		if( $action == "title_en") {
		
			$table = "pages";
            $field = "id";
            $value =  $page_name;
			
			$output = html_entity_decode(desanitize(ReturnAnyOneFieldFromAnyTable($table, "title_en", $field, $value)));
			
			//$output = 	$action;	
	  	}
		
		if( $action == "title_ar") {
		
			$table = "pages";
            $field = "id";
            $value =  $page_name;
			$page_data = "title_".$lang_name;
			
			$output = html_entity_decode(desanitize(ReturnAnyOneFieldFromAnyTable($table, $page_data, $field, $value)));
			
			//$output = 	$action;	
	  	}
		
		if( $action == "view") {
		
			$output = quote_desanitize(html_entity_decode($view_after));
			
	  	}
		
 

 
 echo $output;
 
function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}

//ENT_QUOTES

function sanitize($text) {
	//$text = htmlspecialchars($text, ENT_QUOTES);
	//$text = str_replace("\n\r","\n",$text);
	//$text = str_replace("'","singlequote",$text);
	//$text = str_replace("\r\n","\n",$text);
	//$text = str_replace("\n","<br>",$text);
	return $text;
}

function sanitize_view($text) {
	//$text = htmlspecialchars($text, ENT_QUOTES);
	$text = str_replace("\n\r","\n",$text);
	$text = str_replace("'","singlequote",$text);
	$text = str_replace("\r\n","\n",$text);
	$text = str_replace("images","../images",$text);
	$text = str_replace("\n","<br>",$text);
	return $text;
}

function desanitize($text) {
	//$text = htmlspecialchars($text, ENT_QUOTES);
	//$text = str_replace("\n\r","\n",$text);
	//$text = str_replace("\r\n","\n",$text);
	//$text = str_replace("<br>","\n",$text);
	//$text = str_replace("'","singlequote",$text);
	return $text;
}

function quote_desanitize($text) {
	//$text = htmlspecialchars($text, ENT_QUOTES);
	//$text = str_replace("\n\r","\n",$text);
	//$text = str_replace("\r\n","\n",$text);
	//$text = str_replace("singlequote","'",$text);
	return $text;
}

@mysql_close();
?>