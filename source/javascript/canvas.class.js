class Canvas {
  constructor(element, width = window.innerWidth, height = window.innerHeight) {
    this.element = element;
    this.element.width = width;
    this.element.height = height;
    this.ctx = this.element.getContext('2d');
  }
  
  clear() {
     this.ctx.clearRect(0, 0, this.element.width, this.element.height);
  }
  
  resize(width, height) {
    this.element.width = width || this.element.width;
    this.element.height = height || this.element.height;
  }
  
  drawLine(v0, v1) {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(v0.x, v0.y);
    ctx.lineTo(v1.x, v1.y);
    ctx.closePath();
    ctx.stroke();
  }
  
  drawCircle(_settings) {
    const { ctx } = this;
    const settings = Object.assign({
      fill: false,
      stroke: 'black',
      x: 0,
      y: 0,
      radius: 10,
    }, _settings || {});
    
    ctx.beginPath();
    ctx.arc(settings.x,settings.y,settings.radius,0,Math.PI*2);
    ctx.closePath();
    if (settings.fill) {
      ctx.fillStyle = settings.fill;
      ctx.fill();
    }
    if (settings.stroke) {
      ctx.strokeStyle = settings.stroke;
      ctx.stroke();
    }
  }

  drawQuadratic(v0, v1, cp, closed = true) {
    const { ctx } = this;
    if ( closed ) ctx.beginPath();
    if ( closed ) ctx.moveTo(v0.x, v0.y);
    ctx.quadraticCurveTo(cp.x, cp.y, v1.x, v1.y);
    if ( closed ) ctx.closePath();
    if ( closed ) ctx.stroke();
  }
}

module.exports = Canvas;