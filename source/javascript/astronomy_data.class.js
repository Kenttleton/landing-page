const axios = require('axios/dist/axios');

class Astronomy {
    // Solar Event Data
    isDaytime(){
        const date = new Date(this.ServerDate);
        const afterSunrise =  date - this.Data.sunrise;
        const beforeSunset = this.Data.sunset - date;
        return (afterSunrise >= 0 && beforeSunset >=0);
    }

    isSolarEclipse(){
        return (this.LunarTravelPercentage() === this.SolarTravelPercentage());
    }

    SolarEclipsePhase(){
        if(!this.isSolarEclipse()) return 0;
    }

    SolarTravelPercentage(){
        const date = new Date(this.ServerDate);
        return parseFloat((date - this.Data.sunrise)/(this.Data.sunset - this.Data.sunrise));
    }

    // Lunar Event Data
    isLunarEclipse(){
        return false;
    }

    LunarEclipsePhase(){
        if(!this.isLunarEclipse()) return 0;
    }

    LunarPhase(){
        return parseFloat(this.Data.moonPhase);
    }

    LunarTravelPercentage(){
        const date = new Date(this.ServerDate);
        return parseFloat((date - this.Data.moonrise)/(this.Data.moonset - this.Data.moonrise));
    }

    // Data manipulation methods
    async RefreshData(){
        const { data } = await axios.get('/astronomy/get');
        this.ServerDate = data.date;
        this.Data = data.astronomy;
        this.ConvertToDate();
    }

    ConvertToDate(){
        var unixProps = ["time", "sunriseTime", "sunsetTime", "precipIntensityMaxTime", 
        "temperatureHighTime", "temperatureLowTime", "apparentTemperatureHighTime", 
        "apparentTemperatureLowTime", "windGustTime", "uvIndexTime", "temperatureMinTime", 
        "temperatureMaxTime", "apparentTemperatureMinTime", "apparentTemperatureMaxTime"]
        var dateProps = ["sunrise","sunset","solar_noon","moonrise","moonset"]

        for(let i = 0; i < unixProps.length; i++){
            this.Data[unixProps[i]] = new Date(this.Data[unixProps[i]] * 1000)
        }
        for(let i = 0; i < dateProps.length; i++){
            const date = this.dateFactory();
            if(dateProps[i] !== 'moonset'){
                const splitProps = this.Data[dateProps[i]].split(":")
                this.Data[dateProps[i]] = date.setHours(parseInt(splitProps[0], 10), parseInt(splitProps[1], 10))
            }
            else {
                // Might have daylight savings issue
                date.setTime(date.getTime() + 86400000);
                const splitProps = this.Data[dateProps[i]].split(":")
                this.Data[dateProps[i]] = date.setHours(parseInt(splitProps[0], 10), parseInt(splitProps[1], 10))
            }
        }
    }

    async GetServerDate(){
        const { data } = await axios.get('/astronomy/getTime');
        this.ServerDate = data.date;    
    }

    dateFactory(){
        let date = new Date();
        const serverdate = new Date(this.ServerDate);

        date.setDate(serverdate.getDate());
        date.setMonth(serverdate.getMonth());
        date.setFullYear(serverdate.getFullYear());
        date.setHours(0,0,0,0);

        return date;
    }

    DateCompareTruthy(a = Date.now(), test = 'equal', b = Date.now()){
        if(a instanceof Date || b instanceof Date){
            const c = a - b;
            let actual = {text: 'equal', symbol: '='};
            switch(c){
                case -1: actual = {text: 'less', symbol: '<'};
                    break;
                case 0: actual = {text: 'equal', symbol: '='};
                    break;
                case 1: actual = {text: 'greater', symbol: '>'};
            }
    
            return (actual.text === test || actual.symbol === test);
        }
        console.warn('DateCompare did not recieve a valid Date Object');
        return false;
    }
}

module.exports = Astronomy;