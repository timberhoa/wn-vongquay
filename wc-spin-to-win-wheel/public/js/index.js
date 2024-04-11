//cookies functions
function createCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}
/**
 * get cookies
 * 
 */
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
/**
 * remove cookies
 *
 */
function eraseCookie(name) {
  createCookie(name, "", -1);
}


// tải nội dung JSON từ một URL cụ thể
function loadJSON(callback) {
  var jsonurl = spinio.ajax_url + '?action=get_wheel_json';
  //var adminurl='https://spin-globalsite.c9users.io/wp-admin/admin-ajax.php';
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");

  xobj.open('GET', jsonurl, true);
  xobj.onreadystatechange = function() {
    if (xobj.readyState == 4 && xobj.status == "200") {
      //Call the anonymous function (callback) passing in the response
      //console.log(xobj.responseText);
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

//function to capture the spin results
function myResult(e) {
  // Lấy nội dung từ kết quả của vòng quay (e.msg) //
  var status = e.msg.trim();

  // Kiểm tra nếu nội dung kết quả là rỗng
  if (status === "") {
    status = "lỗi";
  }

  // Hiển thị nội dung kết quả trong phần tử có class là "spinio-title"
  document.querySelector('.spinio-title').textContent = status;

  // Kiểm tra nếu người chơi thắng và có dữ liệu người dùng được định nghĩa
 // if (e.win && e.userData)
  if (e.userData){
    // Ẩn phần giới thiệu
    jQuery('.spinio-intro').hide();

    // Gán nội dung cho phần tử "spinio-result-desc"
    jQuery('#spinio-result-desc').text('copy this coupon code and use with your cart.');

    // Gán giá trị của điểm số người dùng vào phần tử "spinio-coupon-code"
    jQuery('#spinio-coupon-code').val(e.userData.score);

    // Hiển thị phần tử chứa kết quả vòng quay
    jQuery('.spinio-result').show();

    // Xử lý sự kiện click cho việc sao chép mã giảm giá
    jQuery('#spinio_copy').click(function(e) {
      e.preventDefault();
      var copyText = document.getElementById("spinio-coupon-code");
      copyText.select();
      document.execCommand("Copy");
    });

    // Log dữ liệu vòng quay và điểm số người dùng
    console.log(e);
    console.log('User defined score: ' + e.userData.score);
  } else {
    // Ẩn phần giới thiệu
    jQuery('.spinio-intro').hide();

    // Gán lại nội dung kết quả vào "spinio-result-msg"
    document.getElementById("spinio-result-msg").textContent = status;

    // Xóa nội dung của phần tử "spinio-result-desc"
    jQuery('#spinio-result-desc').text('');

    // // Ẩn phần tử chứa mã giảm giá và nút sao chép
     jQuery('#spinio-coupon-code').hide();
    jQuery('#spinio_copy').hide();

    // Hiển thị phần tử chứa kết quả vòng quay
    jQuery('.spinio-result').show();
  }

  // Tạo cookie để hiển thị kết quả vòng quay
  createCookie('spinio_show', 'show', '360');
 
}



//Hàm này được sử dụng để bắt lỗi khi có lỗi xảy ra trong quá trình quay vòng quay. 
function myError(e) {
  //e is error object
  console.log('Spin Count: ' + e.spinCount + ' - ' + 'Message: ' + e.msg);

}


// thực hiện một hành động sau một khoảng thời gian được xác định (trong trường hợp này là 5 giây). Cụ thể, hàm này gọi location.reload() để tải lại trang web. 

function myGameEnd(e) {
  //e is gameResultsArray
  console.log(e);
  console.log(jQuery('#spinio_sub_form').serialize());
  if (e.results.length) {
    jQuery.ajax(data = {
      action: 'spinio_set_subscriber',
      url: spinio.ajax_url + '?action=spinio_set_subscriber',
      type: 'POST',
      data: jQuery('#spinio_sub_form').serialize() + `&status=${e.results[0].msg}`,
      success: function(response) {
          console.log(response);
          obj = JSON.parse(response);
          if (!obj.error) {
              jQuery('.spinio-error').removeClass('spinio-dang').hide();
              jQuery('.spinBtn').trigger('click');
              spinio_spin = true;
              jQuery('#btn-wrap').hide();
          }
          else {
              jQuery('#spinio_form_btn').removeAttr("disabled");
              jQuery('.spinio-error').text(obj.email);
              jQuery('.spinio-error').addClass('spinio-dang').show();
          }
      },
      error: function(errorThrown) {
          alert(errorThrown);
      }
    });
  }
  TweenMax.delayedCall(5, function() {
    /*location.reload();*/
  })


}

function spinio_init() {
  loadJSON(function(response) {
    // Parse JSON string to an object
    var jsonData = JSON.parse(response);
    //if you want to spin it using your own button, then create a reference and pass it in as spinTrigger
    var mySpinBtn = document.querySelector('.spinBtn');
    //create a new instance of Spin2Win Wheel and pass in the vars object
    var myWheel = new Spin2WinWheel();

    //WITH your own button
    myWheel.init({ data: jsonData, onResult: myResult, onGameEnd: myGameEnd, onError: myError, spinTrigger: mySpinBtn });

    //WITHOUT your own button
    //myWheel.init({data:jsonData, onResult:myResult, onGameEnd:myGameEnd, onError:myError);



  });
}



//And finally call it
spinio_init();
