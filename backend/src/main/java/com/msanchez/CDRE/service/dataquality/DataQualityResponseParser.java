package com.msanchez.CDRE.service.dataquality;

import com.msanchez.CDRE.exception.AiServiceException;
import com.msanchez.CDRE.exception.ErrorMessages;
import com.msanchez.CDRE.model.dto.AiDataQualityResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

@Component
public class DataQualityResponseParser {

    private static final Logger logger = LoggerFactory.getLogger(DataQualityResponseParser.class);

    private final ObjectMapper objectMapper;

    public DataQualityResponseParser(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public AiDataQualityResponse parse(String rawResponse) {
        try {
            String cleaned = rawResponse
                    .replace("```json", "")
                    .replace("```", "")
                    .trim();

            return objectMapper.readValue(cleaned, AiDataQualityResponse.class);
        } catch (Exception e) {
            logger.error("Failed to parse Claude data quality response: {}", e.getMessage());
            throw new AiServiceException(ErrorMessages.AI_SERVICE_INVALID_RESPONSE.getMessage());
        }
    }
}
