const mouse = {
  numberOfClicks: 0,
  totalMouseMoveDistance: 0,
  lastSeenAt: { x: null, y: null },
  totalOffset: 0,
  currOffset: window.pageYOffset,

  monitor() {
    document.addEventListener("click", () => {
      this.numberOfClicks++;
      thingsPopup.render();
    });

    document.addEventListener("mousemove", (e) => {
      if (this.lastSeenAt.x) {
        this.totalMouseMoveDistance += Math.sqrt(
          Math.pow(this.lastSeenAt.y - e.clientY, 2) +
            Math.pow(this.lastSeenAt.x - e.clientX, 2)
        );
      }
      this.lastSeenAt.x = e.clientX;
      this.lastSeenAt.y = e.clientY;

      thingsPopup.render();
    });

    document.addEventListener("scroll", () => {
      const addedOffset = Math.abs(this.currOffset - window.pageYOffset);
      this.totalOffset += addedOffset;
      this.currOffset = window.pageYOffset;
      thingsPopup.render();
    });
  },
};
