package com.novachat.novachat.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@ConfigurationProperties(prefix = "security.jwt")
@Getter
@Setter
public class JwtProperties {

	private String issuer;

	private String secret;

	private Long accessTokenExpiration;

	private Long refreshTokenExpiration;

}