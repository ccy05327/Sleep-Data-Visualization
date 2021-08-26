let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*30);
  
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
  sleep.addRecord(2021, 8, 13, 18, 39, 4, 18, false);
  sleep.addRecord(2021, 8, 14, 18, 19, 4, 36, false);
  sleep.addRecord(2021, 8, 15, 20, 17, 5, 3, false);
  sleep.addRecord(2021, 8, 16, 20, 56, 5, 53, false);
  sleep.addRecord(2021, 8, 17, 21, 33, 6, 17, false);
  sleep.addRecord(2021, 8, 18);
  sleep.addRecord(2021, 8, 19, 0, 17, 8, 0, true);
  sleep.addRecord(2021, 8, 20, 0, 36, 8, 19, true);
  sleep.addRecord(2021, 8, 20, 23, 50, 8, 10, true);
  sleep.addRecord(2021, 8, 21);
  sleep.addRecord(2021, 8, 22, 1, 40, 11, 3, false);
  sleep.addRecord(2021, 8, 23, 3, 35, 8, 25, true);
  sleep.addRecord(2021, 8, 24, 4, 38, 7, 30, true);
  sleep.addRecord(2021, 8, 24, 19, 17, 12, 7, false);
  sleep.addRecord(2021, 8, 26, 4, 18, 7, 45, true);
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
