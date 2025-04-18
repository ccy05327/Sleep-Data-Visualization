import json
file: str = './output/SDV.json'
import datetime

def read_json(_file: str):
    with open(_file, 'r') as j:
        _records: list = json.loads(j.read())
    return _records

# control how many records converted
sleep_record = read_json(file)['sleep_record'][550:]

'''
INSERT INTO sleep_data (sleep_at, wake_at, duration)
VALUES ('2023-02-11 04:04:00', '2023-02-11 07:03:00', 2.98);
'''

format = "%Y-%m-%d %H:%M:%S"
print("INSERT INTO sleep_data (sleep_time, wake_time, duration) VALUES")

for record in sleep_record:
    sleep_time = str(record['date']['year']) + "-" + str(record['date']['month']) + "-" + str(record['date']['day']) + " " + str(record['sleep']['hour']) + ":" + str(record['sleep']['min']) + ":00"
    wake_time = str(record['date']['year']) + "-" + str(record['date']['month']) + "-" + str(record['date']['day']) + " " + str(record['wake']['hour']) + ":" + str(record['wake']['min']) + ":00"
    duration = datetime.datetime.strptime(wake_time, format) - datetime.datetime.strptime(sleep_time, format)
    hour = str(duration).split(":")[0]
    miniute = str(duration).split(':')[1]
    dur = int(hour) + round(float(miniute)/60, 2)
    print(
        '("{}", "{}", {}),'.format(sleep_time, wake_time, dur)
    )