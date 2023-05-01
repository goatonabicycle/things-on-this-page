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
      <div class="section">
        <div class="title" data-section="${sectionId}">${title}</div>
        <div id="${sectionId}" class="content hidden">
          ${data
            .map((item) => `<div>${item.name}: ${item.value}</div>`)
            .join("")}
        </div>
      </div>
    `;

    return result;
  },

  toggleSection(event) {
    const sectionId = event.target.dataset.section;
    const content = document.getElementById(sectionId);
    content.classList.toggle("hidden");
    event.target.classList.toggle("expanded");
  },

  addEventListeners() {
    const sectionTitles = document.querySelectorAll(
      ".things-popup-contain .title"
    );
    sectionTitles.forEach((title) => {
      title.addEventListener("click", this.toggleSection);
    });
  },

  togglePopup() {
    const container = document.getElementById("things-popup");
    if (container) {
      if (container.classList.contains("things-popup-open")) {
        container.classList.remove("things-popup-open");
        setTimeout(() => {
          container.style.display = "none";
        }, 300);
      } else {
        container.style.display = "block";
        setTimeout(() => {
          container.classList.add("things-popup-open");
        }, 0);
      }
    }
  },

  createIcon() {
    const icon = document.createElement("div");
    icon.id = "things-popup-icon";
    icon.className = "things-popup-icon";
    icon.addEventListener("click", () => {
      icon.classList.toggle("open");
      this.togglePopup();
    });
    return icon;
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
      container.style.display = "none";
      document.body.appendChild(container);
      this.addEventListeners();
    }

    const icon =
      document.getElementById("things-popup-icon") || this.createIcon();
    if (!document.body.contains(icon)) {
      document.body.appendChild(icon);
    }
  },
};
