class thingsPopup {
  renderTimeSinceLoad() {
    timeCounter++;
    let container = document.getElementById("time-since-load");
    if (container) container.innerHTML = timeCounter;
  }

  render() {
    let renderItemsToShow = (itemsToShow) => {
      return (
        "<div class='content'>" +
        Object.entries(itemsToShow)
          .map(([key, value]) => `<div>${key}: ${value}</div> `)
          .join("") +
        "</div>"
      );
    };

    let thingsOnThisPage = {
      ...pageThings.getThingsOnThisPage(),
      "Number of words on Page": wordThings.wordsOnThisDocument().length,
      "Words on this page": wordThings.wordsOnThisDocument(), // TODO: Format this nicely.
    };

    let thingsIHaveDone = {
      Clicks: mouseThings.numberOfClicks,
      Scrolled: Math.round(mouseThings.totalOffset) + "px",
      "Mouse moved": Math.round(mouseThings.totalMouseMoveDistance) + "px",
    };

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
    return {
      Images: document.images.length,
      Scripts: document.scripts.length,
      "Style Sheets": document.styleSheets.length,
      Links: document.links.length,
      "Page height":
        Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        ) + "px",
      "Page width":
        (window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth) + "px",
      "Seconds since initial load":
        "<span id='time-since-load'>" + timeCounter + "</span>",
      "Average element colour": this.getAverageColourOfAllElementsOnPage(),
      "Total number of characters": document.body.innerHTML.length,
    };
  }

  getAverageColourOfAllElementsOnPage() {
    let elements = document.querySelectorAll("*");
    let r = 0,
      g = 0,
      b = 0;
    let count = 0;

    for (element of elements) {
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
