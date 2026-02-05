#!/usr/bin/env python3
"""
Fix ranking_list field by extracting brand mentions in order of appearance from answers.
"""

import json
import re

# Known betting brands/sites to look for
BETTING_BRANDS = [
    # Major UK Bookmakers
    'bet365', 'betfair', 'william hill', 'ladbrokes', 'coral', 'paddy power',
    'betfred', 'sky bet', 'unibet', '888sport', 'betway', 'bwin',
    'boylesports', 'betvictor', 'sportingbet', '32red', 'mansion bet',
    'virgin bet', 'livescore bet', 'midnite', 'kwiff', 'fitzdares',
    'talksport bet', 'betuk', 'parimatch', 'vbet', 'mr green',
    'leovegas', 'casumo', 'rizk', 'novibet', 'spreadex',

    # Exchanges
    'smarkets', 'betdaq', 'matchbook',

    # Matched betting tools
    'oddsmonkey', 'outplayed', 'profit accumulator', 'ai profit',

    # US focused
    'draftkings', 'fanduel', 'caesars', 'pointsbet', 'barstool',

    # Casino focused
    'pokerstars', '888casino', 'betmgm',

    # Others
    'tote', 'totesport', 'betbright', 'sun bets', 'grosvenor',
    'yeti bet', '10bet', 'mrplay', 'netbet',
]

def normalize_brand(brand):
    """Normalize brand name for consistent output."""
    # Remove common suffixes and normalize
    brand = brand.lower().strip()

    # Map variations to canonical names
    mappings = {
        'bet 365': 'bet365',
        'sky betting': 'sky bet',
        'skybet': 'sky bet',
        'paddypower': 'paddy power',
        'williamhill': 'william hill',
        '888 sport': '888sport',
        'odds monkey': 'oddsmonkey',
        'profit acc': 'profit accumulator',
    }

    return mappings.get(brand, brand)

def extract_brands_from_text(text):
    """Extract brand mentions from text in order of first appearance."""
    text_lower = text.lower()
    found_brands = []
    found_positions = {}

    for brand in BETTING_BRANDS:
        # Create pattern to match brand (case insensitive, word boundary)
        pattern = r'\b' + re.escape(brand) + r'\b'
        match = re.search(pattern, text_lower)

        if match:
            normalized = normalize_brand(brand)
            if normalized not in found_positions:
                found_positions[normalized] = match.start()

    # Sort by position of first appearance
    sorted_brands = sorted(found_positions.items(), key=lambda x: x[1])
    found_brands = [brand for brand, pos in sorted_brands]

    return found_brands

def main():
    # Load data
    with open('../src/betfair_enriched.json', 'r', encoding='utf-8') as f:
        records = json.load(f)

    updated_count = 0

    for record in records:
        answer = record.get('answer', '')
        current_ranking = record.get('ranking_list', [])

        # Extract brands from answer
        extracted_brands = extract_brands_from_text(answer)

        # Only update if we found brands and current list is empty or different
        if extracted_brands and (not current_ranking or len(extracted_brands) > len(current_ranking)):
            record['ranking_list'] = extracted_brands
            updated_count += 1

            # Also update mention field if betfair is in the list
            if 'betfair' in extracted_brands:
                record['mention'] = True

    # Save updated data
    with open('../src/betfair_enriched.json', 'w', encoding='utf-8') as f:
        json.dump(records, f, ensure_ascii=False, indent=2)

    print(f"Updated {updated_count} records with extracted ranking lists")

    # Show some examples
    print("\nSample updated records:")
    for record in records[:5]:
        if record.get('ranking_list'):
            print(f"\nID {record['id']}: {record['ranking_list'][:5]}...")

if __name__ == '__main__':
    main()
