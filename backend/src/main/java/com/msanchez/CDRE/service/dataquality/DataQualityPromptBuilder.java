package com.msanchez.CDRE.service.dataquality;

import com.msanchez.CDRE.model.dto.DataQualityRequestDTO;
import org.springframework.stereotype.Component;

@Component
public class DataQualityPromptBuilder {

    public String build(DataQualityRequestDTO request, int completenessScore, int timelinessScore) {
        StringBuilder prompt = new StringBuilder();

        appendRole(prompt);
        appendPatientRecord(prompt, request);
        appendProgrammaticScores(prompt, completenessScore, timelinessScore);
        appendInstructions(prompt);
        appendResponseFormat(prompt);

        return prompt.toString();
    }

    // -- Private builder methods --

    private void appendRole(StringBuilder prompt) {
        prompt.append("You are a clinical data quality analyst AI assistant.\n\n");
    }

    private void appendPatientRecord(StringBuilder prompt, DataQualityRequestDTO request) {
        prompt.append("PATIENT RECORD TO EVALUATE:\n");

        // Demographics
        if (request.getDemographics() != null) {
            prompt.append("Demographics:\n");
            prompt.append("  - Name: ").append(request.getDemographics().getName()).append("\n");
            prompt.append("  - DOB: ").append(request.getDemographics().getDob()).append("\n");
            prompt.append("  - Gender: ").append(request.getDemographics().getGender()).append("\n");
        }

        // Medications
        if (request.getMedications() != null && !request.getMedications().isEmpty()) {
            prompt.append("Medications: ").append(String.join(", ", request.getMedications())).append("\n");
        } else {
            prompt.append("Medications: none documented\n");
        }

        // Allergies
        if (request.getAllergies() != null && !request.getAllergies().isEmpty()) {
            prompt.append("Allergies: ").append(String.join(", ", request.getAllergies())).append("\n");
        } else {
            prompt.append("Allergies: none documented\n");
        }

        // Conditions
        if (request.getConditions() != null && !request.getConditions().isEmpty()) {
            prompt.append("Conditions: ").append(String.join(", ", request.getConditions())).append("\n");
        } else {
            prompt.append("Conditions: none documented\n");
        }

        // Vital signs
        if (request.getVitalSigns() != null) {
            prompt.append("Vital Signs:\n");
            if (request.getVitalSigns().getBloodPressure() != null) {
                prompt.append("  - Blood Pressure: ").append(request.getVitalSigns().getBloodPressure()).append("\n");
            }
            if (request.getVitalSigns().getHeartRate() != null) {
                prompt.append("  - Heart Rate: ").append(request.getVitalSigns().getHeartRate()).append("\n");
            }
        } else {
            prompt.append("Vital Signs: none documented\n");
        }

        // Last updated
        prompt.append("Last Updated: ").append(
                request.getLastUpdated() != null ? request.getLastUpdated() : "not provided"
        ).append("\n\n");
    }

    private void appendProgrammaticScores(StringBuilder prompt, int completenessScore, int timelinessScore) {
        prompt.append("PRE-CALCULATED SCORES (already computed programmatically):\n");
        prompt.append("- Completeness score: ").append(completenessScore).append("/100\n");
        prompt.append("- Timeliness score: ").append(timelinessScore).append("/100\n\n");
    }

    private void appendInstructions(StringBuilder prompt) {
        prompt.append("INSTRUCTIONS:\n");
        prompt.append("Evaluate the patient record for the following two dimensions only:\n");
        prompt.append("1. Accuracy (0-100): Are the values provided realistic and consistent? ");
        prompt.append("Flag any values that are physiologically implausible (e.g. impossible vital signs).\n");
        prompt.append("2. Clinical Plausibility (0-100): Do the medications, conditions, and vital signs make ");
        prompt.append("clinical sense together? Flag drug-disease mismatches or concerning combinations.\n\n");
        prompt.append("Also identify ALL data quality issues found across ALL dimensions including completeness ");
        prompt.append("and timeliness, with the field name, a clear description, and a severity of low, medium, or high.\n\n");
    }

    private void appendResponseFormat(StringBuilder prompt) {
        prompt.append("You MUST respond with ONLY a valid JSON object in this exact format, no additional text:\n");
        prompt.append("{\n");
        prompt.append("  \"accuracy_score\": <number between 0 and 100>,\n");
        prompt.append("  \"clinical_plausibility_score\": <number between 0 and 100>,\n");
        prompt.append("  \"issues_detected\": [\n");
        prompt.append("    {\n");
        prompt.append("      \"field\": \"<field name>\",\n");
        prompt.append("      \"issue\": \"<description of the issue>\",\n");
        prompt.append("      \"severity\": \"<low, medium, or high>\"\n");
        prompt.append("    }\n");
        prompt.append("  ]\n");
        prompt.append("}");
    }
}
