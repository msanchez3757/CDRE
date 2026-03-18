package com.msanchez.CDRE.model.dto;


import lombok.Data;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class VitalSignsDTO {

    // Stored as string to handle formats like "340/180"
    private String bloodPressure;

    private Integer heartRate;
}
