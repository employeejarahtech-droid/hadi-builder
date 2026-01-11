<?php @session_start();
@include('../../connection.php');

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
 
<link rel="stylesheet" type="text/css" href="settings/css/content_style1_BD.css"> 




<div id="tabs_wrapper">
	<div id="tabs_container">
		<ul id="tabs">
			<li><a href="#tab1">Add / Edit / Delete Product</a></li>
			<li><a href="#tab2">Add / Edit / Delete Product Category</a></li>
			<li><a href="#tab2">Help</a></li>
		</ul>
	</div>
	<div id="tabs_content_container">
		<div id="tab1" class="tab_content" style="display: block;">
				<div class="_products">
				
				
				
				
				
				
				</div>
		</div>
		<div id="tab2" class="tab_content">
			<div class="_products2"></div>
		</div>
		<div id="tab3" class="tab_content">
			<div class="_products3"></div>

		</div>
	</div>
</div>


<script>
           
     
$(document).ready(function(){	
	
/*	$("._products").load("settings/all_products/all_data.php",function(responseTxt,statusTxt,xhr){
		if(statusTxt=="success")
		  //alert("External content loaded successfully!");
		if(statusTxt=="error")
		  $("._products").text("Error: "+xhr.status+": "+xhr.statusText);
	  });*/

	$("#tabs li").click(function() {
		//	First remove class "active" from currently active tab
		$("#tabs li").removeClass('activee');

		//	Now add class "active" to the selected/clicked tab
		$(this).addClass("activee");

		//	Hide all tab content
		$(".tab_content").hide();

		//	Here we get the href value of the selected tab
		var selected_tab = $(this).find("a").attr("href");

		//	Show the selected tab content
		$(selected_tab).fadeIn();

     /// Auto Expanding Text
	// -----------------------------------------------------------------------
	 $('.autoexpand').trigger('onkeydown');
	// -----------------------------------------------------------------------
		
/*	$("._products").load("settings/all_products/all_data.php",function(responseTxt,statusTxt,xhr){
		if(statusTxt=="success")
		  //alert("External content loaded successfully!");
		if(statusTxt=="error")
		  $("._products").text("Error: "+xhr.status+": "+xhr.statusText);
	  });
*/
	  
		
		//	At the end, we add return false so that the click on the link is not executed
		return false;
		
	});
	
	$("#tabs li:nth-child(1)").trigger('click');
 
	$("._products").load("settings/all_products/all_data.php",function(responseTxt,statusTxt,xhr){
		if(statusTxt=="success")
		  //alert("External content loaded successfully!");
		if(statusTxt=="error")
		  $("._products").text("Error: "+xhr.status+": "+xhr.statusText);
	  });
	  
	  
	  			
		$("#tabs li:nth-child(2)").click(function() {

			var profile_hidden_id = $("#profile_hidden_id").val();
			maskPage();
			 $.ajax({
				  type: "POST",
				  url: "settings/all_products/category_edit.php",
				  data: "id="+ $.trim(profile_hidden_id)
				  +"& action="+ "aboutus_view"  
				  ,
				  success: function(data){
					
					$("._products2").html(data);
					maskPage();
				  }	,
				error: function (XMLHttpRequest, textStatus, errorThrown) {	
		
				  $("._products2").text("Error: "+textStatus+": "+errorThrown);
				}				
			 });
			
			
			return false;
				
		});
		
		$("#tabs li:nth-child(1)").click(function() {
				maskPage();
				$("._products").load("settings/all_products/all_data.php",function(responseTxt,statusTxt,xhr){
					if(statusTxt=="success")
						maskPage();
					  //alert("External content loaded successfully!");
					if(statusTxt=="error")
					  $("._products").text("Error: "+xhr.status+": "+xhr.statusText);
				  });
			
			
			return false;
				
		});
		
		
		
	 $('._products').attr('style','min-height:1000px;');
	 $('._products2').attr('style','min-height:1000px;');
	 $('._products3').attr('style','min-height:1000px;');
	
	
	
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
          var  end = $('#hiden_total').val();
                  
				maskPage();
	            $("#main_popup_message").text("Loading ...");	  
                  
                   for (i = start, j = end; i <= j; ++i) {
                          
                          
                          try {                                 
                            hiddenid = $('#hiddenid'+i).val();
							tittle_common = $('#tittle_common'+i).val();
							serial = $('#serial'+i).val();
							detail_common = $('#detail_common'+i).val();
                     		action = "update";
                          // alert(dl_machine_id);
                              $.ajax({
                                  type: "POST",
                                  url: "settings/aboutus_update_save_del.php",
                                  data: "id="+ $.trim(hiddenid)
                                  +"& tittle_common="+ $.trim(tittle_common)
								  +"& serial="+ $.trim(serial)
								  +"& detail_common="+ $.trim(detail_common)
                                  +"& action="+ "update"  
                                  ,
                                  success: function(data){
								  	
								  	if($.trim(data)=="1"){
                                        load_self();
									}
                                  }	,
								error: function (XMLHttpRequest, textStatus, errorThrown) {	

								  $(".middle_main").text("Error: "+textStatus+": "+errorThrown);
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
	  var limit = 100;
	  textarea.style.height = 50;
	  textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
	}

function add_new(id){   


	$("#tabs li:nth-child(2)").trigger('click');
 
	$("._products2").load("settings/all_products/all_data.php",function(responseTxt,statusTxt,xhr){
		if(statusTxt=="success")
		  //alert("External content loaded successfully!");
		if(statusTxt=="error")
		  $("._products").text("Error: "+xhr.status+": "+xhr.statusText);
	  });
	

}






function delete_now(){   

 			var start = 1;
            var  end = $('#hiden_total').val();
			
			var selecteditems = 0; 

		   for (i = start, j = end; i <= j; i++) {
		
				  id = $('#hiddenid'+i).val();
					  
					  if($('#checked'+i).attr('checked')) {
					     selecteditems++;
					  }
		   
		   
		   }
		   
	
	
	if(selecteditems > 0) {
		//return true;

			 var confirm_user = confirm("Do you want to delete selected?");
				if(confirm_user){
					 var start = 1;
					  var  end = $('#hiden_total').val();
							  
							maskPage();
							$("#main_popup_message").text("Loading ...");	  
							  
							   for (i = start, j = end; i <= j; ++i) {
									  
									
									
										  id = $('#hiddenid'+i).val();
										  
										  if($('#checked'+i).attr('checked')) {
				
											$.ajax({
													type: 'POST',
													url: 'settings/aboutus_update_save_del.php',	
													data: "id="+ id
													+"& action="+ "delete" ,
													success: function(data) {
															//$(".current_detail").text(data);
															load_self();
															if($.trim(data)=="1"){
																//load_self();
																load_self();
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

		$(".middle_main").text("Loading...");
		 $(".middle_main").load("settings/aboutus_edit.php",function(responseTxt,statusTxt,xhr){
			if(statusTxt=="success")
			  //alert("External content loaded successfully!");
			if(statusTxt=="error")
			  $(".middle_main").text("Error: "+xhr.status+": "+xhr.statusText);
		  });
		 
		 //reload page
		//window.location.reload();
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
