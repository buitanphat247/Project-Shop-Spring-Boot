// package com.example.spring_boot.configs;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.stereotype.Component;
// import org.springframework.data.mongodb.core.MongoTemplate;

// import java.util.List;

// @Component
// public class CollectionInitializer implements CommandLineRunner {
//     private static final Logger log = LoggerFactory.getLogger(CollectionInitializer.class);
//     private final MongoTemplate mongoTemplate;

//     public CollectionInitializer(MongoTemplate mongoTemplate) { this.mongoTemplate = mongoTemplate; }

//     @Override
//     public void run(String... args) {
//         List<String> collections = List.of(
//                 "users", "roles", "permissions", "role_permissions",
//                 "refresh_tokens", "categories", "products", "carts",
//                 "cart_items", "orders", "order_items", "product_likes", "product_images", "product_attributes",
//                 "news_posts", "news_comments", "news_likes"
//         );
//         for (String name : collections) if (!mongoTemplate.collectionExists(name)) {
//             mongoTemplate.createCollection(name);
//             log.info("Created collection: {}", name);
//         }
//     }
// }




