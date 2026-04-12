
const ADJUNCTS = [
  "a", "an", "the", 
  "of", "to", "in", "for", "on", "by", "at", "with", "from", "into", "onto", "upon", "through", "beyond", "without", "within",
  "and", "or", "but", "yet", "so", "nor", "for",
  "I", "my", "your", "his", "her", "its", "our", "their",
  "is", "am", "are", "was", "were", "be", "been", "being",
  "you", "me", "he", "she", "it", "we", "they", "them", "us"
];

/**
 * Improves typography by preventing orphans and keeping adjunct words with their following word.
 * Uses non-breaking spaces (\u00A0) to glue words together.
 */
export function improveTypography(text: string): string {
  if (!text) return text;
  
  // Split into words, preserving multiple spaces if any (though usually there aren't)
  let words = text.trim().split(/\s+/);
  if (words.length <= 1) return text;

  let result = "";
  for (let i = 0; i < words.length; i++) {
    result += words[i];
    
    if (i < words.length - 1) {
      const currentWord = words[i].toLowerCase().replace(/[^\w]/g, '');
      const isAdjunct = ADJUNCTS.includes(currentWord);
      const isSecondToLast = i === words.length - 2;
      
      // If it's an adjunct OR the second to last word (orphan protection), use non-breaking space
      if (isAdjunct || isSecondToLast) {
        result += "\u00A0";
      } else {
        result += " ";
      }
    }
  }
  
  return result;
}
