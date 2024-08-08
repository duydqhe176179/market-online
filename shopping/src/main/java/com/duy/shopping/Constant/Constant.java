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

}
