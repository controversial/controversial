const headlessGl = require('gl');
const sharp = require('sharp');

const fs = require('fs');
const path = require('path');

const canvasWidth = 1440;
const canvasHeight = 420;

const gl = headlessGl(canvasWidth, canvasHeight);

// Set the “clear” color
gl.clearColor(0, 0, 0, 1);

// Cover the canvas with two triangles to draw on
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array([
    -1.0, -1.0,
    1.0, -1.0,
    -1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    1.0, 1.0
  ]),
  gl.STATIC_DRAW,
);

// Load shaders
const getFile = (f) => fs.readFileSync(path.join(__dirname, f), 'utf-8');
const program = gl.createProgram();
// Vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, getFile('vertex.glsl'));
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);
// Fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, getFile('fragment.glsl'));
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);
// Combined into program
gl.linkProgram(program);
gl.useProgram(program);

// Set up a_location attribute for vertex shader
const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
// Set up u_resolution uniform for fragment shader
const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
gl.uniform2f(resolutionUniformLocation, gl.drawingBufferWidth, gl.drawingBufferHeight);

function draw() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}

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

draw();
capture('frames/out.jpg');
