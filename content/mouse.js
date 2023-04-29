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
    const currentQuadrant = this.getQuadrant(event.clientX, event.clientY);

    if (this.lastQuadrant !== null) {
      const timeSpent = currentTime - this.lastTime;
      this.updateQuadrantTimes(this.lastQuadrant, timeSpent);
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

  updateQuadrantTimes(quadrant, time) {
    this.quadrantTimes[quadrant] += time;
    this.totalQuadrantTime += time;
  },

  getCurrentData() {
    const quadrantPercentages = this.quadrantTimes.map((time) =>
      Math.round((time / this.totalQuadrantTime) * 100)
    );

    const mouseData = [
      { name: "Mouse clicks", value: this.numberOfClicks },
      { name: "Mouse scrolled", value: `${Math.round(this.totalOffset)}px` },
      {
        name: "Mouse moved",
        value: `${Math.round(this.totalMouseMoveDistance)}px`,
      },
      {
        name: "Percentage spent in quadrant",
        value: `${quadrantPercentages}`, // Todo: Render this in a cool little block?
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
