package com.duy.shopping.Constant;

import java.util.regex.Pattern;

public class Constant {
    public static final Pattern EMAIL = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    public static final Pattern PHONE = Pattern.compile(
            "^\\d{10}$");
    public static final String EMAIL_EXIST="Email đã tồn tại, vui lòng chọn email khác";
}
