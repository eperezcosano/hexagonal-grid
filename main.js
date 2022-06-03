const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const a = 2 * Math.PI / 6;
const r = 10;

function init() {
  drawGrid(canvas.width, canvas.height);
}
init();

function drawGrid(width, height) {
  for (let y = r, j = 0; y + r * Math.sin(a) < height; y += 2 ** ((j + 1) % 2) * r * Math.sin(a), j = 0) {
    for (let x = r; x + r * (1 + Math.cos(a)) < width; x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)) {
      drawHexagon(x, y);
    }
  }
}

function drawHexagon(x, y) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    ctx.lineTo(x + r * Math.cos(a * i), y + r * Math.sin(a * i));
  }
  ctx.closePath();
  ctx.stroke();
}
