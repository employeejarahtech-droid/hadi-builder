<?php @session_start();

  $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
         && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	  	if (!$isAjax) {  ?>
  
			 <script language="javascript">
				window.location.href="http://portfoliohere.com/uae/";
			</script> 
	  
 <?php  }
  


$elecment			= htmlspecialchars(trim($_GET['elecment']));

// output variable
$current_station = '';





//homepage 
 if( $elecment == "language" ) {
	$current_station = "settings/language_s.php";
}
else if( $elecment == "link_type" ) {
	$current_station = "settings/link_type_s.php";
}
else if( $elecment == "link" ) {
	$current_station = "settings/link_s.php";
}
else if( $elecment == "sub_link" ) {
	$current_station = "settings/sub_link_s.php";
}
else if( $elecment == "gallery" ) {
	$current_station = "settings/photo_s.php";
}
else if( $elecment == "pages" ) {
	$current_station = "settings/pages_s.php";
}
else if( $elecment == "create_page" ) {
	$current_station = "settings/create_pages_s.php";
}
else if( $elecment == "product" ) {
	$current_station = "settings/product_s.php";
}
else if( $elecment == "truncate" ) {
	$current_station = "settings/truncate_s.php";
}
else if( $elecment == "table" ) {
	$current_station = "settings/table_s.php";
}
else if( $elecment == "settings" ) {
	$current_station = "settings/settings_s.php";
}





else {
	$current_station = "settings/home_pr.php";
}



echo $current_station;

?>