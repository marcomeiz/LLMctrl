# 🔴 CORRECCIONES OBLIGATORIAS - RADARIA DASHBOARD
## DOCUMENTO PARA DESARROLLO - SIN NEGOCIACIÓN

**Fecha:** 13 Enero 2026  
**Prioridad:** BLOCKER - No se presenta a cliente hasta que esté resuelto  
**Tiempo máximo:** 24 horas

---

# ⛔ ERRORES QUE MATAN EL PRODUCTO

## ERROR #1: LOS NÚMEROS NO CUADRAN

### Problema
```
Dashboard muestra:  6 CRITICAL | 11 WARNINGS | 187 POSITIVE
JSON tiene:         6 CRITICAL | 11 WARNINGS | 107 POSITIVE + 73 NEUTRAL

6 + 11 + 187 = 204 preguntas
Pero solo hay 197 preguntas en el dataset
```

### Por qué es grave
Un CFO o analista detecta esto en 10 segundos. Si los números básicos no cuadran, **todo el informe pierde credibilidad**. Nos tacharán de chapuceros.

### Corrección EXACTA
```javascript
// En renderDashboard() o donde calcules los totales:

const criticalCount = radariaData.filter(q => q.criticality === 'CRITICAL').length;
const warningCount = radariaData.filter(q => q.criticality === 'WARNING').length;
const neutralCount = radariaData.filter(q => q.criticality === 'NEUTRAL').length;
const positiveCount = radariaData.filter(q => q.criticality === 'POSITIVE').length;

// VERIFICACIÓN - Esto debe dar 197
const total = criticalCount + warningCount + neutralCount + positiveCount;
console.assert(total === 197, `Total debe ser 197, es ${total}`);

// Mostrar en el banner:
// Opción A: Mostrar las 4 categorías
// 6 CRITICAL | 11 WARNING | 73 NEUTRAL | 107 POSITIVE

// Opción B: Agrupar neutral + positive como "OK"
// 6 CRITICAL | 11 WARNING | 180 OK
```

### Verificación
- [ ] La suma de todas las categorías = 197
- [ ] El banner muestra números correctos
- [ ] Hay un console.log que verifica la suma al cargar

---

## ERROR #2: £165.6M SIN JUSTIFICACIÓN CREÍBLE

### Problema
El número £165.6M aparece sin desglose. La fórmula mostrada no explica cómo se llega a ese número.

```
Fórmula mostrada: 2,000 searches × 1.2% conversion × £30K
Pero: 197 × 2000 × 12 × 0.012 × 30000 = £1.7 BILLONES (absurdo)
```

### Por qué es grave
Un director financiero va a preguntar: "¿Cómo calculaste esto?" Si no podemos explicarlo, perdemos credibilidad y la venta.

### Corrección EXACTA

**Opción A: Usar los datos que YA tienes en el JSON**

```javascript
// El JSON ya tiene annual_revenue_impact por pregunta
// Solo suma los que son CRITICAL y WARNING (los que realmente duelen)

const criticalImpact = radariaData
    .filter(q => q.criticality === 'CRITICAL')
    .reduce((sum, q) => sum + q.annual_revenue_impact, 0);

const warningImpact = radariaData
    .filter(q => q.criticality === 'WARNING')
    .reduce((sum, q) => sum + q.annual_revenue_impact, 0);

const totalImpact = criticalImpact + warningImpact;

// Mostrar desglosado:
// £22.3M from 6 CRITICAL questions
// £18.7M from 11 WARNING questions
// Total: £41M at risk
```

**Opción B: Recalcular con fórmula transparente**

```javascript
// Solo calcular impacto de preguntas con riesgo real
const calculateImpact = (question) => {
    const monthlySearches = 2000;  // Estimación conservadora
    const conversionRate = 0.012; // 1.2%
    const avgPrice = 30000;       // £30K
    
    // El impacto es proporcional al riesgo de abandono
    return monthlySearches * conversionRate * avgPrice * 12 * question.abandonment_risk;
};

// Solo sumar CRITICAL y WARNING
const totalImpact = radariaData
    .filter(q => ['CRITICAL', 'WARNING'].includes(q.criticality))
    .reduce((sum, q) => sum + calculateImpact(q), 0);
```

### Nueva visualización del banner

```html
<div class="pain-banner">
    <div class="pain-title">Revenue at Risk from Negative LLM Responses</div>
    
    <div class="pain-breakdown-detailed">
        <div class="pain-row critical">
            <span class="pain-label">6 CRITICAL questions</span>
            <span class="pain-value">£22.3M/year</span>
            <span class="pain-detail">72% avg abandonment risk</span>
        </div>
        <div class="pain-row warning">
            <span class="pain-label">11 WARNING questions</span>
            <span class="pain-value">£18.7M/year</span>
            <span class="pain-detail">45% avg abandonment risk</span>
        </div>
        <div class="pain-row total">
            <span class="pain-label">TOTAL AT RISK</span>
            <span class="pain-value">£41M/year</span>
        </div>
    </div>
    
    <div class="pain-methodology">
        Based on: 2,000 monthly searches per question × 1.2% conversion × £30K avg price × abandonment risk
    </div>
</div>
```

### Verificación
- [ ] El número total es la SUMA de los individuales
- [ ] Solo cuenta CRITICAL + WARNING (no todas las preguntas)
- [ ] La metodología está visible y es verificable
- [ ] Un analista puede replicar el cálculo

---

## ERROR #3: FALSO POSITIVO EN CRITICAL

### Problema
```
Pregunta: "Is the rear-wheel drive or all-wheel drive KIA EV6 better?"
Clasificación actual: CRITICAL
Pain Score: -13
```

**Esto NO es crítico.** Es una pregunta comparando DOS VERSIONES DEL MISMO COCHE DE KIA. No hay nada negativo hacia la marca.

### Por qué es grave
Si un ejecutivo de KIA ve esto, va a decir: "¿Por qué es malo que pregunten qué versión de mi coche es mejor?" Y perderemos credibilidad.

### Corrección EXACTA

**Opción A: Reclasificar en el JSON**

```javascript
// En el proceso de análisis, añadir filtro:
const isInternalComparison = (question) => {
    const q = question.toLowerCase();
    // Detectar comparaciones internas de la marca
    const internalPatterns = [
        /rear.?wheel.*all.?wheel/i,
        /rwd.*awd/i,
        /which (version|trim|model) of/i,
        /(\w+) or (\w+) (kia|ev6|ev9|sportage)/i,
    ];
    return internalPatterns.some(p => p.test(q));
};

// Si es comparación interna, bajar criticidad
if (isInternalComparison(question.question) && question.criticality === 'CRITICAL') {
    question.criticality = 'NEUTRAL';
    question.pain_score = 0;
    question.note = 'Internal product comparison - not brand-negative';
}
```

**Opción B: Añadir nota explicativa en el dashboard**

```javascript
// Si no puedes cambiar el JSON, al menos explica en el UI
if (question.question.includes('rear-wheel drive or all-wheel drive')) {
    return `
        <div class="critical-item neutral-override">
            <div class="critical-question">${question.question}</div>
            <div class="critical-note">
                ℹ️ Internal comparison (RWD vs AWD) - not brand negative
            </div>
        </div>
    `;
}
```

**Opción C: Excluir de la lista CRITICAL**

```javascript
// En renderCriticalQuestions()
const critical = radariaData
    .filter(q => q.criticality === 'CRITICAL' || q.criticality === 'WARNING')
    .filter(q => !q.question.includes('rear-wheel drive or all-wheel drive')) // Excluir falso positivo
    .sort((a, b) => a.pain_score - b.pain_score)
    .slice(0, 8);
```

### Verificación
- [ ] La pregunta RWD/AWD NO aparece como CRITICAL
- [ ] Si aparece, tiene nota explicativa
- [ ] El contador de "6 CRITICAL" se ajusta a "5 CRITICAL" si se excluye

---

## ERROR #4: TÍTULO MISLEADING EN SOURCES

### Problema
```
Título actual: "SOURCES CHATGPT USES AGAINST YOU"
Realidad: La mayoría de fuentes tienen sentiment NEUTRAL o POSITIVE
```

### Por qué es grave
El título implica que TODAS estas fuentes son negativas. No es verdad. Estamos mintiendo al cliente.

### Corrección EXACTA

```html
<!-- ANTES -->
<div class="card-title">Sources ChatGPT Uses Against You</div>

<!-- DESPUÉS -->
<div class="card-title">Top Sources Influencing ChatGPT Responses</div>
```

Y colorear por sentiment real:

```javascript
function renderSourceList() {
    // ... código existente ...
    
    container.innerHTML = sources.map(s => {
        // Determinar clase por sentiment REAL
        let sentimentClass = 'neutral';
        if (s.sentiment === 'negative' || s.negativeRatio > 0.5) {
            sentimentClass = 'negative';
        } else if (s.sentiment === 'positive' || s.positiveRatio > 0.5) {
            sentimentClass = 'positive';
        }
        
        return `
            <div class="source-item ${sentimentClass}">
                <div class="source-sentiment-indicator ${sentimentClass}">
                    ${sentimentClass === 'negative' ? '⚠️' : sentimentClass === 'positive' ? '✅' : '○'}
                </div>
                <div class="source-domain">${s.domain}</div>
                <div class="source-count">${s.count}</div>
            </div>
        `;
    }).join('');
}
```

### Verificación
- [ ] El título NO dice "Against You" 
- [ ] Cada fuente tiene indicador visual de sentiment
- [ ] Las fuentes negativas están claramente marcadas vs las positivas

---

## ERROR #5: BARRA DE COMPETIDORES SIN CLARIDAD

### Problema
```
Toyota    109     3 wins
Hyundai   105     3 wins
```
¿Qué es 109? ¿Menciones? ¿Y por qué ordenar por menciones si lo que importa son los "wins"?

### Corrección EXACTA

```javascript
function renderCompetitorMatrix() {
    // Ordenar por WINS (amenaza real), no por menciones
    const competitors = Object.entries(competitorMentions)
        .map(([brand, mentions]) => ({
            brand,
            mentions,
            losses: competitorLosses[brand] || 0  // "losses" = veces que KIA pierde contra ellos
        }))
        .sort((a, b) => b.losses - a.losses)  // ORDENAR POR LOSSES, NO MENCIONES
        .slice(0, 8);

    container.innerHTML = competitors.map((c, i) => `
        <div class="competitor-item ${c.losses > 0 ? 'threat' : ''}">
            <div class="competitor-rank">${i + 1}</div>
            <div class="competitor-name">${c.brand}</div>
            <div class="competitor-stats">
                <span class="competitor-wins ${c.losses > 0 ? 'danger' : ''}">
                    ${c.losses > 0 ? `🔴 Beats you ${c.losses}x` : '—'}
                </span>
                <span class="competitor-mentions">
                    Mentioned in ${c.mentions} responses
                </span>
            </div>
        </div>
    `).join('');
}
```

### Nueva visualización propuesta

```
COMPETITORS WINNING AGAINST KIA
─────────────────────────────────────────
#1  Toyota      🔴 Beats you 3x    (48 mentions)
#2  Tesla       🔴 Beats you 2x    (40 mentions)  
#3  Honda       🔴 Beats you 1x    (24 mentions)
#4  Volkswagen  🔴 Beats you 1x    (32 mentions)
─────────────────────────────────────────
    Hyundai     — (no direct wins)  (62 mentions)
    Ford        — (no direct wins)  (62 mentions)
```

### Verificación
- [ ] Ordenado por número de "wins" contra KIA
- [ ] Claro qué significa cada número
- [ ] Los competidores que realmente ganan están arriba

---

## ERROR #6: PAIN BY FUNNEL STAGE CONTRADICTORIO

### Problema
VALIDATION tiene el número más alto de críticos (dice "13 crit") pero la barra es la más corta. La visualización contradice los datos.

### Corrección EXACTA

```javascript
function renderFunnelChart() {
    // El ANCHO de la barra debe representar el RIESGO, no el total de preguntas
    
    const funnelData = {
        'VALIDATION': { total: 13, critical: 9, warning: 4, avgRisk: 0.33 },
        'TRANSACTIONAL': { total: 26, critical: 2, warning: 4, avgRisk: 0.18 },
        // etc.
    };
    
    // Calcular "danger score" para cada etapa
    Object.keys(funnelData).forEach(stage => {
        const d = funnelData[stage];
        d.dangerScore = (d.critical * 3) + (d.warning * 1.5) + (d.avgRisk * 10);
    });
    
    // Ordenar por danger score
    const stages = Object.entries(funnelData)
        .sort((a, b) => b[1].dangerScore - a[1].dangerScore);
    
    const maxDanger = Math.max(...stages.map(s => s[1].dangerScore));
    
    container.innerHTML = stages.map(([stage, data]) => `
        <div class="funnel-stage">
            <div class="funnel-label">${stage}</div>
            <div class="funnel-bar">
                <div class="funnel-bar-fill ${stage.toLowerCase()}"
                     style="width: ${(data.dangerScore / maxDanger) * 100}%">
                    ${data.critical > 0 ? `${data.critical} critical` : ''}
                </div>
            </div>
            <div class="funnel-risk">${(data.avgRisk * 100).toFixed(0)}% risk</div>
        </div>
    `).join('');
}
```

### Resultado esperado
VALIDATION debe tener la barra MÁS LARGA porque es la etapa más peligrosa (81.8% de sus preguntas tienen contenido negativo).

### Verificación
- [ ] VALIDATION tiene la barra más larga
- [ ] El ancho representa peligro, no cantidad
- [ ] Es intuitivo: barra más larga = más riesgo

---

# ✅ SECCIÓN QUE FALTA: "¿Y AHORA QUÉ?"

### Problema
El dashboard muestra problemas pero NO dice qué hacer. Un ejecutivo termina y pregunta: "Ok, ¿qué hago?"

### Corrección: Añadir sección de recomendaciones

```html
<div class="card recommendations-card">
    <div class="card-header">
        <div class="card-title">Recommended Actions</div>
        <div class="card-badge critical">PRIORITY ORDER</div>
    </div>
    <div class="card-body">
        <div class="recommendation-list">
            <div class="recommendation urgent">
                <div class="rec-priority">1</div>
                <div class="rec-content">
                    <div class="rec-title">Fix After-Sales Perception</div>
                    <div class="rec-detail">
                        3 critical questions mention "poor service". 
                        Target: Trustpilot, What Car? service reviews.
                    </div>
                    <div class="rec-impact">Potential recovery: £8.2M/year</div>
                    <div class="rec-timeline">Timeline: 2-4 weeks</div>
                </div>
            </div>
            
            <div class="recommendation high">
                <div class="rec-priority">2</div>
                <div class="rec-content">
                    <div class="rec-title">Address EV6 "Known Problems" Narrative</div>
                    <div class="rec-detail">
                        Create content contextualizing issues as resolved/minor.
                        Target: Reddit r/electricvehicles, Carwow.
                    </div>
                    <div class="rec-impact">Potential recovery: £6.1M/year</div>
                    <div class="rec-timeline">Timeline: 4-6 weeks</div>
                </div>
            </div>
            
            <div class="recommendation medium">
                <div class="rec-priority">3</div>
                <div class="rec-content">
                    <div class="rec-title">Increase Visibility in Generic Rankings</div>
                    <div class="rec-detail">
                        KIA missing from 12 "best of" queries.
                        Target: SEO + PR in top automotive publications.
                    </div>
                    <div class="rec-impact">Potential gain: £4.5M/year</div>
                    <div class="rec-timeline">Timeline: 6-8 weeks</div>
                </div>
            </div>
        </div>
    </div>
</div>
```

### Verificación
- [ ] Hay al menos 3 recomendaciones concretas
- [ ] Cada una tiene: qué hacer, dónde, impacto esperado, timeline
- [ ] Ordenadas por prioridad/impacto

---

# 📋 CHECKLIST FINAL ANTES DE PRESENTAR

## Bloqueantes (NO presentar sin esto):
- [ ] Suma de categorías = 197 exacto
- [ ] Impacto £ desglosado por criticidad
- [ ] Falso positivo RWD/AWD corregido o explicado
- [ ] Título de sources NO dice "Against You"

## Importantes (corregir antes de cliente real):
- [ ] Competidores ordenados por "wins", no menciones
- [ ] Funnel chart con VALIDATION como mayor riesgo visual
- [ ] Sección de recomendaciones añadida

## Nice to have (para versión 2.0):
- [ ] Benchmarking vs industria
- [ ] Export a PDF
- [ ] Filtros interactivos

---

# 🕐 TIMELINE

| Corrección | Tiempo estimado | Responsable |
|------------|-----------------|-------------|
| Fix suma 197 | 30 min | DEV |
| Desglose £ por criticidad | 1 hora | DEV |
| Falso positivo RWD/AWD | 30 min | DEV |
| Título sources | 15 min | DEV |
| Ordenar competidores | 45 min | DEV |
| Funnel chart visual | 1 hora | DEV |
| Sección recomendaciones | 2 horas | DEV + Analista |

**Total: ~6 horas de trabajo**

---

# ⚠️ MENSAJE FINAL

Este documento NO es sugerencia. Son **requisitos mínimos** para no quedar en ridículo frente a un cliente.

Si presentamos esto con los números inconsistentes, un analista junior lo detecta en la primera reunión y perdemos toda credibilidad.

**La calidad de los datos ES el producto.** Si los datos están mal, no tenemos nada que vender.

---

**Firma:** Análisis de Datos  
**Fecha límite:** 24 horas desde recepción  
**Escalación si no se cumple:** Directamente a dirección

