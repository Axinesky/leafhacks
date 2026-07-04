/*
 * AQA GCSE English Literature content for the English module.
 *
 * Keep exam material here, separate from the UI. To add another set text or
 * extract later, copy this shape into a new object and render it the same way.
 * Aligned to AQA Paper 1, Section A (Shakespeare): pupils respond to an extract
 * and to the play as a whole, assessed on AO1, AO2 and AO3.
 */

export interface AssessmentObjective {
  code: string;
  summary: string;
}

export interface GcseText {
  board: string;
  paper: string;
  play: string;
  scene: string;
  focusTheme: string;
  speaker: string;
  /** The extract shown to pupils. Faithful to the original text. */
  extract: string;
  /** AQA-style extract question. */
  question: string;
  /** What a strong answer should cover, in pupil-friendly language. */
  taskPoints: string[];
  themes: string[];
  /** Jacobean context points for AO3. */
  context: string[];
  /** Useful analytical terminology for AO2. */
  terminology: string[];
  objectives: AssessmentObjective[];
  /** Deliberate prompt so AI images stay on-tone, not generic. */
  scenePrompt: string;
}

export const MACBETH: GcseText = {
  board: "AQA",
  paper: "Paper 1, Section A",
  play: "Macbeth",
  scene: "Act 1, Scene 3",
  focusTheme: "Ambition",
  speaker: "Macbeth",
  extract: `This supernatural soliciting
Cannot be ill, cannot be good. If ill,
Why hath it given me earnest of success,
Commencing in a truth? I am Thane of Cawdor.
If good, why do I yield to that suggestion
Whose horrid image doth unfix my hair
And make my seated heart knock at my ribs,
Against the use of nature?`,
  question:
    "Starting with this moment in the play, explore how Shakespeare presents Macbeth's ambition.",
  taskPoints: [
    "How Shakespeare presents ambition in this extract",
    "How Shakespeare presents ambition in the play as a whole",
  ],
  themes: [
    "Ambition",
    "The Supernatural",
    "Guilt and Conscience",
    "Appearance vs Reality",
    "Kingship and Order",
  ],
  context: [
    "Written around 1606 for King James I, who believed in the Divine Right of Kings.",
    "James I was fascinated by witchcraft and wrote a book on it, so the witches would deeply unsettle a Jacobean audience.",
    "The Gunpowder Plot of 1605 made the murder of a king a very real and terrifying fear.",
    "Killing a king was seen as the ultimate sin against God's natural order.",
  ],
  terminology: [
    "soliloquy",
    "aside",
    "antithesis",
    "foreshadowing",
    "iambic pentameter",
    "imagery",
  ],
  objectives: [
    {
      code: "AO1",
      summary:
        "Read, understand and respond to the text, using quotations to support your ideas.",
    },
    {
      code: "AO2",
      summary:
        "Analyse the language, form and structure Shakespeare uses, with subject terminology.",
    },
    {
      code: "AO3",
      summary:
        "Show how the Jacobean context shapes the meaning of the play.",
    },
  ],
  scenePrompt:
    "A lone Scottish thane on a windswept moor at dusk, mist and heather, " +
    "brooding and cinematic, muted earthy palette, painterly, Shakespearean Macbeth",
};

/** System instruction that makes Gemini mark like a supportive AQA examiner. */
export const EXAMINER_SYSTEM =
  "You are a supportive AQA GCSE English Literature examiner marking a Year 11 " +
  "pupil's paragraph about Macbeth. Give short, encouraging, specific feedback in " +
  "British English. Comment on AO1 (a clear personal response supported by " +
  "quotations), AO2 (analysis of language, form and structure with correct " +
  "terminology) and AO3 (Jacobean context). Give one clear target to improve. " +
  "Keep it under 120 words and never rewrite the answer for them.";
