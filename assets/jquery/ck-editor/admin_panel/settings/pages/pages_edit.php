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


 $id  = $_POST['id'];
 

$sql = "SELECT * FROM pages WHERE id = $id";
$result = mysql_query($sql) or die(mysql_error());
$row = mysql_fetch_assoc($result);

 ?>
 
<style type="text/css">
	
	#Addnew {
		height: 200px;
		width: 600px;
		margin-top: 20px;
		margin-right: auto;
		margin-left: auto;
		margin-bottom: 20px;
	}
	

#header_text {
	font-family: "Times New Roman", Times, serif;
	color: #339933;
	margin-top: 10px;
	margin-left: auto;
	font-size: 18px;
	height: 30px;
	border-bottom-width: 1px;
	border-bottom-style: dotted;
	border-bottom-color: #339933;
	margin-right: auto;
	width: 560px;
}

#clear{
	clear:both;
	height: 1px;
	width: 100%;
}

#field_content{
	height: 30px;
	width: 500px;
	margin-left: 20px;
	margin-top: 5px;
}

#tittle {
	float: left;
	width: 150px;
	margin-left: 10px;
}
#field {
	float: left;
	width: 290px;
}

.input_single{
	width: 270px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
}
.input_multi{
	width: 270px;
	font-family: "Times New Roman", Times, serif;
	font-size: 12px;
}

._span{
	height: 20px;
	width: 25px;
	float: left;
}


</style>
	


<div id="Addnew">

	<div id="header_text">Edit Page </div>
	
	<div id="clear"></div>

	<div id="field_content">
		<div id="tittle">Name</div>
		<div id="field"><input name="id" id="id" type="hidden" value="<?php echo $row['id']; ?>" /><input class="input_single" id="name" name="name" type="text" value="<?php echo $row['name']; ?>" onkeyup="removeSpaceOnly(this)"  /></div>
		<div id="s_name" class="_span"></div>

	</div>
	<div id="field_content">
		<div id="tittle">&nbsp;</div>
		<div id="field">
		  <input id="submit_this" type="submit" name="Submit" onclick="update_new();" value="   Save   " />
		</div>
	</div>


</div>

<script>
           
     
$(document).ready(function(){	
	
	

	
});



function update_new(){   


		var myvars = new Array();
			myvars[0] = "name";
			
			
        var valid =  error_check(myvars);	
		
		
      	
	
	
	var id = $('#id').attr('value');
	var name = $('#name').attr('value');

	
	if(valid) {
	
		maskPage();
		
		$.ajax({
				type: 'POST',
				url: 'settings/pages/pages_update_save_del.php',	
				data: "name="+ name
				+"& id="+ id 
				+"& action="+ "update" ,
				data: { name: name, id: id, action: "update"  },
				success: function(data) {
						//alert(data);
						maskPage();
						if($.trim(data)=="1"){
							$("#action_message").text("Saved success !");
							$("#submit_this").attr("disabled", "disabled");
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

 function removeSpaceOnly(box) {
 	var str=$(box).val(); 
	 var newstr = str.replace(/\s+/, "");
	   $(box).val(newstr);
	   str = $(box).val();
	
 }
 

 function lettersOnly2(evt) {
       evt = (evt) ? evt : event;
	   var englishAlphabetDigitsAndWhiteSpace = /[A-Za-z0-9]/g;

        var key = String.fromCharCode(evt.which);
		  if (evt.charCode === 92) { //If you want allow back space than check it (charcode === 92 || charcode === 8)
            return true;
        } else {

         	var current = $.trim($("#username_chat").val());
		 	$("#username_chat").val(current)
		 }
       return false;
  }
  
   function lettersOnly(box) {
   		
   		//string.replace(searchvalue,newvalue)
     	var str=$(box).val(); 

	   var newstr = str.replace(/\W/g,"");
	   $(box).val(newstr);
	   str = $(box).val();
	   if(str.match(/admin/gi)){
		   	var newstr = str.replace(/admin/g,"");
	   		$(box).val(newstr);
	    	alert("Admin not allow");
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
