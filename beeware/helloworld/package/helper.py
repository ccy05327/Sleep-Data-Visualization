import json
import plotly.io as pio
import plotly.express as px
import subprocess
import sys

def install(package):
    subprocess.check_call([sys.executable, "-m", "pip", "install", package])


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
