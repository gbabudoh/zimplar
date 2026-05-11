import nlp from "compromise";

interface QuizQuestion {
  question: string;
  answers: string[];
  originalText: string;
}


/**
 * Generates a "Fill-in-the-Blanks" (Cloze) quiz from a text block
 * WITHOUT using any LLMs. Uses rule-based NLP (Compromise).
 */
export function generateClozeQuiz(text: string): QuizQuestion {
  const doc = nlp(text);
  
  // Extract potential candidates for blanks:
  // 1. Proper Nouns (People, Places, Orgs)
  // 2. Values (Numbers, Percentages)
  // 3. Dates
  const candidates: string[] = [
    ...doc.match('#Topic').out('array'),
    ...doc.match('#Value').out('array'),
    ...doc.match('#Date').out('array')
  ];

  // Remove duplicates and very short words
  const uniqueCandidates = Array.from(new Set(candidates))
    .filter(c => c.length > 2)
    .sort((a, b) => b.length - a.length); // Longest first to avoid partial replacement issues

  let questionText = text;
  const answers: string[] = [];

  // Limit to max 5 blanks to keep it readable
  const maxBlanks = Math.min(uniqueCandidates.length, 5);
  
  for (let i = 0; i < maxBlanks; i++) {
    const word = uniqueCandidates[i];
    // Create a regex that matches the word/phrase (case insensitive)
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    
    if (regex.test(questionText)) {
      questionText = questionText.replace(regex, "__________");
      answers.push(word);
    }
  }

  return {
    question: questionText,
    answers: answers,
    originalText: text
  };
}
