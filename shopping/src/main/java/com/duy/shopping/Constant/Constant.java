package com.duy.shopping.constant;

import java.util.regex.Pattern;

public class Constant {
    public static final Pattern EMAIL = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    public static final Pattern PHONE = Pattern.compile(
            "^\\d{10}$");
    public static final Pattern PASSWORD = Pattern.compile(
            "^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$");
    public static final String URL_ORIGIN = "http://localhost:3000";
    public static final String EMAIL_EXIST = "Email đã tồn tại, vui lòng chọn email khác";
    public static final String WAIT_FOR_BANKING_ORDER = "Đang chờ thanh toán";
    public static final String WAIT_FOR_CONFIRM_ORDER = "Chờ xác nhận";
    public static final String PREPARING_ORDER = "Đang chuẩn bị hàng";
    public static final String SHIPPING = "Đang vận chuyển";
    public static final String COMPLETED = "Hoàn thành";
    public static final String CANCEL = "Đã hủy";
    public static final String NEW_PASSWORD = "123456";

    public static final String PENDING_REPORT = "Đang chờ xử lý";
    public static final String REJECT_REPORT = "Từ chối";
    public static final String ACCEPT_REPORT = "Chấp thuận";
    public static final String NOTI_HANDLE_REPORT = "Yêu cầu đã được giải quyết";
    public static final String NOTI_THANKS_REPORT = "Cảm ơn bạn đã đóng góp.";
    public static final String NOTI_LOCKED_PRODUCT = "Bạn có sản phẩm đã bị khóa.";
    public static final String ICON_NOTI_BLOCKED_ACCOUNT = "../images/icon/warning.png";


    public static final String READED = "Đã đọc";
    public static final String UNREAD = "Chưa đọc";
    public static final String NOTI_PAYMENT_SUCCESS = "Thanh toán đơn hàng thành công";
    public static final String NOTI_DEPOSIT_SUCCESS = "Nạp tiền vào tài khoản thành công";
    public static final String NOTI_ORDER_SUCCESS = "Đang đợi người bán xác nhận đơn hàng, mã đơn hàng của bạn là ";
    public static final String NOTI_ORDER_PREPARING = "Đơn hàng đã được xác nhận và chuẩn bị bàn giao cho đơn vị vận chuyển";
    public static final String NOTI_ORDER_SHIPPING = "Đơn vị vận chuyển lấy hàng thành công và đang trên đường giao tới bạn";
    public static final String NOTI_ORDER_CANCEL = "Đơn hàng đã hủy";

    public static final String NOTI_SHOP_NEW_ORDER = "Bạn nhận được đơn đặt hàng mới:  ";
    public static final String NOTI_SHOP_CANCEL_ORDER = "Đơn hàng đã bị hủy";
    public static final String NOTI_SHOP_ORDER_COMPLETED = "Đơn hàng đã được giao thành công";
    public static final String NOTI_SHOP_REJECT_PRODUCT = "Sản phẩm của bạn không được duyệt";
    public static final String NOTI_SHOP_ACCEPT_PRODUCT = "Sản phẩm của bạn được duyệt thành công";


    public static final String NOTI_ADMIN_NEW_REPORT_ACCOUNT = "Yêu cầu tố cáo tài khoản";
    public static final String NOTI_ADMIN_NEW_REPORT_PRODUCT = "Yêu cầu tố cáo sản phẩm";
    public static final String NOTI_ADMIN_NEW_PRODUCT = "Có sản phẩm mới cần duyệt";

}
