// JavaScript Document

	function error_check(myvars){
		
		var result = false;
		
		
		
		var fields = "'"+myvars[i]+"'";
		var error_count = 0;
		
		for (var i=0;i<myvars.length;i++)
		{ 
			var fields = myvars[i];
			if($("#"+fields+"").val() == ""){
				$("#s_"+fields+"").html("<img src='images/error.gif'>");
				error_count++;
			} else {
				$("#s_"+fields+"").text("");
			}
		}
		
		if(error_count  > 0){
			result = false;
		} else {
			result = true;
		}
		return result;
	}
	
	
	function error_check_border(myvars){
		
		var result = false;
		
		
		
		var fields = "'"+myvars[i]+"'";
		var error_count = 0;
		
		for (var i=0;i<myvars.length;i++)
		{ 
			var fields = myvars[i];
			if($("#"+fields+"").val() == ""){
				//$("#s_"+fields+"").html("<img src='images/error.gif'>");
				$("#"+fields+"").addClass('error');
				error_count++;
			} else {
				$("#"+fields+"").removeClass('error');
			}
		}
		
		if(error_count  > 0){
			result = false;
		} else {
			result = true;
		}
		return result;
	}
