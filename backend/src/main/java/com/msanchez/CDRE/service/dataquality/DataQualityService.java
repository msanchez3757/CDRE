package com.msanchez.CDRE.service.dataquality;


import com.msanchez.CDRE.exception.ErrorMessages;
import com.msanchez.CDRE.exception.InvalidPatientRecordException;
import com.msanchez.CDRE.model.dto.AiDataQualityResponse;
import com.msanchez.CDRE.model.dto.DataQualityRequestDTO;
import com.msanchez.CDRE.model.dto.DataQualityResultDTO;
import com.msanchez.CDRE.service.Ai.ClaudeApiClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DataQualityService {

    private static final Logger logger = LoggerFactory.getLogger(DataQualityService.class);

    // Timeliness thresholds in months
    private static final int TIMELINESS_RECENT_THRESHOLD = 3;
    private static final int TIMELINESS_STALE_THRESHOLD = 12;

    private final DataQualityPromptBuilder promptBuilder;
    private final ClaudeApiClient claudeApiClient;
    private final DataQualityResponseParser responseParser;

    public DataQualityService(
            DataQualityPromptBuilder promptBuilder,
            ClaudeApiClient claudeApiClient,
            DataQualityResponseParser responseParser
    ) {
        this.promptBuilder = promptBuilder;
        this.claudeApiClient = claudeApiClient;
        this.responseParser = responseParser;
    }

    public DataQualityResultDTO evaluate(DataQualityRequestDTO request) {

        // -- Programmatic scoring --
        int completenessScore = calculateCompletenessScore(request);
        int timelinessScore = calculateTimelinessScore(request.getLastUpdated());

        logger.info("Programmatic scores — completeness: {}, timeliness: {}", completenessScore, timelinessScore);

        // -- AI scoring for clinical dimensions --
        String prompt = promptBuilder.build(request, completenessScore, timelinessScore);
        String rawResponse = claudeApiClient.send(prompt);
        AiDataQualityResponse aiResponse = responseParser.parse(rawResponse);

        logger.info("AI scores — accuracy: {}, clinical plausibility: {}",
                aiResponse.getAccuracyScore(), aiResponse.getClinicalPlausibilityScore());

        // -- Calculate overall score as weighted average --
        int overallScore = calculateOverallScore(
                completenessScore,
                aiResponse.getAccuracyScore(),
                timelinessScore,
                aiResponse.getClinicalPlausibilityScore()
        );

        // -- Build breakdown map in expected output order --
        Map<String, Integer> breakdown = new LinkedHashMap<>();
        breakdown.put("completeness", completenessScore);
        breakdown.put("accuracy", aiResponse.getAccuracyScore());
        breakdown.put("timeliness", timelinessScore);
        breakdown.put("clinical_plausibility", aiResponse.getClinicalPlausibilityScore());

        return DataQualityResultDTO.builder()
                .overallScore(overallScore)
                .breakdown(breakdown)
                .issuesDetected(aiResponse.getIssuesDetected())
                .build();
    }

    // -- Programmatic scoring methods --

    // Each of the 6 fields is worth ~16-17 points
    // Demographics count as one field since they arrive as a group
    int calculateCompletenessScore(DataQualityRequestDTO request) {
        int score = 0;

        if (request.getDemographics() != null) score += 17;
        if (request.getMedications() != null && !request.getMedications().isEmpty()) score += 17;
        if (request.getAllergies() != null && !request.getAllergies().isEmpty()) score += 17;
        if (request.getConditions() != null && !request.getConditions().isEmpty()) score += 17;
        if (request.getVitalSigns() != null) score += 16;
        if (request.getLastUpdated() != null && !request.getLastUpdated().isBlank()) score += 16;

        return Math.min(score, 100);
    }

    int calculateTimelinessScore(String lastUpdated) {
        if (lastUpdated == null || lastUpdated.isBlank()) {
            return 0;
        }

        try {
            LocalDate updatedDate = LocalDate.parse(lastUpdated);
            long monthsOld = ChronoUnit.MONTHS.between(updatedDate, LocalDate.now());

            if (monthsOld <= TIMELINESS_RECENT_THRESHOLD) return 100;
            if (monthsOld <= 6) return 80;
            if (monthsOld <= TIMELINESS_STALE_THRESHOLD) return 60;
            return 30;

        } catch (DateTimeParseException e) {
            throw new InvalidPatientRecordException(
                    ErrorMessages.DATA_QUALITY_LAST_UPDATED_INVALID.getMessage()
            );
        }
    }

    // Weighted average — all four dimensions weighted equally at 25%
    int calculateOverallScore(int completeness, int accuracy, int timeliness, int clinicalPlausibility) {
        return (completeness + accuracy + timeliness + clinicalPlausibility) / 4;
    }
}
