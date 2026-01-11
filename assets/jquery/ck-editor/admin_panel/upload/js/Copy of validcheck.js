

$().ready(function(){


		$("#loading")
		.ajaxStart(function(){
			$(this).show();
		})
		.ajaxComplete(function(){
			$(this).hide();
		});
		
		
	// start client info
		
	function formatItems(row) {
		return row[0] + " (<strong>Name: " + row[1] + "</strong>)";
	}
	function formatResults(row) {
		return row[0].replace(/(<.+?>)/gi, '');
	}
	
	$("#ClientInfoID").autocomplete("search-clienttInfo.php", {
		width: 250,
		selectFirst: false,
		matchContains: true,
		multipleSeparator: "",
		formatItem: formatItems,
		formatResult: formatResults		
	});
	
		$("#clientInfoSubmit").validate({
		submitHandler:function(form) {
			var ClientInfoID = $('#ClientInfoID').attr('value');
				$.ajax({
					type: "POST",
					url: "seasion-clientInfo.php",
					data: "ClientInfoID="+ ClientInfoID,
					success: function(){
					    AllTabsHide();
						$("#ClientInfoDiv").show();
						$("#InfoClient").load("ClientWelCome.php");					
					}
				});
				
				$('#ClientInfoID').val('');
			return false;
			
		}		
		});
		
	$("#ClientProfile").click(function () {
		
		$.ajax({
			url: "ClientProfile.php",
			cache: false,
			success : function(){ 	
				$("#InfoClient").load("ClientProfile.php"); 
				
			}
		}); 			  
    });
	
	$("#editProfile").click(function () {
		
		$.ajax({
			url: "edit-client2.php",
			cache: false,
			success : function(){ 	
				$("#InfoClient").load("edit-client2.php"); 
				
			}
		}); 			  
    });
	
	
				
		
	// end client info	

    // start agent Info
		
	function formatItem(row) {
		return row[0] + " (<strong>Name: " + row[1] + "</strong>)";
	}
	function formatResult(row) {
		return row[0].replace(/(<.+?>)/gi, '');
	}
	
	$("#AgentInfoID").autocomplete("search-agentInfo.php", {
		width: 250,
		selectFirst: false,
		matchContains: true,
		multipleSeparator: "",
		formatItem: formatItem,
		formatResult: formatResult		
	});
	
	$("#agentInfoSubmit").validate({
		submitHandler:function(form) {
			var AgentInfoID = $('#AgentInfoID').attr('value');
				$.ajax({
					type: "POST",
					url: "seasion-agentInfo.php",
					data: "AgentInfoID="+ AgentInfoID,
					success: function(){
					    AllTabsHide();
						$("#AgentInfoDiv").show();
						$("#InfoAgent").load("AgentWelCome.php");					
					}
				});
				
				$('#AgentInfoID').val('');
			return false;
			
		}		
		});
		
		
	$("#AgentProfile").click(function () {
		
		$.ajax({
			url: "AgentProfile.php",
			cache: false,
			success : function(){ 	
				$("#InfoAgent").load("AgentProfile.php"); 
				
			}
		}); 			  
    });
	
	$("#TotalBooking").click(function () {
		
		$.ajax({
			url: "agent_total_booking.php",
			cache: false,
			success : function(){
				//AllTabsHide();
       			//$("#AgentInfoDiv").show(); 	
				$("#InfoAgent").load("agent_total_booking.php"); 
				
			}
		}); 			  
    });
	
	$("#DateWiseBooking").click(function () {
		
		$.ajax({
			url: "agent_dateWise_booking.php",
			cache: false,
			success : function(){	
				$("#InfoAgent").load("agent_dateWise_booking.php"); 
				
			}
		}); 			  
    });
		
		
		
	
	// end Agent Info
		
	// Client tab Clieck
	$("#client").click(function () { 
	
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
       			AllTabsHide();
				$("#clientDiv").show();
				$("#clientForm").load("clientForm.php");  
	  			loadList();
				
			}
		}); 
    });
	
	// Agent Tab Clieck
	$("#agent").click(function () {
		
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#agentDiv").show(); 	
				$("#agentForm").load("agentForm.php"); 
				$("#agent_list").load("agent_list.php");
				
			}
		}); 			  
    });
	
	$("#engineer").click(function () { 
	
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#engineerDiv").show(); 
				$("#engineerForm").load("engineerForm.php"); 
				$("#engineer_list").load("engineer_list.php");
				
			}
		});			  
    });
	
	
	// new Site visit click event
	$("#newVisit").click(function () {
	
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#visitNewDiv").show();
				$("#Form").load("newVisit.php"); 
				$("#Invoice").load("newVisitInvoice.php");
				
			}
		}); 			  
    });
	
	$("#paymentVisit").click(function () { 
	
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#visitPaymentDiv").show();  
				$("#Search").load("newVisitSearch.php"); 
				$("#Pay").load("newVisitPayment.php");
				$("#Receipt").load("newVisitPayInvoice.php");
				$("#PayInvoice").load("newVisitInvoice.php");
				
			}
		});			  
    });
	
		// new Site visit click event
	$("#newDesign").click(function () { 
	
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#designNewDiv").show(); 
				$("#dForm").load("newDesign.php"); 
				$("#dInvoice").load("newDesignInvoice.php");
				
			}
		});			  
    });
	
	$("#paymentDesign").click(function () { 
	
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#designPaymentDiv").show(); 
				$("#dSearch").load("newDesignSearch.php"); 
				$("#dPay").load("newDesignPayment.php");
				$("#dReceipt").load("newDesignPayInvoice.php");
				$("#DpayInvoice").load("newDesignInvoice.php");
				
			}
		});			  
    });
	
	// Booking section
	$("#newBooking").click(function () {
	
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#BookingNewDiv").show(); 
				$("#BookingForm").load("newBooking.php"); 
				$("#BookingReceipt").load("nBookingInvoice.php");
				
			}
		});  			  
    });
	
	// Full cccontract section
	$("#newContract").click(function () {
		
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#developmentNewDiv").show(); 
				$("#deForm").load("newDevelopment.php"); 				
			}
		}); 		
    });
	
		// Full cccontract Installment
	$("#InstallmentContract").click(function () { 
		
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#InstallmentDiv").show(); 
				$("#InstallmentSearch").load("InstallmentSearch.php"); 
				$("#InstallmentReport").load("IntallmentReport.php");				
			}
		});		
    });  
			
	$("#paymentContract").click(function () { 
		
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#developmentPayDiv").show(); 
				$("#deSearch").load("desearch.php"); 				
			}
		});			  
    });
	
	$("#ProjectExpenditure").click(function () { 	
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();       			
       			$("#expenditureDiv").show(); 
				$("#pSearch").load("p.php");
				//$("#pMaterial").load("pMaterials.php"); 
				//$("#pContractual").load("pLabour.php"); 
				//$("#pOtherExpence").load("pOther.php"); 
				//$("#pVoucher").load("pVouser_list.php");
				
			}
		});			  
    });
	
	$("#DailyReport").click(function () { 
	
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){
				AllTabsHide();
       			$("#DailyReportDiv").show(); 
				$("#DailySearch").load("DailyReportSearch.php"); 
				$("#DailySiteVisit").load("Visit_list.php");
				$("#DailyDesign").load("Design_list.php");
				$("#DailyBooking").load("booking_list.php");
				$("#DailyFullContract").load("contract_list.php");
				$("#DailyFullInstallation").load("installation_list.php");
				
			}
		});			  
    });
	
	// Change user / 
	$("#ChangeUser").click(function () {
		
		$.ajax({
			url: "session-unset.php",
			cache: false,
			success : function(){ 	
				 AllTabsHide();
				$("#ChangeUsere").show();
				$("#ShowUser").load("user_list1.php"); 
				
			}
		}); 			  
    });
		
			
	AllTabsHide();
	$("#clientDiv").show();
				
				
	//  load Client Div
	function loadList(){
		
		$.ajax({
			url: "Client_list.php",
			cache: false,
			success : function(){
				$("#clientForm").load("clientForm.php"); 
				$("#Client_list").load("Client_list.php");
				
			}
		});
	}
	
	loadList();

			function AllTabsHide(){
			  
		 	   	$("#clientDiv").hide(); 
			   	$("#agentDiv").hide();
				$("#engineerDiv").hide(); 
				$("#newprojectDiv").hide();
		   		$("#expenditureDiv").hide();				
				$("#visitNewDiv").hide();
				$("#visitPaymentDiv").hide();
				$("#designNewDiv").hide();
				$("#designPaymentDiv").hide();
				$("#developmentNewDiv").hide();
				$("#developmentPayDiv").hide();
				$("#BookingNewDiv").hide();
				$("#DailyReportDiv").hide();
				$("#InstallmentDiv").hide();
				$("#AgentInfoDiv").hide();
				$("#ClientInfoDiv").hide();
				$("#ChangeUsere").hide();
				
				
				
			}
			
			

});



