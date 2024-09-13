package com.duy.shopping.service;

import com.duy.shopping.dto.NotificationDto;
import com.duy.shopping.model.Notification;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface NotificationService {
    ResponseEntity<?> getNotificationsByUserId(long userId);
    ResponseEntity<?> readAllNoti(List<NotificationDto> listNotiDto);
}