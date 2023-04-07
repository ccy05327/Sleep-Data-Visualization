from dash import Dash, dash_table, html
from dash.dependencies import Input, Output
import json
import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv
import os
import pandas as pd
import pprint

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

query = "SELECT sleep_time, wake_time, duration FROM sleep_data ORDER BY id DESC LIMIT 5"
origin_df = pd.read_sql(query, db)


def read_json(_file: str):
    with open(_file, 'r') as j:
        _records: list = json.loads(j.read())['sleep_record']
    return _records


app = Dash(__name__)

app.layout = html.Div([
    dash_table.DataTable(
        id='editing-prune-data',
        columns=[{'id': 'id', 'name': '{}'.format(i)} for i in origin_df.keys()],
        data=[{'{}'.format(i): (j) for i in origin_df.keys()} for j in origin_df[i]],
        editable=True
    ),
    html.Div(id='editing-prune-data-output')
])


@app.callback(Output('editing-prune-data-output', 'children'),
              Input('editing-prune-data', 'data'))
def display_output(rows):
    pruned_rows = []
    for row in rows:
        # require that all elements in a row are specified
        # the pruning behavior that you need may be different than this
        if all([cell != '' for cell in row.values()]):
            pruned_rows.append(row)

    return html.Div([
        html.Div('Raw Data'),
        html.Pre(pprint.pformat(rows)),
        html.Hr(),
        html.Div('Pruned Data'),
        html.Pre(pprint.pformat(pruned_rows)),
    ])

if __name__ == '__main__':
    app.run_server(debug=True)
