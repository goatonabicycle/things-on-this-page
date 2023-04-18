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

    result.push({
      name: "Total number of characters",
      value: document.body.innerHTML.length,
    });
    result.push({
      name: "Number of words on Page",
      value: words.getWordsOnPage().length,
    });

    result.push({
      name: "Words on this page",
      value: words.getAWordCountTable(words.getWordsOnPage()),
      display: "table",
    });

    return result;
  },
};
