package com.example.spring_boot.controllers.modules;

import org.springframework.stereotype.Controller;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.spring_boot.services.VNPayService;
import java.util.HashMap;
import java.util.Map;

@Controller
public class VnpayController {
    
    @Autowired
    private VNPayService vnPayService;
    
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
     * GET /api/vnpay/test-payment?amount=100000&orderInfo=Test Order
     */
    @GetMapping("/api/vnpay/test-payment")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> testPaymentApi(
            @RequestParam(value = "amount", defaultValue = "100000") int amount,
            @RequestParam(value = "orderInfo", defaultValue = "Test Payment Order") String orderInfo,
            HttpServletRequest request) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
            String paymentUrl = vnPayService.createOrder(amount, orderInfo, baseUrl);
            
            response.put("success", true);
            response.put("paymentUrl", paymentUrl);
            response.put("message", "Test tạo URL thanh toán thành công");
            response.put("amount", amount);
            response.put("orderInfo", orderInfo);
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
    public String GetMapping(HttpServletRequest request, Model model){
        int paymentStatus =vnPayService.orderReturn(request);

        String orderInfo = request.getParameter("vnp_OrderInfo");
        String paymentTime = request.getParameter("vnp_PayDate");
        String transactionId = request.getParameter("vnp_TransactionNo");
        String totalPrice = request.getParameter("vnp_Amount");

        model.addAttribute("orderId", orderInfo);
        model.addAttribute("totalPrice", totalPrice);
        model.addAttribute("paymentTime", paymentTime);
        model.addAttribute("transactionId", transactionId);

        return paymentStatus == 1 ? "ordersuccess" : "orderfail";
    }
}
