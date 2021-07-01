var sleep;

var CynthFont;
function preload(){
  CynthFont = loadFont("https://ccy05327.github.io/Sleep-Data-Visualization/Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*10);
  
  // sleep.addRecord(2021, 7, 1, false);
  // sleep.addRecord(2021, 7, 2, false);
  // sleep.addRecord(2021, 7, 3, false);
  // sleep.addRecord(2021, 7, 4, false);
  // sleep.addRecord(2021, 7, 5, false);
  // sleep.addRecord(2021, 7, 6, false);
  // sleep.addRecord(2021, 7, 7, false);
  // sleep.addRecord(2021, 7, 8, false);
  // sleep.addRecord(2021, 7, 9, false);
  // sleep.addRecord(2021, 7, 10, false);
  // sleep.addRecord(2021, 7, 11, false);
  // sleep.addRecord(2021, 7, 12, false);
  // sleep.addRecord(2021, 7, 13, false);
  // sleep.addRecord(2021, 7, 14, false);
  // sleep.addRecord(2021, 7, 15, false);
  // sleep.addRecord(2021, 7, 16, false);
  // sleep.addRecord(2021, 7, 17, false);
  // sleep.addRecord(2021, 7, 18, false);
  // sleep.addRecord(2021, 7, 19, false);
  // sleep.addRecord(2021, 7, 20, false);
  // sleep.addRecord(2021, 7, 21, false);
  // sleep.addRecord(2021, 7, 22, false);
  // sleep.addRecord(2021, 7, 23, false);
  // sleep.addRecord(2021, 7, 24, false);
  // sleep.addRecord(2021, 7, 25, false);
  // sleep.addRecord(2021, 7, 26, false);
  // sleep.addRecord(2021, 7, 27, false);
  // sleep.addRecord(2021, 7, 28, false);
  // sleep.addRecord(2021, 7, 29, false);
  // sleep.addRecord(2021, 7, 30, false);
  // sleep.addRecord(2021, 7, 31, false);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
