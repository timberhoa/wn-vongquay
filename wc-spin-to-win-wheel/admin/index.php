
<?php // index.php
add_action('wp_ajax_spinio_send_result', 'spinio_send_result_callback');
add_action('wp_ajax_nopriv_spinio_send_result', 'spinio_send_result_callback');

function spinio_send_result_callback() {
    $result = isset($_POST['result']) ? sanitize_text_field($_POST['result']) : '';
    $email = isset($_POST['email']) ? sanitize_email($_POST['email']) : '';

    if (!empty($result) && !empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $subject = 'Kết quả quay may mắn';
        $message = 'Kết quả của bạn: ' . $result;
        $headers = array('Content-Type: text/html; charset=UTF-8');

        $sent = wp_mail($email, $subject, $message, $headers);

        if ($sent) {
            echo json_encode(array('success' => true, 'message' => 'Kết quả đã được gửi về địa chỉ email của bạn.'));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Không thể gửi kết quả qua email. Vui lòng thử lại sau.'));
        }
    } else {
        echo json_encode(array('success' => false, 'message' => 'Địa chỉ email hoặc kết quả không hợp lệ.'));
    }

    wp_die();
}