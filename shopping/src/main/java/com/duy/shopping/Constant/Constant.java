package com.duy.shopping.Constant;

import java.util.regex.Pattern;

public class Constant {
    public static final Pattern EMAIL = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    public static final Pattern PHONE = Pattern.compile(
            "^\\d{10}$");
    public static final String EMAIL_EXIST="Email đã tồn tại, vui lòng chọn email khác";
    public static final String WAIT_FOR_CONFIRM_ORDER="Chờ xác nhận";
    public static final String PREPARING_ORDER ="Đang chuẩn bị hàng";
    public static final String SHIPPING ="Đang vận chuyển";
    public static final String COMPLETED ="Hoàn thành";
    public static final String CANCEL ="Đã hủy";
    public static final String NEW_PASSWORD ="123456";

    public static final String PENDING_REPORT ="Đang chờ xử lý";
    public static final String REJECT_REPORT ="Từ chối";
    public static final String ACCEPT_REPORT ="Chấp thuận";
    public static final String NOTI_HANDLE_REPORT ="Yêu cầu đã được giải quyết";
    public static final String NOTI_REJECT_REPORT =". Cảm ơn bạn đã đóng góp.";


    public static final String READED ="Đã đọc";
    public static final String UNREAD ="Chưa đọc";
    public static final String NOTI_ORDER_SUCCESS ="Đang đợi người bán xác nhận đơn hàng, mã đơn hàng của bạn là ";
    public static final String NOTI_ORDER_PREPARING ="Đơn hàng đã được xác nhận và chuẩn bị bàn giao cho đơn vị vận chuyển";
    public static final String NOTI_ORDER_SHIPPING ="Đơn vị vận chuyển lấy hàng thành công và đang trên đường giao tới bạn";

    public static final String NOTI_SHOP_NEW_ORDER ="Bạn nhận được đơn đặt hàng mới:  ";
    public static final String NOTI_SHOP_ORDER_COMPLETED ="Đơn hàng đã được giao thành công";

    public static final String NOTI_ADMIN_NEW_REPORT_ACCOUNT ="Yêu cầu tố cáo tài khoản";
    public static final String NOTI_ADMIN_NEW_REPORT_PRODUCT ="Yêu cầu tố cáo sản phẩm";

}
