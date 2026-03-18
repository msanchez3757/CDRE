package com.msanchez.CDRE.recon;

import com.msanchez.CDRE.exception.AiServiceException;
import com.msanchez.CDRE.model.dto.AiReconciliationResponse;
import com.msanchez.CDRE.model.entity.reconciliation.SafetyCheckResult;
import com.msanchez.CDRE.service.Ai.AiResponseParser;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import tools.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.*;

public class AiResponseParserTest {

    private AiResponseParser aiResponseParser;

    @BeforeEach
    void setup() {
        this.aiResponseParser = new AiResponseParser(new ObjectMapper());
    }

    @Test
    void parse_shouldReturnParsedResponse_whenValidJson() {
        AiReconciliationResponse response = aiResponseParser.parse(getValidJson());

        assertNotNull(response);
        assertEquals("Metformin 500mg twice daily", response.getReconciledMedication());
        assertEquals(0.88, response.getConfidenceScore());
        assertEquals(SafetyCheckResult.PASSED, response.getClinicalSafetyCheck());
        assertFalse(response.getRecommendedActions().isEmpty());
    }

    @Test
    void parse_shouldThrowAiServiceException_whenInvalidJson() {
        AiServiceException exception = assertThrows(AiServiceException.class, () ->
                aiResponseParser.parse("this is not valid json"));

        assertEquals("AI service returned an unexpected response", exception.getMessage());
    }

    @Test
    void parse_shouldHandleMarkdownCodeFences_whenPresent() {
        String wrappedJson = "```json\n" + getValidJson() + "\n```";

        AiReconciliationResponse response = aiResponseParser.parse(wrappedJson);

        assertNotNull(response);
        assertEquals("Metformin 500mg twice daily", response.getReconciledMedication());
    }

    @Test
    void parse_shouldThrowAiServiceException_whenEmptyResponse() {
        AiServiceException exception = assertThrows(AiServiceException.class, () ->
                aiResponseParser.parse(""));

        assertEquals("AI service returned an unexpected response", exception.getMessage());
    }

    // -- Helper methods --

    private String getValidJson() {
        return """
                {
                  "reconciled_medication": "Metformin 500mg twice daily",
                  "confidence_score": 0.88,
                  "reasoning": "Primary care record is most recent clinical encounter.",
                  "recommended_actions": ["Update Hospital EHR to 500mg twice daily"],
                  "clinical_safety_check": "PASSED"
                }
                """;
    }
}
