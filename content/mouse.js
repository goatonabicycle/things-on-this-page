import { thingsPopup } from "./things-popup";

export const mouse = {
  numberOfClicks: 0,
  quadrantTimes: [0, 0, 0, 0],
  totalQuadrantTime: 0,
  lastQuadrant: null,
  lastTime: null,
  totalMouseMoveDistance: 0,
  lastSeenAt: { x: null, y: null },
  totalOffset: 0,
  currOffset: window.pageYOffset,

  handleMouseMove(e) {
    // This is for calculating the distance that the mouse has moved.
    if (this.lastSeenAt.x) {
      this.totalMouseMoveDistance += Math.sqrt(
        Math.pow(this.lastSeenAt.y - e.clientY, 2) +
          Math.pow(this.lastSeenAt.x - e.clientX, 2)
      );
    }
    this.lastSeenAt.x = e.clientX;
    this.lastSeenAt.y = e.clientY;

    // This is the quadrant mechanism
    const currentTime = new Date().getTime();
    const currentQuadrant = this.getQuadrant(e.clientX, e.clientY);

    if (this.lastQuadrant !== null) {
      this.quadrantTimes[this.lastQuadrant] += currentTime - this.lastTime;
      this.totalQuadrantTime += currentTime - this.lastTime;
    }

    this.lastQuadrant = currentQuadrant;
    this.lastTime = currentTime;

    thingsPopup.renderMouseSection();
  },

  handleScroll() {
    const addedOffset = Math.abs(this.currOffset - window.pageYOffset);
    this.totalOffset += addedOffset;
    this.currOffset = window.pageYOffset;
    thingsPopup.renderMouseSection();
  },

  handleClick() {
    this.numberOfClicks++;
    thingsPopup.renderMouseSection();
  },

  getQuadrant(x, y) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return x < width / 2 ? (y < height / 2 ? 0 : 2) : y < height / 2 ? 1 : 3;
  },

  updateQuadrantPercentages() {
    const currentTime = new Date().getTime();
    if (this.lastQuadrant !== null) {
      this.quadrantTimes[this.lastQuadrant] += currentTime - this.lastTime;
      this.totalQuadrantTime += currentTime - this.lastTime;
    }
    this.lastTime = currentTime;
  },

  renderQuadrantPercentages() {
    const quadrantPercentages = this.quadrantTimes.map((time) =>
      Math.round((time / this.totalQuadrantTime) * 100)
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
          <span class="quadrant-block-text" style="">${percentage}%</span>
        </div>
      </div>
    `;
  },

  getCurrentData() {
    this.updateQuadrantPercentages();
    const mouseData = [
      { name: "Mouse clicks", value: this.numberOfClicks },
      { name: "Mouse scrolled", value: `${Math.round(this.totalOffset)}px` },
      {
        name: "Mouse moved",
        value: `${Math.round(this.totalMouseMoveDistance)}px`,
      },
      {
        name: "Percentage spent in quadrant",
        value: this.renderQuadrantPercentages(),
      },
    ];
    return mouseData;
  },

  monitor() {
    document.addEventListener("click", this.handleClick.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("scroll", this.handleScroll.bind(this));
  },
};
