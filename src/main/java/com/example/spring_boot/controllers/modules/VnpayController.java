package com.example.spring_boot.controllers.modules;

import org.springframework.stereotype.Controller;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.spring_boot.services.VNPayService;
import com.example.spring_boot.services.order.OrderService;
import java.util.HashMap;
import java.util.Map;

@Controller
public class VnpayController {
    
    @Autowired
    private VNPayService vnPayService;
    
    @Autowired
    private OrderService orderService;
    
    // ==================== API ENDPOINTS FOR TESTING ====================
    
    /**
     * API tạo URL thanh toán VNPay
     * POST /api/vnpay/create-payment
     */
    @PostMapping("/api/vnpay/create-payment")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> createPaymentApi(
            @RequestParam("amount") int amount,
            @RequestParam("orderInfo") String orderInfo,
            @RequestParam("orderId") String orderId,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
            String paymentUrl = vnPayService.createOrder(amount, orderInfo, baseUrl);
            
            response.put("success", true);
            response.put("paymentUrl", paymentUrl);
            response.put("message", "Tạo URL thanh toán thành công");
            response.put("amount", amount);
            response.put("orderInfo", orderInfo);
            response.put("orderId", orderId);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi khi tạo URL thanh toán: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * API xử lý kết quả thanh toán từ VNPay
     * GET /api/vnpay/payment-result
     */
    @GetMapping("/api/vnpay/payment-result")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> paymentResultApi(HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            int paymentStatus = vnPayService.orderReturn(request);
            
            String orderInfo = request.getParameter("vnp_OrderInfo");
            String paymentTime = request.getParameter("vnp_PayDate");
            String transactionId = request.getParameter("vnp_TransactionNo");
            String totalPrice = request.getParameter("vnp_Amount");
            String responseCode = request.getParameter("vnp_ResponseCode");
            String bankCode = request.getParameter("vnp_BankCode");
            String cardType = request.getParameter("vnp_CardType");
            
            response.put("success", true);
            response.put("paymentStatus", paymentStatus);
            response.put("statusText", getStatusText(paymentStatus));
            response.put("orderInfo", orderInfo);
            response.put("amount", totalPrice);
            response.put("transactionId", transactionId);
            response.put("paymentTime", paymentTime);
            response.put("responseCode", responseCode);
            response.put("bankCode", bankCode);
            response.put("cardType", cardType);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi khi xử lý kết quả thanh toán: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * API test cấu hình VNPay
     * GET /api/vnpay/test-config
     */
    @GetMapping("/api/vnpay/test-config")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> testConfigApi() {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            response.put("success", true);
            response.put("message", "Cấu hình VNPay hoạt động bình thường");
            response.put("timestamp", System.currentTimeMillis());
            response.put("service", "VNPayService");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi cấu hình VNPay: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    /**
     * API test tạo URL thanh toán đơn giản
     * GET /api/vnpay/test-payment?amount=100000&orderInfo=Test Order&orderId=ORD123
     */
    @GetMapping("/api/vnpay/test-payment")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> testPaymentApi(
            @RequestParam(value = "amount", defaultValue = "100000") int amount,
            @RequestParam(value = "orderInfo", defaultValue = "Test Payment Order") String orderInfo,
            @RequestParam(value = "orderId", defaultValue = "ORD123456") String orderId,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
            
            // Tạo orderInfo với orderId
            String finalOrderInfo = "OrderID: " + orderId + " - " + orderInfo;
            String paymentUrl = vnPayService.createOrder(amount, finalOrderInfo, baseUrl);
            
            response.put("success", true);
            response.put("paymentUrl", paymentUrl);
            response.put("message", "Test tạo URL thanh toán thành công");
            response.put("amount", amount);
            response.put("orderInfo", finalOrderInfo);
            response.put("orderId", orderId);
            response.put("returnUrl", baseUrl + "/vnpay-payment");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Lỗi khi test tạo URL thanh toán: " + e.getMessage());
            response.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(response);
        }
    }
    
    // ==================== HELPER METHODS ====================
    
    private String getStatusText(int status) {
        switch (status) {
            case 1: return "Thanh toán thành công";
            case 0: return "Thanh toán thất bại";
            case -1: return "Lỗi xác thực chữ ký";
            default: return "Trạng thái không xác định";
        }
    }
    
    private String generateRandomOrderId() {
        // Tạo mã đơn hàng random với format: ORD + timestamp + random number
        long timestamp = System.currentTimeMillis();
        int randomNum = (int)(Math.random() * 10000); // 4 digits random
        return "ORD" + timestamp + String.format("%04d", randomNum);
    }
    
    /**
     * Lấy Order ID từ orderInfo
     * Format: "OrderID: {orderId} - {other info}"
     */
    private String getOrderIdFromOrderInfo(String orderInfo) {
        if (orderInfo == null || orderInfo.isEmpty()) {
            System.err.println("OrderInfo is null or empty");
            return generateRandomOrderId();
        }
        
        try {
            // Parse orderInfo để lấy orderId
            // Format: "OrderID: {orderId} - {other info}"
            if (orderInfo.contains("OrderID:")) {
                String[] parts = orderInfo.split("OrderID:");
                if (parts.length > 1) {
                    String orderIdPart = parts[1].trim();
                    // Lấy phần trước dấu " - " nếu có
                    if (orderIdPart.contains(" - ")) {
                        orderIdPart = orderIdPart.split(" - ")[0].trim();
                    }
                    System.out.println("✅ Parsed OrderID from orderInfo: " + orderIdPart);
                    return orderIdPart;
                }
            }
            
            // Fallback: tìm orderId trong orderInfo (có thể là format khác)
            System.out.println("⚠️ Could not parse OrderID from orderInfo: " + orderInfo);
            return generateRandomOrderId();
            
        } catch (Exception e) {
            System.err.println("❌ Error parsing OrderID from orderInfo: " + e.getMessage());
            return generateRandomOrderId();
        }
    }
    
    // ==================== TEST METHODS ====================
    
    /**
     * Test callback URL để debug
     * GET /test-vnpay-callback
     */
    @GetMapping("/test-vnpay-callback")
    public String testCallback(Model model) {
        // Simulate VNPay callback parameters
        model.addAttribute("orderId", generateRandomOrderId());
        model.addAttribute("totalPrice", "380,000");
        model.addAttribute("responseCode", "24");
        model.addAttribute("statusText", "Thanh toán thất bại");
        model.addAttribute("paymentTime", "2025-01-22 14:30:25");
        model.addAttribute("transactionId", "0");
        model.addAttribute("bankCode", "VNPAY");
        model.addAttribute("cardType", "QRCODE");
        model.addAttribute("transactionStatus", "02");
        model.addAttribute("paymentStatus", 0);
        model.addAttribute("isPaymentSuccess", false);
        model.addAttribute("error", "Test error message");
        
        return "clients/orderfail";
    }
    
    // ==================== ORIGINAL METHODS ====================
    
    @PostMapping("/submitOrder")
    public String submidOrder(@RequestParam("amount") int orderTotal,
                            @RequestParam("orderInfo") String orderInfo,
                            HttpServletRequest request){
        String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
        String vnpayUrl = vnPayService.createOrder(orderTotal, orderInfo, baseUrl);
        return "redirect:" + vnpayUrl;
    }

    @GetMapping("/vnpay-payment")
    public String handleVnPayCallback(HttpServletRequest request, Model model){
        try {
            // Xử lý kết quả thanh toán từ VNPay
            int paymentStatus = vnPayService.orderReturn(request);
            
            // Lấy thông tin từ VNPay callback
            String orderInfo = request.getParameter("vnp_OrderInfo");
            String paymentTime = request.getParameter("vnp_PayDate");
            String transactionId = request.getParameter("vnp_TransactionNo");
            String totalPrice = request.getParameter("vnp_Amount");
            String responseCode = request.getParameter("vnp_ResponseCode");
            String bankCode = request.getParameter("vnp_BankCode");
            String cardType = request.getParameter("vnp_CardType");
            String transactionStatus = request.getParameter("vnp_TransactionStatus");
            
            // Decode URL parameters nếu cần
            if (orderInfo != null) {
                try {
                    orderInfo = java.net.URLDecoder.decode(orderInfo, "UTF-8");
                } catch (Exception e) {
                    System.err.println("Error decoding orderInfo: " + e.getMessage());
                }
            }
            
            // Tạo mã đơn hàng random
            String orderId = generateRandomOrderId();
            
            // Format số tiền từ VNPay (đơn vị là xu, cần chia 100)
            String formattedAmount = "0";
            if (totalPrice != null && !totalPrice.isEmpty()) {
                try {
                    long amount = Long.parseLong(totalPrice);
                    formattedAmount = String.format("%,d", amount / 100);
                } catch (NumberFormatException e) {
                    formattedAmount = "0";
                }
            }
            
            // Log thông tin để debug
            System.out.println("VNPay Callback - Payment Status: " + paymentStatus);
            System.out.println("VNPay Callback - Response Code: " + responseCode);
            System.out.println("VNPay Callback - Transaction Status: " + transactionStatus);
            System.out.println("VNPay Callback - Order Info: " + orderInfo);
            System.out.println("VNPay Callback - Amount: " + totalPrice);
            
            // Thêm thông tin vào model
            model.addAttribute("orderId", orderId);
            model.addAttribute("totalPrice", formattedAmount);
            model.addAttribute("paymentTime", paymentTime);
            model.addAttribute("transactionId", transactionId);
            model.addAttribute("responseCode", responseCode);
            model.addAttribute("bankCode", bankCode);
            model.addAttribute("cardType", cardType);
            model.addAttribute("transactionStatus", transactionStatus);
            model.addAttribute("paymentStatus", paymentStatus);
            model.addAttribute("statusText", getStatusText(paymentStatus));
            
            // Kiểm tra thanh toán thành công
            boolean isPaymentSuccess = (paymentStatus == 1) && 
                                    ("00".equals(responseCode)) && 
                                    ("00".equals(transactionStatus));
            
            model.addAttribute("isPaymentSuccess", isPaymentSuccess);
            
            // Xử lý kết quả thanh toán
            if (isPaymentSuccess) {
                System.out.println("=== VNPAY CALLBACK: THANH TOÁN THÀNH CÔNG ===");
                System.out.println("Transaction ID: " + transactionId);
                System.out.println("Order Info: " + orderInfo);
                
                try {
                    // Lấy orderId thực từ orderInfo
                    String realOrderId = getOrderIdFromOrderInfo(orderInfo);
                    
                    // Xử lý thanh toán thành công
                    orderService.handlePaymentSuccess(realOrderId, transactionId);
                    System.out.println("✅ Order xử lý thành công - Cart đã bị xóa");
                    
                } catch (Exception e) {
                    System.err.println("❌ Lỗi xử lý thanh toán thành công: " + e.getMessage());
                    e.printStackTrace();
                }
                
                return "clients/ordersuccess";
                
            } else {
                System.out.println("=== VNPAY CALLBACK: THANH TOÁN THẤT BẠI ===");
                System.out.println("Response Code: " + responseCode);
                System.out.println("Transaction Status: " + transactionStatus);
                System.out.println("Order Info: " + orderInfo);
                
                try {
                    // Lấy orderId thực từ orderInfo
                    String realOrderId = getOrderIdFromOrderInfo(orderInfo);
                    
                    // Xử lý thanh toán thất bại
                    orderService.handlePaymentFailure(realOrderId, "Payment failed - Response Code: " + responseCode);
                    System.out.println("❌ Order xử lý thất bại - Cart được giữ nguyên");
                    
                } catch (Exception e) {
                    System.err.println("❌ Lỗi xử lý thanh toán thất bại: " + e.getMessage());
                    e.printStackTrace();
                }
                
                return "clients/orderfail";
            }
            
        } catch (Exception e) {
            System.err.println("Error processing VNPay callback: " + e.getMessage());
            e.printStackTrace();
            
            // Tạo mã đơn hàng fallback
            String fallbackOrderId = generateRandomOrderId();
            
            // Thêm thông tin lỗi vào model
            model.addAttribute("orderId", fallbackOrderId);
            model.addAttribute("totalPrice", "0");
            model.addAttribute("error", e.getMessage());
            model.addAttribute("isPaymentSuccess", false);
            model.addAttribute("statusText", "Lỗi xử lý thanh toán");
            model.addAttribute("responseCode", "99");
            model.addAttribute("paymentTime", "");
            model.addAttribute("transactionId", "");
            model.addAttribute("bankCode", "");
            model.addAttribute("cardType", "");
            model.addAttribute("transactionStatus", "");
            model.addAttribute("paymentStatus", -1);
            
            return "clients/orderfail";
        }
    }
}
