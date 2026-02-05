# 🔴 CORRECCIONES ADICIONALES - ESTRUCTURA MULTI-STAKEHOLDER
## "Así podemos tocar varios líderes de departamento a la vez y acumular más presupuestos" - Miguel

**Fecha:** 13 Enero 2026  
**Prioridad:** ALTA - Define el modelo de negocio  
**Contexto:** Miguel pidió explícitamente esta estructura. NO está implementada.

---

# ⛔ EL PROBLEMA FUNDAMENTAL

## Lo que Miguel pidió textualmente:

> "Yo haría un informe más tecnológico. Y donde el user pueda interactuar.
> Ver el total de preguntas, hacer click y desplegar...
> Ver la respuesta, ver los puntos de dolor en modo esquema.
> **'Motor' (le da click y ve todo lo referente a motor)**
> **'Atención al cliente' y ve todo lo de ahí**
> **Así podemos tocar varios líderes de departamento a la vez**
> **Y acumular más presupuestos**"

## Lo que el dashboard tiene:

- `funnel_stage`: VALIDATION, TRANSACTIONAL, CONSIDERATION, AWARENESS, OTHER
- **NO HAY** categoría por departamento
- **NO HAY** drill-down interactivo
- **NO HAY** vista por área temática

## Consecuencia de negocio:

```
AHORA:                           CON LA ESTRUCTURA DE MIGUEL:
------                           ----------------------------
1 presentación al CMO            1 presentación al CMO
1 presupuesto                    + 1 al Dir. Postventa (ve su sección)
= £10-15K                        + 1 al Dir. Técnico EV (ve su sección)
                                 + 1 al PM de EV6 (ve su modelo)
                                 + 1 al Dir. Calidad (ve fiabilidad)
                                 = £50-75K del MISMO INFORME
```

---

# 📊 NUEVA ESTRUCTURA DE DATOS REQUERIDA

## Campos a AÑADIR al JSON:

```javascript
{
    "id": "2364",
    "question": "What is KIA's after-sales service like?",
    
    // CAMPOS EXISTENTES...
    
    // ✅ NUEVOS CAMPOS REQUERIDOS:
    "department": "POSTVENTA",           // Departamento responsable
    "block": "1_DIRECTAS_MARCA",         // Bloque de Miguel
    "model": null,                       // Modelo específico si aplica
    "responsible_role": "Director de Postventa",
    "tags": ["service", "warranty", "dealer"],
    
    // Para drill-down:
    "pain_points": [
        {
            "text": "poor experiences with customer service",
            "severity": "HIGH",
            "source": "trustpilot.com"
        },
        {
            "text": "long wait times for parts",
            "severity": "MEDIUM",
            "source": "reddit.com"
        }
    ]
}
```

## Categorías por DEPARTAMENTO:

| Departamento | Responsable | Preguntas | Críticas | Impacto £ |
|--------------|-------------|-----------|----------|-----------|
| MODELO_EV6 | Product Manager EV6 | 17 | 3 🔴 | £25.6M |
| POSTVENTA | Dir. Customer Experience | 6 | 1 🔴 | £8.6M |
| MARCA_Y_REPUTACIÓN | Dir. Marketing | 9 | 1 🔴 | £8.6M |
| PRECIO_Y_VALOR | Dir. Comercial | 22 | 0 | £20.9M |
| MODELO_SPORTAGE | PM Sportage | 13 | 0 | £12.2M |
| MODELO_EV9 | PM EV9 | 7 | 0 | £7.2M |
| SEGURIDAD | Dir. Producto | 6 | 0 | £5.0M |
| BATERÍA_Y_CARGA | Dir. Técnico EV | 9 | 0 | £1.4M |

## Categorías por BLOQUE de Miguel:

| Bloque | Descripción | Preguntas | Críticas |
|--------|-------------|-----------|----------|
| 1_DIRECTAS_MARCA | Sobre KIA como marca | 59 | 2 🔴 |
| 2_COMPARATIVAS | KIA vs competidores | 36 | 1 🔴 |
| 3_COMERCIALES | Usuario genérico | 30 | 0 |
| 4_TRANSACCIONAL | Usuario listo para comprar | 21 | 2 🔴 |
| 5_MODELOS_ESPECÍFICOS | EV6, EV9, Sportage... | 51 | 1 🔴 |

---

# 🖥️ NUEVO DISEÑO DE DASHBOARD

## Estructura de navegación:

```
┌─────────────────────────────────────────────────────────────────────┐
│  RADARIA - KIA UK                                    197 preguntas  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ RESUMEN EJECUTIVO                              £165.6M risk │   │
│  │ 6 Critical | 11 Warning | 180 OK                            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ═══════════════════════════════════════════════════════════════   │
│  📁 POR DEPARTAMENTO (click para expandir)                         │
│  ═══════════════════════════════════════════════════════════════   │
│                                                                     │
│  ▶ 🔴 MODELO_EV6         17 preguntas | 3 crit | £25.6M    [+]     │
│  ▶ 🔴 POSTVENTA           6 preguntas | 1 crit | £8.6M     [+]     │
│  ▶ 🔴 MARCA_Y_REPUTACIÓN  9 preguntas | 1 crit | £8.6M     [+]     │
│  ▶ 🟡 PRECIO_Y_VALOR     22 preguntas | 0 crit | £20.9M    [+]     │
│  ▶ 🟢 SEGURIDAD           6 preguntas | 0 crit | £5.0M     [+]     │
│  ▶ 🟢 BATERÍA_Y_CARGA     9 preguntas | 0 crit | £1.4M     [+]     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Al hacer click en "POSTVENTA" se expande:

```
┌─────────────────────────────────────────────────────────────────────┐
│  ▼ 🔴 POSTVENTA           6 preguntas | 1 crit | £8.6M     [-]     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Responsable: Director de Postventa / Customer Experience          │
│  Impacto estimado: £8.6M/año                                       │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 🔴 CRÍTICA                                                     │ │
│  │ "What is KIA's after-sales service like?"                     │ │
│  │                                                                │ │
│  │ Pain Score: -15 | Abandonment Risk: 32%                       │ │
│  │                                                                │ │
│  │ 📍 Puntos de Dolor:                                           │ │
│  │   • "poor experiences with customer service"                  │ │
│  │   • "long wait times for parts"                               │ │
│  │   • "inconsistent dealer quality"                             │ │
│  │                                                                │ │
│  │ 📰 Fuentes del problema:                                      │ │
│  │   • Trustpilot (3.2★) - 12 menciones                         │ │
│  │   • Reddit r/kia - 8 menciones                                │ │
│  │                                                                │ │
│  │ 🎯 Acción recomendada:                                        │ │
│  │   Mejorar ratings en Trustpilot + responder reviews          │ │
│  │   Timeline: 4-6 semanas | ROI esperado: £3.2M               │ │
│  │                                                                │ │
│  │ [Ver respuesta completa ▼]                                    │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 🟡 WARNING                                                     │ │
│  │ "Which brand has better after-sales service, KIA or VW?"     │ │
│  │ Pain Score: -6 | Loses to: Volkswagen                        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ 🟢 OK                                                          │ │
│  │ "Does KIA have a good warranty?"                              │ │
│  │ Pain Score: +4 | Positive                                     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 💻 IMPLEMENTACIÓN TÉCNICA

## 1. Función para categorizar preguntas

```javascript
function categorizeByDepartment(question) {
    const q = question.toLowerCase();
    
    const rules = [
        { keywords: ['after-sales', 'service', 'dealer', 'warranty', 'customer'], dept: 'POSTVENTA' },
        { keywords: ['battery', 'charging', 'range', 'kwh', 'autonomía'], dept: 'BATERÍA_Y_CARGA' },
        { keywords: ['safe', 'safety', 'ncap', 'crash', 'airbag', 'adas'], dept: 'SEGURIDAD' },
        { keywords: ['engine', 'motor', 'horsepower', 'torque', 'performance'], dept: 'MOTOR_Y_RENDIMIENTO' },
        { keywords: ['price', 'value', 'money', 'cost', 'worth', 'financing'], dept: 'PRECIO_Y_VALOR' },
        { keywords: ['technology', 'tech', 'screen', 'infotainment', 'software'], dept: 'TECNOLOGÍA' },
        { keywords: ['design', 'space', 'interior', 'trunk', 'seats'], dept: 'DISEÑO_Y_ESPACIO' },
        { keywords: ['ev6'], dept: 'MODELO_EV6' },
        { keywords: ['ev9'], dept: 'MODELO_EV9' },
        { keywords: ['ev3'], dept: 'MODELO_EV3' },
        { keywords: ['sportage'], dept: 'MODELO_SPORTAGE' },
        { keywords: ['sorento'], dept: 'MODELO_SORENTO' },
        { keywords: ['niro'], dept: 'MODELO_NIRO' },
        { keywords: ['brand', 'reputation', 'image', 'perception'], dept: 'MARCA_Y_REPUTACIÓN' },
        { keywords: ['reliable', 'reliability', 'problem', 'issue', 'quality'], dept: 'FIABILIDAD' },
        { keywords: ['vs', 'versus', 'better', 'compare'], dept: 'COMPARATIVAS' },
    ];
    
    for (const rule of rules) {
        if (rule.keywords.some(kw => q.includes(kw))) {
            return rule.dept;
        }
    }
    return 'GENERAL';
}

function categorizeByBlock(question) {
    const q = question.toLowerCase();
    
    if (['buy', 'purchase', 'offer', 'discount', 'financing', 'renting'].some(kw => q.includes(kw))) {
        return '4_TRANSACCIONAL';
    }
    if (['vs', 'versus', 'better', ' or '].some(kw => q.includes(kw))) {
        return '2_COMPARATIVAS';
    }
    if (['best car', 'best suv', 'best electric', 'recommend', 'which car'].some(kw => q.includes(kw))) {
        return '3_COMERCIALES';
    }
    if (['ev6', 'ev9', 'ev3', 'sportage', 'sorento', 'niro', 'ceed'].some(kw => q.includes(kw))) {
        return '5_MODELOS_ESPECÍFICOS';
    }
    return '1_DIRECTAS_MARCA';
}

const RESPONSIBLE_MAP = {
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
    'MARCA_Y_REPUTACIÓN': 'Director de Marketing',
    'FIABILIDAD': 'Director de Calidad',
    'COMPARATIVAS': 'Director de Estrategia',
    'GENERAL': 'CMO / Director General',
};
```

## 2. Componente de categoría expandible

```javascript
function DepartmentSection({ department, questions }) {
    const [expanded, setExpanded] = useState(false);
    
    const criticalCount = questions.filter(q => q.criticality === 'CRITICAL').length;
    const warningCount = questions.filter(q => q.criticality === 'WARNING').length;
    const totalImpact = questions.reduce((sum, q) => sum + q.annual_revenue_impact, 0);
    
    const statusIcon = criticalCount > 0 ? '🔴' : warningCount > 0 ? '🟡' : '🟢';
    
    return (
        <div className="department-section">
            <div 
                className="department-header" 
                onClick={() => setExpanded(!expanded)}
            >
                <span className="status-icon">{statusIcon}</span>
                <span className="department-name">{department}</span>
                <span className="question-count">{questions.length} preguntas</span>
                <span className="critical-count">{criticalCount > 0 ? `${criticalCount} crit` : ''}</span>
                <span className="impact">£{(totalImpact/1000000).toFixed(1)}M</span>
                <span className="expand-icon">{expanded ? '[-]' : '[+]'}</span>
            </div>
            
            {expanded && (
                <div className="department-content">
                    <div className="responsible">
                        Responsable: {RESPONSIBLE_MAP[department]}
                    </div>
                    
                    {/* Primero las CRITICAL */}
                    {questions
                        .filter(q => q.criticality === 'CRITICAL')
                        .map(q => <QuestionCard key={q.id} question={q} />)}
                    
                    {/* Luego las WARNING */}
                    {questions
                        .filter(q => q.criticality === 'WARNING')
                        .map(q => <QuestionCard key={q.id} question={q} />)}
                    
                    {/* Finalmente las OK (colapsadas por defecto) */}
                    <details>
                        <summary>
                            {questions.filter(q => !['CRITICAL', 'WARNING'].includes(q.criticality)).length} preguntas OK
                        </summary>
                        {questions
                            .filter(q => !['CRITICAL', 'WARNING'].includes(q.criticality))
                            .map(q => <QuestionCardMini key={q.id} question={q} />)}
                    </details>
                </div>
            )}
        </div>
    );
}
```

## 3. Componente de pregunta con puntos de dolor

```javascript
function QuestionCard({ question }) {
    const [showAnswer, setShowAnswer] = useState(false);
    
    return (
        <div className={`question-card ${question.criticality.toLowerCase()}`}>
            <div className="question-header">
                <span className="criticality-badge">{question.criticality}</span>
                <span className="question-text">{question.question}</span>
            </div>
            
            <div className="question-metrics">
                <span>Pain Score: {question.pain_score}</span>
                <span>Abandonment Risk: {(question.abandonment_risk * 100).toFixed(0)}%</span>
                <span>Impact: £{(question.annual_revenue_impact/1000000).toFixed(1)}M/yr</span>
            </div>
            
            {/* PUNTOS DE DOLOR - Lo que Miguel pidió */}
            <div className="pain-points">
                <h4>📍 Puntos de Dolor:</h4>
                <ul>
                    {question.negative_triggers.map((trigger, i) => (
                        <li key={i} className="pain-point">{trigger}</li>
                    ))}
                </ul>
            </div>
            
            {/* FUENTES DEL PROBLEMA */}
            <div className="sources">
                <h4>📰 Fuentes del problema:</h4>
                <ul>
                    {question.sources.slice(0, 3).map((source, i) => (
                        <li key={i}>
                            {source.source_domain} 
                            {source.sentiment === 'NEGATIVE' && ' ⚠️'}
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* ACCIÓN RECOMENDADA */}
            {question.criticality === 'CRITICAL' && (
                <div className="recommended-action">
                    <h4>🎯 Acción recomendada:</h4>
                    <p>{generateRecommendation(question)}</p>
                </div>
            )}
            
            {/* RESPUESTA COMPLETA (expandible) */}
            <button onClick={() => setShowAnswer(!showAnswer)}>
                {showAnswer ? 'Ocultar respuesta ▲' : 'Ver respuesta completa ▼'}
            </button>
            {showAnswer && (
                <div className="full-answer">
                    {question.answer}
                </div>
            )}
        </div>
    );
}
```

## 4. Vista de navegación por pestañas

```javascript
function Dashboard({ data }) {
    const [viewMode, setViewMode] = useState('department'); // 'department' | 'block' | 'all'
    const [selectedDept, setSelectedDept] = useState(null);
    
    // Agrupar datos
    const byDepartment = groupBy(data, q => categorizeByDepartment(q.question));
    const byBlock = groupBy(data, q => categorizeByBlock(q.question));
    
    return (
        <div className="dashboard">
            {/* TABS DE NAVEGACIÓN */}
            <div className="view-tabs">
                <button 
                    className={viewMode === 'department' ? 'active' : ''}
                    onClick={() => setViewMode('department')}
                >
                    Por Departamento
                </button>
                <button 
                    className={viewMode === 'block' ? 'active' : ''}
                    onClick={() => setViewMode('block')}
                >
                    Por Tipo de Pregunta
                </button>
                <button 
                    className={viewMode === 'all' ? 'active' : ''}
                    onClick={() => setViewMode('all')}
                >
                    Todas las Preguntas
                </button>
            </div>
            
            {/* CONTENIDO SEGÚN MODO */}
            {viewMode === 'department' && (
                <div className="by-department">
                    {Object.entries(byDepartment)
                        .sort((a, b) => {
                            // Ordenar por número de críticos, luego por impacto
                            const critA = a[1].filter(q => q.criticality === 'CRITICAL').length;
                            const critB = b[1].filter(q => q.criticality === 'CRITICAL').length;
                            if (critB !== critA) return critB - critA;
                            const impactA = a[1].reduce((s, q) => s + q.annual_revenue_impact, 0);
                            const impactB = b[1].reduce((s, q) => s + q.annual_revenue_impact, 0);
                            return impactB - impactA;
                        })
                        .map(([dept, questions]) => (
                            <DepartmentSection 
                                key={dept}
                                department={dept}
                                questions={questions}
                            />
                        ))
                    }
                </div>
            )}
            
            {viewMode === 'block' && (
                <div className="by-block">
                    {Object.entries(byBlock)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map(([block, questions]) => (
                            <BlockSection 
                                key={block}
                                block={block}
                                questions={questions}
                            />
                        ))
                    }
                </div>
            )}
        </div>
    );
}
```

---

# 📋 CHECKLIST DE IMPLEMENTACIÓN

## Fase 1: Datos (Backend)
- [ ] Añadir campo `department` a cada registro
- [ ] Añadir campo `block` a cada registro
- [ ] Añadir campo `responsible_role` a cada registro
- [ ] Extraer `pain_points` estructurados de cada respuesta
- [ ] Regenerar JSON con nuevos campos

## Fase 2: UI (Frontend)
- [ ] Implementar vista por departamento con drill-down
- [ ] Implementar vista por bloque de Miguel
- [ ] Crear componente de pregunta expandible
- [ ] Mostrar puntos de dolor en formato esquema
- [ ] Añadir sección de acción recomendada
- [ ] Implementar tabs de navegación

## Fase 3: Usabilidad
- [ ] Ordenar departamentos por criticidad (🔴 primero)
- [ ] Permitir expandir/colapsar todas las secciones
- [ ] Añadir filtros (solo críticos, solo warnings)
- [ ] Export PDF por departamento (para cada stakeholder)

---

# 🎯 RESULTADO ESPERADO

## Antes (dashboard actual):
```
1 presentación → CMO → 1 presupuesto → £10-15K
```

## Después (con estructura de Miguel):
```
1 presentación → CMO
              → Dir. Postventa (ve su sección)     → £10-15K
              → Dir. Técnico EV (ve EV6, batería)  → £10-15K
              → PM EV6 (ve su modelo)              → £5-10K
              → Dir. Marketing (ve marca)          → £10-15K
              → Dir. Comercial (ve precios)        → £10-15K
─────────────────────────────────────────────────────────────
TOTAL: £55-85K del MISMO CLIENTE
```

**Multiplicamos x4-5 el ticket promedio.**

---

# ⏰ TIMELINE

| Tarea | Tiempo | Responsable |
|-------|--------|-------------|
| Añadir campos al JSON | 2 horas | DEV Backend |
| UI drill-down básico | 4 horas | DEV Frontend |
| Puntos de dolor estructurados | 2 horas | DEV Backend |
| Tabs de navegación | 2 horas | DEV Frontend |
| Componente pregunta expandible | 3 horas | DEV Frontend |
| Testing y ajustes | 2 horas | QA |

**Total: ~15 horas = 2 días de desarrollo**

---

**Este cambio NO es cosmético. Define si vendemos £15K o £75K por cliente.**

