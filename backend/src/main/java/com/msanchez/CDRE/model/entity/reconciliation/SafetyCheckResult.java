package com.msanchez.CDRE.model.entity.reconciliation;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SafetyCheckResult {
    PASSED("PASSED"),
    WARNING("WARNING"),
    FAILED("FAILED");

    private final String value;

    SafetyCheckResult(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static SafetyCheckResult fromValue(String value) {
        for (SafetyCheckResult result : SafetyCheckResult.values()) {
            if (result.value.equalsIgnoreCase(value)) {
                return result;
            }
        }
        //TODO
        //add custom error
        throw new IllegalArgumentException("Unknown safety check result: " + value);
    }
}
