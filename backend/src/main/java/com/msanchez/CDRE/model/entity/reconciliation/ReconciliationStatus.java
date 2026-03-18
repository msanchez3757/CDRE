package com.msanchez.CDRE.model.entity.reconciliation;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ReconciliationStatus {
    PENDING("pending"),
    APPROVED("approved"),
    REJECTED("rejected");

    private final String value;

    ReconciliationStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static ReconciliationStatus fromValue(String value) {
        for (ReconciliationStatus status : ReconciliationStatus.values()) {
            if (status.value.equalsIgnoreCase(value)) {
                return status;
            }
        }
        //TODO
        //add custom error
        throw new IllegalArgumentException("Unknown reconciliation status: " + value);
    }
}
