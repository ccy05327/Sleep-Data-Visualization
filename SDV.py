import PySimpleGUI as sg
import json
import plotly.io as pio
import plotly.express as px
import pandas as pd
from subprocess import call

file: str = './output/SDV.json'


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

display_days: int = 30  # possible user input
single_width: int = 20

IMAGE_WIDTH = 600
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
                      width=IMAGE_WIDTH, height=single_width*display_days)
    fig.update_yaxes(autorange="reversed")
    pio.write_image(fig, _file)

################ Data processing ################
def year_input_validation(values):
    '''Validate input year.

    values -- window value to extract the right input

    return -- integer.

    Turn value into an integer; Check correct range 2022 to 2024; Return absolute value plus modulo otherwise.
    '''
    try:
        _year = int(values['-YEAR-'])
        _year = _year if _year < 2025 and _year > 2021 else abs(_year) % 2022

    except ValueError:
        pass

    return _year

def month_input_validation(values):
    '''Validate input month.

    values -- window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 1 to 12; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type month.
    '''
    try:
        _month = int(values['-MONTH-'])
        _month = _month if _month < 13 and _month > 0 else abs(_month) % 12
        _month = str(_month)
        _month = _month if len(_month) != 1 else '0' + _month
    except ValueError:
        pass

    return _month

def day_input_validation(values):
    '''Validate input date/day.

    values -- window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 1 to 31; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type date/day.
    '''
    try:
        _day = int(values['-DAY-'])
        _day = _day if _day < 31 and _day > 0 else abs(_day) % 31
        _day = str(_day)
        _day = _day if len(_day) != 1 else '0' + _day
    except ValueError:
        pass

    return _day

def hour_input_validation(values):
    '''Validate input hour.

    values -- specified window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 0 to 23; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type hour.
    '''
    try:
        _hour = int(values)
        _hour = _hour if _hour < 31 and _hour > 0 else abs(_hour) % 31
        _hour = str(_hour)
        _hour = _hour if len(_hour) != 1 else '0' + _hour
    except ValueError:
        pass

    return _hour

def minute_input_validation(values):
    '''Validate input minute.

    values -- specified window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 0 to 59; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type hour.
    '''
    try:
        _min = int(values)
        _min = _min if _min < 60 and _min > -1 else abs(_min) % 60
        _min = str(_min)
        _min = _min if len(_min) != 1 else '0' + _min
    except ValueError:
        pass

    return _min

def second_input_validation(values):
    '''Validate input second.

    values -- specified window value to extract the right input.

    return -- string.

    Turn value into an integer; Check correct range 0 to 59; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type hour.
    '''
    try:
        _sec = int(values)
        _sec = _sec if _sec < 60 and _sec > -1 else abs(_sec) % 60
        _sec = str(_sec)
        _sec = _sec if len(_sec) != 1 else '0' + _sec
    except ValueError:
        pass

    return _sec

def duration_input_validation(values):
    '''Validate input minute.

    values -- window value to extract the right input.

    return -- float.

    Turn value into an integer; Check correct range 0.01 to 23.99; Return absolute value plus modulo otherwise; Turn value into a string; Add an additional '0' in front if string length is one; Return the final correct format & data type hour.
    '''
    try:
        _dur = float(values['-DURATION-'])
        _dur = _dur if _dur < 60 and _dur > 0 else abs(_dur) % 60
    except ValueError:
        pass

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
    duration = duration_input_validation(values)
    # print('{}/{}/{} {}:{} to {}:{} length: {}'.format(year,month, day, sleep_h, sleep_m, wake_h, wake_h, duration))
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
        "duration": duration
    }

    return [data, month, day]

def commit_to_github(month: str, day: str):
    '''Commit with the date of the input and push to GitHub, JSON file and PNG file.'''
    # Commit Message
    commit_message: str = "{}/{} sleep".format(month, day)

    # Stage the file
    call("git add SDV.json SDV.png", shell=True)

    # Add your commit
    call('git commit -m "' + commit_message + '"', shell=True)

    # Push the new or update files
    call("git push origin main", shell=True)

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
          [sg.Text(' '*28), sg.Button('write in', size=(8, 1), font=("Any", 12), button_color=(sg.theme_background_color(), 'white'), pad=(0, 10))],
          [sg.Text('There are currently ' + str(record_length(file)) + ' records in ' + file + '.', key='-RECORD LENGTH-')],
          [sg.T('Visualization', font=FONT_BIG),
           sg.Text(' '*88), sg.Button('Generate', size=(9, 1), font=("Any", 12), button_color=(sg.theme_background_color(), 'white'), pad=(0, (0, 10)))],
          [sg.T('Display (days):', size=(TEXT_WIDTH, 1)),
           sg.Input(key='-DISPLAY DAYS-', size=(INPUT_WIDTH, 1)),
           sg.Text('Default and max is 30. ', font=FONT_SMALL)],
          [sg.Image("./output/default.png", key='-IMAGE-', size=(IMAGE_WIDTH, IMAGE_HEIGHT))],
          [sg.Text(' '*60), sg.Button('Commit', size=(8, 1), font=("Any", 15), button_color=(sg.theme_background_color(), 'white'), pad=(0, 10))]
          ]


def instruction_window():
    '''
    Display the instruction window when the Help -> Instruction menu is clicked
    '''
    instructionLayout = [
        [sg.Text('Section 1: Data Input', font=FONT_BIG)],
        [sg.Text('Enter each line with the respective range of numbers.', font=FONT_MEDIUM)],
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
    if event == sg.WIN_CLOSED:
        break

    if event == 'write in':
        # read in data & validate input
        data = read_and_validate()[0]
        write_json(data, file)
        window['-RECORD LENGTH-'].update('There are currently ' + str(record_length(file)) + ' records in ' + file + '.')
        # window['-RECORD LENGTH-'].update('')
        print("data input")
        clear_input()
    elif event == 'Generate':
        if (values['-DISPLAY DAYS-']):
            display_days = int(values['-DISPLAY DAYS-'])
        # read file
        records = read_json(file)
        df = []
        for i in records['sleep_record'][-display_days-5:]:
            record = dict(
                Date='{}/{}'.format(i['date']['month'], i['date']['day']),
                Sleep='2022-06-01 {}:{}:00'.format(i['sleep']['hour'],
                                                   i['sleep']['min']),
                Wake='2022-06-01 {}:{}:00'.format(i['wake']['hour'],
                                                  i['wake']['min']),
                Duration=i['duration'])
            df.append(record)
        # draw plot and save image
        draw_save(df, './output/SDV.png')
        # display image
        image_path = './output/SDV.png'

        window['-IMAGE-'].update(image_path)
        print("image output")
    elif event == 'Commit':
        commit_to_github(read_and_validate()[1], read_and_validate()[2])
    elif event == 'Instruction':
        instruction_window()

window.close()
