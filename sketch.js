let sleep;

let CynthFont;
function preload(){
  CynthFont = loadFont("CynthFont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*30);
  
  sleep.addRecord(2021, 6, 1, 14, 25, 0, 33, false);
  sleep.addRecord(2021, 6, 2, 14, 25, 22, 20, false);
  
  console.log(sleep);
}

function draw() {
  background(255);
  sleep.toDraw();
}
