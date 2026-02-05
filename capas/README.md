# LLM Evaluation Pipeline

Modular pipeline for processing and evaluating LLM responses.

## Architecture

```
[Input: Excel + JSON]
         │
         ▼
┌────────────────────────────────────────┐
│          1_clasificador/               │
│  ┌──────────────┐  ┌───────────────┐   │
│  │ classifier.py│→ │ evaluator.py  │   │
│  └──────────────┘  └───────────────┘   │
│   category, mention    classification  │
│   ranking, citations   (LLM sentiment) │
└────────────────────────────────────────┘
         │
         ▼
[Output: Enriched JSON]
```

## Quick Start

```bash
cd 1_clasificador

# Step 1: Classify
python classifier.py

# Step 2: Evaluate sentiment
export OPENROUTER_API_KEY="sk-or-v1-..."
python evaluator.py -i output.json -o evaluated.json -b "BrandName"
```

## Output Fields

| Field | Source | Description |
|-------|--------|-------------|
| `category` | classifier | Category ID |
| `category_name` | classifier | Category name |
| `mention` | classifier | Brand mentioned |
| `ranking_list` | classifier | Brands by appearance order |
| `position` | classifier | Brand position in ranking |
| `citations` | classifier | Sources cited |
| `classification` | evaluator | CRITICAL / WARNING / OPPORTUNITY |
| `classification_reason` | evaluator | Brief reason (in answer's language) |
| `triggers_detected` | evaluator | Problematic triggers (WARNING/CRITICAL only) |
| `psychological_impact` | evaluator | How answer affects user perception/decision |

## Requirements

```bash
pip install pandas openpyxl spacy requests
python -m spacy download es_core_news_sm
python -m spacy download en_core_web_sm
```

See [1_clasificador/README.md](1_clasificador/README.md) for detailed documentation.
