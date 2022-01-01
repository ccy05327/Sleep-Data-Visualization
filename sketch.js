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
  // sleep.addRecord(2022, 1, 2, 2, 1, 13, 26, false);
  // sleep.addRecord(2022, 1, 3, 1, 47, 9, 5, true);
  // sleep.addRecord(2022, 1, 4, 0, 36, 1, 1, false);
  // sleep.addRecord(2022, 1, 5, 5, 17, 16, 25, false);
  // sleep.addRecord(2022, 1, 6, 7, 15, 14, 27, false);
  // sleep.addRecord(2022, 1, 7, 7, 34, 18, 19, false);
  // sleep.addRecord(2022, 1, 8, 10, 20, 19, 5, false);
  // sleep.addRecord(2022, 1, 9, 13, 57, 21, 38, false);
  // sleep.addRecord(2022, 1, 10, 15, 39, 22, 0, true);
  // sleep.addRecord(2022, 1, 11, 0, 34, 4, 36, true);
  // sleep.addRecord(2022, 1, 11, 20, 0, 3, 55, false);
  // sleep.addRecord(2022, 1, 1, 22, 4, 4, 5, false);
  // sleep.addRecord(2022, 1, 13, 20, 18, 7, 16, false);
  // sleep.addRecord(2022, 1, 14, 22, 40, 3, 27, false);
  // sleep.addRecord(2022, 1, 15, 22, 11, 8, 2, true);
  // sleep.addRecord(2022, 1, 16, 22, 7, 5, 37, false);
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
