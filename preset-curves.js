const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let points;
let elCanvas;

const sketch = ({ canvas }) => {
  points = [
    new Point({ x: 100, y: 100 }),
    new Point({ x: 900, y: 100, control: true }),
    new Point({ x: 980, y: 980 }),
  ];

  canvas.addEventListener('mousedown', onMouseDown);
  elCanvas = canvas;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    context.save();
    context.beginPath();

    context.moveTo(points[0].x, points[0].y);
    context.quadraticCurveTo(
      points[1].x,
      points[1].y,
      points[2].x,
      points[2].y,
    );

    context.stroke();
    context.restore();

    points.forEach((point) => {
      point.draw(context);
    });
  };
};

const onMouseDown = (e) => {
  console.log('mouse down');

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  points.forEach((point) => {
    point.isDragging = point.hitTest(x, y);
  });
  console.log(points);
};

const onMouseMove = (e) => {
  console.log('mouse move');

  const x = (e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
  const y = (e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

  points.forEach((point) => {
    if (point.isDragging) {
      point.x = x;
      point.y = y;
    }
  });
};

const onMouseUp = (e) => {
  console.log('mouse up');

  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
};

canvasSketch(sketch, settings);

class Point {
  constructor({ x, y, control = false }) {
    this.x = x;
    this.y = y;
    this.control = control;
  }

  draw(context) {
    context.fillStyle = this.control ? 'red' : 'black';

    context.save();
    context.beginPath();
    context.translate(this.x, this.y);

    context.arc(0, 0, 10, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }

  hitTest(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    const dd = Math.sqrt(dx * dx + dy * dy);

    console.log(dd);
    return dd < 60;
  }
}
