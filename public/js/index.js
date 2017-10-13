$(function() {
  //  Switching between Decimal Degrees, Degrees Decimal Minutes and Degrees Minutes Seconds options
  $(".radio_item").on("click", degree_switch);
  
  // Validating the keys when user inputs in the input fields
  $(".lat_long input").on("keypress", function (e) {
    var charCode = e.which || e.keyCode;
    var charStr = String.fromCharCode(charCode); // Gets the character out of the keycode
    // Validates the character, Checks if it is Digit or Decimal, Rejects any other character
    if ((charStr != "." && /\d/.test(charStr) === false) || (validate_decimal($(this), charStr) === false)) {
        return false;
    }
  });
  
  // Submitting the form
  $(".submit").on("click", submit);
  
  // Closing the Result screen
  $(".result_close").on("click", close_overlay);
});

// Checks if Decimal is allowed or not for the input field
function validate_decimal(element, chr) {
  var element_name = element.attr("name");
  switch($(".radio input[name='degree']:checked").val()) {
    case "minute": // If the option is switched to Degrees Decimal Minutes
      // If the input is for Degrees and character is Decimal reject it
      if((element_name === "lat_deg" || element_name === "long_deg") && chr === ".") {return false;}
      break;
    case "second": // If the option is switched to Degrees Minutes Seconds
      // If the input is for Degrees or Minutes and character is Decimal reject it
      if(chr === "." && (element_name !== "lat_sec" && element_name !== "long_sec") ) {return false;}
      break;
  }
}

//  Switching between Decimal Degrees, Degrees Decimal Minutes and Degrees Minutes Seconds options
function degree_switch() {
  // Only execute if switched to other option than the active one
  if($(this).hasClass("active") === false) {
    $(".radio_item.active").removeClass("active");
    // Check the radio button
    $(this).addClass("active").find("input[name='degree']").prop( "checked", true );
    $(".err_box").hide();
    
    switch($(".radio input[name='degree']:checked").val()) {
      case "degree": // Switched to Decimal Degrees
        sec_to_min();
        min_to_deg();
        
        // Clear the Minute and Second inputs
        $(".latitude input[name='lat_min']").val("");
        $(".latitude input[name='lat_sec']").val("");
        $(".longitude input[name='long_min']").val("");
        $(".longitude input[name='long_sec']").val("");
        
        // Hide the Minute and Second inuts
        $(".minute_block").hide();
        $(".second_block").hide();
        break;
      case "minute": // Switched to Degrees Decimal Minutes
        deg_to_min();
        sec_to_min();
        // Clear the Second inputs
        $(".latitude input[name='lat_sec']").val("");
        $(".longitude input[name='long_sec']").val("");
        // Show the Minute input and Hide Second input
        $(".minute_block").show();
        $(".second_block").hide();
        break;
      case "second": // Switched to Degrees Minutes Seconds
        deg_to_min();
        min_to_sec();
        // Show the Minute and Second inputs
        $(".minute_block").show();
        $(".second_block").show();
        break;
    }
  }
}

// Format the number to 6 digits after decimal
function to_fixed(num) {
  var fixed =6;
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)[0];
}

// Convert Degrees to Minutes
function deg_to_min() {
  var lat_deg_decimal, long_deg_decimal;
  var lat_deg_value = parseFloat($(".latitude input[name='lat_deg']").val());
  var long_deg_value = parseFloat($(".longitude input[name='long_deg']").val());
  // Split the Degrees at Decimal point then subtract the Integer part from the Degrees to get the Decimal part
  lat_deg_decimal = parseFloat(lat_deg_value).toString().split(".");
  long_deg_decimal = parseFloat(long_deg_value).toString().split(".");
  lat_deg_decimal = (parseFloat(lat_deg_value) * 1000000 - parseInt(lat_deg_decimal[0]) * 1000000) / 1000000;
  long_deg_decimal = (parseFloat(long_deg_value) * 1000000 - parseInt(long_deg_decimal[0]) * 1000000) / 1000000 ;

  // Replace the Degrees value by Integer part only then Multiply the Decimal Degrees part by 60 to get the Minutes
  if(lat_deg_decimal > 0) {
    $(".latitude input[name='lat_deg']").val(parseInt(lat_deg_value));
    $(".latitude input[name='lat_min']").val(to_fixed(lat_deg_decimal * 60));
  }
  if(long_deg_decimal > 0) {
    $(".longitude input[name='long_deg']").val(parseInt(long_deg_value));
    $(".longitude input[name='long_min']").val(to_fixed(long_deg_decimal * 60));
  }
}

// Convert Minutes to Seconds
function min_to_sec() {
  var lat_min_decimal, long_min_decimal;
  var lat_min_value = $(".latitude input[name='lat_min']").val();
  var long_min_value = $(".longitude input[name='long_min']").val();
  // Split the Minutes at Decimal point then subtract the Integer part from the Minutes to get the Decimal part
  lat_min_decimal = parseFloat(lat_min_value).toString().split(".");
  long_min_decimal = parseFloat(long_min_value).toString().split(".");
  lat_min_decimal = (parseFloat(lat_min_value) * 1000000 - parseInt(lat_min_decimal[0]) * 1000000) / 1000000;
  long_min_decimal = (parseFloat(long_min_value) * 1000000 - parseInt(long_min_decimal[0]) * 1000000) / 1000000;

  // Replace the Minutes value by Integer part only then Multiply the Decimal Minutes part by 60 to get the Seconds
  if(lat_min_decimal > 0) {
    $(".latitude input[name='lat_min']").val(parseInt(lat_min_value));
    $(".latitude input[name='lat_sec']").val(to_fixed(lat_min_decimal * 60));
  }
  if(long_min_decimal > 0) {
    $(".longitude input[name='long_min']").val(parseInt(long_min_value));
    $(".longitude input[name='long_sec']").val(to_fixed(long_min_decimal * 60));
  }
}

// Convert Seconds to Minutes
function sec_to_min() {
  var lat_sec_value = parseFloat($(".latitude input[name='lat_sec']").val());
  var long_sec_value = parseFloat($(".longitude input[name='long_sec']").val());
  // Divide the Seconds by 60 then add to the Minutes
  if(lat_sec_value > 0) {
    $(".latitude input[name='lat_min']").val(to_fixed((parseFloat($(".latitude input[name='lat_min']").val()) || 0) + lat_sec_value / 60));
  }
  if(long_sec_value > 0) {
    $(".longitude input[name='long_min']").val(to_fixed((parseFloat($(".longitude input[name='long_min']").val()) || 0) + long_sec_value / 60));
  }
}

// Convert Minutes to Degrees
function min_to_deg() {
  var lat_min_value = parseFloat($(".latitude input[name='lat_min']").val());
  var long_min_value = parseFloat($(".longitude input[name='long_min']").val());
  // Divide the Minutes by 60 then add to the Degrees
  if(lat_min_value > 0) {
    $(".latitude input[name='lat_deg']").val(to_fixed((parseFloat($(".latitude input[name='lat_deg']").val()) || 0) + lat_min_value / 60));
  }
  if(long_min_value > 0) {
    $(".longitude input[name='long_deg']").val(to_fixed((parseFloat($(".longitude input[name='long_deg']").val()) || 0) + long_min_value / 60));
  }
}

// Submit the form
function submit() {
  var err = "";
  var lat_deg_value = parseFloat($(".latitude input[name='lat_deg']").val());
  var long_deg_value = parseFloat($(".longitude input[name='long_deg']").val());
  $(".err_box").hide();
  
  // Validate Degree inputs, Error if input field is blank or Latitude Degrees  greater than 90 or Longitude Degrees greater than 180
  if(isNaN(parseFloat(lat_deg_value)) || lat_deg_value > 90) {err = err + "<li>Please Enter Valid Latitude Degrees (0 to 90)</li>";}
  if(isNaN(parseFloat(long_deg_value)) || long_deg_value > 180) {err = err + "<li>Please Enter Valid Longitude Degrees (0 to 180)</li>";}
  // Validation of Minute and Second inputs, Error if Minute or Second > 60
  if($(".latitude input[name='lat_min']").val() > 60) {err = err + "<li>Please Enter Valid Latitude Minutes (0 to 60)</li>";}
  if($(".longitude input[name='long_min']").val() > 60) {err = err + "<li>Please Enter Valid Longitude Minutes (0 to 60)</li>";}
  if($(".latitude input[name='lat_sec']").val() > 60) {err = err + "<li>Please Enter Valid Latitude Seconds (0 to 60)</li>";}
  if($(".longitude input[name='long_sec']").val() > 60) {err = err + "<li>Please Enter Valid Longitude Seconds (0 to 60)</li>";}

  if(err !== "") {
    // There is validation error, Show the errors
    $(".err_box").html("<ul>" + err + "</ul>");
    $(".err_box").show();
  } else {
    // There is no error, Convert the input in Degrees
    $( ".radio_item:first" ).trigger( "click" );
    // Show the calculated Latitude and Longitude values in result screen
    $(".result_lat .result_value").text(lat_deg_value);
    $(".result_long .result_value").text(long_deg_value);
    $(".overlay").show();
    $(".result_wrapper").show();    
  }
}

// Close the Result Screen
function close_overlay() {
  $(".overlay").hide();
  $(".result_wrapper").hide();
}