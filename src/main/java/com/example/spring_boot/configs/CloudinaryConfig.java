package com.example.spring_boot.configs;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    private static final String CLOUD_NAME = "ddq92is0n";
    private static final String API_KEY = "295988279255453";
    private static final String API_SECRET = "zlyv3Z9H5Zd2PnqFIeP-PfyEmbA";

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", CLOUD_NAME,
                "api_key", API_KEY,
                "api_secret", API_SECRET,
                "secure", true));
    }
}