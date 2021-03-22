/* 
~ ~ Sleep Data Visualisation Tracker ~ ~
- Enter 'date', 'sleep time', 'sleep duration'
- grey: true -- if (sleep not at home) || (awake with alarm) || (anything not cause by my willingness) || (just forshadowing)
- clear all color (except grey) for a better look at the data if neccessary
*/

let record = [
  // {date: '12/20', sleepTime: 1.2, duration: 12.3, grey: false}, {date: '12/21', sleepTime: 4.3, duration: 11.85, grey: false}, {date: '12/22', sleepTime: 4.75, duration: 14, grey: false}, {date: '12/23', sleepTime: 13, duration: 8.6, grey: false}, {date: '12/24', sleepTime: 13.2, duration: 9, grey: false}, {date: '12/25', sleepTime: 13.35, duration: 13, grey: false}, {date: '12/26', sleepTime: 18.75, duration: 11.35, grey: false}, {date: '12/27', sleepTime: 20.35, duration: 9.15, grey: false}, {date: '12/28', sleepTime: 19.5, duration: 11.3, grey: false}, {date: '12/29', sleepTime: 22, duration: 9.6, grey: false}, {date: '12/30', sleepTime: 22.6, duration: 9.6, grey: false}, {date: '12/31'},
  // {date: '1/1', sleepTime: 1.5, duration: 11.3, grey: false}, {date: '1/2', sleepTime: 2.15, duration: 12.1, grey: false}, {date: '1/3', sleepTime: 5.35, duration: 9.8, grey: false}, {date: '1/4', sleepTime: 7.5, duration: 10.5, grey: false}, {date: '1/5', sleepTime: 8.5, duration: 10.8, grey: false}, {date: '1/6', sleepTime: 12.25, duration: 12.25, grey: false}, {date: '1/7', sleepTime: 17, duration: 9.5, grey: false}, {date: '1/8', sleepTime: 16.5, duration: 8.5, grey: false}, {date: '1/9', sleepTime: 18.2, duration: 10.2, grey: false}, {date: '1/10', sleepTime: 19.85, duration: 10, grey: false}, {date: '1/11', sleepTime: 23.65, duration: 11.5, grey: false}, {date: '1/12'}, // 12 days
  // {date: '1/13', sleepTime: 1.35, duration: 11.85, grey: false}, {date: '1/14', sleepTime: 1.7, duration: 10.6, grey: false}, {date: '1/15', sleepTime: 3.1, duration: 11.15, grey: false}, {date: '1/16', sleepTime: 5.5, duration: 13, grey: false},  {date: '1/17', sleepTime: 12.55, duration: 11.85, grey: false}, {date: '1/18', sleepTime: 16.75, duration: 7.5, grey: false}, {date: '1/19', sleepTime: 16.75, duration: 14, grey: false}, {date: '1/20'}, 8 days {date: '1/21', sleepTime: 2, duration: 17, grey: false}, {date: '1/22', sleepTime: 16.85, duration: 13, grey: false}, {date: '1/23', sleepTime: 22.2, duration: 10.25, grey: false}, {date: '1/24', sleepTime: 23.5, duration: 9.5, grey: false},
  // {date: '1/25'}, 5 days {date: '1/26', sleepTime: 1.6, duration: 11, grey: false}, {date: '1/27', sleepTime: 2, duration: 10, grey: false}, {date: '1/28', sleepTime: 3, duration: 11, grey: false}, {date: '1/29', sleepTime: 4.05, duration: 11.5, grey: false}, {date: '1/30', sleepTime: 6.5, duration: 8.4, grey: false}, {date: '1/31', sleepTime: 4.6, duration: 11.3, grey: false},  
  // {date: '2/1', sleepTime: 7.4, duration: 10.75, grey: false}, {date: '2/2', sleepTime: 13.55, duration: 9.45, grey: false}, {date: '2/3', sleepTime: 14.9, duration: 12.3, grey: false}, {date: '2/4', sleepTime: 17.65, duration: 5.3, grey: false}, {date: '2/5', sleepTime: 20.55, duration: 11.9, grey: false}, {date: '2/6', sleepTime: 20.3, duration: 6.95, grey: false}, {date: '2/7', sleepTime: 18.65, duration: 11.7, grey: false}, {date: '2/8', sleepTime: 22.85, duration: 7.75, grey: false}, {date: '2/9'}, 15 days {date: '2/10', sleepTime: 2, duration: 6, grey: true}, {date: '2/11', sleepTime: 0, duration: 7.4, grey: true}, {date: '2/12', sleepTime: 0.9, duration: 8, grey: true}, {date: '2/13', sleepTime: 1.8, duration: 7.1, grey: true},
  // {date: '2/14', sleepTime: 1.1, duration: 9.3, grey: true}, {date: '2/15', sleepTime: 3.3, duration: 8.1, grey: false}, {date: '2/16', sleepTime: 4.35, duration: 8.25, grey: false}, {date: '2/17', sleepTime: 3.6, duration: 11.25, grey: false}, {date: '2/18', sleepTime: 10.65, duration: 11.6, grey: false}, {date: '2/19'}, {date: '2/20', sleepTime: 0.73, duration: 14.95, grey: false}, {date: '2/21', sleepTime: 9.65, duration: 11.7, grey: false}, {date: '2/22', sleepTime: 15.05, duration: 10.6, grey: false}, {date: '2/23', sleepTime: 15.55, duration: 4.2, grey: false}, {date: '2/24', sleepTime: 13.55, duration: 12.65, grey: false}, {date: '2/25', sleepTime: 21.5, duration: 9.4, grey: false},
  /*{date: '2/26', sleepTime: 23.35, duration: 9.55, grey: false}, {date: '2/27'}, {date: '2/28', sleepTime: 2.9, duration: 12.8, grey: false}, 
  {date: '3/1', sleepTime: 1.9, duration: 6.15, grey: false}, {date: '3/2', sleepTime: 0.15, duration: 12.2, grey: false}, {date: '3/3', sleepTime: 2.75, duration: 7.65, grey: false}, {date: '3/4', sleepTime: 3.55, duration: 8.1, grey: false}, {date: '3/5', sleepTime: 7.15, duration: 12.55, grey: false}, {date: '3/6', sleepTime: 13.15, duration: 8.8, grey: false}, {date: '3/7', sleepTime: 13.5, duration: 7.9, grey: false}, {date: '3/8', sleepTime: 14, duration: 9.5, grey: false}, {date: '3/9', sleepTime: 16.3, duration: 11.9, grey: false},
  {date: '3/10', sleepTime: 20, duration: 8.15, grey: false}, {date: '3/11', sleepTime: 21.5, duration: 11.15, grey: false}, {date: '3/12'}, {date: '3/13', sleepTime: 0.7, duration: 14.1, grey: false}, {date: '3/14', sleepTime: 6.5, duration: 5, grey: false}, {date: '3/15', sleepTime: 0.35, duration: 14.25, grey: false}, {date: '3/16', sleepTime: 6.8, duration: 8.15, grey: false}, 
  /* {date: '3/17', sleepTime: 14, duration: 9, grey: false}, {date: '3/18', sleepTime: 17, duration: 9, grey: false}, {date: '3/19', sleepTime: 20, duration: 9, grey: false}, {date: '3/20'}, {date: '3/21', sleepTime: 0, duration: 9, grey: false}, {date: '3/22', sleepTime: 3, duration: 9, grey: false}, {date: '3/23', sleepTime: 6, duration: 9, grey: false}, {date: '3/24', sleepTime: 9, duration: 9, grey: false}, {date: '3/25', sleepTime: 12, duration: 9, grey: false},
  {date: '3/26', sleepTime: 15, duration: 9, grey: false}, {date: '3/27', sleepTime: 18, duration: 9, grey: false}, {date: '3/28', sleepTime: 21, duration: 9, grey: false}, {date: '3/29'}, {date: '3/30', sleepTime: 0, duration: 9, grey: false}, {date: '3/31', sleepTime: 3, duration: 9, grey: false},
  */
  /* ENTER DATA HERE */ 
];

function setup() {
  // let canvasHeight = 375 + 28*record.length;
  let canvasHeight = 375 + 28*30;
  createCanvas(1050, canvasHeight);

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
  record.push(new Sleep('3/23', 11, 9, false));
  // record.push(new Sleep('3/24', 14, 9, false));
  // record.push(new Sleep('3/25', 17, 9, false));
  // record.push(new Sleep('3/26', 20, 9, false));
  // record.push(new Sleep('3/27', 23, 9, false));
  // record.push(new Sleep('3/28', 23, 9, true));
  // record.push(new Sleep('3/29', 23, 9, true));
  // record.push(new Sleep('3/30', 23, 8, true));
  // record.push(new Sleep('3/31', 23, 8, true));
  // record.push(new Sleep('4/1', 23, 8, true));
  // record.push(new Sleep('4/2', 23, 8, true));
  // record.push(new Sleep('4/3', 23, 8, true));
  // record.push(new Sleep('4/4', 23, 8, true));
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


  // for (let i = 0; i < record.length; i++){
  //   if (record[i].duration !== 0){
  //     let awake = record[i].sleepTime + record[i].duration;
  //     let newSleepTime = round(map(record[i].sleepTime, 0, 24, xpos+2, 980), 2);
  //     // console.log(`sleepTime: ${record[i].sleepTime}, newSleep: ${newSleepTime}`);
  //     let nextDay = 0;
  //     if (awake > 24){
  //       nextDay = round(awake - 24, 2);
  //       awake = 24;
  //     }
  //     let newAwake = round(map(awake, 0, 24, xpos, 980), 2);  // map after the possibility of a different awake
  //     // console.log(`awake: ${awake}, newAwake: ${newAwake}`);
      
  //     // color by sort
  //     if (record[i].grey == true){
  //       stroke(200);
  //     } else if(record[i].duration <= 6){
  //       stroke(240, 128, 128);  // coral
  //     } else if(record[i].duration >= 12){
  //       stroke(221, 160, 221);  // pink-ish purple
  //     } else {
  //       stroke(0, 206, 209); // teal
  //     }

  //     // draw the data
  //     strokeWeight(5);
  //     // fill(255);
  //     line(newSleepTime, 124+i*28, newAwake, 124+i*28);
  //     if (nextDay){
  //       let newNextDay = map(nextDay, 0, 24, xpos, 980);
  //       line(xpos+2, 126+(i+1)*28, newNextDay, 126+(i+1)*28);
  //     }
  //   } 
  //   noLoop();
  // } 
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
