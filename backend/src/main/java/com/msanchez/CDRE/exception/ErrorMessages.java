package com.msanchez.CDRE.exception;

public enum ErrorMessages {
    // Reconciliation
    RECONCILIATION_NOT_FOUND("Reconciliation record not found"),
    RECONCILIATION_INSUFFICIENT_SOURCES("At least two medication sources are required to perform reconciliation"),
    RECONCILIATION_INVALID_SOURCE("Medication source must have either last_updated or last_filled date"),

    // AI Service
    AI_SERVICE_DOWN("AI service is currently unavailable, please try again later"),
    AI_SERVICE_INVALID_RESPONSE("AI service returned an unexpected response"),

    // Generic
    INVALID_REQUEST("Invalid request body"),
    INVALID_ENUM_VALUE("Invalid value provided for one or more fields"),

    INVALID_PATIENT_RECORD("Patient record is invalid or missing required fields"),
    DATA_QUALITY_LAST_UPDATED_INVALID("last_updated must be a valid date in format YYYY-MM-DD");

    private final String message;

    ErrorMessages(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
