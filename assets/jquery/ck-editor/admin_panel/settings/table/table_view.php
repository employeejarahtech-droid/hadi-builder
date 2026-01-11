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

 

 ?>
 
<style type="text/css">
	
#Addnew {
	height: 200px;
	width: 600px;
	margin-top: 20px;
	margin-right: auto;
	margin-left: auto;
	margin-bottom: 20px;
}
	

#header_text {
	font-family: "Times New Roman", Times, serif;
	color: #339933;
	margin-top: 10px;
	margin-left: auto;
	font-size: 18px;
	height: 30px;
	border-bottom-width: 1px;
	border-bottom-style: dotted;
	border-bottom-color: #339933;
	margin-right: auto;
	width: 560px;
}

#clear{
	clear:both;
	height: 1px;
	width: 100%;
}

#field_content{
	height: 30px;
	width: 560px;
	margin-left: 20px;
	margin-top: 5px;
}

#tittle {
	float: left;
	width: 30px;
	margin-left: 10px;
}
#field {
	float: left;
	width: 250px;
}

#field_shortname {
	float: left;
	width: 210px;
}

.input_single{
	width: 270px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
}
.input_multi{
	width: 270px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
}

#action {
	float: left;
	width: 50px;
	cursor: pointer;
	text-decoration: underline;
}
</style>

<div id="Addnew">
	<div id="header_text">List of Table</div>
	<div id="clear"></div>
	<div id="field_content">
		<div id="tittle">SL</div>
		
		<div id="field">
		   Name
		</div>

	</div>
	<?php 
	$sql = "SHOW TABLES FROM ".$dbname."";
	$result = mysql_query($sql);

	$i = 0;
	
while ($row = mysql_fetch_row($result)) {
	$i++;
	?>
		<div id="field_content">
			<div id="tittle"><?php  echo $i;  ?></div>
			
			<div id="field">
			  <?php echo $row[0];  ?>
			</div>
			
			
		</div>
	
	<?php }  ?>

</div>

<script>
           
     
$(document).ready(function(){	
	
	

	
});

	function cleartabs(){
			 $(".tab1_content").text('');
			 $(".tab2_content").text('');
			 $(".tab3_content").text('');
			 
			 
			  $("#action_message").text('');
			 
		}

function edit_button_click(id){   

	
		var selected_id = id;
		//alert(selected_id);
		$.ajax({
				type: 'POST',
				url: 'settings/language/language_edit.php',	
				data: "id="+ selected_id
				+"& action="+ "edit" ,
				success: function(data) {
						//alert(data);
						cleartabs();
						$(".tab2_content").html(data);
						
								
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown);
					}
			});

		 
}


</script>


<?php

function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}


?>
