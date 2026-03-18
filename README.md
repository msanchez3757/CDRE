# Clinical Data Reconciliation Engine (CDRE)

An AI-powered full-stack application that reconciles conflicting medication records across healthcare systems and validates patient data quality using Anthropic's Claude API.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Running Locally](#running-locally)
- [Running with Docker](#running-with-docker)
- [API Reference](#api-reference)
- [LLM Choice & Prompt Engineering](#llm-choice--prompt-engineering)
- [Architecture & Design Decisions](#architecture--design-decisions)
- [Known Limitations & Trade-offs](#known-limitations--trade-offs)
- [What I'd Improve with More Time](#what-id-improve-with-more-time)

---

## Overview

Healthcare providers often maintain conflicting records about the same patient across different systems. CDRE addresses this by:

- **Medication Reconciliation** — accepts conflicting medication records from multiple sources and uses AI to determine the most clinically accurate medication with a confidence score and reasoning
- **Data Quality Validation** — evaluates a patient record across four dimensions (completeness, accuracy, timeliness, clinical plausibility) and returns a scored report with detected issues

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.x (Java 21) |
| Database | MySQL 8.0 |
| AI | Anthropic Claude (claude-sonnet-4-20250514) |
| Frontend | React + Vite + Tailwind CSS |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
CDRE/                          ← Spring Boot backend
├── src/main/java/
│   ├── controller/            ← REST endpoints
│   ├── service/               ← Business logic
│   │   └── ai/                ← AI subcomponents (prompt builder, client, parser)
│   ├── entity/                ← JPA entities
│   ├── dto/                   ← Request/response shapes
│   ├── repository/            ← Spring Data JPA repositories
│   ├── exception/             ← Global exception handling
│   ├── filter/                ← API key authentication filter
│   └── config/                ← CORS configuration
├── Dockerfile
├── docker-compose.yml
└── .env.example

cdre-frontend/                 ← React frontend
├── src/
│   ├── App.jsx                ← Tab navigation
│   ├── api.js                 ← Centralized API calls
│   └── components/
│       ├── ReconciliationTab.jsx
│       ├── SourceForm.jsx
│       ├── ReconciliationResult.jsx
│       ├── DataQualityTab.jsx
│       └── DataQualityResult.jsx
└── .env.example
```

---

## Running Locally

### Prerequisites

- Java 21
- Maven
- Node.js 18+
- MySQL 8.0 running locally

### Backend

**1. Clone the repository**
```bash
git clone https://github.com/your-username/CDRE.git
cd CDRE
```

**2. Configure environment**

Copy the example properties and fill in your values:
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

Required values in `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_db_name
spring.datasource.username=your_username
spring.datasource.password=your_password
anthropic.api.key=your_anthropic_api_key
api.key=your_chosen_api_key
spring.cache.type=simple
spring.jpa.hibernate.ddl-auto=update
```

**3. Run the backend**
```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend

**1. Navigate to frontend directory**
```bash
cd cdre-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure environment**
```bash
cp .env.example .env
```

Fill in `.env`:
```
VITE_API_KEY=your_chosen_api_key  ← must match api.key in application.properties
```

**4. Run the frontend**
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## Running with Docker

### Prerequisites

- Docker Desktop

### Steps

**1. Configure environment**
```bash
cp .env.example .env
```

Fill in `.env`:
```
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=cdre
MYSQL_USER=cdre_user
MYSQL_PASSWORD=your_password
ANTHROPIC_API_KEY=your_anthropic_api_key
API_KEY=your_chosen_api_key
```

**2. Build and run**
```bash
docker compose up --build
```

This starts both MySQL and the Spring Boot app. MySQL health checks ensure the app waits until the database is ready before starting.

Backend runs on `http://localhost:8080`

> Note: The React frontend is not containerized in this setup. Run it separately with `npm run dev` from the `cdre-frontend` directory.

---

## API Reference

All endpoints require the `X-API-Key` header.

### POST `/api/reconcile/medication`

Reconciles conflicting medication records from multiple sources.

**Request:**
```json
{
  "patient_context": {
    "age": 67,
    "conditions": ["Type 2 Diabetes", "Hypertension"],
    "recent_labs": { "eGFR": 45 }
  },
  "sources": [
    {
      "system": "Hospital EHR",
      "medication": "Metformin 1000mg twice daily",
      "last_updated": "2024-10-15",
      "source_reliability": "high"
    },
    {
      "system": "Primary Care",
      "medication": "Metformin 500mg twice daily",
      "last_updated": "2025-01-20",
      "source_reliability": "high"
    }
  ]
}
```

**Response:** `201 Created`
```json
{
  "request_id": "uuid",
  "reconciled_medication": "Metformin 500mg twice daily",
  "confidence_score": 0.88,
  "reasoning": "Primary care record is most recent...",
  "recommended_actions": ["Update Hospital EHR to 500mg twice daily"],
  "clinical_safety_check": "PASSED",
  "status": "pending"
}
```

---

### POST `/api/validate/data-quality`

Evaluates a patient record for data quality across four dimensions.

**Request:**
```json
{
  "demographics": { "name": "John Doe", "dob": "1955-03-15", "gender": "M" },
  "medications": ["Metformin 500mg", "Lisinopril 10mg"],
  "allergies": [],
  "conditions": ["Type 2 Diabetes"],
  "vital_signs": { "blood_pressure": "340/180", "heart_rate": 72 },
  "last_updated": "2024-06-15"
}
```

**Response:** `200 OK`
```json
{
  "overall_score": 55,
  "breakdown": {
    "completeness": 83,
    "accuracy": 20,
    "timeliness": 30,
    "clinical_plausibility": 75
  },
  "issues_detected": [
    {
      "field": "vital_signs.blood_pressure",
      "issue": "Blood pressure 340/180 is physiologically implausible",
      "severity": "high"
    }
  ]
}
```

---

## LLM Choice & Prompt Engineering

### Why Anthropic Claude

Claude was chosen for its strong performance on structured clinical reasoning tasks and its reliable JSON output when explicitly instructed. The assessment explicitly listed it as an option, and its ability to reason about medical context (lab values, drug dosing, clinical plausibility) made it well suited for this domain.

### Prompt Engineering Approach

**Medication Reconciliation prompt** is structured in four sections:
1. **Role** — establishes Claude as a clinical pharmacist AI to ground its reasoning in medical context
2. **Patient context** — age, conditions, and lab values so Claude can factor in clinical appropriateness (e.g. dose reduction for reduced kidney function)
3. **Sources** — each source listed with system name, medication, reliability, and date so Claude can weigh recency and trustworthiness
4. **Response format** — instructs Claude to return only a JSON object with exact field names, preventing markdown wrapping or conversational preamble

**Data Quality prompt** uses a hybrid approach — completeness and timeliness scores are calculated programmatically and passed into the prompt as pre-computed values. Claude is only asked to evaluate accuracy and clinical plausibility, which require medical reasoning. This minimizes API token usage while ensuring the dimensions that need clinical intelligence are handled by the model.

Both prompts use `AiResponseParser` to strip accidental markdown code fences before JSON deserialization, since Claude occasionally wraps JSON in backticks despite being instructed not to.

---

## Architecture & Design Decisions

### Hybrid AI + Programmatic Scoring (Data Quality)
Rather than asking Claude to compute all four data quality dimensions, completeness and timeliness are scored programmatically — they are pure logic (field presence checks and date arithmetic) that does not benefit from AI reasoning. Claude handles only accuracy and clinical plausibility where medical knowledge is genuinely needed. This reduces API costs and makes those two dimensions deterministic and testable.

### AI Service Decomposition
The AI layer is split into three focused components rather than a single monolithic service:
- `ReconciliationPromptBuilder` / `DataQualityPromptBuilder` — prompt construction only
- `ClaudeApiClient` — HTTP communication only
- `AiResponseParser` / `DataQualityResponseParser` — JSON parsing only

This means each class has one reason to change. Swapping AI providers only requires touching `ClaudeApiClient`. Updating a prompt only requires touching the relevant builder.

### Response Caching
`@Cacheable` is applied on `ClaudeApiClient.send()` using the prompt string as the cache key. Caching at this level (rather than on the service method) avoids Spring's self-invocation proxy bypass issue and ensures identical requests never incur an API call.

### HIPAA-Conscious Data Storage
Patient context is stored as a de-identified audit snapshot — age, conditions, and lab values — with no patient identifier. These fields individually are not HIPAA-protected identifiers. In a production system, a full PHI review, BAA with infrastructure providers, and encryption at rest would be required before storing any additional patient fields.

### Approve/Reject Architecture
`ReconciliationRecord` includes a `status` field (`PENDING`, `APPROVED`, `REJECTED`) and `reviewedAt` timestamp built in from the start. The `updateStatus` method exists in `ReconciliationService` but is not exposed as an endpoint since the assessment limits the API to two endpoints. This would be the first thing added in a follow-up iteration.

---

## Known Limitations & Trade-offs

**Approve/Reject is UI-only** — clicking approve or reject updates local React state but does not persist to the database since no review endpoint was implemented (the assessment restricts the API to two endpoints). In production this would be a `PATCH /api/reconcile/{id}/review` endpoint.

**`wasSelected` flag uses string matching** — the source record flagged as selected is determined by comparing the source medication string against Claude's reconciled medication. If Claude slightly rephrases the medication name the match will fail. A more robust approach would ask Claude to return the index of the selected source.

**In-memory cache** — `spring.cache.type=simple` uses an in-memory cache that is cleared on restart and is not shared across instances. For production, Redis would be more appropriate.

**Frontend not containerized** — the React frontend runs separately from the Docker stack. A production setup would serve the built React app from an Nginx container or deploy it to a CDN.

---

## What I'd Improve with More Time

- **`PATCH /api/reconcile/{id}/review`** — expose the approve/reject functionality as a proper endpoint so clinician decisions are persisted
- **Redis caching** — replace the in-memory cache with Redis for persistence across restarts and horizontal scalability
- **Confidence score calibration** — factor in source reliability weights, recency scores, and consensus across sources into a more sophisticated confidence algorithm rather than relying solely on Claude's self-reported score
- **Duplicate record detection** — detect when two sources are reporting the same underlying record (e.g. same medication, similar dates) before sending to reconciliation
- **Frontend containerization** — add an Nginx container to serve the built React app as part of the Docker Compose stack
- **Integration tests** — add `@SpringBootTest` tests that test the full request lifecycle against a test database
- **Pagination** — add pagination to any future list endpoints for reconciliation history
