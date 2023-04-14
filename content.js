import "./custom.css";
import { mouse } from "./content/mouse";
import { thingsPopup } from "./content/thingsPopup";

//TODO: Dynamically do these based on UI selections?

mouse.monitor();

function renderEverySecond() {
  thingsPopup.renderTimeSinceLoad();
  setTimeout(renderEverySecond, 1000);
}

renderEverySecond();

console.log("Content!");
