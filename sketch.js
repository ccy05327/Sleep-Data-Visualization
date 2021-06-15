var sleep;

var CynthFont;
function preload(){
  CynthFont = loadFont("https://ccy05327.github.io/Sleep-Data-Visualization/Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*15);
  
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


  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
