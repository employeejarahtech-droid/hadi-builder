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



 $id  = $_POST['id'];
 

$sql = "SELECT * 
 FROM link_sub where id = $id";
$result = mysql_query($sql) or die(mysql_error());
$row = mysql_fetch_assoc($result);

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

.list_menu {
	width: 170px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
}

._span{
	height: 20px;
	width: 25px;
	float: left;
}


._sponsor_input {	width: 250px;
	float: left;
	margin-top: 4px;
}
</style>
	


<div id="Addnew">

	<div id="header_text">Edit Link </div>
	
	<div id="clear"></div>

	<div id="field_content">
		<div id="tittle">Name</div>
		<div id="field"><input name="id" id="id" type="hidden" value="<?php echo $row['id']; ?>" /><input class="input_single" id="name" name="name" type="text"  value="<?php echo $row['name_en']; ?>"/></div>
		<div id="s_name" class="_span"></div>

	</div>
	<div id="field_content">
		<div id="tittle">&#1593;&#1585;&#1576;&#1610;</div>
		<div id="field"><input class="input_single" style="text-align:right;" id="otherename" name="otherename" type="text" value="<?php echo $row['name_ar']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Bahasa Indonesia</div>
		<div id="field"><input class="input_single" id="bi" name="bi" type="text" value="<?php echo $row['name_bi']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#2361;&#2367;&#2344;&#2381;&#2342;&#2368;</div>
		<div id="field"><input class="input_single" id="ind" name="ind" type="text" value="<?php echo $row['name_ind']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#2476;&#2494;&#2434;&#2482;&#2494;</div>
		<div id="field"><input class="input_single" id="bn" name="bn" type="text" value="<?php echo $row['name_bn']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#54620;&#44397;&#50612;</div>
		<div id="field"><input class="input_single" id="kr" name="kr" type="text" value="<?php echo $row['name_kr']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Espa&ntilde;ol</div>
		<div id="field"><input class="input_single" id="sp" name="sp" type="text" value="<?php echo $row['name_sp']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Portugu&ecirc;s</div>
		<div id="field"><input class="input_single" id="pr" name="pr" type="text" value="<?php echo $row['name_pr']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#26085;&#26412;&#35486;</div>
		<div id="field"><input class="input_single" id="jp" name="jp" type="text" value="<?php echo $row['name_jp']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Deutsch</div>
		<div id="field"><input class="input_single" id="dt" name="dt" type="text" value="<?php echo $row['name_dt']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Italiano</div>
		<div id="field"><input class="input_single" id="it" name="it" type="text" value="<?php echo $row['name_it']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#20013;&#25991;(&#31616;&#20307;)</div>
		<div id="field"><input class="input_single" id="chi" name="chi" type="text" value="<?php echo $row['name_chi']; ?>" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Main Link </div>
		<div id="field"><span class="_sponsor_input">
		  
		 <select name="link_types" id="link_types" class="list_menu">
					<option value="">Select </option>
				<?php $sqls = "select * from link";
					$results = mysql_query($sqls);
					$selected = "";

					while ($rows = mysql_fetch_array($results)) {
				
						if($row['link_id'] == $rows['id']) {
							$selected  = "selected";
						}
					?>
						<option value="<?php echo $rows['id']; ?>" <?php echo $selected; ?>><?php echo $rows['name_en']; ?></option>
						
						
					
			   <?php
			   			$selected  = "";
			    }	?>		
		</select>
		</span></div>
		<div id="s_link_types" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Link Page </div>
		<div id="field"><span class="_sponsor_input">
		  
		 <select name="link_page" id="link_page" class="list_menu">
					<option value="">Select </option>
				<?php $sql_p = "select * from pages";
					$result_p = mysql_query($sql_p);
						
					while ($row_p = mysql_fetch_array($result_p)) {
					
						if($row['page_name'] == $row_p['name']) {
							$selected  = "selected";
						}
					
				 ?>
						<option value="<?php echo $row_p['name']; ?>" <?php echo $selected; ?>><?php echo $row_p['name']; ?></option>
					
			   <?php 
			   
			   			$selected  = "";
			   
			   }	?>		
		</select>
		
		</span></div>
		<div id="s_link_types" class="_span"></div>
	</div>
		<div id="field_content">
		<div id="tittle">&nbsp; Custom Link </div>
		<div id="field">
		  
		 <?php
			$check = "";
			$value = "";
			if($row['custompage'] == 1) {
				$check ="checked";
				$value = 1;
			} else {
				$check = "";
				$value = 0;
			}
			 ?>
		 <input id="<?php echo 'check_'.$row['id']; ?>" type="checkbox" name="checkbox" value="<?php echo $row['custompage']; ?>" onclick="item_check_uncheck('<?php echo 'check_'.$row['id']; ?>', '<?php echo $row['id']; ?>')" <?php echo $check; ?> />
		</div>
	</div>
	<div id="field_content">
		<div id="tittle">&nbsp; Target Blank </div>
		<div id="field">
		  
		 <?php
			$check = "";
			$value = "";
			if($row['target'] == 1) {
				$check ="checked";
				$value = 1;
			} else {
				$check = "";
				$value = 0;
			}
			 ?>
		 <input id="<?php echo 'target_'.$row['id']; ?>" type="checkbox" name="checkbox" value="<?php echo $row['target']; ?>" onclick="item_target_uncheck('<?php echo 'target_'.$row['id']; ?>', '<?php echo $row['id']; ?>')" <?php echo $check; ?> />
		</div>
	</div>
	<div id="field_content">
		<div id="tittle">&nbsp; Link Type Null </div>
		<div id="field">
		  
		 <?php
			$check = "";
			$value = "";
			if($row['null_yes'] == 1) {
				$check ="checked";
				$value = 1;
			} else {
				$check = "";
				$value = 0;
			}
			 ?>
		 <input id="<?php echo 'null_'.$row['id']; ?>" type="checkbox" name="checkbox" value="<?php echo $row['null_yes']; ?>" onclick="item_null_uncheck('<?php echo 'null_'.$row['id']; ?>', '<?php echo $row['id']; ?>')" <?php echo $check; ?> />
		</div>
	</div>
	<div id="field_content">
		<div id="tittle">&nbsp;</div>
		<div id="field">
		  <input id="submit_this" type="submit" name="Submit" onclick="update();" value="   Save   " />
		</div>
	</div>


</div>

<script>
           
     
$(document).ready(function(){	
	
	

	
});


function item_null_uncheck(id, r_id){
	
	var id_value = $("#"+id+"").val();

	if(id_value == 0) {
		$("#"+id+"").val("1");
	} else {
		$("#"+id+"").val("0");
	}
	
	var idvalue = $("#"+id+"").val();
	var id_no = r_id;

	$.ajax({
		type: 'POST',
		url: 'settings/sub_link/sub_link_update_save_del.php',	
		data: { id: id_no, idvalue: idvalue, action: "update_null"  },
		success: function(data) {
				//alert(data);
				//cleartabs();
				//$(".tab2_content").html(data);
				
						
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				alert('problem with network : '+errorThrown);
			}
	});
	
}

function item_target_uncheck(id, r_id){
	
	var id_value = $("#"+id+"").val();
	//alert(id_value);
	if(id_value == 0) {
		$("#"+id+"").val("1");
	} else {
		$("#"+id+"").val("0");
	}
	
	var idvalue = $("#"+id+"").val();
	var id_no = r_id;
	//alert(id_no);
	$.ajax({
		type: 'POST',
		url: 'settings/sub_link/sub_link_update_save_del.php',	
		data: { id: id_no, idvalue: idvalue, action: "update_t"  },
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

function item_check_uncheck(id, r_id){
	
	var id_value = $("#"+id+"").val();
	//alert(id_value);
	if(id_value == 0) {
		$("#"+id+"").val("1");
	} else {
		$("#"+id+"").val("0");
	}
	
	var idvalue = $("#"+id+"").val();
	var id_no = r_id;
	//alert(id_no);
	$.ajax({
		type: 'POST',
		url: 'settings/sub_link/sub_link_update_save_del.php',	
		data: { id: id_no, idvalue: idvalue, action: "update_c"  },
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

function update(){   



		var myvars = new Array();
			myvars[0] = "name";
			myvars[1] = "link_types";
			
			
        var valid =  error_check(myvars);
		
      	
	//alert(valid);
	
	var id 			= 	$('#id').attr('value');
	var name 		= 	$('#name').attr('value');
	var otherename 	=  	$('#otherename').attr('value');
	var bi 	=  	$('#bi').attr('value');
	var ind =  	$('#ind').attr('value');
	var bn 	=  	$('#bn').attr('value');
	var kr 	=  	$('#kr').attr('value');
	var sp 	=  	$('#sp').attr('value');
	var pr 	=  	$('#pr').attr('value');
	var jp 	=  	$('#jp').attr('value');
	var dt 	=  	$('#dt').attr('value');
	var it 	=  	$('#it').attr('value');
	var chi =  	$('#chi').attr('value');
	
	var main_link 	=  	$('#link_types').attr('value');
	var link_page 	=  	$('#link_page').attr('value');
	
	
//var master_category1 =  $('#master_category1').attr('value');	
 
	//alert(main_link);
	
	if(valid) {
	
		maskPage();
		
		$.ajax({
				type: 'POST',
				url: 'settings/sub_link/sub_link_update_save_del.php',	
				data: { name: name, otherename: otherename, bi: bi, ind: ind, bn: bn, kr: kr, sp: sp, pr: pr, jp: jp, dt: dt, it: it, chi: chi, id: id, main_link: main_link, link_page: link_page,  action: "update"  },
				success: function(data) {
						//alert(data);
						maskPage();
						if($.trim(data)=="1"){
							$("#action_message").text("Saved success !");
							$("#submit_this").attr("disabled", "disabled");
						}
						if($.trim(data)=="0"){
							$("#action_message").text("Saved unsuccess !");
						}
								
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
