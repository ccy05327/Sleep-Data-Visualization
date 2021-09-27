let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*30);

  sleep.addRecord(2021, 9, 1, 10, 49, 22, 2, false);
  sleep.addRecord(2021, 9, 2, 12, 23, 20, 40, false);
  sleep.addRecord(2021, 9, 3, 10, 38, 19, 12, false);
  sleep.addRecord(2021, 9, 4, 10, 55, 22, 33, false);
  sleep.addRecord(2021, 9, 5, 13, 41, 23, 37, false);
  sleep.addRecord(2021, 9, 6, 16, 9, 20, 42, false);
  sleep.addRecord(2021, 9, 7, 15, 22, 0, 48, false);
  sleep.addRecord(2021, 9, 8, 16, 0, 0, 46, false);
  sleep.addRecord(2021, 9, 9, 19, 2, 4, 27, false);
  sleep.addRecord(2021, 9, 10, 20, 16, 4, 15, false);
  sleep.addRecord(2021, 9, 11, 18, 50, 5, 4, false);
  sleep.addRecord(2021, 9, 12, 21, 27, 6, 36, false);
  sleep.addRecord(2021, 9, 13);
  sleep.addRecord(2021, 9, 14, 1, 29, 9, 32, false);
  sleep.addRecord(2021, 9, 15, 2, 27, 12, 58, false);
  sleep.addRecord(2021, 9, 16, 4, 18, 12, 51, false);
  sleep.addRecord(2021, 9, 17, 5, 5, 14, 41, false);
  sleep.addRecord(2021, 9, 18, 6, 53, 18, 31, false);
  sleep.addRecord(2021, 9, 19, 12, 1, 21, 19, false);
  sleep.addRecord(2021, 9, 20, 18, 13, 22, 43, false);
  sleep.addRecord(2021, 9, 21, 9, 31, 19, 37, false);
  sleep.addRecord(2021, 9, 22, 14, 3, 19, 42, false);
  sleep.addRecord(2021, 9, 23, 11, 7, 21, 56, false);
  sleep.addRecord(2021, 9, 24, 15, 11, 22, 25, false);
  sleep.addRecord(2021, 9, 25, 15, 29, 23, 21, false);
  sleep.addRecord(2021, 9, 26, 18, 12, 5, 44, false);
  sleep.addRecord(2021, 9, 27, 21, 7, 3, 8, false);
  // sleep.addRecord(2021, 9, 29, 0, 45, 13, 51, false);
  // sleep.addRecord(2021, 9, 29, 9, 1, 14, 32, false);
  // sleep.addRecord(2021, 9, 30, 7, 17, 12, 19, false);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
