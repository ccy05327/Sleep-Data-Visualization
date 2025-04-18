import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv
import os
import pandas as pd
import plotly.express as px
import datetime

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
    print("MySQL database connected")
except mysql.connector.Error as err:
    if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
        print("Something is wrong with your user name or password")
    elif err.errno == errorcode.ER_BAD_DB_ERROR:
        print("Database does not exist")
    else:
        print(err)

def write_sql(_data: dict):
    '''
    Write (insert into) to existing database table
    '''
    # Extract the data from the input dictionary
    year = _data["date"]["year"]
    month = _data["date"]["month"]
    day = _data["date"]["day"]
    sleep_h = _data["sleep"]["hour"]
    sleep_m = _data["sleep"]["min"]
    wake_h = _data["wake"]["hour"]
    wake_m = _data["wake"]["min"]

    try:
        add_sleep_data = ("INSERT INTO sleep_data "
                          "(sleep_time, wake_time, duration) "
                          "VALUES (%s, %s, %s)")

        # Construct the sleep_time and wake_time datetime objects
        sleep_time = datetime.datetime(year, month, day, sleep_h, sleep_m)
        wake_time = datetime.datetime(year, month, day, wake_h, wake_m)
        duration = wake_time - sleep_time
        hour = str(duration).split(":")[0]
        miniute = str(duration).split(':')[1]
        dur = int(hour) + round(float(miniute)/60, 2)
        mycursor.execute(add_sleep_data, (sleep_time, wake_time, dur))
        db.commit()
        print("Data inserted successfully!")
    except mysql.connector.Error as err:
        print(f"Error inserting data into MySQL table: {err}")
        
data = {
    "date": {
        "year": 2023,
        "month": 3,
        "day": 31
    },
    "sleep": {
        "hour": 0,
        "min": 40
    },
    "wake": {
        "hour": 6,
        "min": 45
    }
}

write_sql(data)