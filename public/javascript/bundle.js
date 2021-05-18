var scene = (function () {
  'use strict';

  class Canvas {
    constructor(element, width = window.innerWidth, height = window.innerHeight) {
      this.element = element;
      this.element.width = width;
      this.element.height = height;
      this.ctx = this.element.getContext('2d');
    }
    
    clear() {
       this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    }
    
    resize(width, height) {
      this.element.width = width || this.element.width;
      this.element.height = height || this.element.height;
    }
    
    drawLine(v0, v1) {
      const { ctx } = this;
      ctx.beginPath();
      ctx.moveTo(v0.x, v0.y);
      ctx.lineTo(v1.x, v1.y);
      ctx.closePath();
      ctx.stroke();
    }
    
    drawCircle(_settings) {
      const { ctx } = this;
      const settings = Object.assign({
        fill: false,
        stroke: 'black',
        x: 0,
        y: 0,
        radius: 10,
      }, _settings || {});
      
      ctx.beginPath();
      ctx.arc(settings.x,settings.y,settings.radius,0,Math.PI*2);
      ctx.closePath();
      if (settings.fill) {
        ctx.fillStyle = settings.fill;
        ctx.fill();
      }
      if (settings.stroke) {
        ctx.strokeStyle = settings.stroke;
        ctx.stroke();
      }
    }

    drawQuadratic(v0, v1, cp, closed = true) {
      const { ctx } = this;
      if ( closed ) ctx.beginPath();
      if ( closed ) ctx.moveTo(v0.x, v0.y);
      ctx.quadraticCurveTo(cp.x, cp.y, v1.x, v1.y);
      if ( closed ) ctx.closePath();
      if ( closed ) ctx.stroke();
    }
  }

  var canvas_class = Canvas;

  class Vertex {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }

  var vertex_class = Vertex;

  class Mountain {
      constructor(){
          this.canvasMountain = document.querySelector('#mountain');
          this.canvasSnowCap = document.querySelector('#snowcap');

          this.drawMountain('rgba(85, 65, 36, 1)', new canvas_class(this.canvasMountain));
          this.drawSnowCap('rgba(218, 241, 236, 1)', new canvas_class(this.canvasSnowCap));
      }

      drawMountain(fill = 'rgba(85, 65, 36, 1)', canvasObject){
          const cvs = canvasObject.element;
          const { ctx } = canvasObject;
          const ypos = 0;
          const xpos = window.innerHeight == window.getComputedStyle(cvs).innerHeight? cvs.width * 2 / 3 : cvs.width;

          ctx.fillStyle = fill;

          ctx.beginPath();
          ctx.moveTo(xpos, ypos);
          ctx.lineTo(0, cvs.height);
          ctx.lineTo(cvs.width, cvs.height);
          ctx.lineTo(cvs.width, ypos);
          ctx.fill();
      }

      drawSnowCap(fill = 'rgba(218, 241, 236, 1)', canvasObject){
          const cvs = canvasObject.element;
          const { ctx } = canvasObject;
          ctx.fillStyle = fill;
          const xstart = window.innerHeight == window.getComputedStyle(cvs).innerHeight? cvs.width * 2 / 3 : cvs.width;
          const ystart = 0;
          const points = [];
          const steps = 4;
          
          // const angleB = Math.tan(xstart/cvs.height);
          const b = cvs.width;
          const a = b / (xstart/cvs.height);
          const ynormalline = cvs.height / 4;
          const ynormalmin = ynormalline / 2;
          const ynormalmax = ((ynormalline - ynormalmin) * 2) + ynormalmin;
          const xnormalmax = cvs.width;
          const xnormalmin = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + ynormalmin));
          
          for(let i = 0; i < steps; i++){
              var dx, dy;
              var leftover = points[i - 1] ? xnormalmax - points[i - 1].nextpoint.x : xnormalmax - xnormalmin;
              if(i == steps - 1){
                  dx = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + ynormalline)) + (Math.random() * leftover/(steps - i)); 
                  dy = ynormalmin;
              }
              else{
                  dy = ynormalmin + (Math.sin(Math.random() * Math.PI) * (ynormalmax - ynormalmin));
                  dx = xnormalmin + leftover/(steps - (i - 1)) + (Math.random() * leftover/(steps - i));
              }
              points.push(this.bezierCurveTemplate(dx, dy));
          }

          for(let i = 0; i < steps; i++){
              var cx, cy, cx1, cy1;
              if(!i){
                  cy = ynormalmax;
                  cx = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + cy));
                  cx1 = xnormalmin + ((points[i].nextpoint.x - xnormalmin) / 2);
                  cy1 = ynormalmin;
              }
              else if(i == steps - 1){
                  cy = ynormalmax;
                  cx = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + cy));
                  cx1 = xnormalmin + ((points[i].nextpoint.x - xnormalmin) / 2);
                  cy1 = ynormalmin;
              }
              else{
                  cy = ynormalmax;
                  cx = xnormalmax - ((xstart/cvs.height) * (a - cvs.height + cy));
                  cx1 = xnormalmin + ((points[i].nextpoint.x - xnormalmin) / 2);
                  cy1 = ynormalmin;
              }
              points[i].control = {x: cx, y: cy};
              points[i].control1 = {x: cx1, y: cy1};
          }

          ctx.beginPath();
          ctx.moveTo(xstart, ystart);
          ctx.lineTo(xnormalmax - ((xstart/cvs.height) * (a - cvs.height + ynormalline)), ynormalline);
          for(let i = 0; i < points.length; i++){
              console.log(points[i]);
              ctx.bezierCurveTo(points[i].control.x, points[i].control.y, points[i].control1.x, points[i].control1.y, points[i].nextpoint.x, points[i].nextpoint.y);
          }
          ctx.lineTo(cvs.width, ystart);
          ctx.fill();

          for(let i = 0; i < points.length; i++){
              // Start and end points
              ctx.fillStyle = 'blue';
              ctx.beginPath();
              ctx.arc(points[i].nextpoint.x, points[i].nextpoint.y, 7, 0, 2 * Math.PI);  // Start point
              ctx.fill();

              // Control points
              ctx.fillStyle = 'red';
              ctx.beginPath();
              ctx.arc(points[i].control.x, points[i].control.y, 7, 0, 2 * Math.PI);  // Control point one
              ctx.arc(points[i].control1.x, points[i].control1.y, 7, 0, 2 * Math.PI);  // Control point two
              ctx.fill();
          }
      }

      bezierCurveTemplate(x, y, cx, cy, cx1, cy1){
          return {control: new vertex_class(cx, cy), control1: new vertex_class(cx1, cy1), nextpoint: new vertex_class(x, y)}
      }
  }

  var mountain_class = Mountain;

  class Line {
    constructor(vertices) {
      this.vertices = vertices;
      // canvasObject.drawLine(vertices[0], vertices[1]);
    }

    getLength() {
      const { vertices } = this;
      const v0 = vertices[0];
      const v1 = vertices[1];

      return Math.sqrt((v1.x - v0.x) ** 2 + (v1.y - v0.y) ** 2);
    }

    getMidpoint() {
      const { vertices } = this;
      const v0 = vertices[0];
      const v1 = vertices[1];

      return {
        x: (v0.x + v1.x) / 2,
        y: (v0.y + v1.y) / 2,
      };
    }

    getNormal() {
      const { vertices } = this;
      const v0 = vertices[0];
      const v1 = vertices[1];

      // the two points can not be the same
      let nx = v1.x - v0.x;  // as vector
      let ny = v1.y - v0.y;
      const len = Math.sqrt(nx * nx + ny * ny);  // length of line
      nx = nx / len;  // make one unit long
      ny = ny / len;  // which we call normalising a vector
      return [-ny, nx]; // return the normal  rotated 90 deg
    }

    getNormalLine() {
      return {
        vertices: [
          this.vertices[1],
          {
            x: this.getMidpoint().x - this.getNormal()[0] * this.getLength() * .4,
            y: this.getMidpoint().y - this.getNormal()[1] * this.getLength() * .4,
          }
        ]
      };
    }
  }

  var line_class = Line;

  class Trees {
      constructor(){
          this.canvasTrees = document.querySelectorAll('#tree');
          this.canvasTrees.forEach((canvasTreesElement)=>{
              this.drawTrees(new canvas_class(canvasTreesElement));
          });
      }

      drawTrees(canvasObject){
          const fills = ['rgba(74,103,65,1)','rgba(63,90,54,1)','rgba(55,79,47,1)','rgba(48,69,41,1)','rgba(34,49,29,1)',
          'rgba(8,53,0,1)','rgba(47,144,0,1)'];
          const cvs = canvasObject.element;
          const { ctx } = canvasObject;

          var numOfTrees = 15;
          var numOfRows = 3;

          var lines = [];
          var treeLines = [];

          for(var i = 0; i < numOfRows; i++ ){
              var vertices = [];
              var treeLine = [];
              var y = cvs.height;

              for(var j = 0; j < numOfTrees/numOfRows; j++){
                  var base, height, x;
                  x = Math.random() * (cvs.width * 3 / 4);
                  height = Math.random() * (y / 2);
                  base = (cvs.height / (numOfTrees/numOfRows)) /(numOfTrees/numOfRows);

                  vertices.push(new vertex_class(x, y));
                  treeLine.push(this.treeDimensions(base, height));
              }

              vertices.sort((a, b)=>{
                  if (a.x < b.x) return -1;
                  if (a.x > b.x) return 1;
                  return 0;
              });

              lines.push(new line_class(vertices));
              treeLines.push(treeLine);
          }
          
          for(var i = 0; i < numOfRows; i++){
              var line = lines[i];
              var treeLine = treeLines[i];
              ctx.beginPath();
              for(var j = 0; j < numOfTrees/numOfRows; j++){
                  ctx.fillStyle = fills[Math.floor(Math.random()*(fills.length - 1))];
                  ctx.moveTo(line.vertices[j].x - treeLine[j].base, cvs.height);
                  ctx.lineTo(line.vertices[j].x, treeLine[j].height);
                  ctx.lineTo(line.vertices[j].x + treeLine[j].base, cvs.height);
                  ctx.fill();
              }
          }
      }

      treeDimensions(base, height){
          return {base, height};
      }
  }

  var trees_class = Trees;

  class Sun {
      constructor(Astronomy){
          this.canvasSun = document.querySelector('#sun');
          this.AstronomyData = Astronomy;
          
          this.drawSun('rgba(255,153,0,1)', new canvas_class(this.canvasSun));
      }

      drawSun(fill = 'rgba(233, 189, 21, 1)', canvasObject){
          const cvs = canvasObject.element;
          const { ctx } = canvasObject;
          const ypos = cvs.height / 2;
          const xpos = cvs.width / 2;
          
          ctx.fillStyle = fill;

          ctx.beginPath();
          ctx.arc(xpos, ypos, 50, this.degreesToRadians(0), this.degreesToRadians(360), true); 
          ctx.fill();

          fill = 'rgba(255,153,0,1)';
          var fillList = fill.split(',');
          fill = '';
          for(var i = 0; i < fillList.length; i++){
              if(i == fillList.length - 1){
                  fill += '';
              }
              else if(i == 0){
                  fill += fillList[i];
              }
              else{
                  fill += `,${fillList[i]}`;
              }
          }
          var radgrad = ctx.createRadialGradient(xpos, ypos, 0, xpos, ypos, cvs.height);
          radgrad.addColorStop(0, fill + ',1)');
          radgrad.addColorStop(0.15, fill + ',0.5)');
          radgrad.addColorStop(0.8, fill + ',0.3)');
          radgrad.addColorStop(1, fill + ',0)');
          ctx.fillStyle = radgrad;

          ctx.beginPath();
          ctx.arc(xpos, ypos, cvs.height, this.degreesToRadians(0), this.degreesToRadians(360), true); 
          ctx.fill();
      }

      degreesToRadians(degrees) {
          return (Math.PI / 180) * degrees;
      }

      radiansToDegrees(radians) {
          return radians / (Math.PI / 180);
      }
  }

  var sun_class = Sun;

  class Moon {
      constructor(Astronomy, x, y, r = 50){
          this.X = { position: x || r};
          this.Y = { position: y || r };
          this.Radius = r;
          this.canvasMoon = document.querySelector('#moon');
          var moon = new canvas_class(this.canvasMoon);
          this.drawMoon('rgba( 244, 241, 201, 1 )', moon);

          this.AstronomyData = Astronomy;
          this.LunarPhase = this.AstronomyData.LunarPhase();
          this.drawMoonPhase('rgba( 100, 98, 82, 0.8 )', moon);
      }

      drawMoon(fill = 'rgba( 244, 241, 201, 1 )', canvasObject){
          const cvs = canvasObject.element;
          const { ctx } = canvasObject;
          this.Y.position = cvs.height / 2;
          this.X.position = cvs.width / 2;
          
          ctx.fillStyle = fill;

          ctx.beginPath();
          ctx.arc(this.X.position, this.Y.position , this.Radius, this.degreesToRadians(0), this.degreesToRadians(360), true); 
          ctx.fill();
      }

      drawMoonPhase(fill = 'rgba( 100, 98, 82, 0.8 )', canvasObject){
          console.log(this.LunarPhase);
          if(this.LunarPhase == 0.5) return;
          const { ctx } = canvasObject;
          ctx.fillStyle = fill;

          ctx.beginPath();
          ctx.moveTo(this.X.position, this.Y.position - this.Radius);
          if(this.LunarPhase == 0 || this.AstronomyData.isSolarEclipse()){
              ctx.arc(this.X.position, this.Y.position, this.Radius, this.degreesToRadians(0), this.degreesToRadians(360), true); 
          }
          else if(this.LunarPhase < 0.5){
              console.log("Less than 0.5");
              if(this.LunarPhase == 0.25){
                  console.log("Equal to 0.25");
                  ctx.lineTo(this.X.position, this.Y.position + this.Radius);
              }
              else if(this.LunarPhase < 0.25) {
                  console.log("Less than 0.25");
                  var x = this.X.position + (this.Radius * (1 - (0.25 - this.LunarPhase)));
                  var y1 = this.Y.position - this.Radius;
                  var y2 = this.Y.position + this.Radius;
                  ctx.bezierCurveTo(x, y1, x, y2, this.X.position, this.Y.position + this.Radius);
              }
              else {
                  console.log("Greater than 0.25");
                  var x = this.X.position - (this.Radius * (1 - (this.LunarPhase - 0.25)));
                  var y1 = this.Y.position - this.Radius;
                  var y2 = this.Y.position + this.Radius;
                  ctx.bezierCurveTo(x, y1, x, y2, this.X.position, this.Y.position + this.Radius);
              }
              ctx.arc(this.X.position, this.Y.position, this.Radius, this.degreesToRadians(270), this.degreesToRadians(90), true);
          }
          else if(this.LunarPhase > 0.5){
              if(this.LunarPhase == 0.75){
                  ctx.lineTo(this.X.position, this.Y.position + this.Radius);
              }
              else if(this.LunarPhase < 0.75) {
                  var x = this.X.position - (this.Radius * (1 - (0.5 - this.LunarPhase)));
                  var y1 = this.Y.position - this.Radius;
                  var y2 = this.Y.position + this.Radius;
                  ctx.bezierCurveTo(x, y1, x, y2, this.X.position, this.Y.position + this.Radius);
              }
              else {
                  var x = this.X.position + (this.Radius * (0.5 - this.LunarPhase));
                  var y1 = this.Y.position - this.Radius;
                  var y2 = this.Y.position + this.Radius;
                  ctx.bezierCurveTo(x, y1, x, y2, this.X.position, this.Y.position + this.Radius);
              }
              ctx.arc(this.X.position, this.Y.position, this.Radius, this.degreesToRadians(90), this.degreesToRadians(270), true);
          }
          ctx.fill();
      }

      degreesToRadians(degrees) {
          return (Math.PI / 180) * degrees;
      }

      radiansToDegrees(radians) {
          return radians / (Math.PI / 180);
      }
  }

  var moon_class = Moon;

  class ValueNoise {
    constructor(wl = 20, amp = 1) {

      this.w = 500;
      this.h = 500;
      this.wlx = wl;
      this.wly = wl;
      this.amp = amp || 1;

      this.octaves = 1;
      this.oFactor = 2;

      this.rows = Array(this.h).fill(0).map(item => Array(this.w).fill(0).map(item => Math.random() * this.amp));

      this.interpolate = this.quadratic;
    }

    cosine(pa, pb, px) {
      const ft = px * Math.PI;
      const f = (1 - Math.cos(ft)) * 0.5;
      return pa * (1 - f) + pb * f;
    }

    cubic(pa, pb, px) {
      return px < .5 ? 4 * px ** 3 * (pb - pa) + pa : ((px - 1) * (2 * px - 2) * (2 * px - 2) + 1) * (pb - pa) + pa;
    }

    quadratic(pa, pb, px) {
      return px < .5 ? 2 * px ** 2 * (pb - pa) + pa : (-1 + (4 - 2 * px) * px) * (pb - pa) + pa;
    }

    linear(pa, pb, px) {
      return pa + (pb - pa) * px;
    }
    sawtooth() {
      
    }
    square() {
    }

    randomise() {
      this.rows = Array(this.h)
        .fill(0)
        .map(() => Array(this.w)
          .fill(0)
          .map(() => Math.random()));
    }

    gen2d(x, y, wlx, wly, amp) {
      let currx = ~~(x / wlx);
      let nextx = ~~(x / wlx) + 1;
      let curry = ~~(y / wly);
      let nexty = ~~(y / wly) + 1;

      if (y % wly === 0) {
        if (x % wlx === 0) {
          return this.rows[curry][currx] * amp;
        } else {
          return this.interpolate(this.rows[curry][currx], this.rows[curry][nextx], (x % wlx) / wlx) * amp;
        }
      } else {
        if (x % wlx === 0) {
          return this.interpolate(this.rows[curry][currx], this.rows[nexty][currx], (y % wly) / wly) * amp;
        } else {
          return this.interpolate(
            this.interpolate(this.rows[curry][currx], this.rows[nexty][currx], (y % wly) / wly) * amp, // 
            this.interpolate(this.rows[curry][nextx], this.rows[nexty][nextx], (y % wly) / wly) * amp,
            (x % wlx) / wlx
          );
        }
      }
    }

    generate(x, y = 0) {
      let ret = 0;
      let offset = 0;

      for (let i = 0; i < this.octaves; i++) {
        const amp = this.amp / this.oFactor ** i;
        const wlx = Math.max(this.wlx / this.oFactor ** i, 1);
        const wly = Math.max(this.wly / this.oFactor ** i, 1);

        // console.log(amp,wlx,wly);

        ret += this.gen2d(x, y, wlx, wly, amp);
        offset += 1 / this.oFactor ** i;
      }

      return ret / (offset);
    }
  }

  var valueNoise_class = ValueNoise;

  class Clouds {
      constructor() {
          this.canvasObjects = [];
          this.canvasList = document.querySelectorAll('#cloud');
          this.canvasList.forEach((canvas)=>{
            this.canvasObjects.push(new canvas_class(canvas));
          });
        
          this.canvasObjects.forEach((canvasObject)=>{
            this.drawClouds('rgba(255,255,255,0.33)', canvasObject);
          });
        
          //   window.setInterval(()=>{
          //     drawClouds('white', cvs.height / 2 + 60);
          //   }, 100);
        
          //   window.setInterval(()=>{
          //     drawClouds('rgba(255,255,255,0.66)', cvs.height / 2 + 30);
          //   }, 200);
        
          //   window.setInterval(()=>{
          //     drawClouds('rgba(255,255,255,0.33)');
          //   }, 300);
        
          // canvasObject.clear();  
      }

      drawClouds(fill = '#fff', canvasObject) {
          const cvs = canvasObject.element;
          const { ctx } = canvasObject;
          const ypos = cvs.height / 2;
          const points = [];
          const noise = new valueNoise_class(200, 10);
          points.push(new vertex_class(-50, ypos + noise.generate(0)));
        
          const pointCount = Math.round(cvs.width / 80);
          
          ctx.fillStyle = fill;
        
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
        
          for (let i = 1; i <= pointCount; i++) {
            const step = (cvs.width + 100) / pointCount;
        
            const offsetX = Math.random() * step - step / 2;
            const x = i * step + offsetX;
            const offsetY = noise.generate(x, ypos);
            const y = ypos + offsetY;
        
            const newVertex = new vertex_class(x, y);
            points.push(newVertex);
        
            const newLine = new line_class([points[i - 1], points[i]]);
        
            canvasObject.drawQuadratic(newLine.vertices[0], newLine.vertices[1], newLine.getNormalLine().vertices[1], false);
          }
        
          ctx.lineTo(cvs.width, cvs.height);
          ctx.lineTo(0, cvs.height);
          ctx.closePath();
          ctx.fill();
      }      
  }

  class Scene {
      constructor(astronomy){
          this.Mountain = new mountain_class();
          this.Trees = new trees_class();
          this.Clouds = new Clouds();
          
          this.Astronomy = astronomy;

          if(this.Astronomy.isDaytime()){
            this.Sun = new sun_class();
            if(this.Astronomy.isSolarEclipse()) this.Moon = new moon_class();
          }
          else {
              this.Moon = new moon_class(this.Astronomy);
          }
      }
  }

  var scene_class = Scene;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var axios = createCommonjsModule(function (module, exports) {
  /* axios v0.19.0 | (c) 2019 by Matt Zabriskie */
  (function webpackUniversalModuleDefinition(root, factory) {
  	module.exports = factory();
  })(commonjsGlobal, function() {
  return /******/ (function(modules) { // webpackBootstrap
  /******/ 	// The module cache
  /******/ 	var installedModules = {};
  /******/
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
  /******/
  /******/ 		// Check if module is in cache
  /******/ 		if(installedModules[moduleId])
  /******/ 			return installedModules[moduleId].exports;
  /******/
  /******/ 		// Create a new module (and put it into the cache)
  /******/ 		var module = installedModules[moduleId] = {
  /******/ 			exports: {},
  /******/ 			id: moduleId,
  /******/ 			loaded: false
  /******/ 		};
  /******/
  /******/ 		// Execute the module function
  /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
  /******/
  /******/ 		// Flag the module as loaded
  /******/ 		module.loaded = true;
  /******/
  /******/ 		// Return the exports of the module
  /******/ 		return module.exports;
  /******/ 	}
  /******/
  /******/
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = modules;
  /******/
  /******/ 	// expose the module cache
  /******/ 	__webpack_require__.c = installedModules;
  /******/
  /******/ 	// __webpack_public_path__
  /******/ 	__webpack_require__.p = "";
  /******/
  /******/ 	// Load entry module and return exports
  /******/ 	return __webpack_require__(0);
  /******/ })
  /************************************************************************/
  /******/ ([
  /* 0 */
  /***/ (function(module, exports, __webpack_require__) {

  	module.exports = __webpack_require__(1);

  /***/ }),
  /* 1 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var bind = __webpack_require__(3);
  	var Axios = __webpack_require__(5);
  	var mergeConfig = __webpack_require__(22);
  	var defaults = __webpack_require__(11);
  	
  	/**
  	 * Create an instance of Axios
  	 *
  	 * @param {Object} defaultConfig The default config for the instance
  	 * @return {Axios} A new instance of Axios
  	 */
  	function createInstance(defaultConfig) {
  	  var context = new Axios(defaultConfig);
  	  var instance = bind(Axios.prototype.request, context);
  	
  	  // Copy axios.prototype to instance
  	  utils.extend(instance, Axios.prototype, context);
  	
  	  // Copy context to instance
  	  utils.extend(instance, context);
  	
  	  return instance;
  	}
  	
  	// Create the default instance to be exported
  	var axios = createInstance(defaults);
  	
  	// Expose Axios class to allow class inheritance
  	axios.Axios = Axios;
  	
  	// Factory for creating new instances
  	axios.create = function create(instanceConfig) {
  	  return createInstance(mergeConfig(axios.defaults, instanceConfig));
  	};
  	
  	// Expose Cancel & CancelToken
  	axios.Cancel = __webpack_require__(23);
  	axios.CancelToken = __webpack_require__(24);
  	axios.isCancel = __webpack_require__(10);
  	
  	// Expose all/spread
  	axios.all = function all(promises) {
  	  return Promise.all(promises);
  	};
  	axios.spread = __webpack_require__(25);
  	
  	module.exports = axios;
  	
  	// Allow use of default import syntax in TypeScript
  	module.exports.default = axios;


  /***/ }),
  /* 2 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var bind = __webpack_require__(3);
  	var isBuffer = __webpack_require__(4);
  	
  	/*global toString:true*/
  	
  	// utils is a library of generic helper functions non-specific to axios
  	
  	var toString = Object.prototype.toString;
  	
  	/**
  	 * Determine if a value is an Array
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an Array, otherwise false
  	 */
  	function isArray(val) {
  	  return toString.call(val) === '[object Array]';
  	}
  	
  	/**
  	 * Determine if a value is an ArrayBuffer
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
  	 */
  	function isArrayBuffer(val) {
  	  return toString.call(val) === '[object ArrayBuffer]';
  	}
  	
  	/**
  	 * Determine if a value is a FormData
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an FormData, otherwise false
  	 */
  	function isFormData(val) {
  	  return (typeof FormData !== 'undefined') && (val instanceof FormData);
  	}
  	
  	/**
  	 * Determine if a value is a view on an ArrayBuffer
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
  	 */
  	function isArrayBufferView(val) {
  	  var result;
  	  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
  	    result = ArrayBuffer.isView(val);
  	  } else {
  	    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  	  }
  	  return result;
  	}
  	
  	/**
  	 * Determine if a value is a String
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a String, otherwise false
  	 */
  	function isString(val) {
  	  return typeof val === 'string';
  	}
  	
  	/**
  	 * Determine if a value is a Number
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Number, otherwise false
  	 */
  	function isNumber(val) {
  	  return typeof val === 'number';
  	}
  	
  	/**
  	 * Determine if a value is undefined
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if the value is undefined, otherwise false
  	 */
  	function isUndefined(val) {
  	  return typeof val === 'undefined';
  	}
  	
  	/**
  	 * Determine if a value is an Object
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is an Object, otherwise false
  	 */
  	function isObject(val) {
  	  return val !== null && typeof val === 'object';
  	}
  	
  	/**
  	 * Determine if a value is a Date
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Date, otherwise false
  	 */
  	function isDate(val) {
  	  return toString.call(val) === '[object Date]';
  	}
  	
  	/**
  	 * Determine if a value is a File
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a File, otherwise false
  	 */
  	function isFile(val) {
  	  return toString.call(val) === '[object File]';
  	}
  	
  	/**
  	 * Determine if a value is a Blob
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Blob, otherwise false
  	 */
  	function isBlob(val) {
  	  return toString.call(val) === '[object Blob]';
  	}
  	
  	/**
  	 * Determine if a value is a Function
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Function, otherwise false
  	 */
  	function isFunction(val) {
  	  return toString.call(val) === '[object Function]';
  	}
  	
  	/**
  	 * Determine if a value is a Stream
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a Stream, otherwise false
  	 */
  	function isStream(val) {
  	  return isObject(val) && isFunction(val.pipe);
  	}
  	
  	/**
  	 * Determine if a value is a URLSearchParams object
  	 *
  	 * @param {Object} val The value to test
  	 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
  	 */
  	function isURLSearchParams(val) {
  	  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
  	}
  	
  	/**
  	 * Trim excess whitespace off the beginning and end of a string
  	 *
  	 * @param {String} str The String to trim
  	 * @returns {String} The String freed of excess whitespace
  	 */
  	function trim(str) {
  	  return str.replace(/^\s*/, '').replace(/\s*$/, '');
  	}
  	
  	/**
  	 * Determine if we're running in a standard browser environment
  	 *
  	 * This allows axios to run in a web worker, and react-native.
  	 * Both environments support XMLHttpRequest, but not fully standard globals.
  	 *
  	 * web workers:
  	 *  typeof window -> undefined
  	 *  typeof document -> undefined
  	 *
  	 * react-native:
  	 *  navigator.product -> 'ReactNative'
  	 * nativescript
  	 *  navigator.product -> 'NativeScript' or 'NS'
  	 */
  	function isStandardBrowserEnv() {
  	  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
  	                                           navigator.product === 'NativeScript' ||
  	                                           navigator.product === 'NS')) {
  	    return false;
  	  }
  	  return (
  	    typeof window !== 'undefined' &&
  	    typeof document !== 'undefined'
  	  );
  	}
  	
  	/**
  	 * Iterate over an Array or an Object invoking a function for each item.
  	 *
  	 * If `obj` is an Array callback will be called passing
  	 * the value, index, and complete array for each item.
  	 *
  	 * If 'obj' is an Object callback will be called passing
  	 * the value, key, and complete object for each property.
  	 *
  	 * @param {Object|Array} obj The object to iterate
  	 * @param {Function} fn The callback to invoke for each item
  	 */
  	function forEach(obj, fn) {
  	  // Don't bother if no value provided
  	  if (obj === null || typeof obj === 'undefined') {
  	    return;
  	  }
  	
  	  // Force an array if not already something iterable
  	  if (typeof obj !== 'object') {
  	    /*eslint no-param-reassign:0*/
  	    obj = [obj];
  	  }
  	
  	  if (isArray(obj)) {
  	    // Iterate over array values
  	    for (var i = 0, l = obj.length; i < l; i++) {
  	      fn.call(null, obj[i], i, obj);
  	    }
  	  } else {
  	    // Iterate over object keys
  	    for (var key in obj) {
  	      if (Object.prototype.hasOwnProperty.call(obj, key)) {
  	        fn.call(null, obj[key], key, obj);
  	      }
  	    }
  	  }
  	}
  	
  	/**
  	 * Accepts varargs expecting each argument to be an object, then
  	 * immutably merges the properties of each object and returns result.
  	 *
  	 * When multiple objects contain the same key the later object in
  	 * the arguments list will take precedence.
  	 *
  	 * Example:
  	 *
  	 * ```js
  	 * var result = merge({foo: 123}, {foo: 456});
  	 * console.log(result.foo); // outputs 456
  	 * ```
  	 *
  	 * @param {Object} obj1 Object to merge
  	 * @returns {Object} Result of all merge properties
  	 */
  	function merge(/* obj1, obj2, obj3, ... */) {
  	  var result = {};
  	  function assignValue(val, key) {
  	    if (typeof result[key] === 'object' && typeof val === 'object') {
  	      result[key] = merge(result[key], val);
  	    } else {
  	      result[key] = val;
  	    }
  	  }
  	
  	  for (var i = 0, l = arguments.length; i < l; i++) {
  	    forEach(arguments[i], assignValue);
  	  }
  	  return result;
  	}
  	
  	/**
  	 * Function equal to merge with the difference being that no reference
  	 * to original objects is kept.
  	 *
  	 * @see merge
  	 * @param {Object} obj1 Object to merge
  	 * @returns {Object} Result of all merge properties
  	 */
  	function deepMerge(/* obj1, obj2, obj3, ... */) {
  	  var result = {};
  	  function assignValue(val, key) {
  	    if (typeof result[key] === 'object' && typeof val === 'object') {
  	      result[key] = deepMerge(result[key], val);
  	    } else if (typeof val === 'object') {
  	      result[key] = deepMerge({}, val);
  	    } else {
  	      result[key] = val;
  	    }
  	  }
  	
  	  for (var i = 0, l = arguments.length; i < l; i++) {
  	    forEach(arguments[i], assignValue);
  	  }
  	  return result;
  	}
  	
  	/**
  	 * Extends object a by mutably adding to it the properties of object b.
  	 *
  	 * @param {Object} a The object to be extended
  	 * @param {Object} b The object to copy properties from
  	 * @param {Object} thisArg The object to bind function to
  	 * @return {Object} The resulting value of object a
  	 */
  	function extend(a, b, thisArg) {
  	  forEach(b, function assignValue(val, key) {
  	    if (thisArg && typeof val === 'function') {
  	      a[key] = bind(val, thisArg);
  	    } else {
  	      a[key] = val;
  	    }
  	  });
  	  return a;
  	}
  	
  	module.exports = {
  	  isArray: isArray,
  	  isArrayBuffer: isArrayBuffer,
  	  isBuffer: isBuffer,
  	  isFormData: isFormData,
  	  isArrayBufferView: isArrayBufferView,
  	  isString: isString,
  	  isNumber: isNumber,
  	  isObject: isObject,
  	  isUndefined: isUndefined,
  	  isDate: isDate,
  	  isFile: isFile,
  	  isBlob: isBlob,
  	  isFunction: isFunction,
  	  isStream: isStream,
  	  isURLSearchParams: isURLSearchParams,
  	  isStandardBrowserEnv: isStandardBrowserEnv,
  	  forEach: forEach,
  	  merge: merge,
  	  deepMerge: deepMerge,
  	  extend: extend,
  	  trim: trim
  	};


  /***/ }),
  /* 3 */
  /***/ (function(module, exports) {
  	
  	module.exports = function bind(fn, thisArg) {
  	  return function wrap() {
  	    var args = new Array(arguments.length);
  	    for (var i = 0; i < args.length; i++) {
  	      args[i] = arguments[i];
  	    }
  	    return fn.apply(thisArg, args);
  	  };
  	};


  /***/ }),
  /* 4 */
  /***/ (function(module, exports) {

  	/*!
  	 * Determine if an object is a Buffer
  	 *
  	 * @author   Feross Aboukhadijeh <https://feross.org>
  	 * @license  MIT
  	 */
  	
  	module.exports = function isBuffer (obj) {
  	  return obj != null && obj.constructor != null &&
  	    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
  	};


  /***/ }),
  /* 5 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var buildURL = __webpack_require__(6);
  	var InterceptorManager = __webpack_require__(7);
  	var dispatchRequest = __webpack_require__(8);
  	var mergeConfig = __webpack_require__(22);
  	
  	/**
  	 * Create a new instance of Axios
  	 *
  	 * @param {Object} instanceConfig The default config for the instance
  	 */
  	function Axios(instanceConfig) {
  	  this.defaults = instanceConfig;
  	  this.interceptors = {
  	    request: new InterceptorManager(),
  	    response: new InterceptorManager()
  	  };
  	}
  	
  	/**
  	 * Dispatch a request
  	 *
  	 * @param {Object} config The config specific for this request (merged with this.defaults)
  	 */
  	Axios.prototype.request = function request(config) {
  	  /*eslint no-param-reassign:0*/
  	  // Allow for axios('example/url'[, config]) a la fetch API
  	  if (typeof config === 'string') {
  	    config = arguments[1] || {};
  	    config.url = arguments[0];
  	  } else {
  	    config = config || {};
  	  }
  	
  	  config = mergeConfig(this.defaults, config);
  	  config.method = config.method ? config.method.toLowerCase() : 'get';
  	
  	  // Hook up interceptors middleware
  	  var chain = [dispatchRequest, undefined];
  	  var promise = Promise.resolve(config);
  	
  	  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
  	    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  	  });
  	
  	  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
  	    chain.push(interceptor.fulfilled, interceptor.rejected);
  	  });
  	
  	  while (chain.length) {
  	    promise = promise.then(chain.shift(), chain.shift());
  	  }
  	
  	  return promise;
  	};
  	
  	Axios.prototype.getUri = function getUri(config) {
  	  config = mergeConfig(this.defaults, config);
  	  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
  	};
  	
  	// Provide aliases for supported request methods
  	utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  	  /*eslint func-names:0*/
  	  Axios.prototype[method] = function(url, config) {
  	    return this.request(utils.merge(config || {}, {
  	      method: method,
  	      url: url
  	    }));
  	  };
  	});
  	
  	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  	  /*eslint func-names:0*/
  	  Axios.prototype[method] = function(url, data, config) {
  	    return this.request(utils.merge(config || {}, {
  	      method: method,
  	      url: url,
  	      data: data
  	    }));
  	  };
  	});
  	
  	module.exports = Axios;


  /***/ }),
  /* 6 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	function encode(val) {
  	  return encodeURIComponent(val).
  	    replace(/%40/gi, '@').
  	    replace(/%3A/gi, ':').
  	    replace(/%24/g, '$').
  	    replace(/%2C/gi, ',').
  	    replace(/%20/g, '+').
  	    replace(/%5B/gi, '[').
  	    replace(/%5D/gi, ']');
  	}
  	
  	/**
  	 * Build a URL by appending params to the end
  	 *
  	 * @param {string} url The base of the url (e.g., http://www.google.com)
  	 * @param {object} [params] The params to be appended
  	 * @returns {string} The formatted url
  	 */
  	module.exports = function buildURL(url, params, paramsSerializer) {
  	  /*eslint no-param-reassign:0*/
  	  if (!params) {
  	    return url;
  	  }
  	
  	  var serializedParams;
  	  if (paramsSerializer) {
  	    serializedParams = paramsSerializer(params);
  	  } else if (utils.isURLSearchParams(params)) {
  	    serializedParams = params.toString();
  	  } else {
  	    var parts = [];
  	
  	    utils.forEach(params, function serialize(val, key) {
  	      if (val === null || typeof val === 'undefined') {
  	        return;
  	      }
  	
  	      if (utils.isArray(val)) {
  	        key = key + '[]';
  	      } else {
  	        val = [val];
  	      }
  	
  	      utils.forEach(val, function parseValue(v) {
  	        if (utils.isDate(v)) {
  	          v = v.toISOString();
  	        } else if (utils.isObject(v)) {
  	          v = JSON.stringify(v);
  	        }
  	        parts.push(encode(key) + '=' + encode(v));
  	      });
  	    });
  	
  	    serializedParams = parts.join('&');
  	  }
  	
  	  if (serializedParams) {
  	    var hashmarkIndex = url.indexOf('#');
  	    if (hashmarkIndex !== -1) {
  	      url = url.slice(0, hashmarkIndex);
  	    }
  	
  	    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  	  }
  	
  	  return url;
  	};


  /***/ }),
  /* 7 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	function InterceptorManager() {
  	  this.handlers = [];
  	}
  	
  	/**
  	 * Add a new interceptor to the stack
  	 *
  	 * @param {Function} fulfilled The function to handle `then` for a `Promise`
  	 * @param {Function} rejected The function to handle `reject` for a `Promise`
  	 *
  	 * @return {Number} An ID used to remove interceptor later
  	 */
  	InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  	  this.handlers.push({
  	    fulfilled: fulfilled,
  	    rejected: rejected
  	  });
  	  return this.handlers.length - 1;
  	};
  	
  	/**
  	 * Remove an interceptor from the stack
  	 *
  	 * @param {Number} id The ID that was returned by `use`
  	 */
  	InterceptorManager.prototype.eject = function eject(id) {
  	  if (this.handlers[id]) {
  	    this.handlers[id] = null;
  	  }
  	};
  	
  	/**
  	 * Iterate over all the registered interceptors
  	 *
  	 * This method is particularly useful for skipping over any
  	 * interceptors that may have become `null` calling `eject`.
  	 *
  	 * @param {Function} fn The function to call for each interceptor
  	 */
  	InterceptorManager.prototype.forEach = function forEach(fn) {
  	  utils.forEach(this.handlers, function forEachHandler(h) {
  	    if (h !== null) {
  	      fn(h);
  	    }
  	  });
  	};
  	
  	module.exports = InterceptorManager;


  /***/ }),
  /* 8 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var transformData = __webpack_require__(9);
  	var isCancel = __webpack_require__(10);
  	var defaults = __webpack_require__(11);
  	var isAbsoluteURL = __webpack_require__(20);
  	var combineURLs = __webpack_require__(21);
  	
  	/**
  	 * Throws a `Cancel` if cancellation has been requested.
  	 */
  	function throwIfCancellationRequested(config) {
  	  if (config.cancelToken) {
  	    config.cancelToken.throwIfRequested();
  	  }
  	}
  	
  	/**
  	 * Dispatch a request to the server using the configured adapter.
  	 *
  	 * @param {object} config The config that is to be used for the request
  	 * @returns {Promise} The Promise to be fulfilled
  	 */
  	module.exports = function dispatchRequest(config) {
  	  throwIfCancellationRequested(config);
  	
  	  // Support baseURL config
  	  if (config.baseURL && !isAbsoluteURL(config.url)) {
  	    config.url = combineURLs(config.baseURL, config.url);
  	  }
  	
  	  // Ensure headers exist
  	  config.headers = config.headers || {};
  	
  	  // Transform request data
  	  config.data = transformData(
  	    config.data,
  	    config.headers,
  	    config.transformRequest
  	  );
  	
  	  // Flatten headers
  	  config.headers = utils.merge(
  	    config.headers.common || {},
  	    config.headers[config.method] || {},
  	    config.headers || {}
  	  );
  	
  	  utils.forEach(
  	    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
  	    function cleanHeaderConfig(method) {
  	      delete config.headers[method];
  	    }
  	  );
  	
  	  var adapter = config.adapter || defaults.adapter;
  	
  	  return adapter(config).then(function onAdapterResolution(response) {
  	    throwIfCancellationRequested(config);
  	
  	    // Transform response data
  	    response.data = transformData(
  	      response.data,
  	      response.headers,
  	      config.transformResponse
  	    );
  	
  	    return response;
  	  }, function onAdapterRejection(reason) {
  	    if (!isCancel(reason)) {
  	      throwIfCancellationRequested(config);
  	
  	      // Transform response data
  	      if (reason && reason.response) {
  	        reason.response.data = transformData(
  	          reason.response.data,
  	          reason.response.headers,
  	          config.transformResponse
  	        );
  	      }
  	    }
  	
  	    return Promise.reject(reason);
  	  });
  	};


  /***/ }),
  /* 9 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	/**
  	 * Transform the data for a request or a response
  	 *
  	 * @param {Object|String} data The data to be transformed
  	 * @param {Array} headers The headers for the request or response
  	 * @param {Array|Function} fns A single function or Array of functions
  	 * @returns {*} The resulting transformed data
  	 */
  	module.exports = function transformData(data, headers, fns) {
  	  /*eslint no-param-reassign:0*/
  	  utils.forEach(fns, function transform(fn) {
  	    data = fn(data, headers);
  	  });
  	
  	  return data;
  	};


  /***/ }),
  /* 10 */
  /***/ (function(module, exports) {
  	
  	module.exports = function isCancel(value) {
  	  return !!(value && value.__CANCEL__);
  	};


  /***/ }),
  /* 11 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var normalizeHeaderName = __webpack_require__(12);
  	
  	var DEFAULT_CONTENT_TYPE = {
  	  'Content-Type': 'application/x-www-form-urlencoded'
  	};
  	
  	function setContentTypeIfUnset(headers, value) {
  	  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
  	    headers['Content-Type'] = value;
  	  }
  	}
  	
  	function getDefaultAdapter() {
  	  var adapter;
  	  // Only Node.JS has a process variable that is of [[Class]] process
  	  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
  	    // For node use HTTP adapter
  	    adapter = __webpack_require__(13);
  	  } else if (typeof XMLHttpRequest !== 'undefined') {
  	    // For browsers use XHR adapter
  	    adapter = __webpack_require__(13);
  	  }
  	  return adapter;
  	}
  	
  	var defaults = {
  	  adapter: getDefaultAdapter(),
  	
  	  transformRequest: [function transformRequest(data, headers) {
  	    normalizeHeaderName(headers, 'Accept');
  	    normalizeHeaderName(headers, 'Content-Type');
  	    if (utils.isFormData(data) ||
  	      utils.isArrayBuffer(data) ||
  	      utils.isBuffer(data) ||
  	      utils.isStream(data) ||
  	      utils.isFile(data) ||
  	      utils.isBlob(data)
  	    ) {
  	      return data;
  	    }
  	    if (utils.isArrayBufferView(data)) {
  	      return data.buffer;
  	    }
  	    if (utils.isURLSearchParams(data)) {
  	      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
  	      return data.toString();
  	    }
  	    if (utils.isObject(data)) {
  	      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
  	      return JSON.stringify(data);
  	    }
  	    return data;
  	  }],
  	
  	  transformResponse: [function transformResponse(data) {
  	    /*eslint no-param-reassign:0*/
  	    if (typeof data === 'string') {
  	      try {
  	        data = JSON.parse(data);
  	      } catch (e) { /* Ignore */ }
  	    }
  	    return data;
  	  }],
  	
  	  /**
  	   * A timeout in milliseconds to abort a request. If set to 0 (default) a
  	   * timeout is not created.
  	   */
  	  timeout: 0,
  	
  	  xsrfCookieName: 'XSRF-TOKEN',
  	  xsrfHeaderName: 'X-XSRF-TOKEN',
  	
  	  maxContentLength: -1,
  	
  	  validateStatus: function validateStatus(status) {
  	    return status >= 200 && status < 300;
  	  }
  	};
  	
  	defaults.headers = {
  	  common: {
  	    'Accept': 'application/json, text/plain, */*'
  	  }
  	};
  	
  	utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  	  defaults.headers[method] = {};
  	});
  	
  	utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  	  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
  	});
  	
  	module.exports = defaults;


  /***/ }),
  /* 12 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	module.exports = function normalizeHeaderName(headers, normalizedName) {
  	  utils.forEach(headers, function processHeader(value, name) {
  	    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
  	      headers[normalizedName] = value;
  	      delete headers[name];
  	    }
  	  });
  	};


  /***/ }),
  /* 13 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	var settle = __webpack_require__(14);
  	var buildURL = __webpack_require__(6);
  	var parseHeaders = __webpack_require__(17);
  	var isURLSameOrigin = __webpack_require__(18);
  	var createError = __webpack_require__(15);
  	
  	module.exports = function xhrAdapter(config) {
  	  return new Promise(function dispatchXhrRequest(resolve, reject) {
  	    var requestData = config.data;
  	    var requestHeaders = config.headers;
  	
  	    if (utils.isFormData(requestData)) {
  	      delete requestHeaders['Content-Type']; // Let the browser set it
  	    }
  	
  	    var request = new XMLHttpRequest();
  	
  	    // HTTP basic authentication
  	    if (config.auth) {
  	      var username = config.auth.username || '';
  	      var password = config.auth.password || '';
  	      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
  	    }
  	
  	    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);
  	
  	    // Set the request timeout in MS
  	    request.timeout = config.timeout;
  	
  	    // Listen for ready state
  	    request.onreadystatechange = function handleLoad() {
  	      if (!request || request.readyState !== 4) {
  	        return;
  	      }
  	
  	      // The request errored out and we didn't get a response, this will be
  	      // handled by onerror instead
  	      // With one exception: request that using file: protocol, most browsers
  	      // will return status as 0 even though it's a successful request
  	      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
  	        return;
  	      }
  	
  	      // Prepare the response
  	      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
  	      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
  	      var response = {
  	        data: responseData,
  	        status: request.status,
  	        statusText: request.statusText,
  	        headers: responseHeaders,
  	        config: config,
  	        request: request
  	      };
  	
  	      settle(resolve, reject, response);
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Handle browser request cancellation (as opposed to a manual cancellation)
  	    request.onabort = function handleAbort() {
  	      if (!request) {
  	        return;
  	      }
  	
  	      reject(createError('Request aborted', config, 'ECONNABORTED', request));
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Handle low level network errors
  	    request.onerror = function handleError() {
  	      // Real errors are hidden from us by the browser
  	      // onerror should only fire if it's a network error
  	      reject(createError('Network Error', config, null, request));
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Handle timeout
  	    request.ontimeout = function handleTimeout() {
  	      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
  	        request));
  	
  	      // Clean up request
  	      request = null;
  	    };
  	
  	    // Add xsrf header
  	    // This is only done if running in a standard browser environment.
  	    // Specifically not if we're in a web worker, or react-native.
  	    if (utils.isStandardBrowserEnv()) {
  	      var cookies = __webpack_require__(19);
  	
  	      // Add xsrf header
  	      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
  	        cookies.read(config.xsrfCookieName) :
  	        undefined;
  	
  	      if (xsrfValue) {
  	        requestHeaders[config.xsrfHeaderName] = xsrfValue;
  	      }
  	    }
  	
  	    // Add headers to the request
  	    if ('setRequestHeader' in request) {
  	      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
  	        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
  	          // Remove Content-Type if data is undefined
  	          delete requestHeaders[key];
  	        } else {
  	          // Otherwise add header to the request
  	          request.setRequestHeader(key, val);
  	        }
  	      });
  	    }
  	
  	    // Add withCredentials to request if needed
  	    if (config.withCredentials) {
  	      request.withCredentials = true;
  	    }
  	
  	    // Add responseType to request if needed
  	    if (config.responseType) {
  	      try {
  	        request.responseType = config.responseType;
  	      } catch (e) {
  	        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
  	        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
  	        if (config.responseType !== 'json') {
  	          throw e;
  	        }
  	      }
  	    }
  	
  	    // Handle progress if needed
  	    if (typeof config.onDownloadProgress === 'function') {
  	      request.addEventListener('progress', config.onDownloadProgress);
  	    }
  	
  	    // Not all browsers support upload events
  	    if (typeof config.onUploadProgress === 'function' && request.upload) {
  	      request.upload.addEventListener('progress', config.onUploadProgress);
  	    }
  	
  	    if (config.cancelToken) {
  	      // Handle cancellation
  	      config.cancelToken.promise.then(function onCanceled(cancel) {
  	        if (!request) {
  	          return;
  	        }
  	
  	        request.abort();
  	        reject(cancel);
  	        // Clean up request
  	        request = null;
  	      });
  	    }
  	
  	    if (requestData === undefined) {
  	      requestData = null;
  	    }
  	
  	    // Send the request
  	    request.send(requestData);
  	  });
  	};


  /***/ }),
  /* 14 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var createError = __webpack_require__(15);
  	
  	/**
  	 * Resolve or reject a Promise based on response status.
  	 *
  	 * @param {Function} resolve A function that resolves the promise.
  	 * @param {Function} reject A function that rejects the promise.
  	 * @param {object} response The response.
  	 */
  	module.exports = function settle(resolve, reject, response) {
  	  var validateStatus = response.config.validateStatus;
  	  if (!validateStatus || validateStatus(response.status)) {
  	    resolve(response);
  	  } else {
  	    reject(createError(
  	      'Request failed with status code ' + response.status,
  	      response.config,
  	      null,
  	      response.request,
  	      response
  	    ));
  	  }
  	};


  /***/ }),
  /* 15 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var enhanceError = __webpack_require__(16);
  	
  	/**
  	 * Create an Error with the specified message, config, error code, request and response.
  	 *
  	 * @param {string} message The error message.
  	 * @param {Object} config The config.
  	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
  	 * @param {Object} [request] The request.
  	 * @param {Object} [response] The response.
  	 * @returns {Error} The created error.
  	 */
  	module.exports = function createError(message, config, code, request, response) {
  	  var error = new Error(message);
  	  return enhanceError(error, config, code, request, response);
  	};


  /***/ }),
  /* 16 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Update an Error with the specified config, error code, and response.
  	 *
  	 * @param {Error} error The error to update.
  	 * @param {Object} config The config.
  	 * @param {string} [code] The error code (for example, 'ECONNABORTED').
  	 * @param {Object} [request] The request.
  	 * @param {Object} [response] The response.
  	 * @returns {Error} The error.
  	 */
  	module.exports = function enhanceError(error, config, code, request, response) {
  	  error.config = config;
  	  if (code) {
  	    error.code = code;
  	  }
  	
  	  error.request = request;
  	  error.response = response;
  	  error.isAxiosError = true;
  	
  	  error.toJSON = function() {
  	    return {
  	      // Standard
  	      message: this.message,
  	      name: this.name,
  	      // Microsoft
  	      description: this.description,
  	      number: this.number,
  	      // Mozilla
  	      fileName: this.fileName,
  	      lineNumber: this.lineNumber,
  	      columnNumber: this.columnNumber,
  	      stack: this.stack,
  	      // Axios
  	      config: this.config,
  	      code: this.code
  	    };
  	  };
  	  return error;
  	};


  /***/ }),
  /* 17 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	// Headers whose duplicates are ignored by node
  	// c.f. https://nodejs.org/api/http.html#http_message_headers
  	var ignoreDuplicateOf = [
  	  'age', 'authorization', 'content-length', 'content-type', 'etag',
  	  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  	  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  	  'referer', 'retry-after', 'user-agent'
  	];
  	
  	/**
  	 * Parse headers into an object
  	 *
  	 * ```
  	 * Date: Wed, 27 Aug 2014 08:58:49 GMT
  	 * Content-Type: application/json
  	 * Connection: keep-alive
  	 * Transfer-Encoding: chunked
  	 * ```
  	 *
  	 * @param {String} headers Headers needing to be parsed
  	 * @returns {Object} Headers parsed into an object
  	 */
  	module.exports = function parseHeaders(headers) {
  	  var parsed = {};
  	  var key;
  	  var val;
  	  var i;
  	
  	  if (!headers) { return parsed; }
  	
  	  utils.forEach(headers.split('\n'), function parser(line) {
  	    i = line.indexOf(':');
  	    key = utils.trim(line.substr(0, i)).toLowerCase();
  	    val = utils.trim(line.substr(i + 1));
  	
  	    if (key) {
  	      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
  	        return;
  	      }
  	      if (key === 'set-cookie') {
  	        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
  	      } else {
  	        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
  	      }
  	    }
  	  });
  	
  	  return parsed;
  	};


  /***/ }),
  /* 18 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	module.exports = (
  	  utils.isStandardBrowserEnv() ?
  	
  	  // Standard browser envs have full support of the APIs needed to test
  	  // whether the request URL is of the same origin as current location.
  	    (function standardBrowserEnv() {
  	      var msie = /(msie|trident)/i.test(navigator.userAgent);
  	      var urlParsingNode = document.createElement('a');
  	      var originURL;
  	
  	      /**
  	    * Parse a URL to discover it's components
  	    *
  	    * @param {String} url The URL to be parsed
  	    * @returns {Object}
  	    */
  	      function resolveURL(url) {
  	        var href = url;
  	
  	        if (msie) {
  	        // IE needs attribute set twice to normalize properties
  	          urlParsingNode.setAttribute('href', href);
  	          href = urlParsingNode.href;
  	        }
  	
  	        urlParsingNode.setAttribute('href', href);
  	
  	        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
  	        return {
  	          href: urlParsingNode.href,
  	          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
  	          host: urlParsingNode.host,
  	          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
  	          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
  	          hostname: urlParsingNode.hostname,
  	          port: urlParsingNode.port,
  	          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
  	            urlParsingNode.pathname :
  	            '/' + urlParsingNode.pathname
  	        };
  	      }
  	
  	      originURL = resolveURL(window.location.href);
  	
  	      /**
  	    * Determine if a URL shares the same origin as the current location
  	    *
  	    * @param {String} requestURL The URL to test
  	    * @returns {boolean} True if URL shares the same origin, otherwise false
  	    */
  	      return function isURLSameOrigin(requestURL) {
  	        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
  	        return (parsed.protocol === originURL.protocol &&
  	            parsed.host === originURL.host);
  	      };
  	    })() :
  	
  	  // Non standard browser envs (web workers, react-native) lack needed support.
  	    (function nonStandardBrowserEnv() {
  	      return function isURLSameOrigin() {
  	        return true;
  	      };
  	    })()
  	);


  /***/ }),
  /* 19 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	module.exports = (
  	  utils.isStandardBrowserEnv() ?
  	
  	  // Standard browser envs support document.cookie
  	    (function standardBrowserEnv() {
  	      return {
  	        write: function write(name, value, expires, path, domain, secure) {
  	          var cookie = [];
  	          cookie.push(name + '=' + encodeURIComponent(value));
  	
  	          if (utils.isNumber(expires)) {
  	            cookie.push('expires=' + new Date(expires).toGMTString());
  	          }
  	
  	          if (utils.isString(path)) {
  	            cookie.push('path=' + path);
  	          }
  	
  	          if (utils.isString(domain)) {
  	            cookie.push('domain=' + domain);
  	          }
  	
  	          if (secure === true) {
  	            cookie.push('secure');
  	          }
  	
  	          document.cookie = cookie.join('; ');
  	        },
  	
  	        read: function read(name) {
  	          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  	          return (match ? decodeURIComponent(match[3]) : null);
  	        },
  	
  	        remove: function remove(name) {
  	          this.write(name, '', Date.now() - 86400000);
  	        }
  	      };
  	    })() :
  	
  	  // Non standard browser env (web workers, react-native) lack needed support.
  	    (function nonStandardBrowserEnv() {
  	      return {
  	        write: function write() {},
  	        read: function read() { return null; },
  	        remove: function remove() {}
  	      };
  	    })()
  	);


  /***/ }),
  /* 20 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Determines whether the specified URL is absolute
  	 *
  	 * @param {string} url The URL to test
  	 * @returns {boolean} True if the specified URL is absolute, otherwise false
  	 */
  	module.exports = function isAbsoluteURL(url) {
  	  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  	  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  	  // by any combination of letters, digits, plus, period, or hyphen.
  	  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
  	};


  /***/ }),
  /* 21 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Creates a new URL by combining the specified URLs
  	 *
  	 * @param {string} baseURL The base URL
  	 * @param {string} relativeURL The relative URL
  	 * @returns {string} The combined URL
  	 */
  	module.exports = function combineURLs(baseURL, relativeURL) {
  	  return relativeURL
  	    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
  	    : baseURL;
  	};


  /***/ }),
  /* 22 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var utils = __webpack_require__(2);
  	
  	/**
  	 * Config-specific merge-function which creates a new config-object
  	 * by merging two configuration objects together.
  	 *
  	 * @param {Object} config1
  	 * @param {Object} config2
  	 * @returns {Object} New object resulting from merging config2 to config1
  	 */
  	module.exports = function mergeConfig(config1, config2) {
  	  // eslint-disable-next-line no-param-reassign
  	  config2 = config2 || {};
  	  var config = {};
  	
  	  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
  	    if (typeof config2[prop] !== 'undefined') {
  	      config[prop] = config2[prop];
  	    }
  	  });
  	
  	  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
  	    if (utils.isObject(config2[prop])) {
  	      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
  	    } else if (typeof config2[prop] !== 'undefined') {
  	      config[prop] = config2[prop];
  	    } else if (utils.isObject(config1[prop])) {
  	      config[prop] = utils.deepMerge(config1[prop]);
  	    } else if (typeof config1[prop] !== 'undefined') {
  	      config[prop] = config1[prop];
  	    }
  	  });
  	
  	  utils.forEach([
  	    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
  	    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
  	    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
  	    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
  	    'socketPath'
  	  ], function defaultToConfig2(prop) {
  	    if (typeof config2[prop] !== 'undefined') {
  	      config[prop] = config2[prop];
  	    } else if (typeof config1[prop] !== 'undefined') {
  	      config[prop] = config1[prop];
  	    }
  	  });
  	
  	  return config;
  	};


  /***/ }),
  /* 23 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * A `Cancel` is an object that is thrown when an operation is canceled.
  	 *
  	 * @class
  	 * @param {string=} message The message.
  	 */
  	function Cancel(message) {
  	  this.message = message;
  	}
  	
  	Cancel.prototype.toString = function toString() {
  	  return 'Cancel' + (this.message ? ': ' + this.message : '');
  	};
  	
  	Cancel.prototype.__CANCEL__ = true;
  	
  	module.exports = Cancel;


  /***/ }),
  /* 24 */
  /***/ (function(module, exports, __webpack_require__) {
  	
  	var Cancel = __webpack_require__(23);
  	
  	/**
  	 * A `CancelToken` is an object that can be used to request cancellation of an operation.
  	 *
  	 * @class
  	 * @param {Function} executor The executor function.
  	 */
  	function CancelToken(executor) {
  	  if (typeof executor !== 'function') {
  	    throw new TypeError('executor must be a function.');
  	  }
  	
  	  var resolvePromise;
  	  this.promise = new Promise(function promiseExecutor(resolve) {
  	    resolvePromise = resolve;
  	  });
  	
  	  var token = this;
  	  executor(function cancel(message) {
  	    if (token.reason) {
  	      // Cancellation has already been requested
  	      return;
  	    }
  	
  	    token.reason = new Cancel(message);
  	    resolvePromise(token.reason);
  	  });
  	}
  	
  	/**
  	 * Throws a `Cancel` if cancellation has been requested.
  	 */
  	CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  	  if (this.reason) {
  	    throw this.reason;
  	  }
  	};
  	
  	/**
  	 * Returns an object that contains a new `CancelToken` and a function that, when called,
  	 * cancels the `CancelToken`.
  	 */
  	CancelToken.source = function source() {
  	  var cancel;
  	  var token = new CancelToken(function executor(c) {
  	    cancel = c;
  	  });
  	  return {
  	    token: token,
  	    cancel: cancel
  	  };
  	};
  	
  	module.exports = CancelToken;


  /***/ }),
  /* 25 */
  /***/ (function(module, exports) {
  	
  	/**
  	 * Syntactic sugar for invoking a function and expanding an array for arguments.
  	 *
  	 * Common use case would be to use `Function.prototype.apply`.
  	 *
  	 *  ```js
  	 *  function f(x, y, z) {}
  	 *  var args = [1, 2, 3];
  	 *  f.apply(null, args);
  	 *  ```
  	 *
  	 * With `spread` this example can be re-written.
  	 *
  	 *  ```js
  	 *  spread(function(x, y, z) {})([1, 2, 3]);
  	 *  ```
  	 *
  	 * @param {Function} callback
  	 * @returns {Function}
  	 */
  	module.exports = function spread(callback) {
  	  return function wrap(arr) {
  	    return callback.apply(null, arr);
  	  };
  	};


  /***/ })
  /******/ ])
  });

  });

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
          "temperatureMaxTime", "apparentTemperatureMinTime", "apparentTemperatureMaxTime"];
          var dateProps = ["sunrise","sunset","solar_noon","moonrise","moonset"];

          for(let i = 0; i < unixProps.length; i++){
              this.Data[unixProps[i]] = new Date(this.Data[unixProps[i]] * 1000);
          }
          for(let i = 0; i < dateProps.length; i++){
              const date = this.dateFactory();
              if(dateProps[i] !== 'moonset'){
                  const splitProps = this.Data[dateProps[i]].split(":");
                  this.Data[dateProps[i]] = date.setHours(parseInt(splitProps[0], 10), parseInt(splitProps[1], 10));
              }
              else {
                  // Might have daylight savings issue
                  date.setTime(date.getTime() + 86400000);
                  const splitProps = this.Data[dateProps[i]].split(":");
                  this.Data[dateProps[i]] = date.setHours(parseInt(splitProps[0], 10), parseInt(splitProps[1], 10));
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

  var astronomy_data_class = Astronomy;

  document.addEventListener('DOMContentLoaded', async () => { 
    if (document.getElementsByTagName('canvas').getContext) { 
      console.warn('This browser does not support HTML Canvas');
      return;
    }
    const astronomy = new astronomy_data_class();
    await astronomy.RefreshData();
    new scene_class(astronomy);
    console.log(astronomy);
    handleTime(astronomy.ServerDate);
  });

  function updateTime(element, h, m, s, am, millTime){
    element.setAttribute('datetime', millTime);
    element.innerHTML = `${h}:${m}:${s} ${am ? 'AM' : 'PM'}`;
  }

  function handleTime(date){
    const timeElement = document.querySelector('#time');
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
        
        updateTime(timeElement, h, m, s, am, millTime);
      }, 1000);
    }
  }

  var initialize = {

  };

  return initialize;

}());
