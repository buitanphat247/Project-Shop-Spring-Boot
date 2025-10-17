package com.example.spring_boot.controllers.pages;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping("/dashboard")
    public String dashboard() {
        return "admin/dashboard";
    }

    @GetMapping("/products")
    public String products() {
        return "admin/products";
    }

    @GetMapping("/products/create")
    public String productsCreate() {
        return "admin/products-create";
    }

    @GetMapping("/products/deleted")
    public String productsDeleted() {
        return "admin/products-deleted";
    }

    @GetMapping("/news")
    public String news() {
        return "admin/news";
    }

    @GetMapping("/news/create")
    public String newsCreate() {
        return "admin/news-create";
    }

    @GetMapping("/news/deleted")
    public String newsDeleted() {
        return "admin/news-deleted";
    }

    @GetMapping("/orders")
    public String orders() {
        return "admin/orders";
    }

    @GetMapping("/orders/pending")
    public String ordersPending() {
        return "admin/orders-pending";
    }

    @GetMapping("/customers")
    public String customers() {
        return "admin/customers";
    }

    @GetMapping("/customers/blocked-history")
    public String customersBlockedHistory() {
        return "admin/customers-blocked-history";
    }

    @GetMapping("/analytics")
    public String analytics() {
        return "admin/analytics";
    }

    // Categories Management
    @GetMapping("/categories")
    public String categories() {
        return "admin/categories";
    }

    @GetMapping("/categories/create")
    public String categoriesCreate() {
        return "admin/categories-create";
    }

    @GetMapping("/categories/edit/{id}")
    public String categoriesEdit(@PathVariable Long id) {
        return "admin/categories-edit";
    }

    // Sales Management
    @GetMapping("/sales")
    public String sales() {
        return "admin/sales";
    }

    @GetMapping("/sales/products")
    public String salesProducts() {
        return "admin/sales-products";
    }

    @GetMapping("/sales/products/search")
    public String salesProductsSearch() {
        return "admin/sales-products-search";
    }

    @GetMapping("/sales/products/edit")
    public String salesProductsEdit() {
        return "admin/sales-products-edit";
    }

    @GetMapping("/sales/invoices")
    public String salesInvoices() {
        return "admin/sales-invoices";
    }

    @GetMapping("/sales/reports")
    public String salesReports() {
        return "admin/sales-reports";
    }

    // Search & Filter
    @GetMapping("/search")
    public String search() {
        return "admin/search";
    }

    @GetMapping("/search/products")
    public String searchProducts() {
        return "admin/search-products";
    }

    @GetMapping("/search/orders")
    public String searchOrders() {
        return "admin/search-orders";
    }

    @GetMapping("/search/customers")
    public String searchCustomers() {
        return "admin/search-customers";
    }

    // Promotions Management
    @GetMapping("/promotions")
    public String promotions() {
        return "admin/promotions";
    }

    @GetMapping("/promotions/create")
    public String promotionsCreate() {
        return "admin/promotions-create";
    }

    // Reports Management
    @GetMapping("/reports")
    public String reports() {
        return "admin/reports";
    }

    @GetMapping("/reports/revenue")
    public String reportsRevenue() {
        return "admin/reports/revenue";
    }

    @GetMapping("/reports/products")
    public String reportsProducts() {
        return "admin/reports/products";
    }

    @GetMapping("/reports/customers")
    public String reportsCustomers() {
        return "admin/reports/customers";
    }

    // Sales Management - Quản lý bán hàng
    @GetMapping("/sales/product-lookup")
    public String salesProductLookup() {
        return "admin/sales-product-lookup";
    }

    @GetMapping("/sales/product-list")
    public String salesProductList() {
        return "admin/sales-product-list";
    }

    @GetMapping("/sales/edit-product")
    public String salesEditProduct() {
        return "admin/sales-edit-product";
    }

    @GetMapping("/sales/invoice-list")
    public String salesInvoiceList() {
        return "admin/sales-invoice-list";
    }

    // Warehouse Management - Quản lý kho
    @GetMapping("/warehouse/import")
    public String warehouseImport() {
        return "admin/warehouse-import";
    }

    @GetMapping("/warehouse/import/create")
    public String warehouseImportCreate() {
        return "admin/warehouse-import-create";
    }

    @GetMapping("/warehouse/import/history")
    public String warehouseImportHistory() {
        return "admin/warehouse-import-history";
    }

    @GetMapping("/warehouse/create-import-slip")
    public String warehouseCreateImportSlip() {
        return "admin/warehouse-create-import-slip";
    }

    @GetMapping("/warehouse/export")
    public String warehouseExport() {
        return "admin/warehouse-export";
    }

    @GetMapping("/promotions/edit/{id}")
    public String promotionsEdit(@PathVariable Long id) {
        return "admin/promotions-edit";
    }

}
