console.log({ document });

class Words {
  getAllWordsInDocument() {
    let thingsPopup = document.getElementById("things-popup");
    if (!thingsPopup) return [];

    // TODO: Wow this is super hacky. Get a better way.
    let everything = document.body.innerText.replace(thingsPopup.innerText, "");

    let result = [];
    let regex = /[A-Za-z]+('[A-Za-z]+)?/g; // TODO: Ugh... Explain this crazy Regex
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
      renderPopup();
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

      renderPopup();
    });

    document.addEventListener("scroll", () => {
      let addedOffset = Math.abs(this.currOffset - window.pageYOffset);
      this.totalOffset += addedOffset;
      this.currOffset = window.pageYOffset;
      renderPopup();
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
    };
  }
}

//TODO: Dynamically do these based on UI selections?
let wordThings = new Words();
let mouseThings = new Mouse();
let pageThings = new Page();
mouseThings.monitor();

function renderItemsToShow(itemsToShow) {
  return (
    "<div class='content'>" +
    Object.entries(itemsToShow)
      .map(([key, value]) => `<div>${key}: ${value}</div> `)
      .join("") +
    "</div>"
  );
}

let renderPopup = () => {
  let thingsOnThisPage = {
    ...pageThings.getThingsOnThisPage(),
    "Number of words on Page": wordThings.getAllWordsInDocument().length,
    "Words on this page": wordThings.getAllWordsInDocument(), // TODO: Format this nicely.
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
};
