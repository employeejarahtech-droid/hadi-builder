	
<?php
@include('../connection.php'); 
?>
	
	
	<div id="header_text2"><div style="width:150px;float:left;"><h3>Other Language</h3> </div><div style="float:left;"><h3><select name="lang_name" id="lang_name" class="list_menu lang_name">
					<option value="">Select </option>
				<?php $sql_pp = "select * from lang";
					$result_pp = mysql_query($sql_pp);
					$lang_name = "&#1593;&#1585;&#1576;&#1610;";
						
					while ($row_pp = mysql_fetch_array($result_pp)) {
					
						$selected = "";
					if($row_pp['short_name'] == $short_name) {
						$selected = "selected";
						$lang_name = $row_pp['name'];
					}
					
				 ?>
						<option value="<?php echo $row_pp['short_name']; ?>" <?php echo $selected; ?>><?php echo $row_pp['name']; ?></option>
					
			   <?php }	
			   
			   
			   ?>		
			</select><input id="lang_select" name="lang_select" value="" type="hidden"></h3>
	</div>
	<div id="s_lang_name" class="_span"></div>
	<div class="clear"></div>
	
	<div id="header_text2"><div style="width:150px;float:left;margin-bottom:10px;"><h3>Data for Page name</h3></div> <div style="float:left;"><h3><select name="page_name" id="page_name" class="list_menu page_name">
					<option value="">Select </option>
				<?php $sql_p = "select * from pages";
					$result_p = mysql_query($sql_p);
						
					while ($row_p = mysql_fetch_array($result_p)) {
				 ?>
						<option value="<?php echo $row_p['id']; ?>" name="<?php echo $row_p['name']; ?>" ><?php echo $row_p['name']; ?></option>
					
			   <?php }	?>		
			</select></h3></div>
			<div id="s_page_name" class="_span"></div>

	</div>


	
<script>
	
$(".lang_name").change(function()
{
	//alert('lang');
/*	maskPage(); 
	var lang_name=$(this).val();
	
		$.ajax({
				type: 'POST',
				url: 'settings/link/link_view.php',	
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
			}); */ 
			
		//$(titlepage).text('sdfsd');	
var lang_name=$(this).val();

var $selected = $("#lang_name").find(':selected');
var lang_val  = $selected.text();
		$("titlepage").text(lang_val);
		$("shortnote").text(lang_val);
		$("datadetail").text(lang_val);
		$("#lang_select").val(lang_name);
			
		$("#page_name").val("");
		$("#page_name").trigger( "change" );
		
			var myvars = new Array();
			myvars[0] = "page_name";
			myvars[1] = "lang_name";
			
        var valid =  error_check(myvars)
		
});

		
$(".page_name").change(function()
{
	maskPage(); 
	var page_name=$(this).val();
	var lang_name=$("#lang_name").val();
	
			var myvars = new Array();
			myvars[0] = "page_name";
			myvars[1] = "lang_name";
			
        var valid =  error_check(myvars);	
		
		if(valid) {

		$.ajax({
				type: 'POST',
				url: 'settings/create_page/create_page_save_del.php',	
				data: "page_name="+ page_name
				+"& action="+ "sh_detail_common_en" ,
				success: function(data) {
						//alert(data);
						$("#sh_detail_common_en").val(data);
							 $('.autoexpand_short').trigger('onkeyup');
	 
	 						$('.autoexpand').trigger('onkeydown');
						//maskPage(); 
	
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown);
					}
			});  
			
			$.ajax({
				type: 'POST',
				url: 'settings/create_page/create_page_save_del.php',	
				data: "page_name="+ page_name
				+"& action="+ "sh_detail_common_ar"
				+"& lang_name="+ lang_name ,
				success: function(data) {
						//alert(data);
						$("#sh_detail_common_ar").val(data);
							 $('.autoexpand_short').trigger('onkeyup');
	 
	 						$('.autoexpand').trigger('onkeydown');
						//maskPage(); 
	
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown);
					}
			});  
			
			$.ajax({
				type: 'POST',
				url: 'settings/create_page/create_page_save_del.php',	
				data: "page_name="+ page_name
				+"& action="+ "detail_common_en" ,
				success: function(data) {
						//alert(data);
						$("#detail_common_en").val(data);
							 $('.autoexpand_short').trigger('onkeyup');
	 
	 						$('.autoexpand').trigger('onkeydown');
						//maskPage(); 
	
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown);
					}
			}); 
			
			$.ajax({
				type: 'POST',
				url: 'settings/create_page/create_page_save_del.php',	
				data: "page_name="+ page_name
				+"& action="+ "detail_common_ar" 
				+"& lang_name="+ lang_name ,
				success: function(data) {
						//alert(data);
						$("#detail_common_ar").val(data);
							 $('.autoexpand_short').trigger('onkeyup');
	 
	 						$('.autoexpand').trigger('onkeydown');
						//maskPage(); 
	
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown);
					}
			});
			
			
			/// Tittle
			$.ajax({
				type: 'POST',
				url: 'settings/create_page/create_page_save_del.php',	
				data: "page_name="+ page_name
				+"& action="+ "title_en" ,
				success: function(data) {
						//alert(data);
						$("#title_en").val(data);
							$('.autoexpand').trigger('onkeyup');
		 					$('.autoexpand').trigger('onkeydown');
						//maskPage(); 
	
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown);
					}
			}); 
			
			$.ajax({
				type: 'POST',
				url: 'settings/create_page/create_page_save_del.php',	
				data: "page_name="+ page_name
				+"& action="+ "title_ar" 
				+"& lang_name="+ lang_name ,
				success: function(data) {
						//alert(data);
						$("#title_ar").val(data);
							$('.autoexpand').trigger('onkeyup');
		 					$('.autoexpand').trigger('onkeydown');
						maskPage(); 
	
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown);
					}
			});
			
		
		} else {
			maskPage();
		}

});

		


</script>