import "./custom.css";
import "./styles.css";
import { mouse } from "./content/mouse";
import { thingsPopup } from "./content/things-popup";
import { timeCounter } from "./content/time-counter";
import { setFlags, isPanelVisible, Flags } from "./content/feature-flags";

mouse.monitor();

function updateEverySecond(): void {
  thingsPopup.renderThingsSection();
  thingsPopup.renderMouseSection();
  timeCounter.updateTimeCounter();
  setTimeout(updateEverySecond, 1000);
}

thingsPopup.render();
updateEverySecond();

chrome.runtime.onMessage.addListener(
  (message: { type: string; flags: Flags }) => {
    if (message.type === "UPDATE_FLAGS") {
      setFlags(message.flags);
    }
  }
);
