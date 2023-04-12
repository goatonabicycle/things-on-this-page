class thingsPopup {
  renderTimeSinceLoad() {
    timeCounter++;
    let container = document.getElementById("time-since-load");
    if (container) container.innerHTML = timeCounter;
  }

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
  }
}

class Words {
  wordsOnThisDocument() {
    let thingsPopup = document.getElementById("things-popup");
    if (!thingsPopup) return [];

    // TODO: Wow this is super hacky. Get a better way.
    let everything = document.body.innerText.replace(thingsPopup.innerText, "");

    let result = [];

    // This gets words inside a string including contractions (like don't or wouldn't).
    // Contractions count as 1 word.
    let regex = /[A-Za-z]+('[A-Za-z]+)?/g;

    let match;
    while ((match = regex.exec(everything)) !== null) {
      result.push(match[0]);
    }

    return result;
  }

  getAWordCountTable(words) {
    const counts = {};

    words.forEach((word) => {
      if (word in counts) {
        counts[word]++;
      } else {
        counts[word] = 1;
      }
    });

    const countsArray = Object.keys(counts).map((word) => [word, counts[word]]);
    const sortedCountsArray = countsArray.sort((a, b) => {
      if (a[1] === b[1]) {
        return a[0].localeCompare(b[0]);
      }
      return b[1] - a[1];
    });

    const table = document.createElement("table");

    const thead = document.createElement("thead");

    const tr = document.createElement("tr");

    const thWord = document.createElement("th");
    thWord.textContent = "Word";

    const thCount = document.createElement("th");
    thCount.textContent = "Count";

    tr.appendChild(thWord);
    tr.appendChild(thCount);

    thead.appendChild(tr);

    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    for (const [word, count] of sortedCountsArray) {
      const tr = document.createElement("tr");

      const tdWord = document.createElement("td");
      tdWord.textContent = word;

      const tdCount = document.createElement("td");
      tdCount.textContent = count;

      tr.appendChild(tdWord);
      tr.appendChild(tdCount);

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    return table.innerHTML;
  }
}

class Mouse {
  numberOfClicks = 0;
  totalMouseMoveDistance = 0;
  lastSeenAt = { x: null, y: null };
  totalOffset = 0;
  currOffset = window.pageYOffset;

  monitor() {
    document.addEventListener("click", () => {
      this.numberOfClicks++;
      thisPopup.render();
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

      thisPopup.render();
    });

    document.addEventListener("scroll", () => {
      let addedOffset = Math.abs(this.currOffset - window.pageYOffset);
      this.totalOffset += addedOffset;
      this.currOffset = window.pageYOffset;
      thisPopup.render();
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
      value: wordThings.wordsOnThisDocument().length,
    });

    result.push({
      name: "Words on this page",
      value: wordThings.getAWordCountTable(wordThings.wordsOnThisDocument()),
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
let wordThings = new Words();
let mouseThings = new Mouse();
let pageThings = new Page();
mouseThings.monitor();

//TODO: Handle these classes better.
let thisPopup = new thingsPopup();

let timeCounter = -1;

function renderEverySecond() {
  thisPopup.renderTimeSinceLoad();
  setTimeout(renderEverySecond, 1000);
}

renderEverySecond();
