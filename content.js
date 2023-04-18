import "./custom.css";
import { mouse } from "./content/mouse";
import { thingsPopup } from "./content/thingsPopup";

mouse.monitor();

function updateEverySecond() {
  thingsPopup.updateTimeCounter();
  setTimeout(updateEverySecond, 1000);
}

thingsPopup.render();
updateEverySecond();
