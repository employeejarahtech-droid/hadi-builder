<?php @session_start();
@include('../connection.php'); 

if($_GET['action']=="logout"){
	$_SESSION[$secrete] ="";
}

?>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Panel</title>
<meta name="robots" content="index,follow" />
<meta name="referrer" content="default" id="meta_referrer" />
<meta name="description" content="Control Panel  " />
<link rel="stylesheet" type="text/css" href="css/style.css">

	<link rel="stylesheet" type="text/css" href="css/datepickr.css" /> 
	<script type="text/javascript" src="js/datepickr.min.js"></script>

    <link rel="stylesheet" href="css/validationEngine.jquery.css" type="text/css"/>     
	<link rel="stylesheet" type="text/css" href="sitecss/jquery.autocomplete.css" />  
    <script src="js/jquery-1.6.min.js" type="text/javascript"></script>
    <script src="js/languages/jquery.validationEngine-en.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/jquery.validationEngine.js" type="text/javascript" charset="utf-8"></script>
	<script type="text/javascript" src="js/jquery.dragsort-0.5.1.min.js"></script>
	<script src="js/jcookie.js"></script>
	<script type="text/javascript" src="js/ajaxfileupload.js"></script>
	<script type="text/javascript" src="js/jquery.superbox.js"></script>
	<script src="js/validation_personal.js"></script>

<style type="text/css">
#mask{
	position:fixed;
	width:100%;
	height:100%;
	background: rgba(0,0,0,.3);/* You can make this slightly transparent black rgba(0,0,0,.3); or transparent */
	top:0;
	left:0;
	display:none;
	margin: 0px;
	padding: 0px;
	z-index: 7000;
	
}
#loadcontent{
	width:300px;
	height:auto;/* You can make this slightly transparent black rgba(0,0,0,.3); or transparent */
	display:none;
	z-index: 8000;
	background-color: #FFFFFF;
	position:absolute;
	width:300px;
	height:60px;
	z-index:15;
	top:50%;
	left:50%;
	text-align: center;
	margin-top: -150px;
	margin-right: 0;
	margin-bottom: 0;
	margin-left: -150px;
	padding-top: 10px;
	padding-bottom: 10px;
	border-radius:10px;
}
#title_area{
	height: auto;
	width: auto;
	padding-top: 2px;
	padding-bottom: 2px;
}
#title{
	float: left;
	height: auto;
	width: auto;
	padding-left: 2px;
}
.btn__{
	height: 50px;
	width: 200px;
	cursor: pointer;
	font-size: 24px;
}

.alltextarea {
	height: auto;
	width: 600px;
	margin-right: auto;
	margin-left: auto;
	padding: 3px;
}

#wrap{
	height: 250px;
	width: 250px;
	background-color: #339933;
	margin-top: 50px;
	margin-right: auto;
	margin-left: auto;
	-moz-box-shadow:inset 0px 1px 0px 0px #ffffff;
	-webkit-box-shadow:inset 0px 1px 0px 0px #ffffff;
	box-shadow:inset 0px 1px 0px 0px #ffffff;
	background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #339933), color-stop(1, #339933) );
	background:-moz-linear-gradient( center top, #ededed 5%, #dfdfdf 100% );
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ededed', endColorstr='#dfdfdf');
	background-color:#ededed;
	-webkit-border-top-left-radius:6px;
	-moz-border-radius-topleft:6px;
	border-top-left-radius:6px;
	-webkit-border-top-right-radius:6px;
	-moz-border-radius-topright:6px;
	border-top-right-radius:6px;
	-webkit-border-bottom-right-radius:6px;
	-moz-border-radius-bottomright:6px;
	border-bottom-right-radius:6px;
	-webkit-border-bottom-left-radius:6px;
	-moz-border-radius-bottomleft:6px;
	border-bottom-left-radius:6px;
	text-indent:0;
	border:1px solid #dcdcdc;
	color:#777777;
	text-decoration:none;
	text-shadow:1px 1px 0px #ffffff;
}

#loginbody, #loginlogo, #user, #password, #button{
	clear: both;
	height: 30px;
	width: 250px;
	margin-top: 3px;
	margin-bottom: 3px;
	padding: 5px;
}

#left{
	float: left;
	width: 80px;
}

#right{
	float: left;
	width: 150px;
}

#submit{
	background-color: #CCCCCC;
	padding: 3px;
	width: 40px;
	margin-left: 80px;
	-moz-box-shadow:inset 0px 1px 0px 0px #ffffff;
	-webkit-box-shadow:inset 0px 1px 0px 0px #ffffff;
	box-shadow:inset 0px 1px 0px 0px #ffffff;
	background:-webkit-gradient( linear, left top, left bottom, color-stop(0.05, #ededed), color-stop(1, #dfdfdf) );
	background:-moz-linear-gradient( center top, #ededed 5%, #dfdfdf 100% );
	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#ededed', endColorstr='#dfdfdf');
	background-color:#ededed;
	-webkit-border-top-left-radius:6px;
	-moz-border-radius-topleft:6px;
	border-top-left-radius:6px;
	-webkit-border-top-right-radius:6px;
	-moz-border-radius-topright:6px;
	border-top-right-radius:6px;
	-webkit-border-bottom-right-radius:6px;
	-moz-border-radius-bottomright:6px;
	border-bottom-right-radius:6px;
	-webkit-border-bottom-left-radius:6px;
	-moz-border-radius-bottomleft:6px;
	border-bottom-left-radius:6px;
	text-indent:0;
	border:1px solid #dcdcdc;
	display:inline-block;
	color:#777777;
	text-decoration:none;
	text-align:center;
	text-shadow:1px 1px 0px #ffffff;
	cursor:pointer;
}

 .textbox { 
    background: white; 
    border: 1px solid #ffffff; 
    border-radius: 5px; 
    box-shadow: 0 0 5px 3px #ffffff; 
    color: #666; 
    outline: none; 
    height:20px; 
    width: 130px; 
  } 
  
  #m_msg{
	margin-left: 50px;
	margin-top: 5px;
	color: #FF0033;
  }
  
  #logout{
	float: right;
	width: 50px;
	margin-top: 10px;
  }
  
  #logout a, #logout a:link{
	color: #FFFFFF;  
  }
  #logout a:hover{
	text-decoration: underline;  
  }

</style>
</head>

<body>
<div id="mask">
	<div id="loadcontent">
		<div id="content_area"><img src="1389311265704.gif" width="30px" height="30px"><br />loading ...</div>
	</div>
</div>
<?php
if(!isset($_SESSION[$secrete]) || ($_SESSION[$secrete]=="")) { ?>

<div id="wrap">
	<div id="loginbody">
		<div id="loginlogo">
		  <div align="center"><img name="" src="logo.png" width="70" height="40" alt=""></div>
		</div>
		<div id="loginlogo">
			<div id="m_msg"></div>
		</div>
		<div id="user">
			<div id="left">User ID</div>
			<div id="right"><input id="u_id" name="u_id" class="textbox" type="text" onKeyDown="enter();"></div>
		</div>
		<div id="password">
			<div id="left">Password</div>
			<div id="right"><input id="u_pass" name="u_pass" class="textbox" type="password" onKeyDown="enter();"></div>
		</div>
		<div id="button">
			<div id="submit" onClick="login();">Submit</div>
		</div>
	</div>
</div>

<?php
} else {
?>


<div class="header">
	<div class="main_header_area">
		<div class="main_header_left"><div class="logo_area"><?php echo @ReturnAnyOneFieldFromAnyTable("settings", "valuess", "name", "name"); ?></div>
		</div>
	  <div class="main_header_moddle"><div id="logout"><a href="index.php?action=logout">logout</a></div></div>
  </div>
</div>
<div class="header2">
  <div class="main_header_area">
		<div class="main_header_left2"><div class="logo_area"></div>
		</div>
	  <div class="main_header_moddle">
	  <div class="current_header"></div>
	  </div>
  </div>
</div>
<div class="wrap">
  <div class="wrap_body">
  		<div class="clear"></div>
		<div class="left_b">
			<div class="menu_section">
				<div class="menu_inner">
					<div class="civil_works">
						<div class="menu_header">MASTER FORMS </div>
						<div class="menu" id="language" onClick="clickthis('language', 'language', 'Language Settings')"><a href="javascript:void(0);" title="" ><img src="icon/lang.png" height="15px" width="10px" />Language </a></div>
						<div class="menu" id="link_type" onClick="clickthis('link_type', 'link_type', 'Link Type Settings')"><a href="javascript:void(0);" title=""><img src="icon/linktype.png" height="15px" width="10px" />Link Type  </a></div>
						<div class="menu" id="pages" onClick="clickthis('pages', 'pages', 'Pages Settings')"><a href="javascript:void(0);" title=""><img src="icon/pages.png" height="10px" width="10px" />Pages  </a></div>
						<div class="menu" id="link" onClick="clickthis('link', 'link', 'Link Settings')"><a href="javascript:void(0);" title=""><img src="icon/link.png" height="10px" width="10px" />Link</a></div>
						<div class="menu" id="sub_link" onClick="clickthis('sub_link', 'sub_link', 'Sub Link / Sub Note Settings')"><a href="javascript:void(0);" title=""><img src="icon/sublink.png" height="10px" width="10px" />Sub Link / Sub Note </a></div>
						<div class="menu" id="gallery" onClick="clickthis('gallery', 'gallery', 'Create Photo Gallery')"><a href="javascript:void(0);" title=""><img src="icon/gallery.png" height="10px" width="10px" />Create Gallery </a></div>
						<div class="menu" id="pagecreate" onClick=""><a href="index.php?page=pagecreate" title=""><img src="icon/cpages.png" height="10px" width="10px" />Complete your pages </a></div>
						<div class="menu" id="products" onClick="clickthis('product', 'product', 'Upload Products')"><a href="javascript:void(0);" title=""><img src="icon/product.png" height="10px" width="10px" />Upload Products </a></div>
						<div class="menu_header">SECURE FORMS </div>
						<div class="menu" id="language" onClick="clickthis('truncate', 'truncate', 'Truncate Table')"><a href="javascript:void(0);" title="" ><img src="icon/TRUNCATE.png" height="10px" width="10px" />Truncate Table </a></div>
						<div class="menu" id="language" onClick="clickthis('table', 'table', 'Tables')"><a href="javascript:void(0);" title="" ><img src="icon/tables.png" height="10px" width="10px" />Tables </a></div>
						<div class="menu" id="settings" onClick="clickthis('settings', 'settings', 'Settings')"><a href="javascript:void(0);" title="" ><img src="icon/settings.png" height="10px" width="10px" />Settings </a></div>
						
						
						<div id="Powered" style="margin-top:50px;">
							<div><img src="icon_cart.png" height="10" width="70"  /></div>
							<div>Powered by <a href="http://easy.portfoliohere.com/" target="_blank">Easycart &trade;</a></div>
						</div>
						
					</div>
				</div>
				
		  </div>
		</div>
		<div class="middle">
		  <div id="action_message"> </div>
			 <div class="clear"></div>
	     	 <div class="top_right">
			 			<?php 
						$page ="";
						
						if(isset($_GET['page'])) {
							$page = $_GET['page'];
						}
						
						
						if($page == "pagecreate") {  ?>
								<script src="ckeditor.js"></script>
								<script src="adapters/jquery.js"></script>
								<link href="samples/sample.css" rel="stylesheet">
								<style>
							
									#editable
									{
										padding: 10px;
										float: left;
									}
							
								</style>
								<script>
							
									CKEDITOR.disableAutoInline = true;
									CKEDITOR.config.startupMode = 'source';
									//call the original method
							
									$( document ).ready( function() {
										$( '#sh_detail_common_en' ).ckeditor(); 
										$( '#sh_detail_common_ar' ).ckeditor(); 
										$( '#detail_common_en' ).ckeditor(); 
										$( '#detail_common_ar' ).ckeditor(); 
										//$( '#title_en' ).ckeditor(); 
										//$( '#title_ar' ).ckeditor(); 
									} );
							
									
							
								</script>
								
								
			

		<div class="description">
	<div id="clear"></div>
	
	<div id="load_lang_page">

	</div>
	
	
	 <div id="clear"></div>
		</div>

		<br style="clear: both">

		<h2 class="samples" style="margin-left:30px;">Tittle (English)</h2>
		<div class="alltextarea">
		<textarea cols="80" id="title_en" name="" rows="5" class="autoexpand alltextarea"></textarea>
		</div>
		<br style="clear: both">

		<h2 class="samples" style="margin-left:30px;">Tittle (<titlepage>another</titlepage>)</h2>
		<div class="alltextarea">
		<textarea cols="80" id="title_ar" name="" rows="5" class="autoexpand alltextarea"></textarea>
		</div>
		<br style="clear: both">

		<h2 class="samples" style="margin-left:30px;">Short Note (English)</h2>
		<div class="alltextarea">
		<textarea cols="80" id="sh_detail_common_en" name="" class="alltextarea" rows="10">
			
		</textarea>
		</div>
		
		<br style="clear: both">

		<h2 class="samples" style="margin-left:30px;">Short Note (<shortnote>another</shortnote>)</h2>
		<div class="alltextarea">
		<textarea cols="80" id="sh_detail_common_ar" name="editor2" class="alltextarea" rows="10">
			
		</textarea>
		</div>
		
		<br style="clear: both">

		<h2 class="samples" style="margin-left:30px;">Detail Data  (English)</h2>
		<div class="alltextarea">
		<textarea cols="80" id="detail_common_en" class="alltextarea" name="editor3" rows="10">
			
		</textarea>
		</div>
		
		<br style="clear: both">

		<h2 class="samples" style="margin-left:30px;">Detail Data (<datadetail>another</datadetail>)</h2>
		<div class="alltextarea">
		<textarea cols="80" id="detail_common_ar" class="" name="editor4" rows="10">
			
		</textarea>
		</div>
		<p align="center" style="margin-top:20px;margin-bottom:20px;text-align:center; width:100%;">
			<input type="submit" onClick="update()" class="btn__" value="Submit">
		</p>
	
	
				<?php		} else {
						  ?>
			 			<h1 align="center" style="padding-bottom:100px; padding-top:100px;">Admin Panel</h1>
						<?php } ?>
				
		  </div>
		   	 <div class="clear"></div>
    </div>
		 <div class="clear"></div>
  </div>
</div>

<?php
}
?>

</body>
</html>

<script>

	

$(document).ready(function(){

	<?php if($page == "pagecreate") { ?> 
		$("#pagecreate").addClass('menu_selected');	
		$(".current_header").text('Create Complete Page or data using Editor');	
		load_page_lang("load_page_lang.php");
	<?php } ?> 
	
});
	
	

	
	var isPageMasked = false,
    mask = $('#mask');
	loadcontent = $('#loadcontent');

var maskPage = function(){

    if(isPageMasked){
        mask.hide();
		loadcontent.hide();
    } else {
        mask.show();
		loadcontent.show();
    }

    isPageMasked = !isPageMasked;

};



function scroolTo_f(){
//$(this).animate(function(){
	$('html, body').animate({
		scrollTop: $(".middle").offset().top
		 }, 2000);
            //});
}


$(".menu").click(function() {
	removeallall();
	$(".menu").removeClass("menu_selected");
	$(this).addClass('menu_selected');
	
});

function enter(){

	 if (!e) { var e = window.event; }
	 if (e.keyCode == 13) { 
	 	login(); 
	 }

	return false;
}


function login(){

	var u_id 		= 	$('#u_id').attr('value');
	var u_pass 		=  	$('#u_pass').attr('value');

	if((u_id !="" ) || (u_pass !="" )){
	
			$.ajax({
				type: 'POST',
				url: 'checkadmin.php',	
				data: { u_id: u_id, u_pass: u_pass, action: "userlogin"  },
				success: function(data) {
						//alert(data);
						if($.trim(data)=="0"){
							$("#m_msg").text("Wrong user id or passowrd!");
						}
						if($.trim(data)=="1"){
							$("#m_msg").text("Redirecting!");
							window.location.href="index.php";
						}
								
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown);
					}
			}); 
		
	
	} else {
		$("#m_msg").html('Wrong user id or passowrd!');
	}

}



function removeallall(){
	$(".chane_button_color").addClass("tabs");
}

function scroolTo_f(){
//$(this).animate(function(){
	$('html, body').animate({
		scrollTop: $(".header").offset().top
		 }, 2000);
            //});
}

function removeallall(){
	$(".chane_button_color").addClass("tabs");
}

function load_all_form(page_link){
	 $(".middle_main").load(page_link,function(responseTxt,statusTxt,xhr){
		if(statusTxt=="success")
		  //alert("External content loaded successfully!");
		if(statusTxt=="error")
		  alert("Error: "+xhr.status+": "+xhr.statusText);
	  });  
}

function load_page_lang(page_link){
	 $("#load_lang_page").load(page_link,function(responseTxt,statusTxt,xhr){
		if(statusTxt=="success")
		  //alert("External content loaded successfully!");
		if(statusTxt=="error")
		  alert("Error: "+xhr.status+": "+xhr.statusText);
	  });  
}


	function clickthis(button, element, header){   
			var b = button;
			var current_header = '';
			var current_detail = '';
			var page_link = '';
			var hidde_field = '';
			
			//removeallall();
			//alert('clicked');
			$(".menu").removeClass("menu_selected");
			 $("#"+button+"").addClass("menu_selected");
			 
			 $("form").validationEngine('hide');
			 
			
		
			
			// current_header
			$(".current_header").text(header);
			$("#action_message").text('');
			
			//var elecment = "main_data_content_et";

			after_category_change(element);
			
			
    	};
		
		
		
function after_category_change(element){

		//$("#hidden_subcat_id").val(subcat);  

		


		scroolTo_f();
		
		maskPage();
		

		
		var elecment = element;
		
		
	
		 $.ajax({
			type: 'GET',
			url: 'settings/check_loadpage.php',	
			data: "elecment="+ elecment,
			success: function(data) {
					
					 $(".top_right").load(data,function(responseTxt,statusTxt,xhr){
						if(statusTxt=="success")
							maskPage();
						 
						if(statusTxt=="error"){
							maskPage();
							$(".top_right").text("Error: "+xhr.status+": "+xhr.statusText);
						  }
					  });
					//$(".middle_main").load(data);
				},
				error: function (XMLHttpRequest, textStatus, errorThrown) {
					//maskPage();
				   $(".top_right").text('problem with network');
				}
		});
		


}

		
		
	function ButtonEvent(selector, scrolTo){
		// Button change
		
		$(".menu").removeClass("current");
		$(selector).addClass('current');	
		
	}


function update(){   


		var myvars = new Array();
			myvars[0] = "page_name";
			myvars[1] = "lang_name";
			
        var valid =  error_check(myvars);	
		
      	
	//alert(valid);
	
	
	var page_name 				= 	$('#page_name').attr('value');
	var lang_name 				= 	$('#lang_name').attr('value');
	var title_en 				=  	$('#title_en').val();
	var title_ar 				=  	$('#title_ar').val();
	var sh_detail_common_en 	=  	$('#sh_detail_common_en').val();
	var sh_detail_common_ar 	=  	$('#sh_detail_common_ar').val();
	var detail_common_en 		=  	$('#detail_common_en').val();
	var detail_common_ar 		=  	$('#detail_common_ar').val();

 
	//alert(detail_common_ar);
	
	if(valid) {
	
		maskPage();
		//data: { name: name, otherename: otherename, link_types: link_types, id: id, action: "update"  },
		      
		$.ajax({
				type: 'POST',
				url: 'settings/create_page/create_page_save_del.php',	
				data: { page_name: page_name, lang_name: lang_name, title_en: title_en, title_ar: title_ar, sh_detail_common_en: sh_detail_common_en, sh_detail_common_ar: sh_detail_common_ar, detail_common_en: detail_common_en, detail_common_ar: detail_common_ar, action: "update"  },
				success: function(data) {
						//alert(data);
						maskPage();
						if($.trim(data)=="1"){
							$("#action_message").text("Saved success !");
							//$("#submit_this").attr("disabled", "disabled");
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