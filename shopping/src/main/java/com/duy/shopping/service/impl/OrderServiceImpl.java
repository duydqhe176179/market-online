package com.duy.shopping.service.impl;

import com.duy.shopping.Repository.*;
import com.duy.shopping.dto.OrderDto;
import com.duy.shopping.dto.OrderItemDto;
import com.duy.shopping.model.Notification;
import com.duy.shopping.model.OrderInfo;
import com.duy.shopping.model.OrderItem;
import com.duy.shopping.model.Product;
import com.duy.shopping.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static com.duy.shopping.Constant.Constant.*;
import static com.duy.shopping.config.createCode.createCode;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderInfoRepo orderInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemRepo orderItemRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public ResponseEntity<?> createOrder(OrderDto orderDto) {
        long userId = orderDto.getUserId();
        List<OrderItemDto> orderItems = orderDto.getOrderItems();
        Set<Long> uniqueIdShops = orderItems.stream()
                .map(OrderItemDto::getShopId) // Extract idShop from each order
                .collect(Collectors.toSet()); // Collect into a set to ensure uniqueness

        // Convert the set back to a list (optional)
        List<Long> uniqueIdShopList = new ArrayList<>(uniqueIdShops);
        for (Long shopId : uniqueIdShopList) {
            OrderInfo orderInfo = new OrderInfo();
            orderInfo.setUser(userRepository.findById(userId));
            orderInfo.setShop(userRepository.findById(shopId).get());
            orderInfo.setStatus(WAIT_FOR_CONFIRM_ORDER);
            orderInfo.setCreateDate(new Date());
            orderInfo.setPayMethod(orderDto.getPayMethod());
            long priceInit = 0;
            int count = 0;
            long idProductImageForNoti = 0;
            for (OrderItemDto orderItem : orderItems) {
                if (orderItem.getShopId().equals(shopId)) {
                    priceInit += orderItem.getPrice();
                    if (count < 1) {
                        idProductImageForNoti = orderItem.getProductId();
                    }
                    count++;
                }
            }
            orderInfo.setTotalOrder(priceInit);
            String code = createCode(10);
            orderInfo.setCode(code);
            OrderInfo savedOrderInfo = orderInfoRepository.save(orderInfo);

            //tạo thông báo cho người đặt
            String imageForNoti = productRepository.findByIdProduct(idProductImageForNoti).get().getImage().get(0);
            Notification notification = new Notification();
            notification.setUser(userRepository.findById(userId));
            notification.setImage(imageForNoti);
            notification.setTitle("Đặt hàng thành công");
            notification.setContent(NOTI_ORDER_SUCCESS + code);
            notification.setDate(new Date());
            notification.setStatus(UNREAD);
            notification.setUrl("/user/purchaseOrder");
            notificationRepository.save(notification);
            //
            //tạo thông báo cho người bán
            Notification notification2 = new Notification();
            notification2.setUser(userRepository.findById(shopId).get());
            notification2.setImage(imageForNoti);
            notification2.setTitle("Bạn có đơn đặt hàng mới");
            notification2.setContent(NOTI_SHOP_NEW_ORDER + code);
            notification2.setDate(new Date());
            notification2.setStatus(UNREAD);
            notification2.setUrl("/seller");
            notificationRepository.save(notification2);
            //

            for (OrderItemDto orderItemDto : orderItems) {
                Optional<Product> productOptional = productRepository.findByIdProduct(orderItemDto.getProductId());
                if (!productOptional.isPresent()) {
                    return ResponseEntity.notFound().build();
                }
                Product product = productOptional.get();
                if (product.getShop().getId() == shopId) {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(savedOrderInfo);
                    orderItem.setProduct(product);
                    orderItem.setQuantity(orderItemDto.getQuantity());
                    orderItemRepository.save(orderItem);

                    product.setRemain(product.getRemain() - orderItemDto.getQuantity());
                    productRepository.save(product);
                }
            }
        }


        return ResponseEntity.ok().body("order success");
    }

    @Override
    public List<OrderItem> getAllItemOfOrder(List<Long> idOrder) {
        List<OrderItem> orderItems = new ArrayList<>();
        for (Long idorder : idOrder) {
            orderItems.addAll(orderItemRepository.findByOrderId(idorder));
        }
        return orderItems;
    }

    @Override
    public ResponseEntity<?> changeStatusOrder(long idOrder, String status) {
        OrderInfo order = orderInfoRepository.findById((idOrder)).get();

        //tạo noti cho người đặt
        Notification notification = new Notification();
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(idOrder);
        notification.setImage(orderItems.get(0).getProduct().getImage().get(0));
        notification.setDate(new Date());
        notification.setStatus(UNREAD);

        if (order.getStatus().equals(WAIT_FOR_CONFIRM_ORDER)) {
            order.setStatus(PREPARING_ORDER);
            orderInfoRepository.save(order);
            notification.setUser(order.getUser());
            notification.setTitle("Người bán đã xác nhận đơn hàng " + order.getCode());
            notification.setContent(NOTI_ORDER_PREPARING);
            notification.setUrl("/user/purchaseOrder");
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        } else if (order.getStatus().equals(PREPARING_ORDER)) {
            order.setStatus(SHIPPING);
            orderInfoRepository.save(order);
            notification.setUser(order.getUser());
            notification.setTitle("Đơn vị vận chuyển lấy hàng thành công");
            notification.setContent(NOTI_ORDER_SHIPPING);
            notification.setUrl("/user/purchaseOrder");
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        } else if (order.getStatus().equals(SHIPPING)) {
            order.setStatus(COMPLETED);
            orderInfoRepository.save(order);
            notification.setUser(order.getShop());
            notification.setTitle("Hoàn thành");
            notification.setContent(NOTI_SHOP_ORDER_COMPLETED);
            notification.setUrl("/seller");
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
