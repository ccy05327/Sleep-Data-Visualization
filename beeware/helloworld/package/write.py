from color import *
import time
from helper import *


def write():
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
