export default Models = {
    Astronomy: {
        Date: new Date(),
        Longitude: process.env.LONGITUDE,
        Latitude: process.env.LATITUDE,
        TimezoneOffset: this.Date.getTimezoneOffset(),
        Seconds: this.Date.getSeconds(),
        Minutes: this.Date.getMinutes(),
        Hours: this.Date.getHours(),
        Day: this.Date.getDate(),
        Month: this.Date.getMonth(),
        Year: this.Date.getFullYear(),
        TodaysDate: `${this.Year}-${this.Month}-${this.Day}`,
    },

    IPGeolocation: {
        location: {
            country_code2: null,
            country_name: null,
            state_prov: null,
            district: null,
            city: null,
            latitude: null,
            longitude: null,
        },
        date: null,
        sunrise: null,
        sunset: null,
        solar_noon: null,
        day_length: null,
        sun_altitude: null,
        sun_distance: null,
        sun_azimuth: null,
        moonrise: null,
        moonset: null,
        moon_altitude: null,
        moon_distance: null,
        moon_azimuth: null,
        moon_parallactic_angle: null,
    },

    DarkSky: {
        
    }
}





