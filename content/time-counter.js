export const timeCounter = {
  timeSinceInitialLoad: -1,

  updateCounterDisplay() {
    const timeSinceLoadElement = document.getElementById("time-since-load");
    if (timeSinceLoadElement) {
      timeSinceLoadElement.textContent = this.timeSinceInitialLoad;
    }
  },

  updateTimeCounter() {
    this.timeSinceInitialLoad++;
    this.updateCounterDisplay();
  },
};
