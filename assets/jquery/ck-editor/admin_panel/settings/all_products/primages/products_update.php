<script type="text/javascript">
/* <![CDATA[ */
$(document).ready(function(){
	$("#tabs li").click(function() {
		//	First remove class "active" from currently active tab
		$("#tabs li").removeClass('active');

		//	Now add class "active" to the selected/clicked tab
		$(this).addClass("active");

		//	Hide all tab content
		$(".tab_content").hide();

		//	Here we get the href value of the selected tab
		var selected_tab = $(this).find("a").attr("href");

		//	Show the selected tab content
		$(selected_tab).fadeIn();

		//	At the end, we add return false so that the click on the link is not executed
		return false;
	});
});
/* ]]> */
</script>
<style type="text/css">
#tabs_wrapper {
	width: 577px;
}
#tabs_container {
	border-bottom: 1px solid #ccc;
}
#tabs {
	list-style: none;
	padding: 5px 0 4px 0;
	margin: 0 0 0 10px;
	font: 0.75em arial;
}
#tabs li {
	display: inline;
}
#tabs li a {
	border: 1px solid #ccc;
	padding: 4px 6px;
	text-decoration: none;
	background-color: #eeeeee;
	border-bottom: none;
	outline: none;
	border-radius: 5px 5px 0 0;
	-moz-border-radius: 5px 5px 0 0;
	-webkit-border-top-left-radius: 5px;
	-webkit-border-top-right-radius: 5px;
}
#tabs li a:hover {
	background-color: #dddddd;
	padding: 4px 6px;
}
#tabs li.active a {
	border-bottom: 1px solid #fff;
	background-color: #fff;
	padding: 4px 6px 5px 6px;
	border-bottom: none;
}
#tabs li.active a:hover {
	background-color: #eeeeee;
	padding: 4px 6px 5px 6px;
	border-bottom: none;
}

#tabs li a.icon_accept {
	background-image: url(accept.png);
	background-position: 5px;
	background-repeat: no-repeat;
	padding-left: 24px;
}
#tabs li a.icon_accept:hover {
	padding-left: 24px;
}

#tabs_content_container {
	padding: 10px;
	width: 530px;
	border-top-width: 1px;
	border-top-style: none;
	border-top-color: #ccc;
}
.tab_content {
	display: none;
}
._add_new_header{
	height: 30px;
	width: 100%;
	padding-top: 3px;
	padding-bottom: 3px;
	font-family: "Times New Roman", Times, serif;
	font-size: 16px;
	color: #CC0033;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 15px;
}
</style>

<div class="_add_new_header">Products Information </div>
<div id="tabs_wrapper">
	<div id="tabs_container">
		<ul id="tabs">
			<li class="active"><a href="#tab1">Tab 1</a></li>
			<li><a href="#tab2">Tab with icon</a></li>
			<li><a href="#tab3">Long name for the last tab</a></li>
		</ul>
	</div>
	<div id="tabs_content_container">
		<div id="tab1" class="tab_content" style="display: block;">
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum nibh urna, euismod ut ornare non, volutpat vel tortor. Integer laoreet placerat suscipit. Sed sodales scelerisque commodo. Nam porta cursus lectus. Proin nunc erat, gravida a facilisis quis, ornare id lectus. Proin consectetur nibh quis urna gravida mollis.</p>
		</div>
		<div id="tab2" class="tab_content">
			<p>This tab has icon in it.</p>
		</div>
		<div id="tab3" class="tab_content">
			<p>Suspendisse blandit velit eget erat suscipit in malesuada odio venenatis.</p>
		</div>
	</div>
</div>
