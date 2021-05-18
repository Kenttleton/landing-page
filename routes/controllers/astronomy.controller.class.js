const DatabaseController = require('./database.controller.class');

class AstronomyController {
    async get(){
        var db = new DatabaseController();
        this.Data = await db.get();
        return this.Data;
    }
}

module.exports = AstronomyController;