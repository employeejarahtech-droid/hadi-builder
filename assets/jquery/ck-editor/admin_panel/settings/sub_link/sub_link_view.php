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
 
 
 $short_name= $_POST['lang_name'];

 ?>
 
<style type="text/css">
	
#Addnew {
	height: 200px;
	width: auto;
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
	width: 99%;
}

#clear{
	clear:both;
	height: 1px;
	width: 100%;
}

#field_content{
	height: 30px;
	width: 670px;
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
	width: 230px;
}

#field_shortname {
	float: left;
	width: 200px;
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

#field_menu_type{
	float: left;
	width: 145px;
}

#action {
	float: left;
	width: 25px;
	cursor: pointer;
	text-decoration: underline;
}
</style>

<div id="Addnew">
	<div id="header_text">List of sub link<div style="float:right; margin-right:200px;">
			<select name="lang_name" id="lang_name" class="list_menu lang_name">
					<option value="">Select </option>
				<?php $sql_p = "select * from lang";
					$result_p = mysql_query($sql_p);
					$lang_name = "&#1593;&#1585;&#1576;&#1610;";
						
					while ($row_p = mysql_fetch_array($result_p)) {
					
						$selected = "";
					if($row_p['short_name'] == $short_name) {
						$selected = "selected";
						$lang_name = $row_p['name'];
					}
					
				 ?>
						<option value="<?php echo $row_p['short_name']; ?>" <?php echo $selected; ?>><?php echo $row_p['name']; ?></option>
					
			   <?php }	
			   
			   
			   ?>		
			</select>
	</div></div>
	<div id="clear"></div>
	<div id="field_content">
		<div id="action">E  </div>
		<div id="action">Pub.  </div>
		<div id="tittle">ID</div>
		
		<div id="field">
		   Name
		</div>
		<div id="field_shortname">
		  Others(<?php echo $lang_name; ?>)
		</div>
		<div id="field_menu_type">
		   Link Type
		</div>

	</div>
	<?php 
	
	if($short_name == "") {
		$short_name = "ar";
	}
	
	$sql = "SELECT
link_sub.id as sub_id,
link_sub.name_en,
link_sub.name_$short_name as others,
link_sub.publish as l_p,
link.id,
link.name_en as main_link
FROM
 link_sub
Left JOIN link
ON link.id = link_sub.link_id;";
	$rsd = mysql_query($sql);
			
	$number_total = mysql_num_rows($rsd);
	
	$i = 0;
	
	while($row = mysql_fetch_array($rsd)){
			 
		?>
		<div id="field_content">
		
			<div id="action" onclick="edit_button_click('<?php echo $row['sub_id'];  ?>');">Edit</div>
			<div id="action">
			<?php
			$check = "";
			$value = "";
			if($row['l_p'] == 1) {
				$check ="checked";
				$value = 1;
			} else {
				$check = "";
				$value = 0;
			}
			 ?>
			<input id="<?php echo $row['sub_id'];  ?>" name="" type="checkbox" value="<?php echo $value; ?>" <?php echo $check; ?> onclick="item_check_uncheck('<?php echo $row['sub_id'];  ?>');" />
			
			</div>
			<div id="tittle"><?php echo $row['sub_id'];  ?></div>
			
			<div id="field">
			   <?php echo $row['name_en'];  ?>
			</div>
			<div id="field_shortname">
		    &nbsp;<?php echo $row['others'];  ?>
		</div>
		<div id="field_menu_type">
		  <?php echo $row['main_link'];  ?>
		</div>

		</div>
	
	<?php }  ?>

</div>

<script>
           
     
$(document).ready(function(){	
	
	

	
});

function item_check_uncheck(id){
	
	var id_value = $("#"+id+"").val();
	//alert(id_value);
	if(id_value == 0) {
		$("#"+id+"").val("1");
	} else {
		$("#"+id+"").val("0");
	}
	
	var idvalue = $("#"+id+"").val();
	var id_no = id;
	
	$.ajax({
		type: 'POST',
		url: 'settings/sub_link/sub_link_update_save_del.php',	
		data: { id: id_no, idvalue: idvalue, action: "update_p"  },
		success: function(data) {
				//alert(data);
				//cleartabs();
				//$(".tab2_content").html(data);
				
						
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				//$(".current_detail").text('problem with network');
				alert('problem with network : '+errorThrown);
			}
	});
	
}


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
				url: 'settings/sub_link/sub_link_edit.php',	
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


$(".lang_name").change(function()
{
	//alert('lang');
	maskPage(); 
	var lang_name=$(this).val();
	
		$.ajax({
				type: 'POST',
				url: 'settings/sub_link/sub_link_view.php',	
				data: "lang_name="+ lang_name
				+"& action="+ "lang_select" ,
				success: function(data) {
						//alert(data);
						maskPage(); 
						//$("#sh_detail_common_en").val(data); 
						$(".tab2_content").html(data);
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						maskPage(); 
						alert('problem with network : '+errorThrown);
					}
			});  
			

});


</script>


<?php

function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}


?>
