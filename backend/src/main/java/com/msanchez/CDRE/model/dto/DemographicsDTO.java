package com.msanchez.CDRE.model.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class DemographicsDTO {

    @NotBlank(message = "Patient name is required")
    private String name;

    // Stored as string to match input format "1955-03-15"
    @NotBlank(message = "Date of birth is required")
    private String dob;

    @NotBlank(message = "Gender is required")
    private String gender;
}
