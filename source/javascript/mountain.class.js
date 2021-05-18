const Canvas = require("./canvas.class.js");
const Vertex = require("./vertex.class.js");

class Mountain {
    constructor(){
        this.canvasMountain = document.querySelector('#mountain');
        this.canvasSnowCap = document.querySelector('#snowcap');

        this.drawMountain('rgba(85, 65, 36, 1)', new Canvas(this.canvasMountain));
        this.drawSnowCap('rgba(218, 241, 236, 1)', new Canvas(this.canvasSnowCap));
    }

    drawMountain(fill = 'rgba(85, 65, 36, 1)', canvasObject){
        const cvs = canvasObject.element;
        const { ctx } = canvasObject;
        const ypos = 0;
        const xpos = window.innerHeight == window.getComputedStyle(cvs).innerHeight? cvs.width * 2 / 3 : cvs.width;

        ctx.fillStyle = fill;

        ctx.beginPath();
        ctx.moveTo(xpos, ypos);
        ctx.lineTo(0, cvs.height);
        ctx.lineTo(cvs.width, cvs.height);
        ctx.lineTo(cvs.width, ypos);
        ctx.fill();
    }

    drawSnowCap(fill = 'rgba(218, 241, 236, 1)', canvasObject){
        const cvs = canvasObject.element;
        const { ctx } = canvasObject;
        ctx.fillStyle = fill;
        const xstart = window.innerHeight == window.getComputedStyle(cvs).innerHeight? cvs.width * 2 / 3 : cvs.width;
        const ystart = 0;
        const points = [];
        const steps = 4;
        
        // const angleB = Math.tan(xstart/cvs.height);
        const b = cvs.width;
        const a = b / (xstart/cvs.height);
        const ynormalline = cvs.height / 4;
        const ynormalmin = ynormalline / 2;
        const ynormalmax = ((ynormalline - ynormalmin) * 2) + ynormalmin;
        const xnormalmax = cvs.width;
        const xnormalmin = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + ynormalmin));
        
        for(let i = 0; i < steps; i++){
            var dx, dy;
            var leftover = points[i - 1] ? xnormalmax - points[i - 1].nextpoint.x : xnormalmax - xnormalmin;
            if(i == steps - 1){
                dx = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + ynormalline)) + (Math.random() * leftover/(steps - i)); 
                dy = ynormalmin
            }
            else{
                dy = ynormalmin + (Math.sin(Math.random() * Math.PI) * (ynormalmax - ynormalmin));
                dx = xnormalmin + leftover/(steps - (i - 1)) + (Math.random() * leftover/(steps - i));
            }
            points.push(this.bezierCurveTemplate(dx, dy))
        }

        for(let i = 0; i < steps; i++){
            var cx, cy, cx1, cy1;
            if(!i){
                cy = ynormalmax;
                cx = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + cy));
                cx1 = xnormalmin + ((points[i].nextpoint.x - xnormalmin) / 2);
                cy1 = ynormalmin;
            }
            else if(i == steps - 1){
                cy = ynormalmax;
                cx = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + cy));
                cx1 = xnormalmin + ((points[i].nextpoint.x - xnormalmin) / 2);
                cy1 = ynormalmin;
            }
            else{
                cy = ynormalmax;
                cx = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + cy));
                cx1 = xnormalmin + ((points[i].nextpoint.x - xnormalmin) / 2);
                cy1 = ynormalmin;
            }
            points[i].control = {x: cx, y: cy}
            points[i].control1 = {x: cx1, y: cy1}
        }

        ctx.beginPath();
        ctx.moveTo(xstart, ystart);
        ctx.lineTo(xnormalmax - ((xstart/cvs.height) * (a - cvs.height + ynormalline)), ynormalline);
        for(let i = 0; i < points.length; i++){
            console.log(points[i])
            ctx.bezierCurveTo(points[i].control.x, points[i].control.y, points[i].control1.x, points[i].control1.y, points[i].nextpoint.x, points[i].nextpoint.y);
        }
        ctx.lineTo(cvs.width, ystart);
        ctx.fill();

        for(let i = 0; i < points.length; i++){
            // Start and end points
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(points[i].nextpoint.x, points[i].nextpoint.y, 7, 0, 2 * Math.PI);  // Start point
            ctx.fill();

            // Control points
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(points[i].control.x, points[i].control.y, 7, 0, 2 * Math.PI);  // Control point one
            ctx.arc(points[i].control1.x, points[i].control1.y, 7, 0, 2 * Math.PI);  // Control point two
            ctx.fill();
        }
    }

    bezierCurveTemplate(x, y, cx, cy, cx1, cy1){
        return {control: new Vertex(cx, cy), control1: new Vertex(cx1, cy1), nextpoint: new Vertex(x, y)}
    }
}

module.exports = Mountain;