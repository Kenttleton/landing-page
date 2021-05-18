const fs = require('fs');
const IPGeolocationController = require('./ipgeolocation.controller.class')
const DarkSkyController = require('./darksky.controller.class')

class DatabaseController {
    constructor(){
        this.setDate();
        this._data_store = '/data/data_store.json';
        this._attemptUpdate();
    }

    setDate(){
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        this.TodaysDate = `${year}-${month}-${day}`;
    }

    async get(){
        this.setDate();
        this._data_store = '/data/data_store.json';
        await this._attemptUpdate();
        return this.Data;
    }

    async _get(){
        const raw = fs.readFileSync(this._data_store);
        const db = JSON.parse(raw);
        this.Data = db.row[0];
    }

    async _init() {
        const init = {row: []};

        var ipg = new IPGeolocationController();
        var ipgData = await ipg.populate();

        var darkSky = new DarkSkyController();
        var darkSkyData = await darkSky.populate();

        const NewData = {...darkSkyData, ...ipgData}
        init.row.push(NewData);

        var toWrite = JSON.stringify(init);
        fs.writeFileSync(this._data_store, toWrite);
    }

    async _attemptUpdate() {
        if(!fs.existsSync(this._data_store)) {
            console.log("Initializing DB")
            await this._init();
        }

        const data = fs.readFileSync(this._data_store);
        const db = JSON.parse(data)

        if(db.row[0].date !== this.TodaysDate){
            console.log("Updating DB");
            this._update();
            this._get();
        }
        else this._get();
    }

    async _update(){
        var ipg = new IPGeolocationController();
        var ipgData = await ipg.populate();

        var darkSky = new DarkSkyController();
        var darkSkyData = await darkSky.populate();

        var newDB = {row: []}; 
        newDB.row.push({...darkSkyData, ...ipgData})

        const data = fs.readFileSync(this._data_store);
        const oldDB = JSON.parse(data)

        newDB.row[1] = oldDB.row[0];
        var toWrite = JSON.stringify(newDB);
        fs.writeFileSync(this._data_store, toWrite);  
    }
}

module.exports = DatabaseController;