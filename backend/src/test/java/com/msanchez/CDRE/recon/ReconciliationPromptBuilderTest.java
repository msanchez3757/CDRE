package com.msanchez.CDRE.recon;


import com.msanchez.CDRE.model.dto.MedicationSourceDTO;
import com.msanchez.CDRE.model.dto.PatientContextDTO;
import com.msanchez.CDRE.model.entity.reconciliation.SourceReliability;
import com.msanchez.CDRE.service.Ai.ReconciliationPromptBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class ReconciliationPromptBuilderTest {

    private ReconciliationPromptBuilder promptBuilder;

    @BeforeEach
    void setup() {
        this.promptBuilder = new ReconciliationPromptBuilder();
    }

    @Test
    void build_shouldIncludePatientAge_inPrompt() {
        PatientContextDTO context = getValidContext();
        List<MedicationSourceDTO> sources = getValidSources();

        String prompt = promptBuilder.build(context, sources);

        assertTrue(prompt.contains("Age: 67"));
    }

    @Test
    void build_shouldIncludePatientConditions_inPrompt() {
        PatientContextDTO context = getValidContext();
        List<MedicationSourceDTO> sources = getValidSources();

        String prompt = promptBuilder.build(context, sources);

        assertTrue(prompt.contains("Type 2 Diabetes"));
        assertTrue(prompt.contains("Hypertension"));
    }

    @Test
    void build_shouldIncludeAllSources_inPrompt() {
        PatientContextDTO context = getValidContext();
        List<MedicationSourceDTO> sources = getValidSources();

        String prompt = promptBuilder.build(context, sources);

        assertTrue(prompt.contains("Hospital EHR"));
        assertTrue(prompt.contains("Metformin 1000mg twice daily"));
        assertTrue(prompt.contains("Primary Care"));
        assertTrue(prompt.contains("Metformin 500mg twice daily"));
    }

    @Test
    void build_shouldIncludeRecentLabs_inPrompt() {
        PatientContextDTO context = getValidContext();
        List<MedicationSourceDTO> sources = getValidSources();

        String prompt = promptBuilder.build(context, sources);

        assertTrue(prompt.contains("eGFR"));
        assertTrue(prompt.contains("45"));
    }

    @Test
    void build_shouldIncludeJsonResponseFormat_inPrompt() {
        PatientContextDTO context = getValidContext();
        List<MedicationSourceDTO> sources = getValidSources();

        String prompt = promptBuilder.build(context, sources);

        assertTrue(prompt.contains("reconciled_medication"));
        assertTrue(prompt.contains("confidence_score"));
        assertTrue(prompt.contains("clinical_safety_check"));
    }

    // -- Helper methods --

    private PatientContextDTO getValidContext() {
        PatientContextDTO context = new PatientContextDTO();
        context.setAge(67);
        context.setConditions(List.of("Type 2 Diabetes", "Hypertension"));
        context.setRecentLabs(Map.of("eGFR", 45));
        return context;
    }

    private List<MedicationSourceDTO> getValidSources() {
        MedicationSourceDTO source1 = new MedicationSourceDTO();
        source1.setSystem("Hospital EHR");
        source1.setMedication("Metformin 1000mg twice daily");
        source1.setLastUpdated(LocalDate.of(2024, 10, 15));
        source1.setSourceReliability(SourceReliability.HIGH);

        MedicationSourceDTO source2 = new MedicationSourceDTO();
        source2.setSystem("Primary Care");
        source2.setMedication("Metformin 500mg twice daily");
        source2.setLastUpdated(LocalDate.of(2025, 1, 20));
        source2.setSourceReliability(SourceReliability.HIGH);

        return List.of(source1, source2);
    }
}
