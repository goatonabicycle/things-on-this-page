import { page } from "./page";
import { mouse } from "./mouse";

interface Item {
  name: string;
  value: string;
}

export const thingsPopup = {
  renderMouseSection(): void {
    const mouseData = mouse.getCurrentData();
    const container = document.getElementById("mouse");

    if (container)
      container.innerHTML = mouseData
        .map((item) => this.contentRender(item))
        .join("");
  },

  renderThingsSection(): void {
    const thingsOnThisPage = page.getThingsOnThisPage();
    const container = document.getElementById("things");

    if (container)
      container.innerHTML = thingsOnThisPage
        .map((item) => this.contentRender(item))
        .join("");
  },

  contentRender(item: Item): string {
    return `<div class="item">
      <span class='item-name'>${item.name}:</span> 
      <span class='item-value'>${item.value}</span> 
    </div>`;
  },

  makeSection(title: string, data: Item[], sectionId: string): string {
    let result = `
      <div class="section">
        <div class="section-title" data-section="${sectionId}">${title}</div>
        <div id="${sectionId}" class="section-content hidden">
          ${data.map((item) => this.contentRender(item)).join("")}
        </div>
      </div>
    `;

    return result;
  },

  toggleSection(event: Event): void {
    const mouseEvent = event as MouseEvent;
    const target = mouseEvent.target as HTMLElement;
    const sectionId = target.dataset.section?.toString() || "";
    const content = document.getElementById(sectionId);
    if (content) {
      content.classList.toggle("hidden");
      target.classList.toggle("expanded");
    }
  },

  addEventListeners(): void {
    const sectionTitles = document.querySelectorAll(
      ".things-popup-contain .section-title"
    );
    sectionTitles.forEach((title) => {
      title.addEventListener("click", this.toggleSection.bind(this));
    });
  },

  togglePopup(): void {
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

  createIcon(): HTMLElement {
    const icon = document.createElement("div");
    icon.id = "things-popup-icon";
    icon.className = "things-popup-icon";
    icon.addEventListener("click", () => {
      icon.classList.toggle("open");
      this.togglePopup();
    });
    return icon;
  },

  render(): void {
    const container =
      document.getElementById("things-popup") || document.createElement("div");
    container.id = "things-popup";
    container.className = "things-popup-contain";

    const thingsOnThisPage = page.getThingsOnThisPage();
    const wordsOnThisPage = page.getWordThings();
    const mouseData = mouse.getCurrentData();

    const thingsSection = this.makeSection(
      "Page things",
      thingsOnThisPage,
      "things"
    );
    const wordsSection = this.makeSection("Words", wordsOnThisPage, "words");
    const mouseSection = this.makeSection(
      "Things You Have Done",
      mouseData,
      "mouse"
    );

    container.innerHTML = `${thingsSection}${wordsSection}${mouseSection}`;

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
