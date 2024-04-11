jQuery(document).ready(function() {
    var spinio_show = false;
    var spinio_spin = false;
    // Nhận Spinio nội dung phương thức
    var spiniomodalContent = document.getElementById('spinio-modal-content');
    // Get Spinio the modal
    var spiniomodal = document.getElementById('spinio-modal');
    // Get the Spinio button that opens the spinio modal
    var spiniobtn = document.getElementById("spinio-btn");
    var btnwrap = document.getElementById("btn-wrap");
    // Get the Spinio <span> element that closes the spinio modal
    var spiniospan = document.getElementsByClassName("spinio-close")[0];


      spiniobtn.onclick = function() {
        spiniomodalContent.classList.remove('hide-me');
        btnwrap.style.display = "none";
        jQuery('.spinio').css('z-index', '999999');
        fadeIn(spiniomodal);
    };
    
    // Execute fadeIn(spiniomodal) without a click event
    spiniomodalContent.classList.remove('hide-me');
    btnwrap.style.display = "none";
    jQuery('.spinio').css('z-index', '999999');
    fadeIn(spiniomodal);
    // khi người dùng nhấp vào biểu tượng 'x'  (x), close the spinio modal
    spiniospan.onclick = function() {
        spiniomodalContent.classList.add('hide-me');
        if (!spinio_spin)
            btnwrap.style.display = "block";
        jQuery('.spinio').css('z-index', '0');
        fadeOut(spiniomodal);
    };

    // xác định khi con trỏ chuột rời khỏi phạm vi trang

    document.addEventListener("mouseleave", function(e) {
        if (localStorage.getItem('SpinioState') != 'shown') {
            if (e.clientY < 0) {
                spiniomodalContent.classList.remove('hide-me');
                btnwrap.style.display = "none";
                jQuery('.spinio').css('z-index', '999999');
                fadeIn(spiniomodal);
                localStorage.setItem('SpinioState', 'shown')
            }
        }
    }, false);


    // khi người dùng nhấp chuột bất kỳ nơi nào trên trang
    window.onclick = function(event) {
        if (event.target == spiniomodal) {
            console.log(spinio_spin);
            spiniomodalContent.classList.add('hide-me');
            if (!spinio_spin)
                btnwrap.style.display = "block";
            fadeOut(spiniomodal);
        }
    };


    // tạo hiệu ứng làm mờ phần tử theo thời gian.
    function fadeOut(el) {
        el.style.opacity = 1;

        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.visibility = "hidden";
            }
            else {
                requestAnimationFrame(fade);
            }
        })();
    }

    // fade in hiệu ứng làm tăng độ mờ của phần tử theo thời gian,

    function fadeIn(el) {
        el.style.opacity = 0;
        el.style.visibility = "visible";

        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    }


    jQuery('.wheelContainer').click(function() { return false; }); //ngăn chặn hành động mặc định của trình duyệt khi người dùng click vào  vòng quay
    // alert('starting function');

    //xử lý sự kiện click trên nút trước khi email được điền
    jQuery('#spinio_form_btn').click(function(e) {
        jQuery('.spinio-error').removeClass('spinio-dang').hide();
        jQuery('.spinBtn').trigger('click');
        spinio_spin = true;
        jQuery('#btn-wrap').hide();
        // jQuery('#spinio_form_btn').attr("disabled", "disabled");
        // //alert(jQuery('#spinio_sub_form').serialize());
        // e.preventDefault();
        // jQuery.ajax(data = {
        //     action: 'spinio_set_subscriber',
        //     url: spinio.ajax_url + '?action=spinio_set_subscriber',
        //     type: 'POST',
        //     data: jQuery('#spinio_sub_form').serialize(),
        //     success: function(response) {
        //         console.log(response);
        //         obj = JSON.parse(response);
        //         if (!obj.error) {
        //             jQuery('.spinio-error').removeClass('spinio-dang').hide();
        //             jQuery('.spinBtn').trigger('click');
        //             spinio_spin = true;
        //             jQuery('#btn-wrap').hide();
        //         }
        //         else {
        //             jQuery('#spinio_form_btn').removeAttr("disabled");
        //             jQuery('.spinio-error').text(obj.email);
        //             jQuery('.spinio-error').addClass('spinio-dang').show();
        //         }
        //     },
        //     error: function(errorThrown) {
        //         alert(errorThrown);
        //     }


        // });
        return false;

    }); //form right section  kiểm tra xem cửa sổ modal đã được hiển thị hay chưa để hiển thị tuyết rơi
    function triggerSpinioPopup() {
         if (!spinio_show) {
             jQuery('#spinio-btn').trigger('click');
             spinio_show = true;
         }

    }
    if (spinioEintent) {
        var dtExit = new DialogTrigger(triggerSpinioPopup, { trigger: 'exitIntent' });
    }
    if (spinioEscroll) {
        var dtScrollDown = new DialogTrigger(triggerSpinioPopup, { trigger: 'scrollDown', percentDown: spScrollval });
    }
    //var dtScrollUp = new DialogTrigger(triggerSpinioPopup, { trigger: 'scrollUp', percentUp: 10 });
    //var dtScrollDown = new DialogTrigger(triggerSpinioPopup, { trigger: 'scrollDown', percentDown: 50 });
    if (spinioEtimer) {
        var dtTimer = new DialogTrigger(triggerSpinioPopup, { trigger: 'timeout', timeout: spTimeMil });
    }


}); // main function ready state


