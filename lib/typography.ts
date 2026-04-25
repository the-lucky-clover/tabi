
// Short connecting/function words that should always stay with the next word
const ADJUNCTS = new Set([
  // Articles
  "a", "an", "the",
  // Prepositions
  "of", "to", "in", "for", "on", "by", "at", "with", "from", "into",
  "onto", "upon", "through", "beyond", "without", "within", "over",
  "under", "after", "before", "since", "until", "about", "above",
  "below", "between", "among", "against", "across",
  // Coordinating conjunctions
  "and", "or", "but", "yet", "so", "nor",
  // Subordinating conjunctions / relative words
  "that", "which", "when", "where", "while", "if", "as", "than",
  // Personal pronouns
  "I", "my", "your", "his", "her", "its", "our", "their",
  "you", "me", "he", "she", "it", "we", "they", "them", "us",
  // Common auxiliaries / copulas
  "is", "am", "are", "was", "were", "be", "been", "being",
  "do", "does", "did", "have", "has", "had", "will", "would",
  "can", "could", "shall", "should", "may", "might", "must",
  // Other high-frequency short words
  "not", "no", "so", "too", "just", "very", "more", "most",
]);

/**
 * Improves typography of a string by:
 * 1. Binding short function/connecting words to the following word with a
 *    non-breaking space (prevents ugly line breaks after "a", "of", etc.)
 * 2. Binding the last two words together to prevent single-word orphans.
 *
 * Inline markup markers (*…* and ~…~) are preserved intact.
 */
export function improveTypography(text: string): string {
  if (!text) return text;

  const words = text.trim().split(/\s+/);
  if (words.length <= 1) return text;

  let result = "";
  for (let i = 0; i < words.length; i++) {
    result += words[i];

    if (i < words.length - 1) {
      // Strip punctuation before checking if the word is an adjunct
      const bare = words[i].toLowerCase().replace(/[^\w]/g, "");
      const isAdjunct = ADJUNCTS.has(bare);
      // Bind the last two words together (orphan protection)
      const isSecondToLast = i === words.length - 2;
      // Bind very short words (≤ 2 chars, e.g. "I", "a") that aren't already in ADJUNCTS
      const isShort = bare.length <= 2;

      if (isAdjunct || isSecondToLast || isShort) {
        result += "\u00A0"; // non-breaking space
      } else {
        result += " ";
      }
    }
  }

  return result;
}
