const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");

require("dotenv").config();

app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 4700;

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res
      .status(400)
      .send({ message: "No files were uploaded.", code: 400 });
  }

  const file = req.files.file;
  const filename = file.name;
  const path = process.env.DIR_PATH;
  const store = req.query.store;

  if (!fs.existsSync(path+store)) {
    fs.mkdirSync(path+store, { recursive: true });
  }

  file.mv(`${path}${store}/${filename}`, (err) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .send({ message: "File upload failed.", code: 500 });
    }
    res.status(200).send({ message: "File uploaded successfully.", code: 200 });
  });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(process.env.DIR_PATH);
});
