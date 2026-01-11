<?php
//$conn = mysql_connect('mysql1', 'portfolio', '786portfolio');

//$db = mysql_select_db('portfolio');

//$conn = mysql_connect('localhost', 'solid_solid', 'asia');
$conn = mysql_connect('localhost', 'root', '');

if(!$conn)
   echo 'connection error!!';
/*else 
 echo 'connection success!!';*/
//$db = mysql_select_db('solid_asia');
$db = mysql_select_db('bussienss_bd');
if(!$db)
   echo 'Db error!!';
/*else 
 echo 'Db connected!!';*/
?>