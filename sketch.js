let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*15);
  
  sleep.addRecord(2021, 8, 1, 9, 24, 18, 55, false);
  sleep.addRecord(2021, 8, 2, 19, 47, 5, 34, false);
  sleep.addRecord(2021, 8, 3);
  sleep.addRecord(2021, 8, 4, 2, 9, 7, 29, true);
  sleep.addRecord(2021, 8, 4, 23, 4, 7, 32, true);
  sleep.addRecord(2021, 8, 5);
  sleep.addRecord(2021, 8, 6, 4, 28, 13, 16, false);
  sleep.addRecord(2021, 8, 7, 6, 34, 17, 59, false)
  sleep.addRecord(2021, 8, 8, 11, 5, 18, 16, false);
  sleep.addRecord(2021, 8, 9, 19, 3, 3, 21, false);
  sleep.addRecord(2021, 8, 10, 22, 58, 5, 38, false);
  sleep.addRecord(2021, 8, 11, 15, 15, 21, 35, false);
  sleep.addRecord(2021, 8, 12, 18, 38, 2, 59, false);
  // sleep.addRecord(2021, 8, 13, 0, 32, 6, 58, true);
  // sleep.addRecord(2021, 8, 14, 0, 8, 10, 53, false);
  // sleep.addRecord(2021, 8, 15, 4, 18, 8, 31, true);
  // sleep.addRecord(2021, 8, 15, 23, 34, 8, 28, true);
  // sleep.addRecord(2021, 8, 16);
  // sleep.addRecord(2021, 8, 17, 1, 59, 8, 32, true);
  // sleep.addRecord(2021, 8, 18, 2, 0, 8, 2, true);
  // sleep.addRecord(2021, 8, 19, 5, 9, 8, 32, true);
  // sleep.addRecord(2021, 8, 19, 19, 46, 6, 30, false);
  // sleep.addRecord(2021, 8, 20);
  // sleep.addRecord(2021, 8, 21, 2, 39, 8, 58, true);
  // sleep.addRecord(2021, 8, 22, 2, 0, 8, 45, true);
  // sleep.addRecord(2021, 8, 23, 1, 59, 5, 49, true);
  // sleep.addRecord(2021, 8, 24, 1, 0, 11, 36, false);
  // sleep.addRecord(2021, 8, 25, 3, 10, 14, 26, false);
  // sleep.addRecord(2021, 8, 26, 18, 38, 8, 42, false);
  // sleep.addRecord(2021, 8, 27);
  // sleep.addRecord(2021, 8, 28, 3, 45, 13, 54, false);
  // sleep.addRecord(2021, 8, 29, 6, 52, 8, 25, true);
  // sleep.addRecord(2021, 8, 30, 3, 21, 8, 24, true);
  // sleep.addRecord(2021, 8, 31, 3, 20, 16, 6, false);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
