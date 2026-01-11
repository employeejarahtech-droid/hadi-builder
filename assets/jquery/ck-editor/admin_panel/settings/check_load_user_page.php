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

  

$elecment			= htmlspecialchars(trim($_GET['elecment']));

// output variable
$current_station = '';

// Edite Profile
if( $elecment == "product_vi" ) {
	$current_station = "settings/product_v.php";
} 

else if( $elecment == "home_page_vi" ) {
	$current_station = "settings/home_v.php";
} 

else if( $elecment == "aboutus_vi" ) {
	$current_station = "settings/aboutus_v.php";
} 

else if( $elecment == "policy_vi" ) {
	$current_station = "settings/policy_v.php";
} 

else if( $elecment == "contactus_vi" ) {
	$current_station = "settings/contactus_v.php";
}
else if( $elecment == "location_vi" ) {
	$current_station = "settings/map_v.php";
}
else if( $elecment == "requsition_vi" ) {
	$current_station = "settings/requisition_v.php";
}
/*else if( $elecment == "customt_vi" ) {
	$current_station = "settings/custom_v.php";
}*/
else if( $elecment == "partner_vi" ) {
	$current_station = "settings/partner_v.php";
}
else if( $elecment == "workteam_vi" ) {
	$current_station = "settings/team_v.php";
}
else if( $elecment == "ourclient_vi" ) {
	$current_station = "settings/client_v.php";
}
else if( $elecment == "advertisement_vi" ) {
	$current_station = "settings/adds_v.php";
}
else if( $elecment == "sponsor_vi" ) {
	$current_station = "settings/sponsor_v.php";
}
else if( $elecment == "profile_vi" ) {
	$current_station = "settings/profile_v.php";
}

else if( $elecment == "discount_vi" ) {
	$current_station = "settings/discount_v.php";
}





else {
	$current_station = "settings/home_pr.php";
}



echo $current_station;

?>