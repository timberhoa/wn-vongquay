// DialogTriggerJS
// //
// // Kích hoạt một hàm callback để hiển thị một hộp thoại (hoặc thực hiện bất kỳ hành động nào khác) với các tùy chọn kích hoạt được chỉ định.
// //
// // "trigger" có thể là một trong các tùy chọn sau:
// // 'exitIntent': Gọi 'callback' khi người dùng có ý định thoát (ví dụ: di chuyển con trỏ ra khỏi trang hoặc quay trở lại đầu trang)
// // 'target': Gọi 'callback' khi người dùng đạt đến một phần tử mục tiêu cụ thể trên trang (thiết lập 'target' thành tên của phần tử, ví dụ: '#mytarget')
// // 'scrollDown': Gọi 'callback' khi người dùng cuộn trang xuống một phần trăm nhất định từ khi đối tượng được khởi tạo (thiết lập 'percentDown' thành phần trăm từ 0-100)
// // 'scrollUp': Gọi 'callback' khi người dùng cuộn trang lên một phần trăm nhất định từ khi đối tượng được khởi tạo (thiết lập 'percentUp' thành phần trăm từ 0-100)
// // 'timeout': Gọi 'callback' sau một số mili giây nhất định đã trôi qua (thiết lập 'timeout' thành số mili giây mong muốn)
// //
// // Ví dụ:
// // Thiết lập các kích hoạt cá nhân:
// // var dt = new DialogTrigger(triggerNagPopup, { trigger: 'timeout', timeout: 5000 });
// // var dt = new DialogTrigger(triggerNagPopup, { trigger: 'target', target: '#all' });
// // var dt = new DialogTrigger(triggerNagPopup, { trigger: 'scrollDown', percentDown: 50 });
// // var dt = new DialogTrigger(triggerNagPopup, { trigger: 'exitIntent' });
// //
// // Các kích hoạt cũng có thể được chuỗi lại để tạo ra một chuỗi hành vi (ví dụ: cuộn xuống 50%, sau đó thoát):
// // var dtPercent = new DialogTrigger(function() {
// // var dtExit = new DialogTrigger(triggerNagPopup, { trigger: 'exitIntent' });
// // }, { trigger: 'scrollDown', percentDown: 50 });
// function DialogTrigger(callback, options) {
// 	// Becomes this.options
// 	var defaults = {
// 		trigger	: 'timeout',
// 		target	: '',
// 		timeout	: 0,
// 		percentDown : 50, // Ngưỡng mặc định (dưới dạng phần trăm) cho cuộn xuống đáng chú ý (dựa trên chiều cao của trang) cho kích hoạt 'scrollDown'.
// 		percentUp : 10, //  Ngưỡng mặc định (dưới dạng phần trăm) cho cuộn lên sau khi vượt qua ngưỡng cuộn xuống đối với kích hoạt 'scrollUp'.
// 		scrollInterval: 1000 // Tần suất (theo mili giây) để kiểm tra sự thay đổi cuộn trang (để tránh làm chậm giao diện người dùng).
// 	}
	
// 	this.complete = false; // Let's us know if the popup has been triggered
	
// 	this.callback = callback;
// 	this.timer = null;
// 	this.interval = null;
	
// 	this.options = jQuery.extend(defaults, options);
	
// 	this.init = function() {
// 		if(this.options.trigger == 'exitIntent' || this.options.trigger == 'exit_intent') {
// 			var parentThis = this;
			
// 			jQuery(document).on('mouseleave', function(e) {
// 				//console.log(e.clientX + ',' + e.clientY); // IE returns negative values on all sides
				
// 				if(!parentThis.complete && e.clientY < 0) { // Ngăn việc kích hoạt lại popup sau khi đã mở
// 					parentThis.callback();
// 					parentThis.complete = true;
// 					jQuery(document).off('mouseleave');
// 				}
// 			});

// 		} else if(this.options.trigger == 'target') {
// 			if(this.options.target !== '') {
// 				// Make sure the target exists
// 				if(jQuery(this.options.target).length == 0) {
// 					this.complete = true;
// 				} else {
// 					var targetScroll = jQuery(this.options.target).offset().top;
					
// 					var parentThis = this;
					
// 					// Only check the scroll position every few seconds, to avoid bogging the UI
// 					this.interval = setInterval(function() {
// 						if(jQuery(window).scrollTop() >= targetScroll) {
// 							clearInterval(parentThis.interval);
// 							parentThis.interval = null;
							
// 							if(!parentThis.complete) {
// 								parentThis.callback();
// 								parentThis.complete = true;
// 							}
// 						}
// 					}, this.options.scrollInterval);
// 				}
// 			}
			
// 		} else if(this.options.trigger == 'scrollDown') {
// 			// Let the user scroll down by some significant amount
// 			var scrollStart = jQuery(window).scrollTop();
// 			var pageHeight = jQuery(document).height();
			
// 			var parentThis = this;
			
// 			if(pageHeight > 0) {
// 				// Only check the scroll position every few seconds, to avoid bogging the UI
// 				this.interval = setInterval(function() {
// 					var scrollAmount = jQuery(window).scrollTop() - scrollStart;
// 					if(scrollAmount < 0) {
// 						scrollAmount = 0;
// 						scrollStart = jQuery(window).scrollTop();
// 					}
// 					var downScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);
					
// 					if(downScrollPercent > parseFloat(parentThis.options.percentDown) / 100) {
// 						clearInterval(parentThis.interval);
// 						parentThis.interval = null;
						
// 						if(!parentThis.complete) {
// 							parentThis.callback();
// 							parentThis.complete = true;
// 						}
// 					}
					
// 				}, this.options.scrollInterval);
// 			}
			
// 		} else if(this.options.trigger == 'scrollUp') {
// 			// Let the user scroll down by some significant amount
// 			var scrollStart = jQuery(window).scrollTop();
// 			var pageHeight = jQuery(document).height();
			
// 			var parentThis = this;
			
// 			if(pageHeight > 0) {
// 				// Only check the scroll position every few seconds, to avoid bogging the UI
// 				this.interval = setInterval(function() {
// 					var scrollAmount = scrollStart - jQuery(window).scrollTop();
// 					if(scrollAmount < 0) {
// 						scrollAmount = 0;
// 						scrollStart = jQuery(window).scrollTop();
// 					}
// 					var upScrollPercent = parseFloat(scrollAmount) / parseFloat(pageHeight);
					
// 					if(upScrollPercent > parseFloat(parentThis.options.percentUp) / 100) {
// 						clearInterval(parentThis.interval);
// 						parentThis.interval = null;
						
// 						if(!parentThis.complete) {
// 							parentThis.callback();
// 							parentThis.complete = true;
// 						}
// 					}
					
// 				}, this.options.scrollInterval);
// 			}
			
// 		} else if(this.options.trigger == 'timeout') {
// 			this.timer = setTimeout(this.callback, this.options.timeout);
// 		}
		
//     };
	
// 	this.cancel = function() {
// 		if(this.timer !== null) {
// 			clearTimeout(this.timer);
// 			this.timer = null;
// 		}
		
// 		if(this.interval !== null) {
// 			clearInterval(this.interval);
// 			this.interval = null;
// 		}
		
// 		this.complete = true;
// 	}

//     this.init();
// }
