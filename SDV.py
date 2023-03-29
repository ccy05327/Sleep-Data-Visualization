import PySimpleGUI as sg
import json
import plotly.io as pio
import plotly.express as px
import pandas as pd
from subprocess import call
import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv
import os
import datetime

file: str = './output/SDV.json'
load_dotenv()

# Establish a connection to the database
db = mysql.connector.connect(
  host=os.getenv("DB_HOST"),
  user=os.getenv("DB_USER"),
  password=os.getenv("DB_PASSWORD"),
  database=os.getenv("DB_NAME"),
  port=os.getenv("DB_PORT")
)

try:
    # Create a cursor object to execute SQL queries
    mycursor = db.cursor()
    print("MySQL database connected successfully")
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)

################ JSON processing ################
def write_json(_data: dict, _file: str):
    '''
    Write (append) into a existing JSON file.

    _data -- the piece of data to append.

    _file -- the JSON file path to write to.
    '''
    with open(_file, 'r+') as f:
        file_data = json.load(f)
        file_data["sleep_record"].append(_data)
        f.seek(0)
        json.dump(file_data, f, indent=4)
        
        
def write_sql(_data: dict):
    '''
    Write (insert into) to existing database table
    '''
    # Extract the data from the input dictionary
    year = int(_data["date"]["year"])
    month = int(_data["date"]["month"])
    day = int(_data["date"]["day"])
    sleep_h = int(_data["sleep"]["hour"])
    sleep_m = int(_data["sleep"]["min"])
    wake_h = int(_data["wake"]["hour"])
    wake_m = int(_data["wake"]["min"])
    dur = float(_data['duration'])

    try:
        add_sleep_data = ("INSERT INTO sleep_data "
                          "(sleep_time, wake_time, duration) "
                          "VALUES (%s, %s, %s)")

        # Construct the sleep_time and wake_time datetime objects
        sleep_time = datetime.datetime(year, month, day, sleep_h, sleep_m)
        wake_time = datetime.datetime(year, month, day, wake_h, wake_m)

        mycursor.execute(add_sleep_data, (sleep_time, wake_time, dur))
        db.commit()
        print("Data inserted successfully!")
        
        _data['duration'] = dur
        write_json(_data, file)
        print("Add to JSON")
    except mysql.connector.Error as err:
        print(f"Error inserting data into MySQL table: {err}")


def read_json(_file: str):
    '''
    Read a JSON file and return the data.

    _file -- the JSON file to read from.

    return -- a list of records in the data.
    '''
    with open(_file, 'r') as j:
        _records: list = json.loads(j.read())
    return _records


def record_length(_file: str):
    '''
    Read a JSON file and return the length of the data inside.

    _file -- JSON file to read from.

    return -- integer
    '''
    with open(_file, 'r') as j:
        _records = json.loads(j.read())
    return len(_records['sleep_record'])


def get_last_record(_file: str):
    date = read_json(_file)['sleep_record'][-1]['date']
    record_date = str(date['year']) + '/' + date['month'] + '/' + date['day']
    return record_date


display_days: int = 30  # possible user input
single_width: int = 20  # width for each bar

IMAGE_WIDTH = 900
IMAGE_HEIGHT = 600

################# Plotly processing ################


def draw_save(_df: pd.DataFrame, _file: str):
    '''
    Read a file and a DataFrame, produce and save a timeline chart. 

    _df -- DataFrame containing the data.

    _file -- file name to save the image to.

    return -- nothing.
    '''
    
    fig = px.timeline(_df,
                      color="Duration",
                      x_start="Sleep",
                      x_end="Wake",
                      y="Date",
                      color_continuous_scale=['#ffff3f', '#52b69a', '#0077b6'],
                      width=IMAGE_WIDTH, height=single_width*display_days
                      )
    fig.update_yaxes(autorange="reversed")
    pio.write_image(fig, _file)

################ Data processing ################


def year_input_validation(values):
    '''Validate input year.

    values -- window value to extract the right input

    return -- integer.

    Turn value into an integer; Check correct range 2022 to 2024; Return absolute value plus modulo otherwise.
    '''
    # try:
    _year = int(values['-YEAR-'])
    _year = _year if _year < 2025 and _year > 2021 else abs(_year) % 2022
    # except ValueError:
    # pass
    return _year


def month_input_validation(values):
    '''Validate input month.

    values -- window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 1 to 12; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type month.
    '''
    # try:
    _month = int(values['-MONTH-'])
    _month = _month if _month < 13 and _month > 0 else abs(_month) % 12
    _month = str(_month)
    _month = _month if len(_month) != 1 else '0' + _month
    # except ValueError:
    #     pass

    return _month


def day_input_validation(values):
    '''Validate input date/day.

    values -- window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 1 to 31; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type date/day.
    '''
    # try:
    _day = int(values['-DAY-'])
    _day = _day if _day <= 31 and _day > 0 else abs(_day) % 32
    _day = str(_day)
    _day = _day if len(_day) != 1 else '0' + _day
    # except ValueError:
    #     pass

    return _day


def hour_input_validation(values):
    '''Validate input hour.

    values -- specified window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 0 to 23; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type hour.
    '''
    # try:
    _hour = int(values)
    _hour = _hour if _hour < 31 and _hour > 0 else abs(_hour) % 31
    _hour = str(_hour)
    _hour = _hour if len(_hour) != 1 else '0' + _hour
    # except ValueError:
    #     pass

    return _hour


def minute_input_validation(values):
    '''Validate input minute.

    values -- specified window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 0 to 59; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type hour.
    '''
    # try:
    _min = int(values)
    _min = _min if _min < 60 and _min > -1 else abs(_min) % 60
    _min = str(_min)
    _min = _min if len(_min) != 1 else '0' + _min
    # except ValueError:
    #     pass

    return _min


def second_input_validation(values):
    '''Validate input second.

    values -- specified window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 0 to 59; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type hour.
    '''
    # try:
    _sec = int(values)
    _sec = _sec if _sec < 60 and _sec > -1 else abs(_sec) % 60
    _sec = str(_sec)
    _sec = _sec if len(_sec) != 1 else '0' + _sec
    # except ValueError:
    #     pass

    return _sec


def duration_input_validation(values):
    '''Validate input minute.

    values -- window value to extract the right input.

    return -- float.

    Turn value into an integer; Check correct range 0.01 to 23.99; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type hour.
    '''
    # try:
    if (values['-DURATION-'] == ""):
        _dur = 0
    else:
        _dur = float(values['-DURATION-'])
        _dur = _dur if _dur < 60 and _dur > 0 else abs(_dur) % 60
    # except ValueError:
    #     pass

    return _dur


def read_and_validate():
    '''
    Read in the inputs from user, validate them, and put them into a dictionary.

    return -- a dictionary of data

    '''
    year = year_input_validation(values)
    month = month_input_validation(values)
    day = day_input_validation(values)
    sleep_h = hour_input_validation(values['-SLEEP HOUR-'])
    sleep_m = minute_input_validation(values['-SLEEP MINUTE-'])
    wake_h = hour_input_validation(values['-WAKE HOUR-'])
    wake_m = minute_input_validation(values['-WAKE MINUTE-'])
    dur = duration_input_validation(values)

    if (dur == 0):
        # if dur is empty, validation will result in zero
        sleep_time = datetime.datetime(int(year), int(month), int(day), int(sleep_h), int(sleep_m))
        wake_time = datetime.datetime(int(year), int(month), int(day), int(wake_h), int(wake_m))
        duration = wake_time - sleep_time
        hour = str(duration).split(":")[0]
        miniute = str(duration).split(':')[1]
        dur = int(hour) + round(float(miniute)/60, 2)

    # write into file
    data: dict = {
        "date": {
            "year": year,
            "month": month,
            "day": day
        },
        "sleep": {
            "hour": sleep_h,
            "min": sleep_m
        },
        "wake": {
            "hour": wake_h,
            "min": wake_m
        },
        "duration": dur
    }

    return [data, month, day]


def fetch_and_pull_github():
    '''
    Fetch and Pull from GitHub. 
    '''
    # fetch
    call("git fetch", shell=True)
    print("git fetch")
    # pull
    call("git pull", shell=True)
    print("git pull")


def commit_to_github(month: str, day: str):
    '''Commit with the date of the input and push to GitHub, JSON file and PNG file.'''
    # Commit Message
    commit_message: str = "{}/{} sleep".format(month, day)

    # Stage the file
    call("git add ./output/SDV.json ./output/SDV.png", shell=True)
    print("stage the files")
    # Add your commit
    call('git commit -m "' + commit_message + '"', shell=True)

    # Push the new or update files
    call("git push origin main", shell=True)
    print("push the files")

    return


################ Main PySimpleGUI section ################
sg.theme('DarkTeal6')

menu_def = [
    ['Help', 'Instruction']
]

INPUT_WIDTH: int = 15
TEXT_WIDTH: int = 12
FONT_BIG = "Default 18"
FONT_MEDIUM = "Default 12"
FONT_SMALL = "Default 10"

layout = [[sg.Menu(menu_def)],
          [sg.Text('Data Input', font=FONT_BIG)],
          [sg.T('Year:', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-YEAR-', size=(INPUT_WIDTH, 1)),
           sg.Text('Ex. 2022', font=FONT_SMALL)],
          [sg.T('Month:', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-MONTH-', size=(INPUT_WIDTH, 1)),
           sg.Text('Please enter 1 to 12, Ex. 5', font=FONT_SMALL)],
          [sg.T('Day:', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-DAY-', size=(INPUT_WIDTH, 1)),
           sg.Text('Please enter 1 to 31, Ex. 23', font=FONT_SMALL)],
          [sg.T('Sleep hour:', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-SLEEP HOUR-', size=(INPUT_WIDTH, 1)),
           sg.Text('Please enter 0 to 23, Ex. 3', font=FONT_SMALL)],
          [sg.T('Sleep minute:', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-SLEEP MINUTE-', size=(INPUT_WIDTH, 1)),
           sg.Text('Please enter 0 to 59, Ex. 53', font=FONT_SMALL)],
          [sg.T('Wake hour:', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-WAKE HOUR-', size=(INPUT_WIDTH, 1)),
           sg.Text('Please enter 0 to 23 and greater than sleep hour, Ex. 11', font=FONT_SMALL)],
          [sg.T('Wake minute:', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-WAKE MINUTE-', size=(INPUT_WIDTH, 1)),
           sg.Text('Please enter 0 to 59, Ex. 22', font=FONT_SMALL)],
          [sg.T('Duration (hour):', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-DURATION-', size=(INPUT_WIDTH, 1)),
           sg.Text('Please enter 0.01 to 23.99, Ex. 8.45', font=FONT_SMALL)],
          [sg.Text(' '*28), sg.Button('write in', size=(8, 1), font=("Any", 12),
                                      button_color=(sg.theme_background_color(), 'white'), pad=(0, 10))],
          [sg.Text('There are currently ' + str(record_length(file)) +
                   ' records in ' + (file.split('/')[-1]) + '.', key='-RECORD LENGTH-')],
          [sg.Text('The last record date is ' +
                   get_last_record(file) + '.', key='-LAST RECORD DATE-')],
          [sg.T('Visualization', font=FONT_BIG),
           sg.Text(' '*88), sg.Button('Generate', size=(9, 1), font=("Any", 12),
                                      button_color=(sg.theme_background_color(), 'white'), pad=(0, (0, 10)))],
          [sg.T('Display (records):', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-DISPLAY DAYS-', size=(INPUT_WIDTH, 1)),
           sg.Text('Default and recommendation max is 30. ', font=FONT_SMALL)],
          [sg.Image("./output/default.png", key='-IMAGE-',
                    size=(IMAGE_WIDTH, IMAGE_HEIGHT))],
          [sg.Text(' '*60), sg.Button('Commit', size=(8, 1), font=("Any", 15),
                                      button_color=(sg.theme_background_color(), 'white'), pad=(0, 10))]
          ]


def instruction_window():
    '''
    Display the instruction window when the Help -> Instruction menu is clicked
    '''
    instructionLayout = [
        [sg.Text('Section 1: Data Input', font=FONT_BIG)],
        [sg.Text('Enter each line with the respective range of numbers.',
                 font=FONT_MEDIUM)],
        [sg.Text('Some input validation will be run, incorrect range will return the absolute value of it and modulo. ', font=FONT_MEDIUM)],
        [sg.Text('* If the sleep data you want to input is across two days/dates, please enter them separately.', font=FONT_MEDIUM)],
        [sg.Text(
            "    * Enter the first day's wake hour 23 and wake minute 59.", font=FONT_MEDIUM)],
        [sg.Text(
            "    * Enter the second day's sleep hour 0 and sleep minute 0.", font=FONT_MEDIUM)],
        [sg.Text('Press "write in" when you\'re done with the data.',
                 font=FONT_MEDIUM)],
        [sg.Text('Section 2: Visualization', font=FONT_BIG)],
        [sg.Text('Press "Generate" to produce image.', font=FONT_MEDIUM)],
        [sg.Text(
            'If there are existing data/records, this can be done without inputing data. ', font=FONT_MEDIUM)],
        [sg.Text(
            'The output image will be generated upon the last 30 records in the data.', font=FONT_MEDIUM)],
        [sg.Text('Section 3: Commit to GitHub', font=FONT_BIG)],
        [sg.Text(
            'This will commit and push the changed .json file and .png file to GitHub.', font=FONT_MEDIUM)],
    ]

    window = sg.Window('Instruction', instructionLayout)
    window.read()
    window.close()


def clear_input():
    '''
    Clearing every input fields
    '''
    window['-YEAR-'].update('')
    window['-MONTH-'].update('')
    window['-DAY-'].update('')
    window['-SLEEP HOUR-'].update('')
    window['-SLEEP MINUTE-'].update('')
    window['-WAKE HOUR-'].update('')
    window['-WAKE MINUTE-'].update('')
    window['-DURATION-'].update('')
    window['-DISPLAY DAYS-'].update('')


window = sg.Window('SDV', layout, finalize=True)


################ Actual window running section ################
while True:
    event, values = window.read()
    fetch_and_pull_github()
    if event == sg.WIN_CLOSED:
        break

    if event == 'write in':
        # read in data & validate input
        data = read_and_validate()[0]
        write_sql(data)
        # update file length after each write in
        window['-RECORD LENGTH-'].update('There are currently ' + str(
            record_length(file)) + ' records in ' + file + '.')
        # update last record date after each write in
        window['-LAST RECORD DATE-'].update('The last record date is ' +
                                            get_last_record(file) + '.')
        print("data input")
        clear_input()
    elif event == 'Generate':
        if (values['-DISPLAY DAYS-']):
            display_days = int(values['-DISPLAY DAYS-'])
        # read file
        records = read_json(file)
        ###### READ FROM JSON #######
        # df = []
        # for i in records['sleep_record'][-display_days-5:]:
            # record = dict(
            #     Date='{}/{}'.format(i['date']['month'], i['date']['day']),
            #     Sleep='2022-06-01 {}:{}:00'.format(i['sleep']['hour'],
            #                                        i['sleep']['min']),
            #     Wake='2022-06-01 {}:{}:00'.format(i['wake']['hour'],
            #                                       i['wake']['min']),
            #     Duration=i['duration'])
            # df.append(record)
        
        ##### READ FROM MYSQL DATABASE #####

        # Define the SQL query to retrieve the data
        query = "SELECT sleep_time, wake_time, duration FROM sleep_data"
        origin_df = pd.read_sql(query, db)
        df = []
        for x in origin_df.index:
            a = origin_df['sleep_time'].dt.date[x]
            i = origin_df['sleep_time'].dt.time[x]
            j = origin_df['wake_time'].dt.time[x]
            duration = origin_df['duration'][x]
            month = str(int(str(a).split("-")[1]))
            day = str(a).split("-")[2]
            sleep_hour = str(i).split(":")[0]
            sleep_minute = str(i).split(":")[1]
            wake_hour = str(j).split(":")[0]
            wake_minute = str(j).split(":")[1]
            
            record = dict(
                Date='{}/{}'.format(month, day),
                Sleep='2023-01-01 {}:{}:00'.format(sleep_hour, sleep_minute),
                Wake='2023-01-01 {}:{}:00'.format(wake_hour, wake_minute),
                Duration=duration)
            
            df.append(record)
        # draw plot and save image
        draw_save(df, './output/SDV.png')
        # display image
        image_path = './output/SDV.png'
        window['-IMAGE-'].update(image_path)
        print("image output")
    elif event == 'Commit':
        if (values["-MONTH-"] == "" or values["-DAY-"] == ""):
            month = read_json(file)["sleep_record"][-1]["date"]["month"]
            day = read_json(file)["sleep_record"][-1]["date"]["day"]
        else:
            month = read_and_validate()[1]
            day = read_and_validate()[2]
        commit_to_github(month, day)
    elif event == 'Instruction':
        instruction_window()

window.close()
