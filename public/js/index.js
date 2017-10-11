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

function degree_switch() {
  var lat_deg_decimal, long_deg_decimal, lat_min_decimal, long_min_decimal;
  if($(this).hasClass("active") === false) {
    $(".radio_item.active").removeClass("active");
    $(this).addClass("active").find("input[name='degree']").prop( "checked", true );
    $(".err_box").hide();

    lat_deg_decimal = parseFloat($(".latitude input[name='lat_deg']").val()).toString().split(".");
    long_deg_decimal = parseFloat($(".longitude input[name='long_deg']").val()).toString().split(".");
    lat_deg_decimal = parseInt(lat_deg_decimal[1]);
    long_deg_decimal = parseInt(long_deg_decimal[1]);

    if(lat_deg_decimal > 0) {
      $(".latitude input[name='lat_deg']").val(parseInt($(".latitude input[name='lat_deg']").val()));
      $(".latitude input[name='lat_min']").val((parseFloat("0." + lat_deg_decimal.toString()) * 60).toFixed(2));
    }
    if(long_deg_decimal > 0) {
      $(".longitude input[name='long_deg']").val(parseInt($(".longitude input[name='long_deg']").val()));
      $(".longitude input[name='long_min']").val((parseFloat("0." + long_deg_decimal.toString()) * 60).toFixed(2));
    }
    
    if($(".radio input[name='degree']:checked").val() !== "second") {
      if(parseInt($(".latitude input[name='lat_sec']").val()) > 0) {
        $(".latitude input[name='lat_min']").val((parseFloat($(".latitude input[name='lat_min']").val()) + parseInt($(".latitude input[name='lat_sec']").val()) / 60).toFixed(2));
      }
      if(parseInt($(".longitude input[name='long_sec']").val()) > 0) {
        $(".longitude input[name='long_min']").val((parseFloat($(".longitude input[name='long_min']").val()) + parseInt($(".longitude input[name='long_sec']").val()) / 60).toFixed(2));
      }
    }
    
    switch($(".radio input[name='degree']:checked").val()) {
      case "degree":
        if(parseFloat($(".latitude input[name='lat_min']").val()) > 0) {
          $(".latitude input[name='lat_deg']").val((parseFloat($(".latitude input[name='lat_deg']").val()) + parseFloat($(".latitude input[name='lat_min']").val()) / 60).toFixed(2));
        }
        if(parseFloat($(".longitude input[name='long_min']").val()) > 0) {
          $(".longitude input[name='long_deg']").val((parseFloat($(".longitude input[name='long_deg']").val()) + parseFloat($(".longitude input[name='long_min']").val()) / 60).toFixed(2));
        }

        $(".latitude input[name='lat_min']").val("");
        $(".latitude input[name='lat_sec']").val("");
        $(".longitude input[name='long_min']").val("");
        $(".longitude input[name='long_sec']").val("");
        $(".minute_block").hide();
        $(".second_block").hide();
        break;
      case "minute":
        $(".latitude input[name='lat_sec']").val("");
        $(".longitude input[name='long_sec']").val("");
        $(".minute_block").show();
        $(".second_block").hide();
        break;
      case "second":
        lat_min_decimal = parseFloat($(".latitude input[name='lat_min']").val()).toString().split(".");
        long_min_decimal = parseFloat($(".longitude input[name='long_min']").val()).toString().split(".");
        lat_min_decimal = parseInt(lat_min_decimal[1]);
        long_min_decimal = parseInt(long_min_decimal[1]);

        if(lat_min_decimal > 0) {
          $(".latitude input[name='lat_min']").val(parseInt($(".latitude input[name='lat_min']").val()));
          $(".latitude input[name='lat_sec']").val(parseInt(parseFloat("0." + lat_min_decimal.toString()) * 60));
        }
        if(long_min_decimal > 0) {
          $(".longitude input[name='long_min']").val(parseInt($(".longitude input[name='long_min']").val()));
          $(".longitude input[name='long_sec']").val(parseInt(parseFloat("0." + long_min_decimal.toString()) * 60));
        }
        
        $(".minute_block").show();
        $(".second_block").show();
        break;
    }
  }
}

function validate_decimal(element, chr) {
  switch($(".radio input[name='degree']:checked").val()) {
    case "minute":
      if((element.attr("name") === "lat_deg" || element.attr("name") === "long_deg") && chr === ".") {return false;}
      break;
    case "second":
      if(chr === ".") {return false;}
      break;
  }
}

function submit() {
  var err = "";
  $(".err_box").hide();
  
  if(isNaN(parseFloat($(".latitude input[name='lat_deg']").val())) || $(".latitude input[name='lat_deg']").val() > 90) {err = err + "<li>Please Enter Valid Latitude Degrees (0 to 90)</li>";}
  if(isNaN(parseFloat($(".longitude input[name='long_deg']").val())) || $(".longitude input[name='long_deg']").val() > 90) {err = err + "<li>Please Enter Valid Longitude Degrees (0 to 90)</li>";}
  if($(".latitude input[name='lat_min']").val() > 60) {err = err + "<li>Please Enter Valid Latitude Minutes (0 to 60)</li>";}
  if($(".longitude input[name='long_min']").val() > 60) {err = err + "<li>Please Enter Valid Longitude Minutes (0 to 60)</li>";}
  if($(".latitude input[name='lat_sec']").val() > 60) {err = err + "<li>Please Enter Valid Latitude Seconds (0 to 60)</li>";}
  if($(".longitude input[name='long_sec']").val() > 60) {err = err + "<li>Please Enter Valid Longitude Seconds (0 to 60)</li>";}

  if(err !== "") {
    $(".err_box").html("<ul>" + err + "</ul>");
    $(".err_box").show();
  } else {
    $(".overlay").show();
    $(".result_wrapper").show();    
  }
}

function close_overlay() {
  $(".overlay").hide();
  $(".result_wrapper").hide();
}