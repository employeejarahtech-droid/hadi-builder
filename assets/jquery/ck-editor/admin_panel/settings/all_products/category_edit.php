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
._add_new_sponsor_area {
	color: #009933;
	height: auto;
	width: 630px;
	margin-top: 10px;
	margin-right: auto;
	margin-bottom: 10px;
	margin-left: auto;
}
._add_new_header{
	height: 30px;
	width: 100%;
	padding-top: 3px;
	padding-bottom: 3px;
	margin: 3px;
	font-family: "Times New Roman", Times, serif;
	font-size: 16px;
	color: #CC0033;
}

._add_data_header {
	height: 30px;
	margin: 3px;
	background-color: #009933;
	font-weight: bold;
	border: thin solid #009933;
	color: #FFFFFF;
}

.w_img{
	height: 20px;
	width: 40px;
	margin-top: auto;
	margin-right: auto;
	margin-bottom: auto;
	margin-left: auto;
	padding: 0px;
}
/* data area design   */
._add_data{
	height: 30px;
	border-bottom-width: thin;
	border-bottom-style: solid;
	border-bottom-color: #F0F0F0;
	margin: 3px;
	background-color: #F0F0F0;
}


._add_data .input{
	height: 22px;
	width: 270px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	padding-left: 2px;
}

._sponsor_tittle{
	color: #FFFFFF;
	float: left;
	width: 150px;
	margin-top: 7px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	font-style: normal;
	margin-left: 10px;
}
._sponsor_input{
	width: 250px;
	float: left;
	margin-top: 4px;
}

._sponsor_image_box {
	height: 65px;
	width: 350px;
	float: left;
	border: thin double #FFFFFF;
}
.yui3-button {
    /* Structure */
    display: inline-block;
    *display: inline; /*IE 6/7*/
    zoom: 1;
    font-size: 100%; 
    *font-size: 90%; /*IE 6/7 - To reduce IE's oversized button text*/
    *overflow: visible; /*IE 6/7 - Because of IE's overly large left/right padding on buttons */
    padding: 0.4em 1em 0.45em;
    line-height: normal;
    white-space: nowrap;
    vertical-align: baseline;
    text-align: center;
    cursor: pointer;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;

    /* Presentation */
    color: #444; /* rgba not supported (IE 8) */
    color: rgba(0, 0, 0, 0.80); /* rgba supported */
    *color: #444; /* IE 6 & 7 */
    border: 1px solid #999;  /*IE 6/7/8*/
    border: none rgba(0, 0, 0, 0);  /*IE9 + everything else*/
    background-color: #E6E6E6;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80ffffff', endColorstr='#00ffffff', GradientType=0);
    background-image: -webkit-gradient(linear, 0 0, 0 100%, from(rgba(255,255,255, 0.30)), color-stop(40%, rgba(255,255,255, 0.15)), to(transparent));
    background-image: -webkit-linear-gradient(rgba(255,255,255, 0.30), rgba(255,255,255, 0.15) 40%, transparent);
    background-image: -moz-linear-gradient(top, rgba(255,255,255, 0.30), rgba(255,255,255, 0.15) 40%, transparent);
    background-image: -ms-linear-gradient(rgba(255,255,255, 0.30), rgba(255,255,255, 0.15) 40%, transparent);
    background-image: -o-linear-gradient(rgba(255,255,255, 0.30), rgba(255,255,255, 0.15) 40%, transparent);
    background-image: linear-gradient(rgba(255,255,255, 0.30), rgba(255,255,255, 0.15) 40%, transparent);
    text-decoration: none;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-box-shadow: 0 0 0 1px rgba(0,0,0, 0.25) inset, 0 2px 0 rgba(255,255,255, 0.30) inset, 0 1px 2px rgba(0,0,0, 0.15);
    -moz-box-shadow: 0 0 0 1px rgba(0,0,0, 0.25) inset, 0 2px 0 rgba(255,255,255, 0.30) inset, 0 1px 2px rgba(0,0,0, 0.15);
    box-shadow: 0 0 0 1px rgba(0,0,0, 0.25) inset, 0 2px 0 rgba(255,255,255, 0.30) inset, 0 1px 2px rgba(0,0,0, 0.15);

    /* Transitions */
    -webkit-transition: 0.1s linear -webkit-box-shadow;
    -moz-transition: 0.1s linear -moz-box-shadow;
    -ms-transition: 0.1s linear box-shadow;
    -o-transition: 0.1s linear box-shadow;
    transition: 0.1s linear box-shadow;
}

._ban_left{
	float: left;
	height: 100px;
	width: 430px;
	margin-left: 8px;
	border: 1px solid #666666;
}
._ban_right{
	float: right;
	height: 100px;
	width: 80px;
	margin-right: 7px;
	border: 1px solid #666666;
}

._active{
	margin-top: 20px;
	width: 70px;
	margin-left: 5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	text-align: center;
	background-color: #F0F0F0;
	cursor:pointer;
}

._active:hover{
	margin-top: 20px;
	width: 70px;
	margin-left: 5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	text-align: center;
	background-color: #66CC66;
	cursor:pointer;
}

._listdata{
	margin-bottom: 2px;
	height: auto;
	width: 630px;
	margin-top: 2px;
	padding-bottom: 10px;
	border-bottom-width: 1px;
	border-bottom-style: dotted;
	border-bottom-color: #666666;
	clear: both;
}

._tittle_common{
	float: left;
	height: auto;
	width: 615px;
	margin-left: 10px;
}

._detail_common{
	float: left;
	height: auto;
	width: 510px;
	margin-bottom: 10px;
	background-color: #F0F0F0;	/*border:1px solid #999999;*/
	margin-left: 10px;
	margin-top: 10px;
	border:1px solid #FFFFFF;
}
._detail_common:hover{
	float: left;
	height: auto;
	width: 510px;
	margin-bottom: 10px;
	background-color: #F0F0F0;
	border:1px solid #999999;
	margin-left: 10px;
	margin-top: 10px;
}
.detail_common{
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
}
.autoexpand{
	height: auto;
	width: 510px;
	padding: 3px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	text-align: justify;
	float: left;
	overflow: hidden;
	
	outline-color: transparent;
  	outline-style: none;
}

.tittlecommon{
	padding: 0px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	width: 240px;
	background-color: #F0F0F0;
	margin: 5px;
	
	outline-color: transparent;
  	outline-style: none;
}

.tittlecommon[title]:hover:after {
  content: attr(title);
  padding: 4px 8px;
  color: #333;
  position: absolute;
  left: 0;
  top: 100%;
  white-space: nowrap;
  z-index: 20px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-box-shadow: 0px 0px 4px #222;
  -webkit-box-shadow: 0px 0px 4px #222;
  box-shadow: 0px 0px 4px #222;
  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #eeeeee),color-stop(1, #cccccc));
  background-image: -webkit-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -moz-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -ms-linear-gradient(top, #eeeeee, #cccccc);
  background-image: -o-linear-gradient(top, #eeeeee, #cccccc);
}

._bottom{
	background-color: #F0F0F0;
	border:1px solid #999999;
	border-radius:5px;
	width: 250px;
	float: left;
}
._buttonarea{
	width: 330px;
	margin-top: 10px;
	margin-right: 5px;
	margin-bottom: 2px;
	margin-left: 5px;
	float: right;
}

._action_area{
	height: auto;
	margin-top: 10px;
	margin-bottom: 10px;
	width: 450px;
	margin-left: 40px;
}
._buttons{
	padding: 5px;
	float: left;
	height: 20px;
	width: 120px;
	margin-left: 17px;
	margin-bottom: 10px;
}

._leftmarning{
	margin-left: 5px;
}




</style>



<div class="_add_new_sponsor_area">
	<div class="_add_data_header">
		<div class="_sponsor_tittle"> Actions </div>
	</div>
  <div style="clear:both; width:100%; height:1px;"></div>
	<div class="_action_area">
		<div class="_buttons">
		  <div id="_addnew"  name="_addnew" onclick="add_new()" class="yui3-button1 tooltip" dir="Click here to add new">Add new data</div>
		</div>
		<div class="_buttons">
		  <div id="_delete"  name="_delete" onclick="delete_now();" dir="Click here to delete selected" class="yui3-button1 tooltip" >Delete Selected</div>
		</div>
		<div class="_buttons">
		  
		     <div id="_save" name="_save" class="yui3-button1 tooltip" dir="Click here to save changes" onclick="posting();"> Save All</div>
		 
		</div>
	</div>
	<div style="clear:both; width:100%; height:1px;"></div>
	<div class="_add_data_header">
		<div class="_sponsor_tittle">List of Category </div>
	</div>
	<div style="clear:both; width:100%; height:1px;"></div>
	<?php 	$sql1 = "select * from product_category  order by serial asc";
			$rsd1 = mysql_query($sql1);
			
			$number_total = mysql_num_rows($rsd1);
			
			/*if($number_total ){
			
			}*/
			?>
			<input name="hiden_total_c" id="hiden_total_c" type="hidden" value="<?php echo $number_total; ?>" />
			<?php
			$i = 0;
			 while($result1 = mysql_fetch_assoc($rsd1)){ 
			 
			  	$titile = 	ReturnAnyOneFieldFromAnyTable("product_category", "name", "id", $result1["id"]); 
				$serial = 	ReturnAnyOneFieldFromAnyTable("product_category", "serial", "id", $result1["id"]);
				$main = 	ReturnAnyOneFieldFromAnyTable("product_category", "main", "id", $result1["id"]);
				
				$i++;
				
				 ?>
  <div id="<?php echo $i; ?>" class="_listdata">
  
  		<div class="_tittle_common">
			<div class="_bottom tooltip" dir="Click here and change">
				
				<input id="hiddenid_c<?php echo $i; ?>" type="hidden" name="hiddenid_c<?php echo $i; ?>" value="<?php echo $result1["id"]; ?>" />
				<input id="tittle_common_c<?php echo $i; ?>" type="text" name="tittle_common_c<?php echo $i; ?>" value="<?php echo $titile; ?>" class="tittlecommon" />
				
			</div>
		  <div class="_buttonarea">Serial : <input onkeyup="checkInput(this);" onkeydown="checkInput(this);" name="serial_c<?php echo $i; ?>" id="serial_c<?php echo $i; ?>" type="text" size="2" value="<?php echo $serial; ?>" maxlength="2" />
			  
			  <input type="checkbox" id="checked_c<?php echo $i; ?>" class="_leftmarning" name="checked_c<?php echo $i; ?>" value="checkbox" />
			  
			 Main : <select name="cat_sub<?php echo $result1["id"]; ?>" id="cat_sub<?php echo $result1["id"]; ?>" class="cat_sub<?php echo $result1["id"]; ?> tooltip" title="Change category" onchange="initial_main_cat('<?php echo $result1["id"]; ?>');" style="width:195px;">
					
				<?php $sql = "select * from product_category order by serial ASC ";
					$result = mysql_query($sql);
					$selected = "";  ?>
					<option value="0" selected="">Root ...</option>
				<?php	while ($row = mysql_fetch_array($result)) {
							if($main == $row['id']){	
								$selected="selected";
							} else {
								$selected="";
							}
							
							if($result1["id"] != $row['id']) {
							 ?>
								<option value="<?php echo $row['id']; ?>" <?php echo $selected; ?>><?php echo $row['name']; ?></option>	
			     			<?php	 
							}
					
					} ?>
			   
			   	
			</select>
			 
		  </div>
		</div>
		
		<div style="clear:both; width:100%; height:1px;"></div>
  </div>
				
	<div style="clear:both; width:100%; height:1px;"></div>
				
	<?php   } ?>			
</div>
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



function checkInput(ob) {
  var invalidChars = /[^0-9]/gi
  if(invalidChars.test(ob.value)) {
            ob.value = ob.value.replace(invalidChars,"");
      }
}

function posting(){    
                  
    var confirm_user = confirm("Do you want to save this?");
    if(confirm_user){
         var start = 1;
          var  end = $('#hiden_total_c').val();
                  
				maskPage();
	            //$("._product").text("Loading ...");	  
                  
                   for (i = start, j = end; i <= j; ++i) {
                          
                          
                          try {                                 
                            hiddenid = $('#hiddenid_c'+i).val();
							tittle_common = $('#tittle_common_c'+i).val();
							serial = $('#serial_c'+i).val();
                     		action = "update";
                          // alert(dl_machine_id);
                              $.ajax({
                                  type: "POST",
                                  url: "settings/all_products/category_update_save_del.php",
                                  data: "id="+ $.trim(hiddenid)
                                  +"& tittle_common="+ $.trim(tittle_common)
								  +"& serial="+ $.trim(serial)
                                  +"& action="+ "update"  
                                  ,
								  data: { id: hiddenid, tittle_common: tittle_common, serial: serial, action: "update"  },
                                  success: function(data){
								  	
								  	if($.trim(data)=="1"){
                                        load_self();
										scroolTo_f();
									}
                                  }	,
								error: function (XMLHttpRequest, textStatus, errorThrown) {	

								  $("._products2").text("Error: "+textStatus+": "+errorThrown);
								}				
                             });

                           

                          }catch(e){
                                  alert(e.message);
                          } 
						  
						  if(i==end)
						  	 maskPage();
						                        
                   }
				   
				 //  maskPage();
				   
           }    

 }   


	function keydown_expand(textarea){
	  var limit = 500;
	  textarea.style.height = 50;
	  textarea.style.height = Math.min(textarea.scrollHeight, 500) + "px";
	}

function add_new(){   
	
	maskPage();
	$.ajax({
			type: 'POST',
			url: 'settings/all_products/category_update_save_del.php',	
			data: "action="+ "addnew" ,
			success: function(data) {
					//$(".current_detail").text(data);
					if($.trim(data)=="1"){
						load_self();
						scroolTo_f();
						maskPage();
					}
					
					if($.trim(data)=="3"){
						maskPage();
						alert("your reached maximum !")
					}
							
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//$(".current_detail").text('problem with network');
					maskPage();
				    alert('problem with network : '+errorThrown);
				}
		});   
		 
}




function delete_now(){   

 			var start = 1;
            var  end = $('#hiden_total_c').val();
			
			var selecteditems = 0; 

		   for (i = start, j = end; i <= j; i++) {
		
				  id = $('#hiddenid'+i).val();
					  
					  if($('#checked_c'+i).attr('checked')) {
					     selecteditems++;
					  }
		   
		   
		   }
		   
	
	
	if(selecteditems > 0) {
		//return true;

			 var confirm_user = confirm("Do you want to delete selected?");
				if(confirm_user){
					 var start = 1;
					  var  end = $('#hiden_total_c').val();
							  
							maskPage();
							//$("._products2").text("Loading ...");	  
							  
							   for (i = start, j = end; i <= j; ++i) {
									  
									
									
										  id = $('#hiddenid_c'+i).val();
										  
										  if($('#checked_c'+i).attr('checked')) {
				
											$.ajax({
													type: 'POST',
													url: 'settings/all_products/category_update_save_del.php',	
													data: "id="+ id
													+"& action="+ "delete" ,
													success: function(data) {
															//$(".current_detail").text(data);
															if($.trim(data)=="1"){
																load_self();
																scroolTo_f();
															}
																	
														},
														error: function (XMLHttpRequest, textStatus, errorThrown) {
															//$(".current_detail").text('problem with network');
															maskPage();
															alert('problem with network : '+errorThrown);
														}
												});   
										
												
									    }
										
										if(i==end)
											maskPage();
					        }
				}
				
		} else {
			alert("Select items first");
		}	   
 
									 
}



	

function load_self(){

		$("._products2").html('<div style="text-align:center;font-size:14px;font-weight:bold;height:500px;"> Loading... </div>');
		 $("._products2").load("settings/all_products/category_edit.php",function(responseTxt,statusTxt,xhr){
			if(statusTxt=="success")
			  //alert("External content loaded successfully!");
			if(statusTxt=="error")
			  $("._products2").text("Error: "+xhr.status+": "+xhr.statusText);
		  });
		 
		 //reload page
		//window.location.reload();
}



function initial_main_cat(value)
{
	maskPage(); 
	var id = value;
	var maincat=$("#cat_sub"+value).val();

	
	$.ajax
	({
		type: "POST",
		url: "settings/all_products/category_update_save_del.php",
		 data: { id: $.trim(id), maincat: maincat, action: "initial_main_cat"  },
		success: function()
		{
			load_self();
			maskPage(); 
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
