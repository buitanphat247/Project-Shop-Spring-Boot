package com.example.spring_boot.configs;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.upload")
public class UploadProperties {

    // Default to static folder so files are served at /uploads/{file}
    private String dir = "src/main/resources/static/uploads";

    public String getDir() {
        return dir;
    }

    public void setDir(String dir) {
        this.dir = dir;
    }
}


