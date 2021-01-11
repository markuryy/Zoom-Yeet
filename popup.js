let timerLength = document.getElementById("timer-length"),
  timerStart = document.getElementById("timer-start"),
  instantDisconnect = document.getElementById("instant-disconnect");
let saved = document.getElementById("saved");

let previousTexts = {};
let redOutlineTimeouts = {};

// Load previous values from storage
chrome.storage.sync.get(["timerLength"], (r) => {
  previousTexts[timerLength.id] = r.timerLength;
  timerLength.value = r.timerLength;
});
chrome.storage.sync.get(["timerStart"], (r) => {
  previousTexts[timerStart.id] = r.timerStart;
  timerStart.value = r.timerStart;
});
chrome.storage.sync.get(["instantDisconnect"], (r) => {
  previousTexts[instantDisconnect.id] = r.instantDisconnect;
  instantDisconnect.value = r.instantDisconnect;
});

const resetField = (element, previousTexts, redOutlineTimeouts) => {
  element.value = previousTexts[element.id];
  clearTimeout(redOutlineTimeouts[element.id]);
  element.style.outlineColor = "#FB4B54";
  redOutlineTimeouts[element.id] = setTimeout(() => {
    element.style.outlineColor = "#5f6368";
  }, 1000);
};

const handleInput = (e, element, previousTexts, redOutlineTimeouts) => {
  if (parseInt(element.value) <= 20 && parseInt(element.value) >= 0) {
    previousTexts[element.id] = element.value;
    saveNotification();
    storeOptions(timerLength, timerStart, instantDisconnect);
  } else if (parseInt(element.value)) {
    resetField(element, previousTexts, redOutlineTimeouts);
  }
};

timerLength.oninput = (e) => {
  handleInput(e, timerLength, previousTexts, redOutlineTimeouts);
};
timerStart.oninput = (e) => {
  handleInput(e, timerStart, previousTexts, redOutlineTimeouts);
};
instantDisconnect.oninput = (e) => {
  handleInput(e, instantDisconnect, previousTexts, redOutlineTimeouts);
};

let savedTimeout;
const saveNotification = () => {
  clearTimeout(savedTimeout);
  saved.style.opacity = "1";
  savedTimeout = setTimeout(() => {
    saved.style.opacity = "0";
  }, 1000);
};

const storeOptions = (timerLength, timerStart, instantDisconnect) => {
  chrome.storage.sync.set({
    timerLength: timerLength.value,
    timerStart: timerStart.value,
    instantDisconnect: instantDisconnect.value,
  });
  chrome.runtime.sendMessage({
    timerLength: timerLength.value,
    timerStart: timerStart.value,
    instantDisconnect: instantDisconnect.value,
  });
};
