<?php @session_start();

  $isAjax = isset($_SERVER['HTTP_X_REQUESTED_WITH'])
         && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
	  	if (!$isAjax) {  ?>
  
			 <script language="javascript">
				window.location.href="http://portfoliohere.com/uae/";
			</script> 
	  
 <?php  }
  
   
 @include('connection.php'); ?>

<div id="bussiness_1" class="bussiness_1">
	   		   <div id="div" class="type_final_area">

					<div class="menu_inner_">
							<div class="civil_works">
							<?
							$l =0;
							$sql1 = "select * from master_category";
							$rsd1 = mysql_query($sql1);
							$a = 0;
		
							 while($result1 = mysql_fetch_assoc($rsd1)){
								 $a++;
							 ?>
								<div id="menuheader" class="menu_header">
									<div class="header_data"><?php echo $result1["name"]; ?></div>
								</div>
								<div class="menus"  id="menus<?php echo $a; ?>">
									
								<?php
									$sql2 = "select * from category where master_id =".$result1['id']." order by name ASC";
									$rsd2 = mysql_query($sql2);
									$k =0;
											while ($row = mysql_fetch_array($rsd2)) {
													 $k++;
												 ?>
												
													   	<div id="div" class="ckitem">
															  <div id="div" class="ck_tittle"><?php echo $row["name"]; ?></div>
															  <?php 	$sq = "select * from sub_category where category_id =".$row['id']." order by name ASC";
																		$rs = mysql_query($sq);
																		
																		while ($rowl = mysql_fetch_array($rs)) {
																			$l++; ?>
																			
																			<div id="" class="gt"><input name="" id="checked<?php echo $l; ?>" type="checkbox" value="<?php echo $rowl['id']; ?>"><?php echo $rowl["name"]; ?></div>
																		
															<?php			}
															 ?>
														   
						 								</div>
			 
											 <?php }	?>	
								
								
								</div>
								
							<?php }	?>
						
					</div>
					</div>
					 
   		       </div>
	   		 </div>