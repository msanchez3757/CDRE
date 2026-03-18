package com.msanchez.CDRE.service.Ai;

import com.msanchez.CDRE.exception.AiServiceException;
import com.msanchez.CDRE.exception.ErrorMessages;
import com.msanchez.CDRE.model.dto.AiReconciliationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
public class AiResponseParser {
    private static final Logger logger = LoggerFactory.getLogger(AiResponseParser.class);

    private final ObjectMapper objectMapper;

    public AiResponseParser(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public AiReconciliationResponse parse(String rawResponse) {
        try {
            String cleaned = clean(rawResponse);
            return objectMapper.readValue(cleaned, AiReconciliationResponse.class);
        } catch (Exception e) {
            logger.error("Failed to parse Claude API response: {}", e.getMessage());
            throw new AiServiceException(ErrorMessages.AI_SERVICE_INVALID_RESPONSE.getMessage());
        }
    }

    // -- Private helpers --

    // Strips any accidental markdown code fences Claude may have added
    // despite being instructed to return only JSON
    private String clean(String rawResponse) {
        return rawResponse
                .replace("```json", "")
                .replace("```", "")
                .trim();
    }
}
