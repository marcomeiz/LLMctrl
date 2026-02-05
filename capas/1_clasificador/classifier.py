"""
Category Classifier for LLM Evaluation Questions

This script enriches a JSON file with category information extracted from an Excel file.
Works with any language as it uses exact text matching.
"""

import json
import os
import pandas as pd
import re
import requests
import spacy
from difflib import SequenceMatcher
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple

# OpenRouter configuration (shared with evaluator)
OPENROUTER_API_KEY = os.environ.get('OPENROUTER_API_KEY', '')
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
LLM_MODEL = "google/gemini-2.0-flash-lite-001"

# Cache for LLM-generated competitors (avoid repeated API calls)
_llm_competitors_cache: Dict[str, Set[str]] = {}

# Import brand configuration (use try/except for backward compatibility)
try:
    from brand_config import (
        get_competitors, get_ignore_terms, get_non_source_domains,
        is_valid_citation_domain, get_language, is_brand_configured,
        detect_industry_from_keywords, get_industry_ignore_terms
    )
    HAS_BRAND_CONFIG = True
except ImportError:
    HAS_BRAND_CONFIG = False

FUZZY_THRESHOLD = 0.85  # Minimum similarity ratio for fuzzy matching

# Lazy-loaded spaCy models
_nlp_models: Dict[str, spacy.Language] = {}


def get_competitors_from_llm(
    brand: str,
    industry: str,
    country: str,
    api_key: Optional[str] = None
) -> Set[str]:
    """
    Get competitors for a brand by asking an LLM.

    This is used when a brand is not pre-configured in YAML, allowing
    the system to work with any brand without manual configuration.

    Args:
        brand: The brand name
        industry: Industry/market (e.g., 'automotive', 'betting')
        country: Country/market (e.g., 'Spain', 'UK', 'USA')
        api_key: OpenRouter API key (uses env var if not provided)

    Returns:
        Set of competitor brand names
    """
    # Check cache first
    cache_key = f"{brand}|{industry}|{country}".lower()
    if cache_key in _llm_competitors_cache:
        return _llm_competitors_cache[cache_key]

    key = api_key or OPENROUTER_API_KEY
    if not key:
        print(f"  Warning: No OpenRouter API key - cannot get competitors from LLM")
        return set()

    prompt = f"""List the 15-20 main competitors of {brand} in the {industry} market in {country}.

IMPORTANT:
- Return ONLY brand/company names, one per line
- No explanations, no numbers, no descriptions
- Just the competitor names

Example format:
CompetitorA
CompetitorB
CompetitorC"""

    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": 0.3,  # Low temperature for consistent results
        "max_tokens": 500
    }

    try:
        response = requests.post(OPENROUTER_URL, headers=headers, json=payload, timeout=30)
        response.raise_for_status()

        result = response.json()
        content = result['choices'][0]['message']['content'].strip()

        # Parse response: split by newlines and clean up
        competitors = set()
        for line in content.split('\n'):
            line = line.strip()
            # Skip empty lines, lines with numbers, or lines with explanatory text
            if line and not line[0].isdigit() and len(line) < 50 and ':' not in line:
                # Remove any bullet points or dashes at the start
                line = re.sub(r'^[-•*]\s*', '', line)
                if line and line.lower() != brand.lower():
                    competitors.add(line)

        # Cache the result
        _llm_competitors_cache[cache_key] = competitors
        print(f"  LLM returned {len(competitors)} competitors for {brand} in {country}")

        return competitors

    except Exception as e:
        print(f"  Warning: Failed to get competitors from LLM: {e}")
        return set()


def normalize_question(text: str) -> str:
    """
    Normalize question text for flexible matching.
    Removes trailing punctuation and extra whitespace.
    """
    text = text.strip()
    # Remove trailing punctuation (?, !, ., etc.)
    text = re.sub(r'[?!.,;:]+$', '', text)
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()


def extract_brand_from_excel(excel_path: str) -> str:
    """
    Extract brand name from Excel file title.

    Looks at the first column header of the first sheet, which typically contains
    the brand name in formats like:
    - "BATERÍA DE EVALUACIÓN LLM - BETFAIR ESPAÑA"
    - "BYD LLM EVALUATION - QUESTION BATTERY"

    Args:
        excel_path: Path to the Excel file

    Returns:
        Brand name (e.g., "Betfair", "BYD")
    """
    xl = pd.ExcelFile(excel_path)
    df = pd.read_excel(xl, xl.sheet_names[0])

    # Get first column header (contains the title)
    title = str(df.columns[0]).upper()

    # Common words to exclude when looking for brand (normalized without accents)
    exclude_words = {
        'BATERIA', 'EVALUACION', 'EVALUATION', 'LLM', 'LLMS',
        'QUESTION', 'QUESTIONS', 'BATTERY', 'PREGUNTAS',
        'ESPANA', 'SPAIN', 'UK', 'MARKET', 'MERCADO',
        'DE', 'THE', 'FOR', 'IN', 'EN', 'AND', 'Y', 'OR', 'O',
        'A', 'AN', 'EL', 'LA', 'LOS', 'LAS'
    }

    # Normalize accents for comparison
    def remove_accents(text: str) -> str:
        replacements = {
            'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
            'Ñ': 'N', 'Ü': 'U'
        }
        for acc, plain in replacements.items():
            text = text.replace(acc, plain)
        return text

    # Split by common delimiters and spaces
    words = re.split(r'[\s\-–—]+', title)
    words = [w.strip() for w in words if w.strip()]

    for word in words:
        word_normalized = remove_accents(word)
        if word_normalized not in exclude_words and len(word) > 1:
            # Return with proper capitalization
            return word.capitalize()

    # Fallback: return first meaningful word
    return words[0].capitalize() if words else "Unknown"


def check_brand_mention(text: str, brand: str) -> bool:
    """
    Check if brand is mentioned in the text (case insensitive).

    Args:
        text: Text to search in (typically the answer)
        brand: Brand name to look for

    Returns:
        True if brand is mentioned, False otherwise
    """
    if not text or not brand:
        return False
    return brand.lower() in text.lower()


def build_ranking_list(
    text: str,
    main_brand: str,
    other_brands: List[str]
) -> Tuple[List[str], Optional[int]]:
    """
    Build a ranking list of all brands ordered by first appearance in text.

    Args:
        text: Text to analyze
        main_brand: The main brand
        other_brands: List of other brands detected in the text

    Returns:
        Tuple of (ranking_list, position):
        - ranking_list: All brands ordered by first appearance
        - position: Position of main brand (1-indexed) or None if not mentioned
    """
    if not text:
        return [], None

    text_lower = text.lower()
    brand_positions = []

    # Find position of main brand
    if main_brand:
        main_pos = text_lower.find(main_brand.lower())
        if main_pos != -1:
            brand_positions.append((main_brand, main_pos))

    # Find positions of all other brands
    for brand in other_brands:
        pos = text_lower.find(brand.lower())
        if pos != -1:
            brand_positions.append((brand, pos))

    # Sort by position of first appearance
    brand_positions.sort(key=lambda x: x[1])

    # Build ranking list
    ranking_list = [brand for brand, _ in brand_positions]

    # Find position of main brand in ranking
    position = None
    if main_brand:
        main_brand_lower = main_brand.lower()
        for i, brand in enumerate(ranking_list, start=1):
            if brand.lower() == main_brand_lower:
                position = i
                break

    return ranking_list, position


def extract_citations(text: str) -> List[str]:
    """
    Extract citations/sources from answer text.

    Detects patterns like:
    - "SourceName\n" (source on its own line)
    - "SourceName\n+N" (source with reference count)
    - Domain names (e.g., "example.com", "support.betfair.es")

    Args:
        text: Answer text to analyze

    Returns:
        List of unique citation sources found
    """
    if not text:
        return []

    citations = set()

    # Common section headers to exclude (not citations)
    section_headers = {
        'pros', 'cons', 'ventajas', 'desventajas', 'nota', 'note', 'notes',
        'tips', 'tip', 'warning', 'conclusion', 'conclusión', 'resumen',
        'summary', 'example', 'ejemplo', 'important', 'importante',
        'alternativas', 'alternatives', 'opciones', 'options'
    }

    # Non-sources to exclude (social media, generic platforms)
    # Load from configuration if available
    if HAS_BRAND_CONFIG:
        non_sources = get_non_source_domains()
        # Add non-domain versions too
        non_sources = non_sources | {d.replace('.com', '').replace('.org', '') for d in non_sources}
    else:
        non_sources = {
            'facebook', 'facebook.com', 'youtube', 'youtube.com', 'twitter',
            'twitter.com', 'x.com', 'instagram', 'instagram.com', 'tiktok',
            'tiktok.com', 'reddit', 'reddit.com', 'linkedin', 'linkedin.com',
            'pinterest', 'pinterest.com', 'whatsapp', 'telegram'
        }

    # Common words that indicate a phrase, not a source name
    # Note: 'the' is NOT included because many legitimate sources start with "The"
    # (e.g., "The Sun", "The AA", "The Electric Car Scheme")
    sentence_indicators = {
        'you', 'i', 'we', 'they', 'he', 'she', 'it', 'this', 'that',
        'a', 'an', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'do',
        'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
        'must', 'can', 'if', 'when', 'where', 'what', 'why', 'how', 'which',
        'there', 'here', 'some', 'any', 'all', 'most', 'many', 'few', 'no',
        'not', 'only', 'also', 'just', 'even', 'still', 'already', 'always',
        'never', 'often', 'sometimes', 'usually', 'generally', 'typically'
    }

    def is_valid_source(source: str) -> bool:
        """Check if a string looks like a valid source name."""
        source_lower = source.lower()

        # Check against exclusion lists
        if source_lower in section_headers or source_lower in non_sources:
            return False

        # Check if starts with sentence indicator (likely a phrase, not a source)
        first_word = source_lower.split()[0] if source.split() else ''
        if first_word in sentence_indicators:
            return False

        # Too many words = likely a sentence (sources typically 1-4 words)
        word_count = len(source.split())
        if word_count > 5:
            return False

        # Contains sentence-ending punctuation inside = likely not a source
        if '.' in source[:-1] and not re.search(r'\.(com|org|net|uk|es|co|io|info|gov|edu)', source_lower):
            # Has internal period but not a domain
            return False

        # Starts with emoji or number
        if source[0] in '✔❌⚖📈🚗💡⚠🔁🏦🧠🔌🔋🚙🚘🏎️⚡🤔👉💶👍📊📌🧾🎯🧩🥇🤝' or source[0].isdigit():
            return False

        return True

    # Pattern 1: Source followed by newline and +N (e.g., "Wikipedia\n+2")
    pattern_plus = re.findall(r'[\.\!\?\)]\s*\n([A-Za-z][A-Za-z0-9\.\-\' ]{2,45}?)\n\+\d+', text)
    for match in pattern_plus:
        source = match.strip()
        if len(source) >= 3 and is_valid_source(source):
            citations.add(source)

    # Pattern 2: Domain-like sources (e.g., "support.betfair.es", "racingpost.com")
    pattern_domain = re.findall(r'[\.\!\?\)]\s*\n([a-zA-Z][a-zA-Z0-9\-]*\.[a-zA-Z0-9\.\-]+)\n', text)
    for match in pattern_domain:
        source = match.strip()
        # Must have at least one dot and valid TLD pattern
        if len(source) >= 5 and '.' in source and is_valid_source(source):
            citations.add(source)

    # Pattern 3: Capitalized source names on their own line (single line, no extra content)
    pattern_source = re.findall(r'[\.\!\?\)]\s*\n([A-Z][A-Za-z0-9\.\-\' ]{2,40})\n(?![A-Za-z\+])', text)
    for match in pattern_source:
        source = match.strip()
        if len(source) >= 3 and '\n' not in source and is_valid_source(source):
            citations.add(source)

    # Pattern 4: URLs - extract domain (but filter non-sources)
    urls = re.findall(r'https?://([^\s/\)]+)', text)
    for url in urls:
        if is_valid_source(url):
            citations.add(url)

    return sorted(citations)


def get_nlp_model(lang: str) -> spacy.Language:
    """
    Get spaCy model for the specified language (lazy loading).

    Args:
        lang: Language code ('es' or 'en')

    Returns:
        Loaded spaCy model
    """
    if lang not in _nlp_models:
        model_name = 'es_core_news_sm' if lang == 'es' else 'en_core_web_sm'
        try:
            _nlp_models[lang] = spacy.load(model_name)
        except OSError:
            raise RuntimeError(
                f"spaCy model '{model_name}' not found. "
                f"Install with: python -m spacy download {model_name}"
            )
    return _nlp_models[lang]


def extract_competitors_from_excel(excel_path: str) -> Set[str]:
    """
    Extract competitor names from the comparative sheet in Excel.

    Args:
        excel_path: Path to the Excel file

    Returns:
        Set of competitor names
    """
    xl = pd.ExcelFile(excel_path)
    competitors = set()

    for sheet in xl.sheet_names:
        if 'compet' in sheet.lower():
            df = pd.read_excel(xl, sheet)
            # Look for Competidor/Competitor column
            for col in ['Competidor', 'Competitor']:
                if col in df.columns:
                    for val in df[col].dropna():
                        if isinstance(val, str) and val.strip():
                            competitors.add(val.strip())

    return competitors


def detect_brands_in_text(
    text: str,
    main_brand: str,
    known_competitors: Set[str],
    lang: str = 'es',
    industry: Optional[str] = None
) -> List[str]:
    """
    Detect brand mentions in text using known competitors list.

    WHITELIST APPROACH: Only brands from the known_competitors list are detected.
    NER is used to validate matches, not to discover new brands (too many false positives).

    Args:
        text: Text to analyze
        main_brand: Main brand to exclude from results
        known_competitors: Set of known competitor names
        lang: Language code for NER model
        industry: Optional industry for filtering (not used in whitelist approach)

    Returns:
        List of detected brand names (excluding main brand)
    """
    if not text:
        return []

    detected = set()
    text_lower = text.lower()
    main_brand_lower = main_brand.lower()

    # WHITELIST APPROACH: Only check for known competitors
    # This eliminates false positives from NER (leagues, regulators, generic terms)
    for comp in known_competitors:
        comp_lower = comp.lower()
        # Skip if it's the main brand
        if comp_lower == main_brand_lower:
            continue
        # Use word boundaries to avoid matching substrings (e.g., "Ford" in "affordable")
        pattern = r'\b' + re.escape(comp_lower) + r'\b'
        if re.search(pattern, text_lower):
            detected.add(comp)

    return sorted(detected)


def fuzzy_match(
    query: str,
    candidates: Dict[str, Tuple[int, str]],
    threshold: float = FUZZY_THRESHOLD
) -> Tuple[Tuple[int, str], float]:
    """
    Find the best fuzzy match for a query among candidates.

    Args:
        query: Normalized question text to match
        candidates: Dict mapping normalized questions to (category_id, category_name)
        threshold: Minimum similarity ratio (0-1)

    Returns:
        Tuple of ((category_id, category_name), similarity_ratio) or ((0, 'Unknown'), 0) if no match
    """
    best_match = (0, 'Unknown')
    best_ratio = 0.0

    query_lower = query.lower()
    for candidate, cat_info in candidates.items():
        ratio = SequenceMatcher(None, query_lower, candidate.lower()).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = cat_info

    if best_ratio >= threshold:
        return best_match, best_ratio
    return (0, 'Unknown'), 0.0


def load_categories_from_excel(excel_path: str, category_sheets: List[str]) -> Dict[str, Tuple[int, str]]:
    """
    Extract question -> category mapping from Excel sheets.

    Args:
        excel_path: Path to the Excel file
        category_sheets: List of sheet names that contain categories

    Returns:
        Dictionary mapping question text to (category_id, category_name)
    """
    xl = pd.ExcelFile(excel_path)
    question_to_category = {}

    for idx, sheet_name in enumerate(category_sheets, start=1):
        if sheet_name not in xl.sheet_names:
            print(f"Warning: Sheet '{sheet_name}' not found in Excel")
            continue

        df = pd.read_excel(xl, sheet_name)

        # Find column containing questions (look for 'Pregunta', 'Question', or similar)
        question_col = None
        for col in df.columns:
            col_str = str(col).lower()
            if col_str == 'pregunta' or col_str == 'question':
                question_col = col
                break

        if question_col is None:
            # Try finding partial match
            for col in df.columns:
                col_str = str(col).lower()
                if 'pregunta' in col_str or 'question' in col_str:
                    question_col = col
                    break

        if question_col is None:
            # Try the last column as fallback
            question_col = df.columns[-1]

        # Extract category name (remove number prefix like "1. ")
        category = sheet_name
        if '. ' in sheet_name:
            category = sheet_name.split('. ', 1)[1]

        # Map each question to this category (id, name)
        # Skip rows where question looks like a header (e.g., "Nº", "NaN", etc.)
        for question in df[question_col].dropna():
            if isinstance(question, str):
                q = question.strip()
                # Skip header-like values
                if q and q.lower() not in ['nº', 'no', 'num', 'pregunta', 'question']:
                    # Use normalized version as key for flexible matching
                    normalized = normalize_question(q)
                    question_to_category[normalized] = (idx, category)

    return question_to_category


def enrich_json_with_categories(
    json_path: str,
    question_to_category: Dict[str, Tuple[int, str]],
    brand: str,
    competitors: Set[str],
    lang: str = 'es',
    output_path: Optional[str] = None,
    excel_path: Optional[str] = None
) -> List[dict]:
    """
    Add category, mention, ranking_list, and position fields to each entry in the JSON file.

    Args:
        json_path: Path to the input JSON file
        question_to_category: Mapping from question text to (category_id, category_name)
        brand: Brand name to check for mentions
        competitors: Set of known competitor names (from Excel)
        lang: Language code for NER ('es' or 'en')
        output_path: Path for output file (optional)
        excel_path: Path to Excel file (for industry detection)

    Returns:
        Enriched data list
    """
    detected_industry = None

    # Merge competitors from Excel with competitors from YAML config (if available)
    if HAS_BRAND_CONFIG:
        if is_brand_configured(brand):
            yaml_competitors = get_competitors(brand)
            competitors = competitors | yaml_competitors
            yaml_lang = get_language(brand)
            if yaml_lang:
                lang = yaml_lang
            print(f"  Using brand config for '{brand}': {len(yaml_competitors)} YAML competitors merged")
        else:
            # Brand not configured - try to detect industry and get competitors from LLM
            if excel_path:
                detected_industry = detect_industry_from_keywords(excel_path)
                if detected_industry:
                    print(f"  Brand '{brand}' not configured, detected industry: {detected_industry}")
                    print(f"  Applying {detected_industry} industry filters")

                    # Detect country from Excel filename or language
                    excel_name = excel_path.lower()
                    if '_es' in excel_name or 'españa' in excel_name or 'spain' in excel_name:
                        country = 'Spain'
                    elif '_uk' in excel_name or 'uk' in excel_name:
                        country = 'UK'
                    elif '_us' in excel_name or 'usa' in excel_name:
                        country = 'USA'
                    elif '_de' in excel_name or 'germany' in excel_name:
                        country = 'Germany'
                    elif '_fr' in excel_name or 'france' in excel_name:
                        country = 'France'
                    elif lang == 'es':
                        country = 'Spain'
                    elif lang == 'en':
                        country = 'UK'  # Default English to UK
                    else:
                        country = 'global'

                    # Get competitors from LLM
                    llm_competitors = get_competitors_from_llm(brand, detected_industry, country)
                    if llm_competitors:
                        competitors = competitors | llm_competitors
                        print(f"  Merged {len(llm_competitors)} LLM competitors for {brand} in {country}")

    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Handle PHPMyAdmin export format
    enriched_data = []
    unmatched_count = 0
    mention_count = 0
    ranking_list_count = 0
    citations_count = 0
    all_detected_brands: Dict[str, int] = {}
    all_citations: Dict[str, int] = {}
    position_stats: Dict[int, int] = {}  # position -> count

    for item in data:
        if item.get('type') == 'table' and 'data' in item:
            for record in item['data']:
                question_text = record.get('question_text', '').strip()
                answer_text = record.get('answer', '').strip()
                normalized = normalize_question(question_text)

                # Try exact match first
                cat_info = question_to_category.get(normalized)

                # Fall back to fuzzy match if no exact match
                if cat_info is None:
                    cat_info, ratio = fuzzy_match(normalized, question_to_category)
                    if cat_info[0] != 0:
                        print(f"  Fuzzy match ({ratio:.0%}): '{question_text[:50]}...'")

                if cat_info[0] == 0:
                    unmatched_count += 1

                # Check brand mention in answer
                mention = check_brand_mention(answer_text, brand)
                if mention:
                    mention_count += 1

                # Detect other brands in answer
                other_brands = detect_brands_in_text(answer_text, brand, competitors, lang, detected_industry)

                # Build ranking list ordered by position (includes main brand)
                ranking_list, position = build_ranking_list(answer_text, brand, other_brands)
                if ranking_list:
                    ranking_list_count += 1
                    for b in ranking_list:
                        if b.lower() != brand.lower():  # Don't count main brand
                            all_detected_brands[b] = all_detected_brands.get(b, 0) + 1
                if position is not None:
                    position_stats[position] = position_stats.get(position, 0) + 1

                # Extract citations from answer
                citations = extract_citations(answer_text)
                if citations:
                    citations_count += 1
                    for c in citations:
                        all_citations[c] = all_citations.get(c, 0) + 1

                enriched_record = {
                    **record,
                    'category': cat_info[0],
                    'category_name': cat_info[1],
                    'mention': mention,
                    'ranking_list': ranking_list,
                    'position': position,
                    'citations': citations
                }
                enriched_data.append(enriched_record)

    if unmatched_count > 0:
        print(f"Warning: {unmatched_count} questions could not be matched to a category")

    total = len(enriched_data)
    print(f"  Brand mentions: {mention_count}/{total} ({mention_count/total*100:.1f}%)")
    print(f"  Answers with ranking list: {ranking_list_count}/{total} ({ranking_list_count/total*100:.1f}%)")
    print(f"  Answers with citations: {citations_count}/{total} ({citations_count/total*100:.1f}%)")

    # Show top detected brands
    if all_detected_brands:
        print("\n  Top other brands detected:")
        for brand_name, count in sorted(all_detected_brands.items(), key=lambda x: -x[1])[:10]:
            print(f"    - {brand_name}: {count}")

    # Show position stats
    if position_stats:
        print("\n  Brand position distribution:")
        for pos in sorted(position_stats.keys()):
            count = position_stats[pos]
            print(f"    - Position {pos}: {count} ({count/total*100:.1f}%)")

    # Show top citations
    if all_citations:
        print("\n  Top citations:")
        for citation, count in sorted(all_citations.items(), key=lambda x: -x[1])[:10]:
            print(f"    - {citation}: {count}")

    # Save if output path provided
    if output_path:
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(enriched_data, f, ensure_ascii=False, indent=2)
        print(f"Enriched JSON saved to: {output_path}")

    return enriched_data


def classify(
    excel_path: str,
    json_path: str,
    output_path: str,
    category_sheets: Optional[List[str]] = None
) -> List[dict]:
    """
    Main classification function.

    Args:
        excel_path: Path to Excel file with categories
        json_path: Path to JSON file with questions/answers
        output_path: Path for enriched output JSON
        category_sheets: List of sheet names to use as categories (auto-detected if None)

    Returns:
        List of enriched records
    """
    # Auto-detect category sheets if not provided
    if category_sheets is None:
        xl = pd.ExcelFile(excel_path)
        # Exclude common non-category sheets
        exclude = ['resumen', 'summary', 'plantilla', 'template', 'instructions']
        category_sheets = [
            s for s in xl.sheet_names
            if not any(exc in s.lower() for exc in exclude)
        ]

    print(f"Using category sheets: {category_sheets}")

    # Extract brand from Excel
    brand = extract_brand_from_excel(excel_path)
    print(f"Detected brand: {brand}")

    # Extract competitors from Excel
    competitors = extract_competitors_from_excel(excel_path)
    print(f"Detected competitors: {len(competitors)} ({', '.join(sorted(competitors)[:5])}{'...' if len(competitors) > 5 else ''})")

    # Detect language from Excel filename or sheet names
    xl = pd.ExcelFile(excel_path)
    lang = 'es' if any('español' in s.lower() or 'resumen' in s.lower() for s in xl.sheet_names) else 'en'
    # Also check filename
    if '_ES' in excel_path or '_es' in excel_path:
        lang = 'es'
    elif '_UK' in excel_path or '_EN' in excel_path or '_en' in excel_path:
        lang = 'en'
    print(f"Detected language: {lang}")

    # Load categories
    question_to_category = load_categories_from_excel(excel_path, category_sheets)
    print(f"Loaded {len(question_to_category)} questions with categories")

    # Show category distribution
    categories = {}
    for cat_id, cat_name in question_to_category.values():
        key = (cat_id, cat_name)
        categories[key] = categories.get(key, 0) + 1
    print("\nCategory distribution:")
    for (cat_id, cat_name), count in sorted(categories.items()):
        print(f"  - [{cat_id}] {cat_name}: {count} questions")

    # Enrich JSON
    enriched = enrich_json_with_categories(
        json_path, question_to_category, brand, competitors, lang, output_path, excel_path
    )
    print(f"\nTotal records enriched: {len(enriched)}")

    return enriched


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Classify LLM answers by category')
    parser.add_argument('--brand', '-b', required=True, choices=['betfair', 'byd'],
                        help='Brand to process (betfair or byd)')
    parser.add_argument('--excel', '-e', help='Custom Excel file path (optional)')
    parser.add_argument('--json', '-j', help='Custom JSON file path (optional)')
    parser.add_argument('--output', '-o', help='Custom output file path (optional)')

    args = parser.parse_args()

    # Default paths based on brand
    script_dir = Path(__file__).parent
    data_dir = script_dir / "data" / args.brand

    if args.brand == 'betfair':
        excel_file = args.excel or str(data_dir / "betfair_llm_evaluation_ES.xlsx")
        json_file = args.json or str(data_dir / "betfair_es_answers.json")
        output_file = args.output or str(data_dir / "betfair_es_answers_classified.json")
    else:  # byd
        excel_file = args.excel or str(data_dir / "byd_llm_evaluation_UK.xlsx")
        json_file = args.json or str(data_dir / "byd_uk_answers.json")
        output_file = args.output or str(data_dir / "byd_uk_answers_classified.json")

    # Run classification
    classify(
        excel_path=excel_file,
        json_path=json_file,
        output_path=output_file
    )
