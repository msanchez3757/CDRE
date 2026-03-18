package com.msanchez.CDRE.model.dto;

import com.msanchez.CDRE.model.entity.reconciliation.SafetyCheckResult;
import lombok.Data;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class AiReconciliationResponse {
    private String reconciledMedication;

    private Double confidenceScore;

    private String reasoning;

    private List<String> recommendedActions;

    private SafetyCheckResult clinicalSafetyCheck;
}
