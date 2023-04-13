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

//TODO: Dynamically do these based on UI selections?

mouse.monitor();

let timeCounter = -1;

function renderEverySecond() {
  thingsPopup.renderTimeSinceLoad();
  setTimeout(renderEverySecond, 1000);
}

renderEverySecond();
