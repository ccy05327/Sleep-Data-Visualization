// function Sleep(date, sleepTime, duration, grey){
//     this.date = date;
//     this.sleepTime = sleepTime;
//     this.duration = duration;
//     this.grey = grey;
//     if (this.duration !== 0){
//       this.awake = round(this.sleepTime + this.duration, 2);
//       this.sleepTimeX = round(map(this.sleepTime, 0, 24, xpos+2, 980), 2);
//       this.nextDay = 0;
//       if (this.awake > 24){
//         this.nextDay = round(this.awake - 24, 2);
//         this.awake = 24;
//       }
//       this.awakeX = round(map(this.awake, 0, 24, xpos, 980), 2);
//     }

//     this.draw = function(){
//         this.xAxes();
//         this.yAxes();
//         this.printData();
//         this.vLine();
//     }

//     this.xAxes = function(){
//         stroke(200);
//         strokeWeight(5);
//         line(10, height - 250, width - 10, height - 250);
//         textSize(20);
//         strokeWeight(0.5);
//         fill(200);
//         let n = 1;
//         for (let i = 0; i < 24; i++){
//             textFont('Font Style Normal');
//             textSize(20);
//             text("|", 108 + i*38, height - 245);
//             textAlign(CENTER);
//             textFont(CynthFont);
//             textSize(32);
//             text(n, 108 + i*38, height - 210);
//             n += 1;
//         }  
//         triangle(width, height - 250, width - 15, height - 240, width - 15, height - 260);
//     };

//     this.yAxes = function(){
//         stroke(200);
//         strokeWeight(5);  
//         line(ypos, 100, ypos, height - 190);
//         textSize(12);
//         fill(200);
//         strokeWeight(0.5);
//         for (let i = 0; i < record.length; i++){
//             textAlign(CENTER);
//             textFont('Font Style Normal');
//             text("—", ypos, 129 + i*28);
//         }
//         triangle(ypos, 90, ypos-10, 105, ypos+10, 105);
//     };

//     this.vLine = function(){
//         stroke(200);
//         strokeWeight(0.5);
//         for (let i = 0; i < 12; i++){
//             line(146 + i*76, 110, 146 + i*76, height - 250);
//         }
//     }

//     this.printData = function(){
//         // some additional text
//         textSize(32);
//         circle(xpos, height - 250, 10);
//         text('(24-hour time)', width - 90, height - 180);
//         text("(date)", xpos-20, 80);
//         text("0", xpos-20, height - 220, 10);

//         stroke(0);
//         fill(0);
//         textSize(36);
//         // some data summary
//         let totalDur = 0;
//         let totalSleep = 0;
//         let totalDay = 0;
//         for(let i = 0; i < record.length; i++){
//             if (record[i].duration){
//             totalDur += record[i].duration;
//             totalSleep += 1;
//             totalDur = round(totalDur, 2);
//             }
//             if (record[i].duration !== 0){
//             totalDay += 1;
//             }
//         }
//         let hourDay = 24;
//         hourDay = round(totalDay/totalSleep*24, 2);
//         let sleepPercent = 0;
//         sleepPercent = round((totalDur)/(totalDay*24)*100, 2);
//         textAlign(LEFT);
//         text(`Total: ${totalDur} hours of sleep, throughout ${totalDay} days, ${totalSleep} sleeps, ${sleepPercent}% of the time`, 20, height - 135); 
//         text(`Average sleep: ${round(totalDur / totalDay, 2)} hours, average hour-day: ${hourDay} hours`, 20, height - 100);
//     }
//   }

//   /*
// function yAxes(){
//   stroke(200);
//   strokeWeight(5);  
//   line(ypos, 100, ypos, height - 190);
//   textSize(12);
//   fill(200);
//   strokeWeight(0.5);
//   for (let i = 0; i < record.length; i++){
//     textAlign(CENTER);
//     textFont('Font Style Normal');
//     text("—", ypos, 129 + i*28);
//   }
//   triangle(ypos, 90, ypos-10, 105, ypos+10, 105);
// }

// function xAxes(){
//   stroke(200);
//   strokeWeight(5);
//   line(10, height - 250, width - 10, height - 250);
//   textSize(20);
//   strokeWeight(0.5);
//   fill(200);
//   let n = 1;
//   for (let i = 0; i < 24; i++){
//     textFont('Font Style Normal');
//     textSize(20);
//     text("|", 108 + i*38, height - 245);
//     textAlign(CENTER);
//     textFont(CynthFont);
//     textSize(32);
//     text(n, 108 + i*38, height - 210);
//     n += 1;
//   }  
//   triangle(width, height - 250, width - 15, height - 240, width - 15, height - 260);
// }

// function printData(){
//   stroke(0);
//   fill(0);
//   textSize(36);
//   // some data summary
//   let totalDur = 0;
//   let totalSleep = 0;
//   let totalDay = 0;
//   for(let i = 0; i < record.length; i++){
//     if (record[i].duration){
//       totalDur += record[i].duration;
//       totalSleep += 1;
//       totalDur = round(totalDur, 2);
//     }
//     if (record[i].duration !== 0){
//       totalDay += 1;
//     }
//   }
//   let hourDay = 24;
//   hourDay = round(totalDay/totalSleep*24, 2);
//   let sleepPercent = 0;
//   sleepPercent = round((totalDur)/(totalDay*24)*100, 2);
//   textAlign(LEFT);
//   text(`Total: ${totalDur} hours of sleep, throughout ${totalDay} days, ${totalSleep} sleeps, ${sleepPercent}% of the time`, 20, height - 135); 
//   text(`Average sleep: ${round(totalDur / totalDay, 2)} hours, average hour-day: ${hourDay} hours`, 20, height - 100);
// }

// function Vlines(){
//   stroke(200);
//   strokeWeight(0.5);
//   for (let i = 0; i < 12; i++){
//       line(146 + i*76, 110, 146 + i*76, height - 250);
//   }
// }

//   // some additional text
//   stroke(0);
//   fill(0);
//   textSize(32);
//   circle(xpos, height - 250, 10);

//   text('(24-hour time)', width - 90, height - 180);
//   text("(date)", xpos-20, 80);
//   text("0", xpos-20, height - 220, 10);


//   */