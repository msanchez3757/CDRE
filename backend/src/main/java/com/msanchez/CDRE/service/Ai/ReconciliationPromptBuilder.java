package com.msanchez.CDRE.service.Ai;

import com.msanchez.CDRE.model.dto.MedicationSourceDTO;
import com.msanchez.CDRE.model.dto.PatientContextDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ReconciliationPromptBuilder {

    public String build(PatientContextDTO patientContext, List<MedicationSourceDTO> sources) {
        StringBuilder prompt = new StringBuilder();

        appendRole(prompt);
        appendPatientContext(prompt, patientContext);
        appendSources(prompt, sources);
        appendInstructions(prompt);
        appendResponseFormat(prompt);

        return prompt.toString();
    }

    // -- Private builder methods --

    private void appendRole(StringBuilder prompt) {
        prompt.append("You are a clinical pharmacist AI assistant helping reconcile conflicting medication records.\n\n");
    }

    private void appendPatientContext(StringBuilder prompt, PatientContextDTO patientContext) {
        prompt.append("PATIENT CONTEXT:\n");
        prompt.append("- Age: ").append(patientContext.getAge()).append("\n");

        if (patientContext.getConditions() != null && !patientContext.getConditions().isEmpty()) {
            prompt.append("- Conditions: ")
                    .append(String.join(", ", patientContext.getConditions()))
                    .append("\n");
        }

        if (patientContext.getRecentLabs() != null && !patientContext.getRecentLabs().isEmpty()) {
            prompt.append("- Recent Labs: ");
            patientContext.getRecentLabs().forEach((key, value) ->
                    prompt.append(key).append(": ").append(value).append(" "));
            prompt.append("\n");
        }

        prompt.append("\n");
    }

    private void appendSources(StringBuilder prompt, List<MedicationSourceDTO> sources) {
        prompt.append("CONFLICTING MEDICATION SOURCES:\n");

        for (int i = 0; i < sources.size(); i++) {
            MedicationSourceDTO source = sources.get(i);
            prompt.append(i + 1).append(". System: ").append(source.getSystem()).append("\n");
            prompt.append("   Medication: ").append(source.getMedication()).append("\n");
            prompt.append("   Reliability: ").append(source.getSourceReliability().getValue()).append("\n");

            if (source.getLastUpdated() != null) {
                prompt.append("   Last Updated: ").append(source.getLastUpdated()).append("\n");
            }
            if (source.getLastFilled() != null) {
                prompt.append("   Last Filled: ").append(source.getLastFilled()).append("\n");
            }
        }

        prompt.append("\n");
    }

    private void appendInstructions(StringBuilder prompt) {
        prompt.append("INSTRUCTIONS:\n");
        prompt.append("Analyze the conflicting records and determine the most likely accurate medication.\n");
        prompt.append("Consider: source reliability, recency of records, and clinical plausibility given the patient context.\n");
        prompt.append("Flag any clinical safety concerns (e.g. contraindications given lab values or conditions).\n\n");
    }

    private void appendResponseFormat(StringBuilder prompt) {
        prompt.append("You MUST respond with ONLY a valid JSON object in this exact format, no additional text:\n");
        prompt.append("{\n");
        prompt.append("  \"reconciled_medication\": \"<medication name and dosage>\",\n");
        prompt.append("  \"confidence_score\": <number between 0.0 and 1.0>,\n");
        prompt.append("  \"reasoning\": \"<clinical reasoning for the decision>\",\n");
        prompt.append("  \"recommended_actions\": [\"<action 1>\", \"<action 2>\"],\n");
        prompt.append("  \"clinical_safety_check\": \"<PASSED, WARNING, or FAILED>\"\n");
        prompt.append("}");
    }
}
