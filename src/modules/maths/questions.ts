/*
 * Progressive practice questions for the Maths module, grouped by topic id.
 *
 * Each set runs from gentle to stretching. The solution is stored locally so
 * "Show solution" always works offline; Gemini is used for hints and for
 * checking a pupil's typed answer, since correct answers can be written many
 * ways (x = 2, 3 versus x = 3 or x = 2, and so on).
 */

export interface PracticeQuestion {
  id: string;
  prompt: string;
  /** The model answer, shown when the pupil chooses to reveal it. */
  solution: string;
}

export const QUESTIONS: Record<string, PracticeQuestion[]> = {
  "quadratic-factorising": [
    {
      id: "qf1",
      prompt: "Solve x\u00b2 + 5x + 6 = 0 by factorising.",
      solution: "(x + 2)(x + 3) = 0, so x = \u22122 or x = \u22123",
    },
    {
      id: "qf2",
      prompt: "Solve x\u00b2 \u2212 7x + 12 = 0 by factorising.",
      solution: "(x \u2212 3)(x \u2212 4) = 0, so x = 3 or x = 4",
    },
    {
      id: "qf3",
      prompt: "Solve 2x\u00b2 \u2212 10x + 12 = 0 by factorising.",
      solution:
        "Divide by 2 first: x\u00b2 \u2212 5x + 6 = 0, then (x \u2212 2)(x \u2212 3) = 0, so x = 2 or x = 3",
    },
    {
      id: "qf4",
      prompt: "Solve 3x\u00b2 + 5x \u2212 2 = 0 by factorising.",
      solution: "(3x \u2212 1)(x + 2) = 0, so x = 1/3 or x = \u22122",
    },
    {
      id: "qf5",
      prompt: "Solve 4x\u00b2 \u2212 4x \u2212 15 = 0 by factorising.",
      solution: "(2x + 3)(2x \u2212 5) = 0, so x = \u22123/2 or x = 5/2",
    },
  ],

  "straight-line-graphs": [
    {
      id: "sl1",
      prompt: "Find the gradient of the line through (2, 3) and (6, 11).",
      solution: "Gradient = (11 \u2212 3) \u00f7 (6 \u2212 2) = 8 \u00f7 4 = 2",
    },
    {
      id: "sl2",
      prompt:
        "Find the equation of the line with gradient 3 and y-intercept \u22124.",
      solution: "y = 3x \u2212 4",
    },
    {
      id: "sl3",
      prompt: "Find the equation of the line through (\u22122, 5) and (4, \u22121).",
      solution:
        "Gradient = (\u22121 \u2212 5) \u00f7 (4 \u2212 (\u22122)) = \u22121, so y = \u2212x + 3",
    },
    {
      id: "sl4",
      prompt:
        "Find the equation of the line parallel to y = 2x + 7 passing through (5, 1).",
      solution: "Parallel lines share a gradient, so m = 2 and y = 2x \u2212 9",
    },
    {
      id: "sl5",
      prompt:
        "The lines y = 3x \u2212 2 and y = \u2212x + 6 intersect. Find their point of intersection.",
      solution: "3x \u2212 2 = \u2212x + 6 gives x = 2, then y = 4, so (2, 4)",
    },
  ],

  "parabola-turning-point": [
    {
      id: "tp1",
      prompt: "For y = x\u00b2 \u2212 4x + 3, find the roots and the turning point.",
      solution: "Roots: (1, 0) and (3, 0). Turning point: (2, \u22121)",
    },
    {
      id: "tp2",
      prompt: "For y = x\u00b2 \u2212 8x + 12, find the roots and the turning point.",
      solution: "Roots: (2, 0) and (6, 0). Turning point: (4, \u22124)",
    },
    {
      id: "tp3",
      prompt: "For y = 2x\u00b2 \u2212 8x + 6, find the roots and the turning point.",
      solution: "Roots: (1, 0) and (3, 0). Turning point: (2, \u22122)",
    },
    {
      id: "tp4",
      prompt: "For y = x\u00b2 + 2x \u2212 15, find the roots and the turning point.",
      solution: "Roots: (\u22125, 0) and (3, 0). Turning point: (\u22121, \u221216)",
    },
    {
      id: "tp5",
      prompt:
        "For y = 2x\u00b2 \u2212 12x + 16, find the roots and the turning point, and state the minimum value of the function.",
      solution:
        "Roots: (2, 0) and (4, 0). Turning point: (3, \u22122). Minimum value: \u22122",
    },
  ],
};

export function questionsFor(topicId: string): PracticeQuestion[] {
  return QUESTIONS[topicId] ?? [];
}
