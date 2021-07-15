let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("https://ccy05327.github.io/Sleep-Data-Visualization/Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*20);
  
  sleep.addRecord(2021, 7, 1, 18, 32, 4, 26, false);
  sleep.addRecord(2021, 7, 2, 22, 17, 6, 29, true);
  sleep.addRecord(2021, 7, 3, 21, 44, 7, 58, true);
  sleep.addRecord(2021, 7, 4);
  sleep.addRecord(2021, 7, 5, 0, 1, 6, 18, true);
  sleep.addRecord(2021, 7, 5, 21, 15, 6, 36, true);
  sleep.addRecord(2021, 7, 6, 22, 0, 7, 38, true);
  sleep.addRecord(2021, 7, 7, 23, 26, 7, 37, true);
  sleep.addRecord(2021, 7, 8, 23, 46, 7, 46, true);
  sleep.addRecord(2021, 7, 9, 23, 37, 9, 40, true);
  sleep.addRecord(2021, 7, 10);
  sleep.addRecord(2021, 7, 11, 2, 18, 8, 24, true);
  sleep.addRecord(2021, 7, 12, 0, 30, 7, 49, true);
  sleep.addRecord(2021, 7, 13, 0, 32, 6, 57, true);
  sleep.addRecord(2021, 7, 14, 0, 7, 10, 53, false);
  sleep.addRecord(2021, 7, 15, 4, 17, 7, 31, true);
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
