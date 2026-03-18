package com.msanchez.CDRE.model.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;
import java.util.Map;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class PatientContextDTO {
    @NotNull(message = "Patient age is required")
    @Min(value = 0, message = "Patient age must be a positive number")
    private Integer age;

    private List<String> conditions;

    private Map<String, Object> recentLabs;
}
