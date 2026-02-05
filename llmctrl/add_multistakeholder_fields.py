#!/usr/bin/env python3
"""
RADARIA Multi-stakeholder Fields Processor
Adds department, block, responsible_role, model, tags, and pain_points to JSON
Per Miguel's specification for multi-stakeholder selling strategy
"""

import json
import re
from typing import Dict, List, Optional, Tuple

# ============================================================================
# CATEGORIZATION RULES
# ============================================================================

DEPARTMENT_RULES = [
    # Modelos específicos (prioridad alta)
    {'keywords': ['ev6', 'ev-6'], 'dept': 'MODELO_EV6'},
    {'keywords': ['ev9', 'ev-9'], 'dept': 'MODELO_EV9'},
    {'keywords': ['ev3', 'ev-3'], 'dept': 'MODELO_EV3'},
    {'keywords': ['sportage'], 'dept': 'MODELO_SPORTAGE'},
    {'keywords': ['sorento'], 'dept': 'MODELO_SORENTO'},
    {'keywords': ['niro'], 'dept': 'MODELO_NIRO'},
    {'keywords': ['stinger'], 'dept': 'MODELO_STINGER'},
    {'keywords': ['ceed', 'proceed', 'xceed'], 'dept': 'MODELO_CEED'},
    {'keywords': ['picanto'], 'dept': 'MODELO_PICANTO'},
    {'keywords': ['seltos'], 'dept': 'MODELO_SELTOS'},

    # Departamentos funcionales
    {'keywords': ['after-sales', 'after sales', 'service center', 'service centre', 'dealer', 'dealership',
                  'customer service', 'customer support', 'warranty claim', 'maintenance', 'servicing'],
     'dept': 'POSTVENTA'},

    {'keywords': ['battery', 'batteries', 'charging', 'charger', 'charge time', 'range anxiety',
                  'kwh', 'v2l', 'v2g', 'charging speed', 'fast charge', 'home charge'],
     'dept': 'BATERÍA_Y_CARGA'},

    {'keywords': ['safety', 'safe', 'ncap', 'crash test', 'airbag', 'adas', 'collision',
                  'blind spot', 'lane assist', 'emergency brake'],
     'dept': 'SEGURIDAD'},

    {'keywords': ['engine', 'motor', 'horsepower', 'hp', 'bhp', 'torque', 'acceleration',
                  '0-60', '0-100', 'top speed', 'performance', 'power output'],
     'dept': 'MOTOR_Y_RENDIMIENTO'},

    {'keywords': ['price', 'pricing', 'cost', 'value', 'money', 'worth', 'afford', 'budget',
                  'financing', 'finance', 'lease', 'leasing', 'monthly payment', 'discount',
                  'offer', 'deal', 'cheap', 'expensive', 'renting'],
     'dept': 'PRECIO_Y_VALOR'},

    {'keywords': ['technology', 'tech', 'screen', 'display', 'infotainment', 'software',
                  'app', 'connected', 'ota', 'update', 'carplay', 'android auto'],
     'dept': 'TECNOLOGÍA'},

    {'keywords': ['design', 'interior', 'exterior', 'space', 'trunk', 'boot', 'cargo',
                  'seat', 'seating', 'legroom', 'headroom', 'comfort'],
     'dept': 'DISEÑO_Y_ESPACIO'},

    {'keywords': ['brand', 'reputation', 'image', 'perception', 'korean', 'quality perception',
                  'badge', 'prestige', 'premium'],
     'dept': 'MARCA_Y_REPUTACIÓN'},

    {'keywords': ['reliable', 'reliability', 'problem', 'issue', 'break down', 'breakdown',
                  'defect', 'recall', 'fault', 'long-term', 'durability'],
     'dept': 'FIABILIDAD'},

    {'keywords': ['warranty', '7 year', '7-year', 'seven year', 'guarantee'],
     'dept': 'GARANTÍA'},
]

BLOCK_KEYWORDS = {
    '4_TRANSACCIONAL': ['buy', 'purchase', 'where to buy', 'order', 'book', 'reserve',
                        'offer', 'discount', 'financing', 'finance', 'lease', 'renting',
                        'test drive', 'dealer near', 'showroom'],
    '2_COMPARATIVAS': ['vs', 'versus', 'better than', 'compared to', 'or the', ' or ',
                       'comparison', 'competitor', 'alternative'],
    '3_COMERCIALES': ['best car', 'best suv', 'best electric', 'best ev', 'recommend',
                      'which car', 'should i', 'what car', 'good choice', 'worth buying'],
    '5_MODELOS_ESPECÍFICOS': ['ev6', 'ev9', 'ev3', 'sportage', 'sorento', 'niro', 'stinger',
                              'ceed', 'proceed', 'xceed', 'picanto', 'seltos', 'carnival'],
}

RESPONSIBLE_MAP = {
    'POSTVENTA': 'Director de Postventa / Customer Experience',
    'BATERÍA_Y_CARGA': 'Director Técnico EV',
    'SEGURIDAD': 'Director de Producto',
    'MOTOR_Y_RENDIMIENTO': 'Director Técnico',
    'PRECIO_Y_VALOR': 'Director Comercial',
    'TECNOLOGÍA': 'Director de Producto / IT',
    'DISEÑO_Y_ESPACIO': 'Director de Diseño',
    'MODELO_EV6': 'Product Manager EV6',
    'MODELO_EV9': 'Product Manager EV9',
    'MODELO_EV3': 'Product Manager EV3',
    'MODELO_SPORTAGE': 'Product Manager Sportage',
    'MODELO_SORENTO': 'Product Manager Sorento',
    'MODELO_NIRO': 'Product Manager Niro',
    'MODELO_STINGER': 'Product Manager Stinger',
    'MODELO_CEED': 'Product Manager Ceed Range',
    'MODELO_PICANTO': 'Product Manager Picanto',
    'MODELO_SELTOS': 'Product Manager Seltos',
    'MARCA_Y_REPUTACIÓN': 'Director de Marketing',
    'FIABILIDAD': 'Director de Calidad',
    'GARANTÍA': 'Director de Postventa',
    'GENERAL': 'CMO / Director General',
}

MODEL_EXTRACTION = {
    'EV6': ['ev6', 'ev-6'],
    'EV9': ['ev9', 'ev-9'],
    'EV3': ['ev3', 'ev-3'],
    'Sportage': ['sportage'],
    'Sorento': ['sorento'],
    'Niro': ['niro'],
    'Stinger': ['stinger'],
    'Ceed': ['ceed', 'proceed', 'xceed'],
    'Picanto': ['picanto'],
    'Seltos': ['seltos'],
    'Carnival': ['carnival'],
    'Soul': ['soul'],
}

# Pain point patterns for extraction
PAIN_PATTERNS = [
    # Negative statements about KIA
    (r'(poor|bad|terrible|awful|disappointing|inconsistent|unreliable|slow|expensive|cheap[^\s]|lacking|outdated|behind|inferior|worse|ugly|boring|problem|issue|complaint|concern|worry|fear|risk|danger|weak|limited|small|cramped|noisy|uncomfortable)\s+([^.]{10,60})', 'HIGH'),

    # Conditional negatives
    (r'(however|but|although|though|unfortunately|sadly|regrettably),?\s+([^.]{10,80})', 'MEDIUM'),

    # Comparison losses
    (r'(not as good as|falls behind|loses to|inferior to|worse than|beaten by|outperformed by)\s+([^.]{10,50})', 'HIGH'),

    # Criticism patterns
    (r'(critics say|some argue|detractors mention|complaints about|criticism of)\s+([^.]{10,80})', 'MEDIUM'),

    # User experience negatives
    (r'(users report|owners complain|reviews mention|feedback indicates)\s+([^.]{10,80}negative[^.]{0,40})', 'HIGH'),

    # Quantified negatives
    (r'(\d+%?)\s+(complain|report issues|experienced problems|had difficulties)', 'HIGH'),
]

# Source patterns for pain point attribution
SOURCE_PATTERNS = [
    r'according to ([a-zA-Z\s]+\.(?:com|org|co\.uk))',
    r'(?:from|on|at|via)\s+([a-zA-Z]+(?:\.com|\.org|\.co\.uk))',
    r'(reddit|trustpilot|carwow|autoexpress|whatcar|autotrader)',
]

def categorize_by_department(question: str, answer: str) -> str:
    """Categorize question by department based on keywords"""
    text = (question + ' ' + answer[:500]).lower()  # Include beginning of answer for context

    for rule in DEPARTMENT_RULES:
        if any(kw in text for kw in rule['keywords']):
            return rule['dept']

    return 'GENERAL'

def categorize_by_block(question: str) -> str:
    """Categorize question by Miguel's block system"""
    q = question.lower()

    # Check blocks in priority order
    for block, keywords in BLOCK_KEYWORDS.items():
        if any(kw in q for kw in keywords):
            return block

    return '1_DIRECTAS_MARCA'

def extract_model(question: str, answer: str) -> Optional[str]:
    """Extract specific KIA model mentioned"""
    text = (question + ' ' + answer).lower()

    for model, keywords in MODEL_EXTRACTION.items():
        if any(kw in text for kw in keywords):
            return model

    return None

def extract_tags(question: str, answer: str) -> List[str]:
    """Extract relevant tags from question and answer"""
    text = (question + ' ' + answer).lower()
    tags = []

    tag_keywords = {
        'electric': ['electric', 'ev', 'battery', 'charging'],
        'suv': ['suv', 'crossover'],
        'family': ['family', 'kids', 'children', 'space'],
        'performance': ['performance', 'speed', 'fast', 'sporty'],
        'luxury': ['luxury', 'premium', 'high-end'],
        'budget': ['budget', 'affordable', 'cheap', 'value'],
        'reliability': ['reliable', 'reliability', 'dependable'],
        'safety': ['safe', 'safety', 'ncap', 'crash'],
        'technology': ['tech', 'technology', 'infotainment', 'screen'],
        'design': ['design', 'style', 'look', 'appearance'],
        'warranty': ['warranty', 'guarantee'],
        'service': ['service', 'dealer', 'maintenance'],
        'comparison': ['vs', 'versus', 'compare', 'better'],
        'range': ['range', 'miles', 'km', 'distance'],
    }

    for tag, keywords in tag_keywords.items():
        if any(kw in text for kw in keywords):
            tags.append(tag)

    return tags[:5]  # Limit to 5 tags

def extract_pain_points(answer: str, sources: List[dict]) -> List[dict]:
    """Extract structured pain points from answer text"""
    pain_points = []

    # Get source domains for attribution
    source_domains = [s.get('source_domain', '') for s in sources]

    for pattern, severity in PAIN_PATTERNS:
        matches = re.findall(pattern, answer, re.IGNORECASE)
        for match in matches:
            if isinstance(match, tuple):
                pain_text = ' '.join(match).strip()
            else:
                pain_text = match.strip()

            # Clean up the text
            pain_text = re.sub(r'\s+', ' ', pain_text)
            pain_text = pain_text[:150]  # Limit length

            # Skip if too short or just punctuation
            if len(pain_text) < 15 or not re.search(r'[a-zA-Z]{3,}', pain_text):
                continue

            # Try to attribute to a source
            attributed_source = None
            for source in SOURCE_PATTERNS:
                source_match = re.search(source, pain_text, re.IGNORECASE)
                if source_match:
                    attributed_source = source_match.group(1)
                    break

            # If no source found in text, use first negative source if available
            if not attributed_source and source_domains:
                attributed_source = source_domains[0]

            pain_points.append({
                'text': pain_text,
                'severity': severity,
                'source': attributed_source
            })

    # Also extract from negative_triggers if available
    return pain_points[:5]  # Limit to 5 pain points

def enhance_pain_points_from_triggers(pain_points: List[dict], negative_triggers: List[str], answer: str) -> List[dict]:
    """Enhance pain points using negative triggers for more context"""

    for trigger in negative_triggers[:3]:  # Top 3 negative triggers
        # Extract just the word without count
        word = re.sub(r'\(\d+\)', '', trigger).strip()

        # Find context in answer
        pattern = rf'([^.]*{re.escape(word)}[^.]*\.)'
        match = re.search(pattern, answer, re.IGNORECASE)

        if match:
            context = match.group(1).strip()
            if len(context) > 20 and len(context) < 200:
                # Check if not already captured
                if not any(word.lower() in p['text'].lower() for p in pain_points):
                    pain_points.append({
                        'text': context,
                        'severity': 'MEDIUM',
                        'source': None
                    })

    return pain_points[:5]

def process_record(record: dict) -> dict:
    """Add multi-stakeholder fields to a single record"""
    question = record.get('question', '')
    answer = record.get('answer', '')
    sources = record.get('sources', [])
    negative_triggers = record.get('negative_triggers', [])

    # Add new fields
    record['department'] = categorize_by_department(question, answer)
    record['block'] = categorize_by_block(question)
    record['responsible_role'] = RESPONSIBLE_MAP.get(record['department'], 'CMO / Director General')
    record['model'] = extract_model(question, answer)
    record['tags'] = extract_tags(question, answer)

    # Extract pain points
    pain_points = extract_pain_points(answer, sources)
    pain_points = enhance_pain_points_from_triggers(pain_points, negative_triggers, answer)
    record['pain_points'] = pain_points

    return record

def generate_summary_stats(data: List[dict]) -> dict:
    """Generate summary statistics by department and block"""

    # By department
    dept_stats = {}
    for record in data:
        dept = record['department']
        if dept not in dept_stats:
            dept_stats[dept] = {
                'count': 0,
                'critical': 0,
                'warning': 0,
                'neutral': 0,
                'positive': 0,
                'total_impact': 0,
                'responsible': record['responsible_role']
            }

        dept_stats[dept]['count'] += 1
        dept_stats[dept][record['criticality'].lower()] += 1
        dept_stats[dept]['total_impact'] += record.get('annual_revenue_impact', 0)

    # By block
    block_stats = {}
    for record in data:
        block = record['block']
        if block not in block_stats:
            block_stats[block] = {
                'count': 0,
                'critical': 0,
                'warning': 0,
                'neutral': 0,
                'positive': 0,
                'total_impact': 0
            }

        block_stats[block]['count'] += 1
        block_stats[block][record['criticality'].lower()] += 1
        block_stats[block]['total_impact'] += record.get('annual_revenue_impact', 0)

    return {
        'by_department': dept_stats,
        'by_block': block_stats
    }

def main():
    # Load data
    print("Loading radaria_analysis.json...")
    with open('radaria_analysis.json', 'r', encoding='utf-8') as f:
        data = json.load(f)

    print(f"Processing {len(data)} records...")

    # Process each record
    for i, record in enumerate(data):
        data[i] = process_record(record)
        if (i + 1) % 50 == 0:
            print(f"  Processed {i + 1}/{len(data)}")

    # Generate summary
    summary = generate_summary_stats(data)

    # Print summary
    print("\n" + "="*60)
    print("RESUMEN POR DEPARTAMENTO:")
    print("="*60)

    dept_sorted = sorted(summary['by_department'].items(),
                         key=lambda x: (x[1]['critical'], x[1]['total_impact']),
                         reverse=True)

    for dept, stats in dept_sorted:
        icon = '🔴' if stats['critical'] > 0 else ('🟡' if stats['warning'] > 0 else '🟢')
        impact_m = stats['total_impact'] / 1_000_000
        print(f"{icon} {dept:25} | {stats['count']:3} preguntas | {stats['critical']} crit | £{impact_m:.1f}M")

    print("\n" + "="*60)
    print("RESUMEN POR BLOQUE:")
    print("="*60)

    for block, stats in sorted(summary['by_block'].items()):
        icon = '🔴' if stats['critical'] > 0 else ('🟡' if stats['warning'] > 0 else '🟢')
        impact_m = stats['total_impact'] / 1_000_000
        print(f"{icon} {block:25} | {stats['count']:3} preguntas | {stats['critical']} crit | £{impact_m:.1f}M")

    # Save updated data
    print("\nSaving updated radaria_analysis.json...")
    with open('radaria_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    # Save summary
    print("Saving radaria_multistakeholder_summary.json...")
    with open('radaria_multistakeholder_summary.json', 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print("\n✅ COMPLETADO!")
    print(f"   - {len(data)} registros actualizados con campos multi-stakeholder")
    print(f"   - {len(summary['by_department'])} departamentos identificados")
    print(f"   - {len(summary['by_block'])} bloques categorizados")

if __name__ == '__main__':
    main()
