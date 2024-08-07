package com.duy.shopping.service.impl;

import com.duy.shopping.Constant.Constant;
import com.duy.shopping.Repository.NotificationRepository;
import com.duy.shopping.dto.NotificationDto;
import com.duy.shopping.model.Notification;
import com.duy.shopping.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationImpl implements NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public ResponseEntity<?> getNotificationsByUserId(long userId) {
        List<Notification> list = notificationRepository.findByUserId(userId);
        return ResponseEntity.ok(list);
    }

    @Override
    public ResponseEntity<?> readAllNoti(List<NotificationDto> listNotiDto) {
        Notification notification = new Notification();
        for (NotificationDto notiDto : listNotiDto) {
            notification = notificationRepository.findById(notiDto.getId());
            notification.setStatus(Constant.READED);
            notificationRepository.save(notification);
        }
        return ResponseEntity.ok().build();
    }
}
