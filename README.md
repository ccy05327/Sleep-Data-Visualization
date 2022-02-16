# SDV aka Sleep Data Visualization

## Description

This is a personal project I first started in the tail end of 2020, at that point I only know a little bit of JavaScript ([p5.js](https://p5js.org/) specifically, with 3-month learning), but I was desperate to find a sleep data visualization tool. I cannot find any existing apps out there to do this, so I thought... why not try it myself with p5.js?

So that's how the first version of my SDV is created within a week. I tweaked and improved it throughout the first half of 2021. The concept is to calculate the start, end, and the duration of each sleep and map them to the pixels I set, and then draw it out.

However, there are quite a few downsides. First and the most annoying one, is that it is not possible to have to records starting on the same day be drawn on the same line. Some other trivial ones are: have to edit the code file every time entering a sleep record (which is everyday), the chart (questionable) is not responsive.

Later in the summer, I learnt about Python and had a lot of practice with visualizing data. After finishing a school project, I became particularly interested in ploting data in my life. I found this library called [plotly](https://plotly.com/graphing-libraries/), specifically the gantt chart and timeline view, which solves my first problem in V1.

Having my data in a json file can solve my second issue in V1, but at that time I have no idea how to deal with files and such, so even though my mentor mentioned this to me, I'd put it off.

After more than a year since I started this project, I have learned so much more, and are definitely comfortable deadling with reading and writing files, so after having my SDV drawn using plotly, I then change it to be writing and reading from a file.

Some small details about this project if you're interested... I've learnt how to use colors in the terminal output, which is super helpful to distinguish messages. I also took the time to check the input, making sure month is between 1 and 12 and hour is between 0 and 24, etc. Another thing is to separate files in a project. I knew this in JavaScript, even though it's simpler in Python, I didn't use this approach until V2 is done (other than tutorials).

### V1. Using p5.js 2020.12.15 ~ 2022.01

[See here in the web](https://ccy05327.github.io/Sleep-Data-Visualization/)

### V2. Using python plus plotly 2022.02

[See here for the most updated record as png](https://github.com/ccy05327/Sleep-Data-Visualization/blob/main/SDV.png)

#### What you need to use V2 package

- Download all the files in the **[package](https://github.com/ccy05327/Sleep-Data-Visualization/tree/main/package)** folder
  - `main.py`
  - `helper.py`
  - `color.py`
  - `tutorial.py`
  - `write.py`
  - `read_draw.py`
  - `SDV.json`
- **[Python 3.7+](https://www.python.org/downloads/)**
- **Terminal** (macOS)/**Command Line Prompt** (Linux/Windows)/**PowerShell** (Windows) to run the script

> All the steps and tutorials for using the tool is within the script.

### Vn. SDV Android App ~2022.12.31

> This is my goal for this project, deadline is before 2023.
