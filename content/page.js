const page = {
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
      value: "<span id='time-since-load'>" + timeCounter + "</span>",
    });
    result.push({ name: "Links", value: document.links.length });
    result.push({
      name: "Average element colour",
      value: this.getAverageColourOfAllElementsOnPage(),
    });
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

  getAverageColourOfAllElementsOnPage() {
    const elements = document.querySelectorAll("*");
    let r = 0,
      g = 0,
      b = 0;
    let count = 0;

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      const color = window.getComputedStyle(element).getPropertyValue("color");
      const colorArray = color.match(/\d+/g);
      if (colorArray.length >= 3) {
        r += parseInt(colorArray[0]);
        g += parseInt(colorArray[1]);
        b += parseInt(colorArray[2]);
        count++;
      }
    }

    const averageR = Math.round(r / count);
    const averageG = Math.round(g / count);
    const averageB = Math.round(b / count);

    return `rgb("${averageR}, ${averageG}, ${averageB}")`;
  },
};
