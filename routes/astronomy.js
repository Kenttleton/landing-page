const Astronomy = require('./controllers/astronomy.controller.class')

var express = require('express');
var router = express.Router();

router.get('/get', function(req, res, next){
  astronomy = new Astronomy();
  astronomy.get()
  .then(function () {
    res.json({astronomy: astronomy.Data, date: new Date()})
  }).catch((error)=>{
    console.error(error);
  });
})

router.get('/getTime', function(req, res, next){
  res.json({date: new Date()})
})

module.exports = router;