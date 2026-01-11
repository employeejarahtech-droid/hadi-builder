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

 
 
 
 $id       = htmlspecialchars(trim($_POST['id']));
 
 $style1  = $_COOKIE['style1'];
 
 ?>
 
<link rel="stylesheet" type="text/css" href="settings/directory/css/content_style1_BD.css"> 



	

<div class="_add_new_photo_area">


	<?php 	

	// all data
	$sql1 = "select * from photo where profile_id='".$id."' order by serial asc";
			$rsd1 = @mysql_query($sql1);
			
			$number_total = @mysql_num_rows($rsd1);
			
			?>
		
			<?php
			$i = 0;
			 while($result1 = @mysql_fetch_array($rsd1)){ 

				$image1 = 	ReturnAnyOneFieldFromAnyTable("photo", "image1", "id", $result1["id"]);
				
				$i++;
				 ?>

  		  <div class="detain_view_left">
				<?php
				
				if($policy == 1) {
					
					 $image1 ="notveryfied.png";
				}
			 
			  ?>
				<div class="imge_name"><img id="partne" src="settings/directory/photo_image/<?php echo $result1["image1"];  ?>" height="120" width="170" /></div>
				<div style="clear:both; width:100%; height:1px;"></div>
				<div id="port_folio_id" class="port_folio_id tooltip" dir="add web address here">
			
			  <input type="text" id="photo_title_vv<?php echo $i; ?>" maxlength="100"  name="photo_title<?php echo $i; ?>" value="<?php echo $result1["image1"]; ?>" />
			</div>
		</div>

		
				
	<?php   } ?>			
</div>




<?php

function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}


?>
