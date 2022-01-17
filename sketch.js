let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*31);

  sleep.addRecord(2022, 1, 1, 3, 39, 7, 55, true);
  sleep.addRecord(2022, 1, 1, 9, 39, 11, 50, true);
  sleep.addRecord(2022, 1, 2, 1, 33, 11, 45, true);
  sleep.addRecord(2022, 1, 3, 4, 22, 11, 45, true);
  sleep.addRecord(2022, 1, 4, 4, 13, 14, 17, false);
  sleep.addRecord(2022, 1, 5, 9, 39, 17, 5, false);
  sleep.addRecord(2022, 1, 6, 8, 37, 15, 45, false);
  sleep.addRecord(2022, 1, 7, 10, 48, 18, 59, false);
  sleep.addRecord(2022, 1, 8, 10, 46, 18, 59, false);
  sleep.addRecord(2022, 1, 9, 13, 40, 19, 20, false);
  sleep.addRecord(2022, 1, 10, 13, 52, 22, 25, false);
  sleep.addRecord(2022, 1, 11, 19, 0, 3, 50, false);
  sleep.addRecord(2022, 1, 12, 22, 4, 4, 32, false);
  sleep.addRecord(2022, 1, 13, 19, 34, 5, 42, false);
  sleep.addRecord(2022, 1, 14, 22, 46, 6, 52, false);
  sleep.addRecord(2022, 1, 15, 22, 46, 6, 52, false);
  sleep.addRecord(2022, 1, 16, 22, 39, 6, 57, false);
  // sleep.addRecord(2022, 1, 17, 23, 29, 7, 28, true);
  // sleep.addRecord(2022, 1, 18, 20, 54, 8, 37, false);
  // sleep.addRecord(2022, 1, 19, 22, 50, 8, 5, true);
  // sleep.addRecord(2022, 1, 20, 23, 30, 8, 3, true);
  // sleep.addRecord(2022, 1, 21);
  // sleep.addRecord(2022, 1, 22, 0, 41, 7, 1, true);
  // sleep.addRecord(2022, 1, 23, 0, 16, 7, 40, true);
  // sleep.addRecord(2022, 1, 23, 23, 13, 6, 59, true);
  // sleep.addRecord(2022, 1, 24);
  // sleep.addRecord(2022, 1, 25, 0, 40, 7, 45, true);
  // sleep.addRecord(2022, 1, 26, 0, 45, 9, 22, false);
  // sleep.addRecord(2022, 1, 27, 2, 49, 7, 26, true);
  // sleep.addRecord(2022, 1, 27, 23, 20, 9, 29, false);
  // sleep.addRecord(2022, 1, 28);
  // sleep.addRecord(2022, 1, 29, 2, 53, 8, 0, true);
  // sleep.addRecord(2022, 1, 30, 2, 47, 7, 30, true);
  // sleep.addRecord(2022, 1, 31, 3, 28, 11, 3, true);
  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
