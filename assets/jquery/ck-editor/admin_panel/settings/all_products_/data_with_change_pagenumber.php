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


$category       = htmlspecialchars(trim($_POST['category']));
$page       	= htmlspecialchars(trim($_POST['page']));

$per_page = 20;

$start = ($page-1)*$per_page;  
//$sql = "select * from adds order by add_id limit $start,$per_page";  


 ?>
  
  
 <?php 

   $calledto       	= htmlspecialchars(trim($_POST['calledto']));
   
    if($calledto == "totaldata") {
	
	$sql1 = "select * from product where pro_category_id='".$category."'  ORDER BY serial ASC LIMIT $start,  $per_page";
	
	$rsd2 = @mysql_query($sql1);
	$total_data = @mysql_num_rows($rsd2);
	
	echo $total_data;
	
	}
   
   if($calledto == "alldata") {
  ?>
  <style type="text/css">
.main_data{
	height: auto;
	width: 95%;
	margin-top: 2px;
	margin-right: auto;
	margin-left: auto;
	padding-bottom: 3px;
	margin-bottom: 2px;
}

.list_data_body {
	height: auto;
	width: 570px;
	margin-top: 10px;
	margin-right: auto;
	margin-bottom: 10px;
	margin-left: auto;
}
.left_img {
	height: 90px;
	width: 90px;
	border: 1px solid #000000;
	margin: 2px;
	float: left;
	padding: 1px;
	position: relative;
}
.right_data{
	width: 435px;
	height: auto;
	float: left;
	margin-left: 2px;
}
.company_tittle {
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	font-style: normal;
	font-weight: 300;
	color: #669900;
	padding-left: 5px;
	height: auto;
	width: 100%;
}

.company_tittle input{
  margin-top:5px;
  margin-bottom:5px;
}
.message_tittle{
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	font-style: normal;
	font-weight: 300;
	color: #FF6699;
	padding-left: 5px;
	height: 20px;
	width: 100%;
	margin-bottom:5px;
}
.message_body {
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	font-style: normal;
	padding-left: 5px;
	height: auto;
	width: 100%;
	margin-top:5px;
	margin-bottom:5px;
}
.main_data .data_detail_button{
	height: 20px;
	width: 100%;
	position: relative;
}
.data_detail {
	height: auto;
	width: 100%;
	display: none;
}
.data_detail {
	height: auto;
	width: 100%;
	display: none;
}
.data_detail_master{
	height: auto;
	width: 500px;
	margin-left: 30px;
	background-color: #F0F0F0;
}

/*.main_data .viewThisResult {
    display: none;
}
*/
.main_data:hover .data_detail_button {
	visibility: visible;
}

.viewThisResult{
	float: right;
	height: 18px;
	width: 20px;
	cursor: pointer;
	margin-top: 2px;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	font-weight: bold;
}

.like_and{
	float: left;
	width: 90px;
	margin-left: 10px;
	text-align: center;
	font-family: "Times New Roman", Times, serif;
	font-size: 14px;
	margin-top: 2px;
	cursor: pointer;
}

.textfield_tittle{
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	width: 430px;
	color: #FF6699;
	border: 1px solid #EFEFEF;
	padding-left: 3px;
	height: 20px;
	
	outline-color: transparent;
  	outline-style: none;
	margin-bottom:5px;
}

.textfield_tittle:hover{
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	width: 430px;
	color: #FF6699;
	border: 1px solid #EFEFEF;
	padding-left: 3px;
	height: 20px;

}

.textfield_modelnumber{
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	width: 430px;
	color: #669933;
	border: 1px solid #EFEFEF;
	padding-left: 3px;
	height: 20px;
	
	outline-color: transparent;
  	outline-style: none;
	margin-bottom:5px;
}

.textfield_modelnumber:hover{
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	width: 430px;
	color: #669933;
	border: 1px solid #EFEFEF;
	padding-left: 3px;
	height: 20px;
}

.textarea_short{
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	width: 430px;
	color: #000000;
	padding-left: 3px;
	height: 50px;
	border: 1px solid #EFEFEF;
	
	outline-color: transparent;
  	outline-style: none;
}

.textarea_short:hover{
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
	width: 430px;
	color: #000000;
	padding-left: 3px;
	height: 50px;
	border: 1px solid #EFEFEF;
}



/* Enlarge image */

.left_img span{ /*CSS for enlarged image*/
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



.left_img span #menutittle{ /*CSS for enlarged image*/
	DISPLAY: block;
	Z-INDEX: 6500;
	LEFT: 101px;
	WIDTH: 358px;
	POSITION: absolute;
	TOP: -1px;
	HEIGHT: 442px;
	border: 1px solid #000000;
	padding: 2px;
	
}



.left_img:hover span{ /*CSS for enlarged image on hover*/
	background-color:transparent;
	visibility: visible;
	top: auto;
	left: auto; /*position where enlarged image should offset horizontally */
		border-width: 6px 6px 0 6px;
		border-radius: 5px;
}



.button_tittle1{
	float: left;
	height: 20px;
	width: 85px;
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
	background-color: #F0F0F0;
	cursor:pointer;
}

.button_tittle1:hover{
	background-color: #66CCFF;
	cursor:pointer;
}

.button_tittle1:active{
	background-color: #6699CC;
	cursor:pointer;
}



  </style>
  



<div class="list_data_body">
<?php

$name_p = "name";
$code_p = "address & code";
$price_p = "note";
$items_p = "start date";
$short_p = "short details";
$color_p = "color";
$size_p = "size";


/*

code = name
name =details

price
color
qunatityinbox
size


*/


	$sql1 = "select * from product where pro_category_id='".$category."'  ORDER BY serial ASC LIMIT $start,  $per_page";
	$i = 0;
	$rsd2 = @mysql_query($sql1);
	 while($result2 = @mysql_fetch_assoc($rsd2)){
	 
	 $i++;

?>



	<div id="<?php echo $i; ?>" class="main_data bottom">
		<div class="main_title_data">
			<div class="left_img"><img id="main_product<?php echo $result2["id"];  ?>" src="../images/thumb/<?php echo $result2["image1"] == "" ?  "logo.gif" : $result2["image1"];  ?>" width="89px" height="89px" />
			<span>
				<div id="menutittle" class="load_enlarge_img<?php echo $result2["id"];  ?>">
						<img id="main_product_large<?php echo $result2["id"];  ?>" src="../images/fixed/<?php echo $result2["image1"] == "" ?  "logo.gif" : $result2["image1"];  ?>" width="358" height="442" />				</div>		
			</span>			
			</div>
			<div id="right_data_p<?php echo $i; ?>" class="right_data">
			
				<div class="company_tittle"><input name="textfield_name<?php echo $result2["id"];  ?>" id="textfield_name<?php echo $result2["id"];  ?>" class="textfield_tittle" value="<?php echo $result2["code"];  ?>" type="text" placeholder="<?php echo $name_p;  ?>" /></div>
				
				<div class="message_tittle"><input name="textfield_pr_code<?php echo $result2["id"];  ?>" id="textfield_pr_code<?php echo $result2["id"];  ?>" class="textfield_modelnumber" value="<?php echo $result2["pr_code"];  ?>" placeholder="<?php echo $code_p;  ?>"  type="text" /></div>
				
				<div class="message_tittle"><input name="textfield_price<?php echo $result2["id"];  ?>" id="textfield_price<?php echo $result2["id"];  ?>" class="textfield_modelnumber" value="<?php echo $result2["price"];  ?>" placeholder="<?php echo $price_p;  ?>"  type="text" /></div>
				
				<div class="message_tittle"><input name="textfield_qunatityinbox<?php echo $result2["id"];  ?>" id="textfield_qunatityinbox<?php echo $result2["id"];  ?>" class="textfield_modelnumber" value="<?php echo $result2["qunatityinbox"];  ?>" placeholder="<?php echo $items_p;  ?>"  type="text" /></div>
				
				
				<div class="message_body">
					<textarea name="textarea_short<?php echo $result2["id"];  ?>" class="textarea_short" id="textarea_short<?php echo $result2["id"];  ?>" cols=""  maxlength="50" onchange="" onkeyup=""  onkeydown="" rows=""  placeholder="<?php echo $short_p;  ?>"><?php echo str_replace("<br />", "\n", $result2["name"]); ?></textarea>	
	
				</div>
				<div class="message_body" style="display:none;">
					<textarea name="textarea_color<?php echo $result2["id"];  ?>" class="textarea_short" id="textarea_color<?php echo $result2["id"];  ?>" cols=""  maxlength="50" onchange="limitText(this,250);" onkeyup="limitText(this,250);"  onkeydown="limitText(this,250);" rows=""  placeholder="<?php echo $color_p;  ?>" ><?php echo str_replace("<br />", "\n", $result2["color"]); ?></textarea>	
	
				</div>
				<div class="message_body" style="display:none;">
					<textarea name="textarea_size<?php echo $result2["id"];  ?>" class="textarea_short" id="textarea_size<?php echo $result2["id"];  ?>" cols=""  maxlength="50" onchange="limitText(this,250);" onkeyup="limitText(this,250);"  onkeydown="limitText(this,250);" rows="" placeholder="<?php echo $size_p;  ?>" ><?php echo str_replace("<br />", "\n", $result2["size"]); ?></textarea>	
	
				</div>
			</div>
		</div>	
		<div style="clear:both; height:1px;"></div>
		<div class="data_detail_button">
			<div id="" dir="click to delete this product" class="like_and yui3-button1 tooltip" onclick="delete_product('<?php echo $result2["id"]; ?>');">Delete </div>
			<div id="" class="like_and yui3-button1 tooltip" dir="change serial of view of this product">Serial
			<input id="hiddenid<?php echo $i; ?>" type="hidden" name="hiddenid<?php echo $i; ?>" value="<?php echo $result2["id"]; ?>" />
			  <input onkeyup="checkInput(this);" onkeydown="checkInput(this);" name="serial<?php echo $i; ?>" id="serial<?php echo $i; ?>" type="text" size="2" value="<?php echo $result2["serial"]; ?>" maxlength="2" />
			</div>
			<div id="message" dir="click to save product data" class="like_and yui3-button1 tooltip" onclick="save_product('<?php echo $result2["id"]; ?>', '<?php echo $i; ?>');">Save</div>
			
			
			<div id="hide_show<?php echo $result2["id"];  ?>" dir="click here to see detail" class="viewThisResult tooltip" onclick="loaddetail('<?php echo $result2["id"];  ?>');">[+]</div>
		</div>	
		<div style="clear:both; height:1px;"></div>
		<div id="data_detail<?php echo $result2["id"];  ?>" class="data_detail">
			<div id="data_detail_master<?php echo $result2["id"];  ?>" class="data_detail_master">
				
			</div>
		</div>				
	</div>
<?php  } ?>
	
</div>

<?php } ?>



