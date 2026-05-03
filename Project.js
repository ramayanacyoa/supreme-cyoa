var preludeText = "Fulfill your dharma, and let your deeds become legend.";
// the variable defines the prelude text
console.log("Update 1.0.6")
console.log("Update 1.0.7")
console.log("Update 1.0.8")
console.log("Update 1.0.9")
console.log("Update 1.0.10")
console.log("Update 1.0.11")
var currentScene = 0;
var playerName = "";
var broughtLakshmana = false;
var wentAlone = false;
var historyStack = [];
var timelineEntries = [];
var timelineRevealAll = false;
var selectedHero = "rama";
var familyCast = {
  fatherName: "Dasharatha",
  motherName: "Kausalya",
  wifeName: "Sita",
  siblingOneName: "Lakshmana",
  siblingTwoName: "Bharata",
  siblingThreeName: "Shatrughna",
  secondMotherName: "Kaikeyi"
};

var heroProfiles = {
  rama: { defaultName: "Rama", fatherName: "Dasharatha", motherName: "Kausalya", wifeName: "Sita", siblingOneName: "Lakshmana", siblingTwoName: "Bharata", siblingThreeName: "Shatrughna", secondMotherName: "Kaikeyi" },
  lakshmana: { defaultName: "Lakshmana", fatherName: "Dasharatha", motherName: "Sumitra", wifeName: "Urmila", siblingOneName: "Rama", siblingTwoName: "Bharata", siblingThreeName: "Shatrughna", secondMotherName: "Kaikeyi" },
  bharata: { defaultName: "Bharata", fatherName: "Dasharatha", motherName: "Kaikeyi", wifeName: "Mandavi", siblingOneName: "Rama", siblingTwoName: "Lakshmana", siblingThreeName: "Shatrughna", secondMotherName: "Kausalya" },
  ravana: { defaultName: "Ravana", fatherName: "Vishrava", motherName: "Kaikesi", wifeName: "Mandodari", siblingOneName: "Kumbhakarna", siblingTwoName: "Vibhishana", siblingThreeName: "Surphanaka", secondMotherName: "Pushpotkata" },
  sita: { defaultName: "Sita", fatherName: "Janaka", motherName: "Sunaina", wifeName: "Rama", siblingOneName: "Urmila", siblingTwoName: "Mandavi", siblingThreeName: "Shrutakirti", secondMotherName: "Kausalya" }
};
// defining all base story variables

var systemState = {
  version: "2.1.0",
  traits: { dharma: 50, aggression: 20, compassion: 50, strategy: 40, honor: 55 },
  affection: { sita: 70, lakshmana: 75, hanuman: 50, sugriva: 35, vibhishana: 20, bharata: 80 },
  relationshipStates: {},
  resources: { food: 100, wood: 40, stone: 20, faith: 30, intel: 5 },
  world: { chapter: "banwas", activeEvent: null },
  inventory: []
};

var progressionState = { day: 1, timeOfDay: "Day" };

function evaluateRelationshipStates() {
  Object.keys(systemState.affection).forEach(function (id) {
    var value = systemState.affection[id];
    systemState.relationshipStates[id] = value >= 85 ? "oathbound" : value >= 65 ? "trusted" : value >= 20 ? "strained" : "fractured";
  });
}

evaluateRelationshipStates();

var GAME_EVENTS = { SCENE_LOAD: "onSceneLoad", CHOICE_MADE: "onChoiceMade", ITEM_ACQUIRED: "onItemAcquired", QUEST_UPDATED: "onQuestUpdated", COMBAT_START: "onCombatStart" };
var gameState = null;
var isRoutingSceneUpdate = false;
var rpgPanelsVisible = false;
var aiSceneSeed = 10000;
var dayNightMode = "game";
var accountState = { username: "", createdAt: null, settings: { realtimeWorld: true, travelEncounters: true, dreams: true } };
var worldClock = { lastActiveAt: Date.now(), phase: "Dawn", totalHours: 0, storyPhase: "Origin Phase" };
var travelEncounters = ["Sage", "Old Man", "Poor Family", "Demon", "Hunting Ground", "Merchant", "Village"];

function getSceneIdFromUrl() {
  var fromPath = window.location.pathname.match(/\/scene\/(\d+)\/?$/);
  if (fromPath && fromPath[1]) return Number(fromPath[1]);
  var params = new URLSearchParams(window.location.search);
  var fromQuery = Number(params.get("scene"));
  if (!Number.isNaN(fromQuery) && fromQuery > 0) return fromQuery;
  var fromHash = Number((window.location.hash || "").replace("#scene-", ""));
  if (!Number.isNaN(fromHash) && fromHash > 0) return fromHash;
  return null;
}

function syncSceneRoute(replaceMode) {
  if (!window.history || !window.history.pushState || !scenes[currentScene]) return;
  var sceneId = currentScene;
  var params = new URLSearchParams(window.location.search);
  params.set("scene", String(sceneId));
  var query = params.toString();
  var nextUrl = window.location.pathname + (query ? "?" + query : "") + "#scene-" + sceneId;
  var method = replaceMode ? "replaceState" : "pushState";
  window.history[method]({ sceneId: sceneId }, "", nextUrl);
}

function applySceneFromRoute() {
  var routedScene = getSceneIdFromUrl();
  if (!routedScene || !scenes[routedScene]) return;
  currentScene = routedScene;
  showScene();
}

function createInitialGameState(name) {
  return { player: { name: name || "Rama", health: 100, energy: 100, stats: { dharma: 50, aggression: 20, compassion: 50, wisdom: 10, knowledge: 10 }, affection: { sita: 70, lakshmana: 75, hanuman: 50, sugriva: 35, vibhishana: 20, bharata: 80 }, inventory: {} }, quests: { main: { exilePath: { id: "exilePath", title: "Path of Exile", type: "main", state: "active" } }, side: {}, hidden: {} }, world: { flags: {}, activeEvent: null }, scene: { current: 1, history: [] }, ui: { moralLog: [] } };
}

var eventBus = { listeners: {}, on: function (name, handler) { (this.listeners[name] = this.listeners[name] || []).push(handler); }, emit: function (name, payload) { (this.listeners[name] || []).forEach(function (handler) { handler(payload); }); } };

function registerCoreSystems() {
  eventBus.on(GAME_EVENTS.CHOICE_MADE, function (ctx) {
    var label = (ctx && ctx.choice && ctx.choice.label) || "";
    if (/accept|protect|honor|entrust|message/i.test(label)) { gameState.player.stats.dharma += 3; gameState.player.stats.compassion += 2; gameState.ui.moralLog.unshift("Your actions reflect rising compassion."); }
    else if (/fight|argue/i.test(label)) { gameState.player.stats.aggression += 4; gameState.player.stats.dharma -= 1; gameState.ui.moralLog.unshift("Your aggression is influencing dialogue options."); }
    gameState.player.stats.dharma = Math.max(0, Math.min(100, gameState.player.stats.dharma));
    gameState.player.stats.aggression = Math.max(0, Math.min(100, gameState.player.stats.aggression));
    gameState.player.stats.compassion = Math.max(0, Math.min(100, gameState.player.stats.compassion));
    if (gameState.ui.moralLog.length > 5) gameState.ui.moralLog.length = 5;
  });
  eventBus.on(GAME_EVENTS.SCENE_LOAD, function () {
    if (gameState.player.stats.dharma >= 65 && !gameState.quests.hidden.righteousPath) gameState.quests.hidden.righteousPath = { id: "righteousPath", title: "Righteous Path", type: "hidden", state: "active" };
    if ((gameState.player.affection.hanuman || 0) >= 70 && !gameState.quests.side.hanumanRescue) gameState.quests.side.hanumanRescue = { id: "hanumanRescue", title: "Wind-Borne Rescue", type: "side", state: "active" };
  });
}

function addItem(id, name, category, qty) {
  if (!gameState.player.inventory[id]) gameState.player.inventory[id] = { id: id, name: name, category: category, qty: 0 };
  gameState.player.inventory[id].qty += qty || 1;
  eventBus.emit(GAME_EVENTS.ITEM_ACQUIRED, { id: id });
}

//the following are all the story components of the scenes
var scenes = {
  1: {
    title: "The Ramayana Begins",
    text: [
      "Welcome, {{name}}!",
      "Tonight, destiny turns. Your chosen path will reshape the epic from your own perspective."
    ],
    choices: [
      { label: "Enter your hero's perspective", next: -10 }
    ]
  },
  86: {
    title: "Lakshmana's Oath",
    text: [
      "{{name}}, you watch Rama accept exile and feel fire in your chest.",
      "You swear before Ayodhya that no danger, demon, or hunger will touch your elder brother while you still breathe."
    ],
    choices: [{ label: "Escort Rama into exile", next: 4 }]
  },
  87: {
    title: "Bharata's Burden",
    text: [
      "{{name}}, you return to Ayodhya and learn that the throne was won through your mother {{motherName}}'s demand.",
      "Shaken by grief and shame, you reject the crown and vow to rule only as Rama's regent."
    ],
    choices: [{ label: "Go to Chitrakoot and plead", next: 70 }]
  },
  88: {
    title: "Ravana's Ambition",
    text: [
      "{{name}}, in Lanka's golden court, spies whisper of Ayodhya's fractured royal house.",
      "You decide to exploit the exile and set plans in motion long before the forest ever hears your name."
    ],
    choices: [{ label: "Set the snare in the forest", next: 66 }]
  },
  89: {
    title: "Sita's Resolve",
    text: [
      "{{name}}, while the palace trembles, you refuse comfort and ornaments.",
      "You choose the forest path willingly, believing dharma is not a place but the promise you keep beside Rama."
    ],
    choices: [{ label: "Walk into exile together", next: 6 }]
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
      "At Ayodhya's edge, you pause and decide whether to carry exile alone or share it with {{siblingOneName}} and {{wifeName}}."
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
  54: { title: "War Council at Prasravana", text: ["At sunset on Day 3, the vanara captains form a firelit ring around you. Maps of Lanka, tidal charts, and scouting notes are spread over stone.", "This is the first of many linked campaign scenes. Your doctrine now shapes combat readiness, relationships, and stat growth."], choices: [{ label: "Fortify logistics and shields", next: 72, effects: { defense: 2, endurance: 1 }, timeAdvance: 1 }, { label: "Intensive assault drills", next: 72, effects: { strength: 2, stamina: 1 }, timeAdvance: 1 }, { label: "Stealth + recon doctrine", next: 72, effects: { agility: 2, speed: 2 }, timeAdvance: 1 }] },
  72: { title: "Night Raid Simulations", text: ["Hanuman runs moonlit obstacle drills with your strike squads. Messengers report demon watchtowers rotating every half watch.", "Your command style inspires either loyalty, fear, or precision discipline."], choices: [{ label: "Lead from the front", next: 73, effects: { strength: 1, stamina: 2 }, timeAdvance: 1 }, { label: "Command from elevated strategy post", next: 73, effects: { defense: 1, endurance: 2 }, timeAdvance: 1 }, { label: "Split into specialist teams", next: 73, effects: { agility: 2, speed: 1 }, timeAdvance: 1 }] },
  73: { title: "Dawn: Hanuman's Leap", text: ["Day 4 dawn breaks crimson as Hanuman launches toward Lanka carrying your signet and command authority.", "Winds shift violently; he must choose between stealth, shock, or devotion-led diplomacy with hidden allies."], choices: [{ label: "Authorize total stealth", next: 74, effects: { agility: 1, speed: 1 }, timeAdvance: 1 }, { label: "Authorize visible provocation", next: 74, effects: { strength: 1, defense: -1 }, timeAdvance: 1 }, { label: "Authorize sacred oath approach", next: 74, effects: { endurance: 2 }, timeAdvance: 1 }] },
  74: { title: "Ashoka Vatika Contact", text: ["In the deepest grove, Hanuman meets Sita and receives her jewel token and urgent timeline: Ravana demands surrender soon.", "Her words can either steady your heart or push you toward ruthless escalation."], choices: [{ label: "Preserve civilians at all costs", next: 75, effects: { defense: 1, endurance: 1 }, timeAdvance: 1 }, { label: "Prioritize rapid extraction", next: 75, effects: { speed: 2 }, timeAdvance: 1 }, { label: "Prepare decisive invasion", next: 75, effects: { strength: 2 }, timeAdvance: 1 }] },
  75: { title: "Setu Engineering Day", text: ["Day 5 becomes a colossal labor operation. Nala and Nila direct stone placement while tides threaten to shatter early spans.", "Random encounter: A collapsing section can be saved only by immediate intervention."], choices: [{ label: "Personally brace the collapse", next: 76, effects: { strength: 2, endurance: 1 }, timeAdvance: 1 }, { label: "Use disciplined shield wall", next: 76, effects: { defense: 2, stamina: 1 }, timeAdvance: 1 }, { label: "Rapid rope traversal rescue", next: 76, effects: { agility: 2, speed: 1 }, timeAdvance: 1 }] },
  76: { title: "Night Before Landing", text: ["Torches reflect over the completed bridge. Lakshmana and Vibhishana debate whether Indrajit will force an illusion war at first light.", "Companion affection and personality now influence battle callouts and support timing."], choices: [{ label: "Trust Vibhishana's intelligence", next: 77, effects: { defense: 1, endurance: 1 }, timeAdvance: 1 }, { label: "Trust Lakshmana's aggression", next: 77, effects: { strength: 1, stamina: 1 }, timeAdvance: 1 }, { label: "Blend both plans", next: 77, effects: { agility: 1, speed: 1 }, timeAdvance: 1 }] },
  77: { title: "Boss Phase: Indrajit", text: ["Phase I: serpent-bind volleys. Phase II: invisible artillery. Phase III: ritual chamber strike window.", "You must decide whether to conserve elite units or break formation for a finishing move."], choices: [{ label: "Conserve and counter", next: 78, effects: { defense: 2, endurance: 1 }, timeAdvance: 1 }, { label: "Break formation and pressure", next: 78, effects: { strength: 2, stamina: -1 }, timeAdvance: 1 }, { label: "Flank through smoke corridors", next: 78, effects: { agility: 2, speed: 1 }, timeAdvance: 1 }] },
  78: { title: "Boss Phase: Kumbhakarna", text: ["At Day 6 dusk, Kumbhakarna crushes siege towers and vanara phalanxes alike. The field becomes a rescue-and-kill puzzle.", "Random encounter: save a trapped battalion or press for a quick kill."], choices: [{ label: "Save battalion first", next: 79, effects: { defense: 2, endurance: 2 }, timeAdvance: 1 }, { label: "Press for quick kill", next: 79, effects: { strength: 2, stamina: 1 }, timeAdvance: 1 }, { label: "Hit-and-fade harassment", next: 79, effects: { agility: 1, speed: 2 }, timeAdvance: 1 }] },
  79: { title: "Boss Phase: Ravana", text: ["Final day-night cycle begins. Ravana's ten-crowned war form rotates elemental weapons and psychological attacks.", "You choose your final doctrine, which shapes coronation perception and Uttara outcomes."], choices: [{ label: "Offer surrender once, then strike", next: 80, effects: { defense: 1, endurance: 1 }, timeAdvance: 1 }, { label: "Unleash overwhelming force", next: 80, effects: { strength: 2, stamina: 1 }, timeAdvance: 1 }, { label: "Coordinated companion lock", next: 80, effects: { agility: 2, speed: 1 }, timeAdvance: 1 }] },
  80: { title: "Return to Ayodhya: Coronation Day", text: ["After victory, you return for coronation amid celebration and scrutiny. Public perception tracks mercy, discipline, and wartime loss.", "Your reign now transitions into Uttara Kanda, where the hardest moral trials begin."], choices: [{ label: "Rule through restorative justice", next: 81, timeAdvance: 1 }, { label: "Rule through iron order", next: 81, timeAdvance: 1 }, { label: "Rule through ritual duty", next: 81, timeAdvance: 1 }] },
  81: { title: "Uttara Kanda: Rumors and Exile", text: ["Whispers in Ayodhya challenge Sita's honor. You face crown-versus-heart in a decision that permanently changes family destiny.", "Day 8 closes with Sita sent to Valmiki's refuge where Lava and Kusha are born."], choices: [{ label: "Stand publicly with Sita", next: 82, effects: { endurance: 1 }, timeAdvance: 1 }, { label: "Exile her for state stability", next: 82, effects: { defense: 1 }, timeAdvance: 1 }, { label: "Call legal dharma inquiry", next: 82, effects: { agility: 1 }, timeAdvance: 1 }] },
  82: { title: "Ashvamedha and Final Reunion", text: ["Years later, Lava and Kusha halt the Ashvamedha horse. Father and sons meet first in conflict, then in recognition through song.", "Sita invokes Bhumi Devi and departs into the earth. Rama's final journey approaches the Sarayu."], choices: [{ label: "Ideal Dharma Ending", next: 83 }, { label: "Ruthless Conqueror Ending", next: 84 }, { label: "Failed Ruler Ending", next: 85 }] },
  83: { title: "Ending: Ideal Dharma", text: ["You complete rule with compassion, restraint, and justice. Allies remain loyal; memory becomes blessing across generations."], choices: [{ label: "Restart", restart: true }] },
  84: { title: "Ending: Ruthless Conqueror", text: ["Your victories endure, but fear replaces devotion. The realm obeys your will while love and trust fade from court and camp."], choices: [{ label: "Restart", restart: true }] },
  85: { title: "Ending: Failed Ruler", text: ["Broken loyalties and unresolved grief shadow your reign. The epic closes with warning: power without balance devours itself."], choices: [{ label: "Restart", restart: true }] },
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
// finds a random number 1-100

function isRealLifeNight() {
  var hour = new Date().getHours();
  return hour < 6 || hour >= 18;
}

function getDayNightLuckBonus() {
  if (dayNightMode !== "real") return 0;
  return isRealLifeNight() ? -12 : 12;
}

function getLuckThreshold(baseThreshold) {
  var adjusted = baseThreshold + getDayNightLuckBonus();
  return Math.max(5, Math.min(95, adjusted));
}

function clearStoryCard() {
  var storyCard = document.getElementById("storyCard");
  if (storyCard) {
    storyCard.innerHTML = "<p class='prelude-text'>" + preludeText + "</p>" + "<img class='prelude-image' src='rama_pic.png' alt='Rama standing with a bow' id='preludeImg'>";
  }
}
//resets the story card
function restart() {
  currentScene = 0;
  playerName = "";
  broughtLakshmana = false;
  wentAlone = false;
  historyStack = [];
  timelineEntries = [];
  clearStoryCard();
  updateUndoButton();
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, "", window.location.pathname);
  }
}
//restarts the whole game/story system
function startAdventure() {
  var heroSelect = document.getElementById("heroSelect");
  var heroKey = heroSelect && heroProfiles[heroSelect.value] ? heroSelect.value : "rama";
  var heroProfile = heroProfiles[heroKey];
  selectedHero = heroKey;
  var baseNameInput = document.getElementById("playerName");
  playerName = baseNameInput && baseNameInput.value.trim() ? baseNameInput.value.trim() : heroProfile.defaultName;
  familyCast.fatherName = heroProfile.fatherName;
  familyCast.motherName = heroProfile.motherName;
  familyCast.wifeName = heroProfile.wifeName;
  familyCast.siblingOneName = heroProfile.siblingOneName;
  familyCast.siblingTwoName = heroProfile.siblingTwoName;
  familyCast.siblingThreeName = heroProfile.siblingThreeName;
  familyCast.secondMotherName = heroProfile.secondMotherName;
  historyStack = [];
  timelineEntries = [];
  currentScene = 1;
  gameState = createInitialGameState(playerName);
  gameState.player.rpgStats = { strength: 12, defense: 11, speed: 10, agility: 10, stamina: 12, endurance: 11 };
  registerCoreSystems();
  simulateOfflineProgress();
  addItem("forest_bow", "Forest Bow", "weapons", 1);
  addItem("sitas_token", "Sita's Token", "quest items", 1);
  showScene();
  var storyCard = document.getElementById("storyCard");
  if (storyCard && typeof storyCard.scrollIntoView === "function") {
    storyCard.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  updateUndoButton();
  syncSceneRoute(true);
}

function simulateOfflineProgress() {
  var now = Date.now();
  var elapsedHours = Math.floor((now - (worldClock.lastActiveAt || now)) / 3600000);
  if (elapsedHours > 0) {
    simulateWorldPassage(elapsedHours);
    if (gameState && gameState.ui) gameState.ui.moralLog.unshift("The world evolved for " + elapsedHours + " hour(s) while you were away.");
  }
}
//starts the adventure

function resolveSpecialNext(next) {
  if (next === -10) {
    if (selectedHero === "lakshmana") return 86;
    if (selectedHero === "bharata") return 87;
    if (selectedHero === "ravana") return 88;
    if (selectedHero === "sita") return 89;
    return 3;
  }

  if (next === -1) {
    if (randomPercent() < getLuckThreshold(65)) {
      return wentAlone ? 52 : 14;
    }
    return 18;
  }

  if (next === -2) {
    return randomPercent() < getLuckThreshold(50) ? 29 : 39;
  }

  if (next === -3) {
    return randomPercent() < getLuckThreshold(15) ? 33 : 34;
  }

  if (next === -4) {
    return wentAlone ? 8 : 7;
  }

  return next;
}
//determines special transitions between special scenes

function getPossibleNextScenes(next) {
  if (next === -10) return [3, 86, 87, 88, 89];
  if (next === -1) return [14, 18, 52];
  if (next === -2) return [29, 39];
  if (next === -3) return [33, 34];
  if (next === -4) return [7, 8];
  return (typeof next === "number" && next > 0 && scenes[next]) ? [next] : [];
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
//Purpose: Prepares user-generated content to be safely displayed in HTML.
//What it does: It takes a string and replaces dangerous characters with their corresponding safe HTML entities.
// and the following

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getCharacterNames() {
  var names = [
    playerName || "Rama",
    familyCast.fatherName || "Dasharatha",
    familyCast.motherName || "Kausalya",
    familyCast.wifeName || "Sita",
    familyCast.siblingOneName || "Lakshmana",
    familyCast.siblingTwoName || "Bharata",
    familyCast.siblingThreeName || "Shatrughna",
    familyCast.secondMotherName || "Kaikeyi",
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
  var replacements = {
    "{{name}}": playerName || "Rama",
    "{{fatherName}}": familyCast.fatherName || "Dasharatha",
    "{{motherName}}": familyCast.motherName || "Kausalya",
    "{{wifeName}}": familyCast.wifeName || "Sita",
    "{{siblingOneName}}": familyCast.siblingOneName || "Lakshmana",
    "{{siblingTwoName}}": familyCast.siblingTwoName || "Bharata",
    "{{siblingThreeName}}": familyCast.siblingThreeName || "Shatrughna",
    "{{secondMotherName}}": familyCast.secondMotherName || "Kaikeyi",
    "{{siblingOneSubject}}": "he",
    "{{siblingOneObject}}": "him",
    "{{siblingOnePossessive}}": "his",
    "{{siblingTwoSubject}}": "he",
    "{{siblingTwoObject}}": "him",
    "{{siblingTwoPossessive}}": "his",
    "{{siblingThreeSubject}}": "he",
    "{{siblingThreeObject}}": "him",
    "{{siblingThreePossessive}}": "his"
  };
  //the abovw just sets default family names for an old feature
  var output = text;
  Object.keys(replacements).forEach(function (key) {
    output = output.replaceAll(key, replacements[key]);
  });
  return output;
}
//this sets key returns
function showScene() {
  var storyCard = document.getElementById("storyCard");
  if (!storyCard || !scenes[currentScene]) {
    return;
  }
//this is the function that allows scenes to show
  var scene = scenes[currentScene];
  if (gameState) { gameState.scene.current = currentScene; eventBus.emit(GAME_EVENTS.SCENE_LOAD, { sceneId: currentScene }); }
  var sceneTitle = formatStoryHtml(scene.title);
  if (gameState && gameState.player.stats.dharma >= 70) sceneTitle += " <span class='dharma-echo'>• Aura of Dharma</span>";
  var luckNote = dayNightMode === "real"
    ? (isRealLifeNight() ? "Real-time mode: Night luck is lower right now." : "Real-time mode: Day luck is higher right now.")
    : "In-game mode: Standard story luck is active.";
  var html = "<div id='storyCardToolbar'><button id='undoButton' class='art-button undo-art' type='button' onclick='undoLastChoice()' aria-label='Undo' data-tooltip='undo'>Undo</button><button type='button' onclick='openTimelineModal()' aria-label='Open my storyline'>My Storyline</button><button type='button' onclick='downloadSaveFile()' aria-label='Export save'>Export Save</button><button type='button' onclick='triggerSaveUpload()' aria-label='Import save'>Import Save</button><button type='button' onclick='openSettingsPanel()' aria-label='Open settings'>Settings</button><button type='button' onclick='openAccountPanel()' aria-label='Open account'>Account</button><button type='button' onclick='restAndDream()' aria-label='Sleep and dream'>Sleep</button><label for='dayNightModeToggle' class='story-toggle-label'>Day/Night</label><select id='dayNightModeToggle' aria-label='Choose day and night mode' onchange='setDayNightMode(this.value)'><option value='game'" + (dayNightMode === "game" ? " selected" : "") + ">In-Game Day/Night</option><option value='real'" + (dayNightMode === "real" ? " selected" : "") + ">Real-Life Day/Night</option></select><span class='story-toggle-note'>" + escapeHtml(luckNote) + "</span><input id='saveFileInput' type='file' accept='application/json' style='display:none' onchange='importSaveFile(event)'></div>";
  if (gameState) {
    var inventoryView = Object.keys(gameState.player.inventory).map(function (key) { var item = gameState.player.inventory[key]; return "<li>" + escapeHtml(item.name) + " x" + item.qty + " <em>(" + escapeHtml(item.category) + ")</em></li>"; }).join("");
    var questView = [];
    ["main", "side", "hidden"].forEach(function (bucket) { Object.keys(gameState.quests[bucket]).forEach(function (qid) { var q = gameState.quests[bucket][qid]; questView.push("<li>" + escapeHtml(q.title) + " — " + escapeHtml(q.state) + "</li>"); }); });
    html += "<div id='rpgHud'><div class='hud-card'><h4>Dharma Console</h4><p>Dharma: " + gameState.player.stats.dharma + " | Aggression: " + gameState.player.stats.aggression + " | Compassion: " + gameState.player.stats.compassion + "</p><p>" + escapeHtml((gameState.ui.moralLog[0] || "Your journey has just begun.")) + "</p></div><div class='hud-card'><h4>World Clock</h4><p>Day " + progressionState.day + " • " + progressionState.timeOfDay + "</p><p>5-10 scenes now complete one in-world day cycle.</p></div><div class='hud-card'><h4>Inventory</h4><ul>" + (inventoryView || "<li>Empty</li>") + "</ul></div><div class='hud-card'><h4>Quest Tracker</h4><ul>" + (questView.join("") || "<li>No quests yet</li>") + "</ul></div></div>";
    var rpgClass = rpgPanelsVisible ? "" : " rpg-collapsed";
    var xp = Math.max(0, Math.round((gameState.player.stats.dharma + gameState.player.stats.compassion + gameState.player.stats.honor) / 3));
    var stamina = Math.max(0, 100 - gameState.player.stats.aggression + Math.floor(gameState.player.stats.strategy / 2));
    html += "<div id='rpgHud' class='" + rpgClass + "'><aside class='hud-card hud-left'><h4>World Simulation</h4><p>Dharma: " + gameState.player.stats.dharma + " | Wisdom: " + gameState.player.stats.wisdom + " | Knowledge: " + gameState.player.stats.knowledge + "</p><p>Energy: " + gameState.player.energy + " | Phase: " + worldClock.storyPhase + "</p><p>" + escapeHtml((gameState.ui.moralLog[0] || "Your journey has just begun.")) + "</p><h4>Combat Readiness</h4><p>XP Power: " + xp + " | Stamina: " + stamina + "</p></aside><div class='hud-center'><div class='hud-card'><h4>Inventory</h4><ul>" + (inventoryView || "<li>Empty</li>") + "</ul></div></div><aside class='hud-card hud-right'><h4>Quest Tracker</h4><ul>" + (questView.join("") || "<li>No quests yet</li>") + "</ul><h4>Party Bond</h4><p>Sita: " + (gameState.player.affection.sita || 0) + " | Lakshmana: " + (gameState.player.affection.lakshmana || 0) + "</p></aside></div>";
  }


  if (currentScene === 1) {
    html += "<h1>" + sceneTitle + "</h1>";
  } else {
    html += "<h2>" + sceneTitle + "</h2>";
  }

  // quick subtitle jam here,, make it loud when scene asks for it.
  if (scene.subtitle) {
    html += "<p class='scene-subtitle scene-subtitle-strong'>" + formatStoryHtml(scene.subtitle) + "</p>";
  }

  if (scene.featureImage && scene.featureImage.src) {
    html += "<img class='scene-feature-image' src='" + escapeHtml(scene.featureImage.src) + "' alt='" + escapeHtml(scene.featureImage.alt || "Scene image") + "'>";
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
  if (!isRoutingSceneUpdate) syncSceneRoute(false);
}
//the above formats the scene logic into html


function toggleRpgPanels() {
  rpgPanelsVisible = !rpgPanelsVisible;
  showScene();
}

function setDayNightMode(mode) {
  dayNightMode = mode === "real" ? "real" : "game";
  try {
    window.localStorage.setItem("ramayanaDayNightMode", dayNightMode);
  } catch (e) {}
  showScene();
}

function makeChoice(choiceIndex) {
  var scene = scenes[currentScene];
  if (!scene || !scene.choices[choiceIndex]) {
    return;
  }

  var choice = scene.choices[choiceIndex];
  var fromScene = currentScene;
  if (gameState) eventBus.emit(GAME_EVENTS.CHOICE_MADE, { sceneId: currentScene, choice: choice });
  if (choice.effects && gameState) applyChoiceEffects(choice.effects);
  if (choice.timeAdvance) advanceWorldTime(choice.timeAdvance);
  if (typeof choice.onPick === "function") {
    choice.onPick();
  }

  historyStack.push(currentScene);
  currentScene = resolveSpecialNext(choice.next);
  simulateWorldPassage(1);
  maybeTriggerTravelEncounter();
  timelineEntries.push({ from: fromScene, to: currentScene, label: choice.label });
  showScene();
}

function maybeTriggerTravelEncounter() {
  if (!accountState.settings.travelEncounters || !gameState) return;
  if (Math.random() > 0.35) return;
  var pick = travelEncounters[Math.floor(Math.random() * travelEncounters.length)];
  gameState.ui.moralLog.unshift("Travel Encounter: " + pick + " changes your perspective.");
  gameState.player.stats.wisdom += 1;
  gameState.player.stats.knowledge += 1;
}

function simulateWorldPassage(hours) {
  worldClock.totalHours += hours || 1;
  worldClock.lastActiveAt = Date.now();
  var phases = ["Dawn", "Day", "Dusk", "Night", "Deep Night"];
  worldClock.phase = phases[worldClock.totalHours % phases.length];
  if (worldClock.totalHours < 24) worldClock.storyPhase = "Origin Phase";
  else if (worldClock.totalHours < 60) worldClock.storyPhase = "Rising Conflict Phase";
  else if (worldClock.totalHours < 96) worldClock.storyPhase = "War Expansion Phase";
  else if (worldClock.totalHours < 132) worldClock.storyPhase = "Mythic Escalation Phase";
  else worldClock.storyPhase = "Resolution Phase";
}

function restAndDream() {
  if (!gameState || !accountState.settings.dreams) return;
  gameState.player.energy = Math.min(100, (gameState.player.energy || 80) + 25);
  simulateWorldPassage(8);
  var dreams = ["Divine Dream", "Shadow Dream", "Memory Dream", "Prophetic Dream"];
  var dream = dreams[Math.floor(Math.random() * dreams.length)];
  gameState.player.stats.wisdom += 2;
  gameState.player.stats.knowledge += 2;
  gameState.ui.moralLog.unshift("You slept, entered Slumberland, and received a " + dream + ".");
  showScene();
}

function applyChoiceEffects(effects) {
  if (!gameState || !gameState.player) return;
  var stats = gameState.player.rpgStats || (gameState.player.rpgStats = { strength: 12, defense: 11, speed: 10, agility: 10, stamina: 12, endurance: 11 });
  Object.keys(effects).forEach(function (k) {
    if (stats[k] == null) return;
    stats[k] = Math.max(1, Math.min(99, stats[k] + effects[k]));
  });
}

function advanceWorldTime(units) {
  var cycle = ["Day", "Dusk", "Night", "Dawn"];
  var idx = cycle.indexOf(progressionState.timeOfDay);
  var next = (idx + (units || 1)) % cycle.length;
  progressionState.timeOfDay = cycle[next];
  if (progressionState.timeOfDay === "Dawn") progressionState.day += 1;
}

function openStatsModal() {
  if (!gameState || !gameState.player) return;
  var stats = gameState.player.rpgStats || {};
  var modal = document.createElement("div");
  modal.id = "statsModal";
  modal.style = "position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;";
  modal.innerHTML = "<div style='max-width:520px;width:100%;background:#171717;color:#f2f2f2;border:1px solid #666;border-radius:16px;padding:18px;'><h3>Player Combat Stats</h3><p>Strength: " + stats.strength + " | Defense: " + stats.defense + " | Speed: " + stats.speed + "</p><p>Agility: " + stats.agility + " | Stamina: " + stats.stamina + " | Endurance: " + stats.endurance + "</p><p>Dharma: " + gameState.player.stats.dharma + " | Honor: " + (gameState.player.stats.honor || 50) + " | Strategy: " + (gameState.player.stats.strategy || 40) + "</p><button type='button' onclick='document.getElementById(\"statsModal\").remove()'>Close</button></div>";
  modal.onclick = function (event) { if (event.target && event.target.id === "statsModal") modal.remove(); };
  document.body.appendChild(modal);
}

function undoLastChoice() {
  if (historyStack.length === 0) {
    return;
  }

  currentScene = historyStack.pop();
  showScene();
}

window.addEventListener("popstate", function () {
  isRoutingSceneUpdate = true;
  applySceneFromRoute();
  isRoutingSceneUpdate = false;
});

window.addEventListener("load", function () {
  try {
    var savedMode = window.localStorage.getItem("ramayanaDayNightMode");
    if (savedMode === "real" || savedMode === "game") dayNightMode = savedMode;
  } catch (e) {}
  isRoutingSceneUpdate = true;
  applySceneFromRoute();
  isRoutingSceneUpdate = false;
});

function updateUndoButton() {
  var undoButton = document.getElementById("undoButton");
  if (!undoButton) {
    return;
  }

  undoButton.disabled = historyStack.length === 0;
}

function renderSimpleTimelineList() {
  var list = document.getElementById("timelineList");
  if (!list) {
    return;
  }

  var html = "";
  timelineEntries.forEach(function (entry, index) {
    if (!entry || !scenes[entry.from] || !scenes[entry.to]) {
      return;
    }
    html += "<li><strong>Step " + (index + 1) + ":</strong> " + formatStoryHtml(scenes[entry.from].title) + " → " + formatStoryHtml(scenes[entry.to].title) + "<p class='timeline-scene-description'>Choice: " + formatStoryHtml(entry.label) + "</p></li>";
  });

  if (scenes[currentScene]) {
    html += "<li class='timeline-current-scene'><strong>" + formatStoryHtml(scenes[currentScene].title) + " (Current)</strong><p class='timeline-scene-description'>" + formatStoryHtml(scenes[currentScene].text.join(" ")) + "</p></li>";
  }

  if (!html) {
    html = "<li><strong>Start your quest to build the timeline.</strong></li>";
  }

  list.innerHTML = html;
}

function getVisitedSceneIds() {
  var ids = {};
  historyStack.forEach(function (sceneId) { ids[sceneId] = true; });
  ids[currentScene] = true;
  return ids;
}

function toggleTimelineReveal() {
  timelineRevealAll = !timelineRevealAll;
  updateTimelineRevealButton();
  renderTimelineFlowchart();
}

function updateTimelineRevealButton() {
  var button = document.getElementById("timelineRevealToggle");
  if (!button) {
    return;
  }
  button.textContent = timelineRevealAll ? "Hide Unexplored Scenes" : "Reveal Coming Scenes";
  button.setAttribute("aria-pressed", timelineRevealAll ? "true" : "false");
}

function renderTimelineFlowchart() {
  var container = document.getElementById("timelineFlowchart");
  if (!container) {
    return;
  }

  var sceneIds = Object.keys(scenes).map(function (id) { return Number(id); }).sort(function (a, b) { return a - b; });
  var levelById = {};
  var queue = [1];
  levelById[1] = 0;
  while (queue.length) {
    var id = queue.shift();
    var scene = scenes[id];
    if (!scene || !Array.isArray(scene.choices)) {
      continue;
    }
    scene.choices.forEach(function (choice) {
      getPossibleNextScenes(choice.next).forEach(function (nextId) {
        if (levelById[nextId] == null || levelById[nextId] > levelById[id] + 1) {
          levelById[nextId] = levelById[id] + 1;
          queue.push(nextId);
        }
      });
    });
  }

  var columns = {};
  sceneIds.forEach(function (id) {
    var lvl = levelById[id] != null ? levelById[id] : 0;
    columns[lvl] = columns[lvl] || [];
    columns[lvl].push(id);
  });

  var colKeys = Object.keys(columns).map(Number).sort(function (a,b){return a-b;});
  var xGap = 430, yGap = 180, nodeW = 320, nodeH = 95, margin = 70;
  var pos = {};
  var maxRows = 1;
  colKeys.forEach(function (col) {
    columns[col].sort(function (a,b){return a-b;});
    maxRows = Math.max(maxRows, columns[col].length);
    columns[col].forEach(function (id, row) {
      pos[id] = { x: margin + col * xGap, y: margin + row * yGap };
    });
  });

  var width = Math.max(3900, margin * 2 + (colKeys.length + 1) * xGap);
  var height = Math.max(1200, margin * 2 + (maxRows + 1) * yGap);
  var visited = getVisitedSceneIds();

  var svg = "<svg viewBox='0 0 " + width + " " + height + "' role='img' aria-label='Story flowchart'>";
  sceneIds.forEach(function (fromId) {
    var scene = scenes[fromId];
    if (!scene || !scene.choices || !pos[fromId]) return;
    scene.choices.forEach(function (choice) {
      getPossibleNextScenes(choice.next).forEach(function (nextId) {
        if (!pos[nextId]) return;
        var edgeVisible = timelineRevealAll || (visited[fromId] && visited[nextId]);
        if (!edgeVisible) return;
        var x1 = pos[fromId].x + nodeW;
        var y1 = pos[fromId].y + nodeH / 2;
        var x2 = pos[nextId].x;
        var y2 = pos[nextId].y + nodeH / 2;
        var mid = (x1 + x2) / 2;
        var active = visited[fromId] && visited[nextId] ? " active" : "";
        svg += "<path class='timeline-edge" + active + "' d='M" + x1 + " " + y1 + " C " + mid + " " + y1 + ", " + mid + " " + y2 + ", " + x2 + " " + y2 + "'></path>";
      });
    });
  });

  sceneIds.forEach(function (id) {
    if (!pos[id]) return;
    var visible = timelineRevealAll || visited[id];
    if (!visible) return;
    var cls = "timeline-node" + (visited[id] ? " visited" : "") + (id === currentScene ? " active" : "");
    var title = interpolatePlayerName(scenes[id].title).slice(0, 28);
    svg += "<rect class='" + cls + "' x='" + pos[id].x + "' y='" + pos[id].y + "' width='" + nodeW + "' height='" + nodeH + "' rx='16' ry='16'></rect>";
    svg += "<text class='node-id' x='" + (pos[id].x + 16) + "' y='" + (pos[id].y + 30) + "'>#" + id + "</text>";
    svg += "<text class='node-title' x='" + (pos[id].x + 16) + "' y='" + (pos[id].y + 60) + "'>" + escapeHtml(title) + "</text>";
  });

  svg += "</svg>";
  container.innerHTML = svg;
}

//choice logic
function openTimelineModal() {
  var modal = document.getElementById("timelineModal");
  if (!modal) {
    return;
  }
  renderSimpleTimelineList();
  renderTimelineFlowchart();
  updateTimelineRevealButton();
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
//controls the timeline/storyline modal
window.startAdventure = startAdventure;
//starts adventure


function buildSaveSnapshot() {
  return {
    version: systemState.version,
    playerName: playerName,
    currentScene: currentScene,
    flags: { broughtLakshmana: broughtLakshmana, wentAlone: wentAlone },
    historyStack: historyStack.slice(),
    systems: systemState,
    unifiedState: gameState,
    accountState: accountState,
    worldClock: worldClock
  };
}

function hydrateFromSave(snapshot) {
  playerName = snapshot.playerName || "Rama";
  currentScene = snapshot.currentScene || 1;
  broughtLakshmana = !!(snapshot.flags && snapshot.flags.broughtLakshmana);
  wentAlone = !!(snapshot.flags && snapshot.flags.wentAlone);
  historyStack = Array.isArray(snapshot.historyStack) ? snapshot.historyStack : [];
  systemState = snapshot.systems || systemState;
  gameState = snapshot.unifiedState || createInitialGameState(playerName);
  accountState = snapshot.accountState || accountState;
  worldClock = snapshot.worldClock || worldClock;
  registerCoreSystems();
  evaluateRelationshipStates();
  showScene();
}

function openAccountPanel() {
  var username = window.prompt("Account name:", accountState.username || playerName || "Rama");
  if (!username) return;
  accountState.username = username.trim();
  if (!accountState.createdAt) accountState.createdAt = new Date().toISOString();
  if (gameState && gameState.ui) gameState.ui.moralLog.unshift("Account linked: " + accountState.username);
  showScene();
}

function openSettingsPanel() {
  var realtime = window.confirm("Enable realtime world progression while offline?");
  var encounters = window.confirm("Enable travel encounters (Sage, merchant, demon, village, etc.)?");
  var dreams = window.confirm("Enable Slumberland dream realm during sleep?");
  accountState.settings.realtimeWorld = realtime;
  accountState.settings.travelEncounters = encounters;
  accountState.settings.dreams = dreams;
  if (gameState && gameState.ui) gameState.ui.moralLog.unshift("Settings updated for realtime, encounters, and dreams.");
  showScene();
}

function downloadSaveFile() {
  var payload = JSON.stringify({ exportedAt: new Date().toISOString(), gameState: buildSaveSnapshot() }, null, 2);
  var blob = new Blob([payload], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "ramayana-save.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function triggerSaveUpload() {
  var input = document.getElementById("saveFileInput");
  if (input) input.click();
}

function importSaveFile(event) {
  var file = event && event.target && event.target.files && event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function () {
    var parsed = JSON.parse(reader.result);
    if (!parsed || !parsed.gameState) return;
    hydrateFromSave(parsed.gameState);
  };
  reader.readAsText(file);
}

function toggleDharmaConsole() {
  var existing = document.getElementById("dharmaConsolePanel");
  if (existing) {
    existing.remove();
    return;
  }
  var panel = document.createElement("div");
  panel.id = "dharmaConsolePanel";
  panel.style = "background:#111;color:#eee;padding:12px;border:1px solid #444;border-radius:12px;margin-top:12px;";
  panel.innerHTML = "<h3>Dharma Console</h3><p>Adjust systems for testing and replay.</p><button type='button' onclick=\"dharmaSetTrait('dharma',5)\">+5 Dharma</button> <button type='button' onclick=\"dharmaSetTrait('aggression',5)\">+5 Aggression</button> <button type='button' onclick=\"dharmaCompanion('hanuman',10)\">+10 Hanuman Affection</button> <button type='button' onclick=\"dharmaBranch(19)\">Jump to Golden Deer</button> <button type='button' onclick=\"dharmaEvent('Rotating_Challenge')\">Trigger Event</button>";
  var storyCard = document.getElementById("storyCard");
  if (storyCard) storyCard.appendChild(panel);
}

function dharmaSetTrait(key, amount) { systemState.traits[key] = (systemState.traits[key] || 0) + amount; }
function dharmaCompanion(id, amount) { systemState.affection[id] = (systemState.affection[id] || 0) + amount; evaluateRelationshipStates(); }
function dharmaBranch(sceneId) { currentScene = sceneId; showScene(); }
function dharmaEvent(name) { systemState.world.activeEvent = name; }
