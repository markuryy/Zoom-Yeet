let inCall;
let maxMembers;
let toolBar, leaveButton;
let active;

const threshold = 0.5;
const delay = 10;

let timeRemaining;
let countdownElement;
let leaveInterval;

setInterval(() => {
  let element = document.querySelector("[jscontroller='FTBAv']");
  if (element) {
    //  Joined Meeting
    if (!inCall) {
      timeRemaining = delay;
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
    }

    if (parseInt(element.innerHTML) > maxMembers)
      maxMembers = parseInt(element.innerHTML);

    inCall = true;

    if (!active) return;

    if (parseInt(element.innerHTML) <= maxMembers * threshold) {
      if (!leaveInterval) {
        countdownElement.innerText = timeRemaining.toString();
        leaveInterval = setInterval(() => {
          if (!active) {
            countdownElement.innerText = "";
            timeRemaining = delay;
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
    }
  } else {
    inCall = false;
    maxMembers = 0;
  }
}, 1000);
