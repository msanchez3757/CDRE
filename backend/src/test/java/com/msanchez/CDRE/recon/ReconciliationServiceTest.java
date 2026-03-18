package com.msanchez.CDRE.recon;

import com.msanchez.CDRE.exception.InsufficientSourcesException;
import com.msanchez.CDRE.exception.InvalidMedicationSourceException;
import com.msanchez.CDRE.model.dto.*;
import com.msanchez.CDRE.model.entity.reconciliation.ReconciliationRecord;
import com.msanchez.CDRE.model.entity.reconciliation.SafetyCheckResult;
import com.msanchez.CDRE.model.entity.reconciliation.SourceReliability;
import com.msanchez.CDRE.repository.ReconciliationRecordRepository;
import com.msanchez.CDRE.service.Ai.AiService;
import com.msanchez.CDRE.service.ReconciliationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

public class ReconciliationServiceTest {

    @Mock
    private ReconciliationRecordRepository reconciliationRecordRepository;

    @Mock
    private AiService aiService;

    private ReconciliationService reconciliationService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
        this.reconciliationService = new ReconciliationService(
                reconciliationRecordRepository,
                aiService,
                new ObjectMapper()
        );
    }

    @Test
    void reconcile_shouldThrowInsufficientSourcesException_whenLessThanTwoSources() {
        ReconcileRequestDTO request = getValidRequest();
        request.getSources().remove(1);

        InsufficientSourcesException exception = assertThrows(InsufficientSourcesException.class, () ->
                reconciliationService.reconcile(request));

        assertEquals(exception.getMessage(), "At least two medication sources are required to perform reconciliation");
    }

    @Test
    void reconcile_shouldThrowInvalidMedicationSourceException_whenSourceHasNoDate() {
        ReconcileRequestDTO request = getValidRequest();
        request.getSources().get(0).setLastUpdated(null);
        request.getSources().get(0).setLastFilled(null);

        InvalidMedicationSourceException exception = assertThrows(InvalidMedicationSourceException.class, () ->
                reconciliationService.reconcile(request));

        assertEquals(exception.getMessage(), "Medication source must have either last_updated or last_filled date");
    }

    @Test
    void reconcile_shouldReturnResult_whenValidRequest() {
        ReconcileRequestDTO request = getValidRequest();

        when(aiService.reconcileMedication(any(), any())).thenReturn(getValidAiResponse());
        when(reconciliationRecordRepository.save(any(ReconciliationRecord.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ReconciliationResultDTO result = reconciliationService.reconcile(request);

        assertNotNull(result);
        assertEquals("Metformin 500mg twice daily", result.getReconciledMedication());
        assertEquals(0.88, result.getConfidenceScore());
        assertEquals(SafetyCheckResult.PASSED, result.getClinicalSafetyCheck());
    }

    // -- Helper methods --

    private ReconcileRequestDTO getValidRequest() {
        PatientContextDTO context = new PatientContextDTO();
        context.setAge(67);
        context.setConditions(List.of("Type 2 Diabetes", "Hypertension"));
        context.setRecentLabs(Map.of("eGFR", 45));

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

        ReconcileRequestDTO request = new ReconcileRequestDTO();
        request.setPatientContext(context);
        request.setSources(new java.util.ArrayList<>(List.of(source1, source2)));

        return request;
    }

    private AiReconciliationResponse getValidAiResponse() {
        AiReconciliationResponse response = new AiReconciliationResponse();
        response.setReconciledMedication("Metformin 500mg twice daily");
        response.setConfidenceScore(0.88);
        response.setReasoning("Primary care record is most recent clinical encounter.");
        response.setRecommendedActions(List.of("Update Hospital EHR to 500mg twice daily"));
        response.setClinicalSafetyCheck(SafetyCheckResult.PASSED);
        return response;
    }
}
