import { getFlag, isPanelVisible } from "./feature-flags";
import { mouse } from "./mouse";
import { page } from "./page";
import { tabDisplay } from "./tab-display";
import { cookieDetector } from "./cookie-detector";
import { requestTracker } from "./request-tracker";

interface Item {
	name: string;
	value: string;
	display?: "table";
	fullWidth?: boolean;
}

export const thingsPopup = {
	renderMouseSection(): void {
		if (!isPanelVisible("mouse")) return;

		const mouseData = mouse.getCurrentData();
		const container = document.getElementById("mouse-items");

		if (container) {
			container.innerHTML = this.renderItemsGrid(mouseData);
		}
	},

	renderTabsSection(): void {
		if (!isPanelVisible("tabs")) return;

		tabDisplay.getCurrentData().then((tabData) => {
			const container = document.getElementById("tabs-items");
			if (container) {
				container.innerHTML = this.renderItemsGrid(tabData);
			}
		});
	},

	renderThingsSection(): void {
		if (!isPanelVisible("things")) return;

		const thingsOnThisPage = page.getThingsOnThisPage();
		const container = document.getElementById("things-items");

		if (container) {
			container.innerHTML = this.renderItemsGrid(thingsOnThisPage);
		}
	},

	renderWordsSection(): void {
		if (!isPanelVisible("words")) return;

		const wordsOnThisPage = page.getWordThings();
		const container = document.getElementById("words-items");

		if (container) {
			container.innerHTML = this.renderItemsGrid(wordsOnThisPage);
		}
	},

	renderCookiesSection(): void {
		if (!isPanelVisible("cookies")) return;

		const cookieData = cookieDetector.getCookies();
		const container = document.getElementById("cookies-items");

		if (container) {
			container.innerHTML = this.renderItemsGrid(cookieData);
		}
	},

	renderRequestsSection(): void {
		if (!isPanelVisible("requests")) return;

		const requestsData = requestTracker.getCurrentData();
		const container = document.getElementById("requests-items");

		if (container) {
			container.innerHTML = this.renderItemsGrid(requestsData);
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
		const isVisible = isPanelVisible(id);
		const displayStyle = isVisible ? "" : "display: none;";

		return `
			<div class="category" id="${id}-category" style="${displayStyle}">
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

	updateCategoryVisibility(): void {
		const categories = [
			{ id: "things", name: "Page Information" },
			{ id: "words", name: "Words Analysis" },
			{ id: "mouse", name: "Mouse Tracking" },
			{ id: "tabs", name: "Tab Time Tracking" },
			{ id: "cookies", name: "Cookies" },
			{ id: "requests", name: "Network Requests" },
		];

		for (const category of categories) {
			const categoryElement = document.getElementById(
				`${category.id}-category`,
			);
			if (categoryElement) {
				categoryElement.style.display = isPanelVisible(category.id)
					? "block"
					: "none";
			}
		}
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
		const cookiesCategory = this.createCategory("Cookies", "cookies");
		const requestsCategory = this.createCategory(
			"Network Requests",
			"requests",
		);

		container.innerHTML = "";

		const categoriesHTML = document.createElement("div");
		categoriesHTML.innerHTML = `${thingsCategory}${wordsCategory}${mouseCategory}${tabsCategory}${cookiesCategory}${requestsCategory}`;
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
		this.renderCookiesSection();
		this.renderRequestsSection();
	},
};
