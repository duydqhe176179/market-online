package com.duy.shopping.service.impl;

import com.duy.shopping.constant.CreateHistoryWallet;
import com.duy.shopping.constant.CreateNotification;
import com.duy.shopping.repository.*;
import com.duy.shopping.dto.OrderDto;
import com.duy.shopping.dto.OrderItemDto;
import com.duy.shopping.model.Notification;
import com.duy.shopping.model.OrderInfo;
import com.duy.shopping.model.OrderItem;
import com.duy.shopping.model.Product;
import com.duy.shopping.model.User;
import com.duy.shopping.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

import static com.duy.shopping.constant.Constant.*;
import static com.duy.shopping.config.CreateCode.createCode;

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
    @Autowired
    private CreateNotification createNotification;
    @Autowired
    private OrderItemRepo orderItemRepo;
    @Autowired
    private CreateHistoryWallet createHistoryWallet;

    @Override
    public ResponseEntity<?> createOrder(OrderDto orderDto) {
        List<OrderItemDto> list = orderDto.getOrderItems();
        for (OrderItemDto orderItemDto : list) {
            Product product = productRepository.findByIdProduct(orderItemDto.getProductId()).get();
            if (product.getRemain() < orderItemDto.getQuantity()) {
                return ResponseEntity.badRequest().body("Số lượng sản phẩm còn lại không đủ");
            }
        }
        long userId = orderDto.getUserId();
        User user = userRepository.findById(userId);
        List<OrderItemDto> orderItems = orderDto.getOrderItems();
        List<OrderInfo> listOrderInfo = new ArrayList<>();
        Set<Long> uniqueIdShops = orderItems.stream()
                .map(OrderItemDto::getShopId) // Extract idShop from each order
                .collect(Collectors.toSet()); // Collect into a set to ensure uniqueness

        // Convert the set back to a list (optional)
        List<Long> uniqueIdShopList = new ArrayList<>(uniqueIdShops);
        for (Long shopId : uniqueIdShopList) {
            OrderInfo orderInfo = new OrderInfo();
            orderInfo.setUser(userRepository.findById(userId));
            orderInfo.setShop(userRepository.findById(shopId).get());
            if (orderDto.getPayMethod().equals("online")) {
                orderInfo.setStatus(WAIT_FOR_BANKING_ORDER);
            } else {
                orderInfo.setStatus(WAIT_FOR_CONFIRM_ORDER);
            }
            orderInfo.setCreateDate(new Date());
            orderInfo.setPayMethod(orderDto.getPayMethod());
            int priceInit = 0;
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
            orderInfo.setAddress(userRepository.findById(userId).getAddress());
            orderInfo.setPhone(userRepository.findById(userId).getPhone());
            OrderInfo savedOrderInfo = orderInfoRepository.save(orderInfo);
            listOrderInfo.add(savedOrderInfo);
            //tạo thông báo cho người đặt
            String imageForNoti = productRepository.findByIdProduct(idProductImageForNoti).get().getImage().get(0);
            Notification notification = new Notification();
            notification.setUser(userRepository.findById(userId));
            notification.setImage(imageForNoti);
            notification.setTitle("Đặt hàng thành công");
            notification.setContent(NOTI_ORDER_SUCCESS + code);
            notification.setDate(new Date());
            notification.setStatus(UNREAD);
            notification.setUrl("/user/detailOrder?idOrder=" + savedOrderInfo.getId());
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
            // tạo lịch sử ví nếu pay method là wallet
            if (orderDto.getPayMethod().equals("wallet")) {
                int newBalance = user.getWallet() - orderInfo.getTotalOrder();
                user.setWallet(newBalance);
                userRepository.save(user);
                createHistoryWallet.createHistoryWallet(userId, "Thanh toán đơn hàng", "PAYMENT", orderInfo.getTotalOrder(), newBalance);
            }
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
        return ResponseEntity.ok().body(listOrderInfo);
    }

    @Override
    public ResponseEntity<?> getAllOrdersInfo(long idUser) {
        List<OrderInfo> list = orderInfoRepository.findByUserId(idUser);
        return ResponseEntity.ok(list);
    }

    @Override
    public ResponseEntity<?> getAllItemFromOrderOfUser(long idUser) {
        List<OrderInfo> listOrder = orderInfoRepository.findByUserId(idUser);
        List<OrderItem> allItem = new ArrayList<>();
        for (OrderInfo orderInfo : listOrder) {
            List<OrderItem> list = orderItemRepo.findByOrderId(orderInfo.getId());
            allItem.addAll(list);
        }
        return ResponseEntity.ok(allItem);
    }

    @Override
    public ResponseEntity<?> getOrderInfo(long orderId) {
        OrderInfo orderInfo = orderInfoRepository.findById(orderId).get();
        return ResponseEntity.ok().body(orderInfo);
    }

    @Override
    public ResponseEntity<?> getItemsOfOrder(long orderId) {
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderId);
        return ResponseEntity.ok().body(orderItems);
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
            notification.setUrl("/user/detailOrder?idOrder=" + order.getId());
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        } else if (order.getStatus().equals(PREPARING_ORDER)) {
            order.setStatus(SHIPPING);
            orderInfoRepository.save(order);
            notification.setUser(order.getUser());
            notification.setTitle("Đơn vị vận chuyển lấy hàng thành công");
            notification.setContent(NOTI_ORDER_SHIPPING);
            notification.setUrl("/user/detailOrder?idOrder=" + order.getId());
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        } else if (order.getStatus().equals(SHIPPING)) {
            order.setStatus(COMPLETED);
            orderInfoRepository.save(order);
            // cộng tiền vào ví cho shop
            User shop=order.getShop();
            shop.setWallet(shop.getWallet()+order.getTotalOrder()*95/100);
            userRepository.save(shop);
            // tạo lịch sử ví
            createHistoryWallet.createHistoryWallet(shop.getId(),"Thanh toán đơn hàng","RECEIVE",order.getTotalOrder()*95/100,shop.getWallet());

            notification.setUser(order.getShop());
            notification.setTitle("Hoàn thành");
            notification.setContent(NOTI_SHOP_ORDER_COMPLETED);
            notification.setUrl("/seller");
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @Override
    public ResponseEntity<?> cancelOrder(long idOrder) {
        OrderInfo orderInfo = orderInfoRepository.findById((idOrder)).get();
        if (orderInfo.getStatus().equals(WAIT_FOR_CONFIRM_ORDER) || orderInfo.getStatus().equals(WAIT_FOR_BANKING_ORDER)) {
            orderInfo.setStatus(CANCEL);
        } else {
            return ResponseEntity.badRequest().body("Không thể hủy");
        }
        // nếu thanh toán bằng ví hoặc vnpay, hủy đơn hoàn tiền về ví
        if (orderInfo.getPayMethod().equals("online") || orderInfo.getPayMethod().equals("wallet")) {
            User user = userRepository.findById(orderInfo.getUser().getId()).get();
            user.setWallet(user.getWallet() + orderInfo.getTotalOrder());
            createHistoryWallet.createHistoryWallet(orderInfo.getUser().getId(), "Hoàn tiền", "REFUND", orderInfo.getTotalOrder(), user.getWallet());
        }
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(idOrder);
        // tạo noti cho người mua
        createNotification.createNotification(orderInfo.getUser().getId(), orderItems.get(0).getProduct().getImage().get(0), NOTI_ORDER_CANCEL, "Đơn hàng đã hủy thành công", "/user/detailOrder?idOrder=" + orderInfo.getId());
        //tạo noti cho người bán
        createNotification.createNotification(orderInfo.getShop().getId(), orderItems.get(0).getProduct().getImage().get(0), NOTI_SHOP_CANCEL_ORDER, "Đơn hàng đã hủy. Lý do: ", "/seller?statusOrder=Đã hủy");
        return ResponseEntity.ok().build();
    }

    @Override
    public List<OrderInfo> getOrders(List<Long> idOrder) {
        List<OrderInfo> orderInfos = new ArrayList<>();
        for (Long idorder : idOrder) {
            OrderInfo orderInfo = orderInfoRepository.findById((idorder)).get();
            orderInfos.add(orderInfo);
        }
        return orderInfos;
    }

    @Override
    public ResponseEntity<?> paySuccess(String[] codeOrder) {
        System.out.println(codeOrder.length);
        for (String codeorder : codeOrder) {
            System.out.println("Processing order: " + codeorder);

            OrderInfo orderInfo = orderInfoRepository.findByCode(codeorder);
            orderInfo.setStatus(WAIT_FOR_CONFIRM_ORDER);
            orderInfoRepository.save(orderInfo);

            // tạo noti thanh toán thành công
            List<OrderItem> listItem = orderItemRepo.findByOrderId(orderInfo.getId());
            createNotification.createNotification(orderInfo.getUser().getId(), listItem.get(0).getProduct().getImage().get(0), NOTI_PAYMENT_SUCCESS, "Đơn hàng " + codeorder + " đã được thanh toán", "/user/detailOrder?idOrder=" + orderInfo.getId());
        }
        return ResponseEntity.ok().build();
    }

    @Override
    public List<OrderInfo> getAllOrderOfShop(long idShop) {
        return orderInfoRepository.findByIdShop(idShop);
    }
}
