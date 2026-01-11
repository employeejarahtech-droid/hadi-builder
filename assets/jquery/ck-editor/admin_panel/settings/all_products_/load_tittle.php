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



 
 		 $sql = "select * from product_detail where product_id='".$id."' order by serial ASC";
		 
		 $result = mysql_query($sql);
		 $total_data = mysql_num_rows($result);
		 
					$j = 0;
					while ($row = mysql_fetch_array($result)) {
					$j++;
				?>
						<div id="adjarea<?php echo $row['id']; ?>" class="adjarea">
							 <div class="row_addj">
								<div class="left_items">
									<div class="tittle_de tooltip" dir="title change here">
									<input id="hiddentittleid<?php echo $j; ?>" type="hidden" name="hiddentittleid<?php echo $j; ?>" value="<?php echo $row["id"]; ?>" />
									<input id="tittle_name<?php echo $j; ?>" name="tittle_name<?php echo $j; ?>" value="<?php echo $row['titile']; ?>" type="text" /></div>
									<div class="tittle_actions">
									<div class="leftmargin">SL : <input onkeyup="checkInput(this);" onkeydown="checkInput(this);" name="serial<?php echo $j; ?>" id="serial<?php echo $j; ?>" type="text" size="2" value="<?php echo $row['serial']; ?>" class="leftmargin"  maxlength="2" />
								  
								  <input type="checkbox" id="checked<?php echo $j; ?>" class="leftmargin" name="checked<?php echo $j; ?>" value="checkbox" />
									</div>
									</div>
								</div>
								<div class="detail_de"><textarea id="tittle_detail_common<?php echo $j; ?>" class="autoexpand" onkeyup="keydown_expand(this);" onchange="keydown_expand(this);" onkeypress="keydown_expand(this);" onkeydown="keydown_expand(this);" name="detail_common<?php echo $j; ?>"><?php echo str_replace("<br />", "\n", $row['detail']); ?></textarea></div>
							 </div>
						</div>
						<div style="clear:both; width:100%; height:1px;"></div>
					
				<?php }  ?>
		
		
 
   <input id="hidden_total_tittle<?php echo  $id; ?>"  name="hidden_total_tittle<?php echo  $id; ?>" size="5" type="hidden" value="<?php echo $total_data; ?>" />
   
   
<script>
           
     
$(document).ready(function(){	
	
	/// Auto Expanding Text
	// -----------------------------------------------------------------------
	 $('.autoexpand').trigger('onkeydown');
	 $('.autoexpand').trigger('onchange');
	 $('.autoexpand').trigger('onkeypress');
	 $('.autoexpand').trigger('onkeyup');
	// -----------------------------------------------------------------------

});



	function keydown_expand(textarea){
	  var limit = 1200;
	  textarea.style.height = 50;
	  textarea.style.height = Math.min(textarea.scrollHeight, limit) + "px";	  
	}
	
</script>	
   
<?php

function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}


	@mysql_close($conn);
	
?>
