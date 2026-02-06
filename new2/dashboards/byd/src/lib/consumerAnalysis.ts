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

  const rankingPosition = ranking_list?.findIndex(b => b.toLowerCase() === 'byd');
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
      insight = `This response represents a significant missed opportunity. When users search for information about "${getCategoryContext(category)}", the LLM does not mention BYD, meaning potential customers are being directed toward competitors. In the consumer decision journey, this absence can be decisive for conversion.`;
      recommendation = 'Prioritize visibility and content actions to be included in these LLM responses.';
    } else if (isLowPosition) {
      insight = `Although BYD is mentioned, its position #${rankingPosition + 1} of ${competitorCount} in the ranking suggests the LLM perceives competitors as more relevant options. Users receiving this information tend to explore top-positioned options first, significantly reducing conversion probability for BYD.`;
      recommendation = 'Work on brand differentiation and authority to improve positioning in responses.';
    } else if (triggers_detected.length > 2) {
      insight = `The response contains ${triggers_detected.length} problematic triggers that may generate negative perceptions in the user. From a consumer behavior perspective, these elements can create psychological barriers that make it difficult to consider BYD as a viable option in the decision process.`;
      recommendation = 'Identify and address the information sources generating these negative triggers.';
    } else {
      insight = `This LLM response presents information that may negatively influence user perception of BYD. In a context where consumers increasingly rely on AI assistants to make decisions, this type of response can directly affect the conversion funnel.`;
      recommendation = 'Monitor and develop content strategies to improve LLM perception.';
    }
  } else if (classification === 'WARNING') {
    if (!mention && hasRanking) {
      insight = `BYD appears in the ranking but not prominently. Users in the consideration phase may overlook the brand due to insufficient differentiating context. Typical consumer behavior is to focus on the first options that appear with more detailed information.`;
      recommendation = 'Improve the presence of differentiating content that the LLM can use.';
    } else if (triggers_detected.length > 0) {
      insight = `The presence of ${triggers_detected.length} warning trigger${triggers_detected.length > 1 ? 's' : ''} indicates areas where the response could improve. Although not critical, these elements may generate doubts in users evaluating options, potentially prolonging or abandoning their decision process.`;
      recommendation = 'Review specific triggers to understand which aspects need communication reinforcement.';
    } else {
      insight = `This response shows an improvement opportunity in how the LLM presents BYD. Modern consumers expect complete and contextualized information; a partial mention or insufficient detail may not be effective in influencing their decision.`;
      recommendation = 'Enrich available content so the LLM provides more complete information.';
    }
  } else {
    // OPPORTUNITY
    if (mention && isTopPosition) {
      insight = `Excellent positioning: BYD appears as the first recommended option. From a consumer behavior standpoint, this is the optimal position as users tend to trust the first recommendation and are more likely to click and convert when the brand leads the ranking.`;
      recommendation = 'Maintain and reinforce the strategies that led to this positioning.';
    } else if (mention && hasRanking && rankingPosition < 3) {
      insight = `BYD is well positioned in the top ${rankingPosition + 1} of the ranking. Consumer behavior studies indicate that the first 3 positions capture most of the user's attention. This visibility contributes positively to brand awareness and consideration.`;
      recommendation = 'Look for opportunities to rise to first place in the ranking.';
    } else if (mention) {
      insight = `BYD's mention in this response contributes positively to brand recognition. Although there is no competitive ranking, the fact that the LLM includes BYD in its response indicates the brand is in the system's consideration set, which is valuable for the consumer journey.`;
      recommendation = 'Capitalize on this presence to strengthen positioning in related queries.';
    } else {
      insight = `This response represents a visibility opportunity for BYD. The question context and response nature suggest there is room for the brand to be included in future iterations, potentially capturing users in early stages of their decision process.`;
      recommendation = 'Develop relevant content for this type of query.';
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
      return 'the brand specifically';
    case 2:
      return 'general sector comparisons';
    case 3:
      return 'direct competitors';
    case 4:
      return 'commercial aspects and offers';
    case 5:
      return 'transactions and operations';
    default:
      return 'this topic';
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
