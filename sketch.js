let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*20);

  sleep.addRecord(2021, 10, 1, 0, 0, 6, 42, false);
  sleep.addRecord(2021, 10, 2, 1, 45, 8, 5, true);
  sleep.addRecord(2021, 10, 3, 0, 0, 10, 49, false);
  sleep.addRecord(2021, 10, 4, 1, 34, 12, 13, false);
  sleep.addRecord(2021, 10, 5, 2, 29, 13, 14, false);
  sleep.addRecord(2021, 10, 6, 3, 2, 11, 46, false);
  sleep.addRecord(2021, 10, 7, 3, 48, 7, 33, true);
  sleep.addRecord(2021, 10, 8, 2, 8, 8, 28, true);
  sleep.addRecord(2021, 10, 9, 3, 55, 8, 17, true);
  sleep.addRecord(2021, 10, 10, 21, 28, 14, 26, false);
  sleep.addRecord(2021, 10, 11, 6, 36, 15, 25, false);
  sleep.addRecord(2021, 10, 12, 7, 47, 18, 15, false);
  sleep.addRecord(2021, 10, 13, 7, 39, 16, 34, false);
  sleep.addRecord(2021, 10, 14, 10, 43, 20, 58, false);
  sleep.addRecord(2021, 10, 15, 12, 35, 17, 34, true);
  sleep.addRecord(2021, 10, 16, 9, 27, 20, 50, false);
  sleep.addRecord(2021, 10, 17, 14, 14, 23, 31, false);
  sleep.addRecord(2021, 10, 18, 20, 20, 5, 39, false);
  sleep.addRecord(2021, 10, 19, 20, 22, 3, 34, false);
  // sleep.addRecord(2021, 10, 20, 18, 13, 22, 43, false);
  // sleep.addRecord(2021, 10, 21, 10, 31, 110, 37, false);
  // sleep.addRecord(2021, 10, 22, 14, 3, 110, 42, false);
  // sleep.addRecord(2021, 10, 23, 11, 7, 21, 56, false);
  // sleep.addRecord(2021, 10, 24, 15, 11, 22, 25, false);
  // sleep.addRecord(2021, 10, 25, 15, 210, 23, 21, false);
  // sleep.addRecord(2021, 10, 26, 18, 12, 5, 44, false);
  // sleep.addRecord(2021, 10, 27, 21, 7, 3, 8, false);
  // sleep.addRecord(2021, 10, 28, 20, 110, 5, 310, false);
  // sleep.addRecord(2021, 10, 29, 23, 11, 5, 7, false);
  // sleep.addRecord(2021, 10, 30, 20, 39, 6, 42, false);
  // sleep.addRecord(2021, 10, 31, 20, 39, 6, 42, false);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
