
$(document).ready(function(){
						   
	
	 $("#formID").validationEngine();	  
	 $("#seatbook").onlyDigits();
	 $("#deposit").onlyDigits();

	// Student name, mob, address wise search
    // Search related topics	
	function formatItem(row, i, n, value) {
		return row[0] + "&nbsp;&nbsp;&nbsp;" + row[1] + " (<strong>mob: " + row[2] + "</strong>)" + " (<strong>Grade: " + row[3] + "</strong>)";
	}
	
	function formatResult(row) {
		return row[1]; //removes html tags
	}

	$("#engname").autocomplete("searc.php", {
							   
		width: 600,
		selectFirst: false,
		matchContains: true,
		minChars: 0,
		multiple: false,
		formatItem: formatItem,
		formatResult: formatResult
	});
	
	$("#engname").result(function(event, data, formatted) {
		
    	var id = data[0];
		if(id != null){
			$('#btnsave').attr("disabled", "true");
			$('#btnup').removeAttr("disabled");			
			$('#btndel').removeAttr("disabled");
			$('#btnPrint').removeAttr("disabled");
			$("#admno").attr('readonly', true);
			$("#stid").attr('readonly', true);
			$("#stid").val(data[0]);
			
			//alert($.trim(data[0]));
			var smyInteger = parseInt($.trim(data[0]));
				
			$.ajax({
				type: "POST",
				url: "Sibling.php",
				data: "admno="+ smyInteger,
				success: function(data){
					// Coma seperated string to array 					
						$("#sibling").html(data);
				}					
			});
					
		} else {
			$("#stid").val("");
		}
		
		
		AjaxCall(id);
		
    });

	
	function AjaxCall(value){
		
		var id = value ;
		
		var option_val;
		
		$.ajax({
			type: "POST",
			url: "studentinfo.php",
			data: "id="+ id,
			success: function(data ){
				// Coma seperated string to array 
				//alert(data);
				var temp = new Array();
				temp = data.split(",");
				
				var sting = "";
				for(var i=0;i<temp.length;i++){
					//document.write("<b>arr["+i+"] is </b>=>"+arr[i]+"<br>");
					sting += temp[i] + " Ar : " + i + "\n";
				}
				//alert(sting);
					
								
				$("#admno").val(temp[0]);
				Trrim("#admno");
				$("#arbname").val(temp[1]);
				Trrim("#arbname");
				$("#doj").val(temp[2]);
				Trrim("#doj");
				var gmyInteger = parseInt(temp[3]); 
				var gsrt = "value="+"'"+gmyInteger+"'";			
   				 $("#grade option["+gsrt+"]").attr('selected','selected');
								
				var smyInteger = parseInt(temp[4]);
				var ssrt = "value="+"'"+smyInteger+"'";	
   				 $("#section option["+ssrt+"]").attr('selected','selected');
				
				$("#dob").val(temp[5]);
				Trrim("#dob");		
				$("#rlno").val(temp[6]);
				Trrim("#rlno");
				$("#nat").val(temp[7]);
				Trrim("#nat");

				$("#bplace").val(temp[8]);
				Trrim("#bplace");
				$("#relg").val(temp[9]);
				Trrim("#relg");
				
				//$("#prvgrd").val(temp[13]);
				var gmyInteger = parseInt(temp[13]); 
				var gsrt = "value="+"'"+gmyInteger+"'";			
   				 $("#prvgrd option["+gsrt+"]").attr('selected','selected');
				//$("#prvsct").val(temp[14]);
				var smyInteger = parseInt(temp[14]);
				var ssrt = "value="+"'"+smyInteger+"'";	
   				 $("#prvsct option["+ssrt+"]").attr('selected','selected');
				
				
				$("#prvrlno").val(temp[15]);Trrim("#prvrlno");
				
				$("#ppno").val(temp[16]);Trrim("#ppno");
				$("#ppissdt").val(temp[17]);Trrim("#ppissdt");
				$("#ppisspl").val(temp[18]);Trrim("#ppisspl");
				$("#ppexpdt").val(temp[19]);Trrim("#ppexpdt")
				
				$("#visano").val(temp[20]);Trrim("#visano");
				$("#visaissdt").val(temp[21]);Trrim("#visaissdt");
				$("#visaisspl").val(temp[22]);Trrim("#visaisspl");
				$("#visaexpdt").val(temp[23]);Trrim("#visaexpdt");
				
				$("#emid").val(temp[24]);Trrim("#emid");
				$("#emissdt").val(temp[25]);Trrim("#emissdt");
				$("#emisspl").val(temp[26]);Trrim("#emisspl");
				$("#emexpdt").val(temp[27]);Trrim("#emexpdt");
				
				$("#fathername").val(temp[28]);Trrim("#fathername");
				$("#fatherctno").val(temp[29]);Trrim("#fatherctno");
				$("#mothername").val(temp[30]);Trrim("#mothername");
				$("#motherctno").val(temp[31]);Trrim("#motherctno");
				$("#address").val(temp[32]);Trrim("#address");
				$("#street").val(temp[33]);Trrim("#street");
				$("#place").val(temp[34]);Trrim("#place");
				$("#tel").val(temp[35]);Trrim("#tel");
				$("#emirate").val(temp[36]);Trrim("#emirate");
				$("#country").val(temp[37]);Trrim("#country");
								
				$("#fatheroccupation").val(temp[38]);Trrim("#fatheroccupation");
				$("#motheroccupation").val(temp[39]);Trrim("#motheroccupation");
				$("#fatheremail").val(temp[40]);Trrim("#fatheremail");
				$("#motheremail").val(temp[41]);Trrim("#motheremail");
				
				//$("#grdjnd").val(temp[42]);
				var smyInteger = parseInt(temp[42]);
				var ssrt = "value="+"'"+smyInteger+"'";	
   				 $("#grdjnd option["+ssrt+"]").attr('selected','selected');
				 
				//$("#transfer").val(temp[43]);
				var trns =  parseInt(temp[43]); 	
				if(trns == 1) {
					$('input[name="transfer"]')[0].checked = true;
				} 
				if(trns == 2) {
					$('input[name="transfer"]')[1].checked = true;
				}
				
				$("#result").val(temp[44]);
				$("#schl").val(temp[45]);
				$("#attdt").val(temp[46]);
					
				var sexint = parseInt(temp[47]); 	
						
				if(sexint == 1) {
					$('input[name="sex"]')[0].checked = true;
				} 
				if(sexint == 2) {
					$('input[name="sex"]')[1].checked = true;
				}
							
				var dmyInteger = parseInt(temp[48]); 
				
				if(dmyInteger == 1) {					
					$('input[name="result"]')[0].checked = true;
				} else if(dmyInteger == 2) {
					$('input[name="result"]')[1].checked = true;
				} else if(dmyInteger == 3) {
					$('input[name="result"]')[2].checked = true;
				} else if(dmyInteger == 4) {
					$('input[name="result"]')[3].checked = true;
				} else {
					$('input[name="result"]')[4].checked = true;
				}
						
				$("#bussno").val(temp[49]);Trrim("#bussno");
				$("#route").val(temp[50]);Trrim("#route");
				$("#way").val(temp[53]);Trrim("#way");				
				$("#amount").val(temp[52]);Trrim("#amount");	
				
				// 	Deposit / Booking			
				$("#seatbook").val(temp[54]);Trrim("#seatbook");
				$("#deposit").val(temp[55]);Trrim("#deposit");
				
				// Uniform / Booking
				var Uniform =  parseInt(temp[56]); 	
				//alert(temp[54]);
				if(Uniform == 1) {
					$('input[name="Uniform"]')[0].checked = true;
				} else {
					$('input[name="Uniform"]')[1].checked = true;
				}
				
				var Booking =  parseInt(temp[57]); 
				//alert(temp[54]);
				if(Booking == 1) {
					$('input[name="Booking"]')[0].checked = true;
				} else {
					$('input[name="Booking"]')[1].checked = true;
				}
				
				// Remarks
				$("#Remarks").val(temp[58]);Trrim("#Remarks");
				
				$("#image").val(temp[59]);
				Trrim("#image");
				$('#amge').remove();
				$('#picturebox').append('<img id="amge" src="primages/'+temp[59]+'" width="77" height="87" />');
				
				$("#year").val(temp[60]);Trrim("#year");
				$("#month").val(temp[61]);Trrim("#month");
				$("#date").val(temp[62]);Trrim("#date");
				$("#code").val(temp[63]);Trrim("#code");
				
			}	
		});				
	}
	
	// Trim
	function Trrim(id) {
	   $(""+id+"").val($.trim($(""+id+"").val()));	
	}
	
		
	// Parents name, mob, address wise search
    // Search related topics	
	function formatItemParents(row, i, n, value) {
		return row[1] +"&nbsp;&nbsp;&nbsp;(<strong>mother: " + row[2] + "</strong>)"+ " (<strong>mob: " + row[3] + "</strong>)";
	}
	
	function formatResultParents(row) {
		return row[1]; //removes html tags
	}

	$("#fathername").autocomplete("search_parents.php", {
		width: 600,
		selectFirst: false,
		matchContains: true,
		multiple: false,
		formatItem: formatItemParents,
		formatResult: formatResultParents
	});
	
	$("#fathername").result(function(event, data, formatted) {
		
		$("#code").val("");				
    	var id = data[0];
		if(id != null){
			$("#code").val(data[0]);
		} else {
			$("#code").val("");
		}
		
		ParentsAjaxCall($("#code").val());
		
		//alert($.trim($("#code").val()));
		var smyInteger = parseInt($.trim($("#code").val()));
		var faadmn = parseInt($.trim($("#admno").val()));
				
			$.ajax({
				type: "POST",
				url: "Sibling.php",
				data: "parcode="+ smyInteger
				+"& faadmn="+ faadmn
				,
				success: function(data){
					// Coma seperated string to array 					
						$("#sibling").html(data);
				}					
			});		
    });
	
	$('input#fathername').keypress(function(e) {
	  if (e.keyCode == '13') {
		 e.preventDefault();
		 		 
				$("#code").val("");
				$("#fatherctno").val("");
				$("#mothername").val("");
				$("#motherctno").val("");
				$("#address").val("");
				$("#street").val("");
				$("#place").val("");
				$("#tel").val("");
				$("#emirate").val("");
				$("#country").val("");
				$("#fatheroccupation").val("");
				$("#motheroccupation").val("");
				$("#fatheremail").val("");
				$("#motheremail").val("");				
				
	   }
	});

	
	function ParentsAjaxCall(value){
		
		var id = value ;
		
		var option_val;
					
		$.ajax({
			type: "POST",
			url: "Parentsinfo.php",
			data: "id="+ id,
			success: function(data ){
				// Coma seperated string to array 
				var temp = new Array();
				temp = data.split(",");
				//alert(data);
				$("#code").val(id);
				$("#fathername").val(temp[0]);Trrim("#fathername");
				$("#fatherctno").val(temp[1]);Trrim("#fatherctno");
				$("#mothername").val(temp[2]);Trrim("#mothername");
				$("#motherctno").val(temp[3]);Trrim("#motherctno");
				$("#address").val(temp[4]);Trrim("#address");
				$("#street").val(temp[5]);Trrim("#street");
				$("#place").val(temp[6]);Trrim("#place");
				$("#tel").val(temp[7]);Trrim("#tel");
				$("#emirate").val(temp[8]);Trrim("#emirate");
				$("#country").val(temp[9]);Trrim("#country");
				$("#fatheroccupation").val(temp[10]);Trrim("#fatheroccupation");
				$("#motheroccupation").val(temp[11]);Trrim("#motheroccupation");
				$("#fatheremail").val(temp[12]);Trrim("#fatheremail");
				$("#motheremail").val(temp[13]);Trrim("#motheremail");		
			}	
			
		});
						
	}
	
	function selectOption(select_id, option_val) {
		$('#'+select_id+' option:selected').removeAttr('selected');
		$('#'+select_id+' option[value='+option_val+']').attr('selected','selected');       
	}

	
	
	// Nationlity search topics		
	$("#nat").autocomplete("searchnationality.php", {
		width: 200,
		selectFirst: false,
		matchContains: true,
		multiple: false	
		
	});
	
		// Nationlity search topics		
	$("#bplace").autocomplete("SearchBirthPlace.php", {
		width: 200,
		selectFirst: false,
		matchContains: true,
		multiple: false	
		
	});
	
			// Nationlity search topics		
	$("#relg").autocomplete("SearchReligion.php", {
		width: 200,
		selectFirst: false,
		matchContains: true,
		multiple: false	
		
	});
		
	// Save img
	$("#fileToUpload").click(function(event){

	});


	$('#fileToUpload').change(function() {
	  
		//alert($("#fileToUpload").val());	
		
		if(isImage($("#fileToUpload").val())){
			
 			//alert(this.files[0].size/1024+ ' KB');			
			if( parseInt(this.files[0].size/1024) >= 50) {
			   alert("Image size is too much long\nSize much within 100 KB");	
			} else {
				ajaxFileUpload();
				event.preventDefault();
				$('#amge').remove();
				$("#fileToUpload").replaceWith("<input type='file' id='fileToUpload' size='5' />");
			}	
			
		} else {
			alert("Please Select image only");
		}		

	});	
	
	
	
	$("#Grade").change(function() {
 			
			var grade = $('#Grade').attr('value');
 			var section = $('#section').attr('value');
			if((grade != "") && (section != "")) {
				//alert(grade+ "  "+section);
				RollAjaxCall(grade, section);
				
			} else {
			   $("#rlno").val("");
			}
			
    });
	
	$("#section").change(function() {
			var grade = $('#Grade').attr('value');
 			var section = $('#section').attr('value');
			if((grade != "") && (section != "")) {
				//alert(grade+ "  "+section);
				RollAjaxCall(grade, section);
				
			} else {
					$("#rlno").val("");
			}
    });
	
	function RollAjaxCall(grade, section){
			var grade1 = grade ;
 			var section1 = section;		
			$.ajax({
				type: "POST",
				url: "RollRetrive.php",
				data: "grade1="+ grade1
					+"& section1="+ section1
					,
				success: function(data ){
					// Coma seperated string to array 
					//alert(data);
					$("#rlno").val(data);
				}	
				
			});
						
	}

	
	 // Save new data
		$("#btnsave").click(function() {
									 
		    var valid = $("#formID").validationEngine('validate');			
			var age  = parseInt($('#year').val());			
			var stid = $('#stid').attr('value');
			
            if (!valid) {
               // alert('false')
               // return false;
            }else{
                ///alert(age)
				
				if(age > 3){
					
		  		// 
				// Student Table Information
				//
		  		// Personal Information
		  		var admno = $('#admno').attr('value');
		  		
				var engname = $('#engname').attr('value');
				var arbname = $('#arbname').attr('value');
				var Grade = $('#Grade').attr('value');
				var section = $('#section').attr('value');
				var doj = $('#doj').attr('value');
				var sex = $("input[name='sex']:checked").val();
				var dob = $('#dob').attr('value');
				var year = $('#year').attr('value');
				var month = $('#month').attr('value');
				var date = $('#date').attr('value');
				var nat = $('#nat').attr('value');
				var bplace = $('#bplace').attr('value');
				var relg = $('#relg').attr('value');
				var rlno = $('#rlno').attr('value');
				var grdjnd = $('#grdjnd').attr('value');
				var transfer = $("input[name='transfer']:checked").val();
				var result = $("input[name='result']:checked").val();
				var schl = $('#schl').attr('value');
				var attdt = $('#attdt').attr('value');
				var prvgrd = $('#prvgrd').attr('value');
				var prvsct = $('#prvsct').attr('value');
				var prvrlno = $('#prvrlno').attr('value');
				
				//  Documents Passprt
				var ppno = $('#ppno').attr('value');
				var ppissdt = $('#ppissdt').attr('value');
				var ppisspl = $('#ppisspl').attr('value');
				var ppexpdt = $('#ppexpdt').attr('value');
				
				//  Documents Visa
				var visano = $('#visano').attr('value');
				var visaissdt = $('#visaissdt').attr('value');
				var visaisspl = $('#visaisspl').attr('value');
				var visaexpdt = $('#visaexpdt').attr('value');
				
				//  Documents Emirates ID
				var emid = $('#emid').attr('value');
				var emissdt = $('#emissdt').attr('value');
				var emisspl = $('#emisspl').attr('value');
				var emexpdt = $('#emexpdt').attr('value');
				
				// 
				// Parents Table Information
				//	
				var code = $('#code').attr('value');
				var fathername = $('#fathername').attr('value');
				var fatherctno = $('#fatherctno').attr('value');
				var mothername = $('#mothername').attr('value');
				var motherctno = $('#motherctno').attr('value');
				var address = $('#address').attr('value');
				var street = $('#street').attr('value');
				var place = $('#place').attr('value');
				var tel = $('#tel').attr('value');
				var emirate = $('#emirate').attr('value');
				var country = $('#country').attr('value');
				var fatheroccupation = $('#fatheroccupation').attr('value');
				var motheroccupation = $('#motheroccupation').attr('value');
				var fatheremail = $('#fatheremail').attr('value');
				var motheremail = $('#motheremail').attr('value');
				
				
				// 
				// Buss information
				//
				
				var bussno = $('#bussno').attr('value');
				var way = $('#way').attr('value');
				
				var seatbook = $('#seatbook').attr('value');
				var deposit = $('#deposit').attr('value');
				
				// Uniform Booking
				var Uniform = $("input[name='Uniform']:checked").val();
				var Booking = $("input[name='Booking']:checked").val();
				
				var Remarks = $("#Remarks").val();
				
				var image = $("#image").val();
				
				//alert(image);
				
					$.ajax({
						type: "POST",
						url: "save-student.php",
						enctype: 'multipart/form-data',
						data: "admno="+ admno
						+"& stid="+ stid
						+"& engname="+ engname
						+"& arbname="+ arbname
						+"& Grade="+ Grade
						+"& section="+ section
						+"& doj="+ doj
						+"& sex="+ sex
						+"& dob="+ dob
						+"& year="+ year
						+"& month="+ month
						+"& date="+ date
						+"& nat="+ nat
						+"& bplace="+ bplace
						+"& relg="+ relg
						+"& rlno="+ rlno
						+"& grdjnd="+ grdjnd
						+"& transfer="+ transfer						
						+"& result="+ result
						+"& schl="+ schl
						+"& attdt="+ attdt
						+"& prvgrd="+ prvgrd
						+"& prvsct="+ prvsct
						+"& prvrlno="+ prvrlno
						+"& ppno="+ ppno
						+"& ppissdt="+ ppissdt
						+"& ppisspl="+ ppisspl
						+"& ppexpdt="+ ppexpdt
						+"& visano="+ visano
						+"& visaissdt="+ visaissdt
						+"& visaisspl="+ visaisspl
						+"& visaexpdt="+ visaexpdt
						+"& emid="+ emid
						+"& emissdt="+ emissdt
						+"& emisspl="+ emisspl
						+"& emexpdt="+ emexpdt
						+"& code="+ code
						+"& fathername="+ fathername
						+"& fatherctno="+ fatherctno
						+"& mothername="+ mothername
						+"& motherctno="+ motherctno
						+"& address="+ address
						+"& street="+ street
						+"& place="+ place
						+"& tel="+ tel
						+"& emirate="+ emirate
						+"& country="+ country
						+"& fatheroccupation="+ fatheroccupation
						+"& motheroccupation="+ motheroccupation
						+"& fatheremail="+ fatheremail
						+"& motheremail="+ motheremail
						+"& bussno="+ bussno
						+"& way="+ way
						+"& seatbook="+ seatbook
						+"& deposit="+ deposit
						+"& Uniform="+ Uniform
						+"& Booking="+ Booking
						+"& Remarks="+ Remarks
						+"& image="+ image
						,
						success: function(data){

							alert("saved")
							
						}
					});  // ajax end
					
				}	// Age end				
			}
				return false;												  
		});
		
		
			
	 // Save new data
		$("#btnup").click(function() {
									 
		    var valid = $("#formID").validationEngine('validate');			
			var age  = parseInt($('#year').val());			
			var stid = $('#stid').attr('value');
			
            if (!valid) {
               // alert('false')
               // return false;
            }else{
                ///alert(age)
				
				if(age > 3){
					
		  		// 
				// Student Table Information
				//
		  		// Personal Information
		  		var admno = $('#admno').attr('value');
		  		
				var engname = $('#engname').attr('value');
				var arbname = $('#arbname').attr('value');
				var Grade = $('#Grade').attr('value');
				var section = $('#section').attr('value');
				var doj = $('#doj').attr('value');
				var sex = $("input[name='sex']:checked").val();
				var dob = $('#dob').attr('value');
				var year = $('#year').attr('value');
				var month = $('#month').attr('value');
				var date = $('#date').attr('value');
				var nat = $('#nat').attr('value');
				var bplace = $('#bplace').attr('value');
				var relg = $('#relg').attr('value');
				var rlno = $('#rlno').attr('value');
				var grdjnd = $('#grdjnd').attr('value');
				var transfer = $("input[name='transfer']:checked").val();
				var result = $("input[name='result']:checked").val();
				var schl = $('#schl').attr('value');
				var attdt = $('#attdt').attr('value');
				var prvgrd = $('#prvgrd').attr('value');
				var prvsct = $('#prvsct').attr('value');
				var prvrlno = $('#prvrlno').attr('value');
				
				//  Documents Passprt
				var ppno = $('#ppno').attr('value');
				var ppissdt = $('#ppissdt').attr('value');
				var ppisspl = $('#ppisspl').attr('value');
				var ppexpdt = $('#ppexpdt').attr('value');
				
				//  Documents Visa
				var visano = $('#visano').attr('value');
				var visaissdt = $('#visaissdt').attr('value');
				var visaisspl = $('#visaisspl').attr('value');
				var visaexpdt = $('#visaexpdt').attr('value');
				
				//  Documents Emirates ID
				var emid = $('#emid').attr('value');
				var emissdt = $('#emissdt').attr('value');
				var emisspl = $('#emisspl').attr('value');
				var emexpdt = $('#emexpdt').attr('value');
				
				// 
				// Parents Table Information
				//	
				var code = $('#code').attr('value');
				var fathername = $('#fathername').attr('value');
				var fatherctno = $('#fatherctno').attr('value');
				var mothername = $('#mothername').attr('value');
				var motherctno = $('#motherctno').attr('value');
				var address = $('#address').attr('value');
				var street = $('#street').attr('value');
				var place = $('#place').attr('value');
				var tel = $('#tel').attr('value');
				var emirate = $('#emirate').attr('value');
				var country = $('#country').attr('value');
				var fatheroccupation = $('#fatheroccupation').attr('value');
				var motheroccupation = $('#motheroccupation').attr('value');
				var fatheremail = $('#fatheremail').attr('value');
				var motheremail = $('#motheremail').attr('value');
				
				
				// 
				// Buss information
				//
				
				var bussno = $('#bussno').attr('value');
				var way = $('#way').attr('value');
				
				var seatbook = $('#seatbook').attr('value');
				var deposit = $('#deposit').attr('value');
				
				// Uniform Booking
				var Uniform = $("input[name='Uniform']:checked").val();
				var Booking = $("input[name='Booking']:checked").val();
				
				var Remarks = $("#Remarks").val();
				
				var image = $("#image").val();
				
				//alert(image);
				
					$.ajax({
						type: "POST",
						url: "Update.php",
						enctype: 'multipart/form-data',
						data: "admno="+ admno
						+"& stid="+ stid
						+"& engname="+ engname
						+"& arbname="+ arbname
						+"& Grade="+ Grade
						+"& section="+ section
						+"& doj="+ doj
						+"& sex="+ sex
						+"& dob="+ dob
						+"& year="+ year
						+"& month="+ month
						+"& date="+ date
						+"& nat="+ nat
						+"& bplace="+ bplace
						+"& relg="+ relg
						+"& rlno="+ rlno
						+"& grdjnd="+ grdjnd
						+"& transfer="+ transfer						
						+"& result="+ result
						+"& schl="+ schl
						+"& attdt="+ attdt
						+"& prvgrd="+ prvgrd
						+"& prvsct="+ prvsct
						+"& prvrlno="+ prvrlno
						+"& ppno="+ ppno
						+"& ppissdt="+ ppissdt
						+"& ppisspl="+ ppisspl
						+"& ppexpdt="+ ppexpdt
						+"& visano="+ visano
						+"& visaissdt="+ visaissdt
						+"& visaisspl="+ visaisspl
						+"& visaexpdt="+ visaexpdt
						+"& emid="+ emid
						+"& emissdt="+ emissdt
						+"& emisspl="+ emisspl
						+"& emexpdt="+ emexpdt
						+"& code="+ code
						+"& fathername="+ fathername
						+"& fatherctno="+ fatherctno
						+"& mothername="+ mothername
						+"& motherctno="+ motherctno
						+"& address="+ address
						+"& street="+ street
						+"& place="+ place
						+"& tel="+ tel
						+"& emirate="+ emirate
						+"& country="+ country
						+"& fatheroccupation="+ fatheroccupation
						+"& motheroccupation="+ motheroccupation
						+"& fatheremail="+ fatheremail
						+"& motheremail="+ motheremail
						+"& bussno="+ bussno
						+"& way="+ way
						+"& seatbook="+ seatbook
						+"& deposit="+ deposit
						+"& Uniform="+ Uniform
						+"& Booking="+ Booking
						+"& Remarks="+ Remarks
						+"& image="+ image
						,
						success: function(data){

							alert(data)
							
						}
					});  // ajax end
					
				}	// Age end				
			}
				return false;												  
		});
		
		//btnup end
		
		
		
		function StudentIDCheck(std){
			
			var boolval = "";
			var studentid =std;
			alert(studentid);
			$.ajax({
				type: "POST",
				url: "RollRetrive.php",
				data: "studentid="+ studentid
					,
				success: function(data ){
					// Coma seperated string to array 					
					boolval = data;
				}	
				
			});
			
			return boolval;			
		}
	
		$('#stid').bind('keypress', function(e) {
			if(e.keyCode==13){
				CheckSTId();
			}
		});
		
		$('#stid').change(function() {
		 	 CheckSTId();
		});
						
		$('#imgb').click(function(){
       		 $("#div-1").show();
		});
		
		$('#closecross').click(function(){
       		 $("#div-1").hide();
		});
			
});


	

	
		function CheckSTId(){										
			 if ($("#stid").val() == ""){
					//  alert("null");
					$('#stid').val($('#admno').val());
				} else {
					// alert("not null");
					var std = $('#stid').val();
					var studentid =std;
					//alert(studentid);
					$.ajax({
						type: "POST",
						url: "RollRetrive.php",
						data: "studentid="+ studentid
							,
						success: function(data){
							// Coma seperated string to array 
							var temp = new Array();
							temp = data.split(",");							
							var avail  = parseInt($.trim(temp));	
							var n=avail
							if (n==0)
							{
							 	//$('#stid').val($('#admno').val());
							}
							else
							{
								alert("This is Existing");
								 $('#stid').val($('#admno').val());
							}								
						}							
					});
				 }			
		}
		
		function fnc(bus, way){
			
			var buss = bus;
			var w = way;
			
			var wa = "";
			if(w == 1){
			  wa = "One way";	
			}
			if(w == 2){
			  wa = "Two way";	
			}
			
			$.ajax({
				type: "POST",
				url: "LoadBussInfo.php",
				data: "buss="+ buss
					,
				success: function(data ){
					// Coma seperated string to array 
					var temp = new Array();
					temp = data.split(",");
					
					//boolval = data;
					$('#bussno').val(buss);
					$('#route').val(temp[0]);
					//$('#amount').val(temp[2]);
					if(w == 1) {
						$('#amount').val(temp[1]);
					}
					if(w == 2) {
						$('#amount').val(temp[2]);
					}					
					$('#way').val(wa);					
				}					
			});
			
			$("#div-1").hide();
		}
		
		
		
    </script>



	function ajaxFileUpload()
	{
		$("#loading")
		.ajaxStart(function(){
			$(this).show();
		})
		.ajaxComplete(function(){
			$(this).hide();
		});
		
		var admno = $('#admno').val();
		 var url = "doajaxfileupload.php?admno="+admno;

		var data ={admno: admno, description:'short description'}


		$.ajaxFileUpload
		(
			{
				url: url,
				type: "POST", 
				secureuri:false,				
				fileElementId: 'fileToUpload',
				dataType: 'json',
				success: function (data, status)
				{
					if(typeof(data.error) != 'undefined')
					{
						if(data.error != '')
						{
							alert(data.error);
						}else
						{
							
							//$("#NowUpload").load("ajaxfileupload.php");
							//$("#ImageList").load("imagelist.php");
							//alert(data.msg);
							$('#amge').remove();
							$('#picturebox').append('<img id="amge" src="primages/' + data.msg + '" src="" width="77" height="87" />');
							$("#fileToUpload").val("");							
							$("#image").val(data.msg);
							
							
						}
					}
				},
				error: function (data, status, e)
				{
					alert(e);
				}
			}
		)
		
		return false;

	}
	
	function getExtension(filename) {
		var parts = filename.split('.');
		return parts[parts.length - 1];
	}

	
		function isImage(filename) {
			var ext = getExtension(filename);
			switch (ext.toLowerCase()) {
			case 'jpg':
			case 'gif':
			case 'bmp':
			case 'png':
				//etc
				return true;
			}
			return false;
		}
		
	function ButtonEvent(selector, scrolTo){
		// Button change
		$("#leftmenu>ul>li>a").removeClass("current");
		$(selector).addClass('current');		
		$.scrollTo($($(selector).attr("title")), {
					duration: 750
				});
		
	}
		
		


