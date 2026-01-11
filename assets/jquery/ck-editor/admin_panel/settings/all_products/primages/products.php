
<link rel="stylesheet" href="multizoom.css" type="text/css" />


<script type="text/javascript" src="multizoom.js"></script>


<style type="text/css">

.main_data{
	height: auto;
	width: 94%;
	margin-top: 2px;
	margin-right: auto;
	margin-left: auto;
	padding-bottom: 3px;
	margin-bottom: 2px;
}


.data {
	width: 262px;
	float: left;
	height: auto;
	margin: 3px;
	border: thin solid #666666;
}

._char_{
	float: left;
	width: 68px;
	height: 25px;
	margin-right: auto;
	margin-left: auto;
	margin-top: 5px;
	text-align: center;
}
.char_area{
	margin-right: auto;
	margin-left: auto;
	width: 205px;
	height: auto;
}
.detailbutton{
	width:262px;
	height:100px;
	border-top-width: thin;
	border-top-style: solid;
	border-top-color: #666666;	
}

</style>
<div class="main_data">
<div class="data_whole_body">
<div style="clear:both;height:1px;"></div>
<?php 
for ($i = 1; $i <= 10; $i++) {

?>

<div class="data">
<div class="char_area">
	<div class="_char_">Demo <?php echo $i; ?></div>
	<div class="_char_">Demo <?php echo $i; ?></div>
	<div class="_char_">Demo <?php echo $i; ?></div>
</div>
<div style="clear:both;height:1px;"></div>
	<div class="targetarea" style="border:1px solid #eee"><img id="multizoom<?php echo $i; ?>" alt="zoomable" title="" src="products/millasmall.jpg"/></div>
	<div id="description<?php echo $i; ?>" class="description">Milla Jojovitch</div>
	<div class="multizoom<?php echo $i; ?> thumbs">
	<a href="products/small/millasmall.jpg" data-large="products/fixed/milla.jpg" data-title="Milla Jojovitch"><img src="products/thumb/milla_tmb.jpg" alt="Milla" title=""/></a> 
	<a href="products/small/saleensmall.jpg"  data-large="products/fixed/saleen.jpg" data-title="Saleen S7 Twin Turbo"><img src="products/thumb/saleen_tmb.jpg" alt="Saleen" title=""/></a> 
	<a href="products/small/haydensmall.jpg" data-large="products/fixed/hayden.jpg" data-title="Hayden Panettiere"><img src="products/thumb/hayden_tmb.jpg" alt="Hayden" title=""/></a> 
	<a href="products/small/jaguarsmall.jpg" data-large="products/fixed/jaguar.jpg" data-title="Jaguar Type E"></a></div>
	
	<div class="detailbutton"></div>
	
</div>
<?
   
}
?>
</div>
<div style="clear:both;height:1px;"></div>
</div>
<script>

jQuery(document).ready(function($){


for (var i=0;i<=10;i++)
{ 
	$('#multizoom'+i).addimagezoom({ // multi-zoom: options same as for previous Featured Image Zoomer's addimagezoom unless noted as '- new'
		descArea: '#description'+i, // description selector (optional - but required if descriptions are used) - new
		speed: 1500, // duration of fade in for new zoomable images (in milliseconds, optional) - new
		descpos: true, // if set to true - description position follows image position at a set distance, defaults to false (optional) - new
		imagevertcenter: true, // zoomable image centers vertically in its container (optional) - new
		magvertcenter: true, // magnified area centers vertically in relation to the zoomable image (optional) - new
		zoomrange: [3, 10],
		magnifiersize: [300,300],
		magnifierpos: 'right',
		cursorshadecolor: '#fdffd5',
		cursorshade: true //<-- No comma after last option!
	});
	
}

	
});

//--------------------------------
function removejscssfile(filename, filetype){
	alert('called');
 var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
 var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
 var allsuspects=document.getElementsByTagName(targetelement)
 for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
  if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
   allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
 }
}		
		
	

</script>