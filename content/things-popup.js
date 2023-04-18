import { page } from "./page.js";
import { mouse } from "./mouse.js";

export const thingsPopup = {
  renderMouseSection() {
    const mouseData = mouse.getCurrentData();
    const container = document.getElementById("mouse");

    container.innerHTML = mouseData
      .map((item) => `<div class="item">${item.name}: ${item.value}</div>`)
      .join("");
  },

  renderThingsSection() {
    const thingsOnThisPage = page.getThingsOnThisPage();
    const container = document.getElementById("things");

    container.innerHTML = thingsOnThisPage
      .map((item) => `<div class="item">${item.name}: ${item.value}</div>`)
      .join("");
  },

  makeSection(title, data, sectionId) {
    let result = `
      <div class="title">${title}</div>      
      <div id="${sectionId}" class="content">
        ${data.map((item) => `<div>${item.name}: ${item.value}</div>`).join("")}
      </div>
    `;

    return result;
  },

  render() {
    const thingsOnThisPage = page.getThingsOnThisPage();
    const mouseData = mouse.getCurrentData();

    const container =
      document.getElementById("things-popup") || document.createElement("div");
    container.id = "things-popup";
    container.className = "things-popup-contain";

    const thingsSection = this.makeSection(
      "Things On This Page",
      thingsOnThisPage,
      "things"
    );
    const mouseSection = this.makeSection(
      "Things You Have Done",
      mouseData,
      "mouse"
    );
    container.innerHTML = `${thingsSection}${mouseSection}`;

    if (!document.body.contains(container)) {
      document.body.appendChild(container);
    }
  },
};
