package com.msanchez.CDRE.model.dto;


import lombok.Builder;
import lombok.Data;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;
import java.util.Map;

@Data
@Builder
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DataQualityResultDTO {

    private int overallScore;

    // Breakdown by dimension — completeness, accuracy, timeliness, clinical_plausibility
    private Map<String, Integer> breakdown;

    private List<DataQualityIssueDTO> issuesDetected;
}
