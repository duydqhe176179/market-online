package com.duy.shopping.dto;

import lombok.Data;

@Data
public class ReportAccountDto {
    private String title;
    private String content;
    private long idAccuser;
    private long idAccused;
}
