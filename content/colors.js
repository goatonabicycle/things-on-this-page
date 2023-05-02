import html2canvas from "html2canvas";
import ColorThief from "colorthief";

export const color = {
  getColorPalette() {
    html2canvas(document.body).then((canvas) => {
      const img = new Image();
      img.src = canvas.toDataURL("image/png");
      img.onload = function () {
        const colorThief = new ColorThief();
        const palette = colorThief.getPalette(img, 8); // 8 colors in the palette
        console.log(palette);
      };
    });
  },
};
