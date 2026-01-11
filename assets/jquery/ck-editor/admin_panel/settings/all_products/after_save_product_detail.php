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


$name_p = "name";
$code_p = "code";
$price_p = "price";
$items_p = "items in a box ";
$short_p = "short details";
$color_p = "color";
$size_p = "size";




$id       = htmlspecialchars(trim($_POST['id']));
$name 			= @ReturnAnyOneFieldFromAnyTable("product", "code", "id", $id);
$pr_code 		= @ReturnAnyOneFieldFromAnyTable("product", "pr_code", "id", $id);
$price 			= @ReturnAnyOneFieldFromAnyTable("product", "price", "id", $id);
$qunatityinbox 	= @ReturnAnyOneFieldFromAnyTable("product", " 	qunatityinbox", "id", $id);

$short 			= @ReturnAnyOneFieldFromAnyTable("product", "name", "id", $id);
$color 			= @ReturnAnyOneFieldFromAnyTable("product", "color", "id", $id);
$size 			= @ReturnAnyOneFieldFromAnyTable("product", "size", "id", $id);

?>

			<div class="company_tittle"><input name="textfield_name<?php echo $id;  ?>" id="textfield_name<?php echo $id;  ?>" class="textfield_tittle" value="<?php echo $name;  ?>" type="text" placeholder="<?php echo $name_p;  ?>" /></div>
				
				<div class="message_tittle"><input name="textfield_pr_code<?php echo $id;  ?>" id="textfield_pr_code<?php echo $id;  ?>" class="textfield_modelnumber" value="<?php echo $pr_code;  ?>" placeholder="<?php echo $code_p;  ?>"  type="text" /></div>
				
				<div class="message_tittle"><input name="textfield_price<?php echo $id;  ?>" id="textfield_price<?php echo $id;  ?>" class="textfield_modelnumber" value="<?php echo $price;  ?>" placeholder="<?php echo $price_p;  ?>"  type="text" /></div>
				
				<div class="message_tittle"><input name="textfield_qunatityinbox<?php echo $id;  ?>" id="textfield_qunatityinbox<?php echo $id;  ?>" class="textfield_modelnumber" value="<?php echo $qunatityinbox;  ?>" placeholder="<?php echo $items_p;  ?>"  type="text" /></div>
				
				
				<div class="message_body">
					<textarea name="textarea_short<?php echo $id;  ?>" class="textarea_short" id="textarea_short<?php echo $id;  ?>" cols=""  onchange="limitText(this,5250);" onkeyup="limitText(this,5250);"  onkeydown="limitText(this,5250);" rows=""  placeholder="<?php echo $short_p;  ?>"><?php echo str_replace("<br />", "\n", $short); ?></textarea>	
	
				</div>
				<div class="message_body">
					<textarea name="textarea_color<?php echo $id;  ?>" class="textarea_short" id="textarea_color<?php echo $id;  ?>" cols=""  maxlength="50" onchange="limitText(this,5250);" onkeyup="limitText(this,5250);"  onkeydown="limitText(this,5250);" rows=""  placeholder="<?php echo $color_p;  ?>" ><?php echo str_replace("<br />", "\n", $color); ?></textarea>	
	
				</div>
				<div class="message_body">
					<textarea name="textarea_size<?php echo $id;  ?>" class="textarea_short" id="textarea_size<?php echo $id;  ?>" cols=""  maxlength="50" onchange="limitText(this,5250);" onkeyup="limitText(this,5250);"  onkeydown="limitText(this,5250);" rows="" placeholder="<?php echo $size_p;  ?>" ><?php echo str_replace("<br />", "\n", $size ); ?></textarea>	
			
			
<?php

function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}


?>
