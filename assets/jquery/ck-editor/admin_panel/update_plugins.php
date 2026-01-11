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

  
 /** this function will take in an array with keyed values
 ** and place the values into the
 ** same name columns as the key name.
 **
 ** concept :   mysql_insert_array(array, table_name)
 ** Creator : Md. Maksudul Haque
 ** Mobile  : +8801191133239    
 ** ie...
 **
 **      $array = array('fieldname' => $value, 'fieldname' => $value);
 **
 **      mysql_insert_array($array, "$tablename");
 **/

 class update_plugins {
 
     private $array = array ('');
     private $table = '';
	 private $str	= '';

 
     function mysql_update_array($array, $table, $field1, $value1) {
        	//$keys = array_keys($array);
			
			  $str2 	= '';
			
          	foreach ($array as $key => $value) {
				$str2 .= $key."='".$value."',";
			}
			 
			$str = substr_replace($str2 ,"",-1);
          	$query = "UPDATE `" . $table . "`  SET  " . $str . "  WHERE `" . $field1 . "`='" . mysql_real_escape_string($value1) . "'";
		  
          if (($result = mysql_query($query)) == 0)
              return(0);

          if (mysql_affected_rows() == 1)
              return(1);
          else
              return(0);

	 }
		
      
}
  
   
?>