import "./custom.css";
import { mouse } from "./content/mouse";
import { thingsPopup } from "./content/thingsPopup";

mouse.monitor();

function renderEverySecond() {
  thingsPopup.renderTimeSinceLoad();
  setTimeout(renderEverySecond, 1000);
}

renderEverySecond();

// create a mechanism where the user can select which items to use
