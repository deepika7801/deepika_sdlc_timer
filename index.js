let loginBtn = document.getElementById("login-btn");
let signup = document.getElementById("sign-up");
let signupBtn = document.getElementById("signup-btn");
let newTask = document.getElementById("new-task");
let timer = document.getElementById("start-timer");
let historyBtn = document.getElementById("history");
let logoutBtn = document.getElementById("logout");
let profileBtn = document.getElementById("profile");
let editTask = document.getElementById("edit-submit");
let signinBtn = document.getElementById("sign-in");
let taskNameID = document.getElementById("task-name");
let expectedTimeID = document.getElementById("expected-time");

let time;
let selectedId;
let username;
let startDate, endDate;
let hours, minutes, seconds;
let resumeState = "start";
let resumeTime,
  task_details = {};
loginBtn.addEventListener("click", displayLoginPage);
signup.addEventListener("click", displaySignUpPage);
signinBtn.addEventListener("click", displaySignInPage);
signupBtn.addEventListener("click", getUserData);
editTask.addEventListener("click", editTaskDetails);
document.getElementById("edit-close").addEventListener("click", () => {
  document.getElementById("edit-task").style.display = "none";
});
profileBtn.addEventListener("click", displayProfilePage);

//Call the start timer and stop timer function when start timer button is clicked
timer.addEventListener("click", () => {
  if (timer.name == "startBtn") {
    if (taskNameID.value.length != 0 && expectedTimeID.value.length != 0) {
      if (task_details.hasOwnProperty(taskNameID.value)) {
        alert("Task already present, Enter new task!");
      } else {
        startTimer();
      }
    } else {
      alert("Enter the task details");
    }
  } else stopTimer();
});
logoutBtn.addEventListener("click", logoutPage);
function logoutPage() {
  location.reload();
}

/**
 *Display the sign up to create a new user when sign up button is clicked
 *
 */
function displaySignUpPage() {
  document.getElementById("login-page-container").style.display = "none";
  document.getElementById("signup-page-container").style.display = "flex";
}

/**
 *Display the login page when signin button is clicked
 *
 */
function displaySignInPage() {
  document.getElementById("login-page-container").style.display = "flex";
  document.getElementById("signup-page-container").style.display = "none";
}

/**
 *Get the data from login page and validate username and password
 *Displays an alert after login whether login is successfull or not
 */
async function displayLoginPage() {
  try {
    username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;
    let login_data = {};
    login_data = { username: `${username}`, password: `${password}` };
    let loginData = await fetch("http://localhost:8000/login-page", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(login_data),
    });
    if (loginData.ok) {
      alert("Login Successfull");
      document.getElementById("login-page-container").style.display = "none";
      document.getElementById("main-page").style.display = "flex";
      displayTaskHistory();
    } else {
      alert("Invalid password");
    }
  } catch (error) {
    alert(error.message);
  }
}

/**
 *Get the data from sign up page and store them in json file by passing data to server using post request
 *Validate username, password and email-id of the user
 */
async function getUserData() {
  try {
    let userName = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let email = document.getElementById("email-id").value;
    if (userName.length != 0 && email.length != 0 && password.length != 0) {
      var validEmail =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email.match(validEmail)) {
        if (password.length >= 4) {
          let signupData = {};
          signupData = {
            username: `${userName}`,
            email: `${email}`,
            password: `${password}`,
          };

          let output = await fetch("http://localhost:8000/signup-page", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify(signupData),
          });
          if (output.ok) {
            alert("Successfully Created an Account");
            username = document.getElementById("username").value;
            document.getElementById("signup-page-container").style.display =
              "none";
            document.getElementById("main-page").style.display = "flex";
            displayTaskHistory();
          } else if (output.status == 400) {
            alert("Username was already registered..");
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            document.getElementById("email-id").value = "";
          } else if (output.status == 404) {
            alert("Enter valid credentials");
          }
        } else {
          alert("Password must be atleast 4 characters");
        }
      } else {
        alert("Enter Valid Email Address");
      }
    } else {
      alert("Enter the required details to signup");
    }
  } catch (error) {
    alert(error.message);
  }
}
const modal = document.querySelector(".modal");
const trigger = document.getElementById("new-task");
const closeButton = document.querySelector(".close-button");

/**
 *Close the pop up box for new task after adding task
 *
 */
function toggleModal() {
  if (timer.name == "stop") {
    stopTimer();
  }
  modal.classList.toggle("show-modal");
}

/**
 *Start the timer after getting task name and expected time
 *
 */
function startTimer() {
  timer.name = "stopBtn";
  timer.innerHTML = "Stop";
  startDate = new Date();
  hours = 0;
  minutes = 0;
  seconds = 0;
  time = setInterval(startCounter, 1000);
}

/**
 *Stop the timer and send the task details to server by POST method
 *Displays an alert after storing the task name
 */
async function stopTimer() {
  try {
    let time_taken = document.getElementById("timer").innerHTML;
    timer.name = "startBtn";
    timer.innerHTML = "Start Timer";
    endDate = new Date();
    clearInterval(time);
    document.getElementById("timer").innerHTML = "00:00:00";
    let start_date = startDate.toLocaleDateString();
    let end_date = endDate.toLocaleDateString();
    let start_time = `${startDate.getHours()}:${startDate.getMinutes()}:${startDate.getSeconds()}`;
    let end_time = `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`;
    let task_name = document.getElementById("task-name").value;
    let expected_time = document.getElementById("expected-time").value;
    let task_details = {
      username: `${username}`,
      taskName: `${task_name}`,
      startDate: `${start_date}`,
      endDate: `${end_date}`,
      startTime: `${start_time}`,
      endTime: `${end_time}`,
      timeTaken: `${time_taken}`,
      expectedTime: `${expected_time}`,
    };
    let output = await fetch("http://localhost:8000/task-details", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(task_details),
    });
    if (output.ok) {
      alert("task added");
      displayTaskHistory();
    } else {
      alert("Task added Already present, Enter new task name");
    }
    document.getElementById("task-name").value = "";
    document.getElementById("expected-time").value = "";
  } catch (error) {
    alert(error.message);
  }
  closeButton.click();
}

/**
 *Increment the timer value for every 1 second by calling startCounter function in setInterval
 *
 */
function startCounter() {
  if (seconds < 59) {
    seconds++;
  } else if (minutes < 59) {
    seconds = 0;
    minutes++;
  } else {
    hours++;
  }
  document.getElementById("timer").innerHTML =
    hours + ":" + minutes + ":" + seconds;
}

/**
 *Close the pop up for new task while clicking on window
 *
 * @param {click} event Get the event of user by event
 */
function windowOnClick(event) {
  if (event.target === modal) {
    toggleModal();
  }
}

trigger.addEventListener("click", toggleModal);
closeButton.addEventListener("click", toggleModal);
window.addEventListener("click", windowOnClick);
historyBtn.addEventListener("click", displayTaskHistory);

/**
 *Displays the task history of the user
 *Get the data of task history from server by GET request
 *
 */
async function displayTaskHistory() {
  document.getElementById("display-profile").style.display = "none";
  document.getElementById("display-task").style.display = "block";
  document.getElementById("history").style.backgroundColor = "skyblue";
  document.getElementById("logout").style.backgroundColor = "rgb(85 142 197)";
  document.getElementById("profile").style.backgroundColor = "rgb(85 142 197)";

  try {
    let data = await fetch("http://localhost:8000/get-taskData", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    task_details = await data.json();
    let task_keys = [];
    task_keys = Object.keys(task_details);
    let cardLayout = document.getElementById("display-container");
    cardLayout.replaceChildren();
    for (let i = 0; i < task_keys.length; i++) {
      if (task_details[task_keys[i]].username == username) {
        let card = document.createElement("div");
        cardLayout.appendChild(card);

        card.setAttribute("id", `${task_details[task_keys[i]].taskName}`);

        card.classList.add("flex-container");
        let taskNameDiv = document.createElement("div");
        card.appendChild(taskNameDiv);
        taskNameDiv.innerHTML = `${task_details[task_keys[i]].taskName}`;
        taskNameDiv.setAttribute("id", `${task_keys[i]}1`);
        let startDate = document.createElement("div");
        card.appendChild(startDate);
        startDate.setAttribute("id", `${task_keys[i]}2`);
        startDate.innerHTML = `${task_details[task_keys[i]].startDate}`;
        let startTime = document.createElement("div");
        card.appendChild(startTime);
        startTime.innerHTML = `${task_details[task_keys[i]].startTime}`;
        startTime.setAttribute("id", `${task_keys[i]}4`);
        let endDate = document.createElement("div");
        card.appendChild(endDate);
        endDate.setAttribute("id", `${task_keys[i]}3`);
        endDate.innerHTML = `${task_details[task_keys[i]].endDate}`;
        let endTime = document.createElement("div");
        card.appendChild(endTime);
        endTime.innerHTML = `${task_details[task_keys[i]].endTime}`;
        endTime.setAttribute("id", `${task_keys[i]}5`);
        let timeTaken = document.createElement("INPUT");
        timeTaken.setAttribute("type", "text");
        card.appendChild(timeTaken);
        timeTaken.value = `${task_details[task_keys[i]].timeTaken}`;
        timeTaken.setAttribute("id", `${task_keys[i]}6`);
        document
          .getElementById(`${task_keys[i]}6`)
          .addEventListener("keypress", function (event) {
            if (event.key == "Enter") {
              event.preventDefault();
              editTimeTakenValue(`${task_keys[i]}6`, task_keys[i]);
            }
          });
        let expectedTime = document.createElement("div");
        card.appendChild(expectedTime);
        expectedTime.setAttribute("id", `${task_keys[i]}7`);
        expectedTime.innerHTML = `${task_details[task_keys[i]].expectedTime}`;
        let editTask = document.createElement("div");
        card.appendChild(editTask);
        let editIcon = document.createElement("img");
        editIcon.setAttribute("src", "assets/edit.png");
        editIcon.classList.add("edit-icon");
        editIcon.setAttribute("id", `${task_keys[i]}8`);
        editTask.appendChild(editIcon);
        editIcon.onclick = function () {
          if (resumeState == "stop") {
            alert("Stop the Timer and proceed next");
          } else {
            document.getElementById("edit-task").style.display = "flex";
            document.getElementById("edit-task-name").value = card.id;
            selectedId = card.id;
            document.getElementById("edit-expected-time").value =
              task_details[card.id].expectedTime;
          }
        };
        let deleteTask = document.createElement("div");
        card.appendChild(deleteTask);
        let deleteIcon = document.createElement("img");
        deleteIcon.setAttribute("src", "assets/delete.png");
        deleteIcon.setAttribute("id", `${task_keys[i]}9`);
        deleteIcon.classList.add("edit-icon");
        deleteTask.appendChild(deleteIcon);
        deleteIcon.onclick = function () {
          deleteSelectedTask(card.id);
        };
        let resumeTask = document.createElement("div");
        card.appendChild(resumeTask);
        let resumeIcon = document.createElement("img");
        resumeIcon.setAttribute("src", "assets/resume.png");
        resumeIcon.setAttribute("id", `${task_keys[i]}10`);
        resumeIcon.classList.add("edit-icon");
        resumeTask.appendChild(resumeIcon);
        let id;
        resumeIcon.onclick = function () {
          if (resumeState == "start") {
            id = resumeIcon.id;
            resumeState = "stop";
            resumeSelectedTask(`${task_keys[i]}6`, resumeIcon);
          } else if (resumeState == "stop") {
            if (id == resumeIcon.id) {
              resumeState = "start";
              stopResumeTimer(card, resumeIcon);
            } else {
              alert("Stop the current task and proceed next!!!!");
            }
          }
        };
      }
    }
  } catch (error) {
    alert(error.message);
  }
}

/**
 *Delete a particular task from the task history using the taskname
 *
 * @param {string} taskname Using taskname to delete the selected task from the task history
 */
async function deleteSelectedTask(taskname) {
  if (resumeState == "stop") {
    alert("Stop the timer and proceed next");
  } else {
    let task = { taskname: `${taskname}` };
    let data = await fetch("http://localhost:8000/delete-task", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(task),
    });
    displayTaskHistory();
  }
}

/**
 *Edit the task details such as taskname and expected time by clicking the edit icon
 *
 */
async function editTaskDetails() {
  document.getElementById("edit-task").style.display = "none";
  let taskname = selectedId;
  let newTask = document.getElementById("edit-task-name").value;
  let time = document.getElementById("edit-expected-time").value;
  let task = {
    taskname: `${taskname}`,
    newTask: `${newTask}`,
    time: `${time}`,
  };
  let data = await fetch("http://localhost:8000/edit-taskDetails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(task),
  });
  displayTaskHistory();
}

/**
 *Displays the profile of the login user such as username and email-id
 *Get the data from server by using GET request
 */
async function displayProfilePage() {
  document.getElementById("display-profile").style.display = "block";
  document.getElementById("display-task").style.display = "none";
  document.getElementById("history").style.backgroundColor = "rgb(85 142 197)";
  document.getElementById("logout").style.backgroundColor = "rgb(85 142 197)";
  document.getElementById("profile").style.backgroundColor = "skyblue";

  let data = await fetch("http://localhost:8000/get-profileData", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  let userData = await data.json();
  document.getElementById(
    "profile-username"
  ).innerHTML = `Username : ${username}`;
  document.getElementById(
    "profile-emailid"
  ).innerHTML = `Email-Id : ${userData[username].email}`;
}
let hr, min, sec;

/**
 *Resume the time duration of the selected resume icon by calling the function in setInterval
 *
 * @param {Element} timeTaken Update the time taken value using id and value
 * @param {Element} resume Update the resume icon using resume id
 */
async function resumeSelectedTask(timeTaken, resume) {
  document.getElementById(`${resume.id}`).src = `./assets/stopIcon.png`;
  let time = document.getElementById(`${timeTaken}`).value;
  time = time.split(":");
  hr = time[0];
  min = time[1];
  sec = time[2];
  resumeTime = setInterval(resumeTimer, 1000, timeTaken);
}

/**
 *Update the value of the timer by using setInterval
 *
 * @param {Element} timeTaken Update the timer by using timeTaken ID
 */
function resumeTimer(timeTaken) {
  if (sec < 59) {
    sec++;
    document.getElementById(`${timeTaken}`).value = hr + ":" + min + ":" + sec;
  } else if (min < 59) {
    sec = 0;
    min++;
    document.getElementById(`${timeTaken}`).value = hr + ":" + min + ":" + sec;
  } else {
    hr++;
    document.getElementById(`${timeTaken}`).value = hr + ":" + min + ":" + sec;
  }
}

/**
 *Stop the timer in task history and update the task details such as End date and time
 *Update the details in json file using POST method
 *
 * @param {Element} card To get the task name of the resume timer
 * @param {Element} resume Update the resume icon after clicking the stop timer
 */
async function stopResumeTimer(card, resume) {
  let timeTakenId = `${card.id}6`;
  document.getElementById(`${resume.id}`).src = `./assets/resume.png`;
  let endDate = new Date();
  let time = document.getElementById(`${timeTakenId}`).value;
  clearInterval(resumeTime);
  let endTime = `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`;
  endDate = endDate.toLocaleDateString();
  let data = {
    taskName: `${card.id}`,
    endDate: `${endDate}`,
    endTime: `${endTime}`,
    timeTaken: `${time}`,
  };
  let output = await fetch("http://localhost:8000/update-resumeTask", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  displayTaskHistory();
}

/**
 *Edit the time taken value in task history and update the End date and time after changing the value
 *
 * @param {Element} timeTakenId Get the current time taken value by using timeTakenId
 * @param {string} taskName Update the details in server by using the task name
 */
async function editTimeTakenValue(timeTakenId, taskName) {
  let endDate = new Date();
  let endTime = `${endDate.getHours()}:${endDate.getMinutes()}:${endDate.getSeconds()}`;
  endDate = endDate.toLocaleDateString();
  let editTime = document.getElementById(`${timeTakenId}`).value;
  let format = editTime.split(":");
  if (
    format.length == 3 &&
    format[0] < 24 &&
    format[1] < 60 &&
    format[2] < 60
  ) {
    let data = {
      taskName: `${taskName}`,
      endDate: `${endDate}`,
      endTime: `${endTime}`,
      timeTaken: `${editTime}`,
    };
    let output = await fetch("http://localhost:8000/update-resumeTask", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });
    displayTaskHistory();
  } else {
    alert("Enter the time in standard format");
  }
}
