import "./custom.css";
import { mouse } from "./content/mouse";
import { thingsPopup } from "./content/thingsPopup";

mouse.monitor();

function renderEverySecond() {
  thingsPopup.renderTimeSinceLoad();
  setTimeout(renderEverySecond, 1000);
}

renderEverySecond();
