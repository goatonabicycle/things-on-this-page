import { page } from "./page.js";
import { mouse } from "./mouse.js";
import { requestTracking } from "./requests.js";

export const thingsPopup = {
  renderMouseSection() {
    const mouseData = mouse.getCurrentData();
    const container = document.getElementById("mouse");

    if (container)
      container.innerHTML = mouseData
        .map((item) => `<div class="item">${item.name}: ${item.value}</div>`)
        .join("");
  },

  renderThingsSection() {
    const thingsOnThisPage = page.getThingsOnThisPage();
    const container = document.getElementById("things");

    if (container)
      container.innerHTML = thingsOnThisPage
        .map((item) => `<div class="item">${item.name}: ${item.value}</div>`)
        .join("");
  },

  renderRequestsSection() {
    const requestData = requestTracking.getCurrentData();
    const container = document.getElementById("requests");

    if (container)
      container.innerHTML = requestData
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
    const requestData = requestTracking.getCurrentData();

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

    const requestsSection = this.makeSection(
      "Requests that have been made",
      requestData,
      "requests"
    );

    container.innerHTML = `${thingsSection}${mouseSection}${requestsSection}`;

    if (!document.body.contains(container)) {
      document.body.appendChild(container);
    }
  },
};
