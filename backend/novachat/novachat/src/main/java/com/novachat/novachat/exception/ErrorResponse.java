package com.novachat.novachat.exception;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(Instant timestamp, int status, String error, String message, String path,
		Map<String, String> validationErrors) {

	public ErrorResponse(Instant timestamp, int status, String error, String message, String path) {

		this(timestamp, status, error, message, path, null);
	}
}