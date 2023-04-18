import { page } from "./page.js";
import { mouse } from "./mouse.js";

export const thingsPopup = {
  renderThingsOnThisPageSection() {
    const thingsOnThisPage = page.getThingsOnThisPage();
    const container = document.getElementById("things-on-page");

    if (container) {
      const content = container.querySelector(".content");
      content.innerHTML = thingsOnThisPage
        .map((item) => `<div class="item">${item.name}: ${item.value}</div>`)
        .join("");
    } else {
      const sectionHtml = this.createSection(
        "Things On This Page",
        thingsOnThisPage
      );

      document.body.insertAdjacentHTML("beforeend", sectionHtml);
    }
  },

  renderMouseSection() {
    const mouseData = [
      { name: "Clicks", value: mouse.numberOfClicks },
      { name: "Scrolled", value: `${Math.round(mouse.totalOffset)}px` },
      {
        name: "Mouse moved",
        value: `${Math.round(mouse.totalMouseMoveDistance)}px`,
      },
    ];

    const container = document.getElementById("mouse-data");

    if (container) {
      const content = container.querySelector(".content");
      content.innerHTML = mouseData
        .map((item) => `<div class="item">${item.name}: ${item.value}</div>`)
        .join("");
    }
  },

  render() {
    const thingsOnThisPage = page.getThingsOnThisPage();

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
      <div id="mousedata" class="content">
        ${thingsIHaveDone
          .map((item) => `<div>${item.name}: ${item.value}</div>`)
          .join("")}
      </div>
    `;

    document.body.appendChild(container);
  },
};
