const headlessGl = require("gl");
const sharp = require("sharp");

const canvasWidth = 1440;
const canvasHeight = 420;

const gl = headlessGl(canvasWidth, canvasHeight);

// Set the clear color and clear the “color” buffer
gl.clearColor(1.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

function capture(filename) {
  // 4 8-bit channels (rgba) for each pixel of the canvas
  const pixels = new Uint8Array(canvasWidth * canvasHeight * 4);
  // Read pixel data into array
  gl.readPixels(
    // bounds
    ...[0, 0, canvasWidth, canvasHeight],
    // flags
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    // array to write to
    pixels
  );
  const pixelBuffer = Buffer.from(pixels);
  // Save to image
  sharp(pixelBuffer, {
    raw: {
      width: canvasWidth,
      height: canvasHeight,
      channels: 4,
    },
  })
    .toFile(filename);
}

capture('frames/out.jpg');
