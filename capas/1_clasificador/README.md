# LLM Answer Classifier & Evaluator

Classifies LLM evaluation questions and evaluates answer sentiment for brands.

## Project Structure

```
1_clasificador/
├── classifier.py          # Categorizes questions, extracts brands, citations
├── evaluator.py           # Classifies sentiment (CRITICAL/WARNING/OPPORTUNITY)
├── brand_config.py        # YAML configuration loader
├── brands_config.yaml     # Brand/industry configuration
├── README.md
└── data/
    ├── betfair/           # Betfair data files
    │   ├── betfair_llm_evaluation_ES.xlsx
    │   ├── betfair_es_answers.json
    │   └── betfair_es_answers_classified.json
    └── byd/               # BYD data files
        ├── byd_llm_evaluation_UK.xlsx
        ├── byd_uk_answers.json
        └── byd_uk_answers_classified.json
```

## Requirements

```bash
pip install pandas openpyxl spacy requests pyyaml
python -m spacy download es_core_news_sm  # Spanish
python -m spacy download en_core_web_sm   # English
```

## Usage

### Step 1: Classify

```bash
# Process by brand (uses default paths in data/<brand>/)
python classifier.py -b betfair
python classifier.py -b byd

# Or with custom paths
python classifier.py -b betfair \
    --excel data/betfair/custom.xlsx \
    --json data/betfair/answers.json \
    --output data/betfair/classified.json
```

### Step 2: Evaluate Sentiment

```bash
export OPENROUTER_API_KEY="sk-or-v1-..."

python evaluator.py \
    -i data/betfair/betfair_es_answers_classified.json \
    -o data/betfair/betfair_es_evaluated.json \
    -b Betfair
```

### As Module

```python
from classifier import classify
from evaluator import evaluate

# Step 1: Classify
classify(
    excel_path="data/betfair/betfair_llm_evaluation_ES.xlsx",
    json_path="data/betfair/betfair_es_answers.json",
    output_path="data/betfair/betfair_es_classified.json"
)

# Step 2: Evaluate
evaluate(
    input_path="data/betfair/betfair_es_classified.json",
    output_path="data/betfair/betfair_es_evaluated.json",
    brand="Betfair",
    api_key="sk-or-v1-..."
)
```

## Input Files

### Excel File

Must have sheets named with categories. Each sheet should have a column named `Question` or `Pregunta`.

### JSON File

PHPMyAdmin export format with `question_text` and `answer` fields.

## Output

Final JSON with all enrichment fields:

```json
[
  {
    "id": "1",
    "question_text": "Is BYD good?",
    "answer": "...",
    "category": 2,
    "category_name": "Brand Questions",
    "mention": true,
    "ranking_list": ["BYD", "Tesla", "Hyundai"],
    "position": 1,
    "citations": ["Wikipedia", "Reuters"],
    "classification": "WARNING",
    "classification_reason": "Menciona pros y contras sin clara recomendación",
    "triggers_detected": [
      {
        "trigger": "slow withdrawal",
        "type": "WARNING",
        "context": "Los retiros pueden tardar 2-5 días",
        "reason": "Tiempo de espera puede generar frustración"
      }
    ]
  }
]
```

| Field | Script | Type | Description |
|-------|--------|------|-------------|
| `category` | classifier | int | Category ID (1-N) |
| `category_name` | classifier | string | Category name |
| `mention` | classifier | bool | Brand mentioned in answer |
| `ranking_list` | classifier | list[str] | Brands ordered by appearance |
| `position` | classifier | int/null | Brand position in ranking |
| `citations` | classifier | list[str] | Sources cited |
| `classification` | evaluator | string | CRITICAL / WARNING / OPPORTUNITY |
| `classification_reason` | evaluator | string | Brief reason for classification (in answer's language) |
| `triggers_detected` | evaluator | list[obj] | Problematic triggers (only for WARNING/CRITICAL) |
| `psychological_impact` | evaluator | string | Psychological analysis of how the answer affects user perception |

### triggers_detected structure

| Field | Type | Description |
|-------|------|-------------|
| `trigger` | string | Problematic phrase or topic identified |
| `type` | string | WARNING or CRITICAL |
| `context` | string | Direct quote from answer (max 100 chars) |
| `reason` | string | Why this is problematic for the brand |

## Classification Logic

| Condition | Result | Description |
|-----------|--------|-------------|
| `mention = false` | CRITICAL 🔴 | Brand not mentioned (auto) |
| Positive answer | OPPORTUNITY 🟢 | Favorable for brand |
| Neutral/mixed | WARNING 🟡 | Neither positive nor negative |
| Negative answer | CRITICAL 🔴 | Unfavorable for brand |

## Evaluator Model

Default: `google/gemini-2.0-flash-lite-001`

- Very cheap (~$0.001 per 269 answers)
- Fast
- Good for classification

Change with `--model`:
```bash
python evaluator.py ... --model anthropic/claude-3-haiku
```

## Detection Features

### Brand Detection
Auto-extracted from Excel title (e.g., `"BETFAIR ESPAÑA"` → `Betfair`)

### Ranking List
All brands ordered by first appearance in answer (includes main brand)

### Citations
Sources detected via regex: domain names, source names on own lines, URLs

### Matching
1. Exact match (normalized)
2. Fuzzy match (85% threshold)

## API Reference

### classifier.py

- `classify(excel_path, json_path, output_path)` - Main classification
- `extract_brand_from_excel(path)` - Get brand from Excel
- `detect_brands_in_text(text, brand, competitors, lang)` - Find brands
- `build_ranking_list(text, brand, others)` - Build ordered ranking
- `extract_citations(text)` - Extract sources

### evaluator.py

- `evaluate(input_path, output_path, brand, model, api_key)` - Main evaluation
- `classify_sentiment(answer, brand, model, api_key)` - Single answer

## Tested With

| Dataset | Records | Mentions | Position 1 | Citations |
|---------|---------|----------|------------|-----------|
| Betfair ES | 269 | 87.4% | 72.5% | 91.4% |
| BYD UK | 264 | 85.2% | 70.8% | 98.9% |
