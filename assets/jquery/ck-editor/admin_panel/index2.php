<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<title>Panel</title>
<meta name="robots" content="index,follow" />
<meta name="referrer" content="default" id="meta_referrer" />
<meta name="description" content="Control Panel  " />
<link rel="stylesheet" type="text/css" href="css/style.css">
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
			
											<script src="ckeditor.js"></script>
								<script src="adapters/jquery.js"></script>
								<link href="samples/sample.css" rel="stylesheet">

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
#close_btn{
	float: right;
	height: auto;
	width: auto;
	vertical-align: top;
	margin-top: 1px;
	padding-top: 1px;
	padding-bottom: 2px;
	margin-right: 2px;
	padding-right: 2px;
	cursor: pointer;
}
</style>
</head>

<body>
<div id="mask">
	<div id="loadcontent">
		<div id="content_area"><img src="1389311265704.gif" width="30px" height="30px"><br />loading ...</div>
	</div>
</div>
<div class="header">
	<div class="main_header_area">
		<div class="main_header_left"><div class="logo_area"></div>
		</div>
	  <div class="main_header_moddle"></div>
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
						<div class="menu" id="language" onClick="clickthis('language', 'language', 'Language Settings')"><a href="javascript:void(0);" title="" ><img src="images/menu_image/sponsor.png" height="10px" width="10px" />Language </a></div>
						<div class="menu" id="link_type" onClick="clickthis('link_type', 'link_type', 'Link Type Settings')"><a href="javascript:void(0);" title=""><img src="images/menu_image/company_section.png" height="10px" width="10px" />Link Type  </a></div>
						<div class="menu" id="link_type" onClick="clickthis('pages', 'pages', 'Pages Settings')"><a href="javascript:void(0);" title=""><img src="images/menu_image/company_section.png" height="10px" width="10px" />Pages  </a></div>
						<div class="menu" id="link" onClick="clickthis('link', 'link', 'Link Settings')"><a href="javascript:void(0);" title=""><img src="images/menu_image/company_section.png" height="10px" width="10px" />Link</a></div>
						<div class="menu" id="sub_link" onClick="clickthis('sub_link', 'sub_link', 'Sub Link / Sub Note Settings')"><a href="javascript:void(0);" title=""><img src="images/menu_image/company_section.png" height="10px" width="10px" />Sub Link / Sub Note </a></div>
						<div class="menu" id="sub_link" onClick="clickthis('gallery', 'gallery', 'Create Photo Gallery')"><a href="javascript:void(0);" title=""><img src="images/menu_image/company_section.png" height="10px" width="10px" />Create Gallery </a></div>
						<div class="menu" id="sub_link" onClick="clickthis('create_page', 'create_page', 'Create Page')"><a href="javascript:void(0);" title=""><img src="images/menu_image/company_section.png" height="10px" width="10px" />Create Page </a></div>
						
					</div>
				</div>
				
		  </div>
		</div>
		<div class="middle">
		  <div id="action_message"> </div>
			 <div class="clear"></div>
	     	 <div class="top_right">


								<style>
							
									#editable
									{
										padding: 10px;
										float: left;
									}
							
								</style>
								<script>
							
									CKEDITOR.disableAutoInline = true;
							
									$( document ).ready( function() {
										$( '#editor1' ).ckeditor(); // Use CKEDITOR.replace() if element is <textarea>.
										$( '#editable' ).ckeditor(); // Use CKEDITOR.inline().
									} );
							
									function setValue() {
										$( '#editor1' ).val( $( 'input#val' ).val() );
									}
							
								</script>
								
								
									<h1 class="samples">
		<a href="index.html" id="a-test">CKEditor Samples</a> &raquo; Create Editors with jQuery
	</h1>
	<form action="sample_posteddata.php" method="post">
		<div class="description">
			<p>
				This sample shows how to use the <a href="http://docs.ckeditor.com/#!/api/CKEDITOR_Adapters.jQuery">jQuery adapter</a>.
				Note that you have to include both CKEditor and jQuery scripts before including the adapter.
			</p>
<pre class="samples">
&lt;script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"&gt;&lt;/script&gt;
&lt;script src="/ckeditor/ckeditor.js"&gt;&lt;/script&gt;
&lt;script src="/ckeditor/adapters/jquery.js"&gt;&lt;/script&gt;
</pre>
			<p>Then you can replace html elements with a CKEditor instance using the <code>ckeditor()</code> method.</p>
<pre class="samples">
$( document ).ready( function() {
	$( 'textarea#editor1' ).ckeditor();
} );
</pre>
		</div>

		<h2 class="samples">Inline Example</h2>

		<br style="clear: both">

		<h2 class="samples">Framed Example</h2>

		<textarea cols="80" id="editor1" name="editor1" rows="10">
			&lt;h2&gt;Technical details &lt;a id=&quot;tech-details&quot; name=&quot;tech-details&quot;&gt;&lt;/a&gt;&lt;/h2&gt; &lt;table align=&quot;right&quot; border=&quot;1&quot; bordercolor=&quot;#ccc&quot; cellpadding=&quot;5&quot; cellspacing=&quot;0&quot; style=&quot;border-collapse:collapse;margin:10px 0 10px 15px;&quot;&gt; &lt;caption&gt;&lt;strong&gt;Mission crew&lt;/strong&gt;&lt;/caption&gt; &lt;thead&gt; &lt;tr&gt; &lt;th scope=&quot;col&quot;&gt;Position&lt;/th&gt; &lt;th scope=&quot;col&quot;&gt;Astronaut&lt;/th&gt; &lt;/tr&gt; &lt;/thead&gt; &lt;tbody&gt; &lt;tr&gt; &lt;td&gt;Commander&lt;/td&gt; &lt;td&gt;Neil A. Armstrong&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Command Module Pilot&lt;/td&gt; &lt;td&gt;Michael Collins&lt;/td&gt; &lt;/tr&gt; &lt;tr&gt; &lt;td&gt;Lunar Module Pilot&lt;/td&gt; &lt;td&gt;Edwin &amp;quot;Buzz&amp;quot; E. Aldrin, Jr.&lt;/td&gt; &lt;/tr&gt; &lt;/tbody&gt; &lt;/table&gt; &lt;p&gt;Launched by a &lt;strong&gt;Saturn V&lt;/strong&gt; rocket from &lt;a href=&quot;http://en.wikipedia.org/wiki/Kennedy_Space_Center&quot; title=&quot;Kennedy Space Center&quot;&gt;Kennedy Space Center&lt;/a&gt; in Merritt Island, Florida on July 16, Apollo 11 was the fifth manned mission of &lt;a href=&quot;http://en.wikipedia.org/wiki/NASA&quot; title=&quot;NASA&quot;&gt;NASA&lt;/a&gt;&amp;#39;s Apollo program. The Apollo spacecraft had three parts:&lt;/p&gt; &lt;ol&gt; &lt;li&gt;&lt;strong&gt;Command Module&lt;/strong&gt; with a cabin for the three astronauts which was the only part which landed back on Earth&lt;/li&gt; &lt;li&gt;&lt;strong&gt;Service Module&lt;/strong&gt; which supported the Command Module with propulsion, electrical power, oxygen and water&lt;/li&gt; &lt;li&gt;&lt;strong&gt;Lunar Module&lt;/strong&gt; for landing on the Moon.&lt;/li&gt; &lt;/ol&gt; &lt;p&gt;After being sent to the Moon by the Saturn V&amp;#39;s upper stage, the astronauts separated the spacecraft from it and travelled for three days until they entered into lunar orbit. Armstrong and Aldrin then moved into the Lunar Module and landed in the &lt;a href=&quot;http://en.wikipedia.org/wiki/Mare_Tranquillitatis&quot; title=&quot;Mare Tranquillitatis&quot;&gt;Sea of Tranquility&lt;/a&gt;. They stayed a total of about 21 and a half hours on the lunar surface. After lifting off in the upper part of the Lunar Module and rejoining Collins in the Command Module, they returned to Earth and landed in the &lt;a href=&quot;http://en.wikipedia.org/wiki/Pacific_Ocean&quot; title=&quot;Pacific Ocean&quot;&gt;Pacific Ocean&lt;/a&gt; on July 24.&lt;/p&gt; &lt;hr/&gt; &lt;p style=&quot;text-align: right;&quot;&gt;&lt;small&gt;Source: &lt;a href=&quot;http://en.wikipedia.org/wiki/Apollo_11&quot;&gt;Wikipedia.org&lt;/a&gt;&lt;/small&gt;&lt;/p&gt;
		</textarea>

		<p style="overflow: hidden">
			<input style="float: left" type="submit" value="Submit">
			<span style="float: right">
				<input type="text" id="val" value="I'm using jQuery val()!" size="30">
				<input onClick="setValue();" type="button" value="Set value">
			</span>
		</p>
	</form>
	<div id="footer">
		<hr>
		<p>
			CKEditor - The text editor for the Internet - <a class="samples" href="http://ckeditor.com/">http://ckeditor.com</a>
		</p>
		<p id="copy">
			Copyright &copy; 2003-2014, <a class="samples" href="http://cksource.com/">CKSource</a> - Frederico
			Knabben. All rights reserved.
		</p>
	</div>

				
				</div>
		   	 <div class="clear"></div>
	     </div>
		 <div class="clear"></div>
	</div>
</div>


</body>
</html>

<script>

	

$(document).ready(function(){

	
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
		
		
	
</script>
