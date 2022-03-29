from color import *
import time
from helper import *


def read_draw():
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
