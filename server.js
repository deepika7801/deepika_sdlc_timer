/**
 *Render all the files after starting the server
 *Get the required task details from json file by using GET method
 *Update the task details by using POST method
 */

const PORT = 8000;
let bodyParser = require("body-parser");
let express = require("express");
let app = express();
var fs = require("fs");

//Render Html page using get request
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//Use body parser for handling incoming request and convert the raw data into object when extended is false
app.use(bodyParser.urlencoded({ extended: false }));

//convert into JSON object
app.use(bodyParser.json());

//Passing directory name and render all the files using express.static middleware
app.use(express.static(__dirname));

//Validate the username and password while login
app.post("/login-page", function (req, res) {
  var data = JSON.parse(fs.readFileSync("./data/data.json"));
  let username = req.body.username;
  let passwd = req.body.password;
  if (data.hasOwnProperty(username)) {
    if (data[username].password == passwd) {
      res.status(200).send("Login successfull");
      res.end();
    } else {
      res.status(404).send("Invalid password");
      res.end();
    }
  } else {
    res.status(404).send("Username not found");
    res.end();
  }
});

//Get the details of user and store them in json file
app.post("/signup-page", function (req, res) {
  let username = req.body.username;
  let passwd = req.body.password;
  let email = req.body.email;
  var data = JSON.parse(fs.readFileSync("./data/data.json"));
  if (data.hasOwnProperty(username)) {
    res.status(400).send("Username already registered");
    res.end();
  }
  if (username.length != 0 && passwd.length != 0 && email.length != 0) {
    data[`${username}`] = {
      username: `${username}`,
      email: `${email}`,
      password: `${passwd}`,
    };
    data = JSON.stringify(data);
    fs.writeFile("./data/data.json", data, () => {});
    res.status(200).send("registered successfully");
    res.end();
  } else {
    res.status(404).send("Enter valid credentials");
    res.end();
  }
});

//Delete a particular task using the task name in json file
app.post("/delete-task", function (req, res) {
  var task = JSON.parse(fs.readFileSync("./data/task.json"));
  let username = req.body.taskname;
  delete task[username];
  task = JSON.stringify(task);
  fs.writeFile("./data/task.json", task, () => {});
  res.end();
});

//Store the task details after creating a new task
app.post("/task-details", function (req, res) {
  var task = JSON.parse(fs.readFileSync("./data/task.json"));
  let username = req.body.username;
  let taskName = req.body.taskName;
  let startDate = req.body.startDate;
  let endDate = req.body.endDate;
  let startTime = req.body.startTime;
  let endTime = req.body.endTime;
  let timeTaken = req.body.timeTaken;
  let expectedTime = req.body.expectedTime;
  if (task.hasOwnProperty(taskName)) {
    res.status(404).send("Enter valid credentials");
    res.end();
  } else {
    task[`${taskName}`] = {
      username: `${username}`,
      taskName: `${taskName}`,
      startDate: `${startDate}`,
      endDate: `${endDate}`,
      startTime: `${startTime}`,
      endTime: `${endTime}`,
      timeTaken: `${timeTaken}`,
      expectedTime: `${expectedTime}`,
    };
    task = JSON.stringify(task);
    fs.writeFile("./data/task.json", task, () => {});
    res.status(200).send("registered successfully");
    res.end();
  }
});

//Get the task details to display the task history in UI
app.get("/get-taskData", function (req, res) {
  var task = JSON.parse(fs.readFileSync("./data/task.json"));
  res.send(task);
});

//Update the task details after editing in task history
app.post("/edit-taskDetails", function (req, res) {
  var task = JSON.parse(fs.readFileSync("./data/task.json"));
  let taskname = req.body.taskname;
  let time = req.body.time;
  let newTask = req.body.newTask;
  task[taskname].expectedTime = time;
  task[taskname].taskName = newTask;
  if (newTask != taskname) {
    task[newTask] = task[taskname];
    delete task[taskname];
  }
  task = JSON.stringify(task);
  fs.writeFile("./data/task.json", task, () => {});
  res.end();
});

//Get the user details for displaying the profile
app.get("/get-profileData", function (req, res) {
  var data = JSON.parse(fs.readFileSync("./data/data.json"));
  res.send(data);
});

//Update the date and time of particular task after the resume timer
app.post("/update-resumeTask", function (req, res) {
  var task = JSON.parse(fs.readFileSync("./data/task.json"));
  let taskName = req.body.taskName;
  task[taskName].endDate = req.body.endDate;
  task[taskName].endTime = req.body.endTime;
  task[taskName].timeTaken = req.body.timeTaken;
  task = JSON.stringify(task);
  fs.writeFile("./data/task.json", task, () => {});
  res.end();
});
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
