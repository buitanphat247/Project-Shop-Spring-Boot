package com.example.spring_boot.configs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;
import com.mongodb.client.MongoClient;

/**
 * Cấu hình kiểm tra kết nối MongoDB
 */
@Component
public class CheckDb implements HealthIndicator {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Autowired
    private MongoClient mongoClient;
    
    @Override
    public Health health() {
        try {
            // Kiểm tra kết nối bằng cách ping database
            long startTime = System.currentTimeMillis();
            mongoTemplate.getDb().runCommand(org.bson.Document.parse("{ping: 1}"));
            long responseTime = System.currentTimeMillis() - startTime;
            
            // Lấy thông tin database
            String dbName = mongoTemplate.getDb().getName();
            String host = mongoClient.getClusterDescription().getServerDescriptions().get(0).getAddress().toString();
            
            return Health.up()
                    .withDetail("database", "MongoDB")
                    .withDetail("dbName", dbName)
                    .withDetail("host", host)
                    .withDetail("status", "Kết nối thành công")
                    .withDetail("responseTime", responseTime + "ms")
                    .withDetail("timestamp", System.currentTimeMillis())
                    .build();
                    
        } catch (Exception e) {
            return Health.down()
                    .withDetail("database", "MongoDB")
                    .withDetail("status", "Kết nối thất bại")
                    .withDetail("error", e.getMessage())
                    .withDetail("errorType", e.getClass().getSimpleName())
                    .withDetail("timestamp", System.currentTimeMillis())
                    .build();
        }
    }
}
