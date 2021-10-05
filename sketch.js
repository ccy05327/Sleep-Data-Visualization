let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*10);

  sleep.addRecord(2021, 10, 1, 0, 0, 6, 42, false);
  sleep.addRecord(2021, 10, 2, 1, 45, 8, 5, true);
  sleep.addRecord(2021, 10, 3, 0, 0, 10, 49, false);
  sleep.addRecord(2021, 10, 4, 1, 34, 12, 13, false);
  sleep.addRecord(2021, 10, 5, 2, 29, 13, 14, false);
  // sleep.addRecord(2021, 10, 6, 16, 10, 20, 42, false);
  // sleep.addRecord(2021, 10, 7, 15, 22, 0, 48, false);
  // sleep.addRecord(2021, 10, 8, 16, 0, 0, 46, false);
  // sleep.addRecord(2021, 10, 9, 110, 2, 4, 27, false);
  // sleep.addRecord(2021, 10, 10, 20, 16, 4, 15, false);
  // sleep.addRecord(2021, 10, 11, 18, 50, 5, 4, false);
  // sleep.addRecord(2021, 10, 12, 21, 27, 6, 36, false);
  // sleep.addRecord(2021, 10, 13);
  // sleep.addRecord(2021, 10, 14, 1, 210, 10, 32, false);
  // sleep.addRecord(2021, 10, 15, 2, 27, 12, 58, false);
  // sleep.addRecord(2021, 10, 16, 4, 18, 12, 51, false);
  // sleep.addRecord(2021, 10, 17, 5, 5, 14, 41, false);
  // sleep.addRecord(2021, 10, 18, 6, 53, 18, 31, false);
  // sleep.addRecord(2021, 10, 19, 12, 1, 21, 110, false);
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
