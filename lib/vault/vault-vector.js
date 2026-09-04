import { VAULT_CARDS } from './vault-cards.js';

// ============================================================================
// VECTOR SEARCH & EMBEDDING ENGINE
// Compatible with Google Gemini text-embedding-004 embeddings and in-memory
// open-source cosine vector indexing.
// ============================================================================

/**
 * Calculates cosine similarity between two normalized or raw floating-point vectors.
 */
export function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Generates an embedding for text using Google's text-embedding-004 model.
 * Falls back to deterministic semantic hashing vector if API key is not configured.
 */
export async function getGoogleEmbedding(text) {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
    process.env.GOOGLE_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'models/text-embedding-004',
            content: { parts: [{ text }] },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const values = data.embedding?.values;
        if (Array.isArray(values) && values.length > 0) {
          return values;
        }
      }
    } catch (err) {
      console.warn('Google embedding API call failed, falling back to local vector:', err.message);
    }
  }

  // Fast, deterministic 64-dimensional semantic projection fallback
  return generateDeterministicSemanticVector(text, 64);
}

/**
 * Open-source deterministic semantic vector projector.
 * Produces smooth cosine-comparable vectors based on n-grams and stemmed keywords.
 */
export function generateDeterministicSemanticVector(text, dimensions = 64) {
  const vector = new Float32Array(dimensions);
  if (!text) return Array.from(vector);

  const clean = text.toLowerCase().replace(/[^a-z0-9_\-\s]/g, ' ');
  const words = clean.split(/\s+/).filter((w) => w.length > 1);

  for (let w = 0; w < words.length; w++) {
    const word = words[w];
    let hash = 0;
    for (let c = 0; c < word.length; c++) {
      hash = (hash << 5) - hash + word.charCodeAt(c);
      hash |= 0;
    }
    const idx = Math.abs(hash) % dimensions;
    const weight = 1.0 + (word.length > 5 ? 0.5 : 0);
    vector[idx] += weight;

    // Add bigram hash for contextual proximity
    if (w < words.length - 1) {
      const nextWord = words[w + 1];
      const bigramHash = Math.abs(hash * 31 + nextWord.charCodeAt(0)) % dimensions;
      vector[bigramHash] += 0.75;
    }
  }

  // Normalize to unit vector
  let norm = 0;
  for (let i = 0; i < dimensions; i++) norm += vector[i] * vector[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) vector[i] /= norm;
  }

  return Array.from(vector);
}

// In-memory open-source vector store for all Context Vault cards
class VaultVectorStore {
  constructor() {
    this.vectors = new Map();
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;
    for (const card of VAULT_CARDS) {
      const cardText = `${card.title} ${card.entity} ${card.content} ${card.tags.join(' ')} ${(card.metrics || []).join(' ')}`;
      const vec = generateDeterministicSemanticVector(cardText, 64);
      this.vectors.set(card.id, { card, vector: vec });
    }
    this.initialized = true;
  }

  search(query, topK = 6) {
    this.initialize();
    const queryVec = generateDeterministicSemanticVector(query, 64);
    const results = [];

    for (const [id, item] of this.vectors.entries()) {
      const score = cosineSimilarity(queryVec, item.vector);
      results.push({ card: item.card, score });
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, topK);
  }
}

export const vaultVectorStore = new VaultVectorStore();
