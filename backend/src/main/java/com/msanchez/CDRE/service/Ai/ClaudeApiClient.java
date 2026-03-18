package com.msanchez.CDRE.service.Ai;

import com.msanchez.CDRE.exception.AiServiceException;
import com.msanchez.CDRE.exception.ErrorMessages;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;

@Component
public class ClaudeApiClient {
    private static final Logger logger = LoggerFactory.getLogger(ClaudeApiClient.class);

    private static final String ANTHROPIC_VERSION = "2023-06-01";
    private static final String MODEL = "claude-sonnet-4-20250514";
    private static final int MAX_TOKENS = 1024;

    private final RestClient restClient;

    @Value("${anthropic.api.key}")
    private String apiKey;

    public ClaudeApiClient() {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.anthropic.com/v1")
                .build();
    }

    @Cacheable(value = "reconciliations", key = "#prompt")
    public String send(String prompt) {
        Map<String, Object> requestBody = Map.of(
                "model", MODEL,
                "max_tokens", MAX_TOKENS,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        try {
            logger.info("Sending request to Claude API");

            Map<?, ?> response = restClient.post()
                    .uri("/messages")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", ANTHROPIC_VERSION)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(Map.class);

            return extractText(response);

        } catch (RestClientException e) {
            logger.error("Failed to reach Claude API: {}", e.getMessage());
            throw new AiServiceException(ErrorMessages.AI_SERVICE_DOWN.getMessage());
        }
    }

    // -- Private helpers --

    private String extractText(Map<?, ?> response) {
        if (response == null || !response.containsKey("content")) {
            throw new AiServiceException(ErrorMessages.AI_SERVICE_INVALID_RESPONSE.getMessage());
        }

        List<?> content = (List<?>) response.get("content");
        if (content == null || content.isEmpty()) {
            throw new AiServiceException(ErrorMessages.AI_SERVICE_INVALID_RESPONSE.getMessage());
        }

        Map<?, ?> firstBlock = (Map<?, ?>) content.get(0);
        String text = (String) firstBlock.get("text");

        if (text == null || text.isBlank()) {
            throw new AiServiceException(ErrorMessages.AI_SERVICE_INVALID_RESPONSE.getMessage());
        }

        logger.info("Successfully received response from Claude API");
        return text;
    }
}
