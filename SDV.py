import time
import json
import plotly.io as pio
import plotly.express as px

# https://www.geeksforgeeks.org/append-to-json-file-using-python/
W = '\033[0m'
R = '\033[31m'
G = '\033[32m'
Y = '\033[33m'
B = '\033[34m'
P = '\033[35m'
# print(W+'default ' + R+'red ' + G+'green ' +
#       Y+'yellow ' + B+'blue ' + P+'purple')


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


write_or_read = input("Do you want to "+B+"write" +
                      W+" or "+P+"read"+W+" file? ")
if write_or_read == "Write" or write_or_read == "write" or write_or_read == "w":
    file = input(B+"    File to write to "+W +
                 "(default: SDV.json)" + B+": "+W)
    if len(file) == 0:
        file = 'SDV.json'
    print(W+"    Please enter the following: ")
    time.sleep(1)

    # get input
    month = int(input(B+"\tMonth: "+W))
    # check within range
    while month > 12 or month < 1 or len(str(month)) == 0:
        # if not repeat til correct
        print(R+"\tWrong value for month, please enter between 1 and 12")
        month = int(input(B+"\tMonth: "+W))
    # check input length before converting
    if len(str(month)) == 1:
        # add zero if len() == 1 and change to str
        month = '0' + str(month)
    else:
        # change type to str
        month = str(month)

    day = int(input(B+"\tDay: "+W))
    while day > 31 or day < 1 or len(str(day)) == 0:
        print(R+"\tWrong value for day, please enter between 1 and 31")
        day = int(input(B+"\tDay: "+W))
    if len(str(day)) == 1:
        day = '0' + str(day)
    else:
        day = str(day)

    sleep_h = int(input(B+"\tSleep Hour: "+W))
    while sleep_h > 23 or sleep_h < 0 or len(str(sleep_h)) == 0:
        print(R+"\tWrong value for sleep hour, please enter between 0 and 23")
        sleep_h = int(input(B+"\tSleep Hour: "+W))
    if len(str(sleep_h)) == 1:
        sleep_h = '0' + str(sleep_h)
    else:
        sleep_h = str(sleep_h)

    sleep_m = int(input(B+"\tSleep Minute: "+W))
    while sleep_m >= 60 or sleep_m < 0 or len(str(sleep_m)) == 0:
        print(R+"\tWrong value for sleep minute, please enter between 0 and 59")
        sleep_m = int(input(B+"\tSleep Minute: "+W))
    if len(str(sleep_m)) == 1:
        sleep_m = '0' + str(sleep_m)
    else:
        sleep_m = str(sleep_m)

    wake_h = int(input(B+"\tWake Hour: "+W))
    while wake_h > 23 or wake_h < 0 or len(str(wake_h)) == 0:
        print(R+"\tWrong value for wake hour, please enter between 0 and 23")
        wake_h = int(input(B+"\tWake Hour: "+W))
    while int(sleep_h) > wake_h:
        print(
            R+"\tWrong value for wake hour, please enter between {} and 23".format(sleep_h))
        wake_h = int(input(B+"\tWake Hour: "+W))
    if len(str(wake_h)) == 1:
        wake_h = '0' + str(wake_h)
    else:
        wake_h = str(wake_h)

    wake_m = int(input(B+"\tWake Minute: "+W))
    while wake_m >= 60 or wake_m < 0 or len(str(wake_m)) == 0:
        print(R+"\tWrong value for wake minute, please enter between 0 and 59")
        wake_m = int(input(B+"\tWake Minute: "+W))
    if len(str(wake_m)) == 1:
        wake_m = '0' + str(wake_m)
    else:
        wake_m = str(wake_m)

    duration = float(input(B+"\tDuration: "+W))
    while duration <= 0 or duration > 24 or len(str(duration)) == 0:
        print(R+"\tWrong value for duration, please enter between 1 and 24")
        duration = float(input(B+"\tDuration: "+W))

    j = {
        "date": {"year": 2022, "month": month, "day": day},
        "sleep": {"hour": sleep_h, "min": sleep_m},
        "wake": {"hour": wake_h, "min": wake_m},
        "duration": duration
    }

    write_json(j, file)
    print(W+"Please wait for file writing...")
    time.sleep(2)
    print(W+"You can view the file at " + B+file+W)


if write_or_read == "Read" or write_or_read == "read" or write_or_read == "r":
    file = input(P+"File to read "+W +
                 "(default: SDV.json)" + P+": "+W)
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
    print(W+"Reading the file...")
    time.sleep(1)
    toDraw = input(Y+"Do you want to draw the data? " + W+"(yes/[no]): ")
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
        toSaveShow = int(input(Y+"Answer: "+W))
        if toSaveShow == 1:
            print("Please wait...")
            draw_show(df)
        elif toSaveShow == 2:
            file = input(Y+"Please enter output filename" +
                         W+"(default: SDV.png)" + Y+": "+W)
            if len(file) == 0:
                file = 'SDV.png'
            print("Please wait...")
            draw_save(df, file)
        elif toSaveShow == 3:
            file = input(Y+"Please enter output filename" +
                         W+"(default: SDV.png)" + Y+": "+W)
            if len(file) == 0:
                file = 'SDV.png'
            print("Please wait...")
            draw_show_save(df, file)
        print(Y+"DONE"+W)
    else:
        print(Y+"No figure produced"+W)
