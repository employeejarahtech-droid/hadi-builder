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
	width: 500px;
	margin-left: 20px;
	margin-top: 5px;
}

#tittle {
	float: left;
	width: 150px;
	margin-left: 10px;
}
#field {
	float: left;
	width: 290px;
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

._span{
	height: 20px;
	width: 25px;
	float: left;
}

.list_menu {
	width: 170px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
}
#tablecontent{
	height:700px;
	background-color: #ECE9D8;
}

</style>
	


<div id="Addnew">

	<div id="header_text">Truncate Table </div>
	
	<div id="clear"></div>

	<div id="field_content">
		<div id="tittle">Table Name</div>
		<div id="field"><span class="_sponsor_input">
		  
		 <select name="tables" id="tables" class="list_menu">
					<option value="">Select </option>
					<option value="gallery">gallery</option>
					<option value="link">link</option>
					<option value="link_sub">link_sub</option>	
					<option value="link_type">link_type</option>	
					<option value="pages">pages</option>	
			</select>
		</span></div>
		<div id="s_tables" class="_span"></div>

	</div>
	<div id="field_content">
		<div id="tittle">&nbsp;</div>
		<div id="field">&nbsp;</div>
		<div id="" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&nbsp;</div>
		<div id="field">
		  <input id="submit_this" type="submit" name="Submit" onclick="add_new();" value="   Save   " />
		</div>
	</div>
</div>

<script>
           
     
$(document).ready(function(){	
	
	

	
});



function add_new(){   


		var myvars = new Array();
			myvars[0] = "tables";

			
			
        var valid =  error_check(myvars);	
		
		var tables = $('#tables').attr('value');
		
      	
	
	
	
	var tables = $('#tables').attr('value');
	
	if(valid) {
	
		maskPage();
		
		$.ajax({
				type: 'POST',
				url: 'settings/table/table_update_save_del.php',	
				data: "tables="+ tables
				+"& action="+ "addnew" ,
				success: function(data) {
					 maskPage();

					 $(".tab1_content").html('<div style="margin:20px;padding:20px;">'+data+'</div>');

								
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown);
					}
			});  
		
		} 
		 
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
