// Mail.js
document.addEventListener("DOMContentLoaded", function(event) {
    var copyBtn = document.getElementById('spinio_copy');

    if (copyBtn) {
        copyBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn sự kiện mặc định của nút

            var result = document.getElementById('spinio-coupon-code').value;
            var email = document.getElementsByName('email')[0].value;

            if (result && email) {
                sendResultByEmail(result, email);
            }
        });
    }
});

function sendResultByEmail(result, email) {
    jQuery.ajax({
        url: spinio_ajax.ajax_url,
        type: 'POST',
        data: {
            action: 'spinio_send_result',
            result: result,
            email: email
        },
        success: function(response) {
            response = JSON.parse(response); // Parse response thành object JSON
            if (response.success) {
                // Hiển thị thông báo thành công cho người dùng
                document.getElementById('spinio-result-msg').innerHTML = response.message;
            } else {
                // Hiển thị thông báo lỗi cho người dùng
                document.getElementById('spinio-result-msg').innerHTML = response.message;
            }
        },
        error: function(xhr, status, error) {
            console.error(error);
        }
    });
}

