const Scene = require('./scene.class.js');
const Astronomy = require('./astronomy_data.class.js');

document.addEventListener('DOMContentLoaded', async () => { 
  if (document.getElementsByTagName('canvas').getContext) { 
    console.warn('This browser does not support HTML Canvas');
    return;
  }
  const astronomy = new Astronomy();
  await astronomy.RefreshData();
  new Scene(astronomy);
  console.log(astronomy)
  handleTime(astronomy.ServerDate);
});

function updateTime(element, h, m, s, am, millTime){
  element.setAttribute('datetime', millTime);
  element.innerHTML = `${h}:${m}:${s} ${am ? 'AM' : 'PM'}`;
}

function handleTime(date){
  const timeElement = document.querySelector('#time')
  if(timeElement){
    
    window.setInterval(function (){
      var localTime = new Date();
      const serverTime = new Date(date);
      let h = serverTime.getHours();
      let m = localTime.getMinutes();
      let s = localTime.getSeconds();
      let am = true;

      if(parseInt(h, 10) < 10){
        h = `0` + h;
      } 
      if(parseInt(m, 10) < 10) m = `0` + m;
      if(parseInt(s, 10) < 10) s = `0` + s;

      let millTime = `${h}:${m}:${s}`;

      if(parseInt(h, 10) >= 12) {
        if(parseInt(h, 10) > 12) h = h - 12;
        am = false;
      }
      if(parseInt(h, 10) == 0) {
        h = 12;
      }
      
      updateTime(timeElement, h, m, s, am, millTime)
    }, 1000);
  }
}

