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

 $id       = mysql_real_escape_string(htmlspecialchars(trim($_POST['id'])));
 

 $style1  = $_COOKIE['style1'];
 $country  = $_COOKIE['country'];
 
 ?>
 
<link rel="stylesheet" type="text/css" href="settings/location_map/css/<?php echo "map_".$style1; ?>.css"> 

	
	<?php 
			 $passid =  $id ;
	
			 $lan   = ReturnAnyOneFieldFromAnyTable("locationmap", "langitute", "profile_id", $passid);
			 $long  = ReturnAnyOneFieldFromAnyTable("locationmap", "longitute", "profile_id", $passid);
			 $tittle   = ReturnAnyOneFieldFromAnyTable("locationmap", "titile", "profile_id", $passid);
			 $detail  = ReturnAnyOneFieldFromAnyTable("locationmap", "detail", "profile_id", $passid);
			 
			 
			 if(trim($lan) == "" ) {
			 	//Dubai 
				// $lan 	= 25.19500042430748;
				  $lan 	= ReturnAnyOneFieldFromAnyTable("country", "langitute", "id", $country);
				// Indonesia
				
				// Bangladesh
			 	// $lan 	= -6.3550566;
			 }
			 
			 if(trim($long) == "" ) {
			 	//Dubai 
				//  $long 	= 55.537261962890625;
				 $long 	= ReturnAnyOneFieldFromAnyTable("country", "longitute", "id", $country);
				// Indonesia
				
				// Bangladesh
			 	//  $long 	= 106.8859437;
			 }
			 
			 
	?>

    <script type="text/javascript">


        var map;
        var markersArray = [];

        function initMap(id)
        {
			
			
			var lan 	= '<?php echo $lan; ?>';
			var long 	=  '<?php echo $long; ?>';
			
			// indonesia
			//var lan 	= -6.3550566;
			//var long 	= 106.8859437;

			// bangladesh
			//var lan 	= 23.7099210000000000006;
			//var long 	= 90.407143000000020000;
			
			
				geocoder = new google.maps.Geocoder();

			// for dubai
            //var latlng = new google.maps.LatLng(24.499352749807354, 54.39159393310547);
			var latlng = new google.maps.LatLng(lan, long);
            var myOptions = {
                zoom: 16,
                center: latlng,
				
                //mapTypeId: google.maps.MapTypeId.ROADMAP
				mapTypeId: google.maps.MapTypeId.HYBRID
				//ROADMAP
            };
            map = new google.maps.Map(document.getElementById(id), myOptions);
			
			 placeMarker(new google.maps.LatLng(lan, long));
			 

/*            // add a click event handler to the map object
            google.maps.event.addListener(map, "click", function(event)
            {
		
                // place a marker
                placeMarker(event.latLng);

                // display the lat/lng in your form's lat/lng fields
                document.getElementById("latFld").value = event.latLng.lat();
                document.getElementById("lngFld").value = event.latLng.lng();
            });*/
			
			
			
        }
		
		       function addLocationInfo(marker) {
            var infoWindow = new google.maps.InfoWindow({ content: locationAddress, size: new google.maps.Size(50, 50) });
            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });
        }

        function codeLatLng(latlng, marker) {
            if (geocoder) {
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            locationAddress = results[1].formatted_address;
                        }
                    } else {
                        locationAddress = "Neznan naslov";
                    }
                    addLocationInfo(marker);
                });
            }
        }

        function placeMarker(location) {
            // first remove all markers if there are any
            deleteOverlays();

            var marker = new google.maps.Marker({
                position: location, 
                map: map,
				title: "<?php echo $tittle; ?>"
            });
			

            // add marker in markers array
            markersArray.push(marker);

            //map.setCenter(location);
        }
		
		
		

        // Deletes all markers in the array by removing references to them
        function deleteOverlays() {
            if (markersArray) {
                for (i in markersArray) {
                    markersArray[i].setMap(null);
                }
            markersArray.length = 0;
            }
        }

    </script>



<div class="_add_new_sponsor_area">
             
	<div style="clear:both; width:100%; height:1px;"></div>


  <div id="" class="_listdata">
  
  		<div class="_tittle_common">
			<div class="_bottom_v" dir="Click here and change">
				
				<?php echo $tittle; ?>
			</div>
    </div>
  		<div style="clear:both; width:100%; height:1px;"></div>
  		<div class="_detail_common_v">
			<?php echo $detail; ?>
		</div>
		
		<div style="clear:both; width:100%; height:1px;"></div>

		<div class="_tittle_common">
			<div class="_fields">
				
				<div id="title_" class="title_">langitute</div>
				<div id="title_field" class="title_field" >
					<input id="latFld" type="text" name="latFld" readonly="true" value="<?php echo $lan; ?>" class="fieldlang" />
				</div>
				
				
				<div id="title_" class="title_">longitute</div>
				<div id="title_" class="title_field">
					<input id="lngFld" type="text" readonly="true" name="lngFld" value="<?php echo $long; ?>" class="fieldlang" />
				</div>
				
				
			</div>
    </div>
		<div style="clear:both; width:100%; height:1px;"></div>
	  <div class="_action_area"></div>
		<div style="clear:both; width:100%; height:1px;"></div>
  </div>
				
	<div style="clear:both; width:100%; height:1px;"></div>
		
</div>



    <div id="map_canvas2">
		
	</div>
	
    <script>
           
     
$(document).ready(function(){	
	
	/// Auto Expanding Text
	// -----------------------------------------------------------------------
	 $('.autoexpand_map').trigger('onkeydown');
	 $('.autoexpand_map').trigger('onchange');
	 $('.autoexpand_map').trigger('onkeypress');
	 $('.autoexpand_map').trigger('onkeyup');
	// -----------------------------------------------------------------------
		
	
					  
		initMap("map_canvas2");
					  
					

	
});



function fixedchar(txtarea, maxchar) {

		var count= 1;
		var chars= maxchar;
        var v = $(this).val();
        var vl = v.replace(/(\r\n|\n|\r)/gm,"").length;   
    if (parseInt(vl/count) == chars) {
        $(this).val(v + '\n');
    count++;
    }
	
	if(count <= chars) {
	   return false;
	} else {
		return true;
	}

	
}

function checkInput(ob) {
  var invalidChars = /[^0-9]/gi
  if(invalidChars.test(ob.value)) {
            ob.value = ob.value.replace(invalidChars,"");
      }
}

function posting(){    
                  
    var confirm_user = confirm("Do you want to save this?");
    if(confirm_user){
        
                          
                         try {   
						                               
                            hiddenid = $('#hiden_id').val();
							tittle_common = $('#tittle_common').val();
							detail_common = $('#detail_common').val();
							latFld = $('#latFld').val();
							lngFld = $('#lngFld').val();
                     		action = "save_map";
                            
                              $.ajax({
                                  type: "POST",
                                  url: "settings/location_map/map_location_save.php",
                                  data: "id="+ $.trim(hiddenid)
                                  +"& tittle_common="+ $.trim(tittle_common)
								  +"& detail_common="+ $.trim(detail_common)
								  +"& latFld="+ $.trim(latFld)
								  +"& lngFld="+ $.trim(lngFld)
                                  +"& action="+ "save_map"  
                                  ,
                                  success: function(data){
								  //	alert(data);
								  	if($.trim(data)=="1"){
                                        load_self();
										
									}
                                  }	,
								error: function (XMLHttpRequest, textStatus, errorThrown) {	

								  $("._products").text("Error: "+textStatus+": "+errorThrown);
								}				
                             });

                           

                          } catch(e) {
                                  alert(e.message);
                          } 

				   
           }    

 }   


	function keydown_expand(textarea){
		
		
	  var limit = 1200;
	  textarea.style.height = 50;
	  textarea.style.height = Math.min(textarea.scrollHeight, limit) + "px";
	  
	  
	}




	

function load_self(){

		$("._products").html('<div style="text-align:center;font-size:14px;font-weight:bold;height:500px;"> Loading... </div>');
		 $("._products").load("settings/location_map/map_location.php",function(responseTxt,statusTxt,xhr){
			if(statusTxt=="success")
			  //alert("External content loaded successfully!");
			  initMap("map_canvas");
			if(statusTxt=="error")
			  $("._products").text("Error: "+xhr.status+": "+xhr.statusText);
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
