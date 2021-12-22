
/***************
 * Mislay  *
 ***************/


class Mislay {
  constructor(canvasId = "mislay", canvaskitBaseUrl = ".") {
    // If the canvas dimensions are not set, then make it fullscreen
    const canvas = document.querySelector(`canvas#${canvasId}`);
    if (!canvas) {
      console.error(`Mislay: <canvas id=${canvasId}> not found.` +
        "Make sure that it exists in the DOM");
      return;
    } else if (!canvas.getAttribute("width") || !canvas.getAttribute("height")) {
      console.log("Mislay: <canvas> dimensions not set. Adjusting to full-screen.");
      canvas.width = globalThis.innerWidth;
      canvas.height= globalThis.innerHeight;

      // Resize if window changes
      globalThis.addEventListener("resize", () => {
        canvas.width = globalThis.innerWidth;
        canvas.height= globalThis.innerHeight;
      })
    }
    const ckLoaded = CanvasKitInit(
        { locateFile: (file) => `${canvaskitBaseUrl}/${file}`});

    this.isLoaded = new Promise((resolve, reject) => {
      ckLoaded.then((CanvasKit) => {
        this.surface = CanvasKit.MakeCanvasSurface(canvasId);
        this.CanvasKit = CanvasKit;
        resolve()
      })
    })
  }
  test() {
    this.isLoaded.then(() => {
      const paint = new this.CanvasKit.Paint();
      paint.setColor(this.CanvasKit.Color4f(0.9, 0, 0, 1.0));
      paint.setStyle(this.CanvasKit.PaintStyle.Stroke);
      paint.setAntiAlias(true);
      const rr = this.CanvasKit.RRectXY(this.CanvasKit.LTRBRect(10, 60, 210, 260), 25, 15);

      const draw = (canvas) => {
        canvas.clear(this.CanvasKit.WHITE);
        canvas.drawRRect(rr, paint);
      }
      this.surface.drawOnce(draw);
    });
  }
}

