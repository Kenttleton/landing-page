const axios = require('axios');

class IPGeolocationController {
    endpoint(){
        return `https://api.ipgeolocation.io/astronomy`;
    }

    async populate(){
        console.log("Populating IPGeolocation Data");
        const { data } = await axios.get(this.endpoint(),
        {
            params: {
                apiKey: process.env.IPGEOLOCATIONAPIKEY,
                long: process.env.LONGITUDE,
                lat: process.env.LATITUDE
            }
        }).catch((error) => {throw error})

        return data;
    }
}

module.exports = IPGeolocationController;