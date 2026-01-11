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

	<div id="header_text">Add new Link </div>
	
	<div id="clear"></div>

	<div id="field_content">
		<div id="tittle">Name </div> 
		<div id="field"><input class="input_single" id="name" name="name" type="text" value="<?php echo ReturnAnyOneFieldFromAnyTable("settings", "valuess", "name", "name"); ?>" /></div>
		<div id="s_name" class="_span"></div>

	</div>
	<div id="field_content">
		<div id="tittle"><span id="yiv6205586076yui_3_13_0_ym1_7_1394010749944_20">Web address </span></div>
		<div id="field"><input class="input_single" id="address" name="address" type="text" value="<?php echo ReturnAnyOneFieldFromAnyTable("settings", "valuess", "name", "addresss"); ?>" /></div>
		<div id="s_address" class="_span"></div>
		
	</div>
	<div id="field_content">
		<div id="tittle">Start date </div>
		<div id="field"><input class="input_single" id="sdate" name="sdate" type="text" value="<?php echo ReturnAnyOneFieldFromAnyTable("settings", "valuess", "name", "selecteddate"); ?>" /></div>
		
	</div>
	<div id="field_content">
		<div id="tittle">User Name </div>
		<div id="field"><input class="input_single" id="u_name" name="u_name" type="text" value="<?php echo ReturnAnyOneFieldFromAnyTable("settings", "valuess", "name", "username"); ?>" /></div>
		<div id="s_u_name" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Password</div>
		<div id="field"><input class="input_single" id="u_pass" name="u_pass" type="text" value="<?php echo ReturnAnyOneFieldFromAnyTable("settings", "valuess", "name", "password"); ?>" /></div>
		<div id="s_u_pass" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Email</div>
		<div id="field"><input class="input_single" id="email" name="email" type="text" value="<?php echo ReturnAnyOneFieldFromAnyTable("settings", "valuess", "name", "email"); ?>" /></div>
		<div id="s_email" class="_span"></div>
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
			myvars[0] = "name";
			myvars[1] = "address";
			myvars[2] = "u_name";
			myvars[3] = "u_pass";
			myvars[4] = "email";
			
			
        var valid =  error_check(myvars);	
		
      	
	//alert(valid);
	
	
	var name 		= 	$('#name').attr('value');
	var address 	=  	$('#address').attr('value');
	var sdate 		=  	$('#sdate').attr('value');
	var u_name 		=  	$('#u_name').attr('value');
	var u_pass 		=  	$('#u_pass').attr('value');
	var email 		=  	$('#email').attr('value');

	
 
	//alert(link_types);
	
	if(valid) {
	
		maskPage();
		
		$.ajax({
				type: 'POST',
				url: 'settings/settings/settings_update_save_del.php',	
				data: { name: name, address: address, sdate: sdate, u_name: u_name, u_pass: u_pass, email: email, action: "update"  },
				success: function(data) {
						//alert(data);
						maskPage();
						if($.trim(data)=="1"){
							$("#action_message").text("Saved success !");
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

<script type="text/javascript">

			new datepickr('sdate', {
				'dateFormat': 'd-m-Y'
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
