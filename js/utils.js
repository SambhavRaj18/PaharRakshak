// =========================================================================
// PaharRakshak - Shared Utility Functions
// HTML Escaping, Levenshtein Distance, Fuzzy Matching & Time Formatting
// =========================================================================

/**
 * Safely escape HTML to prevent XSS and formatting corruption
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Calculates Levenshtein edit distance between two strings
 */
export function levenshteinDistance(a, b) {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;

  const matrix = Array.from({ length: bn + 1 }, (_, i) => [i]);
  for (let j = 0; j <= an; j++) matrix[0][j] = j;

  for (let i = 1; i <= bn; i++) {
    for (let j = 1; j <= an; j++) {
      if (b.charAt(i - 1).toLowerCase() === a.charAt(j - 1).toLowerCase()) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[bn][an];
}

/**
 * Fuzzy similarity score between 0.0 (unrelated) and 1.0 (identical)
 */
export function stringSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  if (s1 === s2) return 1;

  // Token intersection (e.g. "Paglajhora turn" vs "near Paglajhora")
  const tokens1 = s1.split(/[\s,.-]+/).filter(Boolean);
  const tokens2 = s2.split(/[\s,.-]+/).filter(Boolean);
  let sharedTokens = 0;
  tokens1.forEach(t1 => {
    if (tokens2.some(t2 => t2.includes(t1) || t1.includes(t2))) {
      sharedTokens++;
    }
  });

  const tokenScore = (2 * sharedTokens) / (tokens1.length + tokens2.length);
  const maxLen = Math.max(s1.length, s2.length);
  const levScore = 1 - (levenshteinDistance(s1, s2) / maxLen);

  return Math.max(tokenScore, levScore);
}
