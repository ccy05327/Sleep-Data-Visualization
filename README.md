# SDV aka Sleep Data Visualization v1

## The journey of v1

This is a personal project I first started in the tail end of 2020, at that point I only know a little bit of JavaScript ([p5.js](https://p5js.org/) specifically, with 2 months of learning), but I was desperate to find a sleep data visualization tool. I cannot find any existing apps out there to do this, so I thought... why not try it myself with p5.js?

The reason I wanted a visualization tool to view my sleep so badly that as a noob I dive in and write it myself is because I have a very irregular schedule. If you're reading this, and have not yet seen my sleep schedule, I suggest you go and have a look, either [choose on in all v1](https://github.com/ccy05327/Sleep-Data-Visualization/tree/v1/PDF), [2021 June](https://github.com/ccy05327/Sleep-Data-Visualization/tree/v1#v1-using-p5js-20201215--202201) or [v2](https://github.com/ccy05327/Sleep-Data-Visualization/blob/v2/SDV.png) is fine.

There is a term called "sleep within seconds" in my mother tongue, which I never experienced, no matter how tired I am physically and/or mentally. Since 15 I'm having trouble falling asleep even without technology. I don't suffer from insomnia, it just took me a long time to fall asleep.

I have enough people telling me I have to sleep at the same time and wake up at the same time to have a healthy lifestyle. This is simply not how my body works after years of trying to be an early bird. If I were to use one sentence to explain my sleep schedule now, after the past year and more, I would say:

> <q>**_I live in a world that has a 26-hour clock, I woke up and go to sleep around the same time in that world._**</q>

This is the latest version I would use to explain to others if one asks. Trust me, there have been numerous versions :)

So, back to why I need or want an SDV. There are two reasons at that time:

1. I just started to experiment with this kind of sleep schedule, where I sleep when I want, wake when I want (it is not always possible but I do make the effort to differentiate it by color, i.e. grey means I was woken up by alarm or exterior factors). So I have no idea whether there's a pattern or not, having it in things like Google Calendar isn't enough since I can only view one week at a time instead of a couple weeks.

2. When someone asks about my sleep schedule, I can just show them the image or send them the link (having it on GitHub Pages is something I added later).

To be honest, I think this SDV is the start of my obsession with data collecting and visualizing. I am fascinated by products/applications that include data for me to view and use.

So that's how the first version of my SDV is created within a week. I tweaked and improved it throughout the first half of 2021. The concept is to calculate the start, end, and duration of each sleep and map them to the pixels I set, and then draw it out.

However, there are quite a few downsides. The first and the most annoying one is that it is not possible to have records starting on the same day be drawn on the same line. Some other trivial ones are: have to edit the code file every time entering a sleep record (which is every day), the chart (questionable) is not responsive.

### V1. Using p5.js 2020.12.15 ~ 2022.01

Since I stop updating my schedule using this version, I picked one month in the past that best resembles my schedule as an example.

[See 2021 Jun in the web](https://ccy05327.github.io/Sleep-Data-Visualization/)
