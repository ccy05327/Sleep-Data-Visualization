let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*30);

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
  sleep.addRecord(2021, 10, 20, 16, 44, 18, 53, true);
  sleep.addRecord(2021, 10, 21, 0, 9, 8, 54, false);
  sleep.addRecord(2021, 10, 21, 22, 35, 8, 15, false);
  sleep.addRecord(2021, 10, 22, 22, 12, 6, 58, false);
  sleep.addRecord(2021, 10, 23, 23, 20, 8, 37, false);
  sleep.addRecord(2021, 10, 24, 23, 7, 6, 58, false);
  sleep.addRecord(2021, 10, 25);
  sleep.addRecord(2021, 10, 26, 0, 8, 10, 31, false);
  sleep.addRecord(2021, 10, 26, 23, 9, 10, 28, false);
  sleep.addRecord(2021, 10, 27);
  sleep.addRecord(2021, 10, 28, 2, 0, 7, 9, true);
  sleep.addRecord(2021, 10, 28, 9, 4, 12, 17, true);
  sleep.addRecord(2021, 10, 29, 4, 5, 14, 8, false);
  sleep.addRecord(2021, 10, 30, 7, 3, 14, 59, false);
  // sleep.addRecord(2021, 10, 31, 20, 39, 6, 42, false);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
