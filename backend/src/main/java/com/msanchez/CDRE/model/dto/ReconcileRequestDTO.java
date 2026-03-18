package com.msanchez.CDRE.model.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import tools.jackson.databind.PropertyNamingStrategies;
import tools.jackson.databind.annotation.JsonNaming;

import java.util.List;

@Data
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class ReconcileRequestDTO {
    @NotNull(message = "Patient context is required")
    @Valid
    private PatientContextDTO patientContext;

    @NotEmpty(message = "At least one medication source is required")
    @Valid
    private List<MedicationSourceDTO> sources;
}
