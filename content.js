console.log({ document });

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
  };

  let thingsIHaveDone = {
    Clicks: 5,
    "Cm scrolled": 4,
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
  }, 1000);
};

loop();
