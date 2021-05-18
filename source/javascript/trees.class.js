const Canvas = require('./canvas.class.js');
const Line = require('./line.class.js');
const Vertex = require('./vertex.class.js');

class Trees {
    constructor(){
        this.canvasTrees = document.querySelectorAll('#tree');
        this.canvasTrees.forEach((canvasTreesElement)=>{
            this.drawTrees(new Canvas(canvasTreesElement))
        });
    }

    drawTrees(canvasObject){
        const fills = ['rgba(74,103,65,1)','rgba(63,90,54,1)','rgba(55,79,47,1)','rgba(48,69,41,1)','rgba(34,49,29,1)',
        'rgba(8,53,0,1)','rgba(47,144,0,1)']
        const cvs = canvasObject.element;
        const { ctx } = canvasObject;

        var numOfTrees = 15;
        var numOfRows = 3;

        var lines = [];
        var treeLines = []

        for(var i = 0; i < numOfRows; i++ ){
            var vertices = [];
            var treeLine = []
            var y = cvs.height;

            for(var j = 0; j < numOfTrees/numOfRows; j++){
                var base, height, x;
                x = Math.random() * (cvs.width * 3 / 4);
                height = Math.random() * (y / 2);
                base = (cvs.height / (numOfTrees/numOfRows)) /(numOfTrees/numOfRows);

                vertices.push(new Vertex(x, y));
                treeLine.push(this.treeDimensions(base, height));
            }

            vertices.sort((a, b)=>{
                if (a.x < b.x) return -1;
                if (a.x > b.x) return 1;
                return 0;
            });

            lines.push(new Line(vertices))
            treeLines.push(treeLine)
        }
        
        for(var i = 0; i < numOfRows; i++){
            var line = lines[i];
            var treeLine = treeLines[i]
            ctx.beginPath();
            for(var j = 0; j < numOfTrees/numOfRows; j++){
                ctx.fillStyle = fills[Math.floor(Math.random()*(fills.length - 1))];
                ctx.moveTo(line.vertices[j].x - treeLine[j].base, cvs.height);
                ctx.lineTo(line.vertices[j].x, treeLine[j].height);
                ctx.lineTo(line.vertices[j].x + treeLine[j].base, cvs.height);
                ctx.fill()
            }
        }
    }

    treeDimensions(base, height){
        return {base, height};
    }
}

module.exports = Trees;