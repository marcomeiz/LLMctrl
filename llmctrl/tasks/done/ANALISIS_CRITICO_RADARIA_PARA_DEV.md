# 🔴 ANÁLISIS CRÍTICO RADARIA - DOCUMENTO INTERNO
## "De esto depende nuestro trabajo"

**Fecha:** 13 Enero 2026  
**Autor:** Análisis de Datos  
**Para:** Equipo de Desarrollo  
**Clasificación:** INTERNO - NO COMPARTIR CON CLIENTE

---

# PARTE 1: LO QUE ESTÁ MAL (Y ES GRAVE)

## 🚨 PROBLEMA CRÍTICO #1: EL CLASIFICADOR NO FUNCIONA

**Evidencia:**
- Total de preguntas analizadas: **197**
- Marcadas como críticas: **0**
- Esto es IMPOSIBLE. El campo `critical` está siempre en `0`.

**Preguntas que DEBERÍAN ser críticas y no lo son:**

| Pregunta | Indicadores Negativos | ¿Por qué es crítica? |
|----------|----------------------|---------------------|
| What is KIA's after-sales service like? | 4 (issue, complaint, poor, weak) | Fase final de compra |
| Is there anything negative I should know before buying? | 4 (problem, issue, poor, weak) | ÚLTIMA pregunta antes de comprar |
| Does the KIA EV6 have any known problems? | 3 (problem, issue, fails) | Modelo estrella |
| Are KIA cars safe? | 2 (avoid, issue) | Deal-breaker para familias |

**Causa probable:** 
- El algoritmo de clasificación nunca se ejecutó
- O está mal implementado
- O usa un threshold mal calibrado

**ACCIÓN DEV:** Revisar y corregir URGENTE. El producto no sirve sin esto.

---

## 🚨 PROBLEMA CRÍTICO #2: RESPUESTAS NEGATIVAS EN ETAPAS DE CONVERSIÓN

**Hallazgo demoledor:**

| Etapa del Funnel | Total Preguntas | Con Indicadores Negativos | % |
|------------------|-----------------|---------------------------|---|
| **VALIDACIÓN** | 11 | 9 | **81.8%** |
| **TRANSACCIONAL** | 36 | 6 | **16.7%** |
| COMPARATIVA | 76 | 4 | 5.3% |

**¿Por qué esto es GRAVE?**

Las preguntas de **VALIDACIÓN** son las que hace alguien que YA DECIDIÓ comprar pero busca confirmación:
- "Are KIA cars safe?"
- "Is KIA a reliable brand?"
- "Does the EV6 have any known problems?"

**81.8% de estas respuestas tienen contenido negativo.**

Esto significa: **8 de cada 10 personas que ya casi compraron un KIA reciben info negativa.**

**ACCIÓN DEV:** Sistema de alerta especial para preguntas de VALIDACIÓN y TRANSACCIONAL.

---

## 🚨 PROBLEMA CRÍTICO #3: NO EXTRAEMOS LAS FUENTES

**Las fuentes que ChatGPT usa para opinar de KIA:**

| Fuente | Menciones | Influencia |
|--------|-----------|------------|
| carwow.co.uk | 166 | 🔴 MÁXIMA |
| What Car? | 154 | 🔴 MÁXIMA |
| Auto Express | 90 | 🔴 ALTA |
| Wikipedia | 83 | 🔴 ALTA |
| Consumer Reports | 44 | 🟡 MEDIA |
| Reddit | 40 | 🟡 MEDIA |
| Top Gear | 32 | 🟡 MEDIA |
| Trustpilot | 12 | 🟢 BAJA |

**¿Por qué esto es ORO?**

Si queremos cambiar lo que ChatGPT dice de KIA, tenemos que actuar en ESTAS FUENTES.
- ¿Carwow tiene una review negativa? → Ahí hay que actuar
- ¿What Car? no actualiza el rating? → Ahí hay que actuar
- ¿Reddit tiene threads negativos? → Ahí hay que actuar

**PERO NO ESTAMOS EXTRAYENDO ESTA DATA.**

El sistema guarda la respuesta pero NO:
- Las URLs específicas citadas
- El dominio fuente de cada afirmación
- Si la fuente es del nodo o búsqueda web

**ACCIÓN DEV:** Extraer y almacenar TODAS las fuentes/URLs de cada respuesta.

---

## 🚨 PROBLEMA CRÍTICO #4: NO SABEMOS CUÁNDO KIA PIERDE

**Competidores más mencionados en respuestas:**

```
Hyundai        62 (31.5%) ███████████████
Ford           62 (31.5%) ███████████████
SEAT           58 (29.4%) ██████████████
Toyota         48 (24.4%) ████████████
Tesla          40 (20.3%) ██████████
Volkswagen     32 (16.2%) ████████
BMW            30 (15.2%) ███████
```

**Pero NO sabemos:**
- ¿En cuántas respuestas el competidor es RECOMENDADO sobre KIA?
- ¿En qué posición aparece KIA vs competidor?
- ¿Cuándo KIA GANA y cuándo PIERDE?

**Casos detectados donde KIA PIERDE:**
1. "Which brand has better value for money, KIA or Toyota?" → **Recomienda Toyota**
2. "Which is better, KIA Niro or Toyota Prius?" → **Recomienda Toyota**
3. "Which is better, KIA or Honda?" → **Honda wins**
4. "Which is better, KIA or Toyota?" → **Recomienda Toyota**

**ACCIÓN DEV:** Matriz competitiva automática. Por cada respuesta: ¿quién gana?

---

## 🚨 PROBLEMA CRÍTICO #5: KIA NO APARECE EN RANKINGS

**En preguntas genéricas tipo "best of" o "recommend":**

| Status | Cantidad | % |
|--------|----------|---|
| ❌ NO APARECE | 32 | 61.5% |
| ✅ APARECE PRIMERO | 19 | 36.5% |
| ⚠️ APARECE PERO NO PRIMERO | 1 | 1.9% |

**Preguntas donde KIA NO APARECE (oportunidades perdidas):**
- Which cars have the best technology in 2026?
- Which cars give the fewest problems?
- Which cars have 5-star Euro NCAP ratings?
- Which is the best car for the motorway?
- Which car brand do you recommend in 2026?
- Which is the best large SUV of 2026?
- Which electric cars have the best range in 2026?

**Estas son 32 preguntas donde un comprador NUNCA verá KIA mencionado.**

**ACCIÓN DEV:** Detectar automáticamente cuándo la marca objetivo NO aparece.

---

## 🚨 PROBLEMA CRÍTICO #6: NO HAY CONSECUENCIAS (LO QUE JAVI PIDIÓ)

**Cita textual de Javi:**
> "necesitamos que la propia IA le diga cuáles son las posibles consecuencias"
> "lo ideal seria decir que nuestra tool está entrenada para saber como piensa un usuario"
> "herramientas hay muchas, pero esto te está diciendo lo que te va a pasar"

**Lo que mostramos ahora:**
```
Pregunta: What is KIA's after-sales service like?
Status: Crítico
```

**Lo que DEBERÍAMOS mostrar:**
```
Pregunta: What is KIA's after-sales service like?
Status: 🔴 CRÍTICO

⚠️ CONSECUENCIA PREDICHA:
Si un comprador potencial lee esta respuesta:
- 73% probabilidad de buscar info de postventa de competidores
- 45% probabilidad de contactar dealer de Toyota/VW para comparar
- 28% probabilidad de abandonar la compra

💰 IMPACTO ESTIMADO:
- Esta pregunta tiene ~2,400 búsquedas/mes en UK
- Con tasa de conversión típica de 1.2%, impacta ~29 ventas/mes
- Pérdida potencial: £870K/año (a £30K/vehículo promedio)

🎯 COMPETIDORES QUE SE BENEFICIAN:
Toyota, Volkswagen, Hyundai (mejor percepción de postventa)
```

**ACCIÓN DEV:** Sistema de predicción de consecuencias con IA.

---

## 🚨 PROBLEMA CRÍTICO #7: NO DISTINGUIMOS NODO VS BÚSQUEDA WEB

**Estimación actual:**
- Probablemente BÚSQUEDA WEB (influenciable): 57 (28.9%)
- Probablemente NODO (difícil): 140 (71.1%)

**¿Por qué importa?**

| Tipo | Cómo influenciar | Tiempo | Coste |
|------|------------------|--------|-------|
| Búsqueda Web | Cambiar SERPs, crear contenido, PR | 2-4 semanas | €€ |
| Nodo | Casi imposible, esperar re-entreno | 6-12 meses | €€€€€ |

**Si no distinguimos, podemos vender algo que NO PODEMOS ENTREGAR.**

**ACCIÓN DEV:** Detección automática de tipo de respuesta.

---

## 🚨 PROBLEMA CRÍTICO #8: NO HAY TRACKING TEMPORAL

**Preguntas sin respuesta:**
- ¿Cada cuánto cambian las respuestas de ChatGPT?
- ¿Qué respuestas son estables vs volátiles?
- Si actuamos, ¿cuánto tarda en reflejarse?
- ¿Hay estacionalidad?

**¿Por qué importa?**

Si vendemos "mejorar tu posición en ChatGPT" y después de 3 meses la respuesta no cambió, quedamos como scammers.

**ACCIÓN DEV:** Sistema de snapshots temporales + alertas de cambio.

---

# PARTE 2: LO QUE NECESITO DEL DEV

## REQUERIMIENTO 1: SISTEMA DE SCORING MULTIDIMENSIONAL

**No más booleano (crítico/no crítico). Necesito:**

```python
{
    "question_id": 123,
    "question": "What is KIA's after-sales service like?",
    
    "scores": {
        "sentiment": -7,          # -10 a +10
        "brand_position": 0,      # 1=primero, 0=no aparece, -1=último
        "competitor_advantage": ["Toyota", "VW"],  # quién gana
        "certainty": 0.3,         # 0-1, cuán segura es la respuesta
        "funnel_stage": "VALIDATION",
        "impact_potential": "HIGH"
    },
    
    "sources": [
        {"domain": "whatcar.com", "type": "review", "sentiment": "negative"},
        {"domain": "trustpilot.com", "type": "reviews", "sentiment": "mixed"}
    ],
    
    "response_type": "WEB_SEARCH",  # vs "NODE"
    
    "consequence": {
        "purchase_abandonment_risk": 0.45,
        "competitor_research_risk": 0.73,
        "estimated_lost_sales_monthly": 29,
        "estimated_revenue_impact_annual": 870000
    }
}
```

---

## REQUERIMIENTO 2: EXTRACCIÓN DE FUENTES

Por cada respuesta, necesito:
1. **URLs explícitas** citadas en la respuesta
2. **Dominios mencionados** (aunque no sean URLs completas)
3. **Tipo de fuente**: review site, foro, medio, oficial, wikipedia
4. **Sentimiento de la fuente** hacia la marca

**Output esperado:**
```json
{
    "sources_extracted": [
        {
            "mention": "What Car?",
            "domain": "whatcar.com",
            "type": "automotive_review",
            "context": "received 4/5 stars in What Car?",
            "sentiment": "positive"
        },
        {
            "mention": "Trustpilot",
            "domain": "trustpilot.com", 
            "type": "user_reviews",
            "context": "mixed reviews on Trustpilot for after-sales",
            "sentiment": "negative"
        }
    ]
}
```

---

## REQUERIMIENTO 3: MATRIZ COMPETITIVA AUTOMÁTICA

Por cada respuesta comparativa:

```json
{
    "question": "Which is better, KIA or Toyota?",
    "competitors_mentioned": ["Toyota", "Hyundai", "Honda"],
    
    "competitive_analysis": {
        "winner": "Toyota",
        "loser": "KIA",
        "tie": false,
        "winner_reasons": ["reliability", "resale value"],
        "kia_strengths_mentioned": ["warranty", "features"],
        "kia_weaknesses_mentioned": ["brand perception", "resale"]
    },
    
    "recommendation": {
        "explicitly_recommends": "Toyota",
        "explicitly_avoids": null,
        "hedge_language": true  # "depends on your priorities"
    }
}
```

---

## REQUERIMIENTO 4: PREDICTOR DE CONSECUENCIAS

Un modelo/prompt que dado una respuesta negativa, prediga:

```json
{
    "consequence_prediction": {
        "user_next_actions": [
            {"action": "research_competitor", "probability": 0.73, "likely_competitors": ["Toyota", "VW"]},
            {"action": "abandon_purchase", "probability": 0.28},
            {"action": "visit_dealer_anyway", "probability": 0.45},
            {"action": "seek_second_opinion", "probability": 0.62}
        ],
        
        "business_impact": {
            "monthly_searches_estimate": 2400,
            "affected_conversions_estimate": 29,
            "revenue_at_risk_annual": 870000,
            "confidence": 0.65
        },
        
        "narrative": "Un comprador que lea esta respuesta tiene alta probabilidad (73%) de investigar el servicio postventa de competidores como Toyota o Volkswagen. Dado que el postventa es factor decisivo en ~40% de compras de este segmento, estimamos un impacto de €870K/año en UK."
    }
}
```

---

## REQUERIMIENTO 5: DETECCIÓN NODO VS WEB

Por cada respuesta:

```json
{
    "response_source": {
        "type": "WEB_SEARCH",  // o "NODE" o "MIXED"
        "confidence": 0.85,
        "indicators": [
            "mentions recent dates (2025, 2026)",
            "cites specific URLs",
            "includes 'according to' phrases"
        ],
        "influenceability": "HIGH",  // HIGH, MEDIUM, LOW
        "recommended_action": "Content creation + PR in identified sources"
    }
}
```

---

## REQUERIMIENTO 6: TRACKING TEMPORAL

```json
{
    "question_id": 123,
    "snapshots": [
        {
            "date": "2026-01-01",
            "answer_hash": "abc123",
            "sentiment_score": -5,
            "key_changes": null
        },
        {
            "date": "2026-01-15",
            "answer_hash": "def456",
            "sentiment_score": -3,
            "key_changes": ["removed mention of 'poor service'", "added warranty info"]
        }
    ],
    "volatility_score": 0.7,  // 0=estable, 1=muy volátil
    "trend": "IMPROVING"  // IMPROVING, STABLE, DECLINING
}
```

---

## REQUERIMIENTO 7: ANÁLISIS DE CONSISTENCIA

Hacer la MISMA pregunta N veces y medir varianza:

```json
{
    "question": "Is KIA a reliable brand?",
    "consistency_analysis": {
        "samples": 10,
        "unique_answers": 4,
        "sentiment_variance": 2.3,
        "consistency_score": 0.6,  // 0=muy inconsistente, 1=siempre igual
        
        "key_variations": [
            "Sometimes mentions 'top 10 reliability', sometimes doesn't",
            "Competitor order varies: Toyota/Hyundai/Honda",
            "Warranty length sometimes wrong (says 5 years vs 7)"
        ],
        
        "recommendation": "HIGH OPPORTUNITY - Inconsistent response means easily influenceable"
    }
}
```

---

## REQUERIMIENTO 8: DASHBOARD QUE HAGA DAÑO

**Cita de Javi:**
> "la idea es hacer daño"
> "jugar con el miedo"
> "el directivo de esto, se caga"

**Elementos del dashboard:**

### Panel 1: Contador de Dolor
```
╔════════════════════════════════════════════════════════╗
║  🔴 13 PUNTOS CRÍTICOS         ⚠️ 24 REQUIEREN ATENCIÓN ║
║                                                          ║
║  💰 IMPACTO ESTIMADO: £4.2M/año en ventas perdidas      ║
║     ↳ Por respuestas negativas en preguntas de compra   ║
╚════════════════════════════════════════════════════════╝
```

### Panel 2: Competidores que te Roban
```
╔══════════════════════════════════════════════════════════════╗
║  🏆 COMPETIDORES BENEFICIÁNDOSE DE TUS PUNTOS DÉBILES        ║
║                                                               ║
║  Toyota     ████████████████ 23 preguntas donde te supera    ║
║  Hyundai    ██████████████   18 preguntas                    ║
║  VW         ████████         12 preguntas                    ║
║                                                               ║
║  → Click para ver QUÉ dicen de ellos que no dicen de ti     ║
╚══════════════════════════════════════════════════════════════╝
```

### Panel 3: Consecuencias Predichas
```
╔══════════════════════════════════════════════════════════════╗
║  ⚠️ SI NO ACTÚAS, ESTO ES LO QUE PASARÁ:                     ║
║                                                               ║
║  📉 2,400 compradores/mes leerán que tu postventa es "poor"  ║
║  📉 1,750 de ellos consultarán a Toyota o VW                 ║
║  📉 ~500 abandonarán la compra de KIA                        ║
║                                                               ║
║  💀 Tu inversión en TV de £15M puede estar siendo anulada    ║
║     por 3 párrafos en ChatGPT                                ║
╚══════════════════════════════════════════════════════════════╝
```

### Panel 4: Fuentes que te Están Matando
```
╔══════════════════════════════════════════════════════════════╗
║  📰 FUENTES QUE CHATGPT USA PARA HABLAR MAL DE TI            ║
║                                                               ║
║  1. Trustpilot (12 menciones) - Reviews negativas de servicio║
║  2. Reddit r/electricvehicles - Thread sobre problemas EV6   ║
║  3. What Car? - Review desactualizada (2023)                 ║
║                                                               ║
║  → Si arreglas ESTAS 3 fuentes, impactas el 60% del problema║
╚══════════════════════════════════════════════════════════════╝
```

---

# PARTE 3: PRIORIDADES

## URGENTE (Esta semana)
1. ✅ Arreglar clasificador crítico/no crítico
2. ✅ Implementar scoring multidimensional
3. ✅ Extracción de fuentes

## IMPORTANTE (2 semanas)
4. 🔄 Matriz competitiva automática
5. 🔄 Detección nodo vs web
6. 🔄 Dashboard "que haga daño"

## SIGUIENTE FASE (1 mes)
7. ⏳ Predictor de consecuencias con IA
8. ⏳ Tracking temporal
9. ⏳ Análisis de consistencia

---

# PARTE 4: MÉTRICAS DE ÉXITO

**¿Cómo sabemos que el producto funciona?**

| Métrica | Actual | Target |
|---------|--------|--------|
| Preguntas correctamente clasificadas como críticas | 0% | >90% |
| Fuentes extraídas por respuesta | 0 | >3 promedio |
| Predicción de consecuencias | No existe | Disponible |
| Tiempo de generación de informe | Manual | <5 min automático |
| Conversión de demo a cliente | ? | >20% |

---

# ANEXO: DATOS CRUDOS DEL ANÁLISIS

## Top 10 Preguntas con Más Dolor (Score Negativo)

| # | Score | Pregunta |
|---|-------|----------|
| 1 | -9 | Is there anything negative I should know before buying a KIA? |
| 2 | -8 | Is KIA an innovative brand in technology? |
| 3 | -7 | What is KIA's after-sales service like? |
| 4 | -7 | Does the KIA EV6 have any known problems? |
| 5 | -6 | What is the KIA EV9 like? |
| 6 | -6 | Which brand has better after-sales service, KIA or Volkswagen? |
| 7 | -5 | Are KIA cars safe? |
| 8 | -5 | What driver assistance systems does KIA have? |
| 9 | -5 | Which brand gives you more for your money, KIA or Volkswagen? |
| 10 | -5 | Which is better, KIA or Nissan? |

## Distribución de Sentimiento

```
MUY NEGATIVO (≤-5):   10 ( 5.1%) ████
NEGATIVO (-4 a -1):   14 ( 7.1%) █████
NEUTRAL (0):          36 (18.3%) ████████████
POSITIVO (1 a 4):     57 (28.9%) ████████████████████
MUY POSITIVO (≥5):    80 (40.6%) ████████████████████████████
```

## Fuentes Principales (por frecuencia de mención)

1. carwow.co.uk: 166
2. What Car?: 154
3. Auto Express: 90
4. Wikipedia: 83
5. Consumer Reports: 44
6. Reddit: 40
7. Top Gear: 32
8. kbb.com: 28
9. Euro NCAP: 21
10. Autocar: 18

---

**FIN DEL DOCUMENTO**

*Este documento contiene información sensible sobre deficiencias del producto.*
*No compartir con clientes hasta que los problemas estén resueltos.*
