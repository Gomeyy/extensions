import { showHUD } from "@raycast/api";
import { LoremIpsum } from "lorem-ipsum";

const generator = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

// generator.generateWords(1);
// generator.generateParagraphs(7);

export const generateParagraph = () => {
  return generator.generateSentences(10);
};

export const generateSentence = () => {
  return generator.generateSentences(1);
};

export const notify = () => {
  showHUD("Copied to clipboard");
};
