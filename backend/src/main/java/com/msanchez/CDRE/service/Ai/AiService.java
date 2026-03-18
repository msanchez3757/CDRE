package com.msanchez.CDRE.service.Ai;

import com.msanchez.CDRE.model.dto.AiReconciliationResponse;
import com.msanchez.CDRE.model.dto.MedicationSourceDTO;
import com.msanchez.CDRE.model.dto.PatientContextDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AiService {
    private static final Logger logger = LoggerFactory.getLogger(AiService.class);

    private final ReconciliationPromptBuilder promptBuilder;
    private final ClaudeApiClient claudeApiClient;
    private final AiResponseParser responseParser;

    public AiService(
            ReconciliationPromptBuilder promptBuilder,
            ClaudeApiClient claudeApiClient,
            AiResponseParser responseParser
    ) {
        this.promptBuilder = promptBuilder;
        this.claudeApiClient = claudeApiClient;
        this.responseParser = responseParser;
    }

    public AiReconciliationResponse reconcileMedication(
            PatientContextDTO patientContext,
            List<MedicationSourceDTO> sources
    ) {
        logger.info("Building reconciliation prompt for {} sources", sources.size());
        String prompt = promptBuilder.build(patientContext, sources);

        logger.info("Sending prompt to Claude API");
        String rawResponse = claudeApiClient.send(prompt);

        logger.info("Parsing Claude API response");
        return responseParser.parse(rawResponse);
    }

}
