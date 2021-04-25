/* 
~ ~ Sleep Data Visualisation Tracker ~ ~
- Enter 'date', 'sleep time', 'sleep duration'
- grey: true -- if (sleep not at home) || (awake with alarm) || (anything not cause by my willingness) || (just forshadowing)
- clear all color (except grey) for a better look at the data if neccessary
*/

let record = [];

function setup() {
  // let canvasHeight = 375 + 28*record.length;
  let canvasHeight = 375 + 28*130;
  createCanvas(1050, canvasHeight);
  record.push(new Sleep('12/20', 1.2, 12.3, false)), 
  record.push(new Sleep('12/21', 4.3, 14, false)), 
  record.push(new Sleep('12/22', 4.75, 14, false)), 
  record.push(new Sleep('12/23', 13, 8.6, false)), 
  record.push(new Sleep('12/24', 13.2, 9, false)), 
  record.push(new Sleep('12/25', 13.35, 13, false)), 
  record.push(new Sleep('12/26', 18.75, 11.35, false)), 
  record.push(new Sleep('12/27', 20.35, 9.15, false)), 
  record.push(new Sleep('12/28', 19.5, 11.3, false)), 
  record.push(new Sleep('12/29', 22, 9.6, false)), 
  record.push(new Sleep('12/30', 22.6, 9.6, false)), 
  record.push(new Sleep('12/31')), 
  
  record.push(new Sleep('1/1', 1.5, 11.3, false)),
  record.push(new Sleep('1/2', 2.15, 12.1, false)),
  record.push(new Sleep('1/3', 5.35, 9.8, false)),
  record.push(new Sleep('1/4', 7.5, 10.5, false)),
  record.push(new Sleep('1/5', 8.5, 10.8, false)),
  record.push(new Sleep('1/6', 12.25, 12.25, false)),
  record.push(new Sleep('1/7', 17, 9.5, false)),
  record.push(new Sleep('1/8', 16.5, 8.5, false)),
  record.push(new Sleep('1/9', 18.2, 10.2, false)),
  record.push(new Sleep('1/10', 19.85, 10, false)),
  record.push(new Sleep('1/11', 23.65, 11.5, false)),
  record.push(new Sleep('1/12')), // 12 days
  record.push(new Sleep('1/13', 1.35, 11.85, false)),
  record.push(new Sleep('1/14', 1.7, 10.6, false)),
  record.push(new Sleep('1/15', 3.1, 11.15, false)),
  record.push(new Sleep('1/16', 5.5, 13, false)),
  record.push(new Sleep('1/17', 12.55, 11.85, false)),
  record.push(new Sleep('1/18', 16.75, 7.5, false)),
  record.push(new Sleep('1/19', 16.75, 14, false)),
  record.push(new Sleep('1/20')), // 8 days
  record.push(new Sleep('1/21', 2, 17, false)),
  record.push(new Sleep('1/22', 16.85, 13, false)),
  record.push(new Sleep('1/23', 22.2, 10.25, false)),
  record.push(new Sleep('1/24', 23.5, 9.5, false)),
  record.push(new Sleep('1/25')), // 5 days
  record.push(new Sleep('1/26', 1.6, 11, false)),
  record.push(new Sleep('1/27', 2, 10, false)),
  record.push(new Sleep('1/28', 3, 11, false)),
  record.push(new Sleep('1/29', 4.05, 11.5, false)),
  record.push(new Sleep('1/30', 6.5, 8.4, false)),
  record.push(new Sleep('1/31', 4.6, 11.3, false)),

  record.push(new Sleep('2/1', 7.4, 10.75, false)),
  record.push(new Sleep('2/2', 13.55, 9.45, false)),
  record.push(new Sleep('2/3', 14.9, 12.3, false)),
  record.push(new Sleep('2/4', 17.65, 5.3, false)),
  record.push(new Sleep('2/5', 20.55, 11.9, false)),
  record.push(new Sleep('2/6', 20.3, 6.95, false)),
  record.push(new Sleep('2/7', 18.65, 11.7, false)),
  record.push(new Sleep('2/8', 22.85, 7.75, false)),
  record.push(new Sleep('2/9')), // 15 days
  record.push(new Sleep('2/10', 2, 6, true)),
  record.push(new Sleep('2/11', 0, 7.4, true)),
  record.push(new Sleep('2/12', 0.9, 8, true)),
  record.push(new Sleep('2/13', 1.8, 7.1, true)),
  record.push(new Sleep('2/14', 1.1, 9.3, true)),
  record.push(new Sleep('2/15', 3.3, 8.1, false)),
  record.push(new Sleep('2/16', 4.35, 8.25, false)),
  record.push(new Sleep('2/17', 3.6, 11.25, false)),
  record.push(new Sleep('2/18', 10.65, 11.6, false)),
  record.push(new Sleep('2/19')),
  record.push(new Sleep('2/20', 0.73, 14.95, false)),
  record.push(new Sleep('2/21', 9.65, 11.7, false)),
  record.push(new Sleep('2/22', 15.05, 10.6, false)),
  record.push(new Sleep('2/23', 15.55, 4.2, false)),
  record.push(new Sleep('2/24', 13.55, 12.65, false)),
  record.push(new Sleep('2/25', 17.2, 10.8, true)),
  record.push(new Sleep('2/26', 23.35, 9.55, false)),
  record.push(new Sleep('2/27')),
  record.push(new Sleep('2/28', 2.9, 12.8, false)),

  record.push(new Sleep('3/1', 1.9, 6.15, false));
  record.push(new Sleep('3/2', 0.15, 12.2, false));
  record.push(new Sleep('3/3', 2.75, 7.65, false));
  record.push(new Sleep('3/4', 3.55, 8.1, false));
  record.push(new Sleep('3/5', 7.15, 12.55, false));
  record.push(new Sleep('3/6', 13.15, 8.8, false));
  record.push(new Sleep('3/7', 13.5, 7.9, false));
  record.push(new Sleep('3/8', 14, 9.5, false));
  record.push(new Sleep('3/9', 16.3, 11.9, false));
  record.push(new Sleep('3/10', 20, 8.15, false));
  record.push(new Sleep('3/11', 21.5, 11.15, false));
  record.push(new Sleep('3/12'));
  record.push(new Sleep('3/13', 0.7, 14.1, false));
  record.push(new Sleep('3/14', 6.5, 5, false));
  record.push(new Sleep('3/15', 0.35, 14.25, false));
  record.push(new Sleep('3/16', 6.8, 8.15, false));
  record.push(new Sleep('3/17', 6, 10.7, false));
  record.push(new Sleep('3/18', 10.5, 4.25, false));
  record.push(new Sleep('3/19', 7.55, 11.15, false));
  record.push(new Sleep('3/20', 16, 12.7, false));
  record.push(new Sleep('3/21'));
  record.push(new Sleep('3/22', 2.6, 15.45, false));
  record.push(new Sleep('3/23', 18.15, 13.95, false));
  record.push(new Sleep('3/24'));
  record.push(new Sleep('3/25', 17.2, 10.8, true));
  record.push(new Sleep('3/26', 23.1, 9.35, true));
  record.push(new Sleep('3/27'));
  record.push(new Sleep('3/28', 0.75, 7.75, true));
  record.push(new Sleep('3/29', 0, 6.3, true));
  record.push(new Sleep('3/30', 0.05, 8.2, true));
  record.push(new Sleep('3/31', 2.85, 10.55, false));

  record.push(new Sleep('4/1', 3.25, 7.6, false));
  record.push(new Sleep('4/2', 2.98, 9.26, false));
  record.push(new Sleep('4/3', 2.6, 8.66, false));
  record.push(new Sleep('4/4', 2.5, 9.1, false));
  record.push(new Sleep('4/5', 3.15, 8.96, false));
  record.push(new Sleep('4/6', 5.15, 6.35, true));
  record.push(new Sleep('4/7', 4.41, 6.58, true));
  record.push(new Sleep('4/8', 4.03, 10.85, false));
  record.push(new Sleep('4/9', 8.78, 9.5, false));
  record.push(new Sleep('4/10', 11.43, 7.45, false));
  record.push(new Sleep('4/11', 13.03, 9.33, false));
  record.push(new Sleep('4/12', 14.75, 7.08, false));
  record.push(new Sleep('4/13', 13, 3, true));
  record.push(new Sleep('4/14', 0.03, 16.25, false));
  record.push(new Sleep('4/15', 13.25, 10.58, false));
  record.push(new Sleep('4/16', 17.66, 8.41, false));
  record.push(new Sleep('4/17', 19.66, 1.66, true));
  record.push(new Sleep('4/18', 5.36, 16.88, false));
  record.push(new Sleep('4/19', 19.66, 10.86, false));
  record.push(new Sleep('4/20', 20.4, 3.75, true));
  record.push(new Sleep('4/21', 19.68, 11.63, false));
  record.push(new Sleep('4/22'));
  record.push(new Sleep('4/23', 1.06, 8.36, false));
  record.push(new Sleep('4/24', 2, 9.55, false));
  record.push(new Sleep('4/25', 2.93, 9.58, false));
//   record.push(new Sleep('4/26', 5, 9, false));
//   record.push(new Sleep('4/27', 8, 9, false));
//   record.push(new Sleep('4/28', 11, 9, false));
//   record.push(new Sleep('4/29', 14, 9, false));
//   record.push(new Sleep('4/30', 17, 9, false));
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
