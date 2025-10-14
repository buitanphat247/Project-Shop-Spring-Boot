package com.example.spring_boot.configs;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class ErrorConfigController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        // Lấy mã lỗi HTTP (404, 500, 403, ...)
        Object statusCode = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object requestUri = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        Object exception = request.getAttribute(RequestDispatcher.ERROR_EXCEPTION);
        Object servletName = request.getAttribute(RequestDispatcher.ERROR_SERVLET_NAME);

        // In ra terminal
        System.out.println("========== ERROR DETECTED ==========");
        System.out.println("Status Code : " + statusCode);
        System.out.println("Request URI : " + requestUri);
        System.out.println("Servlet Name: " + servletName);
        System.out.println("Exception   : " + exception);
        System.out.println("====================================");

        // Trả về view error/error.html
        return "error/error";
    }
}