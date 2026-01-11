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


 $xrow       = htmlspecialchars(trim($_POST['id']));


$table ="product";
$wherefieldname = "id";
$passid=$xrow;


$img1 = @ReturnAnyOneFieldFromAnyTable($table, "image1", $wherefieldname, $passid);
$img2 = @ReturnAnyOneFieldFromAnyTable($table, "image2", $wherefieldname, $passid);
$img3 = @ReturnAnyOneFieldFromAnyTable($table, "image3", $wherefieldname, $passid);
$img4 = @ReturnAnyOneFieldFromAnyTable($table, "image4", $wherefieldname, $passid);
$img5 = @ReturnAnyOneFieldFromAnyTable($table, "image5", $wherefieldname, $passid);
$img6 = @ReturnAnyOneFieldFromAnyTable($table, "image6", $wherefieldname, $passid);

?>	
		
		
		
	
	
		<div id="image1" class="images">
				<img src="../images/thumb/<?php echo $img1;  ?>" height="120" width="100" />
			<span>
				<div id="menutittle">
				 
					<div id="image_1" onclick="uploadimage('<?php echo $xrow; ?>', '1');" dir="click here and change picture" class="edit_image tooltip">Edit</div>	
					<div id="image_1" onclick="deleteimage('<?php echo $xrow; ?>', '1');" class="edit_image tooltip" dir="click here and delete this picture">Delete</div>				
				</div>	
				<div id="menutittle2">
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img1 == "" ?  "logo.gif" : $img1;  ?>" width="358" height="442" />				</div>	
			</span>		
			</div>
		<div id="image2" class="images">
			<img src="../images/thumb/<?php echo $img2; ?>" height="120" width="100" />
			<span>
				<div id="menutittle">
					<div id="image_1" onclick="uploadimage('<?php echo $xrow; ?>', '2');" dir="click here and change picture" class="edit_image tooltip">Edit</div>	
					<div id="image_1" onclick="deleteimage('<?php echo $xrow; ?>', '2');" class="edit_image tooltip" dir="click here and delete this picture">Delete</div>				
				</div>	
				<div id="menutittle3">
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img2 == "" ?  "logo.gif" : $img2;  ?>" width="358" height="442" />				</div>	
			</span>		
			</div>
		<div id="image3" class="images">
			<img src="../images/thumb/<?php echo $img3; ?>" height="120" width="100" />
			<span>
				<div id="menutittle">
					<div id="image_1" onclick="uploadimage('<?php echo $xrow; ?>', '3');" dir="click here and change picture" class="edit_image tooltip">Edit</div>	
					<div id="image_1" onclick="deleteimage('<?php echo $xrow; ?>', '3');" class="edit_image tooltip" dir="click here and delete this picture">Delete</div>				
				</div>	
				<div id="menutittle3">
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img3 == "" ?  "logo.gif" : $img3;  ?>" width="358" height="442" />				</div>	
			</span>		
			</div>
			
		<div id="image4" class="images">
				<img src="../images/thumb/<?php echo $img4;  ?>" height="120" width="100" />
			<span>
				<div id="menutittle">
				 
					<div id="image_1" onclick="uploadimage('<?php echo $xrow; ?>', '4');" dir="click here and change picture" class="edit_image tooltip">Edit</div>	
					<div id="image_1" onclick="deleteimage('<?php echo $xrow; ?>', '4');" class="edit_image tooltip" dir="click here and delete this picture">Delete</div>				
				</div>	
				<div id="menutittle2">
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img4 == "" ?  "logo.gif" : $img4;  ?>" width="358" height="442" />				</div>	
			</span>		
			</div>
		<div id="image5" class="images">
			<img src="../images/thumb/<?php echo $img5; ?>" height="120" width="100" />
			<span>
				<div id="menutittle">
					<div id="image_1" onclick="uploadimage('<?php echo $xrow; ?>', '5');" dir="click here and change picture" class="edit_image tooltip">Edit</div>	
					<div id="image_1" onclick="deleteimage('<?php echo $xrow; ?>', '5');" class="edit_image tooltip" dir="click here and delete this picture">Delete</div>				
				</div>	
				<div id="menutittle5">
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img5 == "" ?  "logo.gif" : $img5;  ?>" width="358" height="442" />				</div>	
			</span>		
			</div>
		<div id="image6" class="images">
			<img src="../images/thumb/<?php echo $img6; ?>" height="120" width="100" />
			<span>
				<div id="menutittle">
					<div id="image_1" onclick="uploadimage('<?php echo $xrow; ?>', '6');" dir="click here and change picture" class="edit_image tooltip">Edit</div>	
					<div id="image_1" onclick="deleteimage('<?php echo $xrow; ?>', '6');" class="edit_image tooltip" dir="click here and delete this picture">Delete</div>				
				</div>	
				<div id="menutittle3">
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img6 == "" ?  "logo.gif" : $img6;  ?>" width="358" height="442" />				</div>	
			</span>		
			</div>
			
				
	

		
	
<?php

function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}



	@mysql_close($conn);
?>
