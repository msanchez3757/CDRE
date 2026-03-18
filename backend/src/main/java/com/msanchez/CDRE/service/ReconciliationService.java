package com.msanchez.CDRE.service;

import com.msanchez.CDRE.exception.ErrorMessages;
import com.msanchez.CDRE.exception.InsufficientSourcesException;
import com.msanchez.CDRE.exception.InvalidMedicationSourceException;
import com.msanchez.CDRE.exception.ReconciliationNotFoundException;
import com.msanchez.CDRE.model.dto.AiReconciliationResponse;
import com.msanchez.CDRE.model.dto.MedicationSourceDTO;
import com.msanchez.CDRE.model.dto.ReconcileRequestDTO;
import com.msanchez.CDRE.model.dto.ReconciliationResultDTO;
import com.msanchez.CDRE.model.entity.reconciliation.MedicationSourceRecord;
import com.msanchez.CDRE.model.entity.reconciliation.ReconciliationRecord;
import com.msanchez.CDRE.model.entity.reconciliation.ReconciliationStatus;
import com.msanchez.CDRE.repository.ReconciliationRecordRepository;
import com.msanchez.CDRE.service.Ai.AiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.Instant;
import java.util.List;

@Service
public class ReconciliationService {
    private static final Logger logger = LoggerFactory.getLogger(ReconciliationService.class);

    private final ReconciliationRecordRepository reconciliationRecordRepository;
    private final AiService aiService;
    private final ObjectMapper objectMapper;

    public ReconciliationService(
            ReconciliationRecordRepository reconciliationRecordRepository,
            AiService aiService,
            ObjectMapper objectMapper
    ) {
        this.reconciliationRecordRepository = reconciliationRecordRepository;
        this.aiService = aiService;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ReconciliationResultDTO reconcile(ReconcileRequestDTO request) {

        // -- Business rule validation --
        validateSources(request.getSources());

        // -- Call AI service --
        logger.info("Requesting AI reconciliation for {} sources", request.getSources().size());
        AiReconciliationResponse aiResponse = aiService.reconcileMedication(
                request.getPatientContext(),
                request.getSources()
        );

        // -- Build and persist the reconciliation record --
        ReconciliationRecord record = buildReconciliationRecord(request, aiResponse);
        reconciliationRecordRepository.save(record);
        logger.info("Saved reconciliation record with id: {}", record.getId());

        // -- Map to response DTO --
        return mapToResultDTO(record);
    }

    @Transactional
    public ReconciliationResultDTO updateStatus(Long id, ReconciliationStatus newStatus) {
        ReconciliationRecord record = reconciliationRecordRepository.findById(id)
                .orElseThrow(() -> new ReconciliationNotFoundException(
                        ErrorMessages.RECONCILIATION_NOT_FOUND.getMessage()
                ));

        record.setStatus(newStatus);
        record.setReviewedAt(Instant.now());
        reconciliationRecordRepository.save(record);

        logger.info("Reconciliation record {} updated to status: {}", id, newStatus);
        return mapToResultDTO(record);
    }

    // -- Validation --

    private void validateSources(List<MedicationSourceDTO> sources) {
        if (sources.size() < 2) {
            throw new InsufficientSourcesException(
                    ErrorMessages.RECONCILIATION_INSUFFICIENT_SOURCES.getMessage()
            );
        }

        for (MedicationSourceDTO source : sources) {
            if (source.getLastUpdated() == null && source.getLastFilled() == null) {
                throw new InvalidMedicationSourceException(
                        ErrorMessages.RECONCILIATION_INVALID_SOURCE.getMessage()
                );
            }
        }
    }

    // -- Mapping --

    private ReconciliationRecord buildReconciliationRecord(
            ReconcileRequestDTO request,
            AiReconciliationResponse aiResponse
    ) {
        // Snapshot the patient context for audit — no identifying info stored
        String conditionsSnapshot = request.getPatientContext().getConditions() != null
                ? String.join(", ", request.getPatientContext().getConditions())
                : null;

        String recentLabsSnapshot = serializeLabsSnapshot(request.getPatientContext().getRecentLabs());

        ReconciliationRecord record = ReconciliationRecord.builder()
                .patientAge(request.getPatientContext().getAge())
                .patientConditions(conditionsSnapshot)
                .recentLabsSnapshot(recentLabsSnapshot)
                .reconciledMedication(aiResponse.getReconciledMedication())
                .confidenceScore(aiResponse.getConfidenceScore())
                .reasoning(aiResponse.getReasoning())
                .recommendedActions(aiResponse.getRecommendedActions())
                .safetyCheckResult(aiResponse.getClinicalSafetyCheck())
                .build();

        // Wire up child source records with bidirectional relationship
        for (MedicationSourceDTO sourceDTO : request.getSources()) {
            MedicationSourceRecord sourceRecord = MedicationSourceRecord.builder()
                    .systemName(sourceDTO.getSystem())
                    .medication(sourceDTO.getMedication())
                    .lastUpdated(sourceDTO.getLastUpdated())
                    .lastFilled(sourceDTO.getLastFilled())
                    .sourceReliability(sourceDTO.getSourceReliability())
                    .wasSelected(sourceDTO.getMedication()
                            .equalsIgnoreCase(aiResponse.getReconciledMedication()))
                    .build();

            record.addSource(sourceRecord);
        }

        return record;
    }

    private ReconciliationResultDTO mapToResultDTO(ReconciliationRecord record) {
        return ReconciliationResultDTO.builder()
                .requestId(record.getId())
                .reconciledMedication(record.getReconciledMedication())
                .confidenceScore(record.getConfidenceScore())
                .reasoning(record.getReasoning())
                .recommendedActions(record.getRecommendedActions())
                .clinicalSafetyCheck(record.getSafetyCheckResult())
                .status(record.getStatus())
                .build();
    }

    private String serializeLabsSnapshot(java.util.Map<String, Object> recentLabs) {
        if (recentLabs == null || recentLabs.isEmpty()) return null;
        try {
            return objectMapper.writeValueAsString(recentLabs);
        } catch (Exception e) {
            logger.warn("Failed to serialize recent labs snapshot, storing null");
            return null;
        }
    }
}
