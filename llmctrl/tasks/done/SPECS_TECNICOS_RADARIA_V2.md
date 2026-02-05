# ESPECIFICACIONES TÉCNICAS - RADARIA v2.0
## Para Desarrollo

---

# 1. MODELO DE DATOS PROPUESTO

## Tabla: `analysis_results`

```sql
CREATE TABLE analysis_results (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_question_id INT NOT NULL,
    business_question_id INT NOT NULL,
    brand VARCHAR(100) NOT NULL,
    country VARCHAR(10) NOT NULL,
    
    -- Pregunta y respuesta
    question_text TEXT NOT NULL,
    answer_text TEXT NOT NULL,
    answer_hash VARCHAR(64) NOT NULL,  -- Para detectar cambios
    
    -- SCORING MULTIDIMENSIONAL
    sentiment_score INT NOT NULL DEFAULT 0,  -- -10 a +10
    pain_score INT NOT NULL DEFAULT 0,       -- Score de dolor calculado
    certainty_score DECIMAL(3,2) DEFAULT 0,  -- 0.00 a 1.00
    
    -- CLASIFICACIÓN
    criticality ENUM('CRITICAL', 'WARNING', 'NEUTRAL', 'POSITIVE') NOT NULL,
    funnel_stage ENUM('AWARENESS', 'CONSIDERATION', 'VALIDATION', 'TRANSACTIONAL', 'OTHER') NOT NULL,
    response_type ENUM('NODE', 'WEB_SEARCH', 'MIXED', 'UNKNOWN') NOT NULL,
    
    -- POSICIÓN DE MARCA
    brand_mentioned BOOLEAN DEFAULT FALSE,
    brand_position ENUM('FIRST', 'TOP3', 'MIDDLE', 'LAST', 'NOT_MENTIONED') DEFAULT 'NOT_MENTIONED',
    brand_tone ENUM('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'MIXED') DEFAULT 'NEUTRAL',
    
    -- ANÁLISIS COMPETITIVO
    competitors_mentioned JSON,  -- ["Toyota", "Hyundai", ...]
    competitor_winner VARCHAR(100) DEFAULT NULL,
    competitor_analysis JSON,    -- {"winner": "Toyota", "reasons": [...]}
    
    -- CONSECUENCIAS PREDICHAS
    consequence_analysis JSON,   -- Output del predictor de consecuencias
    purchase_abandonment_risk DECIMAL(3,2) DEFAULT NULL,
    competitor_research_risk DECIMAL(3,2) DEFAULT NULL,
    estimated_monthly_impact INT DEFAULT NULL,
    estimated_annual_revenue_impact DECIMAL(15,2) DEFAULT NULL,
    
    -- METADATA
    scraped_at TIMESTAMP NOT NULL,
    analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analysis_version VARCHAR(20) DEFAULT '2.0',
    
    INDEX idx_brand_country (brand, country),
    INDEX idx_criticality (criticality),
    INDEX idx_funnel_stage (funnel_stage),
    INDEX idx_pain_score (pain_score)
);
```

## Tabla: `extracted_sources`

```sql
CREATE TABLE extracted_sources (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    analysis_result_id BIGINT NOT NULL,
    
    source_mention VARCHAR(255) NOT NULL,      -- "What Car?"
    source_domain VARCHAR(255) DEFAULT NULL,   -- "whatcar.com"
    source_type ENUM('REVIEW_SITE', 'FORUM', 'NEWS', 'OFFICIAL', 'WIKIPEDIA', 'SOCIAL', 'OTHER') NOT NULL,
    source_url TEXT DEFAULT NULL,              -- URL completa si disponible
    
    context_snippet TEXT,                      -- "received 4/5 stars in What Car?"
    source_sentiment ENUM('POSITIVE', 'NEUTRAL', 'NEGATIVE', 'MIXED') DEFAULT 'NEUTRAL',
    
    mention_count INT DEFAULT 1,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (analysis_result_id) REFERENCES analysis_results(id),
    INDEX idx_source_domain (source_domain),
    INDEX idx_source_type (source_type)
);
```

## Tabla: `competitive_matrix`

```sql
CREATE TABLE competitive_matrix (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    analysis_result_id BIGINT NOT NULL,
    
    our_brand VARCHAR(100) NOT NULL,
    competitor_brand VARCHAR(100) NOT NULL,
    
    comparison_outcome ENUM('WIN', 'LOSE', 'TIE', 'NOT_COMPARED') NOT NULL,
    competitor_recommended BOOLEAN DEFAULT FALSE,
    
    our_strengths JSON,      -- ["warranty", "features"]
    our_weaknesses JSON,     -- ["brand perception", "resale"]
    competitor_strengths JSON,
    competitor_weaknesses JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (analysis_result_id) REFERENCES analysis_results(id),
    INDEX idx_brands (our_brand, competitor_brand),
    INDEX idx_outcome (comparison_outcome)
);
```

## Tabla: `answer_snapshots` (Para tracking temporal)

```sql
CREATE TABLE answer_snapshots (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_text_hash VARCHAR(64) NOT NULL,  -- Hash de la pregunta
    brand VARCHAR(100) NOT NULL,
    country VARCHAR(10) NOT NULL,
    
    answer_text TEXT NOT NULL,
    answer_hash VARCHAR(64) NOT NULL,
    sentiment_score INT NOT NULL,
    
    snapshot_date DATE NOT NULL,
    
    UNIQUE KEY uk_question_date (question_text_hash, brand, country, snapshot_date),
    INDEX idx_tracking (question_text_hash, brand, country)
);
```

## Tabla: `consistency_tests`

```sql
CREATE TABLE consistency_tests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_text TEXT NOT NULL,
    question_hash VARCHAR(64) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    country VARCHAR(10) NOT NULL,
    
    test_date DATE NOT NULL,
    sample_count INT NOT NULL,
    unique_answers INT NOT NULL,
    
    sentiment_mean DECIMAL(5,2),
    sentiment_stddev DECIMAL(5,2),
    consistency_score DECIMAL(3,2),  -- 0.00 a 1.00
    
    variations_detected JSON,  -- ["warranty years vary", "competitor order changes"]
    
    INDEX idx_consistency (question_hash, brand)
);
```

---

# 2. ALGORITMOS REQUERIDOS

## 2.1 Clasificador de Criticidad

```python
def classify_criticality(answer: str, question: str, funnel_stage: str) -> str:
    """
    Clasifica la criticidad de una respuesta.
    
    Returns: 'CRITICAL', 'WARNING', 'NEUTRAL', 'POSITIVE'
    """
    
    # Indicadores de criticidad
    critical_words = {
        'avoid': -5,
        'problem': -3,
        'issue': -2,
        'complaint': -3,
        'poor': -4,
        'weak': -3,
        'unreliable': -5,
        'fails': -4,
        'disappointing': -3,
        'worse': -3,
        'behind': -2,
        'lags': -3,
    }
    
    positive_words = {
        'excellent': 3,
        'outstanding': 4,
        'recommend': 2,
        'reliable': 2,
        'best': 2,
        'leader': 3,
    }
    
    score = 0
    answer_lower = answer.lower()
    
    for word, weight in critical_words.items():
        if word in answer_lower:
            score += weight
    
    for word, weight in positive_words.items():
        if word in answer_lower:
            score += weight
    
    # Multiplicador por etapa del funnel
    funnel_multiplier = {
        'TRANSACTIONAL': 1.5,
        'VALIDATION': 1.5,
        'CONSIDERATION': 1.2,
        'AWARENESS': 1.0,
        'OTHER': 1.0,
    }
    
    final_score = score * funnel_multiplier.get(funnel_stage, 1.0)
    
    if final_score <= -7:
        return 'CRITICAL'
    elif final_score <= -3:
        return 'WARNING'
    elif final_score >= 5:
        return 'POSITIVE'
    else:
        return 'NEUTRAL'
```

## 2.2 Detector de Etapa del Funnel

```python
def detect_funnel_stage(question: str) -> str:
    """
    Detecta en qué etapa del funnel está el usuario.
    """
    q_lower = question.lower()
    
    # TRANSACCIONAL - Listo para comprar
    transactional_signals = [
        'buy', 'purchase', 'price', 'cost', 'offer', 'discount', 
        'financing', 'worth it', 'should i', 'best time to buy',
        'stock available', 'delivery', 'dealer'
    ]
    
    # VALIDATION - Buscando confirmación/red flags
    validation_signals = [
        'problem', 'issue', 'reliable', 'safe', 'negative', 
        'complaint', 'should i know', 'anything wrong', 'known problems',
        'regret', 'avoid'
    ]
    
    # CONSIDERATION - Comparando opciones
    consideration_signals = [
        'better', 'vs', 'versus', 'compare', 'or ', 'which is',
        'difference between', 'alternative'
    ]
    
    # AWARENESS - Investigación inicial
    awareness_signals = [
        'what is', 'how is', 'tell me about', 'overview',
        'introduction', 'explain'
    ]
    
    for signal in validation_signals:
        if signal in q_lower:
            return 'VALIDATION'
    
    for signal in transactional_signals:
        if signal in q_lower:
            return 'TRANSACTIONAL'
    
    for signal in consideration_signals:
        if signal in q_lower:
            return 'CONSIDERATION'
    
    for signal in awareness_signals:
        if signal in q_lower:
            return 'AWARENESS'
    
    return 'OTHER'
```

## 2.3 Extractor de Fuentes

```python
import re
from typing import List, Dict

def extract_sources(answer: str) -> List[Dict]:
    """
    Extrae fuentes mencionadas en la respuesta.
    """
    sources = []
    
    # Patrones de fuentes conocidas
    known_sources = {
        'What Car?': {'domain': 'whatcar.com', 'type': 'REVIEW_SITE'},
        'Carwow': {'domain': 'carwow.co.uk', 'type': 'REVIEW_SITE'},
        'Auto Express': {'domain': 'autoexpress.co.uk', 'type': 'REVIEW_SITE'},
        'Top Gear': {'domain': 'topgear.com', 'type': 'REVIEW_SITE'},
        'Autocar': {'domain': 'autocar.co.uk', 'type': 'REVIEW_SITE'},
        'Wikipedia': {'domain': 'wikipedia.org', 'type': 'WIKIPEDIA'},
        'Reddit': {'domain': 'reddit.com', 'type': 'SOCIAL'},
        'Trustpilot': {'domain': 'trustpilot.com', 'type': 'REVIEW_SITE'},
        'Consumer Reports': {'domain': 'consumerreports.org', 'type': 'REVIEW_SITE'},
        'Euro NCAP': {'domain': 'euroncap.com', 'type': 'OFFICIAL'},
        'J.D. Power': {'domain': 'jdpower.com', 'type': 'REVIEW_SITE'},
        'Kelley Blue Book': {'domain': 'kbb.com', 'type': 'REVIEW_SITE'},
    }
    
    for source_name, info in known_sources.items():
        if source_name.lower() in answer.lower():
            # Extraer contexto
            pattern = rf'.{{0,100}}{re.escape(source_name)}.{{0,100}}'
            matches = re.findall(pattern, answer, re.IGNORECASE)
            context = matches[0].strip() if matches else None
            
            # Detectar sentimiento del contexto
            sentiment = detect_context_sentiment(context) if context else 'NEUTRAL'
            
            sources.append({
                'source_mention': source_name,
                'source_domain': info['domain'],
                'source_type': info['type'],
                'context_snippet': context,
                'source_sentiment': sentiment
            })
    
    # Buscar URLs directas
    url_pattern = r'https?://([^\s<>"{}|\\^`\[\]]+)'
    urls = re.findall(url_pattern, answer)
    for url in urls:
        domain = url.split('/')[0]
        if not any(s['source_domain'] == domain for s in sources):
            sources.append({
                'source_mention': domain,
                'source_domain': domain,
                'source_type': 'OTHER',
                'source_url': f'https://{url}',
                'source_sentiment': 'NEUTRAL'
            })
    
    return sources


def detect_context_sentiment(context: str) -> str:
    """
    Detecta el sentimiento del contexto donde aparece una fuente.
    """
    if not context:
        return 'NEUTRAL'
    
    context_lower = context.lower()
    
    negative_signals = ['problem', 'issue', 'poor', 'low', 'bad', 'negative', 'criticism']
    positive_signals = ['excellent', 'good', 'high', 'best', 'top', 'positive', 'praise']
    
    neg_count = sum(1 for s in negative_signals if s in context_lower)
    pos_count = sum(1 for s in positive_signals if s in context_lower)
    
    if neg_count > pos_count:
        return 'NEGATIVE'
    elif pos_count > neg_count:
        return 'POSITIVE'
    elif neg_count > 0 and pos_count > 0:
        return 'MIXED'
    else:
        return 'NEUTRAL'
```

## 2.4 Analizador Competitivo

```python
def analyze_competition(answer: str, our_brand: str) -> Dict:
    """
    Analiza menciones de competidores y determina quién "gana".
    """
    competitors = [
        'Toyota', 'Hyundai', 'Honda', 'Mazda', 'Nissan',
        'Volkswagen', 'VW', 'Skoda', 'SEAT', 'Cupra',
        'Ford', 'Opel', 'Peugeot', 'Renault',
        'Tesla', 'BMW', 'Mercedes', 'Audi', 'Porsche',
        'Volvo', 'BYD', 'Dacia'
    ]
    
    answer_lower = answer.lower()
    
    # Encontrar competidores mencionados
    mentioned = [c for c in competitors if c.lower() in answer_lower]
    
    # Patrones de recomendación
    recommendation_patterns = [
        (r'(?:recommend|choose|go with|opt for)\s+(\w+)', 'recommends'),
        (r'(\w+)\s+(?:is better|wins|beats|outperforms)', 'winner'),
        (r'(\w+)\s+(?:is|are)\s+(?:superior|ahead|better)', 'winner'),
        (r'(?:prefer|pick)\s+(\w+)', 'recommends'),
    ]
    
    winner = None
    for pattern, pattern_type in recommendation_patterns:
        matches = re.findall(pattern, answer, re.IGNORECASE)
        for match in matches:
            if match.lower() != our_brand.lower() and match in mentioned:
                winner = match
                break
        if winner:
            break
    
    # Analizar fortalezas/debilidades mencionadas
    our_context = extract_brand_context(answer, our_brand)
    
    return {
        'competitors_mentioned': mentioned,
        'competitor_winner': winner,
        'our_brand_mentioned': our_brand.lower() in answer_lower,
        'comparison_outcome': 'LOSE' if winner else ('WIN' if our_brand.lower() in answer_lower[:500].lower() else 'TIE'),
        'analysis': {
            'our_context': our_context,
            'winner_brand': winner,
        }
    }


def extract_brand_context(answer: str, brand: str) -> Dict:
    """
    Extrae el contexto donde se menciona nuestra marca.
    """
    pattern = rf'.{{0,200}}{re.escape(brand)}.{{0,200}}'
    matches = re.findall(pattern, answer, re.IGNORECASE)
    
    strengths = []
    weaknesses = []
    
    strength_words = ['excellent', 'best', 'good', 'strong', 'reliable', 'quality', 'value']
    weakness_words = ['problem', 'issue', 'weak', 'poor', 'behind', 'lacks']
    
    for match in matches:
        match_lower = match.lower()
        for word in strength_words:
            if word in match_lower:
                strengths.append(word)
        for word in weakness_words:
            if word in match_lower:
                weaknesses.append(word)
    
    return {
        'strengths': list(set(strengths)),
        'weaknesses': list(set(weaknesses)),
        'mentions': len(matches)
    }
```

## 2.5 Detector Nodo vs Web Search

```python
def detect_response_type(answer: str) -> Dict:
    """
    Detecta si la respuesta viene del nodo o de búsqueda web.
    """
    
    # Indicadores de búsqueda web
    web_indicators = [
        r'\b202[4-6]\b',           # Años recientes
        r'according to',
        r'source:',
        r'\.com',
        r'\.co\.uk',
        r'\.org',
        r'as of',
        r'recent(?:ly)?',
        r'current(?:ly)?',
        r'latest',
        r'updated',
        r'reported',
    ]
    
    # Indicadores de nodo
    node_indicators = [
        r'generally',
        r'typically',
        r'historically',
        r'traditionally',
        r'in general',
    ]
    
    web_score = 0
    node_score = 0
    found_indicators = []
    
    for pattern in web_indicators:
        if re.search(pattern, answer, re.IGNORECASE):
            web_score += 1
            found_indicators.append(f"web: {pattern}")
    
    for pattern in node_indicators:
        if re.search(pattern, answer, re.IGNORECASE):
            node_score += 1
            found_indicators.append(f"node: {pattern}")
    
    # Determinar tipo
    if web_score >= 3:
        response_type = 'WEB_SEARCH'
        confidence = min(0.95, 0.5 + (web_score * 0.1))
        influenceability = 'HIGH'
    elif node_score >= 2 and web_score < 2:
        response_type = 'NODE'
        confidence = min(0.9, 0.5 + (node_score * 0.1))
        influenceability = 'LOW'
    else:
        response_type = 'MIXED'
        confidence = 0.5
        influenceability = 'MEDIUM'
    
    return {
        'type': response_type,
        'confidence': confidence,
        'influenceability': influenceability,
        'indicators': found_indicators,
        'recommended_action': get_recommended_action(response_type)
    }


def get_recommended_action(response_type: str) -> str:
    actions = {
        'WEB_SEARCH': 'Crear contenido en fuentes identificadas. Resultados esperados en 2-4 semanas.',
        'NODE': 'Difícil de influenciar. Requiere cambios masivos de contenido. Tiempo estimado: 6-12 meses.',
        'MIXED': 'Atacar componentes de búsqueda web primero. Monitorear evolución.',
    }
    return actions.get(response_type, 'Análisis adicional requerido.')
```

---

# 3. PROMPT PARA PREDICCIÓN DE CONSECUENCIAS

```python
CONSEQUENCE_PREDICTOR_PROMPT = """
Eres un experto en comportamiento del consumidor y análisis de decisiones de compra.

Analiza la siguiente respuesta que un LLM (ChatGPT) ha dado a un usuario que está considerando comprar un producto de la marca {brand}.

PREGUNTA DEL USUARIO:
{question}

RESPUESTA DEL LLM:
{answer}

CONTEXTO:
- Marca evaluada: {brand}
- País: {country}
- Etapa del funnel: {funnel_stage}
- Precio promedio del producto: {avg_price}

TAREA:
Predice cómo reaccionará el usuario tras leer esta respuesta. Sé específico y cuantitativo.

RESPONDE EN ESTE FORMATO JSON EXACTO:
{{
    "user_reaction_summary": "string - resumen en 1-2 frases de la reacción probable",
    
    "next_actions": [
        {{
            "action": "string - ej: 'research_competitor', 'abandon_purchase', 'visit_dealer', 'seek_second_opinion'",
            "probability": float 0-1,
            "explanation": "string - por qué esta probabilidad"
        }}
    ],
    
    "likely_competitors_researched": ["string array - competidores que probablemente investigará"],
    
    "purchase_impact": {{
        "direction": "string - 'POSITIVE', 'NEGATIVE', 'NEUTRAL'",
        "confidence_change": float -1 to 1 (negativo = menos confianza en comprar),
        "key_concerns_raised": ["string array - preocupaciones que surgieron"]
    }},
    
    "business_narrative": "string - párrafo explicando el impacto de negocio de esta respuesta, escrito para que lo entienda un ejecutivo",
    
    "urgency": "string - 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'",
    
    "recommended_action": "string - qué debería hacer la marca para mitigar/aprovechar"
}}

Sé realista y basado en comportamiento real del consumidor. No exageres ni minimices.
"""
```

---

# 4. API ENDPOINTS PROPUESTOS

## POST /api/v2/analyze
```json
// Request
{
    "brand": "KIA",
    "country": "UK",
    "questions": [
        {"question": "Is KIA a reliable brand?"}
    ],
    "options": {
        "extract_sources": true,
        "analyze_competition": true,
        "predict_consequences": true,
        "detect_response_type": true
    }
}

// Response
{
    "analysis_id": "uuid",
    "brand": "KIA",
    "country": "UK",
    "summary": {
        "total_questions": 1,
        "critical_count": 0,
        "warning_count": 1,
        "positive_count": 0,
        "overall_score": 62
    },
    "results": [
        {
            "question": "Is KIA a reliable brand?",
            "answer": "...",
            "criticality": "WARNING",
            "sentiment_score": -3,
            "funnel_stage": "VALIDATION",
            "response_type": "WEB_SEARCH",
            "brand_position": "TOP3",
            "sources": [...],
            "competitive_analysis": {...},
            "consequence_prediction": {...}
        }
    ]
}
```

## GET /api/v2/dashboard/{brand}/{country}
```json
// Response
{
    "brand": "KIA",
    "country": "UK",
    "last_analysis": "2026-01-13T14:30:00Z",
    
    "pain_summary": {
        "critical_questions": 13,
        "warning_questions": 24,
        "estimated_annual_impact": 4200000,
        "top_pain_points": [...]
    },
    
    "competitive_summary": {
        "main_competitors": ["Hyundai", "Toyota", "Tesla"],
        "win_rate": 0.45,
        "questions_where_we_lose": 23,
        "biggest_threat": "Toyota"
    },
    
    "source_summary": {
        "top_influencing_sources": [...],
        "negative_sources": [...],
        "action_required": [...]
    },
    
    "trend": {
        "30_day_sentiment_change": -2,
        "improving_areas": [...],
        "declining_areas": [...]
    }
}
```

## POST /api/v2/track
```json
// Request - para tracking temporal
{
    "brand": "KIA",
    "country": "UK",
    "questions_to_track": [
        "Is KIA a reliable brand?",
        "What is KIA's after-sales service like?"
    ],
    "frequency": "DAILY"
}
```

## GET /api/v2/consistency-test/{brand}/{country}
```json
// Response
{
    "brand": "KIA",
    "country": "UK",
    "test_date": "2026-01-13",
    
    "results": [
        {
            "question": "Is KIA a reliable brand?",
            "samples": 10,
            "unique_answers": 3,
            "consistency_score": 0.7,
            "sentiment_variance": 1.2,
            "key_variations": [
                "Warranty length varies (5-7 years mentioned)",
                "Competitor ranking order changes"
            ],
            "influenceability": "MEDIUM"
        }
    ]
}
```

---

# 5. DASHBOARD COMPONENTS (React)

## Componente: PainMeter
```jsx
// Muestra el "contador de dolor" principal
<PainMeter
    criticalCount={13}
    warningCount={24}
    estimatedImpact={4200000}
    currency="GBP"
/>
```

## Componente: CompetitorThreatMatrix
```jsx
// Muestra matriz de competidores que nos roban
<CompetitorThreatMatrix
    competitors={[
        { name: 'Toyota', questionsWon: 23, threatLevel: 'HIGH' },
        { name: 'Hyundai', questionsWon: 18, threatLevel: 'HIGH' },
        { name: 'Tesla', questionsWon: 12, threatLevel: 'MEDIUM' },
    ]}
    onCompetitorClick={(competitor) => showDetails(competitor)}
/>
```

## Componente: SourceInfluenceMap
```jsx
// Muestra fuentes que influyen en ChatGPT
<SourceInfluenceMap
    sources={[
        { name: 'Carwow', mentions: 166, sentiment: 'mixed', actionRequired: true },
        { name: 'What Car?', mentions: 154, sentiment: 'positive', actionRequired: false },
    ]}
    onSourceClick={(source) => showSourceDetails(source)}
/>
```

## Componente: ConsequenceCard
```jsx
// Muestra la predicción de consecuencias de una respuesta
<ConsequenceCard
    question="What is KIA's after-sales service like?"
    consequence={{
        abandonmentRisk: 0.45,
        competitorResearchRisk: 0.73,
        estimatedLostSales: 29,
        urgency: 'CRITICAL',
        narrative: "Si un comprador potencial lee esto..."
    }}
/>
```

---

# 6. PRIORIDAD DE IMPLEMENTACIÓN

## Sprint 1 (1 semana)
1. ✅ Corregir campo `critical` - que funcione el clasificador
2. ✅ Implementar scoring multidimensional
3. ✅ Implementar detector de funnel stage
4. ✅ Migrar datos existentes con nueva clasificación

## Sprint 2 (1 semana)
5. 🔄 Extractor de fuentes
6. 🔄 Almacenamiento de fuentes en nueva tabla
7. 🔄 API endpoint `/analyze` v2

## Sprint 3 (1 semana)
8. 🔄 Analizador competitivo
9. 🔄 Detector nodo vs web
10. 🔄 Dashboard básico con PainMeter

## Sprint 4 (1 semana)
11. ⏳ Predictor de consecuencias (integración con LLM)
12. ⏳ Dashboard completo
13. ⏳ Tracking temporal

## Sprint 5 (1 semana)
14. ⏳ Tests de consistencia
15. ⏳ Sistema de alertas
16. ⏳ Refinamiento y QA

---

**FIN DE ESPECIFICACIONES TÉCNICAS**
