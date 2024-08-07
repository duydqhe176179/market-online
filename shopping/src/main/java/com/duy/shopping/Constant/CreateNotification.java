package com.duy.shopping.Constant;

import com.duy.shopping.Repository.NotificationRepository;
import com.duy.shopping.Repository.UserRepository;
import com.duy.shopping.model.Notification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

import static com.duy.shopping.Constant.Constant.UNREAD;
@Service
public class CreateNotification {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    public final void createNotification(Long idUser,String image,String title,String content,String url) {
        Notification notification = new Notification();
        notification.setUser(userRepository.findById(idUser).get()); //id của ADMIN
        notification.setImage(image);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setDate(new Date());
        notification.setStatus(UNREAD);
        notification.setUrl(url);
        notificationRepository.save(notification);
    }
}
