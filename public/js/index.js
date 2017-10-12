$(function() {
  $(".radio_item").on("click", degree_switch);
  
  $(".lat_long input").on("keypress", function (e) {
    var charCode = e.which || e.keyCode;
    var charStr = String.fromCharCode(charCode);
    if ((charStr != "." && /\d/.test(charStr) === false) || (validate_decimal($(this), charStr) === false)) {
        return false;
    }
  });
  
  $(".submit").on("click", submit);
  
  $(".result_close").on("click", close_overlay);
});

function validate_decimal(element, chr) {
  switch($(".radio input[name='degree']:checked").val()) {
    case "minute":
      if((element.attr("name") === "lat_deg" || element.attr("name") === "long_deg") && chr === ".") {return false;}
      break;
    case "second":
      if(chr === "." && (element.attr("name") !== "lat_sec" && element.attr("name") !== "long_sec") ) {return false;}
      break;
  }
}

function degree_switch() {
  if($(this).hasClass("active") === false) {
    $(".radio_item.active").removeClass("active");
    $(this).addClass("active").find("input[name='degree']").prop( "checked", true );
    $(".err_box").hide();
    
    switch($(".radio input[name='degree']:checked").val()) {
      case "degree":
        sec_to_min();
        min_to_deg();
        $(".latitude input[name='lat_min']").val("");
        $(".latitude input[name='lat_sec']").val("");
        $(".longitude input[name='long_min']").val("");
        $(".longitude input[name='long_sec']").val("");
        $(".minute_block").hide();
        $(".second_block").hide();
        break;
      case "minute":
        deg_to_min();
        sec_to_min();
        $(".latitude input[name='lat_sec']").val("");
        $(".longitude input[name='long_sec']").val("");
        $(".minute_block").show();
        $(".second_block").hide();
        break;
      case "second":
        deg_to_min();
        min_to_sec();
        $(".minute_block").show();
        $(".second_block").show();
        break;
    }
  }
}

function to_fixed(num) {
  var fixed =6;
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)[0];
}

function deg_to_min() {
  var lat_deg_decimal, long_deg_decimal;
  lat_deg_decimal = parseFloat($(".latitude input[name='lat_deg']").val()).toString().split(".");
  long_deg_decimal = parseFloat($(".longitude input[name='long_deg']").val()).toString().split(".");
  lat_deg_decimal = parseFloat($(".latitude input[name='lat_deg']").val()) - parseInt(lat_deg_decimal[0]);
  long_deg_decimal = parseFloat($(".longitude input[name='long_deg']").val()) - parseInt(long_deg_decimal[0]);

  if(lat_deg_decimal > 0) {
    $(".latitude input[name='lat_deg']").val(parseInt($(".latitude input[name='lat_deg']").val()));
    $(".latitude input[name='lat_min']").val(to_fixed(lat_deg_decimal * 60));
  }
  if(long_deg_decimal > 0) {
    $(".longitude input[name='long_deg']").val(parseInt($(".longitude input[name='long_deg']").val()));
    $(".longitude input[name='long_min']").val(to_fixed(long_deg_decimal * 60));
  }
}

function min_to_sec() {
  var lat_min_decimal, long_min_decimal;
  lat_min_decimal = parseFloat($(".latitude input[name='lat_min']").val()).toString().split(".");
  long_min_decimal = parseFloat($(".longitude input[name='long_min']").val()).toString().split(".");
  lat_min_decimal = parseFloat($(".latitude input[name='lat_min']").val()) - parseInt(lat_min_decimal[0]);
  long_min_decimal = parseFloat($(".longitude input[name='long_min']").val()) - parseInt(long_min_decimal[0]);

  if(lat_min_decimal > 0) {
    $(".latitude input[name='lat_min']").val(parseInt($(".latitude input[name='lat_min']").val()));
    $(".latitude input[name='lat_sec']").val(to_fixed(lat_min_decimal * 60));
  }
  if(long_min_decimal > 0) {
    $(".longitude input[name='long_min']").val(parseInt($(".longitude input[name='long_min']").val()));
    $(".longitude input[name='long_sec']").val(to_fixed(long_min_decimal * 60));
  }
}

function sec_to_min() {
  if(parseFloat($(".latitude input[name='lat_sec']").val()) > 0) {
    $(".latitude input[name='lat_min']").val(to_fixed((parseFloat($(".latitude input[name='lat_min']").val()) || 0) + parseFloat($(".latitude input[name='lat_sec']").val()) / 60));
  }
  if(parseFloat($(".longitude input[name='long_sec']").val()) > 0) {
    $(".longitude input[name='long_min']").val(to_fixed((parseFloat($(".longitude input[name='long_min']").val()) || 0) + parseFloat($(".longitude input[name='long_sec']").val()) / 60));
  }
}

function min_to_deg() {
  if(parseFloat($(".latitude input[name='lat_min']").val()) > 0) {
    $(".latitude input[name='lat_deg']").val(to_fixed((parseFloat($(".latitude input[name='lat_deg']").val()) || 0) + parseFloat($(".latitude input[name='lat_min']").val()) / 60));
  }
  if(parseFloat($(".longitude input[name='long_min']").val()) > 0) {
    $(".longitude input[name='long_deg']").val(to_fixed((parseFloat($(".longitude input[name='long_deg']").val()) || 0) + parseFloat($(".longitude input[name='long_min']").val()) / 60));
  }
}

function submit() {
  var err = "";
  $(".err_box").hide();
  
  if(isNaN(parseFloat($(".latitude input[name='lat_deg']").val())) || $(".latitude input[name='lat_deg']").val() > 90) {err = err + "<li>Please Enter Valid Latitude Degrees (0 to 90)</li>";}
  if(isNaN(parseFloat($(".longitude input[name='long_deg']").val())) || $(".longitude input[name='long_deg']").val() > 180) {err = err + "<li>Please Enter Valid Longitude Degrees (0 to 180)</li>";}
  if($(".latitude input[name='lat_min']").val() > 60) {err = err + "<li>Please Enter Valid Latitude Minutes (0 to 60)</li>";}
  if($(".longitude input[name='long_min']").val() > 60) {err = err + "<li>Please Enter Valid Longitude Minutes (0 to 60)</li>";}
  if($(".latitude input[name='lat_sec']").val() > 60) {err = err + "<li>Please Enter Valid Latitude Seconds (0 to 60)</li>";}
  if($(".longitude input[name='long_sec']").val() > 60) {err = err + "<li>Please Enter Valid Longitude Seconds (0 to 60)</li>";}

  if(err !== "") {
    $(".err_box").html("<ul>" + err + "</ul>");
    $(".err_box").show();
  } else {
    $( ".radio_item:first" ).trigger( "click" );
    $(".result_lat .result_value").text($(".latitude input[name='lat_deg']").val());
    $(".result_long .result_value").text($(".longitude input[name='long_deg']").val());
    $(".overlay").show();
    $(".result_wrapper").show();    
  }
}

function close_overlay() {
  $(".overlay").hide();
  $(".result_wrapper").hide();
}