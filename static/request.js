$(".load-form").hide();
$(document).ready(function(){

	$("#load").click(function(){
		$(".submit-form").hide();
		$(".load-form").show();
	});

	$("#back").click(function(){
		$(".load-form").hide();
		$(".submit-form").show();
	});

	function validateForm() {
  		var email = document.forms["request-form"]["email"].value;
  		var title = document.forms["request-form"]["tit"].value;
  		var amp = document.forms["request-form"]["amp"].value;
  		var date = document.forms["request-form"]["date"].value;
  		console.log(email);
  		if (new Regex("/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/").test(value) || email === '') {
    		alert("Invalid Email");
    		return false;
  		}
  		else if(new Regex("^[a-zA-Z0-9]*$").test(value)|| title === ''){
  			alert("Invalid Name");
    		return false;
  		}
  		else if(new Regex("^[a-zA-Z0-9]*$").test(value)|| amp === ''){
  			alert("Invalid Amplicon");
    		return false;
  		}
  		else if(new Regex("^[0-9*#+]+$").test(value)|| date === ''){
  			alert("Invalid Date");
    		return false;
  		}

  		return true;
	}
});