<?php

/**
 * Kích hoạt khi plugin được gỡ bỏ.
 *
 * Khi điền thông tin vào tệp này, hãy xem xét quy trình điều khiển sau:
 *
 * - Phương thức này nên là tĩnh
 * - Kiểm tra xem nội dung $_REQUEST thực sự là tên của plugin
 * - Chạy kiểm tra tham chiếu admin để đảm bảo rằng nó đi qua xác thực
 * - Xác minh đầu ra của $_GET có ý nghĩa không
 * - Lặp lại với các vai trò người dùng khác nhau. Tốt nhất là trực tiếp bằng cách sử dụng các liên kết/tham số chuỗi truy vấn.
 * - Lặp lại với các điều đó cho mạng nhiều trang. Một lần cho một trang duy nhất trong mạng, một lần trên toàn trang web.
 *
 * Tệp này có thể được cập nhật thêm trong các phiên bản tương lai của Boilerplate; tuy nhiên, đây là khung và tóm tắt tổng quan về cách tệp nên hoạt động.
 *
 * Để biết thêm thông tin, hãy xem cuộc thảo luận sau:
 * https://github.com/tommcfarlin/WordPress-Plugin-Boilerplate/pull/123#issuecomment-28541913
 *
 * @link       https://xfinitysoft.com/
 * @since      1.0.0
 *
 * @package    spinio
 */

// Nếu gỡ cài đặt không được gọi từ WordPress, thì thoát.
if ( ! defined( 'WP_UNINSTALL_PLUGIN' ) ) {
	exit;
}
