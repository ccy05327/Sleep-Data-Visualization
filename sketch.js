let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*10);

  // sleep.addRecord(2021, 9, 1, 9, 24, 18, 55, false);
  // sleep.addRecord(2021, 9, 2, 19, 47, 5, 34, false);
  // sleep.addRecord(2021, 9, 3);
  // sleep.addRecord(2021, 9, 4, 2, 9, 7, 29, true);
  // sleep.addRecord(2021, 9, 4, 23, 4, 7, 32, true);
  // sleep.addRecord(2021, 9, 5);
  // sleep.addRecord(2021, 9, 6, 4, 28, 13, 16, false);
  // sleep.addRecord(2021, 9, 7, 6, 34, 17, 59, false)
  // sleep.addRecord(2021, 9, 8, 11, 5, 18, 16, false);
  // sleep.addRecord(2021, 9, 9, 19, 3, 3, 21, false);
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
  // sleep.addRecord(2021, 9, 31, 4, 31, 16, 42, false);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
