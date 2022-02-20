const ws281x = require('rpi-ws281x');
const myArgs = process.argv.slice(2);
const fs = require('fs');
const https = require('https');
var color = require('/home/pi/color.js');

const requestOptions = {
    host: myArgs[0],
    path: '/api/v1/entries.json?count=2',
    method: 'GET'
};

config = {};
config.leds = 18;
config.dma = 10;
config.brightness = 255;
config.gpio = 18;
config.stripType = 'grb';
ws281x.configure(config);

        // ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
  ws281x.reset();
  process.nextTick(function () { process.exit(0); });
});

// SGV globals

let sgvData = {
    g1: 18*4,
    g2: 18*5
};

// ---- animation-loop
var offset = 0;

// update LEDs 30 times / second

var lowthreshold = 4*18;
var highthreshold = 8*18;

function updateGlucoseLeds() {
    var pixelData = new Uint32Array(config.leds);

    var c1 = hexToRgb(gethexcolor(sgvData.g1, lowthreshold, highthreshold));
    
    let s = offset <= 100 ? offset / 100 : (200-offset) / 100;

    var hsl = color.rgbToHsl(c1.r,c1.g,c1.b);
    var rgb = color.hslToRgb(hsl[0],s,hsl[2]);

    for (var i = 0; i < config.leds; i++) {
        pixelData[i] = rgb2Int(rgb[0], rgb[1], rgb[2]);
    }
  
    offset = (offset + 1) % 200;
    ws281x.render(pixelData);
}

setInterval(updateGlucoseLeds, 1000/30);

function loadGlucose () {

  https.get(requestOptions, (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {

      const d = JSON.parse(data);
      let results = {
          g1: d[0].sgv,
          g2: d[1].sgv
      };

      sgvData = results;
      console.log('Got glucose data:', results.g1, results.g2);  

    });

  }).on("error", (err) => {
    console.log("Error loading glucose data: " + err.message);
  });
};

setInterval(loadGlucose, 1000*60);

loadGlucose();

console.log('Press <ctrl>+C to exit.');

function gethexcolor(sgv, lowthres, hithresh){
    let clr = "#00FF00";
    //check if the hi threshold is 1.2 times the low threshold.
    if (hithresh > (lowthres*1.20)) {
      //start allocating color based on the thresholds
      if (sgv >= hithresh*2.6){
        clr= '#e3b4f3';
      } else if (sgv > hithresh*2.4) {
        clr= '#D6A7E6';
      } else if (sgv > hithresh*2.2) {
        clr= '#b800f5';
      } else if (sgv > hithresh*2.00) {
        clr= '#d452ff';
      } else if (sgv > hithresh*1.80) {
        clr= '#fd20d7';
      } else if (sgv > hithresh*1.70) {
        clr= '#ee59d5';
      } else if (sgv > hithresh*1.60) {
        clr= '#f38ee2';
      } else if (sgv > hithresh*1.50) {
        clr= '#f44496';
      } else if (sgv > hithresh*1.40) {
        clr= '#f76767';
      } else if (sgv > hithresh*1.30) {
        clr= '#f93434';
      } else if (sgv > hithresh*1.20) {
        clr= '#FF5722';
      } else if (sgv > hithresh*1.15) {
        clr= '#ffa500';
      } else if (sgv > hithresh*1.10) {
        clr= '#ffbf00';
      } else if (sgv > hithresh) {
        clr= '#ffff00';
      } else if (sgv > hithresh*0.80) {
        clr= '#aaee02';
      } else if (sgv > hithresh*0.65) {
        clr= '#3fce02';
      } else if (sgv > lowthres*1.20) {
        clr= '#02ad27';
      } else if (sgv > lowthres) {
        clr= '#06bbbb';
      }else{
        clr= '#2196f3';
      }
    }
    return clr;
  }

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }


function rgb2Int(r, g, b) {
    return (r << 16) | (g << 8) | b;
   }
