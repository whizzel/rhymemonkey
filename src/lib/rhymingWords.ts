export interface RhymeGroup {
  word: string;
  rhymes: string[];
}

// Easy: high-frequency, short, simple words with many obvious rhymes
const EASY_WORDS = [
  "cat", "hat", "bat", "rat", "mat", "fat", "sat", "pat", "flat", "that",
  "hot", "got", "pot", "lot", "not", "dot", "rot", "shot", "spot", "plot",
  "cup", "up", "cut", "gut", "but", "nut", "hut", "shut", "strut",
  "bad", "sad", "mad", "had", "dad", "lad", "glad", "clad",
  "top", "hop", "pop", "cop", "mop", "drop", "shop", "stop", "crop", "prop",
  "bug", "mug", "rug", "jug", "hug", "tug", "plug", "slug", "snug",
  "bed", "red", "fed", "led", "shed", "fled", "sled",
  "big", "dig", "fig", "jig", "pig", "wig", "twig",
  "run", "sun", "fun", "gun", "bun", "pun", "done", "ton", "won",
  "hit", "bit", "sit", "fit", "kit", "pit", "wit", "grit", "spit",
  "map", "cap", "gap", "lap", "nap", "rap", "tap", "wrap", "trap",
  "mud", "bud", "stud", "flood", "blood", "thud",
];

// Medium: multi-syllable or less common words with a decent rhyme pool
const MEDIUM_WORDS = [
  "before", "explore", "ignore", "restore", "adore", "therefore",
  "begin", "within", "again", "obtain", "remain", "sustain", "contain",
  "alone", "atone", "bemoan", "condone", "unknown", "postpone",
  "agree", "foresee", "decree", "trustee",
  "about", "devout", "throughout", "without",
  "aside", "decide", "divide", "inside", "provide", "reside",
  "awake", "forsake", "mistake", "partake",
  "alert", "assert", "avert", "desert", "divert", "exert", "insert", "revert",
  "attach", "dispatch", "mismatch", "detach",
  "command", "demand", "expand", "withstand",
  "beyond", "respond", "correspond",
  "forget", "regret", "offset", "upset",
  "approach", "encroach", "reproach",
  "allow", "avow", "endow",
  "betray", "decay", "delay", "display", "relay", "repay",
  "below", "bestow", "plateau",
];

// Hard: obscure or rare words with very few obvious rhymes
const HARD_WORDS = [
  // rare /ɜːr/ words
  "absurd", "demurred", "interred", "concurred", "deterred", "incurred",
  "recurred", "unheard", "inferred",
  "dirge", "scourge", "purge", "serge", "converge", "diverge", "submerge",
  "usurp", "chirp",
  "inert", "overt", "subvert", "covert",
  "immersed", "dispersed", "coerced", "interspersed", "reimbursed",
  "affirmed", "adjourned", "spurned", "discerned", "perturbed",
  "undisturbed", "unconcerned", "unperturbed",

  // rare misc
  "facade", "bard", "lard", "wand", "gland",
  "plaid", "trod", "clod", "shod",
  "drab", "slab", "scab",
  "vat", "gnat", "spat",
  "yelp", "kelp", "whelp",
  "deft", "bereft", "cleft",
  "brunt", "stunt", "punt", "blunt",
  "wisp", "crisp", "lisp",
  "rift", "drift", "swift", "thrift",
  "gaunt", "jaunt", "haunt", "flaunt",
  "vault", "malt", "halt", "exalt",
  "lymph", "nymph",
];

export const DIFFICULTY_WORDS = {
  easy: EASY_WORDS,
  medium: MEDIUM_WORDS,
  hard: HARD_WORDS,
};

export async function fetchRhymesForWord(word: string): Promise<string[]> {
  try {
    const response = await fetch(`https://rhymebrain.com/talk?function=getRhymes&word=${word}`);
    if (!response.ok) return [];

    const data = await response.json();
    return data
      .filter((item: any) => item.score >= 300)
      .map((item: any) => item.word.toLowerCase());
  } catch (error) {
    console.error("Error fetching rhymes from RhymeBrain API:", error);
    return [];
  }
}

export async function getRandomRhymeGroup(difficulty: "easy" | "medium" | "hard"): Promise<RhymeGroup> {
  const words = DIFFICULTY_WORDS[difficulty];
  const baseWord = words[Math.floor(Math.random() * words.length)];

  const rhymes = await fetchRhymesForWord(baseWord);

  return {
    word: baseWord,
    rhymes: rhymes.length > 0 ? rhymes : [baseWord],
  };
}

export function getRandomWordFromGroup(group: RhymeGroup): string {
  const allWords = [group.word, ...group.rhymes];
  return allWords[Math.floor(Math.random() * allWords.length)];
}