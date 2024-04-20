import "./custom.css";
import "./styles.css";
import { mouse } from "./content/mouse";
import { thingsPopup } from "./content/things-popup";
import { timeCounter } from "./content/time-counter";

mouse.monitor();

function updateEverySecond(): void {
  thingsPopup.renderThingsSection();

  thingsPopup.renderMouseSection();
  timeCounter.updateTimeCounter();
  setTimeout(updateEverySecond, 1000);
}

thingsPopup.render();
updateEverySecond();

interface FeatureFlagsMessage {
  type: "UPDATE_FLAGS";
  flags: {
    blue: boolean;
    panelsToShow: string[];
  };
}

chrome.runtime.onMessage.addListener((message: FeatureFlagsMessage) => {
  if (message.type === "UPDATE_FLAGS") {
    const flags = message.flags;
    console.log({ flags });
  }
});
