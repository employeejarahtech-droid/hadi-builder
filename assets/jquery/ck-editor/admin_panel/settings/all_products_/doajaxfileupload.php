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
			if($cuurent_img  == "4") {
				$current_field ="image4";
			}
			if($cuurent_img  == "5") {
				$current_field ="image5";
			}
			if($cuurent_img  == "6") {
				$current_field ="image6";
			}
			
			
			$date = md5(time());
			$fileName = $_FILES["fileToUpload"]["name"];
			$splitName = explode(".", $fileName);
			$fileExt = end($splitName);
			$newFileName  = strtolower($manager_name."_".$admno.'.'.$fileExt);
			
			// delete previous image
			$previous_img = ReturnAnyOneFieldFromAnyTable("product", $current_field, "id", $id);			
			
			mysql_query("UPDATE  product SET $current_field = '".$manager_name."_".$newFileName."' where id = '".$id."' ");

		
			$file= $newFileName;
	
			$photo_name=$manager_name."_".$file;
	
			$tmpname = $_FILES['fileToUpload']['tmp_name'];
	
			$file_ext= substr($photo_name, strripos($photo_name, '.'));     
	
			// Resize for thumb
			$dir = "../../../images/thumb/"; 
			//@img_resize( $tmpname , 100 ,  $dir , $photo_name, 1);
			move_uploaded_file($tmpname, "$dir/$photo_name");
			copy("$dir/$photo_name", $dir."/".$photo_name);
			
			// Resize for small
			$dirr = "../../../images/small/"; 
			//@img_resize( $tmpname , 300 ,  $dir , $photo_name, 1);
			move_uploaded_file($tmpname, "$dirr/$photo_name");
			copy("$dir/$photo_name", $dirr."/".$photo_name);
	
			// Resize for fixed
			$dirrr = "../../../images/fixed/"; 
			//@img_resize( $tmpname , 1000 ,  $dir , $photo_name, 1);
			move_uploaded_file($tmpname, "$dirrr/$photo_name");
			copy("$dir/$photo_name", $dirrr."/".$photo_name);
			
			// Delete previous imagge
			 $del_file = "../../../images/thumb/$previous_img"; 
			 @unlink($del_file);
			 // Delete previous imagge
			 $del_file = "../../../images/small/$previous_img"; 
			 @unlink($del_file);
			 // Delete previous imagge
			 $del_file = "../../../images/fixed/$previous_img"; 
			 @unlink($del_file);
 			// delete original
			 @unlink($_FILES['fileToUpload']);		
			
			
			
			
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

function img_resize( $tmpname, $size, $save_dir, $save_name, $maxisheight = 0 )

    {

    $save_dir     .= ( substr($save_dir,-1) != "/") ? "/" : "";
	
	
    list($imagewidth, $imageheight, $imageType) = getimagesize($tmpname);
    $imageType = image_type_to_mime_type($imageType);
    $newImageWidth = ceil($width * $scale);
    $newImageHeight = ceil($height * $scale);
    //$newImage = imagecreatetruecolor($newImageWidth,$newImageHeight);
	
	
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

        $im = imagecreatetruecolor($aw,$ah);  // newImage
		
		/*// Create the image
	
		
		if($size == "100")
			$fontSize = 1;
		else if($size == "200")
			$fontSize = 2;
		else if($size == "500")
			$fontSize = 4;
		else
			$fontSize = 2;
			
		if($size == "100") {
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
		
					*/
					
					
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
		
		



/*    if (imagecopyresampled($im,$imorig , 0,0,0,0,$aw,$ah,$x,$y)) {
    
	$string = "";

		$color = imagecolorallocate($im, 255, 0, 0);
   		imagestring($im, $fontSize, $xx, $yy, $string, $color);
		
	    if (imagejpeg($im, $save_dir.$save_name))
            return true;
        else
            return false;
			/*	
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


