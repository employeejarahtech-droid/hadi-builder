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

$xrow       = htmlspecialchars(trim($_GET['xrow']));

?>


<script type="text/javascript" src="settings/all_products/ajaxfileupload.js"></script>
<style type="text/css">
.option_width{
	width: 200px;
}
.detail_body{
	height: auto;
	width: 500px;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	border-top-style: none;
}

.imagearea{
	margin-right: auto;
	margin-left: auto;
	height: auto;
	width: 500px;
}
.images{
	padding: 3px;
	float: left;
	height: 120px;
	width: 100px;
	border: 1px solid #CCCCCC;
	margin-top: 5px;
	margin-right: 5px;
	margin-bottom: 5px;
	margin-left: 45px;
	position: relative;
}

.images span{ /*CSS for enlarged image*/
	background-color:transparent;
	padding: 5px;
	left: -100px;
	visibility: hidden;
	color: black;
	text-decoration: none;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	height: auto;
}



.images span #menutittle{ /*CSS for enlarged image*/
	DISPLAY: block;
	Z-INDEX: 6500;
	LEFT: 8px;
	WIDTH: 79px;
	POSITION: absolute;
	TOP: 21px;
	HEIGHT: 75px;
	padding-top: 6px;
	padding-right: 3px;
	padding-left: 3px;
	padding-bottom: 6px;
}

.images span #menutittle2{ /*CSS for enlarged image*/
	DISPLAY: block;
	Z-INDEX: 6500;
	LEFT: 120px;
	WIDTH: 358px;
	POSITION: absolute;
	TOP: -5px;
	HEIGHT: 442px;
	padding-top: 6px;
	padding-right: 3px;
	padding-left: 3px;
	padding-bottom: 6px;
	border: 1px solid #000000;
}

.images span #menutittle3{ /*CSS for enlarged image*/
	DISPLAY: block;
	Z-INDEX: 6500;
	LEFT: -380px;
	WIDTH: 358px;
	POSITION: absolute;
	TOP: -5px;
	HEIGHT: 442px;
	padding-top: 6px;
	padding-right: 3px;
	padding-left: 3px;
	padding-bottom: 6px;
	border: 1px solid #000000;
}

.images span #menutittle5{ /*CSS for enlarged image*/
	DISPLAY: block;
	Z-INDEX: 6500;
	LEFT: -380px;
	WIDTH: 358px;
	POSITION: absolute;
	TOP: -5px;
	HEIGHT: 442px;
	padding-top: 6px;
	padding-right: 3px;
	padding-left: 3px;
	padding-bottom: 6px;
	border: 1px solid #000000;
}


.images:hover span{ /*CSS for enlarged image on hover*/
	background-color:transparent;
	visibility: visible;
	top: auto;
	left: auto; /*position where enlarged image should offset horizontally */
}

.adjarea{
	height: auto;
	width: 500px;
	margin-top: 10px;
	margin-bottom: 5px;
}

.row_addj{
	height: auto;
	width: 500px;
}
.detail_de{
	background-color: #F9BAD4;
	border:1px solid #999999;
	width: 300px;
	float: right;
	height: auto;
	margin-right: 5px;
}

.detail_de textarea{
	padding: 0px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	width: 290px;
	background-color:transparent;
	margin-left: 5px;
	margin-top: 4px;
	margin-top: 4px;
	outline-color: transparent;
	outline-style: none;
	margin-bottom: 5px;
}
.tittle_de{
	background-color: #66CC99;
	border:1px solid #999999;
	border-radius:5px;
	width: 180px;
	float: left;
	height: 24px;
	margin-left: 5px;
	color: #FFFFFF;
	display: block;
	margin-bottom: 5px;
}
.tittle_de input{
	padding: 0px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	width: 170px;
	background-color:transparent;
	margin-left: 5px;
	margin-top: 4px;
	outline-color: transparent;
	outline-style: none;
	color: #000000;
}
.left_items{
	width: 175px;
	float: left;
}

.leftmargin{
	margin-left: 5px;
}
.edit_image{
	float: left;
	height: 20px;
	width: 60px;
	text-align: center;
	border:1px solid #000000;
	border-radius:5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	padding-top: 3px;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 10px;
	background-color: #FFCC66;
	cursor:pointer;
}

.edit_image:hover{
	float: left;
	height: 20px;
	width: 60px;
	text-align: center;
	border:1px solid #000000;
	border-radius:5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	padding-top: 3px;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 10px;
	background-color: #66CCFF;
	cursor:pointer;
}

.edit_image:active{
	float: left;
	height: 20px;
	width: 60px;
	text-align: center;
	border:1px solid #000000;
	border-radius:5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	padding-top: 3px;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 10px;
	background-color: #6699CC;
	cursor:pointer;
}

.button_tittle{
	float: left;
	height: 20px;
	width: 100px;
	text-align: center;
	border:1px solid #000000;
	border-radius:5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	padding-top: 3px;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 10px;
	background-color: #FFCC66;
	cursor:pointer;
}

.button_tittle:hover{
	float: left;
	height: 20px;
	width: 100px;
	text-align: center;
	border:1px solid #000000;
	border-radius:5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	padding-top: 3px;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 10px;
	background-color: #66CCFF;
	cursor:pointer;
}

.button_tittle:active{
	float: left;
	height: 20px;
	width: 100px;
	text-align: center;
	border:1px solid #000000;
	border-radius:5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	padding-top: 3px;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 10px;
	background-color: #6699CC;
	cursor:pointer;
}

.pro_category{
	border-top-width: 1px;
	border-bottom-width: 1px;
	border-top-style: dotted;
	border-bottom-style: dotted;
	border-top-color: #999999;
	border-bottom-color: #999999;
	height: auto;
	padding-top: 5px;
	padding-bottom: 5px;
}



		#editable
		{
			padding: 10px;
			float: left;
		}
		
		#editorheader{
			border-top-width: 1px;
			border-top-style: solid;
			border-top-color: #000000;			
		}

	</style>

<?php 
$table ="product";
$wherefieldname = "id";
$passid=$xrow;


$img1 = @ReturnAnyOneFieldFromAnyTable($table, "image1", $wherefieldname, $passid);
$img2 = @ReturnAnyOneFieldFromAnyTable($table, "image2", $wherefieldname, $passid);
$img3 = @ReturnAnyOneFieldFromAnyTable($table, "image3", $wherefieldname, $passid);
$img4 = @ReturnAnyOneFieldFromAnyTable($table, "image4", $wherefieldname, $passid);
$img5 = @ReturnAnyOneFieldFromAnyTable($table, "image5", $wherefieldname, $passid);
$img6 = @ReturnAnyOneFieldFromAnyTable($table, "image6", $wherefieldname, $passid);

$details = @ReturnAnyOneFieldFromAnyTable($table, "details", $wherefieldname, $passid);

 $sql = "select * from product_detail where product_id='".$xrow."' order by serial ASC";
					$result = mysql_query($sql);
					$j = 0;
					$total_data = mysql_num_rows($result);
					
?>


	<script src="ckeditor.js"></script>
	<script src="adapters/jquery.js"></script>
	<link href="sample.css" rel="stylesheet">

<div id="" class="detail_body">
	<div style="clear:both; width:100%; height:1px;"></div>
	
	<!-- image area start  -->
	
	<div id="imagearea<?php echo $xrow; ?>" class="imagearea">
	
	
		<div id="image1" class="images">
				<img src="../images/thumb/<?php echo $img1;  ?>" height="120" width="100" />
			<span>
				<div id="menutittle">
				 
					<div id="image_1" onclick="uploadimage('<?php echo $xrow; ?>', '1');" dir="click here and change picture" class="edit_image tooltip">Edit</div>	
					<div id="image_1" onclick="deleteimage('<?php echo $xrow; ?>', '1');" class="edit_image tooltip" dir="click here and delete this picture">Delete</div>				
				</div>	
				<div id="menutittle2">
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img1 == "" ?  "logo.gif" : $img1;  ?>" width="358" height="442" />				
				</div>
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
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img2 == "" ?  "logo.gif" : $img2;  ?>" width="358" height="442" />				
				</div>	
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
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img3 == "" ?  "logo.gif" : $img3;  ?>" width="358" height="442" />				
				</div>
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
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img4 == "" ?  "logo.gif" : $img4;  ?>" width="358" height="442" />				
				</div>
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
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img5 == "" ?  "logo.gif" : $img5;  ?>" width="358" height="442" />				
				</div>	
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
					<img id="main_product_large<?php echo $xrow;  ?>" src="../images/fixed/<?php echo $img6 == "" ?  "logo.gif" : $img6;  ?>" width="358" height="442" />				
				</div>
		  </span> 
	  </div>
		  
	</div>
	
	<!-- image area end  -->
		<div style="clear:both; width:100%; height:1px;"></div>
	
	<div id="pro_category<?php echo $xrow; ?>" class="pro_category" style="margin-top:10px; width:100%; margin-bottom:10px;">
		<div style="clear:both; width:100%; height:1px;"></div>
		<div id="left_category" class="category_tiitle" style="width:220px;float:left; margin-left:20px;">Change category of this product</div>
		<div id="right_category" style="float:right; width:250px;">
		    <select name="cat_change" id="cat_change" onchange="change_category('<?php echo $xrow; ?>', this.value);" class="option_width tooltip">
					<option value="">Select category</option>
				<?php $sqll = "select * from product_category order by serial ASC";
					$resultt = mysql_query($sqll);
					
					while ($roww = mysql_fetch_array($resultt)) {
					
					
					 ?>
						<option value="<?php echo $roww['id']; ?>"><?php echo $roww['name']; ?></option>
					
			   <?php }	?>		
			</select>
		</div>
		<div style="clear:both; width:100%; height:1px;"></div>
	</div>
	<!-- tittle button area start  -->
	
	<div class="product_title_buttonarea">
		<div class="_action_area">
		<div class="_buttons">
		 <div id="image_1" onclick="addnew_tittle('<?php echo $xrow; ?>')" dir="click to add new tittle" class="button_tittle tooltip">Add new tittle</div>
		</div>
		<div class="_buttons">
		 <div id="image_1" dir="click to delete selected tittle" class="button_tittle tooltip" onclick="delete_selected_tittle('<?php echo $xrow; ?>')">Delete Selected</div>
		</div>
		<div class="_buttons">
		    <div id="image_1" dir="click to add save all tittle" onclick="save_all_tittle('<?php echo $xrow; ?>');" class="button_tittle tooltip">Save Title</div>
		</div>
		
	</div>
	</div>
	
	<!-- tittle button area end  -->
	
	

	
	
	
	<div style="clear:both; width:100%; height:1px;"></div>
	
	<div id="all_tittle<?php echo $xrow; ?>" class="all_tittle">
	
				 
				<?php
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
						
	
					
				<?php } ?>	
				
				<input id="hidden_total_tittle<?php echo $xrow; ?>" name="hidden_total_tittle<?php echo $xrow; ?>" size="5" type="hidden" value="<?php echo $total_data; ?>" />	
	
	</div>
	
	<div id="editorheader" style="height:auto; width:100%;padding-top:5px;padding-bottom:5px; clear:both">
		<div style="padding-left:20px;float:left; width:200px;margin-top:10px;">Details here:</div><div id="buttons" style="float:right; width:200px;"><div class="_buttons">
		    <div id="image_1" dir="click to add save all tittle" onclick="save_details('<?php echo $xrow; ?>');" class="button_tittle tooltip">Save Details</div>
		</div></div>
	</div>
	
	<div id="editorarea" style="height:auto; width:100%; clear:both;">
	
					
		<textarea cols="80" id="editor<?php echo $xrow; ?>" name="editor<?php echo $xrow; ?>" rows="10">
		
				<?php echo $details; ?>
		
		</textarea>
		<script>

		CKEDITOR.disableAutoInline = true;
		CKEDITOR.config.startupMode = 'wysiwyg';

		$( document ).ready( function() {
	
			$('#editor<?php echo $xrow; ?>').ckeditor(); 
		
		} );
		


	</script>	
	
	</div>
	


<div style="clear:both; width:100%; height:1px;"></div>
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



	function keydown_expand(textarea){
		  var limit = 1200;
		  textarea.style.height = 30;
		  textarea.style.height = Math.min(textarea.scrollHeight, limit) + "px";	  
	}
	
</script>	

<script>

function change_category(productid, value){

		//alert(value);
	 
		$.ajax({
			type: 'POST',
			url: 'settings/all_products/save_tittle.php',	
			data: "id="+ productid
			+"& cuttent_cat="+ value 
			+"& action="+ "change_category" 
			,
			success: function(data) {
				//alert(data)
					//$(".current_detail").text(data);
					if($.trim(data)=="1"){
						//load_product_tiitle(productid);
						$('.cat_select').trigger('change');
					}
							
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//$(".current_detail").text('problem with network');
				    alert('problem with network : '+errorThrown);
				}
		});   
		 

}

function tag_change_category(productid, value){

		//alert(value);
	
		$.ajax({
			type: 'POST',
			url: 'settings/all_products/save_tittle.php',	
			data: "id="+ productid
			+"& cuttent_cat="+ value 
			+"& action="+ "update_search_category" 
			,
			success: function(data) {
				//alert(data)
					//$(".current_detail").text(data);
					if($.trim(data)=="1"){
						
						$.ajax({
							type: 'POST',
							url: 'settings/all_products/subcategory.php',	
							data: "cuttent_cat="+ value
							,
							success: function(html) {
										//alert(html)
										$("#tag_subcat_change"+productid+"").html(html);	
								},
								error: function (XMLHttpRequest, textStatus, errorThrown) {
									//$(".current_detail").text('problem with network');
									alert('problem with network : '+errorThrown);
								}
						});   
										
						
					}
							
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//$(".current_detail").text('problem with network');
				    alert('problem with network : '+errorThrown);
				}
		});   
		 

}

function tag_subcat_change_category(productid, value){

		//alert(value);
	
		$.ajax({
			type: 'POST',
			url: 'settings/all_products/save_tittle.php',	
			data: "id="+ productid
			+"& cuttent_subcat="+ value 
			+"& action="+ "update_search_subcategory" 
			,
			success: function(data) {
				//alert(data)
					//$(".current_detail").text(data);
					if($.trim(data)=="1"){

					}
							
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//$(".current_detail").text('problem with network');
				    alert('problem with network : '+errorThrown);
				}
		});   
		 
		 

}

function save_details(productid){

 maskPage();

		var details =$("#editor"+productid+"").val();
		
	
		
		$.ajax({
			type: 'POST',
			url: 'settings/all_products/insert_update_delete_product.php',	
			data: { id: productid, details: details, action: "save_details"  },
			success: function(data) {
					
					if($.trim(data)=="1"){
						 maskPage();
					} else {
						 maskPage();
					}
							
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					 maskPage();
				    alert('problem with network : '+errorThrown);
				}
		});   
		 
		 

}



function addnew_tittle(productid){

	//alert(productid);
		$.ajax({
			type: 'GET',
			url: 'settings/all_products/load_mainproduct.php',	
			data: "id="+ productid
			+"& action="+ "addnew_tittle" ,
			success: function(data) {
				//alert(data)
					//$(".current_detail").text(data);
					//if($.trim(data)=="1"){
						load_product_tiitle(productid);
					//}
							
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//$(".current_detail").text('problem with network');
				    alert('problem with network : '+errorThrown);
				}
		});   
		 

} 




function save_all_tittle(productid){    
                  
    var confirm_user = confirm("Do you want to save this?");
    if(confirm_user){
         var start = 1;
          var  end = $("#hidden_total_tittle"+productid+"").val();
			
				maskPage();
	            //$("#main_popup_message").text("Loading ...");	  
                  
                   for (i = start, j = end; i <= j; ++i) {
				   
				   		// hiddenid = $('#hiddentittleid'+i).val();
						hiddenid =  $("#all_tittle"+productid+" #hiddentittleid"+i+"").val();
						//alert(hiddenid);

                        try {                                 
                            tittle_name = $("#all_tittle"+productid+" #tittle_name"+i).val().replace(/&/gi, "^^^");
							tittle_detail_common = $("#all_tittle"+productid+" #tittle_detail_common"+i).val().replace(/&/gi, "^^^");
							serial = $("#all_tittle"+productid+" #serial"+i).val();
                     		action = "saveall_tittle";

                              $.ajax({
                                  type: "POST",
                                  url: "settings/all_products/save_tittle.php",
                                  data: "id="+ $.trim(hiddenid)
								  +"& tittle_name="+ $.trim(tittle_name)
								  +"& tittle_detail_common="+ $.trim(tittle_detail_common)
								  +"& serial="+ $.trim(serial)
                                  +"& action="+ "saveall_tittle"  
                                  ,
                                  success: function(data){

								  	if($.trim(data)=="1"){	
										
									}
                                  }	,
								error: function (XMLHttpRequest, textStatus, errorThrown) {	

								  $(".middle_main").text("Error: "+textStatus+": "+errorThrown);
								}				
                             });

                          }catch(e){
                                  alert(e.message);
                          } 
						  
						  if(i==end) {
						  		load_product_tiitle(productid);
						  	 	maskPage(); 
						  }
						                        
                   }
				   
				   
				 //  maskPage();
				   
           }    

 }   
 
 function delete_selected_tittle(productid){   

 			var start = 1;
             var  end = $("#hidden_total_tittle"+productid+"").val();
			
			var selecteditems = 0; 

		   for (i = start, j = end; i <= j; i++) {
		
				  id =  $("#all_tittle"+productid+" #hiddentittleid"+i+"").val();
					  
					  if($('#checked'+i).attr('checked')) {
					     selecteditems++;
					  }
		   
		   
		   }
		   
	
	
	if(selecteditems > 0) {
		//return true;

			 var confirm_user = confirm("Do you want to delete selected?");
				if(confirm_user){
					 var start = 1;
					   var  end = $("#hidden_total_tittle"+productid+"").val();
							  
							maskPage();
							//$("#main_popup_message").text("Loading ...");	  
							  
							   for (i = start, j = end; i <= j; ++i) {
									  
									
									
										  id =  $("#all_tittle"+productid+" #hiddentittleid"+i+"").val();
										  
										  if( $("#all_tittle"+productid+" #checked"+i).attr("checked")) {
				
											$.ajax({
													type: 'POST',
													url: "settings/all_products/save_tittle.php",
													data: "id="+ id
													+"& action="+ "delete_tittle" ,
													success: function(data) {
															//$(".current_detail").text(data);
															if($.trim(data)=="1"){
																
															}
																	
														},
														error: function (XMLHttpRequest, textStatus, errorThrown) {
															//$(".current_detail").text('problem with network');
															maskPage();
															alert('problem with network : '+errorThrown);
														}
												});   
										
												
									    }
										
										if(i==end) {
											load_product_tiitle(productid);
											maskPage();
										}
					        }
				}
				
		} else {
			alert("Select items first");
		}	   
 
									 
}



function load_product_tiitle(productid){

	$.ajax({
			type: 'GET',
			url: 'settings/all_products/load_tittle.php',	
			data: "id="+ productid
			+"& action="+ "load_tittle" ,
			success: function(data) {
				//alert(data)
					//$(".current_detail").text(data);
					//if($.trim(data)=="1"){
						//load_product_tiitle(productid);
						$("#all_tittle"+productid+"").html(data);
					//}
							
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//$(".current_detail").text('problem with network');
				    alert('problem with network : '+errorThrown);
				}
		});   

}


function callchg(){
	maskPage();
	//	alert('called change event');
		if(isImage($("#fileToUpload").val())){
			
 			//alert(this.files[0].size/1024+ ' KB');			
/*			if( parseInt(this.files[0].size/1024) >= 50) {
			   alert("Image size is too much long\nSize much within 100 KB");	
			} else {*/
				ajaxFileUpload($('#hiddenfield').val(), $('#cuurent_img').val());
			//}	
			
		} else {
			maskPage();
			alert("Please Select image only");
		}	
	
}
	
</script>


<script type="text/javascript">
	
	function uploadimage(id, current_img){
		
		$('#hiddenfield').val(id);
		$('#cuurent_img').val(current_img);
		$('#fileToUpload').trigger('click');
		
	}
	

function deleteimage(id, current_img){
	
	var confirm_user = confirm("Do you want to delete image?");
    if(confirm_user){
	
			 $('#hiddenfield').val(id);
			 $('#cuurent_img').val(current_img);
			
			  maskPage(); 
			 $.ajax({
				type: 'GET',
				url: 'settings/all_products/load_mainproduct.php',	
				 data: "id="+ id
						+"& action="+ "delete"
						+"& current_img="+ current_img
					  ,
				success: function(data) {

						if($.trim(data) == '1') {
							
							
							
							// load all image
							 $.ajax({
										type: 'POST',
										url: 'settings/all_products/load_images.php',	
										 data: "id="+ id ,
										success: function(data) {
												//alert("alast ajax call :"+admno + "cuurent_img : "+cuurent_img);
												$("#imagearea"+id).html(data);
												
												// load main image
												 $.ajax({
													type: 'GET',
													url: 'settings/all_products/load_mainproduct.php',	
													 data: "id="+ id
													  +"& action="+ "mainproduct"  
													  ,
													success: function(data) {
																//alert(data);
																/*$("#main_product"+admno+"").replaceWith('<img id="main_product'+admno+'" src="settings/all_products/primages/thumb/angelina_tmb.jpg" width="90px" height="90px" />');*/
																
																$("#main_product"+id+"").replaceWith('<img id="main_product'+id+'" src="../images/thumb/'+$.trim(data)+'" width="89px" height="89px" />');
																
																$("#main_product_large"+id+"").replaceWith('<img id="main_product_large'+id+'" src="../images/fixed/'+$.trim(data)+'" width="358px" height="442px" />');
																
															
																
															  maskPage(); 
															//$(".middle_main").load(data);
														},
														error: function (XMLHttpRequest, textStatus, errorThrown) {
														  // alert('problem with network');
														   maskPage(); 
														}
												 });
												
												//maskPage();
												
											},
											error: function (XMLHttpRequest, textStatus, errorThrown) {
											  $("#imagearea"+admno).text('problem with network'+errorThrown);
											  maskPage();
											}
										});
							

						}
					
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						maskPage();
					   $(".middle_main").text('problem with network : '+errorThrown);
					}
			});	
		
		}
	}
	
	
	function ajaxFileUpload(id, cuurent_img)
	{
		$("#image1")
		.ajaxStart(function(){
			
		})
		.ajaxComplete(function(){
			
		});
		
		var admno = id;

		 var url = "settings/all_products/doajaxfileupload.php?admno="+admno+"&cuurent_img="+cuurent_img;

		var data ={admno: admno, description:'short description'}
 
		 
		$.ajaxFileUpload
		(
			{
				url: url,
				type: "POST", 
				secureuri:false,				
				fileElementId: 'fileToUpload',
				dataType: 'json',
				success: function (data, status)
				{
					if(typeof(data.error) != 'undefined')
					{
						if(data.error != '')
						{
							alert(data.error);
						}else
						{
							
								  $.ajax({
									type: 'POST',
									url: 'settings/all_products/load_images.php',	
									 data: "id="+ admno ,
									success: function(data) {
											//alert("alast ajax call :"+admno + "cuurent_img : "+cuurent_img);
											$("#imagearea"+admno).html(data);
											
											// load main image
											 $.ajax({
												type: 'GET',
												url: 'settings/all_products/load_mainproduct.php',	
												 data: "id="+ admno
												  +"& action="+ "mainproduct"  
												  ,
												success: function(data) {
															//alert(data);
															//$("#main_product"+admno+"").replaceWith('<img id="main_product'+admno+'" src="settings/all_products/primages/thumb/angelina_tmb.jpg" width="90px" height="90px" />');
															$("#main_product"+admno+"").replaceWith('<img id="main_product'+admno+'" src="../images/thumb/'+$.trim(data)+'" width="89px" height="89px" />');
															
															$("#main_product_large"+id+"").replaceWith('<img id="main_product_large'+id+'" src="../images/fixed/'+$.trim(data)+'" width="358px" height="442px" />');
															
														  maskPage(); 
														//$(".middle_main").load(data);
													},
													error: function (XMLHttpRequest, textStatus, errorThrown) {
													  // alert('problem with network');
													   maskPage(); 
													}
											 });
											
											//maskPage();
											
										},
										error: function (XMLHttpRequest, textStatus, errorThrown) {
										  $("#imagearea"+admno).text('problem with network'+errorThrown);
										  maskPage();
										}
									});
	
							
						}
					}
				},
				error: function (data, status, e)
				{
					alert(e);
				}
			}
		)
		
		return false;

	}
	
	function getExtension(filename) {
		var parts = filename.split('.');
		return parts[parts.length - 1];
	}

	
		function isImage(filename) {
			var ext = getExtension(filename);
			switch (ext.toLowerCase()) {
			case 'jpg':
			case 'gif':
			case 'bmp':
			case 'png':
				//etc
				return true;
			}
			return false;
		}
		

///////////////////////////////////////////
///////////////////////////////////////////
//////////////////////////////////////////
function limitText(limitField, limitNum) {
	limitCount = 0;
	if (limitField.value.length > limitNum) {
		limitField.value = limitField.value.substring(0, limitNum);
	} else {
		limitCount.value = limitNum - limitField.value.length;
	}
	
}
   
   //limitText(this.form.limitedtextfield,this.form.countdown,15);
////////////////////////////////////
/////////////////////////////////////////
//////////////////////////////////////////
   


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
