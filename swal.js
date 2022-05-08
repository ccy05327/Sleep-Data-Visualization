// import { PythonShell } from "python-shell";

// function write_or_read_button() {
//   swal({
//     title: "Write or Read?",
//     text: "write in your data or read existing data",
//     buttons: {
//       write: {
//         text: "write",
//         visible: true,
//         closeModal: true,
//       },
//       read: {
//         text: "read",
//         visible: true,
//         closeModal: true,
//       },
//       cancel: {
//         text: "cancel",
//         visible: false,
//         closeModal: true,
//       },
//     },
//   }).then((write_or_read) => {
//     if (write_or_read == "read") {
//       file_to_read();
//     } else if (write_or_read == "write") {
//       file_to_write();
//     }
//   });
// }

function file_to_read() {
  swal("File to read? (default: SDV.json)", {
    content: "input",
  }).then((value) => {
    if (value.length == 0) {
      value = "SDV.json";
      swal(`Reading SDV.json...`, {
        buttons: false,
        timer: 3000,
      });
      read_json(value);
    } else if (!value.includes(".")) {
      swal(`Please enter a valid filename`);
      file_to_read();
    } else {
      swal(`Reading ${value}...`, {
        buttons: false,
        timer: 3000,
      });
      PythonShell.run("test.py", null, (err) => {
        if (err) throw err;
        console.log("finished");
      });
      read_json(value);
    }
  });
}

function file_to_write() {
  swal("File to write? (default: SDV.json)", {
    content: "input",
  }).then((value) => {
    swal(`You type ${value}`);
  });
}

$.ajax({
  type: "POST",
  url: "test.py",
  data: { param: text },
}).done((o) => {
  console.log("sucess");
});
