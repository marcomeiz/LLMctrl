"""
Sentiment Evaluator for LLM Answers

Classifies answers as CRITICAL, WARNING, or OPPORTUNITY based on brand sentiment.
Uses OpenRouter API for LLM-based analysis.
"""

import json
import os
import time
from pathlib import Path
from typing import Dict, List, Optional
import requests

# OpenRouter configuration
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY', '')
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Model recommendation for classification
# openai/gpt-4o-mini - Good balance of accuracy and cost, more consistent than Gemini
DEFAULT_MODEL = "openai/gpt-4o-mini"


def classify_sentiment(
    answer: str,
    brand: str,
    question: str = "",
    mention: bool = True,
    model: str = DEFAULT_MODEL,
    api_key: Optional[str] = None
) -> Dict:
    """
    Classify the sentiment of an answer towards a brand using LLM.

    Args:
        answer: The answer text to analyze
        brand: The brand name to evaluate sentiment for
        question: The original question (for context)
        mention: Whether the brand is mentioned in the answer
        model: OpenRouter model to use
        api_key: OpenRouter API key (uses env var if not provided)

    Returns:
        Dict with 'classification', 'reason', and 'triggers_detected' keys
    """
    key = api_key or OPENROUTER_API_KEY
    if not key:
        raise ValueError("OpenRouter API key not provided. Set OPENROUTER_API_KEY env var.")

    # First, detect language from the first 200 chars of answer
    answer_sample = answer[:200] if len(answer) > 200 else answer

    # Build context about brand mention
    mention_context = ""
    if not mention:
        mention_context = f"""
⚠️ CRITICAL CONTEXT: The brand "{brand}" is NOT mentioned in this answer.

MANDATORY RULE for "no mention" cases:
1. If question contains "avoid", "problem", "issue", "bad", "worst", "stay away" → {brand} NOT being on this negative list = OPPORTUNITY
2. If question directly asks about {brand} specifically → NOT being mentioned = CRITICAL
3. If question is general comparison → NOT being mentioned = WARNING or CRITICAL

EXAMPLE: Question "Which EVs should I avoid?" + {brand} not in answer = OPPORTUNITY (good for {brand})
"""

    prompt = f"""STEP 1 - LANGUAGE DETECTION (CRITICAL):
First, identify the language of this text sample: "{answer_sample}"
You MUST write ALL your responses in THIS SAME LANGUAGE.

STEP 2 - Analyze the following Q&A about the brand "{brand}" and classify it.

QUESTION:
{question}

ANSWER:
{answer}
{mention_context}
CLASSIFICATION RULES:
- OPPORTUNITY: The answer is favorable/positive for {brand}. Recommends it, highlights benefits, presents it well, OR if the question is negative (avoid/problems) and {brand} is NOT mentioned (implicitly positive).
- WARNING: The answer is neutral or mixed. Contains both positives and negatives, or is purely informational without clear stance.
- CRITICAL: The answer is unfavorable/negative for {brand}. Criticizes it, highlights problems, recommends alternatives instead, OR if the question directly asks about {brand} and it's not mentioned.

IMPORTANT - SENTIMENT vs POSITION:
- Focus on the ACTUAL LANGUAGE used to describe {brand}, not just its position in a list.
- Being listed last or in a lower tier with POSITIVE language (e.g., "great for X", "capable", "good value") is NOT negative sentiment.
- CRITICAL requires actual negative statements: criticism, warnings, problems mentioned, or explicit discouragement.
- Position alone does not determine sentiment. A brand can be listed last but still described positively.

IMPORTANT:
- Evaluate the OVERALL sentiment considering BOTH question context AND answer content.
- Consider what NOT being mentioned implies based on the question type.

SOLUTION GROUP (only for WARNING/CRITICAL - use "NONE" for OPPORTUNITY):
Assign ONE group based on what marketing/content solution would address this issue:
- VISIBILITY: Brand is not mentioned where it should appear. Solution: SEO/content to increase brand presence in AI responses.
- SOCIAL_PROOF: Concerns about quality, reliability, user experiences, or trust. Solution: Testimonials, reviews, case studies, PR campaigns.
- COMPETITIVE: Competitor is positioned better, recommended first, or presented as superior. Solution: Comparison content, differentiation messaging.
- NARRATIVE: Outdated, incomplete, or incorrect information that can be corrected with facts. Solution: Updated content with accurate data.
- OPERATIONAL: Real business issues (customer service, availability, pricing, product problems) that cannot be fixed with content alone. Solution: Report to client for internal improvement.

Respond in JSON format. ALL TEXT FIELDS MUST BE IN THE SAME LANGUAGE AS THE ANSWER ABOVE:
{{
  "detected_language": "English/Spanish/French/etc",
  "classification": "CRITICAL/WARNING/OPPORTUNITY",
  "solution_group": "VISIBILITY/SOCIAL_PROOF/COMPETITIVE/NARRATIVE/OPERATIONAL/NONE",
  "reason": "brief reason (max 15 words) - SAME LANGUAGE AS ANSWER",
  "triggers_detected": [
    {{
      "trigger": "problematic phrase or topic",
      "type": "WARNING or CRITICAL",
      "context": "exact quote from answer (max 100 chars)",
      "reason": "why it's problematic - SAME LANGUAGE AS ANSWER"
    }}
  ],
  "psychological_impact": "Detailed analysis (3-5 sentences) - SAME LANGUAGE AS ANSWER. Cover: 1) How user perceives the response, 2) Cognitive biases activated (recency effect, framing, anchoring, social proof, loss aversion), 3) If pros/cons structure leaves user positive or negative, 4) Impact of competitor comparisons, 5) Effect on purchase decision cycle"
}}

CRITICAL RULES:
- triggers_detected: Only for WARNING/CRITICAL. For OPPORTUNITY, use empty array []
- solution_group: Only for WARNING/CRITICAL. For OPPORTUNITY, use "NONE"
- IF THE ANSWER IS IN ENGLISH → ALL fields (reason, trigger reasons, psychological_impact) MUST BE IN ENGLISH
- IF THE ANSWER IS IN SPANISH → ALL fields MUST BE IN SPANISH
- IF THE ANSWER IS IN FRENCH → ALL fields MUST BE IN FRENCH
- NEVER mix languages. Match the answer's language exactly."""

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://github.com/marcomeiz/llm-evaluation-pipeline",
        "X-Title": "LLM Evaluation Pipeline"
    }

    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 800,
        "temperature": 0
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        content = result['choices'][0]['message']['content'].strip()

        # Try to parse JSON response (may be wrapped in markdown code blocks)
        try:
            # Strip markdown code blocks if present
            json_content = content
            if '```json' in content:
                json_content = content.split('```json')[1].split('```')[0].strip()
            elif '```' in content:
                json_content = content.split('```')[1].split('```')[0].strip()

            parsed = json.loads(json_content)
            classification = parsed.get('classification', 'WARNING').upper()
            reason = parsed.get('reason', '')
            triggers = parsed.get('triggers_detected', [])
            psychological_impact = parsed.get('psychological_impact', '')
            solution_group = parsed.get('solution_group', 'NONE').upper()
        except (json.JSONDecodeError, IndexError):
            # Fallback: extract classification from text
            classification = 'WARNING'
            reason = ''
            triggers = []
            psychological_impact = ''
            solution_group = 'NONE'
            for valid in ['CRITICAL', 'WARNING', 'OPPORTUNITY']:
                if valid in content.upper():
                    classification = valid
                    break

        # Validate classification
        if classification not in ['CRITICAL', 'WARNING', 'OPPORTUNITY']:
            for valid in ['CRITICAL', 'WARNING', 'OPPORTUNITY']:
                if valid in classification:
                    classification = valid
                    break
            else:
                classification = 'WARNING'

        # Validate solution_group
        valid_groups = ['VISIBILITY', 'SOCIAL_PROOF', 'COMPETITIVE', 'NARRATIVE', 'OPERATIONAL', 'NONE']
        if solution_group not in valid_groups:
            solution_group = 'NONE'

        # Clear triggers and solution_group for OPPORTUNITY
        if classification == 'OPPORTUNITY':
            triggers = []
            solution_group = 'NONE'

        return {
            'classification': classification,
            'reason': reason,
            'triggers_detected': triggers,
            'psychological_impact': psychological_impact,
            'solution_group': solution_group
        }

    except requests.exceptions.RequestException as e:
        print(f"  API error: {e}")
        return {
            'classification': 'WARNING',
            'reason': 'Error en API',
            'triggers_detected': [],
            'psychological_impact': '',
            'solution_group': 'NONE'
        }


def evaluate(
    input_path: str,
    output_path: str,
    brand: str,
    model: str = DEFAULT_MODEL,
    api_key: Optional[str] = None,
    delay: float = 0.1
) -> List[dict]:
    """
    Evaluate all answers in a classified JSON file.

    Args:
        input_path: Path to input JSON (output from classifier)
        output_path: Path for output JSON with classifications
        brand: Brand name to evaluate sentiment for
        model: OpenRouter model to use
        api_key: OpenRouter API key
        delay: Delay between API calls (rate limiting)

    Returns:
        List of evaluated records
    """
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    evaluated_data = []
    stats = {'CRITICAL': 0, 'WARNING': 0, 'OPPORTUNITY': 0}
    group_stats = {'VISIBILITY': 0, 'SOCIAL_PROOF': 0, 'COMPETITIVE': 0, 'NARRATIVE': 0, 'OPERATIONAL': 0, 'NONE': 0}
    no_mention_count = 0
    no_mention_critical = 0

    print(f"Evaluating {len(data)} answers...")
    print(f"Brand: {brand}")
    print(f"Model: {model}")
    print()

    for i, record in enumerate(data):
        answer = record.get('answer', '')
        question = record.get('question_text', '')
        mention = record.get('mention', False)

        # Always use LLM to classify - it considers question context
        # to determine if "no mention" is good or bad
        result = classify_sentiment(answer, brand, question, mention, model, api_key)
        classification = result['classification']
        reason = result['reason']
        triggers = result['triggers_detected']
        psychological_impact = result['psychological_impact']
        solution_group = result['solution_group']

        if not mention:
            no_mention_count += 1
            if classification == 'CRITICAL':
                no_mention_critical += 1

        time.sleep(delay)  # Rate limiting

        stats[classification] += 1
        group_stats[solution_group] += 1

        # Progress indicator
        if (i + 1) % 10 == 0 or i == len(data) - 1:
            print(f"  Processed: {i + 1}/{len(data)} | "
                  f"CRITICAL: {stats['CRITICAL']} | "
                  f"WARNING: {stats['WARNING']} | "
                  f"OPPORTUNITY: {stats['OPPORTUNITY']}")

        evaluated_record = {
            **record,
            'classification': classification,
            'classification_reason': reason,
            'triggers_detected': triggers,
            'psychological_impact': psychological_impact,
            'solution_group': solution_group
        }
        evaluated_data.append(evaluated_record)

    # Final stats
    total = len(evaluated_data)
    problems = stats['CRITICAL'] + stats['WARNING']
    print(f"\n{'='*50}")
    print(f"EVALUATION COMPLETE")
    print(f"{'='*50}")
    print(f"Total: {total}")
    print(f"  CRITICAL:    {stats['CRITICAL']:3d} ({stats['CRITICAL']/total*100:5.1f}%)")
    print(f"  WARNING:     {stats['WARNING']:3d} ({stats['WARNING']/total*100:5.1f}%)")
    print(f"  OPPORTUNITY: {stats['OPPORTUNITY']:3d} ({stats['OPPORTUNITY']/total*100:5.1f}%)")
    print(f"\n  No mention total: {no_mention_count}")
    print(f"    → CRITICAL: {no_mention_critical}")
    print(f"    → Other (context-aware): {no_mention_count - no_mention_critical}")

    # Solution group stats (only for problems)
    if problems > 0:
        print(f"\n{'='*50}")
        print(f"SOLUTION GROUPS (for {problems} WARNING/CRITICAL)")
        print(f"{'='*50}")
        for group in ['VISIBILITY', 'SOCIAL_PROOF', 'COMPETITIVE', 'NARRATIVE', 'OPERATIONAL']:
            count = group_stats[group]
            if count > 0:
                pct = count / problems * 100
                print(f"  {group:12s}: {count:3d} ({pct:5.1f}%)")

    # Save output
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(evaluated_data, f, ensure_ascii=False, indent=2)
    print(f"\nEvaluated JSON saved to: {output_path}")

    return evaluated_data


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Evaluate LLM answers for brand sentiment')
    parser.add_argument('--input', '-i', required=True, help='Input JSON file (from classifier)')
    parser.add_argument('--output', '-o', required=True, help='Output JSON file')
    parser.add_argument('--brand', '-b', required=True, help='Brand name to evaluate')
    parser.add_argument('--model', '-m', default=DEFAULT_MODEL, help='OpenRouter model')
    parser.add_argument('--api-key', '-k', help='OpenRouter API key (or set OPENROUTER_API_KEY)')
    parser.add_argument('--delay', '-d', type=float, default=0.1, help='Delay between API calls')

    args = parser.parse_args()

    evaluate(
        input_path=args.input,
        output_path=args.output,
        brand=args.brand,
        model=args.model,
        api_key=args.api_key,
        delay=args.delay
    )
