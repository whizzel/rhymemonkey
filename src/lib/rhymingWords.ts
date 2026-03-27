// Rhyming words data structure
export interface RhymeGroup {
  baseWord: string;
  rhymes: string[];
}

export const RHYMING_GROUPS: RhymeGroup[] = [
  // -at family
  { baseWord: 'cat', rhymes: ['bat', 'hat', 'mat', 'rat', 'sat', 'fat', 'pat', 'vat'] },
  { baseWord: 'dog', rhymes: ['fog', 'hog', 'log', 'jog', 'bog', 'cog'] },
  { baseWord: 'sun', rhymes: ['fun', 'run', 'gun', 'bun', 'nun', 'pun'] },
  { baseWord: 'big', rhymes: ['dig', 'fig', 'gig', 'jig', 'pig', 'rig', 'wig'] },
  { baseWord: 'red', rhymes: ['bed', 'fed', 'led', 'wed', 'ted', 'dread'] },
  { baseWord: 'blue', rhymes: ['clue', 'flu', 'glue', 'hue', 'moo', 'shoe', 'stew', 'threw', 'to', 'too', 'two'] },
  { baseWord: 'green', rhymes: ['queen', 'scene', 'seen', 'teen', 'keen'] },
  { baseWord: 'night', rhymes: ['bright', 'fight', 'flight', 'light', 'might', 'night', 'right', 'sight', 'tight', 'white'] },
  { baseWord: 'day', rhymes: ['bay', 'clay', 'gay', 'gray', 'hay', 'jay', 'lay', 'may', 'pay', 'play', 'ray', 'say', 'stay', 'sway', 'way'] },
  { baseWord: 'moon', rhymes: ['balloon', 'blue', 'clue', 'dune', 'June', 'loon', 'noon', 'soon', 'spoon', 'tune'] },
  { baseWord: 'star', rhymes: ['bar', 'car', 'far', 'jar', 'scar', 'tar', 'war'] },
  { baseWord: 'house', rhymes: ['blouse', 'douse', 'grouse', 'louse', 'mouse', 'rouse', 'souse'] },
  { baseWord: 'book', rhymes: ['cook', 'hook', 'look', 'nook', 'rook', 'shook', 'took'] },
  { baseWord: 'tree', rhymes: ['bee', 'free', 'gee', 'glee', 'key', 'knee', 'pee', 'see', 'tea', 'tee', 'three', 'we'] },
  { baseWord: 'bird', rhymes: ['curd', 'heard', 'herd', 'nerd', 'stirred', 'word'] },
  { baseWord: 'fish', rhymes: ['dish', 'swish', 'wish'] },
  { baseWord: 'ring', rhymes: ['bring', 'cling', 'ding', 'fling', 'king', 'ping', 'sing', 'spring', 'sting', 'string', 'swing', 'thing', 'wing'] },
  { baseWord: 'ball', rhymes: ['call', 'fall', 'hall', 'mall', 'small', 'squall', 'stall', 'tall', 'wall'] },
  { baseWord: 'cake', rhymes: ['bake', 'fake', 'hake', 'lake', 'make', 'rake', 'sake', 'shake', 'snake', 'stake', 'take', 'wake'] },
  { baseWord: 'road', rhymes: ['broad', 'goad', 'load', 'toad'] },
  { baseWord: 'rain', rhymes: ['brain', 'chain', 'drain', 'grain', 'lain', 'main', 'pain', 'plain', 'rain', 'rein', 'stain', 'train', 'vain', 'wain'] },
  { baseWord: 'fire', rhymes: ['dire', 'hire', 'ire', 'pyre', 'sire', 'tire', 'wire'] },
  { baseWord: 'snow', rhymes: ['blow', 'bow', 'crow', 'flow', 'glow', 'grow', 'know', 'low', 'mow', 'row', 'show', 'slow', 'sow', 'throw', 'tow'] },
  { baseWord: 'wind', rhymes: ['bind', 'blind', 'find', 'grind', 'hind', 'kind', 'mind', 'rind', 'signed', 'wind'] },
  { baseWord: 'rock', rhymes: ['block', 'clock', 'cock', 'dock', 'flock', 'knock', 'lock', 'mock', 'shock', 'sock', 'stock'] },
  { baseWord: 'rose', rhymes: ['boast', 'close', 'dose', 'ghost', 'host', 'moist', 'most', 'oath', 'post', 'roast', 'those'] },
  { baseWord: 'face', rhymes: ['ace', 'base', 'case', 'chase', 'erase', 'grace', 'lace', 'mace', 'pace', 'place', 'race', 'space', 'trace'] },
  { baseWord: 'time', rhymes: ['chime', 'climb', 'crime', 'dime', 'grime', 'lime', 'mime', 'prime', 'rhyme', 'slime', 'sublime', 'thyme', 'time'] },
  { baseWord: 'love', rhymes: ['cove', 'dove', 'glove', 'above', 'shove'] },
  { baseWord: 'heart', rhymes: ['art', 'cart', 'chart', 'dart', 'mart', 'part', 'smart', 'start', 'tart'] },
  { baseWord: 'dream', rhymes: ['cream', 'gleam', 'scream', 'seam', 'stream', 'team'] },
  { baseWord: 'light', rhymes: ['bright', 'fight', 'flight', 'light', 'might', 'night', 'right', 'sight', 'tight', 'white'] },
  { baseWord: 'song', rhymes: ['bong', 'cong', 'gong', 'hong', 'kong', 'long', 'pong', 'rong', 'sang', 'strong', 'throne', 'wrong'] },
  { baseWord: 'dance', rhymes: ['chance', 'glance', 'lance', 'pants'] },
  { baseWord: 'smile', rhymes: ['bile', 'dial', 'file', 'guile', 'isle', 'mile', 'pile', 'style', 'tile', 'trial', 'vile', 'while', 'wile'] },
  { baseWord: 'laugh', rhymes: ['cough', 'rough', 'tough'] },
  { baseWord: 'jump', rhymes: ['bump', 'clump', 'dump', 'hump', 'lump', 'pump', 'rump', 'slump', 'stump', 'thump'] },
  { baseWord: 'swim', rhymes: ['brim', 'dim', 'gym', 'him', 'rim', 'skim', 'slim', 'trim', 'whim'] },
  { baseWord: 'fly', rhymes: ['buy', 'by', 'cry', 'dry', 'fry', 'guy', 'hi', 'igh', 'lie', 'my', 'nigh', 'pie', 'rye', 'shy', 'sigh', 'sky', 'spy', 'try', 'why'] },
  { baseWord: 'boat', rhymes: ['bloat', 'coat', 'float', 'goat', 'gloat', 'moat', 'note', 'oat', 'quote', 'remote', 'throat'] },
  { baseWord: 'king', rhymes: ['bring', 'cling', 'ding', 'fling', 'king', 'ping', 'sing', 'spring', 'sting', 'string', 'swing', 'thing', 'wing'] },
  { baseWord: 'queen', rhymes: ['green', 'scene', 'seen', 'teen', 'keen'] },
  { baseWord: 'prince', rhymes: ['since', 'wince'] },
  { baseWord: 'princess', rhymes: ['dress', 'guess', 'less', 'mess', 'yes', 'stress', 'bless', 'confess', 'express', 'impress', 'progress', 'success'] }
];

// Difficulty-based word selection
export const DIFFICULTY_WORDS = {
  easy: RHYMING_GROUPS.filter(group => 
    group.baseWord.length <= 4 && group.rhymes.every(rhyme => rhyme.length <= 5)
  ),
  medium: RHYMING_GROUPS.filter(group => 
    group.baseWord.length >= 4 && group.baseWord.length <= 6
  ),
  hard: RHYMING_GROUPS.filter(group => 
    group.baseWord.length >= 5
  )
};

// Get a random rhyme group based on difficulty
export function getRandomRhymeGroup(difficulty: 'easy' | 'medium' | 'hard'): RhymeGroup {
  const groups = DIFFICULTY_WORDS[difficulty];
  return groups[Math.floor(Math.random() * groups.length)];
}

// Get a random word from a rhyme group
export function getRandomWordFromGroup(group: RhymeGroup): string {
  const allWords = [group.baseWord, ...group.rhymes];
  return allWords[Math.floor(Math.random() * allWords.length)];
}

// Check if two words rhyme (simplified - same ending sound)
export function doWordsRhyme(word1: string, word2: string): boolean {
  // Simple check: same last 3 letters for basic rhyming
  if (word1.length < 3 || word2.length < 3) return false;
  
  const w1 = word1.toLowerCase();
  const w2 = word2.toLowerCase();
  
  return w1.slice(-3) === w2.slice(-3);
}

// Get the base word and valid rhymes for a given word
export function getRhymeGroup(word: string): RhymeGroup | null {
  const lowerWord = word.toLowerCase();
  return RHYMING_GROUPS.find(group => 
    group.baseWord.toLowerCase() === lowerWord || 
    group.rhymes.some(rhyme => rhyme.toLowerCase() === lowerWord)
  ) || null;
}
