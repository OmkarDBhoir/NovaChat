package com.novachat.novachat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.novachat.novachat.config.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
public class NovachatApplication {

	public static void main(String[] args) {
		SpringApplication.run(NovachatApplication.class, args);
	}

}
