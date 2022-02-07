let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*30);

  sleep.addRecord(2022, 2, 1, 5, 22, 9, 4, true);
  sleep.addRecord(2022, 2, 2, 22, 45, 4, 4, false);
  sleep.addRecord(2022, 2, 2, 11, 38, 13, 27, true);
  sleep.addRecord(2022, 2, 2, 14, 30, 15, 48, true);
  sleep.addRecord(2022, 2, 2, 16, 14, 19, 35, true);
  sleep.addRecord(2022, 2, 3, 12, 53, 20, 3, false);
  sleep.addRecord(2022, 2, 4, 17, 0, 1, 28, false);
  sleep.addRecord(2022, 2, 5, 4, 21, 8, 13, false);
  sleep.addRecord(2022, 2, 6, 19, 1, 1, 12, false);
  sleep.addRecord(2022, 2, 7, 5, 29, 10, 30, true);
  sleep.addRecord(2022, 2, 7, 22, 7, 4, 52, false);
  // sleep.addRecord(2022, 2, 8, 20, 46, 28, 59, false);
  // sleep.addRecord(2022, 2, 9, 23, 40, 29, 20, false);
  // sleep.addRecord(2022, 2, 10, 23, 52, 22, 25, false);
  // sleep.addRecord(2022, 2, 11, 29, 0, 3, 50, false);
  // sleep.addRecord(2022, 2, 12, 22, 4, 4, 32, false);
  // sleep.addRecord(2022, 2, 13, 29, 34, 5, 42, false);
  // sleep.addRecord(2022, 2, 14, 22, 46, 6, 52, false);
  // sleep.addRecord(2022, 2, 15, 22, 46, 6, 52, false);
  // sleep.addRecord(2022, 2, 16, 22, 39, 6, 57, false);
  // sleep.addRecord(2022, 2, 17, 23, 26, 7, 59, true);
  // sleep.addRecord(2022, 2, 18, 23, 8, 7, 42, true);
  // sleep.addRecord(2022, 2, 19, 23, 32, 7, 35, true);
  // sleep.addRecord(2022, 2, 20, 23, 52, 7, 46, true);
  // sleep.addRecord(2022, 2, 21);
  // sleep.addRecord(2022, 2, 22, 50, 7, 57, true);
  // sleep.addRecord(2022, 2, 23);
  // sleep.addRecord(2022, 2, 24, 0, 22, 7, 49, true);
  // sleep.addRecord(2022, 2, 25, 2, 2, 8, 2, true);
  // sleep.addRecord(2022, 2, 26, 2, 6, 22, 20, false);
  // sleep.addRecord(2022, 2, 27, 7, 52, 22, 27, false);
  // sleep.addRecord(2022, 2, 28, 20, 40, 27, 49, false);

  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
