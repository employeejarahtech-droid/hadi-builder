<?php @session_start();

  $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
         && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	  	if (!$isAjax) {  ?>
  
			 <script language="javascript">
				window.location.href="http://portfoliohere.com/";
			</script> 
	  
 <?php  }
  
     
 @include('../../connection.php');

 $id       = htmlspecialchars(trim($_POST['cuttent_cat']));
   
if($id != "")
{

	$sql=mysql_query("select * from sub_category where category_id='$id'");
	echo '<option value="">Select sub category</option>';
	while($row=mysql_fetch_array($sql))
	{
		$id=$row['id'];
		$data=$row['data'];
		echo '<option value="'.$row['id'].'">'.$row['name'].'</option>';
	}

/*
     $rows = mysql_num_rows($sql);
	 
	 $per_page = 20;
	 
	$totalpages =  ceil($rows /  $per_page);
	
	for($i = 1; $i <= $totalpages; $i++)
	  echo '<option value="'.$i.'">'.$i.'</option>';*/
}
?>