<?php @session_start();

  $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
         && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	  	if (!$isAjax) {  ?>
  
			 <script language="javascript">
				window.location.href="http://portfoliohere.com/uae/";
			</script> 
	  
 <?php  }
  
 @require("connection.php");

  
	$error = "";
	$msg = "";
	$fileElementName = 'myfile';
	$SatusName = 'urname';
	$path = "";
	
	if(!empty($_FILES[$fileElementName]['error']))
	{
		switch($_FILES[$fileElementName]['error'])
		{

			case '1':
				$error = 'The uploaded file exceeds the upload_max_filesize directive in php.ini';
				break;
			case '2':
				$error = 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form';
				break;
			case '3':
				$error = 'The uploaded file was only partially uploaded';
				break;
			case '4':
				$error = 'No file was uploaded.';
				break;

			case '6':
				$error = 'Missing a temporary folder';
				break;
			case '7':
				$error = 'Failed to write file to disk';
				break;
			case '8':
				$error = 'File upload stopped by extension';
				break;
			case '999':
			default:
				$error = 'No error code avaiable';
		}
	}elseif(empty($_FILES['myfile']['tmp_name']) || $_FILES['myfile']['tmp_name'] == 'none')
	{
		$error = 'No file was uploaded..';
	}else 
	{
			$file_name = $_FILES['myfile']['name'];
			$file_tmp=$_FILES['myfile']['tmp_name'];
			$msg .= " File Name: " . $_FILES['myfile']['name'] . ", ";
			$msg .= " File Size: " . @filesize($_FILES['myfile']['tmp_name']);
			//for security reason, we force to remove all uploaded file
			
			//$special = 'shapon';
			//$new_file_name = str_replace($special,'',$file_name);
			//$path= "primages/".$new_file_name;
			//(copy($HTTP_POST_FILES['ufile']['tmp_name'], $path))
			$admno = CustomMaximumnNumber("images", 'imgid');
			

			mysql_query("INSERT INTO images (imgid, imgname) values ('".$admno."', '".$file_name."')");


			
			$date = md5(time());
			$fileName = $_FILES["myfile"]["name"];
			$splitName = explode(".", $fileName);
			$fileExt = end($splitName);
			$newFileName  = strtolower($admno.'.'.$fileExt);
			
			copy($file_tmp, "primages/$newFileName");
			$file = $newFileName;
 			//$result=mysql_query("INSERT INTO image (ImageName, DevelopmentCustomID, Satus) values ('$file_name', '$projectID', '$SatusName')");
			@unlink($_FILES['myfile']);		
	}		
	echo "{";
	
	echo				"error: '" . $error . "',\n";
	echo				"msg: '" . $file . "'\n";
	
	echo "}";
	
	
function CustomMaximumnNumber($table, $field){
	
	$max = 0;
	$sql="select max(".$field.") as ".$field." from ".$table."";
	$res = mysql_query($sql);
	$dat = mysql_fetch_assoc($res);
					
	if ($dat[$field]==null){
		$max = 1;	
	} else {
		$max = $dat[$field] +1;
	}
	
	return $max;

}

?>