let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*10);

  sleep.addRecord(2021, 9, 1, 10, 49, 22, 2, false);
  sleep.addRecord(2021, 9, 2, 12, 23, 20, 40, false);
  sleep.addRecord(2021, 9, 3, 10, 38, 19, 12, false);
  sleep.addRecord(2021, 9, 4, 10, 55, 22, 33, false);
  sleep.addRecord(2021, 9, 5, 13, 41, 23, 37, false);
  sleep.addRecord(2021, 9, 6, 16, 9, 20, 42, false);
  sleep.addRecord(2021, 9, 7, 15, 22, 0, 48, false);
  sleep.addRecord(2021, 9, 8, 16, 0, 0, 46, false);
  sleep.addRecord(2021, 9, 9, 19, 2, 4, 27, false);
  // sleep.addRecord(2021, 9, 10, 22, 58, 5, 38, false);
  // sleep.addRecord(2021, 9, 11, 15, 15, 21, 35, false);
  // sleep.addRecord(2021, 9, 12, 18, 38, 2, 59, false);
  // sleep.addRecord(2021, 9, 13, 18, 39, 4, 18, false);
  // sleep.addRecord(2021, 9, 14, 18, 19, 4, 36, false);
  // sleep.addRecord(2021, 9, 15, 20, 17, 5, 3, false);
  // sleep.addRecord(2021, 9, 16, 20, 56, 5, 53, false);
  // sleep.addRecord(2021, 9, 17, 21, 33, 6, 17, false);
  // sleep.addRecord(2021, 9, 18);
  // sleep.addRecord(2021, 9, 19, 0, 17, 8, 0, true);
  // sleep.addRecord(2021, 9, 20, 0, 36, 8, 19, true);
  // sleep.addRecord(2021, 9, 20, 23, 50, 8, 10, true);
  // sleep.addRecord(2021, 9, 21);
  // sleep.addRecord(2021, 9, 22, 1, 40, 11, 3, false);
  // sleep.addRecord(2021, 9, 23, 3, 35, 8, 25, true);
  // sleep.addRecord(2021, 9, 24, 4, 39, 7, 30, true);
  // sleep.addRecord(2021, 9, 24, 19, 17, 12, 7, false);
  // sleep.addRecord(2021, 9, 25);
  // sleep.addRecord(2021, 9, 26, 4, 19, 7, 45, true);
  // sleep.addRecord(2021, 9, 27, 1, 10, 7, 43, true);
  // sleep.addRecord(2021, 9, 29, 0, 45, 13, 51, false);
  // sleep.addRecord(2021, 9, 29, 9, 1, 14, 32, false);
  // sleep.addRecord(2021, 9, 30, 7, 17, 12, 19, false);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
