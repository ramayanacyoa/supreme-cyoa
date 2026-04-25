var currentScene = 0;
var playerName = "";
var fatherName = "";
var motherName = "";
var wifeName = "";
var siblingOneName = "";
var siblingTwoName = "";
var siblingThreeName = "";
var siblingOneGender = "male";
var siblingTwoGender = "male";
var siblingThreeGender = "male";
var secondMotherName = "";
var broughtLakshmana = false;
var wentAlone = false;
var historyStack = [];
// var familySetupEnabled = false;
// var familySetupActivatedOnce = false;
// var customNames = null;

console.log("Update 24");

var scenes = {
  1: {
    title: "The Ramayana Begins",
    text: [
      "Welcome, {{name}}!",
      "{{name}}, you are the prince of Ayodhya, and the kingdom is preparing to celebrate your coronation as {{fatherName}} grows old.",
      "Before dawn, {{secondMotherName}} invokes old promises and demands that {{siblingTwoName}} receive the throne while you, {{name}}, are sent into exile.",
      "To protect dharma and your father's honor, you accept a life of hardship and vow that you, {{name}}, will not enter any city until the exile ends."
    ],
    choices: [
      { label: "Argue back", next: 3 },
      { label: "Accept the exile", next: 4 }
    ]
  },
  3: {
    title: "You choose to argue back.",
    text: [
      "{{name}}, your words shake the royal court, and {{fatherName}} briefly gathers strength to challenge {{secondMotherName}}'s demand.",
      "Even so, the king remains bound by his oath, and you, {{name}}, realize exile is unavoidable if honor is to survive."
    ],
    choices: [{ label: "Continue", next: 4 }]
  },
  4: {
    title: "You choose to accept the exile.",
    text: [
      "{{name}}, you lay aside royal ornaments and prepare for forest life with calm resolve.",
      "{{siblingOneName}} swears loyalty and {{wifeName}} refuses to stay behind, telling you that your path, {{name}}, is now their path as well."
    ],
    choices: [
      { label: "Argue back again", next: 69 },
      { label: "Continue", next: 70 }
    ]
  },
  69: {
    title: "{{secondMotherName}}'s Final Command",
    text: [
      "{{name}}, your second refusal is treated as rebellion in open court.",
      "Under {{secondMotherName}}'s demand, the guards carry out a swift execution before {{fatherName}} can stop it."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  70: {
    title: "A Family Plea",
    text: [
      "{{motherName}}, {{siblingOneName}}, and {{siblingThreeName}} beg you not to go into exile.",
      "{{siblingTwoName}} stays silent; {{siblingTwoPossessive}} mother, {{secondMotherName}}, forbids {{siblingTwoObject}} from pleading against the exile order."
    ],
    choices: [{ label: "Continue", next: 71 }]
  },
  71: {
    title: "Who Goes With You?",
    text: [
      "You steady yourself and choose whether to walk into exile alone or with {{siblingOneName}} and {{wifeName}}."
    ],
    choices: [
      { label: "Go alone", next: 5, onPick: function () { wentAlone = true; } },
      { label: "Go with them", next: 6, onPick: function () { wentAlone = false; } }
    ]
  },
  5: {
    title: "You choose to go alone.",
    text: [
      "{{name}}, you leave Ayodhya alone, carrying only a bow, memory, and duty.",
      "Each step into the forest deepens the silence around you, but your vow remains unbroken."
    ],
    choices: [{ label: "Continue", next: 66 }]
  },
  6: {
    title: "You choose to go with them.",
    text: [
      "{{name}}, with {{wifeName}} and {{siblingOneName}} at your side, exile becomes a shared pilgrimage instead of a lonely punishment.",
      "Together you cross rivers, build shelter, and learn the rhythms of forest life."
    ],
    choices: [{ label: "Continue", next: 66 }]
  },
  7: {
    title: "Surphanaka's Encounter",
    text: [
      "In the dappled forest light, Surphanaka appears and circles your camp, studying you, {{name}}, with dangerous fascination.",
      "When rejected, she turns her anger toward {{wifeName}}. {{name}}, how will you answer this threat?"
    ],
    dialogue: [
      { speaker: "Surphanaka", line: "\"Hand over {{wifeName}}, and I may spare your camp.\"" },
      { speaker: "{{name}}", line: "\"Stand down. You will not threaten my family.\"" }
    ],
    choices: [
      { label: "Fight Surphanaka", next: 9 },
      { label: "Protect {{wifeName}}", next: 10 },
      { label: "Negotiate", next: 11 },
      { label: "Accept the marriage", next: 12 }
    ]
  },
  8: {
    title: "Surphanaka's Encounter",
    text: [
      "Traveling alone, you, {{name}}, are approached by Surphanaka, who proposes an alliance through marriage.",
      "Her smile hides a storm. Will you accept or reject?"
    ],
    choices: [
      { label: "Accept", next: 12 },
      { label: "Reject", next: 13 }
    ]
  },
  9: {
    title: "Fight Surphanaka",
    text: [
      "{{name}}, steel meets claw as the forest erupts in a swift and brutal clash.",
      "Your fate turns on one fierce exchange."
    ],
    choices: [{ label: "Fight", next: -1 }]
  },
  10: {
    title: "Protect {{wifeName}}",
    text: [
      "{{name}}, you and {{siblingOneName}} form a shield around {{wifeName}} and drive Surphanaka back.",
      "She retreats in fury, promising revenge."
    ],
    choices: [{ label: "Continue", next: 19 }]
  },
  11: {
    title: "Negotiate with Surphanaka",
    text: [
      "{{name}}, you lower your weapon and try words before war, appealing to reason over rage.",
      "Surphanaka listens, but her pride burns hotter than your diplomacy."
    ],
    choices: [
      { label: "Try again", next: 15 },
      { label: "Prepare to fight", next: 9 }
    ]
  },
  12: {
    title: "Accept Surphanaka's Proposal",
    text: [
      "{{name}}, you accept her proposal to buy time and insight, stepping into a dangerous game.",
      "Soon you are escorted to Lanka to stand before Ravana himself."
    ],
    choices: [{ label: "Meet Ravana", next: 16 }]
  },
  13: {
    title: "Reject Surphanaka's Proposal",
    text: [
      "{{name}}, your refusal lands like a blade, and Surphanaka answers with open fury.",
      "The forest goes still as battle becomes inevitable."
    ],
    choices: [{ label: "Fight Surphanaka", next: 9 }]
  },
  14: {
    title: "Victory",
    text: [
      "{{name}}, you survive the confrontation and push forward, though the warning signs of larger conflict are now impossible to ignore."
    ],
    choices: [{ label: "Continue", next: 19 }]
  },
  15: {
    title: "Negotiation Fails",
    text: [
      "{{name}}, your final effort to avoid bloodshed collapses.",
      "Words end, and the forest prepares for violence."
    ],
    choices: [{ label: "Fight Surphanaka", next: 9 }]
  },
  16: {
    title: "Meeting Ravana",
    text: [
      "Ravana greets you with charm and menace, offering you, {{name}}, power, luxury, and a throne to abandon your vow."
    ],
    choices: [{ label: "Claim the throne", next: 17 }]
  },
  17: {
    title: "Evil King Ending",
    text: [
      "{{name}}, you accept Ravana's bargain and gain a crown at the price of righteousness.",
      "Your legend survives, but not as a hero's."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  18: {
    title: "Game Over",
    text: [
      "{{name}}, you fought bravely, but destiny closes this path.",
      "Another choice may yet restore your story."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  19: {
    title: "The Golden Deer",
    text: [
      "A radiant golden deer appears near the hut, moving like moonlight through leaves.",
      "{{wifeName}} asks you, {{name}}, to bring it back, unaware that illusion has already entered your home."
    ],
    dialogue: [
      { speaker: "{{wifeName}}", line: "\"That deer is beautiful, {{name}}. Please catch it for us.\"" },
      { speaker: "{{name}}", line: "\"Stay alert while I decide. Something feels wrong.\"" }
    ],
    choices: [
      { label: "Chase the deer", next: 20 },
      { label: "Ignore it", next: 21 }
    ]
  },
  20: {
    title: "Bring {{siblingOneName}}?",
    text: [
      "{{siblingOneName}} offers to accompany you, {{name}}, worried by the deer's unnatural beauty.",
      "Do you bring {{siblingOneObject}} or leave {{siblingOneObject}} to guard {{wifeName}}?"
    ],
    choices: [
      { label: "Yes, bring {{siblingOneName}}", next: 22, onPick: function () { broughtLakshmana = true; } },
      { label: "No, leave {{siblingOneObject}} with {{wifeName}}", next: 23, onPick: function () { broughtLakshmana = false; } }
    ]
  },
  21: {
    title: "You Ignore the Deer",
    text: [
      "{{name}}, you distrust the illusion and refuse the chase.",
      "For now, the danger withdraws and your family remains together."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  22: {
    title: "Find the Deer",
    text: [
      "{{name}}, you and {{siblingOneName}} track the deer deep into shadowed groves where every glimmer feels staged."
    ],
    choices: [{ label: "Keep following it", next: 24 }]
  },
  23: {
    title: "Find the Deer",
    text: [
      "{{name}}, you pursue the deer alone, trusting speed over caution."
    ],
    choices: [{ label: "Keep following it", next: 24 }]
  },
  24: {
    title: "Shoot the Deer",
    text: [
      "Your arrow lands true, and the golden illusion tears away to reveal Maricha.",
      "{{name}}, you now understand this chase was a trap from the beginning."
    ],
    choices: [{ label: "Continue", next: 25 }]
  },
  25: {
    title: "Maricha's Last Cry",
    text: [
      "With his final breath, Maricha mimics your voice and cries for help.",
      "{{name}}, the sound races toward your hut, meant to break trust at the worst possible moment."
    ],
    choices: [{ label: "Continue", next: 26 }]
  },
  26: {
    title: "Ravana Sees His Chance",
    text: [
      "As you race back, Ravana takes disguise and moves toward your dwelling.",
      "By the time danger peaks, only fate and vigilance stand between your family and calamity."
    ],
    choices: [{ label: "Continue", next: 29 }]
  },
  27: {
    title: "{{siblingOneName}} Draws the Line",
    text: [
      "{{siblingOneName}} leaves a protective warning before stepping away, torn between obedience and unease.",
      "He prays that this line will hold until you return, {{name}}."
    ],
    choices: [{ label: "Continue", next: 28 }]
  },
  28: {
    title: "Ravana's Trick",
    text: [
      "Disguised as a holy seeker, Ravana asks for alms and manipulates sacred duty.",
      "{{wifeName}} hesitates between caution and compassion."
    ],
    choices: [{ label: "See what happens", next: -2 }]
  },
  29: {
    title: "The Abduction of {{wifeName}}",
    text: [
      "Ravana drops his disguise, reveals his terrifying form, and seizes {{wifeName}}.",
      "By the time you, {{name}}, return, the forest carries only echoes and broken signs of struggle."
    ],
    dialogue: [
      { speaker: "{{wifeName}}", line: "\"{{name}}! {{siblingOneName}}! Help me!\"" },
      { speaker: "Ravana", line: "\"Cry out if you must. Lanka will still claim you.\"" }
    ],
    choices: [{ label: "Continue", next: 30 }]
  },
  30: {
    title: "Jatayu Sees Ravana",
    text: [
      "From the sky, Jatayu witnesses the abduction and recognizes your family in peril.",
      "The old warrior-bird must decide in an instant whether to intervene."
    ],
    choices: [
      { label: "Do nothing", next: 31 },
      { label: "Try to rescue {{wifeName}}", next: 32 }
    ]
  },
  31: {
    title: "{{wifeName}} is Taken",
    text: [
      "Ravana escapes with {{wifeName}}, and your grief becomes purpose.",
      "{{name}}, the rescue mission begins."
    ],
    choices: [{ label: "Keep searching", next: 65 }]
  },
  32: {
    title: "Jatayu's Rescue Attempt",
    text: [
      "Jatayu rises against Ravana in a desperate sky battle, wings beating against impossible odds."
    ],
    choices: [{ label: "See what happens", next: -3 }]
  },
  33: {
    title: "Jatayu Rescues {{wifeName}}",
    text: [
      "Against all expectation, Jatayu tears {{wifeName}} free and Ravana crashes nearby.",
      "{{name}}, you have a final chance to finish this now."
    ],
    choices: [{ label: "Go after Ravana", next: 36 }]
  },
  34: {
    title: "Jatayu Falls",
    text: [
      "Jatayu is struck down after a heroic stand, and {{wifeName}} is still carried away.",
      "His sacrifice leaves you, {{name}}, with grief and a vital clue."
    ],
    choices: [{ label: "Continue", next: 37 }]
  },
  36: {
    title: "Fight Ravana in the Forest",
    text: [
      "{{name}}, you confront Ravana beside his shattered chariot in a duel of fury and conviction."
    ],
    choices: [{ label: "Fight Ravana", next: 38 }]
  },
  37: {
    title: "{{wifeName}} is Taken",
    text: [
      "{{name}}, you and {{siblingOneName}} begin searching immediately, following broken branches, chariot marks, and fading cries."
    ],
    choices: [{ label: "Keep searching", next: 65 }]
  },
  38: {
    title: "Forest Duel Ending",
    text: [
      "{{name}}, you win a brutal forest duel and protect {{wifeName}} before Ravana can flee.",
      "This path ends in sudden victory."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  39: {
    title: "{{siblingOneName}} Saves {{wifeName}}",
    text: [
      "{{siblingOneName}}'s discipline holds; Ravana retreats and {{wifeName}} remains safe.",
      "{{name}}, your household survives this test."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  40: {
    title: "Meeting Sugriva",
    text: [
      "While searching for {{wifeName}}, you, {{name}}, meet Sugriva, an exiled vanara prince seeking justice against Vali."
    ],
    dialogue: [
      { speaker: "Sugriva", line: "\"Help me reclaim my honor, and I will help you find {{wifeName}}.\"" }
    ],
    choices: [{ label: "Hear Sugriva's request", next: 41 }]
  },
  41: {
    title: "Sugriva's Plea",
    text: [
      "Sugriva recounts betrayal and exile, asking you, {{name}}, to help him reclaim honor and kingdom."
    ],
    choices: [{ label: "Consider his plan", next: 42 }]
  },
  42: {
    title: "Your Exile Vow",
    text: [
      "Bound by your forest vow, you refuse to enter the city and instead design an ambush beyond its walls."
    ],
    choices: [{ label: "Set the trap", next: 43 }]
  },
  43: {
    title: "Sugriva Challenges Vali",
    text: [
      "As Sugriva and Vali clash, you, {{name}}, must identify the critical truth before releasing your arrow."
    ],
    choices: [
      { label: "Sugriva's wife", next: 44 },
      { label: "Sugriva's bow", next: 45 },
      { label: "Sugriva's horse", next: 46 }
    ]
  },
  44: {
    title: "Vali Falls",
    text: [
      "Your arrow strikes true, Vali falls, and Sugriva's exile ends.",
      "In gratitude, he commits his forces to your cause, {{name}}."
    ],
    choices: [{ label: "Meet Sugriva's ally", next: 47 }]
  },
  45: {
    title: "You Miss the Moment",
    text: [
      "{{name}}, hesitation breaks the plan and Vali escapes the trap."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  46: {
    title: "You Miss the Moment",
    text: [
      "Your call is wrong, and Sugriva retreats wounded.",
      "{{name}}, the alliance collapses on this path."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  47: {
    title: "Meeting Hanuman",
    text: [
      "Hanuman bows and pledges unwavering service, recognizing your purpose, {{name}}, as righteous and urgent.",
      "Before marching, he invites you to a training ground challenge to sharpen your focus."
    ],
    choices: [{ label: "Go to Training Ground", next: 48 }]
  },
  48: {
    title: "Training Ground Trivia",
    text: [
      "At a clearing marked with practice dummies and banner poles, Hanuman runs a quick readiness drill for you, {{name}}.",
      "Trivia Question: Who is known as the devoted sibling who accompanies you into exile?"
    ],
    choices: [
      { label: "{{siblingOneName}}", next: 50 },
      { label: "{{siblingThreeName}}", next: 51 },
      { label: "Vali", next: 51 }
    ]
  },
  50: {
    title: "Training Ground Result",
    text: [
      "Correct, {{name}}. Hanuman smiles and says your memory is as sharp as your aim.",
      "Your allies leave the training ground with stronger morale."
    ],
    choices: [{ label: "Proceed to War Council", next: 54 }]
  },
  51: {
    title: "Training Ground Result",
    text: [
      "Not quite, {{name}}. Hanuman reviews the key companions of your journey before the campaign continues.",
      "Even mistakes can prepare a leader for war."
    ],
    choices: [{ label: "Proceed to War Council", next: 54 }]
  },
  52: {
    title: "Peaceful Ending",
    text: [
      "{{name}}, traveling alone, you survive Surphanaka's challenge and complete exile in rare peace.",
      "This quieter legend ends far from court and war."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  54: {
    title: "The Ramayana Adventure: Lanka",
    text: [
      "Coming Soon"
    ],
    dialogue: [
      { speaker: "Hanuman", line: "\"Give the word, and we leap for Lanka tonight.\"" },
      { speaker: "{{name}}", line: "\"We move with courage and discipline. Everyone returns together.\"" }
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  65: {
    title: "Searching for {{wifeName}}",
    text: [
      "{{name}}, you search ravines, groves, and riverbanks for signs of {{wifeName}} until clues lead you toward new allies."
    ],
    choices: [{ label: "Continue to Sugriva", next: 40 }]
  },
  66: {
    title: "{{siblingTwoName}} at the Hut",
    text: [
      "Soon after exile begins, {{siblingTwoName}} reaches your forest hut and pleads once more: return and rule Ayodhya, {{name}}.",
      "You honor him, renew your vow, and ask him to safeguard the kingdom until your exile ends before you continue deeper into the forest."
    ],
    choices: [
      { label: "Entrust him with your sandals", next: 68 },
      { label: "Ask him to carry a message to Ayodhya", next: 68 }
    ]
  },
  67: {
    title: "Ayodhya Return Ending",
    text: [
      "{{name}}, you return early and the epic turns into palace intrigue instead of a rescue quest."
    ],
    choices: [{ label: "Restart", restart: true }]
  },
  68: {
    title: "The Sandals Promise",
    text: [
      "{{siblingTwoName}} accepts your sandals as a symbol of rightful rule and departs in tears.",
      "{{name}}, once {{siblingTwoName}} departs, your exile journey resumes and the forest's first major threat approaches."
    ],
    choices: [{ label: "Continue", next: -4 }]
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
  playerName = "";
  fatherName = "";
  motherName = "";
  wifeName = "";
  siblingOneName = "";
  siblingTwoName = "";
  siblingThreeName = "";
  siblingOneGender = "male";
  siblingTwoGender = "male";
  siblingThreeGender = "male";
  secondMotherName = "";
  broughtLakshmana = false;
  wentAlone = false;
  historyStack = [];
  clearStoryCard();
  updateUndoButton();
}

function getCanonNames() {
  return {
    playerName: "Rama",
    fatherName: "Dasharatha",
    motherName: "Kausalya",
    wifeName: "Sita",
    siblingOneName: "Lakshmana",
    siblingTwoName: "Bharata",
    siblingThreeName: "Shatrughna",
    siblingOneGender: "male",
    siblingTwoGender: "male",
    siblingThreeGender: "male",
    secondMotherName: "Kaikeyi"
  };
}

// Family setup feature intentionally disabled.
// function readCustomNamesFromInputs() {}

function assignNames(nameSet) {
  playerName = nameSet.playerName;
  fatherName = nameSet.fatherName;
  motherName = nameSet.motherName;
  wifeName = nameSet.wifeName;
  siblingOneName = nameSet.siblingOneName;
  siblingTwoName = nameSet.siblingTwoName;
  siblingThreeName = nameSet.siblingThreeName;
  siblingOneGender = nameSet.siblingOneGender;
  siblingTwoGender = nameSet.siblingTwoGender;
  siblingThreeGender = nameSet.siblingThreeGender;
  secondMotherName = nameSet.secondMotherName;
}

// Family setup feature intentionally disabled.
// function applyFamilySetupState() {}
// function toggleFamilySetup() {}

function startAdventure() {
  var baseNameInput = document.getElementById("playerName");
  var basePlayerName = baseNameInput && baseNameInput.value.trim() ? baseNameInput.value.trim() : "Rama";
  var canonNames = getCanonNames();
  canonNames.playerName = basePlayerName;
  assignNames(canonNames);

  historyStack = [];
  currentScene = 1;
  var soundtrack = document.getElementById("backgroundMusic");
  if (soundtrack) {
    soundtrack.volume = 0.5;
    soundtrack.muted = false;
    if (window.sessionStorage) {
      window.sessionStorage.setItem("ramayanaMusicState", JSON.stringify({
        currentTime: soundtrack.currentTime || 0,
        volume: 0.5,
        muted: false,
        paused: soundtrack.paused
      }));
    }
    var playAttempt = soundtrack.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(function () {});
    }
  }
  if (window.localStorage) {
    window.localStorage.setItem("ramayanaMusicVolume", "50");
  }
  showScene();
  var storyCard = document.getElementById("storyCard");
  if (storyCard && typeof storyCard.scrollIntoView === "function") {
    storyCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
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

  if (next === -4) {
    return wentAlone ? 8 : 7;
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

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCharacterNames() {
  var names = [
    playerName || "Rama",
    fatherName || "Dasharatha",
    motherName || "Kausalya",
    wifeName || "Sita",
    siblingOneName || "Lakshmana",
    siblingTwoName || "Bharata",
    siblingThreeName || "Shatrughna",
    secondMotherName || "Kaikeyi",
    "Ravana",
    "Hanuman",
    "Sugriva",
    "Vali",
    "Jatayu",
    "Surphanaka",
    "Maricha",
    "Vibhishana",
    "Kumbhakarna",
    "Mandodari",
    "Manthara",
    "Sumitra",
    "Lava",
    "Kush",
    "Angada",
    "Sampati",
    "Jambaavan"
  ];

  return names
    .filter(function (name) { return typeof name === "string" && name.trim(); })
    .filter(function (name, index, list) { return list.indexOf(name) === index; })
    .sort(function (a, b) { return b.length - a.length; });
}

function formatStoryHtml(text) {
  var output = escapeHtml(interpolatePlayerName(text));
  getCharacterNames().forEach(function (name) {
    var escapedName = escapeHtml(name);
    var pattern = new RegExp(escapeRegExp(escapedName), "g");
    output = output.replace(pattern, "<span class='character-name'>" + escapedName + "</span>");
  });
  return output;
}

function interpolatePlayerName(text) {
  var siblingOneSubject = siblingOneGender === "female" ? "she" : "he";
  var siblingOneObject = siblingOneGender === "female" ? "her" : "him";
  var siblingOnePossessive = siblingOneGender === "female" ? "her" : "his";
  var siblingTwoSubject = siblingTwoGender === "female" ? "she" : "he";
  var siblingTwoObject = siblingTwoGender === "female" ? "her" : "him";
  var siblingTwoPossessive = siblingTwoGender === "female" ? "her" : "his";
  var siblingThreeSubject = siblingThreeGender === "female" ? "she" : "he";
  var siblingThreeObject = siblingThreeGender === "female" ? "her" : "him";
  var siblingThreePossessive = siblingThreeGender === "female" ? "her" : "his";
  var replacements = {
    "{{name}}": playerName || "Rama",
    "{{fatherName}}": fatherName || "Dasharatha",
    "{{motherName}}": motherName || "Kausalya",
    "{{wifeName}}": wifeName || "Sita",
    "{{siblingOneName}}": siblingOneName || "Lakshmana",
    "{{siblingTwoName}}": siblingTwoName || "Bharata",
    "{{siblingThreeName}}": siblingThreeName || "Shatrughna",
    "{{secondMotherName}}": secondMotherName || "Kaikeyi",
    "{{siblingOneSubject}}": siblingOneSubject,
    "{{siblingOneObject}}": siblingOneObject,
    "{{siblingOnePossessive}}": siblingOnePossessive,
    "{{siblingTwoSubject}}": siblingTwoSubject,
    "{{siblingTwoObject}}": siblingTwoObject,
    "{{siblingTwoPossessive}}": siblingTwoPossessive,
    "{{siblingThreeSubject}}": siblingThreeSubject,
    "{{siblingThreeObject}}": siblingThreeObject,
    "{{siblingThreePossessive}}": siblingThreePossessive
  };

  var output = text;
  Object.keys(replacements).forEach(function (key) {
    output = output.replaceAll(key, replacements[key]);
  });
  return output;
}

function showScene() {
  var storyCard = document.getElementById("storyCard");
  if (!storyCard || !scenes[currentScene]) {
    return;
  }

  var scene = scenes[currentScene];
  var sceneTitle = formatStoryHtml(scene.title);
  var html = "<div id='storyCardToolbar'><button id='undoButton' class='art-button undo-art' type='button' onclick='undoLastChoice()' aria-label='Undo' data-tooltip='undo'>Undo</button><button type='button' onclick='openTimelineModal()' aria-label='Open my storyline'>My Storyline</button></div>";

  if (currentScene === 1) {
    html += "<h1>" + sceneTitle + "</h1>";
  } else {
    html += "<h2>" + sceneTitle + "</h2>";
  }

  scene.text.forEach(function (paragraph) {
    html += "<p>" + formatStoryHtml(paragraph) + "</p>";
  });

  if (Array.isArray(scene.dialogue)) {
    html += "<div class='scene-dialogue' aria-label='Scene dialogue'>";
    scene.dialogue.forEach(function (entry) {
      html += "<p><strong>" + formatStoryHtml(entry.speaker) + ":</strong> " + formatStoryHtml(entry.line) + "</p>";
    });
    html += "</div>";
  }

  html += "<div id='choices'>";
  scene.choices.forEach(function (choice, index) {
    if (choice.restart) {
      html += "<button type='button' onclick='restart()' aria-label='Restart'>" + escapeHtml(choice.label) + "</button>";
    } else {
      html += "<button type='button' onclick='makeChoice(" + index + ")'>" + formatStoryHtml(choice.label) + "</button>";
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

function setupVolumeSlider() {
  var audio = document.getElementById("backgroundMusic");
  if (!audio) {
    return;
  }

  var state = null;
  if (window.sessionStorage) {
    try {
      state = JSON.parse(window.sessionStorage.getItem("ramayanaMusicState") || "null");
    } catch (error) {
      state = null;
    }
  }

  var storedVolume = window.localStorage ? Number(window.localStorage.getItem("ramayanaMusicVolume")) : NaN;
  var fallbackVolume = Number.isFinite(storedVolume) ? Math.max(0, Math.min(1, storedVolume / 100)) : 0.65;
  var restoredVolume = state && Number.isFinite(state.volume) ? Math.max(0, Math.min(1, state.volume)) : fallbackVolume;
  audio.volume = restoredVolume;
  audio.muted = !!(state && state.muted);

  if (state && Number.isFinite(state.currentTime)) {
    audio.addEventListener("loadedmetadata", function onLoadedMetadata() {
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.currentTime = Math.max(0, state.currentTime);
    });
  }

  if (!state || !state.paused) {
    var autoplayAttempt = audio.play();
    if (autoplayAttempt && typeof autoplayAttempt.catch === "function") {
      autoplayAttempt.catch(function () {});
    }
  }

  function persistMusicState() {
    if (window.localStorage) {
      window.localStorage.setItem("ramayanaMusicVolume", String(Math.round(audio.volume * 100)));
    }
    if (window.sessionStorage) {
      window.sessionStorage.setItem("ramayanaMusicState", JSON.stringify({
        currentTime: audio.currentTime || 0,
        volume: audio.volume,
        muted: audio.muted,
        paused: audio.paused
      }));
    }
  }

  audio.addEventListener("timeupdate", persistMusicState);
  audio.addEventListener("volumechange", persistMusicState);
  audio.addEventListener("pause", persistMusicState);
  audio.addEventListener("play", persistMusicState);
  window.addEventListener("pagehide", persistMusicState);
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
    html += "<li><strong>" + formatStoryHtml(scenes[sceneId].title) + "</strong><p class='timeline-scene-description'>" + formatStoryHtml(scenes[sceneId].text.join(" ")) + "</p></li>";
  });

  if (scenes[currentScene]) {
    html += "<li class='timeline-current-scene'><strong>" + formatStoryHtml(scenes[currentScene].title) + " (Current)</strong><p class='timeline-scene-description'>" + formatStoryHtml(scenes[currentScene].text.join(" ")) + "</p></li>";
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
  setupVolumeSlider();
  if (typeof applyResolutionTierStyling === "function") {
    applyResolutionTierStyling();
    window.addEventListener("resize", applyResolutionTierStyling);
  }
});
