import { VAULT_CARDS, VAULT_CATEGORIES } from './vault-cards.js';
import { vaultVectorStore } from './vault-vector.js';

function tokenize(text) {
  if (!text) return new Set();
  const cleaned = text.toLowerCase().replace(/[^a-z0-9_\-\+\#]/g, ' ');
  return new Set(cleaned.split(/\s+/).filter((w) => w.length > 2));
}

function scoreCard(card, queryTokens) {
  if (!queryTokens || queryTokens.size === 0) {
    if (card.category === 'profile_persona') return 10.0;
    if (card.category === 'achievement_metric') return 8.0;
    if (card.category === 'experience_project') return 7.0;
    if (card.category === 'skills_arsenal') return 6.0;
    return 5.0;
  }

  let score = 0.0;

  // Category baseline boosts
  if (card.category === 'profile_persona') score += 2.0;
  if (card.category === 'achievement_metric') score += 3.0;

  // Tag intersection (high signal)
  for (const tag of card.tags) {
    const tagLower = tag.toLowerCase();
    if (queryTokens.has(tagLower)) {
      score += 6.0;
    } else {
      for (const qt of queryTokens) {
        if (qt.includes(tagLower) || tagLower.includes(qt)) {
          score += 3.0;
          break;
        }
      }
    }
  }

  // Entity & Title intersection
  const titleTokens = tokenize(`${card.entity} ${card.title}`);
  for (const t of titleTokens) {
    if (queryTokens.has(t)) score += 4.0;
  }

  // Content intersection
  const contentTokens = tokenize(card.content);
  for (const c of contentTokens) {
    if (queryTokens.has(c)) score += 1.5;
  }

  return score;
}

/**
 * Dynamically retrieves and assembles the most relevant Context Vault cards
 * for the current visitor query and route.
 */
export function assembleVaultContext({
  userQuery = '',
  activePage = '/',
  maxCards = 10,
} = {}) {
  // Combine user question with page context tokens
  let queryText = `${userQuery} ${activePage.replace(/[\/\-_]/g, ' ')}`;
  const queryTokens = tokenize(queryText);

  // 1. Vector similarity search
  const vectorResults = vaultVectorStore.search(queryText, 12);
  const vectorScores = new Map();
  for (const item of vectorResults) {
    vectorScores.set(item.card.id, item.score * 10);
  }

  // 2. Hybrid scoring (Vector similarity + Keyword intersection)
  const scoredCards = VAULT_CARDS.map((card) => {
    const keywordScore = scoreCard(card, queryTokens);
    const vecScore = vectorScores.get(card.id) || 0;
    const totalScore = keywordScore + vecScore;
    return { card, score: totalScore };
  });

  scoredCards.sort((a, b) => b.score - a.score);

  // 3. Selection with category balance: always include at least 1 persona card
  const selected = [];
  const seenIds = new Set();

  // Find highest scoring persona card
  for (const item of scoredCards) {
    if (item.card.category === 'profile_persona' && !seenIds.has(item.card.id)) {
      selected.push(item.card);
      seenIds.add(item.card.id);
      break;
    }
  }

  // Fill up to maxCards with highest ranked cards
  for (const item of scoredCards) {
    if (selected.length >= maxCards) break;
    if (!seenIds.has(item.card.id)) {
      selected.push(item.card);
      seenIds.add(item.card.id);
    }
  }

  // Group by category for structured prompt injection
  const categorized = {
    profile_persona: [],
    experience_project: [],
    achievement_metric: [],
    skills_arsenal: [],
    education_credential: [],
    proof_link: [],
  };

  for (const card of selected) {
    if (categorized[card.category]) {
      categorized[card.category].push(card);
    } else {
      categorized.experience_project.push(card);
    }
  }

  const lines = [
    '=== AUTHORITATIVE CONTEXT VAULT (DYNAMIC RETRIEVAL FOR THIS QUERY) ===',
  ];

  if (categorized.profile_persona.length > 0) {
    lines.push('\n[ENGINEERING ETHOS & PRINCIPLES]');
    for (const card of categorized.profile_persona) {
      lines.push(`• ${card.title}: ${card.content}`);
    }
  }

  if (categorized.achievement_metric.length > 0) {
    lines.push('\n[VERIFIED METRICS & SCALE BENCHMARKS]');
    for (const card of categorized.achievement_metric) {
      const metricList = card.metrics.length > 0 ? ` (Key Numbers: ${card.metrics.join(' | ')})` : '';
      lines.push(`• ${card.title}${metricList}: ${card.content}`);
    }
  }

  if (categorized.experience_project.length > 0) {
    lines.push('\n[TARGET SYSTEMS, PROJECTS & DEEP WORK]');
    for (const card of categorized.experience_project) {
      const tags = card.tags?.length > 0 ? ` [Tech: ${card.tags.slice(0, 4).join(', ')}]` : '';
      const link = card.showcaseUrl ? ` [Route: ${card.showcaseUrl}]` : '';
      lines.push(`• [${card.entity}] ${card.title}${tags}${link}: ${card.content}`);
    }
  }

  if (categorized.skills_arsenal.length > 0) {
    lines.push('\n[TECHNICAL ARSENAL & PRACTICAL PROFICIENCIES]');
    for (const card of categorized.skills_arsenal) {
      lines.push(`• ${card.title}: ${card.content}`);
    }
  }

  if (categorized.education_credential.length > 0) {
    lines.push('\n[ACADEMIC BACKGROUND & SPECIALIZATIONS]');
    for (const card of categorized.education_credential) {
      lines.push(`• ${card.title}: ${card.content}`);
    }
  }

  lines.push('=== END AUTHORITATIVE CONTEXT VAULT ===\n');

  return {
    contextText: lines.join('\n'),
    retrievedCards: selected,
  };
}
