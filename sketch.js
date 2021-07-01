var sleep;

var CynthFont;
function preload(){
  CynthFont = loadFont("https://ccy05327.github.io/Sleep-Data-Visualization/Cynthfont-Regular.ttf");
}

function setup() {
  sleep = new Sleep();
  createCanvas(1040, 450 + 28*10);
  



  
  console.log(sleep);
}

function draw() {
  sleep.toDraw();
}
