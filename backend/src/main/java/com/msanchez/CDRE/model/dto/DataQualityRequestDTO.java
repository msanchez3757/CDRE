package com.msanchez.CDRE.model.dto;


import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DataQualityRequestDTO {

    @NotNull(message = "Demographics are required")
    @Valid
    private DemographicsDTO demographics;

    // Optional fields — their absence contributes to completeness score
    private List<String> medications;

    private List<String> allergies;

    private List<String> conditions;

    @Valid
    private VitalSignsDTO vitalSigns;

    private String lastUpdated;
}
