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
			<li><a href="#tab1">Add new</a></li>
			<li><a href="#tab2">List items</a></li>
			<li><a href="#tab3">Help</a></li>
<!--			<li><a href="#tab3">Shared Profile</a></li>
			<li><a href="#tab4">Shared Product / Services</a></li>
			-->
		</ul>
	</div>
	<div id="tabs_content_container">
		<div id="tab1" class="tab_content" style="display: block;">
			<div class="tab1_content"></div>
		</div>
		<div id="tab2" class="tab_content" style="display: block;">
			<div class="tab2_content"></div>
		</div>
		<div id="tab3" class="tab_content" style="display: block;">
			<div class="tab3_content"></div>
		</div>
		<!--<div id="tab4" class="tab_content" style="display: block;">
			<div class="_products4">
					<div class="requisition_message"></div>
					<div class="all_requisition"></div>
			</div>
		</div>
		<div id="tab5" class="tab_content" style="display: block;">
			<div class="_products5">
					<div class="product_message"></div>
					<div class="product_category"></div>
					<div class="all_product"></div>
			</div>
		</div>-->
		
	</div>
</div>


<script>
           

$(document).ready(function(){	
	

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
	  
	
		
		//	At the end, we add return false so that the click on the link is not executed
		return false;
		
	});
	
		maskPage();
		$(".tab1_content").load("settings/link_type/link_type_add.php",function(responseTxt,statusTxt,xhr){
			if(statusTxt=="success")
				maskPage();
			if(statusTxt=="error")
			  $(".tab1_content").text("Error: "+xhr.status+": "+xhr.statusText);
	  	});
	
	
		//maskPage();
			
		$("#tabs li:nth-child(1)").trigger('click');
		
		
		function cleartabs(){
			 $(".tab1_content").text('');
			 $(".tab2_content").text('');
			 $(".tab3_content").text('');
			 
			 
			  $("#action_message").text('');
			 
		}
		
			 	  
	  		  
		$("#tabs li:nth-child(1)").click(function() {
		
			maskPage();
			cleartabs();
			
			$(".tab1_content").load("settings/link_type/link_type_add.php",function(responseTxt,statusTxt,xhr){
				if(statusTxt=="success")
				  maskPage();
				if(statusTxt=="error")
				  $(".tab1_content").text("Error: "+xhr.status+": "+xhr.statusText);
			});
			
			
			return false;
				
		});
		


		$("#tabs li:nth-child(2)").click(function() {
		
			maskPage();
			cleartabs();
			
			$(".tab2_content").load("settings/link_type/link_type_view.php",function(responseTxt,statusTxt,xhr){
				if(statusTxt=="success")
				 maskPage();
				if(statusTxt=="error")
				  $(".tab1_content").text("Error: "+xhr.status+": "+xhr.statusText);
			});
			
			return false;
				
		});
		
		$("#tabs li:nth-child(3)").click(function() {
		
			//alert("tab 3");
			cleartabs();
			return false;
				
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
