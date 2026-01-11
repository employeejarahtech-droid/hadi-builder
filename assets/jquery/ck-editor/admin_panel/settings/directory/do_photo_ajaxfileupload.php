<?php @session_start();
 @include('../../../connection.php');

  
	$error = "";
	$msg = "";
	$fileElementName = 'fileToUpload';
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
	}elseif(empty($_FILES['fileToUpload']['tmp_name']) || $_FILES['fileToUpload']['tmp_name'] == 'none')
	{
		$error = 'No file was uploaded..';
	}else 
	{
			$file_name = $_FILES['fileToUpload']['name'];
			$file_tmp=$_FILES['fileToUpload']['tmp_name'];
			$msg .= " File Name: " . $_FILES['fileToUpload']['name'] . ", ";
			$msg .= " File Size: " . @filesize($_FILES['fileToUpload']['tmp_name']);
			
			$manager_name =  $_SESSION["topleveladmincokieid"];
			
			$admno = date("YmdHis"); 
			$id = $_GET["admno"];

			
			$cuurent_img = $_GET["cuurent_img"];
			$current_field = "";
			if($cuurent_img  == "1") {
				$current_field ="image1";
			}
			if($cuurent_img  == "2") {
				$current_field ="image2";
			}
			if($cuurent_img  == "3") {
				$current_field ="image3";
			}
			
			
			$date = md5(time());
			$fileName = $_FILES["fileToUpload"]["name"];
			$splitName = explode(".", $fileName);
			$fileExt = end($splitName);
			$newFileName  = strtolower($id.'.'.$fileExt);
			
			// delete previous image
			$previous_img = ReturnAnyOneFieldFromAnyTable("gallery", "image1", "id", $id);	
			
						// Delete previous imagge
			 $del_file = "../../../images/$previous_img"; 
			 $del_file_thmb = "../../../images/thmb_$previous_img"; 
			 if($previous_img !="no_image.jpg"){
				 @unlink($del_file);
				 @unlink($del_file_thmb);		
			 }
			
			mysql_query("UPDATE  gallery SET image1 = '".$newFileName."' where id = '".$id."'");

		
			$file= $newFileName;
	
			$photo_name=$file;
	
			$tmpname = $_FILES['fileToUpload']['tmp_name'];
	
			$file_ext= substr($photo_name, strripos($photo_name, '.'));     
	
			// Resize for thumb
			$dir = "../../../images/"; 
			@img_resize( $tmpname , 1000 ,  $dir , $photo_name, 1);
			@img_resize( $tmpname , 200 ,  $dir , "thmb_".$photo_name, 1);
			
			//$tmp_name = $_FILES["pictures"]["tmp_name"][$key];
			//$name = $_FILES["pictures"]["name"][$key];
			//move_uploaded_file($tmpname, "$dir/$photo_name");
			//move_uploaded_file($tmpname, "$dir/thmb_".$photo_name);
			//copy("$dir/$photo_name", $dir."/".'thmb_'.$photo_name);

 			// delete original
			@unlink($_FILES['fileToUpload']);		
			
			
			
			
	}		
	echo "{";
	
	echo				"error: '" . $error . "',\n";
	echo				"msg: '" .$photo_name . "'\n";
	
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

function img_resize( $tmpname, $size, $save_dir, $save_name, $maxisheight = 0 )

    {

    $save_dir     .= ( substr($save_dir,-1) != "/") ? "/" : "";

    $gis        = getimagesize($tmpname);

    $type        = $gis[2];

    switch($type)

        {

        case "1": $imorig = imagecreatefromgif($tmpname); break;

        case "2": $imorig = imagecreatefromjpeg($tmpname);break;

        case "3": $imorig = imagecreatefrompng($tmpname); break;

        default:  $imorig = imagecreatefromjpeg($tmpname);

        }



        $x = imagesx($imorig);

        $y = imagesy($imorig);



        $woh = (!$maxisheight)? $gis[0] : $gis[1] ;   



        if($woh <= $size)

        {

        $aw = $x;

        $ah = $y;

        }

            else

        {

            if(!$maxisheight){

                $aw = $size;

                $ah = $size * $y / $x;

            } else {

                $aw = $size * $x / $y;

                $ah = $size;

            }

        }  

        $im = imagecreatetruecolor($aw,$ah);
		
		
		
						
		if(($gis[2] == 1) or ($gis[2]==3)){
		  imagealphablending($im, false);
		  imagesavealpha($im,true);
		  $transparent = imagecolorallocatealpha($im, 255, 255, 255, 127);
		  imagefilledrectangle($im, 0, 0, $aw, $ah, $transparent);
		 }			
					
					
		imagecopyresampled($im,$imorig , 0,0,0,0,$aw,$ah,$x,$y);
		
		switch($type)
        {

       		case "1": 
				imagegif($im, $save_dir.$save_name);
				break;
			break;
	
			case "2": 
				imagejpeg($im, $save_dir.$save_name);
			break;
	
			case "3": 
				imagepng($im, $save_dir.$save_name);
				break;
	
			default: 
				imagejpeg($im, $save_dir.$save_name);

        }
		
		
		// Create the image
/*	
		
		if($size == "120")
			$fontSize = 1;
		else if($size == "200")
			$fontSize = 2;
		else if($size == "500")
			$fontSize = 4;
		else
			$fontSize = 2;
			
		if($size == "120") {
			$xx = $aw-90;
			$yy = $ah-10;
		} else if($size == "200") {
			$xx = $aw-110;
			$yy = $ah-40;
		} else if($size == "500") {
			$xx = $aw-150;
			$yy = $ah-30;
		} else {
			$xx = $aw-90;
			$yy = $ah-10;
		}				


    if (imagecopyresampled($im,$imorig , 0,0,0,0,$aw,$ah,$x,$y)) {
    
	//	$string = "portfoliohere.com";
			$string ="";
		$color = imagecolorallocate($im, 255, 0, 0);
   		imagestring($im, $fontSize, $xx, $yy, $string, $color);
		
	    if (imagejpeg($im, $save_dir.$save_name))
            return true;
        else
            return false;
			
	}
*/
}



function ReturnAnyOneFieldFromAnyTable($table, $field, $wherefieldname, $passid){
	$result2 = mysql_query("SELECT * FROM ".$table." WHERE  ". $wherefieldname." = '".$passid."'"); 
	$row2 = mysql_fetch_assoc($result2);
	mysql_free_result($result2);
	
	return $row2[$field];
}



	@mysql_close($conn);
?>


