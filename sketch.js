var sleep;

var CynthFont;
function preload(){
  CynthFont = loadFont("https://ccy05327.github.io/Sleep-Data-Visualization/Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*10);
  
  sleep.addRecord(2021, 7, 1, 18, 32, 4, 26, false);
  sleep.addRecord(2021, 7, 2, 22, 17, 6, 29, true);
  sleep.addRecord(2021, 7, 3, 21, 44, 7, 58, true);
  sleep.addRecord(2021, 7, 4);
  sleep.addRecord(2021, 7, 5, 0, 1, 6, 18, true);
  sleep.addRecord(2021, 7, 6, 21, 15, 6, 36, true);
  // sleep.addRecord(2021, 7, 7, , true);
  // sleep.addRecord(2021, 7, 8, , true);
  // sleep.addRecord(2021, 7, 9, , true);
  // sleep.addRecord(2021, 7, 10, , true);
  // sleep.addRecord(2021, 7, 11, , true);
  // sleep.addRecord(2021, 7, 12, , true);
  // sleep.addRecord(2021, 7, 13, , true);
  // sleep.addRecord(2021, 7, 14, , true);
  // sleep.addRecord(2021, 7, 15, , true);
  // sleep.addRecord(2021, 7, 16, , true);
  // sleep.addRecord(2021, 7, 17, , true);
  // sleep.addRecord(2021, 7, 18, , true);
  // sleep.addRecord(2021, 7, 19, , true);
  // sleep.addRecord(2021, 7, 20, , true);
  // sleep.addRecord(2021, 7, 21, , true);
  // sleep.addRecord(2021, 7, 22, , true);
  // sleep.addRecord(2021, 7, 23, , true);
  // sleep.addRecord(2021, 7, 24, , true);
  // sleep.addRecord(2021, 7, 25, , true);
  // sleep.addRecord(2021, 7, 26, , true);
  // sleep.addRecord(2021, 7, 27, , true);
  // sleep.addRecord(2021, 7, 28, , true);
  // sleep.addRecord(2021, 7, 29, , true);
  // sleep.addRecord(2021, 7, 30, , true);
  // sleep.addRecord(2021, 7, 31, , true);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
