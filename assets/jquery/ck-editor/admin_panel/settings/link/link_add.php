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
		<div id="tittle">Name (English) </div>
		<div id="field"><input class="input_single" id="name" name="name" type="text" /></div>
		<div id="s_name" class="_span"></div>

	</div>
	<div id="field_content">
		<div id="tittle">&nbsp;<span id="yiv6205586076yui_3_13_0_ym1_7_1394010749944_20">&#1593;&#1585;&#1576;&#1610;</span></div>
		<div id="field"><input class="input_single" style="text-align:right;" id="otherename" name="otherename" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Bahasa Indonesia</div>
		<div id="field"><input class="input_single" id="bi" name="bi" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#2361;&#2367;&#2344;&#2381;&#2342;&#2368;</div>
		<div id="field"><input class="input_single" id="ind" name="ind" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#2476;&#2494;&#2434;&#2482;&#2494;</div>
		<div id="field"><input class="input_single" id="bn" name="bn" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#54620;&#44397;&#50612;</div>
		<div id="field"><input class="input_single" id="kr" name="kr" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Espa&ntilde;ol</div>
		<div id="field"><input class="input_single" id="sp" name="sp" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Portugu&ecirc;s</div>
		<div id="field"><input class="input_single" id="pr" name="pr" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#26085;&#26412;&#35486;</div>
		<div id="field"><input class="input_single" id="jp" name="jp" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Deutsch</div>
		<div id="field"><input class="input_single" id="dt" name="dt" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Italiano</div>
		<div id="field"><input class="input_single" id="it" name="it" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">&#20013;&#25991;(&#31616;&#20307;)</div>
		<div id="field"><input class="input_single" id="chi" name="chi" type="text" /></div>
		<div id="s_otherename" class="_span"></div>
	</div>
	<div id="field_content">
		<div id="tittle">Link Type </div>
		<div id="field"><span class="_sponsor_input">
		  
		 <select name="link_types" id="link_types" class="list_menu">
					<option value="">Select </option>
				<?php $sql = "select * from link_type";
					$result = mysql_query($sql);
						
					while ($row = mysql_fetch_array($result)) {
				 ?>
						<option value="<?php echo $row['id']; ?>" ><?php echo $row['name']; ?></option>
					
			   <?php }	?>		
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
				 ?>
						<option value="<?php echo $row_p['name']; ?>" ><?php echo $row_p['name']; ?></option>
					
			   <?php }	?>		
			</select>
		</span></div>
		<div id="s_link_types" class="_span"></div>
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
			//myvars[1] = "otherename";
			myvars[1] = "link_types";
			
			
        var valid =  error_check(myvars);	
		
      	
	//alert(valid);
	
	
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
	
	var link_types 	=  	$('#link_types').attr('value');
	var link_page 	=  	$('#link_page').attr('value');
	

 
	//alert(link_types);
	
	if(valid) {
	
		maskPage();
		
		$.ajax({
				type: 'POST',
				url: 'settings/link/link_update_save_del.php',	
				data: { name: name, otherename: otherename, bi: bi, ind: ind, bn: bn, kr: kr, sp: sp, pr: pr, jp: jp, dt: dt, it: it, chi: chi, link_types: link_types,link_page: link_page, action: "addnew"  },
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
