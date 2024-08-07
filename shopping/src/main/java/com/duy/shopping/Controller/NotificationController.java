package com.duy.shopping.Controller;

import com.duy.shopping.dto.NotificationDto;
import com.duy.shopping.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("http://localhost:3000/")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @PostMapping("/readAllNoti")
    public ResponseEntity<?> readAllNoti(@RequestBody List<NotificationDto> notificationDto) {
        return notificationService.readAllNoti(notificationDto);
    }
}
