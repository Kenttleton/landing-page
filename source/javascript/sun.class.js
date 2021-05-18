const Canvas = require('./canvas.class.js');

class Sun {
    constructor(Astronomy){
        this.canvasSun = document.querySelector('#sun');
        this.AstronomyData = Astronomy;
        
        this.drawSun('rgba(255,153,0,1)', new Canvas(this.canvasSun));
        233, 189, 21
    }

    drawSun(fill = 'rgba(233, 189, 21, 1)', canvasObject){
        const cvs = canvasObject.element;
        const { ctx } = canvasObject;
        const ypos = cvs.height / 2;
        const xpos = cvs.width / 2;
        
        ctx.fillStyle = fill;

        ctx.beginPath();
        ctx.arc(xpos, ypos, 50, this.degreesToRadians(0), this.degreesToRadians(360), true); 
        ctx.fill();

        fill = 'rgba(255,153,0,1)';
        var fillList = fill.split(',');
        fill = '';
        for(var i = 0; i < fillList.length; i++){
            if(i == fillList.length - 1){
                fill += ''
            }
            else if(i == 0){
                fill += fillList[i]
            }
            else{
                fill += `,${fillList[i]}`
            }
        }
        var radgrad = ctx.createRadialGradient(xpos, ypos, 0, xpos, ypos, cvs.height);
        radgrad.addColorStop(0, fill + ',1)');
        radgrad.addColorStop(0.15, fill + ',0.5)');
        radgrad.addColorStop(0.8, fill + ',0.3)');
        radgrad.addColorStop(1, fill + ',0)');
        ctx.fillStyle = radgrad;

        ctx.beginPath();
        ctx.arc(xpos, ypos, cvs.height, this.degreesToRadians(0), this.degreesToRadians(360), true); 
        ctx.fill();
    }

    degreesToRadians(degrees) {
        return (Math.PI / 180) * degrees;
    }

    radiansToDegrees(radians) {
        return radians / (Math.PI / 180);
    }
}

module.exports = Sun;