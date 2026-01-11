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

$category       = htmlspecialchars(trim($_GET['category']));

?>
 
<link rel="stylesheet" type="text/css" href="settings/directory/css/directory_style1_BD.css"> 


 <script type="text/javascript" src="settings/ajaxfileupload.js"></script>
 <script type="text/javascript" src="settings/ajaxfileupload2.js"></script>
<style type="text/css">

/* buttons*/
	
	.yui3-button1 {    /* Structure */
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

	.yui3-button1_hover {    /* Structure */
    display: inline-block;
    *display: inline; /*IE 6/7*/
    zoom: 1;
    font-size: 100%; 
    *font-size: 90%; /*IE 6/7 - To reduce IE's oversized button text*/
    *overflow: visible; /*IE 6/7 - Because of IE's overly large left/right padding on buttons */
    padding: 0.2em 1em 0.25em;
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

.yui3-button1:hover{
 
    background-color: #009933;
   

}

.yui3-button1:active{
 
    background-color: #009933;
   

}


._add_new_photo_area {
	color: #009933;
	height: auto;
	width: 530px;
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
	color: #009933;
}

._add_data_header {
	height: 30px;
	margin: 3px;
	background-color: #009933;
	font-weight: bold;
	border: thin solid #FF6666;
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
	width: 220px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	padding-left: 2px;
}

._photo_tittle{
	color: #FFFFFF;
	float: left;
	width: 150px;
	margin-top: 7px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	font-style: normal;
	margin-left: 10px;
}
._photo_input{
	width: 220px;
	float: left;
	margin-top: 4px;
}

._photo_image_box {
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
	width: 220px;
	margin-top: 2px;
	padding-bottom: 10px;
	float: left;
}

._tittle_common{
	float: left;
	height: auto;
	width: 515px;
	margin-left: 10px;
}

._detail_common{
	float: left;
	height: auto;
	width: 220px;
	margin-bottom: 10px;
	background-color: #F0F0F0;	/*border:1px solid #999999;*/
	margin-left: 10px;
	margin-top: 10px;
	border:1px solid #FFFFFF;
}
._detail_common:hover{
	float: left;
	height: auto;
	width: 220px;
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
	width: 260px;
	padding: 3px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	text-align: justify;
	float: left;
	overflow: hidden;
	outline-color: transparent;
	outline-style: none;
	border: 1px solid #000000;
	margin-top: 5px;
	margin-bottom: 5px;
}

.tittlecommon{
	padding: 0px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	width: 370px;
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
	width: 380px;
	float: left;
}
._buttonarea{
	width: 120px;
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
	border-radius:5px;
}

._leftmarning{
	margin-left: 5px;
}




.partner_logo {
	float: left;
	height: 150px;
	width: 200px;
	margin-left: 10px;
}
.partner_address {
	height: auto;
	width: 260px;
	float: right;
	margin-right: 10px;
	margin-top: 10px;
}
.port_folio_id {
	height: 30px;
	width: 220px;
	margin-top: 5px;
	margin-right: auto;
	margin-bottom: 5px;
	margin-left: auto;
	border-radius:5px;
	border: 1px solid #000000;
	position: relative;
	padding: 5px;
}
.port_folio_id input{
	width: 240px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	margin-top: 5px;
	margin-left: 5px;
	outline-color: transparent;
	outline-style: none;
	background-color: transparent;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
}

.port_folio_id span{ /*CSS for enlarged image*/
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



.port_folio_id span #menutittle{ /*CSS for enlarged image*/
	DISPLAY: block;
	Z-INDEX: 6500;
	LEFT: -1px;
	WIDTH: 254px;
	POSITION: absolute;
	TOP: 27px;
	HEIGHT: 61px;
	padding-top: 6px;
	padding-right: 3px;
	padding-left: 3px;
	padding-bottom: 6px;
	background-color: #F0F0F0;
	border-right-width: 1px;
	border-bottom-width: 1px;
	border-left-width: 1px;
	border-right-style: solid;
	border-bottom-style: solid;
	border-left-style: solid;
	border-top-color: #000000;
	border-right-color: #000000;
	border-bottom-color: #000000;
	border-left-color: #000000;
}

.images{
	padding: 3px;
	float: left;
	height: 120px;
	width: 170px;
	border: 1px solid #CCCCCC;
	margin-top: 10px;
	margin-right: 5px;
	margin-bottom: 5px;
	margin-left: 10px;
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
	LEFT: 12px;
	WIDTH: 158px;
	POSITION: absolute;
	TOP: 14px;
	HEIGHT: 108px;
	padding-top: 6px;
	padding-right: 3px;
	padding-left: 3px;
	padding-bottom: 6px;
}

.images span #menutittle2{ /*CSS for enlarged image*/
	DISPLAY: block;
	Z-INDEX: 6500;
	LEFT: 190px;
	WIDTH: 86px;
	POSITION: absolute;
	TOP: -10px;
	HEIGHT: 69px;
	padding-top: 6px;
	padding-right: 3px;
	padding-left: 3px;
	padding-bottom: 6px;
}

.images:hover span{ /*CSS for enlarged image on hover*/
	background-color:transparent;
	visibility: visible;
	top: auto;
	left: auto; /*position where enlarged image should offset horizontally */
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
	margin-left: 6px;
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
	margin-left: 6px;
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
	margin-left: 6px;
	background-color: #6699CC;
	cursor:pointer;
}

.no_image{
	float: left;
	height: 20px;
	width: 125px;
	text-align: center;
	border:1px solid #000000;
	border-radius:5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	padding-top: 3px;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 8px;
	background-color: #FFCC66;
	cursor:pointer;
}

.no_image:hover{
	float: left;
	height: 20px;
	width: 125px;
	text-align: center;
	border:1px solid #000000;
	border-radius:5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	padding-top: 3px;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 8px;
	background-color: #66CCFF;
	cursor:pointer;
}

.no_image:active{
	float: left;
	height: 20px;
	width: 125px;
	text-align: center;
	border:1px solid #000000;
	border-radius:5px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	padding-top: 3px;
	margin-top: 3px;
	margin-right: 3px;
	margin-bottom: 3px;
	margin-left: 8px;
	background-color: #6699CC;
	cursor:pointer;
}
.addres_s{
	margin-top: 5px;
}
.fileupload_display_none{
	display: none;
}






._add_new_photo_area {
	color: #009933;
	height: auto;
	width: 700px;
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
	color: #009933;
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
	width: 220px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	padding-left: 2px;
}


._photo_input{
	width: 220px;
	float: left;
	margin-top: 4px;
}

._photo_image_box {
	height: 65px;
	width: 350px;
	float: left;
	border: thin double #FFFFFF;
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

._listdata_v{
	margin-bottom: 2px;
	height: auto;
	width: 120px;
	margin-top: 2px;
	padding-bottom: 10px;
	float: left;
}

._tittle_common{
	float: left;
	height: auto;
	width: 515px;
	margin-left: 10px;
}

._detail_common_v{
	float: left;
	height: auto;
	width: 510px;
	margin-bottom: 10px;
	margin-left: 10px;
	margin-top: 10px;
	border:1px solid #FFFFFF;
	text-align: justify;
}
._detail_common_v:hover{
	float: left;
	height: auto;
	width: 120px;
	margin-bottom: 10px;
	border:1px solid #FFFFFF;
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
	width: 260px;
	padding: 3px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	text-align: justify;
	float: left;
	overflow: hidden;
	outline-color: transparent;
	outline-style: none;
	border: 1px solid #000000;
	margin-top: 5px;
	margin-bottom: 5px;
}
.tittlecommon{
	padding: 0px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	width: 370px;
	background-color: #F0F0F0;
	margin: 5px;
	
	outline-color: transparent;
  	outline-style: none;
}



._bottom_v{
	background-color: #009933;
	border:1px solid #FF6666;
	border-radius:5px;
	width: 505px;
	float: left;
	height: 20px;
	padding-top: 5px;
	padding-left: 5px;
	color: #FFFFFF;
}
._buttonarea{
	width: 120px;
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




.detain_view_left {
	height: 170px;
	width: 170px;
	float: left;
	border: 1px solid #009933;
	margin: 5px;
}
.detain_view_right {
	background-color: #FFFFFF;
	height: 120px;
	width: 300px;
	float: right;
	margin-right: 5px;
}
.web_address {
	height: 20px;
	width: 280px;
	margin-left: 10px;
	margin-top: 3px;
}
.web_address a{
	text-decoration: underline;
	color: #CC00FF;
}
.spobsor_detail {
	width: 280px;
	margin-left: 10px;
	height: auto;
	text-align: justify;
}

.port_folio_id {
	height: 30px;
	width: 160px;
	margin-top: 10px;
	margin-bottom: 5px;
	border-radius:5px;
	border: 1px solid #000000;
	padding: 5px;
	margin-right: auto;
	margin-left: auto;
}
.port_folio_id input{
	width: 150px;
	border-top-style: none;
	border-right-style: none;
	border-bottom-style: none;
	border-left-style: none;
	margin-top: 5px;
	margin-left: 5px;
	outline-color: transparent;
	outline-style: none;
	background-color: transparent;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
}
.imge_name {
	margin-bottom: 5px;
}

#image_1 input {
	width : 120px;
	outline:none;
	border:none;
}

#left_c{
	float: left;
	width: 120px;
	margin-top: 20px;
	margin-left: 50px;
}
#middle_c{
	float: left;
	width: 120px;
	margin-top: 20px;
}

#right_c{
	float: left;
	width: 300px;
	margin-top: 20px;
	margin-left: 50px;
}

</style>
<div style="clear:both; width:100%; height:1px;"></div>
<div id="category">

	<div id="left_c"> Select Category
	</div>
	<div id="middle_c">
	  <label>
	  <input name="category_txt" type="text" value="<?php echo $category; ?>" onkeydown="enter(this.value);" />
	  </label>
	</div>
	<div id="right_c"><select name="category" id="category" class="list_menu category">
					<option value="">Select </option>
				<?php $sql_pp = "select DISTINCT category, image1 from gallery";
					$result_pp = mysql_query($sql_pp);
						
					while ($row_pp = mysql_fetch_array($result_pp)) {
					$selected = "";
					if($row_pp['category'] == $category) {
						$selected = "selected";
					}
					//$category
				 ?>
						<option value="<?php echo $row_pp['category']; ?>" <?php echo $selected; ?>><?php echo $row_pp['category']; ?></option>
					
			   <?php }	
			   		
			   
			    ?>
			
			  
			</select></div>

</div>
<div style="clear:both; width:100%; height:1px;"></div>
<div class="_add_new_photo_area">
        
	<div style="clear:both; width:100%; height:1px;"></div>
	<?php 	
			$sql1 ="";
			if(!isset($category)) {
				$sql1 = "select * from gallery where category is null order by id asc";
			} else {
				$sql1 = "select * from gallery where category='%".$category."%'";
			}
			$rsd1 = @mysql_query($sql1);
			
			$number_total = @mysql_num_rows($rsd1);
			
			/*if($number_total ){
			
			}*/
			?>
			
			<?php
			$i = 0;
			 while($result1 = @mysql_fetch_assoc($rsd1)){ 
			  	//$titile = 	ReturnAnyOneFieldFromAnyTable("photo", "titile", "id", $result1["id"]); 
				//$detail = 	ReturnAnyOneFieldFromAnyTable("photo", "detail", "id", $result1["id"]);
				//$serial = 	ReturnAnyOneFieldFromAnyTable("photo", "serial", "id", $result1["id"]);
				$image1 = 	ReturnAnyOneFieldFromAnyTable("photo", "image1", "id", $result1["id"]);
				$i++;
				 ?>

		
  		<div class="_detail_common">
		<form enctype="multipart/form-data" id="formID" onSubmit="javascript:void(null);" action="javascript:void(null);">
					<input name="fileToUpload"  class="fileupload_display_none" id="fileToUpload" onchange="callchg();"  type="file" />
					<input name="hiddenfield" id="hiddenfield" type="hidden" />
					<input name="cuurent_img" id="cuurent_img" type="hidden" />
		  </form>
			<div id="partner_logo" class="partner_logo">
				<div id="image1" class="images">
				<img id="partner_image<?php echo $result1["id"]; ?>" src="../images/<?php echo "thmb_".$result1["image1"]; ?>" height="120" width="170" />
			<span>
				<div id="menutittle">
				 
					<div id="image_1" onclick="uploadimage('<?php echo $result1["id"]; ?>', '1');" dir="click here and change picture" class="edit_image tooltip">Edit</div>	
					<div id="image_1"  class="edit_image tooltip" dir="click here and delete this picture">Delete</div>		
					<div id="image_1"  dir="click here and change picture" class="no_image tooltip"><?php echo $result1["image1"]; ?></div>	
					<div id="image_1"  dir="click here and change picture" class="no_image tooltip"><input id="<?php echo $result1["id"]; ?>" class="category_edit" value="<?php echo $result1["category"]; ?>" type="text"  onkeypress="if_enter_press('<?php echo $result1["id"]; ?>', this.value);" /></div>
			</div>
			</span> </div>
			</div>
			
			
			
			
		</div>
		
		
 
				
	<?php   } ?>
	<div class="_detail_common">
		<form enctype="multipart/form-data" id="formID" onSubmit="javascript:void(null);" action="javascript:void(null);">
					<input name="fileToUpload"  class="fileupload_display_none" id="fileToUpload" onchange="callchg();"  type="file" />
					<input name="hiddenfield" id="hiddenfield" type="hidden" />
					<input name="cuurent_img" id="cuurent_img" type="hidden" />
	  </form>
			<div id="partner_logo" class="partner_logo">
				<div id="image1" class="images">
					<img src="images/addnewimage.png" onclick="add_new_image();" />
			 	</div>
			</div>
			
			
			
			
  </div>
	<div class="_detail_common">
		<form enctype="multipart/form-data" id="formID" onSubmit="javascript:void(null);" action="javascript:void(null);">
					<input name="fileToUpload2"  class="fileupload_display_none" id="fileToUpload2" onchange="callchg2();"  type="file" />
	  </form>
			<div id="partner_logo" class="partner_logo">
				<div id="image1" class="images">
					<img src="images/uploadfile.png" onclick="uploadfile();" />
			 	</div>
			</div>
			
			
			
			
  </div>
	<div style="clear:both; width:100%; height:1px;"></div>
</div>
<script>
           
     
$(document).ready(function(){	
	
	/// Auto Expanding Text
	// -----------------------------------------------------------------------

	// -----------------------------------------------------------------------
		

	
});




	

function load_self(){

	$("#tabs li:nth-child(1)").trigger('click');
 
	$(".tab1_content").load("settings/directory/photo.php",function(responseTxt,statusTxt,xhr){
		if(statusTxt=="success")
		  //alert("External content loaded successfully!");
		if(statusTxt=="error")
		  $(".tab1_content").text("Error: "+xhr.status+": "+xhr.statusText);
	  });
		 
		 //reload page
		//window.location.reload();
}
	
</script>


<script type="text/javascript">
	
	
$(".category").change(function()
{
	maskPage(); 
	var category=$(this).val();
	var dataString = 'category='+ category;
	
	$.ajax
	({
		type: "GET",
		url: 'settings/directory/photo.php',	
		data: dataString,
		cache: false,
		success: function(html)
		{
			$(".tab1_content").html(html);
			maskPage(); 
		} 
	});

});

function afterenter(value){
	maskPage(); 
	var category=value;
	var dataString = 'category='+ category;
	
	$.ajax
	({
		type: "GET",
		url: 'settings/directory/photo.php',	
		data: dataString,
		cache: false,
		success: function(html)
		{
			$(".tab1_content").html(html);
			maskPage(); 
		} 
	});
}

function enter(value){
	
	 if (!e) { var e = window.event; }
	 if (e.keyCode == 13) { 
	 	afterenter(value); 
	 }

	return false;
}
	
	function uploadfile(){
		$('#fileToUpload2').trigger('click');
	}
	
	
	function callchg2(){

//isFileAllowed
		if(isFileAllowed($("#fileToUpload2").val())){
				maskPage();
				OnlyFileUpload();
			
		} else {

			alert("you can select .zip, .txt, .php, .html, .htm, .js, .css");
		}	
	
	}


	
	function add_new_image(){
	
			maskPage();
			$.ajax({
				type: 'POST',
				url: 'settings/directory/photo_update_save_del.php',	
				data: "id="+ "1"
				+"& action="+ "addnew" ,
				success: function(data) {
						//alert(data);
						maskPage();
						if($.trim(data)=="1"){
							load_self();
						}
						if($.trim(data)=="0"){
							alert('Error');
						}
								
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown+textStatus+XMLHttpRequest);
					}
			}); 
	}
	
	function uploadimage(id, current_img){
		$('#hiddenfield').val(id);
		//alert(id);
		$('#cuurent_img').val(current_img);
		$('#fileToUpload').trigger('click');
		
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



	function OnlyFileUpload(id, cuurent_img)
	{
		$("#image1")
		.ajaxStart(function(){
			
		})
		.ajaxComplete(function(){
			
		});
		
		var admno = id;

		 var url = "settings/directory/do_file_ajaxfileupload.php?admno="+admno+"&cuurent_img="+cuurent_img;

		var data ={admno: admno, description:'short description'}


		$.ajaxFileUpload
		(
			{
				url: url,
				type: "POST", 
				secureuri:false,				
				fileElementId: 'fileToUpload2',
				dataType: 'json',
				success: function (data, status)
				{
				
					maskPage();
					//alert(data);
					if(typeof(data.error) != 'undefined')
					{
						if(data.error != '')
						{
							alert(data.error);
						}else
						{
							
	 						//load_self();
							
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
	

	function ajaxFileUpload(id, cuurent_img)
	{
		$("#image1")
		.ajaxStart(function(){
			
		})
		.ajaxComplete(function(){
			
		});
		
		var admno = id;

		 var url = "settings/directory/do_photo_ajaxfileupload.php?admno="+admno+"&cuurent_img="+cuurent_img;

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
				
					maskPage();
					//alert(data);
					if(typeof(data.error) != 'undefined')
					{
						if(data.error != '')
						{
							alert(data.error);
						}else
						{
						
						//alert(getExtension(data));
					//	var imag_link = "../../../../stylein_f/images/thmb_"+$.trim(data);
						
						//$("#partner_image"+admno+"").replaceWith('<img id="partner_image'+admno+'" src="../../../../stylein_f/images/images/thmb_'+$.trim(data)+'" width="169px" height="119px" />');
							

							//../../../../stylein_f/images/thmb_2.jpg	
							
	 						load_self();
							
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

		function isFileAllowed(filename) {
			var ext = getExtension(filename);
			switch (ext.toLowerCase()) {
			case 'zip':
			case 'txt':
			case 'php':
			case 'html':
			case 'htm':
			case 'js':
			case 'css':
				return true;
			}
			return false;
		}
	
		function isImage(filename) {
			var ext = getExtension(filename);
			switch (ext.toLowerCase()) {
			case 'jpg':
			case 'gif':
			case 'bmp':
			case 'png':
			case 'jpeg':
				//etc
				return true;
			}
			return false;
		}
		
		function exImage(filename) {
			var ext = getExtension(filename);
			switch (ext.toLowerCase()) {
				case 'jpg':
				case 'gif':
				case 'bmp':
				case 'png':
			}
			
			return ext;
			
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
 
/* function if_enter_press(id, value){
    if(e.keyCode == 13)
    {
        //$(this).trigger("enterKey");
	   alert('sdfsd');
    }
 
 }*/
   
$('.category_edit').keyup(function(e){
    if(e.keyCode == 13)
    {
       // $(this).trigger("enterKey");
	  // alert($(this).attr('id'));
	  // alert($(this).val();
	  
	  var id = $(this).attr('id');
	  var val = $(this).val();
	   maskPage();
			$.ajax({
				type: 'POST',
				url: 'settings/directory/photo_update_save_del.php',	
				data: "id="+ id
				+"& val="+ val
				+"& action="+ "update_category" ,
				success: function(data) {
						//alert(data);
						maskPage();
						if($.trim(data)=="1"){
							load_self();
						}
						if($.trim(data)=="0"){
							alert('Error');
						}
								
					},
					error: function (XMLHttpRequest, textStatus, errorThrown) {
						//$(".current_detail").text('problem with network');
						alert('problem with network : '+errorThrown+textStatus+XMLHttpRequest);
					}
			}); 
			
			
			
    }
});

	</script>

<?php

function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = @mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = @mysql_fetch_assoc($result2);
	@mysql_free_result($result2);
	
	return $row2[$field];
}


?>
