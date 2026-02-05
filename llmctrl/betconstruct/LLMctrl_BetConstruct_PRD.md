# LLMctrl — Product Definition (BetConstruct PoC)

## 1) What this product is
LLMctrl monitors how Large Language Models (ChatGPT/Gemini/Claude/etc.) talk about a brand, and turns those answers into business signals:
- **BOOSTING**: increases trust/authority or strengthens the buying case
- **FRICTION**: creates adoption barriers (cost/complexity/implementation burden) without a clear competitor “winner”
- **COMPETITIVE_LOSS**: a competitor (or competitor category) is positioned as better on a specific criterion
- **RISK_SIGNAL**: real legal/ethical/security red flags (not generic “operator responsibility” disclaimers)
- **NEUTRAL**: factual/industry-standard info with no meaningful push/pull
- **NO_MENCIONA_LA_MARCA**: the response does not refer to the brand

This PoC uses BetConstruct data, but the system must be brand-agnostic.

## 2) Inputs
### Source records (current)
Each record includes:
- id
- business_question_id
- question_text
- answer
- created_at

## 3) Output (what we store and show)
For each record:
- presence: EXPLICIT | ABSENT
- business_label: BOOSTING | FRICTION | COMPETITIVE_LOSS | RISK_SIGNAL | NEUTRAL | NO_MENCIONA_LA_MARCA
- secondary_label:
  - COMPARATIVA_DESFAVORABLE (explicit competitor mentioned)
  - COMPARATIVA_DESFAVORABLE_GENERIC (generic competitor framing: “other platforms”, “modular”, “turnkey”, etc.)
- competitors[]: list of competitors detected (can be empty)
- trigger_positive[] / trigger_negative[]: short evidence strings (for UI explainability)

## 4) Decision rules (the “Marco calibration”)
### 4.1 Risk is STRICT
RISK_SIGNAL only when there are true red flags:
- scam/fraud/illegal/unlicensed/sanctions/investigation/lawsuit/criminal/money laundering
OR the question is explicitly about red flags and the answer indicates issues beyond “no major issues”.

Generic disclaimers like:
- “operator is responsible”
- “do due diligence”
- “ensure compliance”
…must remain **NEUTRAL**.

### 4.2 Competitive loss is criterion-based
If the response is framed as a comparison (explicit “vs” or generic “other platforms/competitors/modular/turnkey”) AND the text suggests BetConstruct is worse on that criterion (pricing transparency, startup-friendliness, speed to market, support, CRM depth, flexibility, etc.) → COMPETITIVE_LOSS.

### 4.3 Friction is adoption burden
If the response highlights adoption barriers without an explicit/generic comparison winner:
- high cost, complex integration, long setup, migration downtime, technical team required
- mixed “good but…” structure pointing to operational hurdles
→ FRICTION.

### 4.4 Boosting is clean positives
If the response highlights positives (innovation, partnerships, global presence, scalability, awards) without meaningful disadvantages → BOOSTING.

### 4.5 Neutral is factual / balanced / industry-standard
If it’s factual, balanced, or industry-standard responsibility statements → NEUTRAL.

## 5) Data model (recommended)
### Table: analyses
- analysis_id (uuid, pk)
- brand_id (uuid)
- source (enum: chatgpt/gemini/claude/web/human)
- question_text (text)
- answer (text)
- created_at (timestamptz)
- presence (enum)
- business_label (enum)
- secondary_label (enum, nullable)
- competitors (text[])  -- or jsonb
- trigger_positive (text[])
- trigger_negative (text[])
- raw_record_id (text)  -- maps to original
- model_version (text)  -- e.g., ruleset v1.0

Indexes:
- (brand_id, created_at)
- (brand_id, business_label)
- GIN index on competitors if stored as array/jsonb

## 6) API (minimal for dashboard)
### POST /analyze
Input: {brand, question_text, answer, created_at, source}
Output: analysis object (same as stored)

### GET /brand/{brand_id}/summary?from=...&to=...
Returns:
- counts by business_label
- counts by competitor
- trend series (daily/weekly) by label

### GET /brand/{brand_id}/items?label=...&competitor=...&q=...
Returns paginated items with evidence.

## 7) Dashboard (MVP screens)
### 7.1 Overview
- Total items, % brand mentioned
- Breakdown by business_label (stacked bar / donut)
- Trend over time (line) for BOOSTING vs COMPETITIVE_LOSS vs RISK_SIGNAL

### 7.2 Competitive Pressure
- Competitor frequency (top N)
- “Competitive loss” items list with competitor filter

### 7.3 Commercial Friction
- List of FRICTION items
- Common friction themes (keywords): price, complexity, time-to-market, onboarding

### 7.4 Risk Watch
- RISK_SIGNAL items (should be low volume, high importance)
- Severity tags (future)

### 7.5 Explainability drill-down
Click an item → show:
- question_text
- answer
- business_label
- detected competitors
- trigger_positive/negative evidence

## 8) Acceptance criteria (Definition of Done)
- Dev can ingest the provided calibrated CSV/JSONL and render all dashboard screens above.
- Filters work: label, competitor, free-text search.
- Every row can be opened and shows evidence strings.
- Summary counts match the dataset counts.
- System supports multiple brands (brand_id).

## 9) Files delivered for this BetConstruct run
- betconstruct_llm_reputation_classified_calibrated.csv
- betconstruct_llm_reputation_classified_calibrated.jsonl
