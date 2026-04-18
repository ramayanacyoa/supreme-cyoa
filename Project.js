var currentScene = 0;
var playerName = "";
var broughtLakshmana = false;
var wentAlone = false;
var historyStack = [];

console.log("Update 5");

var scenes = {
  1: {
    title: "The Ramayana Adventure: The Banwas",
    text: [
      "Welcome, {{name}}!",
      "You are a brave warrior in ancient India from the Kingdom of Ayodhya. You are soon to be crowned ruler, as your father, King Dasharatha, is getting old.",
      "One of your father's wives, Kaikeyi, demands that her own son, your younger brother Bharata, be crowned instead. Your father is left with no choice but to exile you from the kingdom.",
      "As part of your exile, you swear that you will live apart from royal comfort and will not enter any city until your exile ends."
    ],
    choices: [
      { label: "Argue back", next: 3 },
      { label: "Accept the exile", next: 4 }
    ]
  },
  3: {
    title: "You choose to argue back.",
    text: [
      "Dasharatha is moved by your words and begins to argue with Kaikeyi. Though he is heartbroken, he is ultimately unable to resist her demands because of an old promise.",
      "You are left with no choice but to continue into exile."
    ],
    choices: [{ label: "Continue", next: 4 }]
  },
  4: {
    title: "You choose to accept the exile.",
    text: [
      "You prepare to leave, bound by your exile and your vow not to enter any city until it is over.",
      "Your brother Lakshmana and your wife Sita insist on going with you."
    ],
    choices: [
      { label: "Go alone", next: 5, onPick: function () { wentAlone = true; } },
      { label: "Go with them", next: 6, onPick: function () { wentAlone = false; } }
    ]
  },
  5: {
    title: "You choose to go alone.",
    text: ["You set out alone, carrying the burden of exile by yourself."],
    choices: [{ label: "Continue", next: 8 }]
  },
  6: {
    title: "You choose to go with them.",
    text: ["You, Lakshmana, and Sita journey together through the forests."],
    choices: [{ label: "Continue", next: 7 }]
  },
  7: {
    title: "Surphanaka's Encounter",
    text: [
      "A demoness named Surphanaka appears and threatens Sita after being rejected.",
      "What do you do?"
    ],
    choices: [
      { label: "Fight Surphanaka", next: 9 },
      { label: "Protect Sita", next: 10 },
      { label: "Negotiate", next: 11 },
      { label: "Accept the marriage", next: 12 }
    ]
  },
  8: {
    title: "Surphanaka's Encounter",
    text: ["Surphanaka proposes to you. Do you accept or reject?"],
    choices: [
      { label: "Accept", next: 12 },
      { label: "Reject", next: 13 }
    ]
  },
  9: {
    title: "Fight Surphanaka",
    text: ["You battle Surphanaka. Fate decides the outcome."],
    choices: [{ label: "Fight", next: -1 }]
  },
  10: {
    title: "Protect Sita",
    text: ["You and Lakshmana force Surphanaka to retreat."],
    choices: [{ label: "Continue", next: 19 }]
  },
  11: {
    title: "Negotiate with Surphanaka",
    text: ["You attempt peace, but tension remains."],
    choices: [
      { label: "Try again", next: 15 },
      { label: "Prepare to fight", next: 9 }
    ]
  },
  12: {
    title: "Accept Surphanaka's Proposal",
    text: ["You accept and are brought before Ravana."],
    choices: [{ label: "Meet Ravana", next: 16 }]
  },
  13: {
    title: "Reject Surphanaka's Proposal",
    text: ["She is enraged and prepares to attack."],
    choices: [{ label: "Fight Surphanaka", next: 9 }]
  },
  14: {
    title: "Victory",
    text: ["You defeat Surphanaka and continue onward."],
    choices: [{ label: "Continue", next: 19 }]
  },
  15: {
    title: "Negotiation Fails",
    text: ["Your final attempt at peace fails."],
    choices: [{ label: "Fight Surphanaka", next: 9 }]
  },
  16: {
    title: "Meeting Ravana",
    text: ["Ravana offers you power and a throne."],
    choices: [{ label: "Claim the throne", next: 17 }]
  },
  17: {
    title: "Evil King Ending",
    text: ["You accept Ravana's offer and rule beside Surphanaka."],
    choices: [{ label: "Restart", restart: true }]
  },
  18: {
    title: "Game Over",
    text: ["You fought bravely, but your journey ends here."],
    choices: [{ label: "Restart", restart: true }]
  },
  19: {
    title: "The Golden Deer",
    text: ["Sita asks you to chase a mysterious golden deer."],
    choices: [
      { label: "Chase the deer", next: 20 },
      { label: "Ignore it", next: 21 }
    ]
  },
  20: {
    title: "Bring Lakshmana?",
    text: ["Lakshmana offers to come with you."],
    choices: [
      { label: "Yes, bring Lakshmana", next: 22, onPick: function () { broughtLakshmana = true; } },
      { label: "No, leave him with Sita", next: 23, onPick: function () { broughtLakshmana = false; } }
    ]
  },
  21: {
    title: "You Ignore the Deer",
    text: ["You stay together and danger passes for now."],
    choices: [{ label: "Restart", restart: true }]
  },
  22: {
    title: "Find the Deer",
    text: ["You and Lakshmana track the deer deeper into the forest."],
    choices: [{ label: "Keep following it", next: 24 }]
  },
  23: {
    title: "Find the Deer",
    text: ["You track the deer alone."],
    choices: [{ label: "Keep following it", next: 24 }]
  },
  24: {
    title: "Shoot the Deer",
    text: ["The golden deer is revealed as Maricha."],
    choices: [{ label: "Continue", next: 25 }]
  },
  25: {
    title: "Maricha's Last Cry",
    text: ["His final cry sounds like your voice."],
    choices: [{ label: "Continue", next: 26 }]
  },
  26: {
    title: "Ravana Sees His Chance",
    text: ["Ravana approaches Sita in disguise."],
    choices: [{ label: "Continue", next: 29 }]
  },
  27: {
    title: "Lakshmana Draws the Line",
    text: ["Lakshmana leaves a protective warning around the hut."],
    choices: [{ label: "Continue", next: 28 }]
  },
  28: {
    title: "Ravana's Trick",
    text: ["Sita is torn between caution and duty to a guest."],
    choices: [{ label: "See what happens", next: -2 }]
  },
  29: {
    title: "The Abduction of Sita",
    text: ["Ravana reveals his true form and abducts Sita."],
    choices: [{ label: "Continue", next: 30 }]
  },
  30: {
    title: "Jatayu Sees Ravana",
    text: ["Jatayu must decide whether to intervene."],
    choices: [
      { label: "Do nothing", next: 31 },
      { label: "Try to rescue Sita", next: 32 }
    ]
  },
  31: {
    title: "Sita is Taken",
    text: ["Ravana escapes and your rescue mission begins."],
    choices: [{ label: "Keep searching", next: 65 }]
  },
  32: {
    title: "Jatayu's Rescue Attempt",
    text: ["Jatayu fights bravely in the sky."],
    choices: [{ label: "See what happens", next: -3 }]
  },
  33: {
    title: "Jatayu Rescues Sita",
    text: ["Jatayu saves Sita and Ravana crashes nearby."],
    choices: [{ label: "Go after Ravana", next: 36 }]
  },
  34: {
    title: "Jatayu Falls",
    text: ["Jatayu is struck down and Sita is still taken."],
    choices: [{ label: "Continue", next: 37 }]
  },
  36: {
    title: "Fight Ravana in the Forest",
    text: ["You confront Ravana beside his shattered chariot."],
    choices: [{ label: "Fight Ravana", next: 38 }]
  },
  37: {
    title: "Sita is Taken",
    text: ["You and Lakshmana begin searching at once."],
    choices: [{ label: "Keep searching", next: 65 }]
  },
  38: {
    title: "Forest Duel Ending",
    text: ["You win a hard-fought battle and protect Sita."],
    choices: [{ label: "Restart", restart: true }]
  },
  39: {
    title: "Lakshmana Saves Sita",
    text: ["Ravana retreats and Sita remains safe."],
    choices: [{ label: "Restart", restart: true }]
  },
  40: {
    title: "Meeting Sugriva",
    text: ["Sugriva asks for your help against Vali."],
    choices: [{ label: "Hear Sugriva's request", next: 41 }]
  },
  41: {
    title: "Sugriva's Plea",
    text: ["Sugriva asks you to help defeat Vali."],
    choices: [{ label: "Consider his plan", next: 42 }]
  },
  42: {
    title: "Your Exile Vow",
    text: ["You set a trap to face Vali outside the city."],
    choices: [{ label: "Set the trap", next: 43 }]
  },
  43: {
    title: "Sugriva Challenges Vali",
    text: ["Answer correctly to take the shot."],
    choices: [
      { label: "Sugriva's wife", next: 44 },
      { label: "Sugriva's bow", next: 45 },
      { label: "Sugriva's horse", next: 46 }
    ]
  },
  44: {
    title: "Vali Falls",
    text: ["Your arrow strikes true and Sugriva is freed."],
    choices: [{ label: "Meet Sugriva's ally", next: 47 }]
  },
  45: {
    title: "You Miss the Moment",
    text: ["The plan fails."],
    choices: [{ label: "Restart", restart: true }]
  },
  46: {
    title: "You Miss the Moment",
    text: ["Sugriva retreats and the attempt fails."],
    choices: [{ label: "Restart", restart: true }]
  },
  47: {
    title: "Meeting Hanuman",
    text: ["Hanuman joins the rescue effort."],
    choices: [{ label: "Go to War Council", next: 54 }]
  },
  52: {
    title: "Peaceful Ending",
    text: ["Traveling alone, you defeat Surphanaka and live in peace."],
    choices: [{ label: "Restart", restart: true }]
  },
  54: {
    title: "War Council",
    text: [
      "The rescue campaign enters its strategic phase with routes, tides, and defenses mapped.",
      "Part 2: The Lanka War — Coming Soon!"
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  65: {
    title: "Searching for Sita",
    text: ["You search for clues and return to regroup."],
    choices: [{ label: "Return to the hut", next: 66 }]
  },
  66: {
    title: "Bharata at the Hut",
    text: ["Bharata asks you to return to Ayodhya."],
    choices: [
      { label: "Accept and return", next: 67 },
      { label: "Decline and continue exile", next: 68 }
    ]
  },
  67: {
    title: "Ayodhya Return Ending",
    text: ["You return early and your story ends in palace intrigue."],
    choices: [{ label: "Restart", restart: true }]
  },
  68: {
    title: "The Sandals Promise",
    text: ["You uphold your vow and continue the rescue mission."],
    choices: [{ label: "Continue to Sugriva", next: 40 }]
  }
};

function randomPercent() {
  return Math.floor(Math.random() * 100);
}

function clearStoryCard() {
  var storyCard = document.getElementById("storyCard");
  if (storyCard) {
    storyCard.innerHTML = "<div id='choices'></div>";
  }
}

function restart() {
  currentScene = 0;
  broughtLakshmana = false;
  wentAlone = false;
  historyStack = [];
  clearStoryCard();
  updateUndoButton();
}

function startAdventure() {
  var input = document.getElementById("playerName");
  playerName = input ? input.value.trim() : "";
  if (!playerName) {
    playerName = "Traveler";
  }
  historyStack = [];
  currentScene = 1;
  showScene();
  updateUndoButton();
}

function resolveSpecialNext(next) {
  if (next === -1) {
    if (randomPercent() < 65) {
      return wentAlone ? 52 : 14;
    }
    return 18;
  }

  if (next === -2) {
    return randomPercent() < 50 ? 29 : 39;
  }

  if (next === -3) {
    return randomPercent() < 15 ? 33 : 34;
  }

  return next;
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showScene() {
  var storyCard = document.getElementById("storyCard");
  if (!storyCard || !scenes[currentScene]) {
    return;
  }

  var scene = scenes[currentScene];
  var sceneTitle = escapeHtml(scene.title);
  var html = "<div id='storyCardToolbar'><button id='undoButton' class='art-button undo-art' type='button' onclick='undoLastChoice()' aria-label='Undo'>Undo</button><button type='button' onclick='openTimelineModal()' aria-label='Open timeline'>Timeline</button></div>";

  if (currentScene === 1) {
    html += "<h1>" + sceneTitle + "</h1>";
  } else {
    html += "<h2>" + sceneTitle + "</h2>";
  }

  scene.text.forEach(function (paragraph) {
    var text = paragraph.replace("{{name}}", escapeHtml(playerName));
    html += "<p>" + escapeHtml(text) + "</p>";
  });

  html += "<div id='choices'>";
  scene.choices.forEach(function (choice, index) {
    if (choice.restart) {
      html += "<button class='art-button restart-art' type='button' onclick='restart()' aria-label='Restart'>" + escapeHtml(choice.label) + "</button>";
    } else {
      html += "<button type='button' onclick='makeChoice(" + index + ")'>" + escapeHtml(choice.label) + "</button>";
    }
  });
  html += "</div>";

  storyCard.innerHTML = html;
  updateUndoButton();
}

function makeChoice(choiceIndex) {
  var scene = scenes[currentScene];
  if (!scene || !scene.choices[choiceIndex]) {
    return;
  }

  var choice = scene.choices[choiceIndex];
  if (typeof choice.onPick === "function") {
    choice.onPick();
  }

  historyStack.push(currentScene);
  currentScene = resolveSpecialNext(choice.next);
  showScene();
}

function undoLastChoice() {
  if (historyStack.length === 0) {
    return;
  }

  currentScene = historyStack.pop();
  showScene();
}

function updateUndoButton() {
  var undoButton = document.getElementById("undoButton");
  if (!undoButton) {
    return;
  }

  undoButton.disabled = historyStack.length === 0;
}

function setupNavbar() {
  var toggle = document.getElementById("navbarToggle");
  var nav = document.getElementById("topNavbar");
  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", function (event) {
    if (window.matchMedia("(max-width: 768px)").matches && nav.classList.contains("nav-open") && !nav.contains(event.target)) {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function renderSimpleTimelineList() {
  var list = document.getElementById("timelineList");
  if (!list) {
    return;
  }

  var html = "";
  historyStack.forEach(function (sceneId) {
    if (!scenes[sceneId]) {
      return;
    }
    html += "<li>" + escapeHtml(scenes[sceneId].title) + "</li>";
  });

  if (scenes[currentScene]) {
    html += "<li><strong>" + escapeHtml(scenes[currentScene].title) + " (Current)</strong></li>";
  }

  if (!html) {
    html = "<li><strong>Start your quest to build the timeline.</strong></li>";
  }

  list.innerHTML = html;
}

function openTimelineModal() {
  var modal = document.getElementById("timelineModal");
  if (!modal) {
    return;
  }
  renderSimpleTimelineList();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function handleTimelineModalBackdrop(event) {
  if (event && event.target && event.target.id === "timelineModal") {
    closeTimelineModal();
  }
}

function closeTimelineModal() {
  var modal = document.getElementById("timelineModal");
  if (!modal) {
    return;
  }
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
function adjustTimelineZoom() {}
function revealTimelinePossibilities() {}
function handleInventoryModalBackdrop() {}
function closeInventoryModal() {}

document.addEventListener("DOMContentLoaded", function () {
  setupNavbar();
  if (typeof applyResolutionTierStyling === "function") {
    applyResolutionTierStyling();
    window.addEventListener("resize", applyResolutionTierStyling);
  }
});
