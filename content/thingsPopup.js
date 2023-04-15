import { page } from "./page.js";
import { mouse } from "./mouse.js";

let timeCounter = -1;

export const thingsPopup = {
  renderTimeSinceLoad() {
    timeCounter++;
    const timeSinceLoadElement = document.getElementById("time-since-load");
    if (timeSinceLoadElement) {
      timeSinceLoadElement.textContent = timeCounter;
    }
  },

  render() {
    const thingsOnThisPage = page.getThingsOnThisPage(timeCounter);

    const thingsIHaveDone = [
      { name: "Clicks", value: mouse.numberOfClicks },
      { name: "Scrolled", value: `${Math.round(mouse.totalOffset)}px` },
      {
        name: "Mouse moved",
        value: `${Math.round(mouse.totalMouseMoveDistance)}px`,
      },
    ];

    const container =
      document.getElementById("things-popup") || document.createElement("div");
    container.id = "things-popup";
    container.className = "things-popup-contain";

    container.innerHTML = `
      <div class="title">Things On This Page</div>
      <div class="content">
        ${thingsOnThisPage
          .map((item) => `<div>${item.name}: ${item.value}</div>`)
          .join("")}
      </div>
      <br />
      <div class="title">Things You Have Done</div>
      <div class="content">
        ${thingsIHaveDone
          .map((item) => `<div>${item.name}: ${item.value}</div>`)
          .join("")}
      </div>
    `;

    document.body.appendChild(container);
  },
};
