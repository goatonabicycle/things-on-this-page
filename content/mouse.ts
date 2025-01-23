type Coordinate = {
	x: number | null;
	y: number | null;
};

type Mouse = {
	numberOfClicks: number;
	quadrantTimes: number[];
	totalQuadrantTime: number;
	lastQuadrant: number | null;
	lastTime: number | null;
	totalMouseMoveDistance: number;
	lastSeenAt: Coordinate;
	totalScroll: number;
	totalScrollUp: number;
	totalScrollDown: number;
	currOffset: number;

	handleMouseMove: (e: MouseEvent) => void;
	handleScroll: () => void;
	handleClick: () => void;
	getQuadrant: (x: number, y: number) => number;
	updateQuadrantPercentages: () => void;
	renderQuadrantPercentages: () => string;
	renderQuadrantBlock: (index: number, percentage: number) => string;
	getCurrentData: () => { name: string; value: string }[];
	monitor: () => void;
};

export const mouse: Mouse = {
	numberOfClicks: 0,
	quadrantTimes: [0, 0, 0, 0],
	totalQuadrantTime: 0,
	lastQuadrant: null,
	lastTime: null,
	totalMouseMoveDistance: 0,
	lastSeenAt: { x: null, y: null },
	totalScroll: 0,
	totalScrollUp: 0,
	totalScrollDown: 0,
	currOffset: window.pageYOffset,

	handleMouseMove(e) {
		if (this.lastSeenAt.x !== null && this.lastSeenAt.y !== null) {
			this.totalMouseMoveDistance += Math.sqrt(
				(this.lastSeenAt.y - e.clientY) ** 2 +
					(this.lastSeenAt.x - e.clientX) ** 2,
			);
		}
		this.lastSeenAt.x = e.clientX;
		this.lastSeenAt.y = e.clientY;

		const currentTime = new Date().getTime();
		const currentQuadrant = this.getQuadrant(e.clientX, e.clientY);

		if (this.lastQuadrant !== null && this.lastTime !== null) {
			this.quadrantTimes[this.lastQuadrant] += currentTime - this.lastTime;
			this.totalQuadrantTime += currentTime - this.lastTime;
		}

		this.lastQuadrant = currentQuadrant;
		this.lastTime = currentTime;
	},

	handleScroll() {
		const prevOffset = this.currOffset;
		this.currOffset = window.pageYOffset;
		const change = this.currOffset - prevOffset;

		if (change < 0) {
			this.totalScrollUp += Math.abs(change);
		} else {
			this.totalScrollDown += change;
		}

		this.totalScroll = this.totalScrollUp + this.totalScrollDown;
	},

	handleClick() {
		this.numberOfClicks++;
	},

	getQuadrant(x, y) {
		const width = window.innerWidth;
		const height = window.innerHeight;
		return x < width / 2 ? (y < height / 2 ? 0 : 2) : y < height / 2 ? 1 : 3;
	},

	updateQuadrantPercentages() {
		const currentTime = new Date().getTime();
		if (this.lastQuadrant !== null && this.lastTime !== null) {
			this.quadrantTimes[this.lastQuadrant] += currentTime - this.lastTime;
			this.totalQuadrantTime += currentTime - this.lastTime;
		}
		this.lastTime = currentTime;
	},

	renderQuadrantPercentages() {
		const quadrantPercentages = this.quadrantTimes.map((time) =>
			Math.round((time / this.totalQuadrantTime) * 100),
		);

		const html = `
      <div id="quadrant-percentage-container">
        ${this.renderQuadrantBlock(0, quadrantPercentages[0])}
        ${this.renderQuadrantBlock(1, quadrantPercentages[1])}
        ${this.renderQuadrantBlock(2, quadrantPercentages[2])}
        ${this.renderQuadrantBlock(3, quadrantPercentages[3])}
      </div>
    `;
		return html;
	},

	renderQuadrantBlock(index, percentage) {
		const row = index < 2 ? 0 : 1;
		const column = index % 2 === 0 ? 0 : 1;
		const bgColor = [0, 128, 120].join(",");
		const alpha = percentage / 100;
		const top = row * 50;
		const left = column * 50;

		return `
      <div class="quadrant-block" style="top: ${top}%; left: ${left}%;">
        <div class="quadrant-block-inside" style="background-color: rgba(${bgColor}, ${alpha}); ">
          <span class="quadrant-block-text">${percentage}%</span>
        </div>
      </div>
    `;
	},

	getCurrentData() {
		console.log("getCurrentData mouse");
		this.updateQuadrantPercentages();
		return [
			{ name: "Mouse clicks", value: `${this.numberOfClicks}` },
			{
				name: "Mouse scrolled up",
				value: `${Math.round(this.totalScrollUp)}px`,
			},
			{
				name: "Mouse scrolled down",
				value: `${Math.round(this.totalScrollDown)}px`,
			},
			{
				name: "Total mouse scrolled",
				value: `${Math.round(this.totalScroll)}px`,
			},
			{
				name: "Mouse moved",
				value: `${Math.round(this.totalMouseMoveDistance)}px`,
			},
			{
				name: "Percentage spent in quadrant",
				value: this.renderQuadrantPercentages(),
			},
		];
	},

	monitor() {
		document.addEventListener("click", this.handleClick.bind(this));
		document.addEventListener("mousemove", this.handleMouseMove.bind(this));
		document.addEventListener("scroll", () => this.handleScroll());
	},
};
