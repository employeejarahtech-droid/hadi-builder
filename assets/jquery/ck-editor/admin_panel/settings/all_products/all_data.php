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

.cat_select{
	width: 200px;
}

.pages{
	width: 50px;
}

.pagination_category{
	height: 30px;
	width: 570px;
	margin-top: 10px;
	text-align: right;
	border-bottom-width: 1px;
	border-bottom-style: dotted;
	border-bottom-color: #999999;
	margin-right: auto;
	margin-left: auto;
}
.data_cat{
	height: 30px;
	width: 55px;
	float: left;
}
.data_catfield{
	height: 30px;
	width: 205px;
	float: left;
}
.add_product_bt{
	height: 30px;
	width: 70px;
	float: left;
	margin-left: 10px;
}
.fileupload_display_none{
	display: none;
}

.buttonposition{
	top: -3px;
}
</style>

<div class="pagination_category">
	<div class="data_cat">Category</div>
	<div class="data_catfield">
	<select name="cat_select" id="cat_select" class="cat_select tooltip" title="Change category">
					
				<?php //$sql = "select * from product_category order by serial ASC";
				 $sql ="SELECT * from product_category where main='0' order by serial ASC";
					$result = mysql_query($sql);
					
					$txt="";
					
					while ($row = mysql_fetch_array($result)) {

					 ?>
							<option value="<?php echo $row['id']; ?>"><?php echo $txt.$row['name']; ?></option>

					<?php
									$sql_submenu_n ="SELECT * from product_category where
														main='".$row['id']."' order by serial ASC";
									$result_submenu_n = @mysql_query($sql_submenu_n);
									$total_submenu_n = @mysql_num_rows($result_submenu_n);
									
									if( $total_submenu_n > 0) {
										while ($row_submenu_n = @mysql_fetch_array($result_submenu_n)) {
											
										 ?>
											<option value="<?php echo $row_submenu_n['id']; ?>">
											<?php echo ' - '.$row_submenu_n['name']; ?></option>
						<?php				
										}
									}
								
						
						
						
						
					 ?>
					
						
			   <?php }	?>		
			</select>
	
	</div>
	<div class="data_cat">Page </div>
	<div class="data_cat">
	<select name="pages" id="pages" class="pages">
						
	</select>
	<input name="total_field" class="total_field" id="total_field" type="hidden" value="" />
	<input name="current_p_field" class="current_p_field" id="current_p_field" type="hidden" value="" />
	</div>
	<div class="add_product_bt"> <div id="addnewproduct" name="button"  value="Add New" class="buttonposition yui3-button1 tooltip" dir="Click here to add new product" >Add New </div></div>
	<div class="add_product_bt"> <div id="saveserial" dir="Click here to serialize product" onclick="updateserial();" name="button"  class="buttonposition yui3-button1 tooltip">Save Serial</div>
	  </div>
</div>
<div style="clear:both; height:1px;"></div>
<form enctype="multipart/form-data" id="formID" onSubmit="javascript:void(null);" action="javascript:void(null);">
					<input name="fileToUpload"  class="fileupload_display_none" id="fileToUpload" onchange="callchg();"  type="file" />
					<input name="hiddenfield" id="hiddenfield" type="hidden" />
					<input name="cuurent_img" id="cuurent_img" type="hidden" />
					</form>
<div id="all_data_body">


</div>
<script>
/*  // fixed asset
    $("#hide_show").addClass('drop_down_button_show');
   
    $('.main_title_data').hover( function() {
            $("#hide_show").addClass('drop_down_button_show');
    }, function() {
            $("#hide_show").removeClass('drop_down_button_show');
			$("#hide_show").removeClass('drop_down_button_show');
    });*/
	
/*$("#hide_show").click(function() {
	 $(".data_detail").show();
});
*/

$(document).ready(function(){	

	
	//$('select#cat_select').val('1').trigger('change');
	

});

function delete_product(productid){

    var confirm_user = confirm("Do you want to save this?");
    if(confirm_user){
		$.ajax({
			type: 'POST',
			url: 'settings/all_products/save_tittle.php',	
			data: "id="+ productid
			+"& action="+ "delete_product" ,
			success: function(data) {
			
					if($.trim(data)=="1"){
						$('.cat_select').trigger('change');
					}
							
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//$(".current_detail").text('problem with network');
				    alert('problem with network : '+errorThrown);
				}
		}); 
		
	}  

}

function updateserial(){    
                  
    var confirm_user = confirm("Do you want to save this?");
    if(confirm_user){
         var start = 1;
          var  end = $('.total_field').val();

				//maskPage();
	            //$("#main_popup_message").text("Loading ...");	  
                  //alert("Stated");
                   for (i = start, j = end; i <= j; i++) {
                          // alert(i);
                          try {                                 
                            hiddenid = $('#hiddenid'+i).val();

							//tittle_common = $('#tittle_common'+i).val();
							serial = $('#serial'+i).val();
							//detail_common = $('#detail_common'+i).val();
                     		action = "update";
                          // alert(dl_machine_id);
                              $.ajax({
                                  type: "POST",
                                  url: "settings/all_products/update_serialof_product.php",
                                  data: "id="+ $.trim(hiddenid)
								  +"& serial="+ $.trim(serial)
                                  +"& action="+ "update"  
                                  ,
                                  success: function(data){
									
									//maskPage(); 
									//alert(data);
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
						  		$('.cat_select').trigger('change');
						  	 //	maskPage(); 
						  }
						                        
                   }
				   
				 //  maskPage();
				   
           }    

 }   


$(".cat_select").change(function()
{
	maskPage(); 
	var id=$(this).val();
	var dataString = 'id='+ id;
	
	$.ajax
	({
		type: "POST",
		url: "settings/all_products/pages.php",
		data: dataString,
		cache: false,
		success: function(html)
		{
			$(".pages").html(html);
			$('.pages').trigger('change');
			maskPage(); 
		} 
	});

});

$(".pages").change(function()
{
	maskPage(); 
	var category=$(".cat_select").val();
	var page=$(this).val();
	//var dataString = 'id='+ id;
	//alert("Selected : Category"+category + " Pages :"+page);
	
	$.ajax
	({
		type: "POST",
		url: "settings/all_products/data_with_change_pagenumber.php",
		 data: "category="+ $.trim(category)
			  +"& page="+ $.trim(page)
			   +"& calledto="+ "totaldata"
			  ,
		cache: false,
		success: function(html)
		{
			//alert(html);
			$('.total_field').val($.trim(html));
			
		} 
	});
	
	$.ajax
	({
		type: "POST",
		url: "settings/all_products/data_with_change_pagenumber.php",
		 data: "category="+ $.trim(category)
			  +"& page="+ $.trim(page)
			  +"& calledto="+ "alldata"
			  ,
		cache: false,
		success: function(html)
		{
			$("#all_data_body").text("Loading...");
			$("#all_data_body").html(html);
			maskPage(); 
		} 
	});

});



function editclick(xrow){  

	$("#tabs li:nth-child(3)").trigger('click');

	  $.ajax({
		type: 'GET',
		url: 'settings/all_products/data.php',	
		data: "xrow="+ xrow,
		success: function(data) {
	
				$("._products3").html(data);
				
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			   $(".middle_main").text('problem with network');
			}
		});
	  
}


function save_product(id, serial){    
                  

	$("#current_p_field").val(serial);
 
    var confirm_user = confirm("Do you want to save this?");
    if(confirm_user){
        	maskPage(); 
                          
                         try {   
						                               
						  
							textfield_name = $('#textfield_name'+id+'').val();
							textfield_pr_code = $('#textfield_pr_code'+id+'').val();
							textfield_price = $('#textfield_price'+id+'').val();
							textfield_qunatityinbox = $('#textfield_qunatityinbox'+id+'').val();
							
							textarea_short = $('#textarea_short'+id+'').val();
							textarea_color = $('#textarea_color'+id+'').val();
							textarea_size = $('#textarea_size'+id+'').val();
							
 
                     		action = "save_product";

                              $.ajax({
                                  type: "POST",
                                  url: "settings/all_products/insert_update_delete_product.php",
                                  data: { id: $.trim(id), textfield_name: textfield_name, textfield_pr_code: textfield_pr_code, textfield_price: textfield_price, textfield_qunatityinbox: textfield_qunatityinbox, textarea_short: textarea_short, textarea_color: textarea_color, textarea_size: textarea_size, action: "save_product"  },
                                  success: function(data){

									if($.trim(data)=="0"){
								  		maskPage(); 
									}
								  	if($.trim(data)=="1"){
									
									
										         $.ajax({
													  type: "POST",
													  url: "settings/all_products/after_save_product_detail.php",
													  data: "id="+ $.trim(id)
													  +"& action="+ "call_save_data"  
													  ,
													  success: function(data){
															$("#right_data_p"+serial+"").html(data);
																maskPage(); 
													  }	,
													error: function (XMLHttpRequest, textStatus, errorThrown) {	
														maskPage(); 
													  $(".middle_main").text("Error: "+textStatus+": "+errorThrown);
													}				
												 });
														  
										
										
										
										
									}
                                  }	,
								error: function (XMLHttpRequest, textStatus, errorThrown) {	
									maskPage(); 
								  $(".middle_main").text("Error: "+textStatus+": "+errorThrown);
								}				
                             });

                           

                          } catch(e) {
						  		maskPage(); 
                                  alert(e.message);
                          } 

				   
           }    

 }   


function loaddetail(xrow){  
	//alert(xrow);
	maskPage(); 
	var isVisible = $("#data_detail"+xrow+"").is(':visible');
	var isHidden = $("#data_detail"+xrow+"").is(':hidden');  
	if(isVisible) {
		$("#data_detail"+xrow+"").fadeOut('slow');  
		$("#hide_show"+xrow+"").text('[+]');
		// $("#data_detail"+xrow+"").hide();
		maskPage(); 
		
	}  
	     
   	if(isHidden) {
		
		$("#hide_show"+xrow+"").text('[-]'); 
		
		 $.ajax({
			type: 'GET',
			url: 'settings/all_products/data_detail.php',	
			data: "xrow="+ xrow,
			success: function(data) {
				//alert(data);
					 $("#data_detail_master"+xrow+"").text('Loading ...');
					 $("#data_detail_master"+xrow+"").html(data,function(responseTxt,statusTxt,xhr){
						if(statusTxt=="success")
						  //alert("External content loaded successfully!");
						if(statusTxt=="error")
						  alert("Error: "+xhr.status+": "+xhr.statusText);
					  });
					  maskPage(); 
					//$(".middle_main").load(data);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				   alert('problem with network');
				   maskPage(); 
				}
		});
		
		$("#data_detail"+xrow+"").fadeIn('slow'); 
		// $("#data_detail"+xrow+"").show();
	}     
		 
}
	
	
$("#addnewproduct").click(function() {
	

	var category = $('.cat_select').val();
	
	if(category > 0) {
		maskPage();
		var action ="new";
		  $.ajax({
			type: 'POST',
			url: 'settings/all_products/insert_update_delete_product.php',	
			 data: "category="+ $.trim(category)
				  +"& action="+ $.trim(action)
				  ,
			success: function(data) {
			
					if($.trim(data)=="3"){
						maskPage();
						alert("your reached maximum !")
					}
					if($.trim(data)=="1"){
						$('.cat_select').trigger('change');
						maskPage();
					}
					
					
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
				   $(".middle_main").text('problem with network'+errorThrown);
				}
			});
			
	} else {
		alert("Your Category is null");
	
	}
	
	  
});

function checkInput(ob) {
  var invalidChars = /[^0-9]/gi
  if(invalidChars.test(ob.value)) {
            ob.value = ob.value.replace(invalidChars,"");
      }
}



$('.cat_select').trigger('change');



function limitText(limitField, limitNum) {

		//alert(limitField);
	limitCount = 0;
	if (limitField.value.length > limitNum) {
		limitField.value = limitField.value.substring(0, limitNum);
	} else {
		limitCount = limitNum - limitField.value.length;
	}
	
	
}
   
   
</script>
<script language="javascript">

function enable_cart(id){

	var activated  =  $("#message"+id+"").text();
	var send_data = 0;
	if(activated == "Cart Enable") {
		send_data = 1;
	} else {
		send_data = 0;
	}

	 $.ajax({
		  type: "GET",
		  url: "settings/all_products/load_mainproduct.php",
		  data: "id="+ $.trim(id)
		  +"& send_data="+ $.trim(send_data)
		  +"& action="+ "cart_fact"  
		  ,
		  success: function(data){

			if($.trim(data)=="1"){
				if(activated == "Cart Enable") {
					$("#message"+id+"").text("Cart Disable");
				} else {
					$("#message"+id+"").text("Cart Enable");
				}
			}
			
		  }	,
		error: function (XMLHttpRequest, textStatus, errorThrown) {	

		  $("._products").text("Error: "+textStatus+": "+errorThrown);
		}				
	 });


}

</script>
