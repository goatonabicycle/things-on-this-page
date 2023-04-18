import "./custom.css";
import { mouse } from "./content/mouse";
import { thingsPopup } from "./content/things-popup";
import { timeCounter } from "./content/time-counter";

mouse.monitor();

function updateEverySecond() {
  thingsPopup.renderThingsSection();
  timeCounter.updateTimeCounter();
  setTimeout(updateEverySecond, 1000);
}

thingsPopup.render();
updateEverySecond();
