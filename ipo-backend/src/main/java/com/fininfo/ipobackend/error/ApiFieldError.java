package com.fininfo.ipobackend.error;

public record ApiFieldError(
        String field,
        String message
) {}

