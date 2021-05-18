import Canvas from './canvas.class.js'
import Line from './line.class.js'
import Vertex from './vertex.class.js'
import ValueNoise from './valueNoise.class.js'

export default class Clouds {
    constructor() {
        this.canvasObjects = []
        this.canvasList = document.querySelectorAll('#cloud');
        this.canvasList.forEach((canvas)=>{
          this.canvasObjects.push(new Canvas(canvas))
        })
      
        this.canvasObjects.forEach((canvasObject)=>{
          this.drawClouds('rgba(255,255,255,0.33)', canvasObject);
        });
      
        //   window.setInterval(()=>{
        //     drawClouds('white', cvs.height / 2 + 60);
        //   }, 100);
      
        //   window.setInterval(()=>{
        //     drawClouds('rgba(255,255,255,0.66)', cvs.height / 2 + 30);
        //   }, 200);
      
        //   window.setInterval(()=>{
        //     drawClouds('rgba(255,255,255,0.33)');
        //   }, 300);
      
        // canvasObject.clear();  
    }

    drawClouds(fill = '#fff', canvasObject) {
        const cvs = canvasObject.element;
        const { ctx } = canvasObject;
        const ypos = cvs.height / 2
        const points = [];
        const lines = [];
        const noise = new ValueNoise(200, 10);
        points.push(new Vertex(-50, ypos + noise.generate(0)));
      
        const pointCount = Math.round(cvs.width / 80);
        
        ctx.fillStyle = fill;
      
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
      
        for (let i = 1; i <= pointCount; i++) {
          const step = (cvs.width + 100) / pointCount;
      
          const offsetX = Math.random() * step - step / 2;
          const x = i * step + offsetX;
          const offsetY = noise.generate(x, ypos);
          const y = ypos + offsetY;
      
          const newVertex = new Vertex(x, y);
          points.push(newVertex);
      
          const newLine = new Line([points[i - 1], points[i]]);
          // console.log(newLine);
          lines.push(newLine);
      
          canvasObject.drawQuadratic(newLine.vertices[0], newLine.vertices[1], newLine.getNormalLine().vertices[1], false);
        }
      
        ctx.lineTo(cvs.width, cvs.height);
        ctx.lineTo(0, cvs.height);
        ctx.closePath();
        ctx.fill();
    }      
}