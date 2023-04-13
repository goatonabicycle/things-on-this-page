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
    thingsOnThisPage.push(...page.getThingsOnThisPage());

    let thingsIHaveDone = [];
    thingsIHaveDone.push({ name: "Clicks", value: mouse.numberOfClicks });
    thingsIHaveDone.push({
      name: "Scrolled",
      value: Math.round(mouse.totalOffset) + "px",
    });
    thingsIHaveDone.push({
      name: "Mouse moved",
      value: Math.round(mouse.totalMouseMoveDistance) + "px",
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

let page = {
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
  },

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
  },
};

//TODO: Dynamically do these based on UI selections?

mouse.monitor();

let timeCounter = -1;

function renderEverySecond() {
  thingsPopup.renderTimeSinceLoad();
  setTimeout(renderEverySecond, 1000);
}

renderEverySecond();
