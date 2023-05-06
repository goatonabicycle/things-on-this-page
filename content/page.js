import { words } from "./words.js";

export const page = {
  getThingsOnThisPage() {
    const result = [];

    result.push({ name: "Images", value: document.images.length });
    result.push({ name: "Scripts", value: document.scripts.length });
    result.push({ name: "Style Sheets", value: document.styleSheets.length });
    result.push({ name: "Links", value: document.links.length });
    result.push({
      name: "Page height",
      value:
        Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        ) + "px",
    });
    result.push({
      name: "Page width",
      value:
        (window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth) + "px",
    });
    result.push({
      name: "Seconds since initial load",
      value: "<span id='time-since-load'></span>",
    });
    result.push({ name: "Links", value: document.links.length });

    return result;
  },

  getWordThings() {
    const result = [];

    let wordsOnThisPage = words.getWordsOnPage();
    console.log({ wordsOnThisPage });
    result.push({
      name: "Total number of characters",
      value: document.body.innerHTML.length,
    });

    result.push({
      name: "Number of words on page",
      value: wordsOnThisPage.length,
    });

    result.push({
      name: "Top 30 words on this page",
      value: words.getAWordCountTable(wordsOnThisPage),
      display: "table",
    });

    result.push({
      name: "Average word length",
      value: words.getAverageWordLength(wordsOnThisPage),
    });

    result.push({
      name: "Longest word",
      value: words.getLongestWord(wordsOnThisPage),
    });

    result.push({
      name: "Character distribution map",
      value: words.createCharDistTable(
        words.characterDistributionMap(wordsOnThisPage)
      ),
      display: "table",
    });

    result.push({
      name: "Sentiments",
      value: words.displaySentimentInfo(words.getSentiment(wordsOnThisPage)),
    });

    return result;
  },
};
