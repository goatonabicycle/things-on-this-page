import { thingsPopup } from "./things-popup";

export const mouse = {
  numberOfClicks: 0,
  totalMouseMoveDistance: 0,
  lastSeenAt: { x: null, y: null },
  totalOffset: 0,
  currOffset: window.pageYOffset,

  handleMouseMove(e) {
    if (this.lastSeenAt.x) {
      this.totalMouseMoveDistance += Math.sqrt(
        Math.pow(this.lastSeenAt.y - e.clientY, 2) +
          Math.pow(this.lastSeenAt.x - e.clientX, 2)
      );
    }
    this.lastSeenAt.x = e.clientX;
    this.lastSeenAt.y = e.clientY;

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

  getCurrentData() {
    const mouseData = [
      { name: "Mouse clicks", value: this.numberOfClicks },
      { name: "Mouse scrolled", value: `${Math.round(this.totalOffset)}px` },
      {
        name: "Mouse moved",
        value: `${Math.round(this.totalMouseMoveDistance)}px`,
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
