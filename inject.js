let alreadyInCall;
let maxMembers;
let active;

let timerLength, timerStart, instantDisconnect;

let timeRemaining;
chrome.storage.sync.get(
  ["timerLength", "timerStart", "instantDisconnect"],
  (r) => {
    timerLength = r.timerLength;
    timeRemaining = timerLength;
    timerStart = r.timerStart / 100;
    instantDisconnect = r.instantDisconnect / 100;
  }
);

chrome.runtime.onMessage.addListener(function (message) {
  console.log("onMessage");
  timerLength = message.timerLength;
  timeRemaining = timerLength;
  timerStart = message.timerStart / 100;
  instantDisconnect = message.instantDisconnect / 100;
});

let toolBar, leaveButton, countdownElement;
const initializeElements = () => {
  toolBar = document.querySelector("[class='NzPR9b']");
  leaveButton = document.querySelector("[data-tooltip='Leave call']");

  let parentElement = document.createElement("div");
  parentElement.setAttribute("class", "auto-disconnect");
  parentElement.setAttribute("id", "parent");

  let switchElement = document.createElement("label");
  switchElement.setAttribute("class", "auto-disconnect");
  switchElement.setAttribute("id", "switch");

  countdownElement = document.createElement("p");
  countdownElement.setAttribute("class", "auto-disconnect");
  countdownElement.setAttribute("id", "countdown");

  let inputElement = document.createElement("input");
  inputElement.setAttribute("class", "auto-disconnect");
  inputElement.setAttribute("id", "checkbox");
  inputElement.setAttribute("type", "checkbox");
  inputElement.addEventListener("change", (e) => {
    if (e.target.checked) {
      active = true;
      switchElement.style.borderColor = "#fb4b54";
    } else {
      active = false;
      switchElement.style.borderColor = "#5f6368";
    }
  });

  let sliderElement = document.createElement("div");
  sliderElement.setAttribute("class", "auto-disconnect");
  sliderElement.setAttribute("id", "slider");

  switchElement.append(inputElement, sliderElement);
  parentElement.append(countdownElement, switchElement);

  let dividerElement = document.createElement("div");
  dividerElement.setAttribute("class", "auto-disconnect");
  dividerElement.setAttribute("id", "divider");

  parentElement.append(dividerElement);

  toolBar.prepend(parentElement);
};

let leaveInterval;
const handleLeaveCall = () => {
  if (!leaveInterval) {
    countdownElement.innerText = timeRemaining.toString();
    leaveInterval = setInterval(() => {
      if (!active) {
        countdownElement.innerText = "";
        timeRemaining = timerLength;
        clearInterval(leaveInterval);
        leaveInterval = undefined;
      } else if (timeRemaining - 1 === 0) {
        leaveButton.click();
        clearInterval(leaveInterval);
        leaveInterval = undefined;
      } else {
        timeRemaining--;
        countdownElement.innerText = timeRemaining.toString();
      }
    }, 1000);
  }
};

setInterval(() => {
  let memberCount = document.querySelector("[jscontroller='FTBAv']");
  //  Currently in Meeting
  if (memberCount) {
    if (!alreadyInCall) {
      initializeElements();
    }
    alreadyInCall = true;

    if (parseInt(memberCount.innerHTML) > maxMembers)
      maxMembers = parseInt(memberCount.innerHTML);

    if (!active) return;

    if (parseInt(memberCount.innerHTML) <= Math.ceil(maxMembers * timerStart)) {
      handleLeaveCall();
    }

    if (
      parseInt(memberCount.innerHTML) <=
        Math.ceil(maxMembers * instantDisconnect) &&
      maxMembers > 2
    ) {
      leaveButton.click();
    }
  } else {
    alreadyInCall = false;
    maxMembers = 0;
  }
}, 1000);
