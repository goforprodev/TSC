// imports
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 4000;

// static files
app.use(cors());
app.use(express.static("public"));
app.use("/css", express.static(__dirname + "public/css"));
app.use("/js", express.static(__dirname + "public/js"));
app.use("/img", express.static(__dirname + "public/img"));

//Allow express to parse json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set views
app.set("views", "./views");
app.set("view engine", "ejs");

// a very simple cache to hold log results
class SessionCache {
  cache = [];
  nonce = 1;

  contains = (scanNumber) => {
    let exists = false;
    for (var i = 0; i < this.cache.length; i++) {
      const e = this.cache[i];
      if (e.scanNumber == scanNumber) {
        // now check for the date difference
        let then = e.createdOn;
        let now = new Date();
        if (
          then.getFullYear() == now.getFullYear() &&
          then.getMonth() == now.getMonth() &&
          then.getDate() == now.getDate()
        ) {
          exists = true;
          break;
        }
      }
    }
    return exists;
  };

  insert = (scanNumber) => {
    let entry = {
      id: this.nonce,
      scanNumber,
      createdOn: new Date(),
    };

    this.cache.push(entry);

    // increase nonce
    this.nonce++;
    return true;
  };

  // retreive all entries
  get = () => {
    return this.cache;
  };

  del = () => {
    this.cache = [];
    return true;
  };
}

// meeting storage
class Meeting {
  cache = {};
  attendees = {};

  insert = (key, value) => {
    this.cache[key] = value;
  };

  get = (key) => {
    return this.cache[key];
  };

  save_attendee = (key, val) => {
    if (this.attendees[key]) {
      this.attendees[key].push(val);
    } else {
      this.attendees[key] = [val];
    }
  };

  get_attendance = (key) => {
    this.attendees[key];
  };
}

// initialize cache instance
let scanCache = new SessionCache();

// meeting instance
let meeting = new Meeting();

app.get("/", (req, res) => {
  res.render("index", { title: "TSCI HES 2022 QR-CODE SCANNER" });
});

app.get("/demo", (req, res) => {
  res.render("demo");
});

app.post("/some", (req, res) => {
  if (req.body) {
    // check if scan number exists already in cache
    if (scanCache.contains(req.body.scanNumber))
      return res.status(409).json({ message: "Already Exists" });

    // insert
    if (scanCache.insert(req.body.scanNumber))
      return res.status(200).send({ data: "Insertion Successful" });
  }
});
app.get("/create", (req, res) => {
  res.render("create", { title: "Create meeting" });
});
app.post("/api/create", (req, res) => {
  parseAndAddData(req.body, res);
});

app.post("/api/load-meeting", (req, res) => {
  loadMeeting(req.body, res);
});

app.post("/api/register", (req, res) => {
  registerAttendee(req.body, res);
});

app.post("/api/get-registry", (req, res) => {
  loadRegistry(req.body, res);
});

app.get("/download", (req, res) => {
  return res.status(200).send({ data: scanCache.get() });
});

app.get("/render-meeting", (req, res) => {
  const hash = req.query.hash;
  return res.render("meeting", { title: "Register for meeting" });
});

app.get("/deletedb", (req, res) => {
  if (scanCache.del())
    return res.status(200).json({ message: "All scan records cleared" });
});

function parseAndAddData(req, res) {
  // get title of meeting
  let title = req.title;
  //   let fields = req.fields.split(`~`);
  let fields = req.fields;
  // generate random string
  let randomString = getRandString(10);
  // insert into cache
  meeting.insert(randomString, { title, fields });

  // return the meeting link
  return res.status(200).send({ urlSuffix: randomString });
}

function loadMeeting(req, res) {
  // load a meeting if it exists
  let val = meeting.get(req.key);
  if (val) {
    res.status(200).send({ title: val.title, fields: val.fields });
  } else {
    return res.status(404).json({ message: "Not Found" });
  }
}

function registerAttendee(req, res) {
  meeting.save_attendee(req.key, req.detail);
  res.status(200).send({ message: "Success" });
}

function loadRegistry(req, res) {
  let entry = meeting.get_attendance(req.key);
  if (entry) {
    // let val = meeting.get(req.key)
    res.status(200).send({ title: meeting.get(req.key).title, data: entry });
  } else {
    return res.status(404).json({ message: "Not Found" });
  }
}

function getRandString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

// listen on port 3000
app.listen(port, () => {
  console.log("listening on port", port);
});
