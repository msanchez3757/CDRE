package com.msanchez.CDRE.model.dto;


import lombok.Data;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class AiDataQualityResponse {

    // Claude only scores the dimensions that need clinical intelligence
    private int accuracyScore;

    private int clinicalPlausibilityScore;

    private List<DataQualityIssueDTO> issuesDetected;
}
