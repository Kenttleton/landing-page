const axios = require('axios');

class DarkSkyController {
    endpoint(){
        return `https://api.darksky.net/forecast/${process.env.DARKSKYAPIKEY}/${process.env.LATITUDE},${process.env.LONGITUDE}`;
    }

    async populate(){
        console.log("Populating Dark Sky Data");
        const { data } = await axios.get(this.endpoint(),
        {
            params: {
                exclude: `currently,minutely,hourly,alerts,flags`,
                lang: `en`,
                units: `us`,
            }
        }).catch((error) => {throw error})

        return data.daily.data[0];
    }
}

module.exports = DarkSkyController;