package com.msanchez.CDRE.model.dto;

import com.msanchez.CDRE.model.entity.reconciliation.SourceReliability;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.time.LocalDate;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class MedicationSourceDTO {
    @NotBlank(message = "Source system name is required")
    private String system;

    @NotBlank(message = "Medication is required")
    private String medication;

    // Optional — pharmacy records use last_filled instead
    private LocalDate lastUpdated;

    // Only present on pharmacy source records
    private LocalDate lastFilled;

    @NotNull(message = "Source reliability is required")
    private SourceReliability sourceReliability;
}
