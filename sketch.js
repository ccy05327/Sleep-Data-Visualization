let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*30);

  sleep.addRecord(2021, 11, 1, 8, 54, 18, 11, false);
  sleep.addRecord(2021, 11, 2, 13, 18, 20, 28, false);
  sleep.addRecord(2021, 11, 3, 11, 9, 20, 4, false);
  sleep.addRecord(2021, 11, 4, 13, 2, 22, 50, false);
  sleep.addRecord(2021, 11, 5, 13, 46, 0, 24, false);
  sleep.addRecord(2021, 11, 6, 18, 26, 2, 29, false);
  sleep.addRecord(2021, 11, 7, 20, 5, 4, 33, false);
  sleep.addRecord(2021, 11, 8, 20, 12, 2, 2, false);
  sleep.addRecord(2021, 11, 9, 19, 46, 4, 32, false);
  sleep.addRecord(2021, 11, 10, 21, 45, 5, 32, false);
  sleep.addRecord(2021, 11, 11, 22, 27, 7, 35, false);
  sleep.addRecord(2021, 11, 12);
  sleep.addRecord(2021, 11, 13, 0, 57, 10, 1, false);
  sleep.addRecord(2021, 11, 14, 3, 46, 13, 15, false);
  sleep.addRecord(2021, 11, 15, 4, 47, 12, 9, false);
  sleep.addRecord(2021, 11, 16, 6, 22, 16, 47, false);
  sleep.addRecord(2021, 11, 17, 8, 26, 16, 3, false);
  sleep.addRecord(2021, 11, 18, 9, 51, 17, 45, false);
  sleep.addRecord(2021, 11, 19, 10, 33, 17, 57, false);
  sleep.addRecord(2021, 11, 20, 9, 5, 18, 28, false);
  sleep.addRecord(2021, 11, 21, 12, 59, 22, 5, false);
  sleep.addRecord(2021, 11, 22, 13, 26, 0, 15, false);
  sleep.addRecord(2021, 11, 23, 20, 36, 3, 59, false);
  // sleep.addRecord(2021, 11, 24, 23, 7, 6, 58, false);
  // sleep.addRecord(2021, 11, 25);
  // sleep.addRecord(2021, 11, 26, 0, 8, 11, 31, false);
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
