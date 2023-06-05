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
      name: "Fonts on this page",
      value: this.getFonts().join(", "),
      display: "table",
    });
    result.push({
      name: "Seconds since initial load",
      value: "<span id='time-since-load'></span>",
    });
    result.push({ name: "Links", value: document.links.length });

    const timing = window.performance.timing;
    const loadTime = (timing.loadEventEnd - timing.navigationStart) / 1000;
    result.push({
      name: "Page load time",
      value: loadTime + "s",
    });

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

    let sentiment = words.getSentiment(wordsOnThisPage);
    result.push({
      name: "Sentiments",
      value: words.getSentimentDisplay(sentiment),
    });

    return result;
  },

  getFonts() {
    let fonts = new Set(); // We use a Set to avoid duplicates
    let elements = document.querySelectorAll("body *:not(.things-popup *)"); // Get all elements excluding ones inside 'things-popup'

    for (let i = 0; i < elements.length; i++) {
      let computedStyle = window.getComputedStyle(elements[i]);
      let font = computedStyle.getPropertyValue("font-family");

      // There can be multiple fonts defined, we split them
      let fontList = font.split(",");

      for (let f of fontList) {
        // Trim the font name and add it to the set
        fonts.add(`<span style='font-family:${f.trim()}'>${f.trim()}</span>`);
      }
    }

    console.log({ fonts });

    // Convert the set to an array and return it
    return Array.from(fonts);
  },
};
