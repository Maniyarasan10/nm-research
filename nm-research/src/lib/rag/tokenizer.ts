/**
 * Deterministic, dependency-free tokenizer + light stemmer.
 *
 * Splits text into lowercase alphanumeric tokens, drops stop-words, and
 * applies a small suffix-based stemmer so that e.g. "research / researching /
 * researchers" all collapse to a common feature. Fully offline and testable.
 */

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "how",
  "i", "in", "is", "it", "its", "of", "on", "or", "that", "the", "their",
  "this", "to", "what", "when", "where", "which", "who", "why", "with",
  "you", "your", "we", "our", "not", "do", "does", "don", "can", "could",
  "will", "would", "should", "may", "might", "me", "my", "am", "us", "s",
  "re", "ve", "ll", "d", "t", "about", "between", "into", "over", "more",
  "than", "most", "such", "just", "only", "also", "very", "there", "here",
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t))
    .map(stem);
}

/**
 * Minimal suffix stemmer. Handles common English plurals and verb endings.
 * Kept intentionally small and deterministic; good enough for retrieval.
 */
export function stem(word: string): string {
  if (word.length <= 3) return word;

  const irregular = tokenizeIrregular(word);
  if (irregular) return irregular;

  let w = word;
  // Generic -ing with consonant doubling (running -> runn -> run via length)
  if (w.endsWith("ing") && w.length > 5) w = w.slice(0, -3);
  else if (w.endsWith("ed") && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith("ies") && w.length > 4) w = w.slice(0, -3) + "y";
  else if (w.endsWith("es") && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) w = w.slice(0, -1);

  // Collapse doubled consonants at the end (running -> runn -> run)
  if (w.length > 3 && w[w.length - 1] === w[w.length - 2]) {
    w = w.slice(0, -1);
  }
  return w;
}

/** A handful of high-frequency irregulars to improve matching quality. */
function tokenizeIrregular(w: string): string | undefined {
  const map: Record<string, string> = {
    children: "child",
    people: "person",
    men: "man",
    women: "woman",
    is: "be",
    are: "be",
    was: "be",
    were: "be",
    had: "have",
    has: "have",
    does: "do",
  };
  return map[w];
}

export function uniqueTokens(tokens: string[]): string[] {
  return Array.from(new Set(tokens));
}
