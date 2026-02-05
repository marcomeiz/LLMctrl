import { Record, Classification, CategoryId, CATEGORY_NAMES } from './data';

interface ConsumerAnalysis {
  insight: string;
  impactLevel: 'high' | 'medium' | 'low';
  recommendation: string;
}

/**
 * Generates a consumer behavior expert analysis for a given record.
 * This provides insights on what the LLM response means for users
 * from a consumer behavior perspective.
 */
export function generateConsumerAnalysis(record: Record): ConsumerAnalysis {
  const { classification, mention, ranking_list, category, triggers_detected, question_text } = record;

  const rankingPosition = ranking_list?.findIndex(b => b.toLowerCase() === 'betfair');
  const hasRanking = rankingPosition !== undefined && rankingPosition >= 0;
  const isTopPosition = hasRanking && rankingPosition === 0;
  const isLowPosition = hasRanking && rankingPosition >= 3;
  const competitorCount = ranking_list?.length || 0;

  // Determine impact level based on classification and context
  let impactLevel: 'high' | 'medium' | 'low' = 'medium';
  if (classification === 'CRITICAL') impactLevel = 'high';
  if (classification === 'OPPORTUNITY') impactLevel = 'low';

  // Generate insight based on classification, mention, and ranking
  let insight = '';
  let recommendation = '';

  // Analysis based on classification
  if (classification === 'CRITICAL') {
    if (!mention) {
      insight = `Esta respuesta representa una oportunidad perdida significativa. Cuando los usuarios buscan información sobre "${getCategoryContext(category)}", el LLM no menciona a Betfair, lo que significa que potenciales clientes están siendo dirigidos hacia competidores. En el journey de decisión del consumidor, esta ausencia puede ser determinante para la conversión.`;
      recommendation = 'Priorizar acciones de visibilidad y contenido para ser incluido en estas respuestas del LLM.';
    } else if (isLowPosition) {
      insight = `Aunque Betfair aparece mencionado, su posición #${rankingPosition + 1} de ${competitorCount} en el ranking sugiere que el LLM percibe a los competidores como opciones más relevantes. Los usuarios que reciben esta información tienden a explorar primero las opciones posicionadas arriba, reduciendo significativamente la probabilidad de conversión para Betfair.`;
      recommendation = 'Trabajar en diferenciación y autoridad de marca para mejorar el posicionamiento en respuestas.';
    } else if (triggers_detected.length > 2) {
      insight = `La respuesta contiene ${triggers_detected.length} triggers problemáticos que pueden generar percepciones negativas en el usuario. Desde la perspectiva del comportamiento del consumidor, estos elementos pueden crear barreras psicológicas que dificultan la consideración de Betfair como opción viable en el proceso de decisión.`;
      recommendation = 'Identificar y abordar las fuentes de información que generan estos triggers negativos.';
    } else {
      insight = `Esta respuesta del LLM presenta información que puede influir negativamente en la percepción del usuario sobre Betfair. En un contexto donde los consumidores confían cada vez más en asistentes de IA para tomar decisiones, este tipo de respuestas puede afectar directamente el funnel de conversión.`;
      recommendation = 'Monitorear y desarrollar estrategias de contenido para mejorar la percepción del LLM.';
    }
  } else if (classification === 'WARNING') {
    if (!mention && hasRanking) {
      insight = `Betfair aparece en el ranking pero de forma poco destacada. Los usuarios en fase de consideración pueden pasar por alto la marca al no tener suficiente contexto diferenciador. El comportamiento típico del consumidor es enfocarse en las primeras opciones que aparecen con información más detallada.`;
      recommendation = 'Mejorar la presencia de contenido diferenciador que el LLM pueda utilizar.';
    } else if (triggers_detected.length > 0) {
      insight = `La presencia de ${triggers_detected.length} trigger${triggers_detected.length > 1 ? 's' : ''} de advertencia indica áreas donde la respuesta podría mejorar. Aunque no es crítico, estos elementos pueden generar dudas en usuarios que están evaluando opciones, potencialmente prolongando o abandonando su proceso de decisión.`;
      recommendation = 'Revisar los triggers específicos para entender qué aspectos necesitan refuerzo comunicacional.';
    } else {
      insight = `Esta respuesta muestra una oportunidad de mejora en cómo el LLM presenta a Betfair. Los consumidores modernos esperan información completa y contextualizada; una mención parcial o sin suficiente detalle puede no ser efectiva para influir en su decisión.`;
      recommendation = 'Enriquecer el contenido disponible para que el LLM proporcione información más completa.';
    }
  } else {
    // OPPORTUNITY
    if (mention && isTopPosition) {
      insight = `Excelente posicionamiento: Betfair aparece como la primera opción recomendada. Desde el punto de vista del comportamiento del consumidor, esta es la posición óptima ya que los usuarios tienden a confiar en la primera recomendación y tienen mayor probabilidad de hacer clic y convertir cuando la marca lidera el ranking.`;
      recommendation = 'Mantener y reforzar las estrategias que han llevado a este posicionamiento.';
    } else if (mention && hasRanking && rankingPosition < 3) {
      insight = `Betfair está bien posicionado en el top ${rankingPosition + 1} del ranking. Los estudios de comportamiento del consumidor indican que las primeras 3 posiciones capturan la mayoría de la atención del usuario. Esta visibilidad contribuye positivamente al awareness y consideración de la marca.`;
      recommendation = 'Buscar oportunidades para ascender al primer puesto del ranking.';
    } else if (mention) {
      insight = `La mención de Betfair en esta respuesta contribuye positivamente al reconocimiento de marca. Aunque no hay ranking competitivo, el hecho de que el LLM incluya a Betfair en su respuesta indica que la marca está en el conjunto de consideración del sistema, lo cual es valioso para el journey del consumidor.`;
      recommendation = 'Capitalizar esta presencia para fortalecer el posicionamiento en consultas relacionadas.';
    } else {
      insight = `Esta respuesta representa una oportunidad de visibilidad para Betfair. El contexto de la pregunta y la naturaleza de la respuesta sugieren que hay espacio para que la marca sea incluida en futuras iteraciones, potencialmente capturando usuarios en etapas tempranas de su proceso de decisión.`;
      recommendation = 'Desarrollar contenido relevante para este tipo de consultas.';
    }
  }

  return {
    insight,
    impactLevel,
    recommendation,
  };
}

function getCategoryContext(category: CategoryId): string {
  switch (category) {
    case 1:
      return 'la marca específicamente';
    case 2:
      return 'comparaciones generales del sector';
    case 3:
      return 'competidores directos';
    case 4:
      return 'aspectos comerciales y ofertas';
    case 5:
      return 'transacciones y operaciones';
    default:
      return 'este tema';
  }
}

/**
 * Gets a short summary for display in cards
 */
export function getAnalysisSummary(record: Record): string {
  const analysis = generateConsumerAnalysis(record);
  // Return first sentence of the insight
  return analysis.insight.split('.')[0] + '.';
}
