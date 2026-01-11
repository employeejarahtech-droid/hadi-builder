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
  $entry_limit = 1000;
  
  
  // -----------------------------
  
  
     

 @include('../../Insert.php');
 @include('../../update_plugins.php');

 $insert = new Insert(); 
 $update = new update_plugins(); 
 
 $output="";
	
	// INFORMATION
	
	$action    = htmlspecialchars(trim($_POST['action']));
	
	
	if($action == 'new') {
	
		// Global Change are
		// checktotal category
		$check_sql = "select * from product ";
	
		$check_retult = mysql_query($check_sql);
		$total_data = mysql_num_rows($check_retult);
	
		// checktotal category
	
		if($total_data < $entry_limit) {
	
				$category    = htmlspecialchars(trim($_POST['category']));
				$pid = md5(time());
				$pid_final = date("His");
				$arr_product = array(
					"id" => $pid_final,
					"pro_category_id" => $category
					);  
							
				$insert_product = $insert->mysql_insert_array($arr_product, "product");
				
				
				/*if($insert_product) { 
				
					
					$array_data = array('Status:', 'Invested:', 'Received:', 'Last paid:', 'Minimum Deposit', 'Referral:', 'Withdrawal:', 'Pay Term:', 'Lifetime:', 'Monitored:', 'User Votes:', 'HYIP Forums:', 'Investment Plans:');
					 
						
						for($i=0; $i<count($array_data); $i++){
							$arr_tittle = array("titile" => $array_data[$i],"serial"=>$i, 'product_id'=>$pid_final); 
							$insert_tittle = $insert->mysql_insert_array($arr_tittle, "product_detail");
						}

				
					$output = 1;
					
				} else {
					$output = 0;
				}*/
				
				
				if($insert_product) { 
					$output = 1;
					
				} else {
					$output = 0;
				}
				
				
		} else {
			$output = "3";
		}
			
		
		
	}
	
	
	if($action == 'save_product') {

		
		$textfield_name 			= htmlspecialchars(trim($_POST['textfield_name']));
 		$textfield_pr_code 			= htmlspecialchars(trim($_POST['textfield_pr_code']));
		$textfield_price 			= htmlspecialchars(trim($_POST['textfield_price']));
		$textfield_qunatityinbox 	= htmlspecialchars(trim($_POST['textfield_qunatityinbox']));
		
		$textarea_short				= str_replace("\n", "<br />", htmlspecialchars(trim($_POST['textarea_short'])));
		$textarea_color				= str_replace("\n", "<br />", htmlspecialchars(trim($_POST['textarea_color'])));
		$textarea_size				= str_replace("\n", "<br />", htmlspecialchars(trim($_POST['textarea_size'])));
		

		
		
		$id    						= htmlspecialchars(trim($_POST['id']));
		
		
 
 		$arr_product = array(
				"code" => $textfield_name,
				"pr_code" => $textfield_pr_code,
				"price" => $textfield_price,
				"qunatityinbox" => $textfield_qunatityinbox,
				"name" => $textarea_short,
				"color" => $textarea_color,
				"size" => $textarea_size
			);  
					
			$table = "product";
            $field = "id";
            $value =  $id;

            $update_master_category = $update->mysql_update_array($arr_product, $table, $field, $value);

			if($update_master_category) {
				$output = "1";
			} else {
				$output = "0";
			}
			
			
	}
	
	if($action == 'save_details') {

		
		$details 			= htmlspecialchars(trim($_POST['details']));
		$details_after = sanitize($details);
		$id    				= htmlspecialchars(trim($_POST['id']));
 
 		$arr_product = array("details" => $details_after);  
					
			$table = "product";
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

	
	


	mysql_close($conn);
?>
