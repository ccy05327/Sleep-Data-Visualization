let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*10);

  sleep.addRecord(2021, 11, 1, 8, 54, 18, 11, false);
  sleep.addRecord(2021, 11, 2, 13, 18, 20, 28, false);
  sleep.addRecord(2021, 11, 3, 11, 9, 20, 4, false);
  sleep.addRecord(2021, 11, 4, 13, 2, 22, 50, false);
  sleep.addRecord(2021, 11, 5, 13, 46, 0, 24, false);
  sleep.addRecord(2021, 11, 6, 18, 26, 2, 29, false);
  sleep.addRecord(2021, 11, 7, 20, 5, 4, 33, false);
  // sleep.addRecord(2021, 11, 8, 2, 8, 8, 28, true);
  // sleep.addRecord(2021, 11, 9, 3, 55, 8, 17, true);
  // sleep.addRecord(2021, 11, 9, 21, 28, 14, 26, false);
  // sleep.addRecord(2021, 11, 11);
  // sleep.addRecord(2021, 11, 11, 6, 36, 15, 25, false);
  // sleep.addRecord(2021, 11, 12, 7, 47, 18, 15, false);
  // sleep.addRecord(2021, 11, 13, 7, 39, 16, 34, false);
  // sleep.addRecord(2021, 11, 14, 11, 43, 20, 58, false);
  // sleep.addRecord(2021, 11, 15, 12, 35, 17, 34, true);
  // sleep.addRecord(2021, 11, 16, 9, 27, 20, 50, false);
  // sleep.addRecord(2021, 11, 17, 14, 14, 23, 31, false);
  // sleep.addRecord(2021, 11, 18, 20, 20, 5, 39, false);
  // sleep.addRecord(2021, 11, 19, 20, 22, 3, 34, false);
  // sleep.addRecord(2021, 11, 20, 16, 44, 18, 53, true);
  // sleep.addRecord(2021, 11, 21, 0, 9, 8, 54, false);
  // sleep.addRecord(2021, 11, 21, 22, 35, 8, 15, false);
  // sleep.addRecord(2021, 11, 22, 22, 12, 6, 58, false);
  // sleep.addRecord(2021, 11, 23, 23, 20, 8, 37, false);
  // sleep.addRecord(2021, 11, 24, 23, 7, 6, 58, false);
  // sleep.addRecord(2021, 11, 25);
  // sleep.addRecord(2021, 11, 26, 0, 8, 11, 31, false);
  // sleep.addRecord(2021, 11, 26, 23, 9, 11, 28, false);
  // sleep.addRecord(2021, 11, 27);
  // sleep.addRecord(2021, 11, 28, 2, 0, 7, 9, true);
  // sleep.addRecord(2021, 11, 28, 9, 4, 12, 17, true);
  // sleep.addRecord(2021, 11, 29, 4, 5, 14, 8, false);
  // sleep.addRecord(2021, 11, 30, 7, 3, 14, 59, false);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
