# SDV aka Sleep Data Visualization

## Introduction

This is a personal project I first started at the end of 2020, at that point I only know a little bit of JavaScript (p5js specifically, with 3-month learning), but I was desperate to find a sleep data visualization tool. I cannot find any existing apps out there to do this, so I thought... why not try it myself with p5.js?

So that's how the first version of my SDV is created within a week. I tweaked and improved it throughout the first half of 2021. The concept is to calculate the start, end, and duration of each sleep and map them to the pixels I set, and then draw it out. To read more about v1, [click here](https://github.com/ccy05327/Sleep-Data-Visualization/tree/v1).

However, there are quite a few downsides. The first and the most annoying one is that it is not possible to have records starting on the same day be drawn on the same line. Some other trivial ones are: have to edit the code file every time entering a sleep record (which is every day), the chart (questionable) is not responsive.

Later in the summer, I learned about Python and had a lot of practice with visualizing data. After finishing a school project, I became particularly interested in plotting data in my life. I found this library called [plotly](https://plotly.com/graphing-libraries/), specifically the Gantt chart and timeline view, which solves my first problem in V1.

Having my data in a JSON file can solve my second issue in V1, but at that time I have no idea how to deal with files and such, so even though my mentor mentioned this to me, I'd put it off.

After more than a year since I started this project, I have learned so much more, and am definitely comfortable dealing with reading and writing files, so after having my SDV drawn using plotly, I then change it to be writing and reading from a file.

### V1. Using p5.js

[See here in the web](https://ccy05327.github.io/Sleep-Data-Visualization/)

### V2. Using python plus plotly

[See here for the most updated record as png](https://github.com/ccy05327/Sleep-Data-Visualization/blob/main/SDV.png)

### What you need to use V2 package

- Download all the files in the `package` folder
  - `main.py`
  - `helper.py`
  - `color.py`
  - `tutorial.py`
  - `write.py`
  - `read_draw.py`
  - `SDV.json`
- [Python 3.7+](https://www.python.org/downloads/)
- Terminal/Command Line Prompt/PowerShell to run the script

  All the steps and tutorials for using the tool is within the script
