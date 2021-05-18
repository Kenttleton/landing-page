const Canvas = require('./canvas.class.js');

class Moon {
    constructor(Astronomy, x, y, r = 50){
        this.X = { position: x || r}
        this.Y = { position: y || r }
        this.Radius = r;
        this.canvasMoon = document.querySelector('#moon');
        var moon = new Canvas(this.canvasMoon)
        this.drawMoon('rgba( 244, 241, 201, 1 )', moon);

        this.AstronomyData = Astronomy;
        this.LunarPhase = this.AstronomyData.LunarPhase();
        this.drawMoonPhase('rgba( 100, 98, 82, 0.8 )', moon);
    }

    drawMoon(fill = 'rgba( 244, 241, 201, 1 )', canvasObject){
        const cvs = canvasObject.element;
        const { ctx } = canvasObject;
        this.Y.position = cvs.height / 2;
        this.X.position = cvs.width / 2;
        
        ctx.fillStyle = fill;

        ctx.beginPath();
        ctx.arc(this.X.position, this.Y.position , this.Radius, this.degreesToRadians(0), this.degreesToRadians(360), true); 
        ctx.fill();
    }

    drawMoonPhase(fill = 'rgba( 100, 98, 82, 0.8 )', canvasObject){
        console.log(this.LunarPhase)
        if(this.LunarPhase == 0.5) return;
        const { ctx } = canvasObject;
        ctx.fillStyle = fill;

        ctx.beginPath();
        ctx.moveTo(this.X.position, this.Y.position - this.Radius);
        if(this.LunarPhase == 0 || this.AstronomyData.isSolarEclipse()){
            ctx.arc(this.X.position, this.Y.position, this.Radius, this.degreesToRadians(0), this.degreesToRadians(360), true); 
        }
        else if(this.LunarPhase < 0.5){
            console.log("Less than 0.5")
            if(this.LunarPhase == 0.25){
                console.log("Equal to 0.25")
                ctx.lineTo(this.X.position, this.Y.position + this.Radius)
            }
            else if(this.LunarPhase < 0.25) {
                console.log("Less than 0.25")
                var x = this.X.position + (this.Radius * (1 - (0.25 - this.LunarPhase)));
                var y1 = this.Y.position - this.Radius
                var y2 = this.Y.position + this.Radius
                ctx.bezierCurveTo(x, y1, x, y2, this.X.position, this.Y.position + this.Radius);
            }
            else {
                console.log("Greater than 0.25")
                var x = this.X.position - (this.Radius * (1 - (this.LunarPhase - 0.25)));
                var y1 = this.Y.position - this.Radius
                var y2 = this.Y.position + this.Radius
                ctx.bezierCurveTo(x, y1, x, y2, this.X.position, this.Y.position + this.Radius);
            }
            ctx.arc(this.X.position, this.Y.position, this.Radius, this.degreesToRadians(270), this.degreesToRadians(90), true);
        }
        else if(this.LunarPhase > 0.5){
            if(this.LunarPhase == 0.75){
                ctx.lineTo(this.X.position, this.Y.position + this.Radius)
            }
            else if(this.LunarPhase < 0.75) {
                var x = this.X.position - (this.Radius * (1 - (0.5 - this.LunarPhase)));
                var y1 = this.Y.position - this.Radius
                var y2 = this.Y.position + this.Radius
                ctx.bezierCurveTo(x, y1, x, y2, this.X.position, this.Y.position + this.Radius);
            }
            else {
                var x = this.X.position + (this.Radius * (0.5 - this.LunarPhase));
                var y1 = this.Y.position - this.Radius
                var y2 = this.Y.position + this.Radius
                ctx.bezierCurveTo(x, y1, x, y2, this.X.position, this.Y.position + this.Radius);
            }
            ctx.arc(this.X.position, this.Y.position, this.Radius, this.degreesToRadians(90), this.degreesToRadians(270), true);
        }
        ctx.fill();
    }

    degreesToRadians(degrees) {
        return (Math.PI / 180) * degrees;
    }

    radiansToDegrees(radians) {
        return radians / (Math.PI / 180);
    }
}

module.exports = Moon;