let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*30);

  sleep.addRecord(2021, 12, 1, 0, 12, 10, 20, false);
  sleep.addRecord(2021, 12, 2, 2, 12, 13, 26, false);
  sleep.addRecord(2021, 12, 3, 1, 47, 9, 5, true);
  sleep.addRecord(2021, 12, 4, 0, 36, 12, 12, false);
  sleep.addRecord(2021, 12, 5, 5, 17, 16, 25, false);
  sleep.addRecord(2021, 12, 6, 7, 15, 14, 27, false);
  sleep.addRecord(2021, 12, 7, 7, 34, 18, 19, false);
  sleep.addRecord(2021, 12, 8, 10, 20, 19, 5, false);
  sleep.addRecord(2021, 12, 9, 13, 57, 21, 38, false);
  sleep.addRecord(2021, 12, 10, 15, 39, 22, 0, true);
  sleep.addRecord(2021, 12, 11, 0, 34, 4, 36, true);
  sleep.addRecord(2021, 12, 11, 20, 0, 3, 55, false);
  sleep.addRecord(2021, 12, 12, 22, 4, 4, 5, false);
  sleep.addRecord(2021, 12, 13, 20, 18, 7, 16, false);
  sleep.addRecord(2021, 12, 14, 22, 40, 3, 27, false);
  sleep.addRecord(2021, 12, 15, 22, 11, 8, 2, true);
  sleep.addRecord(2021, 12, 16, 22, 7, 5, 37, false);
  sleep.addRecord(2021, 12, 17, 23, 29, 7, 28, true);
  sleep.addRecord(2021, 12, 18, 20, 54, 8, 37, false);
  sleep.addRecord(2021, 12, 19, 22, 50, 8, 5, true);
  sleep.addRecord(2021, 12, 20, 23, 30, 8, 3, true);
  sleep.addRecord(2021, 12, 21);
  sleep.addRecord(2021, 12, 22, 0, 41, 7, 1, true);
  sleep.addRecord(2021, 12, 23, 0, 16, 7, 40, true);
  sleep.addRecord(2021, 12, 23, 23, 13, 6, 59, true);
  sleep.addRecord(2021, 12, 24);
  sleep.addRecord(2021, 12, 25, 0, 40, 7, 45, true);
  sleep.addRecord(2021, 12, 26, 0, 45, 9, 22, false);
  sleep.addRecord(2021, 12, 27, 2, 49, 7, 26, true);
  // sleep.addRecord(2021, 12, 28, 21, 44, 6, 49, false);
  // sleep.addRecord(2021, 12, 29, 23, 1, 7, 56, true);
  // sleep.addRecord(2021, 12, 30);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
