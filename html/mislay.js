
/***************
 * Mislay  *
 ***************/


class Mislay {
  constructor(canvasId = "mislay", canvaskitBaseUrl = "mislay") {
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
    this.pos = [0, 0];

    // Set the interation routine in the event listeners
    canvas.addEventListener('pointermove', this.interact);
    canvas.addEventListener('pointerdown', this.interact);
    canvas.addEventListener('lostpointercapture', this.interact);
    canvas.addEventListener('pointerleave', this.interact);
    canvas.addEventListener('pointerup', this.interact);

    // Start the CanvasKit by loading the wasm file
    const ckLoaded = CanvasKitInit(
        { locateFile: (file) => `${canvaskitBaseUrl}/${file}`});

    // The initialization of CanvasKit for Mislay consists in creating a big
    // surface, set the shader code in it and start the animation loop right
    // away.
    this.isLoaded = new Promise((resolve, reject) => {
      ckLoaded.then((CanvasKit) => {
        this.surface = CanvasKit.MakeCanvasSurface(canvasId);
        this.paint = new CanvasKit.Paint();
        console.log(Mislay.program)
        this.runtimeEffect = CanvasKit.RuntimeEffect.Make(Mislay.program);
        this.surface.requestAnimationFrame(this.frame);
        this.CanvasKit = CanvasKit;
        resolve()
      })
    })
  }
  frame = (canvas) => {
    canvas.clear(this.CanvasKit.WHITE);
    const shader = this.runtimeEffect.makeShader([
      Math.sin(Date.now() / 2000) / 5,
      512, 256,
      1, 0, 0, 1,
      0, 1, 0, 1],
      true /*=opaque*/);
    this.paint.setShader(shader);
    canvas.drawRect(this.CanvasKit.LTRBRect(0, 0, globalThis.innerWidth, globalThis.innerHeight), this.paint);
    shader.delete();
    this.surface.requestAnimationFrame(this.frame);
  }
  interact = (e) => {
    const type = e.type;
    this.pos[0] = e.offsetX;
    this.pos[1] = e.offsetX;
  }
  test() {
    /*
    this.isLoaded.then(() => {
      const paint = new this.CanvasKit.Paint();
      // Test
      paint.setColor(this.CanvasKit.Color4f(0.9, 0.2, 0, 1.0));
      paint.setStyle(this.CanvasKit.PaintStyle.Stroke);
      paint.setAntiAlias(true);
      const rr = this.CanvasKit.RRectXY(this.CanvasKit.LTRBRect(10, 60, 510, 260), 25, 15);

      const draw = (canvas) => {
        canvas.clear(this.CanvasKit.WHITE);
        canvas.drawRRect(rr, paint);
      }
      this.surface.drawOnce(draw);
    });
    */
  }

  static program = `
uniform float rad_scale;
uniform float2 in_center;
uniform float4 in_colors0;
uniform float4 in_colors1;

half4 main(float2 p) {
    float2 pp = p - in_center;
    float radius = sqrt(dot(pp, pp));
    radius = sqrt(radius);
    float angle = atan(pp.y / pp.x);
    float t = (angle + 3.1415926/2) / (3.1415926);
    t += radius * rad_scale;
    t = fract(t);
    return half4(mix(in_colors0, in_colors1, t));
}
`;
}

