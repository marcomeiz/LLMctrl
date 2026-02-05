#!/usr/bin/env python3
"""
Generate expert consumer behavior analyses for each record.
These analyses examine the actual content of LLM responses and their psychological impact on users.
"""

import json
import re

def analyze_response_structure(answer):
    """Analyze the structure of the response."""
    has_pros_cons = bool(re.search(r'(pros|cons|advantages|disadvantages|good|bad|✅|❌|👍|👎|⚠️)', answer.lower()))
    has_warning_section = bool(re.search(r'(caveat|warning|risk|consider|aware|important|note|however|but|although)', answer.lower()))
    has_comparison = bool(re.search(r'(compar|vs|versus|alternative|other|instead|rather than)', answer.lower()))
    has_ranking = bool(re.search(r'(#\d|rank|position|top|best|first|second|third)', answer.lower()))
    has_numbers = bool(re.search(r'(£|\$|€|\d+%|\d+ million|\d+,\d+)', answer))
    starts_positive = bool(re.match(r'^(yes|absolutely|definitely|certainly|of course)', answer.lower().strip()))
    starts_negative = bool(re.match(r'^(no|not really|unfortunately|i wouldn)', answer.lower().strip()))
    has_balanced_view = has_pros_cons or (has_warning_section and starts_positive)

    return {
        'has_pros_cons': has_pros_cons,
        'has_warning_section': has_warning_section,
        'has_comparison': has_comparison,
        'has_ranking': has_ranking,
        'has_numbers': has_numbers,
        'starts_positive': starts_positive,
        'starts_negative': starts_negative,
        'has_balanced_view': has_balanced_view
    }

def get_question_intent(question):
    """Determine what the user is really seeking with this question."""
    q = question.lower()

    if any(w in q for w in ['trustworthy', 'reliable', 'safe', 'legit', 'legitimate', 'scam', 'fraud']):
        return 'validation', 'El usuario busca seguridad emocional y validación antes de comprometer su dinero'

    if any(w in q for w in ['best', 'recommend', 'should i', 'worth', 'good choice']):
        return 'recommendation', 'El usuario busca una recomendación clara que simplifique su decisión'

    if any(w in q for w in ['compare', 'vs', 'versus', 'difference', 'better than', 'or ']):
        return 'comparison', 'El usuario está en fase de evaluación activa entre opciones'

    if any(w in q for w in ['how to', 'how do', 'can i', 'steps', 'process', 'guide']):
        return 'instruction', 'El usuario tiene intención de acción y busca orientación práctica'

    if any(w in q for w in ['what is', 'what are', 'explain', 'how does', 'tell me about']):
        return 'information', 'El usuario está en fase exploratoria de recopilación de información'

    if any(w in q for w in ['bonus', 'offer', 'promotion', 'free', 'deal', 'discount']):
        return 'deal_seeking', 'El usuario está motivado por incentivos y busca maximizar valor'

    if any(w in q for w in ['withdraw', 'deposit', 'payment', 'payout', 'money']):
        return 'transactional', 'El usuario tiene preocupaciones concretas sobre el flujo de su dinero'

    if any(w in q for w in ['problem', 'issue', 'complaint', 'bad', 'negative', 'wrong']):
        return 'concern', 'El usuario ya tiene dudas y busca confirmar o descartar sus preocupaciones'

    return 'general', 'El usuario está explorando opciones sin un objetivo definido'

def extract_key_phrases(answer, triggers):
    """Extract key phrases that might influence the user."""
    concerning_patterns = [
        (r'£\d+[\d,]* (?:million|fine|penalty|payment)', 'monto regulatorio específico'),
        (r'gambling commission', 'mención de regulador'),
        (r'mixed (?:reviews|feedback|experiences)', 'feedback ambiguo'),
        (r'some (?:users|customers|people) (?:report|mention|complain)', 'quejas de usuarios'),
        (r'(?:however|but|although|that said)', 'transición a información negativa'),
        (r'be (?:aware|careful|cautious)', 'advertencia directa'),
        (r'(?:scam|fraud|fake)', 'mención de fraude'),
        (r'(?:issue|problem|complaint|concern)', 'mención de problemas'),
    ]

    found_phrases = []
    for pattern, description in concerning_patterns:
        if re.search(pattern, answer.lower()):
            found_phrases.append(description)

    return found_phrases

def generate_analysis(record):
    """Generate a deep, content-specific analysis."""

    question = record['question_text']
    answer = record['answer']
    classification = record['classification']
    mention = record['mention']
    triggers = record['triggers_detected']
    ranking_list = record.get('ranking_list', [])
    category = record['category_name']

    # Find Betfair position
    betfair_pos = None
    if ranking_list:
        for i, brand in enumerate(ranking_list):
            if brand.lower() == 'betfair':
                betfair_pos = i + 1
                break

    # Analyze the response
    structure = analyze_response_structure(answer)
    intent, intent_desc = get_question_intent(question)
    key_phrases = extract_key_phrases(answer, triggers)

    # Build the analysis
    analyses_parts = []

    # Opening based on intent
    if intent == 'validation':
        if structure['starts_positive'] and structure['has_warning_section']:
            analyses_parts.append(
                f"El usuario busca confirmación de seguridad antes de apostar. La respuesta abre con afirmación positiva, pero la estructura 'sí, pero...' crea disonancia cognitiva: "
                f"valida parcialmente mientras introduce dudas. El cerebro humano procesa las advertencias finales con mayor peso (efecto de recency), "
                f"dejando al usuario más inseguro que antes de preguntar."
            )
        elif structure['starts_positive'] and not structure['has_warning_section']:
            analyses_parts.append(
                f"Respuesta ideal para la intención del usuario: validación clara sin ambigüedades. "
                f"El usuario obtiene la confirmación emocional que necesita para avanzar en su decisión. "
                f"Esta estructura reduce la fricción cognitiva y acelera la conversión."
            )
        elif structure['starts_negative']:
            analyses_parts.append(
                f"Respuesta frontal negativa a una búsqueda de validación. El usuario experimenta rechazo inmediato "
                f"a su consideración de Betfair, lo que probablemente cerrará esta opción y redirigirá su búsqueda hacia alternativas."
            )

    elif intent == 'comparison':
        if betfair_pos == 1:
            analyses_parts.append(
                f"En una consulta comparativa, Betfair lidera el ranking. El efecto de primacía hace que la primera opción "
                f"sea percibida como la más relevante. El usuario en modo comparativo tiende a anclar su evaluación "
                f"en la primera opción presentada, dando ventaja significativa a Betfair."
            )
        elif betfair_pos and betfair_pos <= 3:
            analyses_parts.append(
                f"Betfair aparece en posición #{betfair_pos} de {len(ranking_list)} en una comparativa directa. "
                f"Aunque visible, no lidera. Los usuarios en modo comparativo típicamente profundizan solo en las primeras 2-3 opciones, "
                f"poniendo a Betfair en zona de consideración pero no de preferencia."
            )
        elif not mention:
            analyses_parts.append(
                f"Omisión crítica: en una consulta de comparación, Betfair no aparece entre las opciones. "
                f"El usuario construye su set de consideración sin incluir a Betfair. "
                f"Psicológicamente, una marca ausente en la fase comparativa tiene probabilidad cercana a cero de ser elegida."
            )

    elif intent == 'recommendation':
        if mention and structure['starts_positive']:
            analyses_parts.append(
                f"El usuario pide consejo y recibe a Betfair como respuesta positiva. "
                f"Las recomendaciones directas tienen alto impacto porque el usuario delega parte de su decisión al LLM. "
                f"Esta validación externa reduce la carga cognitiva y facilita la conversión."
            )
        elif mention and structure['has_warning_section']:
            analyses_parts.append(
                f"Recomendación condicionada: el LLM sugiere Betfair pero con reservas. "
                f"El usuario que busca simplificar su decisión recibe complejidad adicional. "
                f"Las advertencias funcionan como 'asteriscos mentales' que debilitan la recomendación."
            )

    elif intent == 'concern':
        if structure['has_warning_section'] or len(triggers) > 0:
            analyses_parts.append(
                f"Usuario con dudas preexistentes encuentra confirmación de sus preocupaciones. "
                f"El sesgo de confirmación hace que preste atención selectiva a los elementos negativos. "
                f"Esta respuesta probablemente refuerza sus reservas y dificulta la conversión."
            )

    # Add trigger-specific analysis
    if 'fine' in triggers or 'regulatory action' in triggers or 'gambling commission action' in triggers:
        if not analyses_parts:
            analyses_parts.append("")
        analyses_parts.append(
            f"La mención de acción regulatoria o multa crea un ancla negativa concreta. "
            f"Los números específicos (como montos de multas) son particularmente memorables y se convierten en 'evidencia' "
            f"que el usuario puede citar internamente como razón para dudar."
        )

    if 'scam' in triggers:
        analyses_parts.append(
            f"La palabra 'scam' aparece en la respuesta. Aunque sea en contexto protector ('no es un scam'), "
            f"la mera asociación léxica planta una semilla de duda. El cerebro procesa la negación "
            f"después de procesar el concepto negativo."
        )

    if 'issues' in triggers or 'complaints' in triggers:
        analyses_parts.append(
            f"La mención de 'problemas' o 'quejas' de otros usuarios activa la prueba social negativa. "
            f"Los humanos dan peso desproporcionado a experiencias negativas de otros como mecanismo de protección."
        )

    # Add comparison/ranking analysis if applicable
    if ranking_list and len(ranking_list) > 1 and betfair_pos:
        competitors_above = ranking_list[:betfair_pos-1] if betfair_pos > 1 else []
        if competitors_above:
            comp_names = ', '.join([c.capitalize() for c in competitors_above[:2]])
            analyses_parts.append(
                f"La respuesta posiciona a {comp_names} por encima de Betfair. "
                f"Cada competidor mencionado antes captura parte de la atención y consideración del usuario, "
                f"diluyendo el impacto de Betfair en la decisión final."
            )

    # Add category context
    category_context = {
        'Brand': "Al buscar directamente por marca, el usuario ya tiene awareness de Betfair. La respuesta determina si ese conocimiento se convierte en consideración activa.",
        'Comparativa General': "En comparativas generales, el usuario aún no ha formado preferencias. La posición y framing en esta respuesta puede definir todo su proceso posterior.",
        'Por Competidor': "El usuario busca información de un competidor pero encuentra a Betfair. Esta es una oportunidad de captura de demanda competitiva.",
        'Comerciales': "Consulta con intención comercial directa. El usuario está cerca de la conversión y busca el impulso final.",
        'Transaccionales': "Preocupación sobre operaciones concretas. La respuesta debe resolver dudas prácticas para evitar abandono."
    }

    if category in category_context:
        analyses_parts.append(category_context[category])

    # Build final analysis
    if not analyses_parts:
        # Fallback for cases not covered
        if classification == 'CRITICAL':
            analyses_parts.append(
                f"Esta respuesta contiene elementos que generan fricción significativa en el proceso de decisión del usuario. "
                f"Los triggers detectados ({', '.join(triggers[:3])}) funcionan como señales de alarma que activan "
                f"el modo de evaluación cauteloso del consumidor."
            )
        elif classification == 'WARNING':
            analyses_parts.append(
                f"Respuesta con señales mixtas que mantienen al usuario en estado de evaluación prolongada. "
                f"No hay rechazo claro pero tampoco validación completa, lo que puede resultar en "
                f"búsqueda adicional de información o consideración de alternativas."
            )
        else:
            analyses_parts.append(
                f"Respuesta favorable para Betfair que facilita el avance del usuario en su journey de decisión. "
                f"La información presentada reduce incertidumbre y construye confianza hacia la marca."
            )

    return ' '.join(analyses_parts)

def main():
    # Read the source data
    with open('../src/betfair_enriched.json', 'r', encoding='utf-8') as f:
        records = json.load(f)

    # Generate analyses for all records
    analyses = {}
    for i, record in enumerate(records):
        record_id = record['id']
        analysis = generate_analysis(record)
        analyses[record_id] = analysis

        if (i + 1) % 50 == 0:
            print(f"Processed {i + 1}/{len(records)} records")

    # Save to JSON
    with open('../src/lib/interamplify_analyses.json', 'w', encoding='utf-8') as f:
        json.dump(analyses, f, ensure_ascii=False, indent=2)

    print(f"\nGenerated {len(analyses)} analyses")
    print("\nSample analyses:")
    for rid in ['2581', '2582', '2583']:
        if rid in analyses:
            print(f"\n=== ID {rid} ===")
            print(analyses[rid][:500] + "..." if len(analyses[rid]) > 500 else analyses[rid])

if __name__ == '__main__':
    main()
