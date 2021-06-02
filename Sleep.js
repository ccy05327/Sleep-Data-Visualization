class Sleep{
    constructor(){
      this.records = [];
      this.duration = 0;
      this.sleepTime;
      this.wakeTime;
      this.grey;
      this.awakeX; 
      this.sleepTimeX;
      this.nextDay;
    }
    
    addRecord(year, month, day, sleepHour, sleepMin, wakeHour, wakeMin, grey){
      this.records.push([year, month, day, sleepHour, sleepMin, wakeHour, wakeMin, grey]);
    }
    
    toDraw(){
      this.printText();
      this.vLine();
      this.xAxes();
      this.yAxes();
      this.drawRecord();
    }
  
    xAxes(){
      stroke(200);
      strokeWeight(5);
      line(10, height - 250, width - 10, height - 250);
      textSize(40);
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
  
    yAxes(){
      stroke(200);
      strokeWeight(5);  
      line(70, 100, 70, height - 190);
      textSize(12);
      fill(200);
      strokeWeight(0.5);
      for (let i = 0; i < this.records.length; i++){
          textAlign(CENTER);
          textFont('Font Style Normal');
          text("—", 70, 129 + i*28);
      }
      triangle(70, 90, 60, 105, 80, 105);
      let xpos = 70;
      fill(0);
      circle(xpos, height - 250, 10);
    }
  
    vLine(){
      stroke(200);
      strokeWeight(0.5);
      for (let i = 0; i < 12; i++){
          line(146 + i*76, 110, 146 + i*76, height - 250);
      }
    }
  
    printText(printing = true){     
      if(printing){
        let xpos = 70; 
        noStroke();
        background(255);
        textAlign(CENTER);
        fill(0);
        strokeWeight(1);
        textSize(60);
        textFont(CynthFont);
        text("Sleep Data Visualization", width/2, 60);
  
        // date
        for (let i = 0; i < this.records.length; i++){
          textAlign(CENTER);
          textFont(CynthFont);
          fill(180);
          noStroke();
          textSize(28);
          strokeWeight(.1);
          for (let i = 0; i < this.records.length; i++){
            let date = this.records[i][1] + "/" + this.records[i][2];
            text(date, xpos-35, 135+i*28);
          }
        }
          
        // some additional text
        noStroke();
        stroke(0);
        strokeWeight(0.5);
        fill(0);
        textSize(32);
        textFont(CynthFont);
        circle(xpos, height - 250, 10);
        text('(24-hour time)', width - 90, height - 180);
        text("(date)", xpos-20, 80);
        text("0", xpos-20, height - 220, 10);
  
        strokeWeight(0.05);
        textSize(36);
        // some data summary
        let totalDur = 0;
        let totalSleep = 0;
        let totalDay = 0;
        for(let i = 0; i < this.records.length; i++){
            if (this.duration > 0){
            totalDur += this.duration;
            totalSleep += 1;
            totalDur = round(totalDur, 2);
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
    }
    
    
    drawRecord(){
      for(let i = 0; i < this.records.length; i++){  
        let sleepTimeX, duration;
        let cal = this.dataCal(i);
  
        sleepTimeX = cal[0];
        duration = cal[1];
  
        if(duration > 0){
          if (this.grey){
            stroke(200);
          } else if (this.duration <= 6){
            stroke(240, 128, 128);
          } else if (this.duration >= 12){
            stroke(221, 160, 221);
          } else {
            stroke(0, 206, 209);
          }
          strokeWeight(5);
          line(this.sleepTimeX, 124+i*28, this.awakeX, 124+i*28);
          if(this.nextDay){
            let nextDayX = map(this.nextDay, 0, 24, 70, 980);
            line(72, 126+(i+1)*28, nextDayX, 126+(i+1)*28);
          }


          // if(i > 0){
          //   if(this.records[i][2] == this.records[i-1][2]){
          //     line(this.sleepTimeX, 124+(i-1)*28, this.awakeX, 124+(i-1)*28);
          //     if(this.nextDay){
          //       let nextDayX = map(this.nextDay, 0, 24, 70, 980);
          //       line(72, 126+(i)*28, nextDayX, 126+(i)*28);
          //     }
          //     console.log("same day");
          //     noLoop();
          //   } 
          // } else {
          //   line(this.sleepTimeX, 124+i*28, this.awakeX, 124+i*28);
          //   if(this.nextDay){
          //     let nextDayX = map(this.nextDay, 0, 24, 70, 980);
          //     line(72, 126+(i+1)*28, nextDayX, 126+(i+1)*28);
          //     console.log("normal day");
          //     noLoop();
          //   }
          // }
        }
      }
    }
  
    dataCal(i=0){
    // 0 year, 1 month, 2 day, 3 sleepHour, 4 sleepMin, 5 wakeHour, 6 wakeMin, 7 grey
    //   2021,       5,    23,          22,         44,          8,         9,  false
      this.sleepTime = new Date(this.records[i][0], this.records[i][1] - 1, this.records[i][2], this.records[i][3], this.records[i][4]);
      this.wakeTime = new Date(this.records[i][0], this.records[i][1] - 1, this.records[i][2], this.records[i][5], this.records[i][6]);
      if(this.records[i][5] - this.records[i][3] < 0){
        this.wakeTime = new Date(this.records[i][0], this.records[i][1] - 1, this.records[i][2] + 1, this.records[i][5], this.records[i][6]);
      }
      
      this.duration = round((this.wakeTime - this.sleepTime)/3600000, 2);
      this.grey = this.records[i][7];

      if(this.duration > 0){
        let sleep = parseFloat(this.records[i][3] + "." + round(this.records[i][4]/60*100));
        this.awake = round(sleep + this.duration, 2);
        this.sleepTimeX = round(map(sleep, 0, 24, 85, 980), 2);
        this.nextDay = 0;
        if (this.awake > 24){
          this.nextDay = round(this.awake - 24, 2);
          this.awake = 24;
        }
        this.awakeX = round(map(this.awake, 0, 24, 115, 980), 2);
      }
      return [this.sleepTimeX, this.duration];
    }
  }