var sleep;

var CynthFont;
function preload(){
  CynthFont = loadFont("https://ccy05327.github.io/Sleep-Data-Visualization/Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*5);
  
  sleep.addRecord(2021, 6, 1, 14, 25, 0, 33, false);
  sleep.addRecord(2021, 6, 2, 14, 25, 22, 20, false);
  // sleep.addRecord(2021, 6, 2, 23, 30, 8, 0, false); //dummy
  sleep.addRecord(2021, 6, 3, 16, 5, 3, 22, false); 
  sleep.addRecord(2021, 6, 4, 17, 50, 2, 50, false); 
  sleep.addRecord(2021, 6, 5, 21, 7, 7, 34, false); 
  sleep.addRecord(2021, 6, 6, 22, 52, 8, 42, false); 
  sleep.addRecord(2021, 6, 7, false); 
  sleep.addRecord(2021, 6, 8, 1, 52, 9, 8, false); 


  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
