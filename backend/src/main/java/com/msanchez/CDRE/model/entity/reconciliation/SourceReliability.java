package com.msanchez.CDRE.model.entity.reconciliation;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum SourceReliability {
    HIGH("high"),
    MEDIUM("medium"),
    LOW("low");

    private final String value;

    SourceReliability(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue(){
        return value;
    }

    @JsonCreator
    public static SourceReliability fromValue(String value) {
        for (SourceReliability reliability : SourceReliability.values()) {
            if (reliability.value.equalsIgnoreCase(value)) {
                return reliability;
            }
        }
        //TODO
        //add custom error
        throw new IllegalArgumentException("Unknown source reliability: " + value);
    }
}
