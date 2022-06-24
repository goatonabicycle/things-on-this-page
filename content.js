console.log({ document });

let numberOfClicks = 0;
document.body.addEventListener("click", () => numberOfClicks++);

var totalMouseMoveDistance = 0;
var lastSeenAt = { x: null, y: null };

document.addEventListener("mousemove", (e) => {
  if (lastSeenAt.x) {
    totalMouseMoveDistance += Math.sqrt(
      Math.pow(lastSeenAt.y - e.clientY, 2) +
        Math.pow(lastSeenAt.x - e.clientX, 2)
    );
  }
  lastSeenAt.x = e.clientX;
  lastSeenAt.y = e.clientY;
});

let totalOffset = 0;
let currOffset = window.pageYOffset;
window.addEventListener("scroll", () => {
  let addedOffset = Math.abs(currOffset - window.pageYOffset);
  totalOffset += addedOffset;
  currOffset = window.pageYOffset;
});

function renderItemsToShow(itemsToShow) {
  return (
    "<div>" +
    Object.entries(itemsToShow)
      .map(([key, value]) => `<div>${key}: ${value}</div>`)
      .join("") +
    "</div>"
  );
}

let renderPopup = () => {
  let thingsOnThisPage = {
    Images: document.images.length,
    Scripts: document.scripts.length,
    "Style Sheets": document.styleSheets.length,
    Links: document.links.length,
    "Page height":
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) + "px",
    "Page width":
      (window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth) + "px",
  };

  let thingsIHaveDone = {
    Clicks: numberOfClicks,
    Scrolled: Math.round(totalOffset) + "px",
    "Mouse moved": Math.round(totalMouseMoveDistance) + "px",
  };

  let container = document.getElementById("things-popup");
  if (!container) {
    container = document.createElement("div");
    container.id = "things-popup";
    container.className = "things-popup-contain";
  } else document.body.removeChild(container);

  container.innerHTML =
    "<div class='title'>Things On This Page</div>" +
    renderItemsToShow(thingsOnThisPage) +
    "<br />" +
    "<div class='title'>Things You Have Done</div>" +
    renderItemsToShow(thingsIHaveDone);
  document.body.appendChild(container);
};

let loop = () => {
  setTimeout(() => {
    renderPopup();
    loop();
  }, 500);
};

renderPopup();
loop();
