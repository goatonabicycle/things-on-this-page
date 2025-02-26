import { getFlag, isPanelVisible } from "./feature-flags";
import { mouse } from "./mouse";
import { page } from "./page";
import { tabDisplay } from "./tab-display";

interface Item {
	name: string;
	value: string;
	display?: "table";
	fullWidth?: boolean;
}

export const thingsPopup = {
	renderMouseSection(): void {
		const mouseData = mouse.getCurrentData();
		const container = document.getElementById("mouse-items");

		if (container) {
			container.innerHTML = this.renderItemsGrid(mouseData);
		}
	},

	renderTabsSection(): void {
		tabDisplay.getCurrentData().then((tabData) => {
			const container = document.getElementById("tabs-items");
			if (container) {
				container.innerHTML = this.renderItemsGrid(tabData);
			}
		});
	},

	renderThingsSection(): void {
		const thingsOnThisPage = page.getThingsOnThisPage();
		const container = document.getElementById("things-items");

		if (container) {
			container.innerHTML = this.renderItemsGrid(thingsOnThisPage);
		}
	},

	renderWordsSection(): void {
		const wordsOnThisPage = page.getWordThings();
		const container = document.getElementById("words-items");

		if (container) {
			container.innerHTML = this.renderItemsGrid(wordsOnThisPage);
		}
	},

	renderItemsGrid(items: Item[]): string {
		return `<div class="items-grid">
			${items.map((item) => this.renderItem(item)).join("")}
		</div>`;
	},

	renderItem(item: Item): string {
		const cssClass =
			item.display === "table" || item.fullWidth ? "item full-width" : "item";
		return `<div class="${cssClass}">
			<span class='item-name'>${item.name}</span> 
			<span class='item-value'>${item.value}</span> 
		</div>`;
	},

	createCategory(title: string, id: string): string {
		return `
			<div class="category">
				<div class="category-title">${title}</div>
				<div id="${id}-items"></div>
			</div>
		`;
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

		const outlineColour: string = getFlag("outlineColour");
		if (outlineColour !== "blue") {
			icon.style.backgroundColor = outlineColour;
		}

		icon.addEventListener("click", () => {
			const isOpen = icon.classList.toggle("open");
			icon.textContent = isOpen ? "×" : "Things";
			this.togglePopup();
		});
		return icon;
	},

	render(): void {
		const container =
			document.getElementById("things-popup") || document.createElement("div");
		container.id = "things-popup";
		container.className = "things-popup-contain";

		const thingsCategory = this.createCategory("Page Information", "things");
		const wordsCategory = this.createCategory("Words Analysis", "words");
		const mouseCategory = this.createCategory("Mouse Tracking", "mouse");
		const tabsCategory = this.createCategory("Tab Time Tracking", "tabs");

		container.innerHTML = "";

		const categoriesHTML = document.createElement("div");
		categoriesHTML.innerHTML = `${thingsCategory}${wordsCategory}${mouseCategory}${tabsCategory}`;
		container.appendChild(categoriesHTML);

		if (!document.body.contains(container)) {
			container.style.display = "none";
			document.body.appendChild(container);
		}

		const icon =
			document.getElementById("things-popup-icon") || this.createIcon();
		if (!document.body.contains(icon)) {
			document.body.appendChild(icon);
		}

		this.renderThingsSection();
		this.renderWordsSection();
		this.renderMouseSection();
		this.renderTabsSection();
	},
};
