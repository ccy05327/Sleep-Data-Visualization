import time
import json
import plotly.io as pio
import plotly.express as px
from color import *


def write_json(_data, _file):
    with open(_file, 'r+') as f:
        file_data = json.load(f)
        file_data["sleep_record"].append(_data)
        f.seek(0)
        json.dump(file_data, f, indent=4)


def read_json(_file):
    with open(_file, 'r') as j:
        _records = json.loads(j.read())
    return _records


def draw_show(_df):
    fig = px.timeline(_df, color="Duration", x_start="Sleep",
                      x_end="Wake", y="Date", color_continuous_scale=['#ffff3f', '#52b69a', '#0077b6'])
    fig.update_yaxes(autorange="reversed")
    fig.show()


def draw_save(_df, _file):
    fig = px.timeline(_df, color="Duration", x_start="Sleep",
                      x_end="Wake", y="Date", color_continuous_scale=['#ffff3f', '#52b69a', '#0077b6'])
    fig.update_yaxes(autorange="reversed")
    pio.write_image(fig, _file)


def draw_show_save(_df, _file):
    fig = px.timeline(_df, color="Duration", x_start="Sleep",
                      x_end="Wake", y="Date", color_continuous_scale=['#ffff3f', '#52b69a', '#0077b6'])
    fig.update_yaxes(autorange="reversed")
    pio.write_image(fig, _file)
    fig.show()


toSkip = input(RESET+"Welcome to the Sleep Data Visualization Tool" +
               GREY+" (skip/enter to continue) "+RESET)

# INSTRUCTIONS
if toSkip != 'skip' and toSkip != 'SKIP' and toSkip != 'Skip':
    input(RESET+"This is a tool you can visualize your sleep records with python & plotly" +
          GREY+" (press enter to continue)")
    input(RED+"Please make sure you have plotly installed before proceeding further" +
          RESET+WHITE+GREY+" (press enter to continue)"+RESET)

    first_time = input(
        BYELLOW+"Do you want to see the instructions for using this tool" + RESET+WHITE+" (yes/[no])? "+RESET)
    if first_time == 'Y' or first_time == 'y' or first_time == 'yes' or first_time == 'YES':
        # input("Here are some instructions to help you use this tool" +
        #       GREY+" (press enter to continue)"+RESET)
        # input("To have your sleep data visualized, you need the following..." +
        #       GREY+" (press enter to continue)"+RESET)
        # input("  1. install plotly (assuming your already have python since you're running this file)" +
        #       GREY+" (press enter to continue)"+RESET)
        # input("  2. your sleep data with the following records" +
        #       GREY+" (press enter to continue)"+RESET)
        # input(ICyan+"     This tool is created in 2022 so the year will be assumed to be 2022" +
        #       RESET+GREY+" (press enter to continue)"+RESET)
        # input("     1. month" +
        #       GREY+" (press enter to continue)"+RESET)
        # input("     2. day" +
        #       GREY+" (press enter to continue)"+RESET)
        # input("     3. asleep hour" +
        #       GREY+" (press enter to continue)"+RESET)
        # input("     4. asleep minute" +
        #       GREY+" (press enter to continue)"+RESET)
        # input("     5. awake hour" +
        #       GREY+" (press enter to continue)"+RESET)
        # input("     6. awake minute" +
        #       GREY+" (press enter to continue)"+RESET)
        # input("     7. duration" +
        #       GREY+" (press enter to continue)"+RESET)
        input("There are two steps involved in the program." +
              GREY+" (press enter to continue)"+RESET)
        input("First you need to write in your data in order to visualize it." +
              GREY+" (press enter to continue)"+RESET)
        input("You will have the option to choose which one you want each time you enter." +
              GREY+" (press enter to continue)"+RESET)
        print("It will look like this...")
        time.sleep(1)
        input("Do you want to "+BBLUE+"write" +
              RESET+WHITE+" or "+BPURPLE+"read"+RESET+WHITE+" file? "+RESET+GREY+" \n(press enter to continue)"+RESET)
        input("where you can enter 'Write, write, or w' for "+BBLUE+"write" + RESET+", and 'Read, read, or r' for "+BPURPLE+"read " +
              RESET+GREY+" (press enter to continue)"+RESET)


write_or_read = input("Do you want to "+BBLUE+"write" +
                      RESET+WHITE+" or "+BPURPLE+"read"+RESET+WHITE+" file? ")
if write_or_read == "Write" or write_or_read == "write" or write_or_read == "w":
    file = input(BBLUE+"    File to write to "+WHITE +
                 "(default: SDV.json)" + BBLUE+": "+WHITE)
    if len(file) == 0:
        file = 'SDV.json'
    print(RESET+WHITE+"    Please enter the following: ")
    time.sleep(1)

    # get input
    month = int(input(BBLUE+"\tMonth: "+WHITE))
    # check within range
    while month > 12 or month < 1 or len(str(month)) == 0:
        # if not repeat til correct
        print(RED+"\tWrong value for month, please enter between 1 and 12")
        month = int(input(BBLUE+"\tMonth: "+WHITE))
    # check input length before converting
    if len(str(month)) == 1:
        # add zero if len() == 1 and change to str
        month = '0' + str(month)
    else:
        # change type to str
        month = str(month)

    day = int(input(BBLUE+"\tDay: "+WHITE))
    while day > 31 or day < 1 or len(str(day)) == 0:
        print(RED+"\tWrong value for day, please enter between 1 and 31")
        day = int(input(BBLUE+"\tDay: "+WHITE))
    if len(str(day)) == 1:
        day = '0' + str(day)
    else:
        day = str(day)

    sleep_h = int(input(BBLUE+"\tSleep Hour: "+WHITE))
    while sleep_h > 23 or sleep_h < 0 or len(str(sleep_h)) == 0:
        print(RED+"\tWrong value for sleep hour, please enter between 0 and 23")
        sleep_h = int(input(BBLUE+"\tSleep Hour: "+WHITE))
    if len(str(sleep_h)) == 1:
        sleep_h = '0' + str(sleep_h)
    else:
        sleep_h = str(sleep_h)

    sleep_m = int(input(BBLUE+"\tSleep Minute: "+WHITE))
    while sleep_m >= 60 or sleep_m < 0 or len(str(sleep_m)) == 0:
        print(RED+"\tWrong value for sleep minute, please enter between 0 and 59")
        sleep_m = int(input(BBLUE+"\tSleep Minute: "+WHITE))
    if len(str(sleep_m)) == 1:
        sleep_m = '0' + str(sleep_m)
    else:
        sleep_m = str(sleep_m)

    wake_h = int(input(BBLUE+"\tWake Hour: "+WHITE))
    while wake_h > 23 or wake_h < 0 or len(str(wake_h)) == 0:
        print(RED+"\tWrong value for wake hour, please enter between 0 and 23")
        wake_h = int(input(BBLUE+"\tWake Hour: "+WHITE))
    while int(sleep_h) > wake_h:
        print(
            RED+"\tWrong value for wake hour, please enter between {} and 23".format(sleep_h))
        wake_h = int(input(BBLUE+"\tWake Hour: "+WHITE))
    if len(str(wake_h)) == 1:
        wake_h = '0' + str(wake_h)
    else:
        wake_h = str(wake_h)

    wake_m = int(input(BBLUE+"\tWake Minute: "+WHITE))
    while wake_m >= 60 or wake_m < 0 or len(str(wake_m)) == 0:
        print(RED+"\tWrong value for wake minute, please enter between 0 and 59")
        wake_m = int(input(BBLUE+"\tWake Minute: "+WHITE))
    if len(str(wake_m)) == 1:
        wake_m = '0' + str(wake_m)
    else:
        wake_m = str(wake_m)

    duration = float(input(BBLUE+"\tDuration: "+WHITE))
    while duration <= 0 or duration > 24 or len(str(duration)) == 0:
        print(RED+"\tWrong value for duration, please enter between 1 and 24")
        duration = float(input(BBLUE+"\tDuration: "+WHITE))

    j = {
        "date": {"year": 2022, "month": month, "day": day},
        "sleep": {"hour": sleep_h, "min": sleep_m},
        "wake": {"hour": wake_h, "min": wake_m},
        "duration": duration
    }

    write_json(j, file)
    print(RESET+WHITE+"Please wait for file writing...")
    time.sleep(2)
    print(RESET+WHITE+"You can view the file at " + BBLUE+file+WHITE)


if write_or_read == "Read" or write_or_read == "read" or write_or_read == "r":
    file = input(BPURPLE+"File to read "+WHITE +
                 "(default: SDV.json)" + BPURPLE+": "+WHITE)
    if len(file) == 0:
        file = 'SDV.json'
    time.sleep(1)
    records = read_json(file)
    df = []
    for i in records['sleep_record']:
        record = dict(Date='{}/{}'.format(i['date']['month'], i['date']['day']),
                      Sleep='2022-02-01 {}:{}:00'.format(
                          i['sleep']['hour'], i['sleep']['min']),
                      Wake='2022-02-01 {}:{}:00'.format(
                          i['wake']['hour'], i['wake']['min']),
                      Duration=i['duration'])
        df.append(record)
    print(RESET+WHITE+"Reading the file...")
    time.sleep(1)
    toDraw = input(BYELLOW+"Do you want to draw the data " +
                   RESET+WHITE+"(yes/[no])? ")
    if toDraw == "Yes" or toDraw == 'yes' or toDraw == 'Y' or toDraw == 'y':
        time.sleep(1)
        print("Choose one from the following ")
        time.sleep(1)
        print("  1. Draw and show")
        time.sleep(1)
        print("  2. Draw and save")
        time.sleep(1)
        print("  3. Draw, show, and save")
        time.sleep(1)
        toSaveShow = int(input(BYELLOW+"Answer: "+WHITE))
        if toSaveShow == 1:
            print("Please wait...")
            draw_show(df)
        elif toSaveShow == 2:
            file = input(BYELLOW+"Please enter output filename" +
                         RESET+WHITE+"(default: SDV.png)" + BYELLOW+": "+WHITE)
            if len(file) == 0:
                file = 'SDV.png'
            print("Please wait...")
            draw_save(df, file)
        elif toSaveShow == 3:
            file = input(BYELLOW+"Please enter output filename" +
                         RESET+WHITE+"(default: SDV.png)" + BYELLOW+": "+WHITE)
            if len(file) == 0:
                file = 'SDV.png'
            print("Please wait...")
            draw_show_save(df, file)
        print(RESET+YELLOW+"DONE"+WHITE)
    else:
        print(RESET+YELLOW+"No figure produced"+WHITE)
