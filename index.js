const fs = require("fs");

const set_length = 60;

function write_json(_data, _file) {
  fs.readFile(_file, (err, data) => {
    if (err) throw err;
    let record = JSON.parse(data.toString());
    console.log(record.sleep_record);
    record.sleep_record.push(_data);
    fs.writeFile(_file, JSON.stringify(record), "utf-8", () => {
      console.log(record.sleep_record);
    });
  });
}

function read_json(_file) {
  fs.readFile(_file, (err, data) => {
    if (err) throw err;
    const record = JSON.parse(data.toString());
    // console.log(record.sleep_record.slice(-10, -1)); // last 10 record
    console.log(`${_file.toString()} is read`);
  });
}

function record_length(_file) {
  fs.readFile(_file, (err, data) => {
    if (err) throw err;
    const record = JSON.parse(data.toString());
    console.log(`Length of record is ${record.sleep_record.length}`);
    return record.sleep_record.length;
  });
}

// read_json("SDV.json");
// record_length("SDV.json");
const data = {
  date: {
    year: 2021,
    month: "02",
    day: "01",
  },
  sleep: {
    hour: "05",
    min: "22",
  },
  wake: {
    hour: "09",
    min: "04",
  },
  duration: 5.5,
};
// write_json(data, "test.json");

