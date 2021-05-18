const Mountain =  require('./mountain.class.js');
const Trees = require('./trees.class.js');
const Sun =  require('./sun.class.js');
const Moon =  require('./moon.class.js');
const Clouds =  require('./clouds.class.js');

class Scene {
    constructor(astronomy){
        this.Mountain = new Mountain();
        this.Trees = new Trees();
        this.Clouds = new Clouds();
        
        this.Astronomy = astronomy;

        if(this.Astronomy.isDaytime()){
          this.Sun = new Sun();
          if(this.Astronomy.isSolarEclipse()) this.Moon = new Moon();
        }
        else {
            this.Moon = new Moon(this.Astronomy);
        }
    }
}

module.exports = Scene;