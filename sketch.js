/* 
~ ~ Sleep Data Visualisation Tracker ~ ~
- Enter 'date', 'sleep time', 'sleep duration'
- grey: true -- if (sleep not at home) || (awake with alarm) || (anything not cause by my willingness) || (just forshadowing)
- clear all color (except grey) for a better look at the data if neccessary
*/

let record = [];

function setup() {
  // let canvasHeight = 375 + 28*record.length;
  let canvasHeight = 375 + 28*31;
  createCanvas(1050, canvasHeight);

  record.push(new Sleep('5/1', 11.76, 6.53, false));
  record.push(new Sleep('5/2', 16.7, 6.86, false));
  record.push(new Sleep('5/3', 15.28, 12.86, false));
  record.push(new Sleep('5/4', 20.7, 6.93, false));
  record.push(new Sleep('5/5', 19.26, 11.38, false));
  record.push(new Sleep('5/6', 23.63, 10.15, false));
  // record.push(new Sleep('5/7', 4.41, 6.58, true));
  // record.push(new Sleep('5/8', 4.03, 10.85, false));
  // record.push(new Sleep('5/9', 8.78, 9.5, false));
  // record.push(new Sleep('5/10', 11.43, 7.45, false));
  // record.push(new Sleep('5/11', 13.03, 9.33, false));
  // record.push(new Sleep('5/12', 14.75, 7.08, false));
  // record.push(new Sleep('5/13', 13, 3, true));
  // record.push(new Sleep('5/14', 0.03, 16.25, false));
  // record.push(new Sleep('5/15', 13.25, 10.58, false));
  // record.push(new Sleep('5/16', 17.66, 8.41, false));
  // record.push(new Sleep('5/17', 19.66, 1.66, true));
  // record.push(new Sleep('5/18', 5.36, 16.88, false));
  // record.push(new Sleep('5/19', 19.66, 10.86, false));
  // record.push(new Sleep('5/20', 20.4, 3.75, true));
  // record.push(new Sleep('5/21', 19.68, 11.63, false));
  // record.push(new Sleep('5/22'));
  // record.push(new Sleep('5/23', 1.06, 8.36, false));
  // record.push(new Sleep('5/24', 2, 9.55, false));
  // record.push(new Sleep('5/25', 2.93, 9.58, false));
  // record.push(new Sleep('5/26', 5.76, 10.3, false));
  // record.push(new Sleep('5/27', 7.38, 6.7, false));
  // record.push(new Sleep('5/28', 7, 8.25, false));
  // record.push(new Sleep('5/29', 10.83, 6.81, false));
  // record.push(new Sleep('5/30', 10.83, 7.5, false));
  // record.push(new Sleep('5/31', 10.83, 7.5, false));
}

let CynthFont;

function preload(){
  CynthFont = loadFont("Cynthfont-Regular.ttf");
}

const xpos = 70;
const ypos = 70;

function draw() {
  background(255);
  textAlign(CENTER);
  fill(0);
  strokeWeight(1);
  textSize(60);
  textFont(CynthFont);
  text("Sleep Data Visualization", width/2, 60);

  yAxes();
  xAxes();
  Vlines();
  // some additional text
  stroke(0);
  fill(0);
  circle(xpos, height - 250, 10);

  text('(24-hour time)', width - 90, height - 180);
  text("(date)", xpos-20, 80);
  text("0", xpos-20, height - 220, 10);

  // sleep();
  for (let i = 0; i < record.length; i++){
    if (record[i].grey == true){
      stroke(200);
    } else if (record[i].duration <= 6){
      stroke(240, 128, 128);  // coral
    } else if (record[i].duration >= 12){
      stroke(221, 160, 221);  // pink-ish purple
    } else {
      stroke(0, 206, 209);  // teal
    }
    strokeWeight(5);
    line(record[i].newSleepTime, 124+i*28, record[i].newAwake, 124+i*28);
    if (record[i].nextDay){
      let newNextDay = map(record[i].nextDay, 0, 24, xpos, 980);
      line(xpos+2, 126+(i+1)*28, newNextDay, 126+(i+1)*28);
    }
  }
  date();
  printData();
}

function yAxes(){
  stroke(200);
  strokeWeight(5);  
  line(ypos, 100, ypos, height - 190);
  textSize(12);
  fill(200);
  strokeWeight(0.5);
  for (let i = 0; i < record.length; i++){
    textAlign(CENTER);
    textFont('Font Style Normal');
    text("—", ypos, 129 + i*28);
  }
  triangle(ypos, 90, ypos-10, 105, ypos+10, 105);
}

function xAxes(){
  stroke(200);
  strokeWeight(5);
  line(10, height - 250, width - 10, height - 250);
  textSize(20);
  strokeWeight(0.5);
  fill(200);
  let n = 1;
  for (let i = 0; i < 24; i++){
    textFont('Font Style Normal');
    textSize(20);
    text("|", 108 + i*38, height - 245);
    textAlign(CENTER);
    textFont(CynthFont);
    textSize(32);
    text(n, 108 + i*38, height - 210);
    n += 1;
  }  
  triangle(width, height - 250, width - 15, height - 240, width - 15, height - 260);
}

function Vlines(){
  stroke(200);
  strokeWeight(0.5);
  for (let i = 0; i < 12; i++){
      line(146 + i*76, 110, 146 + i*76, height - 250);
  }
}

function date(){
  for (let i = 0; i < record.length; i++){
    textAlign(CENTER);
    textFont(CynthFont);
    fill(180);
    noStroke();
    textSize(28);
    strokeWeight(.1);
    text(record[i].date, xpos-35, 135 + i*28);
  }
}

function Sleep(date, sleepTime, duration, grey){
  this.date = date;
  this.sleepTime = sleepTime;
  this.duration = duration;
  this.grey = grey;
  if (this.duration !== 0){
    this.awake = this.sleepTime + this.duration;
    this.newSleepTime = round(map(this.sleepTime, 0, 24, xpos+2, 980), 2);
    this.nextDay = 0;
    if (this.awake > 24){
      this.nextDay = round(this.awake - 24, 2);
      this.awake = 24;
    }
    this.newAwake = round(map(this.awake, 0, 24, xpos, 980), 2);
  }
}

function printData(){
  stroke(0);
  fill(0);
  textSize(36);
  // some data summary
  let totalDur = 0;
  let totalSleep = 0;
  let totalDay = 0;
  for(let i = 0; i < record.length; i++){
    if (record[i].duration){
      totalDur += record[i].duration;
      totalSleep += 1;
      totalDur = round(totalDur, 2);
    }
    if (record[i].duration !== 0){
      totalDay += 1;
    }
  }
  let hourDay = 24;
  hourDay = round(totalDay/totalSleep*24, 2);
  let sleepPercent = 0;
  sleepPercent = round((totalDur)/(totalDay*24)*100, 2);
  textAlign(LEFT);
  text(`Total: ${totalDur} hours of sleep, throughout ${totalDay} days, ${totalSleep} sleeps, ${sleepPercent}% of the time`, 20, height - 135); 
  text(`Average sleep: ${round(totalDur / totalDay, 2)} hours, average hour-day: ${hourDay} hours`, 20, height - 100);
}
