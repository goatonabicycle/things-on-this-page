import { getFlag } from "./feature-flags";
import { mouse } from "./mouse";
import { page } from "./page";

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
		const result = `
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

		const allSectionContents = document.querySelectorAll(".section-content");
		const allSectionTitles = document.querySelectorAll(".section-title");

		allSectionContents.forEach((section) => {
			if (section.id !== sectionId) {
				section.classList.add("hidden");
			}
		});

		allSectionTitles.forEach((title) => {
			if (title.dataset.section !== sectionId) {
				title.classList.remove("expanded");
			}
		});

		// Toggle the clicked section
		if (content) {
			content.classList.toggle("hidden");
			target.classList.toggle("expanded");
		}
	},

	addEventListeners(): void {
		const sectionTitles = document.querySelectorAll(
			".things-popup-contain .section-title",
		);

		for (const title of sectionTitles) {
			title.addEventListener("click", this.toggleSection.bind(this));
		}
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
		icon.textContent = "Things";

		icon.className =
			"fixed top-2 right-2 cursor-pointer flex justify-center items-center w-24 h-5 text-center text-sm font-bold bg-white border-solid border z-50";

		const outlineColour: string = getFlag("outlineColour");
		icon.style.borderColor = outlineColour;

		icon.addEventListener("click", () => {
			const isOpen = icon.classList.toggle("open");
			icon.textContent = isOpen ? "x" : "Things";
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

		const thingsSection = this.makeSection("Page", thingsOnThisPage, "things");
		const wordsSection = this.makeSection("Words", wordsOnThisPage, "words");
		const mouseSection = this.makeSection("Mouse", mouseData, "mouse");

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
