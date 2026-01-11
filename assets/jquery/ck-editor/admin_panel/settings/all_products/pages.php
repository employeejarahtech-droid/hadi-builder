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


$id       = htmlspecialchars(trim($_POST['id']));
   
if($id != "")
{
//$id=$_POST['id'];
$sql=mysql_query("select * from product where pro_category_id='$id'");
/*while($row=mysql_fetch_array($sql))
{
$id=$row['id'];
$data=$row['data'];
echo '<option value="'.$id.'">'.$data.'</option>';
}*/


     $rows = mysql_num_rows($sql);
	 
	 $per_page = 20;
	 
	$totalpages =  ceil($rows /  $per_page);
	
	for($i = 1; $i <= $totalpages; $i++)
	  echo '<option value="'.$i.'">'.$i.'</option>';
}
?>