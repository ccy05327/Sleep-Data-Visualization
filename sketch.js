var sleep;

var CynthFont;
function preload(){
  CynthFont = loadFont("https://ccy05327.github.io/Sleep-Data-Visualization/Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*30);
  
  sleep.addRecord(2021, 6, 1, 14, 25, 0, 33, false);
  sleep.addRecord(2021, 6, 2, 14, 25, 22, 20, false);
  // sleep.addRecord(2021, 6, 2, 23, 30, 8, 0, false); //dummy
  sleep.addRecord(2021, 6, 3, 16, 5, 3, 22, false); 
  sleep.addRecord(2021, 6, 4, 17, 50, 2, 50, false); 
  sleep.addRecord(2021, 6, 5, 21, 7, 7, 34, false); 
  sleep.addRecord(2021, 6, 6, 22, 52, 8, 42, false); 
  sleep.addRecord(2021, 6, 7, false); 
  sleep.addRecord(2021, 6, 8, 1, 52, 9, 8, false); 
  sleep.addRecord(2021, 6, 9, 1, 58, 15, 29, false); 
  sleep.addRecord(2021, 6, 10, 9, 4, 16, 22, false); 
  sleep.addRecord(2021, 6, 11, 8, 56, 18, 53, false); 
  sleep.addRecord(2021, 6, 12, 12, 34, 19, 30, false); 
  sleep.addRecord(2021, 6, 13, 11, 50, 21, 55, false); 
  sleep.addRecord(2021, 6, 14, 13, 42, 22, 33, false); 
  sleep.addRecord(2021, 6, 15, 15, 15, 2, 2, false); 
  sleep.addRecord(2021, 6, 16, 16, 17, 1, 44, false); 
  sleep.addRecord(2021, 6, 17, 18, 40, 2, 48, false); 
  sleep.addRecord(2021, 6, 18, 20, 41, 7, 24, false); 
  sleep.addRecord(2021, 6, 19, 22, 30, 7, 52, false); 
  sleep.addRecord(2021, 6, 20, 23, 51, 8, 30, false); 
  sleep.addRecord(2021, 6, 21); 
  sleep.addRecord(2021, 6, 22, 1, 51, 12, 5, false); 
  sleep.addRecord(2021, 6, 23, 2, 9, 12, 59, false); 
  sleep.addRecord(2021, 6, 24, 6, 1, 17, 4, false); 
  sleep.addRecord(2021, 6, 25, 9, 0, 19, 8, false); 
  sleep.addRecord(2021, 6, 26, 8, 47, 18, 12, false); 
  sleep.addRecord(2021, 6, 27, 13, 0, 1, 40, false); 
  sleep.addRecord(2021, 6, 28, 14, 25, 23, 8, false); 
  // sleep.addRecord(2021, 6, 29, , false); 
  // sleep.addRecord(2021, 6, 30, , false); 


  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
