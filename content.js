let thingsPopup = {
  renderTimeSinceLoad() {
    timeCounter++;
    let container = document.getElementById("time-since-load");
    if (container) container.innerHTML = timeCounter;
  },

  render() {
    let renderItemsToShow = (itemsToShow) => {
      let result = "<div class='content'>";

      for (let i = 0; i < itemsToShow.length; i++) {
        const item = itemsToShow[i];
        result += `<div>${item.name}: ${item.value} </div>`;
      }

      result += "</div>";

      return result;
    };

    let thingsOnThisPage = [];
    thingsOnThisPage.push(...pageThings.getThingsOnThisPage());

    let thingsIHaveDone = [];
    thingsIHaveDone.push({ name: "Clicks", value: mouseThings.numberOfClicks });
    thingsIHaveDone.push({
      name: "Scrolled",
      value: Math.round(mouseThings.totalOffset) + "px",
    });
    thingsIHaveDone.push({
      name: "Mouse moved",
      value: Math.round(mouseThings.totalMouseMoveDistance) + "px",
    });

    let container = document.getElementById("things-popup");
    if (!container) {
      container = document.createElement("div");
      container.id = "things-popup";
      container.className = "things-popup-contain";
    } else document.body.removeChild(container);

    container.innerHTML =
      "<div class='title'>Things On This Page</div>" +
      renderItemsToShow(thingsOnThisPage) +
      "<br /> " +
      "<div class='title'>Things You Have Done</div>" +
      renderItemsToShow(thingsIHaveDone);
    document.body.appendChild(container);
  },
};

let words = {
  getWordsOnPage() {
    const thingsPopup = document.getElementById("things-popup");
    if (!thingsPopup) return [];

    // Get all the text on the page, excluding the text in the popup
    const everything = document.body.innerText.replace(
      thingsPopup.innerText,
      ""
    );

    // Split the text into words using a regular expression
    const words = everything.match(/[A-Za-z]+('[A-Za-z]+)?/g) || [];

    return words;
  },

  countWords(words) {
    const counts = new Map();

    for (const word of words) {
      const count = counts.get(word) || 0;
      counts.set(word, count + 1);
    }

    return counts;
  },

  sortCountsArray(counts) {
    const sortedCountsArray = Array.from(counts.entries()).sort((a, b) => {
      if (a[1] === b[1]) {
        return a[0].localeCompare(b[0]);
      }
      return b[1] - a[1];
    });

    return sortedCountsArray;
  },

  createTable(sortedCountsArray) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const trHead = document.createElement("tr");
    const thWord = document.createElement("th");
    const thCount = document.createElement("th");

    thWord.textContent = "Word";
    thCount.textContent = "Count";

    trHead.appendChild(thWord);
    trHead.appendChild(thCount);
    thead.appendChild(trHead);
    table.appendChild(thead);

    for (const [word, count] of sortedCountsArray) {
      const trBody = this.createTableRow(word, count);
      tbody.appendChild(trBody);
    }

    table.appendChild(tbody);
    return table;
  },

  createTableRow(word, count) {
    const tr = document.createElement("tr");
    const tdWord = document.createElement("td");
    const tdCount = document.createElement("td");

    tdWord.textContent = word;
    tdCount.textContent = count;

    tr.appendChild(tdWord);
    tr.appendChild(tdCount);

    return tr;
  },

  getAWordCountTable(words) {
    if (!words || words.length === 0) {
      return;
    }

    const counts = this.countWords(words);
    const sortedCountsArray = this.sortCountsArray(counts);
    const table = this.createTable(sortedCountsArray);

    return table.outerHTML;
  },
};

class Mouse {
  numberOfClicks = 0;
  totalMouseMoveDistance = 0;
  lastSeenAt = { x: null, y: null };
  totalOffset = 0;
  currOffset = window.pageYOffset;

  monitor() {
    document.addEventListener("click", () => {
      this.numberOfClicks++;
      thingsPopup4.render();
    });

    document.addEventListener("mousemove", (e) => {
      if (this.lastSeenAt.x) {
        this.totalMouseMoveDistance += Math.sqrt(
          Math.pow(this.lastSeenAt.y - e.clientY, 2) +
            Math.pow(this.lastSeenAt.x - e.clientX, 2)
        );
      }
      this.lastSeenAt.x = e.clientX;
      this.lastSeenAt.y = e.clientY;

      thingsPopup.render();
    });

    document.addEventListener("scroll", () => {
      let addedOffset = Math.abs(this.currOffset - window.pageYOffset);
      this.totalOffset += addedOffset;
      this.currOffset = window.pageYOffset;
      thingsPopup.render();
    });
  }
}

class Page {
  getThingsOnThisPage() {
    let result = [];

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
  }

  getAverageColourOfAllElementsOnPage() {
    let elements = document.querySelectorAll("*");
    let r = 0,
      g = 0,
      b = 0;
    let count = 0;

    for (let i = 0; i < elements.length; i++) {
      let element = elements[i];
      let color = window.getComputedStyle(element).getPropertyValue("color");
      let colorArray = color.match(/\d+/g);
      if (colorArray.length >= 3) {
        r += parseInt(colorArray[0]);
        g += parseInt(colorArray[1]);
        b += parseInt(colorArray[2]);
        count++;
      }
    }

    let averageR = Math.round(r / count);
    let averageG = Math.round(g / count);
    let averageB = Math.round(b / count);

    return `rgb("${averageR}, ${averageG}, ${averageB}")`;
  }
}

//TODO: Dynamically do these based on UI selections?

let mouseThings = new Mouse();
let pageThings = new Page();
mouseThings.monitor();

//TODO: Handle these classes better.
let timeCounter = -1;

function renderEverySecond() {
  thingsPopup.renderTimeSinceLoad();
  setTimeout(renderEverySecond, 1000);
}

renderEverySecond();
