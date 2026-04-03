// Global variables to track the current scene and player name.
var currentScene = 0;
var playerName = "";
var broughtLakshmana = false;
var wentAlone = false;
var receiptScenes = [];
var receiptChoices = [];
var oldStates = [];
var visitedSceneIds = [];
var takenTransitions = [];
var timelineModalOpen = false;
var timelineZoom = 1;
var journeyTriviaState = null;
var perfectTriviaSessionsInRow = 0;
var dasharathaStoryUnlocked = false;
var miniGameReturnScene = null;
var miniGamesUnlocked = false;
var playerStats = {};
var playerGold = 0;
var inventoryItems = [];
var inventoryArtifacts = [];
var artifactLoreCatalog = {};
var ownedTitles = [];
var equippedTitle = "";
var miniGameScores = { journeyTrivia: 0 };
var miniGameSession = null;
var selectedMiniGameTactics = { duel: "balanced", brawl: "balanced", shooting: "balanced", chase: "balanced", maze: "balanced" };
var tradeCount = 0;
var sigilSatchel = {};
var shopGoods = {};
var pendingSigilDebt = "";
var trainingShopCatalog = {};
var explorationDiscoveries = [];
var explorationState = null;
var trainingCharacters = ["Hanuman", "Sugriva", "Lakshmana", "Angada"];
var characterConversationState = null;
var guessGameState = null;

var ramayanaTriviaFacts = [
    ["Who wrote the Ramayana, according to tradition?", "Valmiki", ["Vyasa", "Kalidasa", "Tulsidas"]],
    ["Who is Rama's wife?", "Sita", ["Mandodari", "Draupadi", "Tara"]],
    ["Who is Rama's father?", "Dasharatha", ["Janaka", "Vishwamitra", "Ravana"]],
    ["Who sends Rama into exile?", "Kaikeyi", ["Kausalya", "Sumitra", "Shabari"]],
    ["Who goes with Rama into exile?", "Lakshmana", ["Bharata", "Shatrughna", "Vali"]],
    ["Who abducts Sita?", "Ravana", ["Kumbhakarna", "Indrajit", "Khara"]],
    ["What kingdom does Ravana rule?", "Lanka", ["Ayodhya", "Mithila", "Kishkindha"]],
    ["Who leaps across the ocean to Lanka?", "Hanuman", ["Sugriva", "Angada", "Nala"]],
    ["Who is Ravana's righteous brother?", "Vibhishana", ["Kumbhakarna", "Akampana", "Maricha"]],
    ["Who tests Rama by appearing as a golden deer?", "Maricha", ["Khara", "Vali", "Kabandha"]],
    ["What city is Rama from?", "Ayodhya", ["Ujjain", "Dwaraka", "Hastinapura"]],
    ["Who is Sita's father?", "Janaka", ["Dasharatha", "Sugriva", "Vibhishana"]],
    ["Who is the monkey king helped by Rama?", "Sugriva", ["Vali", "Jambavan", "Nila"]],
    ["Who is Sugriva's powerful brother?", "Vali", ["Angada", "Nala", "Indrajit"]],
    ["Who carries Rama's ring to Sita?", "Hanuman", ["Lakshmana", "Jatayu", "Vibhishana"]],
    ["Who fights Ravana with Rama?", "Vanara army", ["Kauravas", "Pandavas", "Yadavas"]],
    ["What is the bridge to Lanka called?", "Rama Setu", ["Kurukshetra", "Setubandha Lake", "Pushpaka Path"]],
    ["Who is Ravana's giant sleeping brother?", "Kumbhakarna", ["Indrajit", "Trijata", "Khara"]],
    ["What is another name for Indrajit?", "Meghanada", ["Akshayakumara", "Atikaya", "Prahasta"]],
    ["Who rules Ayodhya while Rama is away?", "Bharata as regent", ["Lakshmana", "Shatrughna", "Janaka"]],
    ["Who protects Sita in Ashoka Vatika?", "Trijata", ["Surpanakha", "Tara", "Mandodari"]],
    ["Who gives Rama divine guidance in forest years?", "Rishis and sages", ["Yakshas", "Nagas", "Gandharvas"]],
    ["Who offers berries to Rama with devotion?", "Shabari", ["Kaikeyi", "Urmila", "Tara"]],
    ["Who is Lakshmana's wife?", "Urmila", ["Mandavi", "Shrutakirti", "Kaushalya"]],
    ["How many years is Rama exiled?", "14", ["7", "10", "12"]]
];

function buildRamayanaTriviaBank() {
    var bank = [];
    var i;
    var j;
    var fact;
    var promptVariants = [
        "{q}",
        "Ramayana trivia: {q}",
        "Choose the correct answer: {q}",
        "In the Ramayana, {q}"
    ];

    for (i = 0; i < ramayanaTriviaFacts.length; i++) {
        fact = ramayanaTriviaFacts[i];
        for (j = 0; j < 4; j++) {
            bank.push({
                prompt: promptVariants[j].replace("{q}", fact[0]),
                options: [fact[1]].concat(fact[2]).sort(function () { return Math.random() - 0.5; }),
                correct: fact[1]
            });
        }
    }

    return bank.slice(0, 100);
}

var ramayanaTriviaBank = buildRamayanaTriviaBank();

var ramayanaGuessPool = [
    "Rama", "Sita", "Lakshmana", "Hanuman", "Ravana", "Dasharatha", "Bharata", "Shatrughna", "Kaikeyi", "Kausalya",
    "Sumitra", "Janaka", "Vibhishana", "Kumbhakarna", "Indrajit", "Meghanada", "Sugriva", "Vali", "Angada", "Jatayu",
    "Shabari", "Surpanakha", "Trijata", "Mandodari", "Maricha", "Ayodhya", "Lanka", "Mithila", "Kishkindha", "Panchavati",
    "Dandaka Forest", "Ashoka Vatika", "Rama Setu", "Pushpaka Vimana", "Sarayu River", "Chitrakoot"
];

var timelineNodeTitles = {
    1: "The Exile",
    2: "Exile Begins",
    3: "Argue Back",
    4: "Accept Exile",
    5: "Go Alone",
    6: "Go With Them",
    7: "Surphanaka Encounter",
    8: "Surphanaka Encounter (Alone)",
    9: "Fight Surphanaka",
    10: "Protect Sita",
    11: "Negotiate",
    12: "Accept Proposal",
    13: "Reject Proposal",
    14: "Victory",
    15: "Negotiation Fails",
    16: "Meet Ravana",
    17: "Evil King Ending",
    18: "Game Over",
    19: "Golden Deer",
    20: "Bring Lakshmana?",
    21: "Ignore Deer Ending",
    22: "Track Deer (Together)",
    23: "Track Deer (Alone)",
    24: "Shoot Deer",
    25: "Maricha's Cry",
    26: "Ravana's Chance",
    27: "Lakshmana Line",
    28: "Ravana's Trick",
    29: "Sita Abducted",
    30: "Jatayu Sees Ravana",
    31: "Sita Taken",
    32: "Jatayu Rescue Quiz",
    33: "Jatayu Rescues Sita",
    34: "Jatayu Falls",
    35: "Jatayu Falls",
    36: "Fight Ravana",
    37: "Sita Taken",
    38: "Forest Duel Ending",
    39: "Lakshmana Saves Sita",
    40: "Meet Sugriva",
    41: "Sugriva's Plea",
    42: "Exile Vow",
    43: "Vali Challenge",
    44: "Vali Falls",
    45: "Missed Shot",
    46: "Missed Shot",
    47: "Meet Hanuman",
    48: "Jatayu Quiz 2",
    49: "Jatayu Quiz 3",
    50: "Final Struggle",
    51: "Fate Decision",
    52: "Peaceful Ending",
    53: "Part 2 Intro",
    54: "Part 2 Start",
    55: "Mini-game: Duel",
    56: "Mini-game: Brawl",
    57: "Mini-game: Shooting",
    58: "Mini-game: Chase",
    59: "Mini-game: Maze",
    65: "Search for Sita",
    66: "Bharata's Plea",
    67: "Ayodhya Return Ending",
    68: "Sandals Promise",
    69: "Dasharatha's Demand",
    70: "Trivia Menu",
    71: "Trivia Question",
    72: "Trivia Correct",
    73: "Trivia Wrong",
    77: "Training Talk",
    79: "Training Shop",
    93: "Guessing Game",
    94: "Exploration Run",
    95: "Deer Lore Artifact",
    96: "Jatayu Lore Artifact",
    97: "Kishkindha Lore Artifact"
};

var timelineLevels = [
    [1, 2],
    [3],
    [4],
    [5, 6],
    [7, 8],
    [9, 10, 11, 12, 13],
    [14, 15, 16, 52, 18],
    [17, 19],
    [20, 21],
    [22, 23],
    [24],
    [25],
    [26, 27],
    [28],
    [29, 39],
    [30],
    [31, 32],
    [48, 34, 35],
    [49],
    [50],
    [33, 37],
    [36, 65],
    [38, 66],
    [67, 68],
    [40, 41],
    [42],
    [43],
    [44, 45, 46],
    [47, 69, 95, 96, 97],
    [55, 56, 57, 58, 59, 70, 93, 77, 79, 94, 53],
    [71, 72, 73, 54]
];

var timelineEdges = [
    { from: 1, to: 3, label: "Argue back" },
    { from: 1, to: 4, label: "Accept exile" },
    { from: 2, to: 3, label: "Argue back" },
    { from: 2, to: 4, label: "Accept exile" },
    { from: 3, to: 4, label: "Continue" },
    { from: 4, to: 5, label: "Go alone" },
    { from: 4, to: 6, label: "Go with them" },
    { from: 5, to: 8, label: "Continue" },
    { from: 6, to: 7, label: "Continue" },
    { from: 7, to: 12, label: "Accept marriage" },
    { from: 7, to: 9, label: "Fight" },
    { from: 7, to: 10, label: "Protect Sita" },
    { from: 7, to: 11, label: "Negotiate" },
    { from: 8, to: 12, label: "Accept" },
    { from: 8, to: 13, label: "Reject" },
    { from: 13, to: 9, label: "Fight" },
    { from: 11, to: 15, label: "Try again" },
    { from: 11, to: 9, label: "Prepare to fight" },
    { from: 15, to: 9, label: "Fight" },
    { from: 9, to: 14, label: "Fight (win w/party)", type: "chance" },
    { from: 9, to: 52, label: "Fight (win alone)", type: "chance" },
    { from: 9, to: 18, label: "Fight (lose)", type: "chance" },
    { from: 10, to: 19, label: "Continue" },
    { from: 14, to: 19, label: "Continue" },
    { from: 12, to: 16, label: "Meet Ravana" },
    { from: 16, to: 17, label: "Claim throne" },
    { from: 19, to: 95, label: "Investigate glimmer" },
    { from: 19, to: 20, label: "Chase deer" },
    { from: 19, to: 21, label: "Ignore deer" },
    { from: 95, to: 20, label: "Chase anyway" },
    { from: 95, to: 21, label: "Stay alert" },
    { from: 20, to: 22, label: "Bring Lakshmana" },
    { from: 20, to: 23, label: "Leave with Sita" },
    { from: 22, to: 24, label: "Keep following" },
    { from: 23, to: 24, label: "Keep following" },
    { from: 24, to: 25, label: "Continue" },
    { from: 25, to: 26, label: "Lakshmana came" },
    { from: 25, to: 27, label: "Lakshmana stayed" },
    { from: 26, to: 29, label: "Continue" },
    { from: 27, to: 28, label: "Continue" },
    { from: 28, to: 29, label: "Ravana succeeds", type: "chance" },
    { from: 28, to: 39, label: "Lakshmana returns", type: "chance" },
    { from: 29, to: 30, label: "Continue" },
    { from: 30, to: 96, label: "Check feathers" },
    { from: 30, to: 31, label: "Do nothing" },
    { from: 30, to: 32, label: "Try rescue" },
    { from: 96, to: 31, label: "Do nothing" },
    { from: 96, to: 32, label: "Try rescue" },
    { from: 32, to: 48, label: "Q1 right" },
    { from: 32, to: 34, label: "Q1 wrong" },
    { from: 32, to: 35, label: "Q1 wrong" },
    { from: 48, to: 49, label: "Q2 right" },
    { from: 48, to: 34, label: "Q2 wrong" },
    { from: 48, to: 35, label: "Q2 wrong" },
    { from: 49, to: 50, label: "Q3 right" },
    { from: 49, to: 34, label: "Q3 wrong" },
    { from: 49, to: 35, label: "Q3 wrong" },
    { from: 50, to: 33, label: "Fate win", type: "chance" },
    { from: 50, to: 34, label: "Fate lose", type: "chance" },
    { from: 33, to: 36, label: "Go after Ravana" },
    { from: 36, to: 38, label: "Fight Ravana" },
    { from: 34, to: 37, label: "Continue" },
    { from: 35, to: 37, label: "Continue" },
    { from: 31, to: 65, label: "Keep searching" },
    { from: 37, to: 65, label: "Keep searching" },
    { from: 65, to: 66, label: "Return to hut" },
    { from: 66, to: 67, label: "Accept return" },
    { from: 66, to: 68, label: "Decline return" },
    { from: 68, to: 40, label: "Continue exile" },
    { from: 40, to: 97, label: "Explore cave mural" },
    { from: 40, to: 41, label: "Hear request" },
    { from: 97, to: 41, label: "Hear request" },
    { from: 41, to: 42, label: "Consider plan" },
    { from: 42, to: 43, label: "Set trap" },
    { from: 43, to: 44, label: "Correct answer" },
    { from: 43, to: 45, label: "Wrong answer" },
    { from: 43, to: 46, label: "Wrong answer" },
    { from: 44, to: 47, label: "Meet Hanuman" },
    { from: 47, to: 55, label: "Duel drill" },
    { from: 47, to: 56, label: "Brawl drill" },
    { from: 47, to: 57, label: "Shooting drill" },
    { from: 47, to: 58, label: "Chase drill" },
    { from: 47, to: 59, label: "Maze drill" },
    { from: 47, to: 69, label: "Unlock new storyline" },
    { from: 47, to: 70, label: "Journey trivia" },
    { from: 47, to: 93, label: "Guessing game" },
    { from: 47, to: 94, label: "Exploration" },
    { from: 47, to: 77, label: "Talk to ally" },
    { from: 77, to: 79, label: "Spar debt to shop" },
    { from: 77, to: 47, label: "Back to hub" },
    { from: 79, to: 47, label: "Return to hub" },
    { from: 55, to: 47, label: "Session complete" },
    { from: 56, to: 47, label: "Session complete" },
    { from: 57, to: 47, label: "Session complete" },
    { from: 58, to: 47, label: "Session complete" },
    { from: 59, to: 47, label: "Session complete" },
    { from: 69, to: 67, label: "Return and rule" },
    { from: 70, to: 71, label: "Start trivia" },
    { from: 70, to: 47, label: "Back to hub" },
    { from: 71, to: 72, label: "Answer right" },
    { from: 71, to: 73, label: "Answer wrong" },
    { from: 71, to: 70, label: "Back to trivia menu" },
    { from: 72, to: 71, label: "Next question" },
    { from: 72, to: 70, label: "Back to trivia menu" },
    { from: 73, to: 71, label: "Continue" },
    { from: 73, to: 70, label: "Back to trivia menu" },
    { from: 93, to: 47, label: "Back to hub" },
    { from: 94, to: 47, label: "Back to hub" },
    { from: 47, to: 53, label: "Continue main story" },
    { from: 53, to: 54, label: "Begin rescue" },
    { from: 54, to: 47, label: "Train first" }
];


function randomizer() {
    return Math.floor(Math.random() * 101);
}

function clampOdds(value) {
    if (value < 5) {
        return 5;
    }

    if (value > 95) {
        return 95;
    }

    return value;
}

function getEffectiveStats() {
    return {};
}

function getMiniGameTacticBonus(challengeType) {
    var tactic = selectedMiniGameTactics[challengeType];

    if (tactic === "careful") {
        return 10;
    }

    if (tactic === "risky") {
        return 15;
    }

    return 0;
}

function getChallengeOdds(challengeType) {
    if (challengeType === "fight") {
        return 70;
    }
    if (challengeType === "journeyTrivia") {
        return 50;
    }
    if (challengeType === "guessing") {
        return 35;
    }
    return 40;
}

function getAllOddsSummary() {
    return {
        fight: getChallengeOdds("fight"),
        duel: getChallengeOdds("duel"),
        brawl: getChallengeOdds("brawl"),
        shooting: getChallengeOdds("shooting"),
        chase: getChallengeOdds("chase"),
        maze: getChallengeOdds("maze"),
        journeyTrivia: getChallengeOdds("journeyTrivia"),
        guessing: getChallengeOdds("guessing"),
        exploration: getChallengeOdds("exploration")
    };
}

function unlockTitleIfEligible() {
    return;
}

function getRewardItemByName(itemName) {
    return null;
}

function readRelicKnowledge(itemName) {
    return;
}

function getArtifactLoreByName(artifactName) {
    return artifactLoreCatalog[artifactName] || "A mysterious Ramayana artifact. Its full lore is still unknown.";
}

function readArtifactLore(artifactName) {
    return;
}

function awardMiniGameReward(gameName) {
    return "Victory!";
}

function addSigilToSatchel(sigilName, amount) {
    if (!sigilSatchel[sigilName]) {
        sigilSatchel[sigilName] = 0;
    }
    sigilSatchel[sigilName] += amount;
}

function spendSigil(sigilName) {
    if (!sigilSatchel[sigilName]) {
        return false;
    }
    sigilSatchel[sigilName] -= 1;
    if (sigilSatchel[sigilName] <= 0) {
        delete sigilSatchel[sigilName];
    }
    return true;
}

function getSatchelSummary() {
    var keys = Object.keys(sigilSatchel);
    if (!keys.length) {
        return "No sigils in satchel.";
    }
    return keys.map(function (sigilName) {
        return sigilName + " x" + sigilSatchel[sigilName];
    }).join(", ");
}

function grantGold(amount, reason) {
    playerGold += amount;
    addChoiceToReceipt("Earned " + amount + " gold" + (reason ? " (" + reason + ")" : ""));
}

function trySpendGold(amount) {
    if (playerGold < amount) {
        return false;
    }
    playerGold -= amount;
    return true;
}

function addGoodsToShop(itemName, amount) {
    if (!shopGoods[itemName]) {
        shopGoods[itemName] = 0;
    }
    shopGoods[itemName] += amount;
}

function removeGoodsFromShop(itemName, amount) {
    if (!shopGoods[itemName] || shopGoods[itemName] < amount) {
        return false;
    }
    shopGoods[itemName] -= amount;
    if (shopGoods[itemName] <= 0) {
        delete shopGoods[itemName];
    }
    return true;
}

function registerTrade() {
    return;
}

function runGuessingGame(guess) {
    var secret = randomFrom(ramayanaGuessPool);
    if (guess && guess.toLowerCase() === secret.toLowerCase()) {
        return "Correct! The hidden answer was " + secret + ".";
    }
    return "Not quite. The hidden answer was " + secret + ".";
}

function applyExplorationPowerup(powerupName) {
    return;
}

function runExplorationMiniGame() {
    var discoveries = [];
    var i;
    var picked;
    var summary = [];

    for (i = 0; i < 3; i++) {
        picked = randomFrom(explorationDiscoveries);
        discoveries.push(picked);
        if (picked.category === "Powerup") {
            applyExplorationPowerup(picked.name);
            summary.push(picked.name + " (" + picked.description + ")");
        } else {
            addGoodsToShop(picked.name, 1);
            summary.push(picked.name + " [" + picked.category + "] worth " + picked.value + " gold");
        }
    }

    explorationState = { finds: discoveries };
    addChoiceToReceipt("Completed an exploration run");
    grantGold(10, "exploration expedition stipend");
    return summary.join(" | ");
}

function maybeGrantStoryPowerup() {
    return "";
}

function randomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function beginCharacterConversation(characterName) {
    var openers = {
        Hanuman: [
            "Hanuman grins: 'Discipline is a bridge. Build one more stone today.'",
            "Hanuman says softly: 'A calm breath can defeat a raging army.'"
        ],
        Sugriva: [
            "Sugriva folds his arms: 'Trust is earned in storms, not sunshine.'",
            "Sugriva nods: 'Leadership means carrying everyone's fear and hope together.'"
        ],
        Lakshmana: [
            "Lakshmana says: 'Loyalty is easy in peace, sacred in hardship.'",
            "Lakshmana studies you: 'Your next decision should protect the weakest first.'"
        ],
        Angada: [
            "Angada laughs: 'I am Vali's son, but I choose my own path every day.'",
            "Angada points to the field: 'Skill is memory inside the body.'"
        ]
    };

    characterConversationState = {
        character: characterName,
        opener: randomFrom(openers[characterName]),
        followUp: "",
        fightOffered: false,
        demandedSigil: "",
        rewardGold: 0
    };
}

function processCharacterReply(replyStyle) {
    var tone = {
        humble: "You reply with humility and ask for guidance.",
        bold: "You answer boldly and promise to surpass expectations.",
        playful: "You reply playfully, keeping spirits high."
    };
    var offerFight = randomizer() < 45;
    characterConversationState.followUp = tone[replyStyle] + " " +
        characterConversationState.character + " reacts thoughtfully." +
        (offerFight ? " A sparring challenge is offered!" : " They share a tactical tip for your journey.");
    characterConversationState.fightOffered = offerFight;
}

function resolveCharacterFight() {
    var mods = { Hanuman: -5, Sugriva: 0, Lakshmana: 5, Angada: 2 };
    var odds = clampOdds(getChallengeOdds("fight") + (mods[characterConversationState.character] || 0));
    if (randomizer() < odds) {
        characterConversationState.rewardGold = 0;
        characterConversationState.followUp = "You win the spar! " + characterConversationState.character +
            " salutes your skill and offers advice for battle.";
    } else {
        characterConversationState.rewardGold = 0;
        characterConversationState.followUp = "You lose the spar, and " + characterConversationState.character +
            " urges you to keep refining your form.";
    }
}

function equipTitle(titleKey) {
    return;
}

function unequipTitle() {
    return;
}

function setMiniGameTactic(gameType, tactic) {
    selectedMiniGameTactics[gameType] = tactic;
    showScene();
}

function getMiniGameDecisionOptions(gameType) {
    if (gameType === "duel") {
        return [
            { choice: 160, label: "Feint then Parry", bonus: 10 },
            { choice: 161, label: "Guard and Counter", bonus: 5 },
            { choice: 162, label: "Heavy Overhead Strike", bonus: -5 }
        ];
    } else if (gameType === "brawl") {
        return [
            { choice: 163, label: "Low Stance Grapple", bonus: 10 },
            { choice: 164, label: "Shoulder Rush", bonus: 5 },
            { choice: 165, label: "Wild Leap Tackle", bonus: -5 }
        ];
    } else if (gameType === "shooting") {
        return [
            { choice: 166, label: "Hold Breath, Single Arrow", bonus: 10 },
            { choice: 167, label: "Quick Draw Shot", bonus: 5 },
            { choice: 168, label: "Rapid Triple Shot", bonus: -5 }
        ];
    } else if (gameType === "chase") {
        return [
            { choice: 169, label: "Riverbank Shortcut", bonus: 10 },
            { choice: 170, label: "Steady Pace Through Trees", bonus: 5 },
            { choice: 171, label: "Long Cliff Jump", bonus: -5 }
        ];
    }

    return [
        { choice: 172, label: "Mark Every Turn", bonus: 10 },
        { choice: 173, label: "Follow Wind and Light", bonus: 5 },
        { choice: 174, label: "Sprint Blindly", bonus: -5 }
    ];
}

function beginMiniGameSession(gameType) {
    miniGameSession = {
        gameType: gameType,
        round: 1,
        maxRounds: 3,
        score: 0
    };
}

function handleMiniGameRound(gameType, decisionBonus, rewardName, statRewards) {
    var odds;
    var wonRound;
    var rewardMessage;
    var statName;

    if (!miniGameSession || miniGameSession.gameType !== gameType) {
        beginMiniGameSession(gameType);
    }

    odds = clampOdds(getChallengeOdds(gameType) + decisionBonus);
    wonRound = randomizer() < odds;

    if (wonRound) {
        miniGameSession.score += 1;
        grantGold(8, gameType + " round win");
        alert("Round " + miniGameSession.round + " won! (Roll odds: " + odds + "%)");
    } else {
        alert("Round " + miniGameSession.round + " lost. (Roll odds: " + odds + "%)");
    }

    miniGameSession.round += 1;

    if (miniGameSession.round > miniGameSession.maxRounds) {
        miniGameScores[gameType] += miniGameSession.score;

        if (miniGameSession.score >= 3) {
            for (statName in statRewards) {
                if (statRewards.hasOwnProperty(statName)) {
                    awardPowerup(statName, statRewards[statName]);
                }
            }
            rewardMessage = awardMiniGameReward(rewardName) + " Session score: " + miniGameSession.score + "/3.";
            alert(rewardMessage);
        } else {
            grantGold(5, gameType + " training completion");
            alert("Training complete: " + miniGameSession.score + "/3 rounds won. You now need a perfect 3/3 for relic rewards.");
        }

        miniGameSession = null;
        currentScene = 47;
    }
}

function sampleChoicesExcluding(correctValue) {
    var pool = receiptChoices.filter(function (choiceText) {
        return choiceText !== correctValue;
    });
    var options = [correctValue];
    var randomIndex;

    while (options.length < 3 && pool.length > 0) {
        randomIndex = Math.floor(Math.random() * pool.length);
        options.push(pool[randomIndex]);
        pool.splice(randomIndex, 1);
    }

    while (options.length < 3) {
        options.push("Unknown");
    }

    return options.sort(function () {
        return Math.random() - 0.5;
    });
}

function buildJourneyTriviaState() {
    journeyTriviaState = {
        currentQuestion: 0,
        askedCount: 0,
        score: 0,
        wrong: 0,
        questions: ramayanaTriviaBank.slice().sort(function () {
            return Math.random() - 0.5;
        })
    };
}

function updatePlayerStatsCard() {
    return;
}

function openPlayerStatsModal() {
    return;
}

function closePlayerStatsModal() {
    return;
}

function updateInventoryCard() {
    return;
}

function openInventoryModal() {
    return;
}

function closeInventoryModal() {
    return;
}

function handleInventoryModalBackdrop(event) {
    return;
}

function handlePlayerStatsModalBackdrop(event) {
    return;
}

function awardPowerup(statName, amount) {
    return;
}

function addArtifact(artifactName) {
    return;
}

function clearStoryCard() {
    document.getElementById("storyCard").innerHTML =
        "<!-- this is where the story will be displayed --><div id='choices'></div>";
}

function setUndoButton() {
    var undoButton = document.getElementById("undoButton");

    if (!undoButton) {
        return;
    }

    undoButton.disabled = oldStates.length === 0;
}

function saveOldState() {
    // Save the game exactly as it is before the next choice happens.
    oldStates.push({
        currentScene: currentScene,
        broughtLakshmana: broughtLakshmana,
        wentAlone: wentAlone,
        miniGamesUnlocked: miniGamesUnlocked,
        inventoryArtifacts: inventoryArtifacts.slice(),
        playerStats: JSON.parse(JSON.stringify(playerStats)),
        inventoryItems: inventoryItems.slice(),
        ownedTitles: ownedTitles.slice(),
        equippedTitle: equippedTitle,
        selectedMiniGameTactics: JSON.parse(JSON.stringify(selectedMiniGameTactics)),
        miniGameScores: JSON.parse(JSON.stringify(miniGameScores)),
        miniGameSession: miniGameSession ? JSON.parse(JSON.stringify(miniGameSession)) : null,
        journeyTriviaState: journeyTriviaState ? JSON.parse(JSON.stringify(journeyTriviaState)) : null,
        perfectTriviaSessionsInRow: perfectTriviaSessionsInRow,
        dasharathaStoryUnlocked: dasharathaStoryUnlocked,
        miniGameReturnScene: miniGameReturnScene,
        playerGold: playerGold,
        tradeCount: tradeCount,
        sigilSatchel: JSON.parse(JSON.stringify(sigilSatchel)),
        shopGoods: JSON.parse(JSON.stringify(shopGoods)),
        characterConversationState: characterConversationState ? JSON.parse(JSON.stringify(characterConversationState)) : null,
        pendingSigilDebt: pendingSigilDebt,
        guessGameState: guessGameState ? JSON.parse(JSON.stringify(guessGameState)) : null,
        explorationState: explorationState ? JSON.parse(JSON.stringify(explorationState)) : null,
        receiptScenes: receiptScenes.slice(),
        receiptChoices: receiptChoices.slice(),
        visitedSceneIds: visitedSceneIds.slice(),
        takenTransitions: takenTransitions.slice()
    });
    setUndoButton();
}

function undoChoice() {
    var oldState;

    if (oldStates.length === 0) {
        return;
    }

    // Go back to the last saved version of the game.
    oldState = oldStates.pop();
    currentScene = oldState.currentScene;
    broughtLakshmana = oldState.broughtLakshmana;
    wentAlone = oldState.wentAlone;
    miniGamesUnlocked = oldState.miniGamesUnlocked;
    inventoryArtifacts = oldState.inventoryArtifacts;
    playerStats = oldState.playerStats;
    inventoryItems = oldState.inventoryItems || [];
    ownedTitles = oldState.ownedTitles || [];
    equippedTitle = oldState.equippedTitle || "";
    selectedMiniGameTactics = oldState.selectedMiniGameTactics || selectedMiniGameTactics;
    miniGameScores = oldState.miniGameScores || miniGameScores;
    miniGameSession = oldState.miniGameSession || null;
    journeyTriviaState = oldState.journeyTriviaState || null;
    perfectTriviaSessionsInRow = oldState.perfectTriviaSessionsInRow || 0;
    dasharathaStoryUnlocked = !!oldState.dasharathaStoryUnlocked;
    miniGameReturnScene = typeof oldState.miniGameReturnScene === "number" ? oldState.miniGameReturnScene : null;
    playerGold = oldState.playerGold || 0;
    tradeCount = oldState.tradeCount || 0;
    sigilSatchel = oldState.sigilSatchel || {};
    shopGoods = oldState.shopGoods || {};
    characterConversationState = oldState.characterConversationState || null;
    pendingSigilDebt = oldState.pendingSigilDebt || "";
    guessGameState = oldState.guessGameState || null;
    explorationState = oldState.explorationState || null;
    receiptScenes = oldState.receiptScenes;
    receiptChoices = oldState.receiptChoices;
    visitedSceneIds = oldState.visitedSceneIds;
    takenTransitions = oldState.takenTransitions;

    if (currentScene === 0) {
        clearStoryCard();
        renderTimeline(timelineModalOpen);
        setUndoButton();
        return;
    }

    showScene();
}

function addSceneToReceipt() {
    var storyCard = document.getElementById("storyCard");
    var heading = storyCard.querySelector("h2");
    var paragraphs = storyCard.querySelectorAll("p");
    var sceneText = heading ? heading.textContent.trim() : "Scene";
    var i;

    for (i = 0; i < paragraphs.length; i++) {
        sceneText += " - " + paragraphs[i].textContent.trim();
    }

    if (receiptScenes[receiptScenes.length - 1] !== sceneText) {
        receiptScenes.push(sceneText);
    }
}

function makeReceipt() {
    var storyCard = document.getElementById("storyCard");
    var receipt = "";
    var i;

    if (currentScene !== 17 && currentScene !== 18 && currentScene !== 21 &&
        currentScene !== 31 && currentScene !== 37 && currentScene !== 38 &&
        currentScene !== 39 && currentScene !== 45 && currentScene !== 46 &&
        currentScene !== 52 && currentScene !== 67 &&
        currentScene !== 47) {
        return;
    }

    receipt += "<section id='receiptCard'>";
    receipt += "<h3>Story Receipt</h3>";
    receipt += "<p><strong>Traveler:</strong> " + (playerName || "Unknown") + "</p>";
    receipt += "<div class='receipt-section'><h4>Your Choices</h4><ol>";

    for (i = 0; i < receiptChoices.length; i++) {
        receipt += "<li>" + receiptChoices[i] + "</li>";
    }

    receipt += "</ol></div>";
    receipt += "<div class='receipt-section'><h4>Full Story</h4><ol>";

    for (i = 0; i < receiptScenes.length; i++) {
        receipt += "<li>" + receiptScenes[i] + "</li>";
    }

    receipt += "</ol></div>";
    receipt += "</section>";
    storyCard.innerHTML += receipt;
}

function addChoiceToReceipt(choiceText) {
    receiptChoices.push(choiceText);
}

function restart() {
    currentScene = 0;
    broughtLakshmana = false;
    wentAlone = false;
    miniGamesUnlocked = false;
    inventoryArtifacts = [];
    playerStats = {};
    inventoryItems = [];
    ownedTitles = [];
    equippedTitle = "";
    selectedMiniGameTactics = {
        duel: "balanced",
        brawl: "balanced",
        shooting: "balanced",
        chase: "balanced",
        maze: "balanced"
    };
    miniGameScores = {
        duel: 0,
        brawl: 0,
        shooting: 0,
        chase: 0,
        maze: 0,
        journeyTrivia: 0
    };
    miniGameSession = null;
    journeyTriviaState = null;
    perfectTriviaSessionsInRow = 0;
    dasharathaStoryUnlocked = false;
    miniGameReturnScene = null;
    playerGold = 0;
    tradeCount = 0;
    sigilSatchel = {};
    shopGoods = {};
    characterConversationState = null;
    pendingSigilDebt = "";
    guessGameState = null;
    explorationState = null;
    receiptScenes = [];
    receiptChoices = [];
    oldStates = [];
    visitedSceneIds = [];
    takenTransitions = [];
    clearStoryCard();
    renderTimeline(timelineModalOpen);
    setUndoButton();
    updatePlayerStatsCard();
    updateInventoryCard();
}

function startAdventure() {
    playerName = document.getElementById("playerName").value.trim();

    if (playerName === "") {
        alert("Please enter your name!");
        return;
    }

    oldStates = [];
    visitedSceneIds = [];
    takenTransitions = [];
    miniGameReturnScene = null;
    characterConversationState = null;
    pendingSigilDebt = "";
    guessGameState = null;
    explorationState = null;
    currentScene = 1;
    updatePlayerStatsCard();
    showScene();
}

function isTerminalScene(sceneId) {
    return sceneId === 17 || sceneId === 18 || sceneId === 21 || sceneId === 38 ||
        sceneId === 39 || sceneId === 45 || sceneId === 46 || sceneId === 52 ||
        sceneId === 67;
}

function isMiniGameScene(sceneId) {
    return sceneId === 47 || sceneId === 55 || sceneId === 56 || sceneId === 57 ||
        sceneId === 58 || sceneId === 59 || sceneId === 70 || sceneId === 71 ||
        sceneId === 72 || sceneId === 73 || sceneId === 77 || sceneId === 79 ||
        sceneId === 93 || sceneId === 94;
}

function escapeHtml(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;");
}

function makeWrappedTextLines(text, maxCharsPerLine) {
    var words = text.split(" ");
    var lines = [];
    var line = "";
    var i;

    for (i = 0; i < words.length; i++) {
        if ((line + " " + words[i]).trim().length > maxCharsPerLine && line !== "") {
            lines.push(line);
            line = words[i];
        } else {
            line = (line + " " + words[i]).trim();
        }
    }

    if (line !== "") {
        lines.push(line);
    }

    return lines;
}


function updateTimelineZoomLabel() {
    var label = document.getElementById("timelineZoomValue");

    if (!label) {
        return;
    }

    label.textContent = Math.round(timelineZoom * 100) + "%";
}

function adjustTimelineZoom(change) {
    timelineZoom = Math.max(1, Math.min(2.5, timelineZoom + change));
    updateTimelineZoomLabel();
    renderTimeline(timelineModalOpen);
}

function renderTimeline(showHighlight) {
    var container = document.getElementById("timelineFlowchart");
    var svg = "";
    var nodeWidth = 260;
    var nodeHeight = 100;
    var levelGap = 330;
    var rowGap = 180;
    var marginX = 70;
    var marginY = 80;
    var width = marginX * 2 + (timelineLevels.length - 1) * levelGap + nodeWidth;
    var maxRows = 0;
    var height;
    var coords = {};
    var edgeKeyMap = {};
    var levelGroups = [
        "Exile",
        "Surphanaka",
        "Golden Deer",
        "Abduction",
        "Jatayu",
        "Alliance",
        "Part 2"
    ];
    var levelLabelStep = Math.ceil(timelineLevels.length / levelGroups.length);
    var i;
    var j;
    var levelNodes;
    var yStart;
    var nodeId;
    var edge;
    var fromNode;
    var toNode;
    var fromX;
    var fromY;
    var toX;
    var toY;
    var ctrlX1;
    var ctrlX2;
    var pathClass;
    var nodeClass;
    var labelX;
    var labelY;
    var titleLines;
    var titleLine;
    var k;
    var columnLabel;
    var columnStartX;

    if (!container) {
        return;
    }

    for (i = 0; i < timelineLevels.length; i++) {
        if (timelineLevels[i].length > maxRows) {
            maxRows = timelineLevels[i].length;
        }
    }

    height = marginY * 2 + (maxRows - 1) * rowGap + nodeHeight;

    for (i = 0; i < timelineLevels.length; i++) {
        levelNodes = timelineLevels[i];
        yStart = marginY + ((maxRows - levelNodes.length) * rowGap) / 2;

        for (j = 0; j < levelNodes.length; j++) {
            nodeId = levelNodes[j];
            coords[nodeId] = {
                x: marginX + i * levelGap,
                y: yStart + j * rowGap
            };
        }
    }

    if (showHighlight) {
        for (i = 0; i < takenTransitions.length; i++) {
            edgeKeyMap[takenTransitions[i]] = true;
        }
    }

    svg += "<svg viewBox='0 0 " + width + " " + height + "' role='img' aria-label='Story timeline flowchart'>";

    for (i = 0; i < timelineLevels.length; i++) {
        columnStartX = marginX + i * levelGap;
        svg += "<rect x='" + (columnStartX - 16) + "' y='16' width='" + (nodeWidth + 32) +
            "' height='" + (height - 32) + "' rx='18' ry='18' fill='rgba(255, 248, 229, 0.02)' stroke='rgba(255, 225, 169, 0.08)' />";

        if (i % levelLabelStep === 0) {
            columnLabel = levelGroups[Math.floor(i / levelLabelStep)] || "Story";
            svg += "<text class='timeline-column-label' x='" + columnStartX + "' y='48'>" + columnLabel + "</text>";
        }
    }

    for (i = 0; i < timelineEdges.length; i++) {
        edge = timelineEdges[i];
        fromNode = coords[edge.from];
        toNode = coords[edge.to];

        if (!fromNode || !toNode) {
            continue;
        }

        fromX = fromNode.x + nodeWidth;
        fromY = fromNode.y + nodeHeight / 2;
        toX = toNode.x;
        toY = toNode.y + nodeHeight / 2;
        ctrlX1 = fromX + 90;
        ctrlX2 = toX - 90;
        pathClass = "timeline-edge";

        if (edge.type === "chance") {
            pathClass += " chance";
        }

        if (edgeKeyMap[edge.from + "->" + edge.to]) {
            pathClass += " active";
        }

        svg += "<path class='" + pathClass + "' d='M " + fromX + " " + fromY +
            " C " + ctrlX1 + " " + fromY + ", " + ctrlX2 + " " + toY + ", " + toX + " " + toY + "' />";

        labelX = (fromX + toX) / 2;
        labelY = (fromY + toY) / 2 - 6;
        svg += "<text class='edge-label' x='" + labelX + "' y='" + labelY + "'>" + edge.label + "</text>";
    }

    for (i = 0; i < timelineLevels.length; i++) {
        levelNodes = timelineLevels[i];

        for (j = 0; j < levelNodes.length; j++) {
            nodeId = levelNodes[j];
            nodeClass = "timeline-node";

            if (showHighlight && visitedSceneIds.indexOf(nodeId) !== -1) {
                nodeClass += " visited";
            }

            if (showHighlight && nodeId === currentScene) {
                nodeClass += " active";
            }

            svg += "<rect class='" + nodeClass + "' x='" + coords[nodeId].x + "' y='" + coords[nodeId].y +
                "' rx='12' ry='12' width='" + nodeWidth + "' height='" + nodeHeight + "'></rect>";
            svg += "<text class='node-id' x='" + (coords[nodeId].x + 16) + "' y='" + (coords[nodeId].y + 30) + "'>S" + nodeId + "</text>";
            titleLines = makeWrappedTextLines(timelineNodeTitles[nodeId] || "Scene", 24);

            for (k = 0; k < titleLines.length && k < 3; k++) {
                titleLine = escapeHtml(titleLines[k]);
                svg += "<text class='node-title' x='" + (coords[nodeId].x + 16) + "' y='" +
                    (coords[nodeId].y + 56 + k * 18) + "'>" + titleLine + "</text>";
            }
        }
    }

    svg += "</svg>";
    container.innerHTML = svg;

    var renderedSvg = container.querySelector("svg");

    if (renderedSvg) {
        renderedSvg.style.width = (timelineZoom * 100) + "%";
        renderedSvg.style.minWidth = (3600 * timelineZoom) + "px";
    }
}

function openTimelineModal() {
    var modal = document.getElementById("timelineModal");

    if (!modal) {
        return;
    }

    timelineModalOpen = true;
    updateTimelineZoomLabel();
    renderTimeline(true);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}

function closeTimelineModal() {
    var modal = document.getElementById("timelineModal");

    if (!modal) {
        return;
    }

    timelineModalOpen = false;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

function handleTimelineModalBackdrop(event) {
    if (event.target && event.target.id === "timelineModal") {
        closeTimelineModal();
    }
}

function showScene() {
    var storyCard = document.getElementById("storyCard");
    var shouldAutoOpenTimeline;
    var choicesContainer;

    unlockTitleIfEligible();

    if (currentScene === 1) {
        storyCard.innerHTML =
            "<h1>Part 1: The Exile</h1>" +
            "<h2>Welcome, " + playerName + "!</h2>" +
            "<p>You are a brave warrior in ancient India from the Kingdom of Ayodhya. You are soon to be crowned ruler, as your father, King Dasharatha, is getting old.</p>" +
            "<p>One of your father's wives, Kaikeyi, demands that her own son, your younger brother Bharata, be crowned instead. Your father is left with no choice but to exile you from the kingdom.</p>" +
            "<p>As part of your exile, you swear that you will live apart from royal comfort and will not enter any city until your exile ends.</p>" +
            "<p>Do you:</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(3)'>Argue back</button>" +
            "<button onclick='makeChoice(4)'>Accept the exile</button>" +
            "</div>";
    } else if (currentScene === 2) {
        storyCard.innerHTML =
            "<h2>Exile Begins</h2>" +
            "<p>You have been banished from Ayodhya. The road ahead is uncertain, and your response will shape the rest of your journey.</p>" +
            "<p>Do you:</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(3)'>Argue back</button>" +
            "<button onclick='makeChoice(4)'>Accept the exile</button>" +
            "</div>";
    } else if (currentScene === 3) {
        storyCard.innerHTML =
            "<h2>You choose to argue back.</h2>" +
            "<p>Dasharatha is moved by your words and begins to argue with Kaikeyi. Though he is heartbroken, he is ultimately unable to resist her demands because of an old promise.</p>" +
            "<p>You are left with no choice but to continue into exile.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(4)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 4) {
        storyCard.innerHTML =
            "<h2>You choose to accept the exile.</h2>" +
            "<p>You prepare to leave, bound by your exile and your vow not to enter any city until it is over. Your brother Lakshmana and your wife Sita insist on going with you.</p>" +
            "<p>Do you:</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(5)'>Go alone</button>" +
            "<button onclick='makeChoice(6)'>Go with them</button>" +
            "</div>";
    } else if (currentScene === 5) {
        storyCard.innerHTML =
            "<h2>You choose to go alone.</h2>" +
            "<p>You decide it will be easier for your loved ones to remain safe and comfortable in Ayodhya. You set out alone, carrying the burden of exile by yourself.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(8)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 6) {
        storyCard.innerHTML =
            "<h2>You choose to go with them.</h2>" +
            "<p>You, Lakshmana, and Sita journey together through the forests. The trials are difficult, but their loyalty gives you strength.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(8)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 7) {
        storyCard.innerHTML =
            "<h2>Surphanaka's Encounter</h2>" +
            "<p>One day, outside your home, you encounter a powerful demoness named Surphanaka. She claims she wants to be your wife, but you refuse because you are already married.</p>" +
            "<p>You suggest Lakshmana instead, but he refuses as well. Furious, Surphanaka threatens to kill Sita.</p>" +
            "<p>What do you do?</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(12)'>Accept the marriage</button>" +
            "<button onclick='makeChoice(9)'>Fight Surphanaka</button>" +
            "<button onclick='makeChoice(10)'>Protect Sita</button>" +
            "<button onclick='makeChoice(11)'>Negotiate</button>" +
            "</div>";
    } else if (currentScene === 8) {
        storyCard.innerHTML =
            "<h2>Surphanaka's Encounter</h2>" +
            "<p>One day, outside your home, you encounter a powerful demoness named Surphanaka. She claims she wants to be your wife.</p>" +
            "<p>Do you:</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(12)'>Accept</button>" +
            "<button onclick='makeChoice(13)'>Reject</button>" +
            "</div>";
    } else if (currentScene === 9) {
        storyCard.innerHTML =
            "<h2>Fight Surphanaka</h2>" +
            "<p>You choose to fight Surphanaka. Your strengths are evenly matched, and fate will decide the outcome.</p>" +
            "<p><strong>Current fight win odds:</strong> " + getChallengeOdds("fight") + "%</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(14)'>Fight</button>" +
            "</div>";
    } else if (currentScene === 10) {
        storyCard.innerHTML =
            "<h2>Protect Sita</h2>" +
            "<p>You rush to defend Sita before Surphanaka can strike. Lakshmana steps in as well, and together you force the demoness to retreat in humiliation.</p>" +
            "<p>With Surphanaka driven away, the forest grows quiet once more. For a brief moment, it seems your troubles have passed.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(19)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 11) {
        storyCard.innerHTML =
            "<h2>Negotiate with Surphanaka</h2>" +
            "<p>You try to calm Surphanaka with reason, hoping to avoid violence. For a moment she listens, but her anger burns fiercely.</p>" +
            "<p>Do you try one last peaceful appeal, or prepare to fight?</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(15)'>Try again</button>" +
            "<button onclick='makeChoice(9)'>Prepare to fight</button>" +
            "</div>";
    } else if (currentScene === 12) {
        storyCard.innerHTML =
            "<h2>Accept Surphanaka's Proposal</h2>" +
            "<p>You accept Surphanaka's proposal and choose to stand by her side. Word of this shocking alliance quickly spreads across the land.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(16)'>Meet Ravana</button>" +
            "</div>";
    } else if (currentScene === 13) {
        storyCard.innerHTML =
            "<h2>Reject Surphanaka's Proposal</h2>" +
            "<p>You reject Surphanaka firmly. She is enraged by the insult and prepares to attack.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(9)'>Fight Surphanaka</button>" +
            "</div>";
    } else if (currentScene === 14) {
        storyCard.innerHTML =
            "<h2>Victory</h2>" +
            "<p>You defeat Surphanaka, and she flees in disgrace. At last, you, Sita, and Lakshmana are free from her schemes.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(19)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 52) {
        storyCard.innerHTML =
            "<h2>Peaceful Ending</h2>" +
            "<p>You defeat Surphanaka while traveling alone, and her threat finally comes to an end.</p>" +
            "<p>Later, when the time comes to return, you refuse to go back to Ayodhya. Instead, you stay where you have found peace and live happily ever after.</p>" +
            "<div id='choices'>" +
            "<button onclick='restart()'>Restart</button>" +
            "</div>";
    } else if (currentScene === 15) {
        storyCard.innerHTML =
            "<h2>Negotiation Fails</h2>" +
            "<p>Your final attempt at peace fails. Surphanaka's fury grows, and you realize battle can no longer be avoided.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(9)'>Fight Surphanaka</button>" +
            "</div>";
    } else if (currentScene === 16) {
        storyCard.innerHTML =
            "<h2>Meeting Ravana</h2>" +
            "<p>Surphanaka brings you before her brother, Ravana, the mighty king of Lanka. Rather than treating you as an enemy, he welcomes your ambition and darkness.</p>" +
            "<p>Ravana offers you power, a throne, and a new future beside Surphanaka.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(17)'>Claim the throne</button>" +
            "</div>";
    } else if (currentScene === 17) {
        storyCard.innerHTML =
            "<h2>Evil King Ending</h2>" +
            "<p>You accept Ravana's offer, marry Surphanaka, and rise as an evil king. Together, you rule with fear, power, and strange happiness for the rest of your days.</p>" +
            "<p>In this ending, your adventure does not end in honor, but in a dark happily ever after.</p>" +
            "<div id='choices'>" +
            "<button onclick='restart()'>Restart</button>" +
            "</div>";
    } else if (currentScene === 18) {
        storyCard.innerHTML =
            "<h2>Game Over</h2>" +
            "<p>You fought bravely, but Surphanaka proved too powerful. Your journey ends here.</p>" +
            "<div id='choices'>" +
            "<button onclick='restart()'>Restart</button>" +
            "</div>";
    } else if (currentScene === 19) {
        storyCard.innerHTML =
            "<h2>The Golden Deer</h2>" +
            "<p>Days later, while traveling with Sita and Lakshmana, you spot a beautiful golden deer shimmering between the trees. Its coat glows like sunlight, and Sita is immediately enchanted by it.</p>" +
            "<p>She asks you to catch it for her, but Lakshmana warns that such a creature may be a trick. Unknown to you, the golden deer is actually the demon Maricha in disguise.</p>" +
            "<p>What do you do?</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(95)'>Investigate a strange glimmer nearby</button>" +
            "<button onclick='makeChoice(20)'>Chase the deer</button>" +
            "<button onclick='makeChoice(21)'>Ignore it</button>" +
            "</div>";
    } else if (currentScene === 95) {
        storyCard.innerHTML =
            "<h2>Artifact Found: Maricha's Gleaming Horn Fragment</h2>" +
            "<p>Near a tree root, you find a splinter that flashes with unnatural gold. A forest hermit whispers that illusions can be touched, but never trusted.</p>" +
            "<p><em>Extra Lore:</em> Some retellings use this scene to teach that maya can imitate truth closely enough to fool even the noble-hearted.</p>" +
            "<p>What do you do next?</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(20)'>Chase the deer anyway</button>" +
            "<button onclick='makeChoice(21)'>Ignore the deer and stay alert</button>" +
            "</div>";
    } else if (currentScene === 20) {
        storyCard.innerHTML =
            "<h2>Bring Lakshmana?</h2>" +
            "<p>Sita pleads with you to catch the deer. Lakshmana still does not trust it and offers to come with you if you want help.</p>" +
            "<p>Do you bring Lakshmana with you?</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(22)'>Yes, bring Lakshmana</button>" +
            "<button onclick='makeChoice(23)'>No, leave him with Sita</button>" +
            "</div>";
    } else if (currentScene === 21) {
        storyCard.innerHTML =
            "<h2>You Ignore the Deer</h2>" +
            "<p>You decide not to trust the strange creature. Staying with Sita and Lakshmana keeps your family safe, and the golden deer vanishes back into the forest.</p>" +
            "<p>The danger passes, and this path of the story comes to an end.</p>" +
            "<div id='choices'>" +
            "<button onclick='restart()'>Restart</button>" +
            "</div>";
    } else if (currentScene === 22) {
        storyCard.innerHTML =
            "<h2>Find the Deer</h2>" +
            "<p>You and Lakshmana track the golden deer deeper into the forest, while Sita remains behind at the hut. The creature keeps just out of reach, always glittering between the trees.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(24)'>Keep following it</button>" +
            "</div>";
    } else if (currentScene === 23) {
        storyCard.innerHTML =
            "<h2>Find the Deer</h2>" +
            "<p>You leave Lakshmana behind to guard Sita and track the golden deer alone. The creature leads you farther and farther from the hut, never seeming to tire.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(24)'>Keep following it</button>" +
            "</div>";
    } else if (currentScene === 24) {
        storyCard.innerHTML =
            "<h2>Shoot the Deer</h2>" +
            "<p>At last, you loose an arrow and strike the golden deer. As it falls, its shining body twists and changes. Before you lies Maricha, the demon who had taken the deer's form.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(25)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 25) {
        storyCard.innerHTML =
            "<h2>Maricha's Last Cry</h2>" +
            "<p>With his dying breath, Maricha cries out in a voice that sounds just like yours. The sound rushes back through the forest toward Sita and Lakshmana.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(26)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 26) {
        storyCard.innerHTML =
            "<h2>Ravana Sees His Chance</h2>" +
            "<p>Because Lakshmana came with you, Sita is left alone at the hut. Ravana wastes no time. Disguised as a holy man, he approaches her with false humility before revealing his true form.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(27)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 27) {
        storyCard.innerHTML =
            "<h2>Lakshmana Draws the Line</h2>" +
            "<p>Hearing Maricha's false cry, Sita begs Lakshmana to go after you. Before leaving, Lakshmana draws a protective line around the hut and warns her not to step outside it for any reason.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(28)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 28) {
        storyCard.innerHTML =
            "<h2>Ravana's Trick</h2>" +
            "<p>Ravana arrives disguised as a wandering holy man and asks Sita for alms. Bound by duty and compassion, she is torn between Lakshmana's warning and the request of a guest.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(29)'>See what happens</button>" +
            "</div>";
    } else if (currentScene === 29) {
        storyCard.innerHTML =
            "<h2>The Abduction of Sita</h2>" +
            "<p>Ravana reveals his true form, seizes Sita, and lifts her into his flying chariot. He rises above the forest with her as she cries out for help.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(30)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 30) {
        storyCard.innerHTML =
            "<h2>Jatayu Sees Ravana</h2>" +
            "<p>Jatayu, the aged vulture king, sees Ravana carrying Sita away through the sky. He knows he may be too old for battle, but he cannot ignore her cries.</p>" +
            "<p>What does Jatayu do?</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(96)'>Examine the sky-swept feathers first</button>" +
            "<button onclick='makeChoice(31)'>Do nothing</button>" +
            "<button onclick='makeChoice(32)'>Try to rescue Sita</button>" +
            "</div>";
    } else if (currentScene === 96) {
        storyCard.innerHTML =
            "<h2>Artifact Found: Jatayu's Wind-Sworn Plume</h2>" +
            "<p>You recover a plume marked with claw-lines from Jatayu's first clash with Ravana's chariot.</p>" +
            "<p><em>Extra Lore:</em> Commentarial traditions praise Jatayu as proof that age does not reduce one's duty to protect the innocent.</p>" +
            "<p>How should Jatayu act now?</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(31)'>Do nothing</button>" +
            "<button onclick='makeChoice(32)'>Try to rescue Sita</button>" +
            "</div>";
    } else if (currentScene === 31) {
        storyCard.innerHTML =
            "<h2>Sita is Taken</h2>" +
            "<p>Jatayu does not intervene. Ravana escapes with Sita, and when you return, your exile has become a desperate rescue mission.</p>" +
            "<p>You and Lakshmana immediately begin searching the forest for signs of where she was taken.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(65)'>Keep searching</button>" +
            "</div>";
    } else if (currentScene === 32) {
        storyCard.innerHTML =
            "<h2>Jatayu's Rescue Attempt</h2>" +
            "<p>Jatayu launches himself into the sky to stop Ravana. To help him succeed, answer these three questions correctly.</p>" +
            "<p><strong>What kind of being is Hanuman?</strong></p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(48)'>A vanara</button>" +
            "<button onclick='makeChoice(34)'>A rakshasa</button>" +
            "<button onclick='makeChoice(35)'>A naga</button>" +
            "</div>";
    } else if (currentScene === 48) {
        storyCard.innerHTML =
            "<h2>Jatayu's Rescue Attempt</h2>" +
            "<p>Jatayu keeps fighting in the sky. Answer the second question:</p>" +
            "<p><strong>What is the name of the island kingdom ruled by Ravana?</strong></p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(49)'>Lanka</button>" +
            "<button onclick='makeChoice(34)'>Ayodhya</button>" +
            "<button onclick='makeChoice(35)'>Mithila</button>" +
            "</div>";
    } else if (currentScene === 49) {
        storyCard.innerHTML =
            "<h2>Jatayu's Rescue Attempt</h2>" +
            "<p>Jatayu is almost there. Answer the final question:</p>" +
            "<p><strong>Who is Rama's loyal brother traveling with him in the forest?</strong></p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(33)'>Lakshmana</button>" +
            "<button onclick='makeChoice(34)'>Bharata</button>" +
            "<button onclick='makeChoice(35)'>Vali</button>" +
            "</div>";
    } else if (currentScene === 50) {
        storyCard.innerHTML =
            "<h2>Jatayu's Final Struggle</h2>" +
            "<p>You answered all three questions correctly, but the battle is still dangerous. Jatayu makes one final desperate attack against Ravana in the sky.</p>" +
            "<p>Fate will now decide whether he wins or falls.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(51)'>See what happens</button>" +
            "</div>";
    } else if (currentScene === 33) {
        storyCard.innerHTML =
            "<h2>Jatayu Rescues Sita</h2>" +
            "<p>Your answer gives Jatayu the strength he needs. He slashes Ravana's chariot apart, forces it down into the forest, and rescues Sita before Ravana can flee.</p>" +
            "<p>Jatayu returns Sita safely to you, but Ravana is still nearby among the wreckage of the shattered chariot.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(36)'>Go after Ravana</button>" +
            "</div>";
    } else if (currentScene === 34) {
        storyCard.innerHTML =
            "<h2>Jatayu Falls</h2>" +
            "<p>Jatayu attacks bravely, but without enough strength behind him, Ravana strikes him down. Sita is still carried away into the distance.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(37)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 35) {
        storyCard.innerHTML =
            "<h2>Jatayu Falls</h2>" +
            "<p>Jatayu fights with all his courage, but Ravana defeats him. Sita remains in Ravana's grasp, and the journey must continue without her.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(37)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 36) {
        storyCard.innerHTML =
            "<h2>Fight Ravana in the Forest</h2>" +
            "<p>You race to the forest where Jatayu shattered Ravana's chariot. There, among broken wheels and torn banners, you confront Ravana before he can escape.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(38)'>Fight Ravana</button>" +
            "</div>";
    } else if (currentScene === 37) {
        storyCard.innerHTML =
            "<h2>Sita is Taken</h2>" +
            "<p>Jatayu's bravery could not stop Ravana. When you return, you learn that Sita has been taken, and your exile becomes a rescue mission.</p>" +
            "<p>You and Lakshmana begin searching at once, following broken branches and tracks through the woods.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(65)'>Keep searching</button>" +
            "</div>";
    } else if (currentScene === 65) {
        storyCard.innerHTML =
            "<h2>Searching for Sita</h2>" +
            "<p>You search through groves, riverbanks, and rocky trails for any clue of Sita's path. As the day fades, you decide to return to your forest home to regroup.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(66)'>Return to the hut</button>" +
            "</div>";
    } else if (currentScene === 66) {
        storyCard.innerHTML =
            "<h2>Bharata at the Hut</h2>" +
            "<p>When you return, Bharata is waiting. He falls at your feet and pleads for you to return to Ayodhya and take the throne.</p>" +
            "<p>Do you accept Bharata's plea or continue your exile and rescue mission?</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(67)'>Accept and return</button>" +
            "<button onclick='makeChoice(68)'>Decline and continue exile</button>" +
            "</div>";
    } else if (currentScene === 67) {
        storyCard.innerHTML =
            "<h2>Ayodhya Return Ending</h2>" +
            "<p>You accept Bharata's plea and return to Ayodhya before your exile vow is complete. Court rivals see your return as a threat, and you are killed in a palace conspiracy.</p>" +
            "<p>Your story ends in Ayodhya before Sita can be rescued.</p>" +
            "<div id='choices'>" +
            "<button onclick='restart()'>Restart</button>" +
            "</div>";
    } else if (currentScene === 68) {
        storyCard.innerHTML =
            "<h2>The Sandals Promise</h2>" +
            "<p>You refuse to return early and place your sandals in Bharata's hands. Bharata vows, \"I am not king. You are king, and I will rule only as your servant until you return.\"</p>" +
            "<p>With your vow intact, you continue the search and soon cross paths with Sugriva.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(40)'>Continue to Sugriva</button>" +
            "</div>";
    } else if (currentScene === 38) {
        storyCard.innerHTML =
            "<h2>Forest Duel Ending</h2>" +
            "<p>You meet Ravana in the forest beside the wreck of his broken chariot and battle him face to face. Though the clash shakes the forest, Sita is safe by your side once more.</p>" +
            "<p>This path ends with a hard-won victory and the promise of new dangers ahead.</p>" +
            "<div id='choices'>" +
            "<button onclick='restart()'>Restart</button>" +
            "</div>";
    } else if (currentScene === 39) {
        storyCard.innerHTML =
            "<h2>Lakshmana Saves Sita</h2>" +
            "<p>As Ravana moves to seize Sita, Lakshmana returns in time to intervene. Ravana is forced to retreat, and Sita remains safe within the protection of the line.</p>" +
            "<p>This path ends with danger avoided, at least for now.</p>" +
            "<div id='choices'>" +
            "<button onclick='restart()'>Restart</button>" +
            "</div>";
    } else if (currentScene === 40) {
        storyCard.innerHTML =
            "<h2>Meeting Sugriva</h2>" +
            "<p>As you and Lakshmana search for Sita, you come upon Sugriva, a vanara prince hiding in fear. He has been driven from his home by his powerful brother, Vali.</p>" +
            "<p>Sugriva offers friendship and help in your search if you will help him in return.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(97)'>Inspect the cave mural nearby</button>" +
            "<button onclick='makeChoice(41)'>Hear Sugriva's request</button>" +
            "</div>";
    } else if (currentScene === 97) {
        storyCard.innerHTML =
            "<h2>Artifact Found: Kishkindha Cave Mural Tablet</h2>" +
            "<p>Painted stone scenes show vanara heroes leaping impossible distances in service of dharma. The art predates your arrival, as if awaiting Hanuman's future deed.</p>" +
            "<p><em>Extra Lore:</em> Regional oral retellings often include cave murals as memory archives for vanara clans.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(41)'>Return to Sugriva's request</button>" +
            "</div>";
    } else if (currentScene === 41) {
        storyCard.innerHTML =
            "<h2>Sugriva's Plea</h2>" +
            "<p>Sugriva tells you that Vali stole his wife and seized his place. He begs you to help him defeat Vali so he can reclaim what was taken from him.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(42)'>Consider his plan</button>" +
            "</div>";
    } else if (currentScene === 42) {
        storyCard.innerHTML =
            "<h2>Your Exile Vow</h2>" +
            "<p>You remind Sugriva that during your exile you swore not to enter any city. Because of that vow, you cannot march into Vali's stronghold yourself.</p>" +
            "<p>Instead, you convince Sugriva to lure Vali out and fight him where you can take the shot from the forest.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(43)'>Set the trap</button>" +
            "</div>";
    } else if (currentScene === 43) {
        storyCard.innerHTML =
            "<h2>Sugriva Challenges Vali</h2>" +
            "<p>Sugriva roars a challenge, and Vali rushes out to fight him. The brothers clash with such speed and force that the whole forest trembles.</p>" +
            "<p>To strike true, answer this question correctly:</p>" +
            "<p><strong>What did Vali steal from Sugriva?</strong></p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(44)'>Sugriva's wife</button>" +
            "<button onclick='makeChoice(45)'>Sugriva's bow</button>" +
            "<button onclick='makeChoice(46)'>Sugriva's horse</button>" +
            "</div>";
    } else if (currentScene === 44) {
        storyCard.innerHTML =
            "<h2>Vali Falls</h2>" +
            "<p>Your answer steadies your hand. You loose your arrow at the perfect moment, and it strikes Vali down. Sugriva is finally freed from his brother's power.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(47)'>Meet Sugriva's ally</button>" +
            "</div>";
    } else if (currentScene === 45) {
        storyCard.innerHTML =
            "<h2>You Miss the Moment</h2>" +
            "<p>Your aim wavers, and the shot is lost. Vali realizes something is wrong, and Sugriva is forced to retreat before the plan succeeds.</p>" +
            "<div id='choices'>" +
            "<button onclick='restart()'>Restart</button>" +
            "</div>";
    } else if (currentScene === 46) {
        storyCard.innerHTML =
            "<h2>You Miss the Moment</h2>" +
            "<p>You hesitate for too long, and Vali gains the advantage. Sugriva barely escapes, and this attempt to help him fails.</p>" +
            "<div id='choices'>" +
            "<button onclick='restart()'>Restart</button>" +
            "</div>";
        //part 2 makedecision and decision instead of makechoice and choice (start from scene 53)
    } else if (currentScene === 47) {
        storyCard.innerHTML =
            "<h2>Meeting Hanuman</h2>" +
            "<p>Grateful for your help, Sugriva brings forward his wisest and most loyal companion: Hanuman. Hanuman bows before you and offers his strength in the search for Sita.</p>" +
            "<p>The war-camp is focused now: conversation, sparring, and two games to sharpen your mind.</p>" +
            "<p><strong>Trivia streak (perfect sessions in a row):</strong> " + perfectTriviaSessionsInRow + "/20</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(70)'>Journey Trivia</button>" +
            "<button onclick='makeChoice(93)'>Guessing Game</button>" +
            "<button onclick='makeChoice(80)'>Talk to Hanuman</button>" +
            "<button onclick='makeChoice(81)'>Talk to Sugriva</button>" +
            "<button onclick='makeChoice(82)'>Talk to Lakshmana</button>" +
            "<button onclick='makeChoice(83)'>Talk to Angada</button>" +
            (dasharathaStoryUnlocked ? "<button onclick='makeChoice(69)'>New Storyline: Dasharatha's Demand</button>" : "") +
            "<button onclick='makeDecision(1)'>Continue Main Story</button>" +
            "</div>";
    } else if (currentScene === 55) {
        storyCard.innerHTML =
            "<h2>Mini-game: Duel</h2>" +
            "<p>Hanuman arranges a sword duel to sharpen your timing and guard. The arena rotates challengers each round, forcing you to read stance, tempo, and feints.</p>" +
            "<p>Win rounds to earn gold and complete the session for relic rewards.</p>" +
            "<p><strong>Tactic:</strong> " + selectedMiniGameTactics.duel + "</p>" +
            "<p><strong>Current duel win odds:</strong> " + getChallengeOdds("duel") + "%</p>" +
            "<p><strong>Session:</strong> Round " + (miniGameSession && miniGameSession.gameType === "duel" ? miniGameSession.round : 1) + "/3 | Score " +
            (miniGameSession && miniGameSession.gameType === "duel" ? miniGameSession.score : 0) + "</p>" +
            "<div id='choices'>" +
            "<button onclick=\"setMiniGameTactic('duel','careful')\">Careful Guard (+10%)</button>" +
            "<button onclick=\"setMiniGameTactic('duel','balanced')\">Balanced Style</button>" +
            "<button onclick=\"setMiniGameTactic('duel','risky')\">All-in Strike (+15%)</button>" +
            getMiniGameDecisionOptions("duel").map(function (decision) {
                return "<button onclick='makeChoice(" + decision.choice + ")'>" + decision.label + "</button>";
            }).join("") +
            "<button onclick='makeChoice(47)'>Back to Hanuman</button>" +
            "</div>";
    } else if (currentScene === 56) {
        storyCard.innerHTML =
            "<h2>Mini-game: Brawl</h2>" +
            "<p>You enter a friendly wrestling brawl with vanara champions. This drill tests leverage, endurance, and recovery under pressure.</p>" +
            "<p>Each success earns gold, and 2+ wins in the set grants relic progress.</p>" +
            "<p><strong>Tactic:</strong> " + selectedMiniGameTactics.brawl + "</p>" +
            "<p><strong>Current brawl win odds:</strong> " + getChallengeOdds("brawl") + "%</p>" +
            "<p><strong>Session:</strong> Round " + (miniGameSession && miniGameSession.gameType === "brawl" ? miniGameSession.round : 1) + "/3 | Score " +
            (miniGameSession && miniGameSession.gameType === "brawl" ? miniGameSession.score : 0) + "</p>" +
            "<div id='choices'>" +
            "<button onclick=\"setMiniGameTactic('brawl','careful')\">Defensive Grapple (+10%)</button>" +
            "<button onclick=\"setMiniGameTactic('brawl','balanced')\">Balanced Style</button>" +
            "<button onclick=\"setMiniGameTactic('brawl','risky')\">Berserker Rush (+15%)</button>" +
            getMiniGameDecisionOptions("brawl").map(function (decision) {
                return "<button onclick='makeChoice(" + decision.choice + ")'>" + decision.label + "</button>";
            }).join("") +
            "<button onclick='makeChoice(47)'>Back to Hanuman</button>" +
            "</div>";
    } else if (currentScene === 57) {
        storyCard.innerHTML =
            "<h2>Mini-game: Shooting Range</h2>" +
            "<p>Hanuman sets up moving targets for your bow practice: swinging pots, hidden bells, and timed distant marks.</p>" +
            "<p>Earn gold for strong rounds and relic rewards for consistent accuracy.</p>" +
            "<p><strong>Tactic:</strong> " + selectedMiniGameTactics.shooting + "</p>" +
            "<p><strong>Current shooting win odds:</strong> " + getChallengeOdds("shooting") + "%</p>" +
            "<p><strong>Session:</strong> Round " + (miniGameSession && miniGameSession.gameType === "shooting" ? miniGameSession.round : 1) + "/3 | Score " +
            (miniGameSession && miniGameSession.gameType === "shooting" ? miniGameSession.score : 0) + "</p>" +
            "<div id='choices'>" +
            "<button onclick=\"setMiniGameTactic('shooting','careful')\">Steady Aim (+10%)</button>" +
            "<button onclick=\"setMiniGameTactic('shooting','balanced')\">Balanced Style</button>" +
            "<button onclick=\"setMiniGameTactic('shooting','risky')\">Rapid Fire (+15%)</button>" +
            getMiniGameDecisionOptions("shooting").map(function (decision) {
                return "<button onclick='makeChoice(" + decision.choice + ")'>" + decision.label + "</button>";
            }).join("") +
            "<button onclick='makeChoice(47)'>Back to Hanuman</button>" +
            "</div>";
    } else if (currentScene === 58) {
        storyCard.innerHTML =
            "<h2>Mini-game: Chase</h2>" +
            "<p>You race through the forest in a speed-and-agility gauntlet with river crossings, fallen logs, and shifting routes.</p>" +
            "<p>Fast decisions now feed both your stats and your gold purse.</p>" +
            "<p><strong>Tactic:</strong> " + selectedMiniGameTactics.chase + "</p>" +
            "<p><strong>Current chase win odds:</strong> " + getChallengeOdds("chase") + "%</p>" +
            "<p><strong>Session:</strong> Round " + (miniGameSession && miniGameSession.gameType === "chase" ? miniGameSession.round : 1) + "/3 | Score " +
            (miniGameSession && miniGameSession.gameType === "chase" ? miniGameSession.score : 0) + "</p>" +
            "<div id='choices'>" +
            "<button onclick=\"setMiniGameTactic('chase','careful')\">Safe Route (+10%)</button>" +
            "<button onclick=\"setMiniGameTactic('chase','balanced')\">Balanced Style</button>" +
            "<button onclick=\"setMiniGameTactic('chase','risky')\">Shortcut Sprint (+15%)</button>" +
            getMiniGameDecisionOptions("chase").map(function (decision) {
                return "<button onclick='makeChoice(" + decision.choice + ")'>" + decision.label + "</button>";
            }).join("") +
            "<button onclick='makeChoice(47)'>Back to Hanuman</button>" +
            "</div>";
    } else if (currentScene === 59) {
        storyCard.innerHTML =
            "<h2>Mini-game: Maze Trivia</h2>" +
            "<p>You navigate a puzzle maze while answering ancient-knowledge trivia. Smarts and magical focus now both matter as paths change mid-run.</p>" +
            "<p>Gold and relic progress are awarded for strong performance.</p>" +
            "<p><strong>Tactic:</strong> " + selectedMiniGameTactics.maze + "</p>" +
            "<p><strong>Current maze win odds:</strong> " + getChallengeOdds("maze") + "%</p>" +
            "<p><strong>Session:</strong> Round " + (miniGameSession && miniGameSession.gameType === "maze" ? miniGameSession.round : 1) + "/3 | Score " +
            (miniGameSession && miniGameSession.gameType === "maze" ? miniGameSession.score : 0) + "</p>" +
            "<div id='choices'>" +
            "<button onclick=\"setMiniGameTactic('maze','careful')\">Map Every Turn (+10%)</button>" +
            "<button onclick=\"setMiniGameTactic('maze','balanced')\">Balanced Style</button>" +
            "<button onclick=\"setMiniGameTactic('maze','risky')\">Blind Dash (+15%)</button>" +
            getMiniGameDecisionOptions("maze").map(function (decision) {
                return "<button onclick='makeChoice(" + decision.choice + ")'>" + decision.label + "</button>";
            }).join("") +
            "<button onclick='makeChoice(47)'>Back to Hanuman</button>" +
            "</div>";
    } else if (currentScene === 70) {
        storyCard.innerHTML =
            "<h2>Game: Ramayana Trivia (100 Questions)</h2>" +
            "<p>Each session draws from a 100-question bank. The session continues until you get <strong>3 wrong</strong>.</p>" +
            "<p><strong>Perfect streak:</strong> " + perfectTriviaSessionsInRow + "/20 sessions with zero wrong answers.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(71)'>Start Trivia Session</button>" +
            "<button onclick='makeChoice(47)'>Back to Hanuman</button>" +
            "</div>";
    } else if (currentScene === 93) {
        storyCard.innerHTML =
            "<h2>Game: Ramayana Guessing</h2>" +
            "<p>Guess a hidden Ramayana answer (character, place, or object).</p>" +
            "<p>Examples: Rama, Lanka, Pushpaka Vimana, Ayodhya.</p>" +
            "<input id='guessInput' type='text' placeholder='Type your guess here' />" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(130)'>Submit Guess</button>" +
            "<button onclick='makeChoice(47)'>Back to Hanuman</button>" +
            "</div>";
    } else if (currentScene === 94) {
        storyCard.innerHTML =
            "<h2>Mini-game: Exploration</h2>" +
            "<p>You send scouts through ruins, hills, and jungle trails. They can find artifacts, raw materials, ordinary goods, animals, and rare powerups.</p>" +
            "<p><strong>Exploration success hint:</strong> " + getChallengeOdds("exploration") + "%</p>" +
            "<p><strong>Trade progress:</strong> " + tradeCount + "/10</p>" +
            (explorationState && explorationState.finds ? "<p><strong>Latest finds:</strong> " + explorationState.finds.map(function (item) {
                return item.name;
            }).join(", ") + "</p>" : "") +
            "<div id='choices'>" +
            "<button onclick='makeChoice(133)'>Launch Exploration Run</button>" +
            "<button onclick='makeChoice(47)'>Back to Hanuman</button>" +
            "</div>";
    } else if (currentScene === 71) {
        if (!journeyTriviaState || journeyTriviaState.currentQuestion >= journeyTriviaState.questions.length) {
            buildJourneyTriviaState();
        }
        storyCard.innerHTML =
            "<h2>Journey Trivia Question " + (journeyTriviaState.currentQuestion + 1) + "</h2>" +
            "<p><strong>" + journeyTriviaState.questions[journeyTriviaState.currentQuestion].prompt + "</strong></p>" +
            "<p><strong>Correct:</strong> " + journeyTriviaState.score + " | <strong>Wrong:</strong> " + journeyTriviaState.wrong + "/3</p>" +
            "<div id='choices'>" +
            journeyTriviaState.questions[journeyTriviaState.currentQuestion].options.map(function (optionText) {
                return "<button onclick='makeChoice(" + (optionText === journeyTriviaState.questions[journeyTriviaState.currentQuestion].correct ? 72 : 73) + ")'>" + optionText + "</button>";
            }).join("") +
            "<button onclick='makeChoice(70)'>Back to Trivia Menu</button>" +
            "</div>";
    } else if (currentScene === 72) {
        storyCard.innerHTML =
            "<h2>Correct!</h2>" +
            "<p>You answered correctly. Keep going until you reach 3 wrong answers.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(74)'>Next Question</button>" +
            "<button onclick='makeChoice(70)'>Back to Trivia Menu</button>" +
            "</div>";
    } else if (currentScene === 73) {
        storyCard.innerHTML =
            "<h2>Not Quite</h2>" +
            "<p>That answer is incorrect. A session ends once you reach 3 wrong answers.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(74)'>Continue</button>" +
            "<button onclick='makeChoice(70)'>Back to Trivia Menu</button>" +
            "</div>";
    } else if (currentScene === 69) {
        storyCard.innerHTML =
            "<h2>Dasharatha's Demand</h2>" +
            "<p>Your 20 perfect trivia sessions have spread through the camps and cities alike. Messengers arrive from Ayodhya with an urgent royal summons.</p>" +
            "<p>King Dasharatha commands you to return at once and take the throne, declaring that your wisdom now belongs in the kingdom's court.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(67)'>Return to Ayodhya and become king</button>" +
            "<button onclick='makeChoice(47)'>Remain with the rescue campaign for now</button>" +
            "</div>";
    } else if (currentScene === 53) {
        storyCard.innerHTML =
            "<h1>Part 2: The Rescue</h1>" +
            "<h2>The Rescue Begins</h2>" +
            "<p>You cannot undo anything from here on.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeDecision(2)'>Begin The Rescue</button>" +
            "</div>";
        var disableUndo = document.getElementById("undoButton");
        if (disableUndo) {
            disableUndo.disabled = true;
            disableUndo.title = "No longer works in this Part.";
        }
    } else if (currentScene === 54) {
        var luckyEncounterText = maybeGrantStoryPowerup();
        storyCard.innerHTML =
            "<h2>Part 2: War Council</h2>" +
            "<p>The rescue campaign begins. Scouts bring reports from coastlines, forests, and hidden roads toward Lanka.</p>" +
            "<p>You can continue the main mission immediately, or return to the training grounds for extra preparation and resources.</p>" +
            luckyEncounterText +
            "<div id='choices'>" +
            "<button onclick='makeChoice(75)'>Visit Hanuman's Training Grounds</button>" +
            "<button onclick='makeChoice(91)'>Lead the next story mission</button>" +
            "</div>";
    } else if (currentScene === 77) {
        storyCard.innerHTML =
            "<h2>Training Grounds Conversation: " + (characterConversationState ? characterConversationState.character : "Companion") + "</h2>" +
            "<p>" + (characterConversationState ? characterConversationState.opener : "You begin a conversation.") + "</p>" +
            "<p>" + (characterConversationState && characterConversationState.followUp ? characterConversationState.followUp : "Choose a reply style. Responses are different every time.") + "</p>" +
            "<p><strong>Gold:</strong> " + playerGold + " | <strong>Sigils:</strong> " + getSatchelSummary() + "</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(84)'>Reply Humbly</button>" +
            "<button onclick='makeChoice(85)'>Reply Boldly</button>" +
            "<button onclick='makeChoice(86)'>Reply Playfully</button>" +
            ((characterConversationState && characterConversationState.fightOffered) ? "<button onclick='makeChoice(87)'>Accept Sparring Fight</button><button onclick='makeChoice(88)'>Decline Fight</button>" : "") +
            "<button onclick='makeChoice(47)'>Back to Training Hub</button>" +
            "</div>";
    } else if (currentScene === 79) {
        var goodsKeys = Object.keys(shopGoods);
        storyCard.innerHTML =
            "<h2>Training Shop</h2>" +
            "<p>The quartermaster opens a sigil ledger. Buy what you need with gold earned in story battles, mini-games, and sparring.</p>" +
            "<p><strong>Gold:</strong> " + playerGold + "</p>" +
            "<p><strong>Total Trades:</strong> " + tradeCount + "/10</p>" +
            "<p><strong>Debt:</strong> " + (pendingSigilDebt || "None") + "</p>" +
            "<p><strong>Satchel:</strong> " + getSatchelSummary() + "</p>" +
            "<p><strong>Market Goods:</strong> " + (goodsKeys.length ? goodsKeys.map(function (itemName) {
                return itemName + " x" + shopGoods[itemName];
            }).join(", ") : "No goods to sell yet. Try Exploration.") + "</p>" +
            "<div id='choices'>" +
            Object.keys(trainingShopCatalog).map(function (sigilName) {
                return "<button onclick='makeChoice(" + (100 + Object.keys(trainingShopCatalog).indexOf(sigilName)) + ")'>Buy " +
                    sigilName + " (" + trainingShopCatalog[sigilName] + " gold)</button>";
            }).join("") +
            (goodsKeys.length ? goodsKeys.map(function (itemName, index) {
                var itemInfo = explorationDiscoveries.filter(function (entry) { return entry.name === itemName; })[0];
                var itemValue = itemInfo ? itemInfo.value : 10;
                return "<button onclick='makeChoice(" + (200 + index) + ")'>Sell " + itemName + " (+" + itemValue + " gold)</button>";
            }).join("") : "") +
            "<button onclick='makeChoice(92)'>Pay Debt and Return</button>" +
            "<button onclick='makeChoice(47)'>Back to Training Hub</button>" +
            "</div>";
    }

    choicesContainer = document.getElementById("choices");

    addSceneToReceipt();
    if (visitedSceneIds.indexOf(currentScene) === -1) {
        visitedSceneIds.push(currentScene);
    }
    makeReceipt();
    setUndoButton();
    shouldAutoOpenTimeline = isTerminalScene(currentScene) && !timelineModalOpen;
    renderTimeline(timelineModalOpen);
    if (shouldAutoOpenTimeline) {
        openTimelineModal();
    }
}

// scene 2 - banished into exile
// scene 3 - argue back
// scene 4 - accept exile
// scene 5 - go alone
// scene 6 - go with them
// scene 7 - Surphanaka's encounter - threaten to kill Sita
// scene 8 - Surphanaka's encounter - decide to marry her
// scene 9 - fight Surphanaka
// scene 10 - protect Sita
// scene 11 - negotiate with Surphanaka
// scene 12 - accept Surphanaka's proposal
// scene 13 - reject Surphanaka's proposal

function makeChoice(choice) {
    saveOldState();
    var previousScene = currentScene;

    if (choice === 3) {
        addChoiceToReceipt("Argued back against the exile");
    } else if (choice === 4) {
        addChoiceToReceipt("Accepted the exile");
    } else if (choice === 5) {
        addChoiceToReceipt("Went into exile alone");
    } else if (choice === 6) {
        addChoiceToReceipt("Traveled with Sita and Lakshmana");
    } else if (choice === 9) {
        addChoiceToReceipt("Chose to fight Surphanaka");
    } else if (choice === 10) {
        addChoiceToReceipt("Protected Sita");
    } else if (choice === 11) {
        addChoiceToReceipt("Tried to negotiate with Surphanaka");
    } else if (choice === 12) {
        addChoiceToReceipt("Accepted Surphanaka's proposal");
    } else if (choice === 13) {
        addChoiceToReceipt("Rejected Surphanaka's proposal");
    } else if (choice === 20) {
        addChoiceToReceipt("Chased the Golden Deer");
    } else if (choice === 21) {
        addChoiceToReceipt("Ignored the Golden Deer");
    } else if (choice === 22) {
        addChoiceToReceipt("Brought Lakshmana along");
    } else if (choice === 23) {
        addChoiceToReceipt("Left Lakshmana with Sita");
    } else if (choice === 31) {
        addChoiceToReceipt("Jatayu did nothing");
    } else if (choice === 32) {
        addChoiceToReceipt("Jatayu tried to rescue Sita");
    } else if (choice === 36) {
        addChoiceToReceipt("Went after Ravana in the forest");
    } else if (choice === 40) {
        addChoiceToReceipt("Continued searching for Sita");
    } else if (choice === 65) {
        addChoiceToReceipt("Searched the forest for Sita");
    } else if (choice === 66) {
        addChoiceToReceipt("Returned to the hut to regroup");
    } else if (choice === 67) {
        addChoiceToReceipt("Accepted Bharata's plea to return");
    } else if (choice === 68) {
        addChoiceToReceipt("Declined and gave sandals to Bharata");
    } else if (choice === 41) {
        addChoiceToReceipt("Listened to Sugriva's request");
    } else if (choice === 42) {
        addChoiceToReceipt("Considered Sugriva's plan");
    } else if (choice === 43) {
        addChoiceToReceipt("Set the trap for Vali");
    } else if (choice === 47) {
        addChoiceToReceipt("Met Hanuman");
    } else if (choice === 55) {
        addChoiceToReceipt("Started the duel mini-game");
    } else if (choice === 56) {
        addChoiceToReceipt("Started the brawl mini-game");
    } else if (choice === 57) {
        addChoiceToReceipt("Started the shooting range mini-game");
    } else if (choice === 58) {
        addChoiceToReceipt("Started the chase mini-game");
    } else if (choice === 59) {
        addChoiceToReceipt("Started the maze mini-game");
    } else if (choice >= 160 && choice <= 174) {
        addChoiceToReceipt("Made a mini-game round decision");
    } else if (choice === 70) {
        addChoiceToReceipt("Started journey trivia mini-game");
    } else if (choice === 93) {
        addChoiceToReceipt("Started the guessing mini-game");
    } else if (choice === 95 || choice === 96 || choice === 97) {
        addChoiceToReceipt("Discovered a hidden Ramayana story artifact");
    } else if (choice === 94) {
        addChoiceToReceipt("Started the exploration mini-game");
    } else if (choice === 133) {
        addChoiceToReceipt("Launched an exploration run");
    } else if (choice === 71) {
        addChoiceToReceipt("Began journey trivia questions");
    } else if (choice === 72) {
        addChoiceToReceipt("Answered a journey trivia question correctly");
    } else if (choice === 73) {
        addChoiceToReceipt("Answered a journey trivia question incorrectly");
    } else if (choice === 74) {
        addChoiceToReceipt("Advanced to the next journey trivia question");
    } else if (choice === 75) {
        addChoiceToReceipt("Paused the mission to train with Hanuman");
    } else if (choice === 76) {
        addChoiceToReceipt("Returned to the rescue mission");
    } else if (choice === 80 || choice === 81 || choice === 82 || choice === 83) {
        addChoiceToReceipt("Started a training conversation");
    } else if (choice === 84 || choice === 85 || choice === 86) {
        addChoiceToReceipt("Replied during companion conversation");
    } else if (choice === 87) {
        addChoiceToReceipt("Accepted a sparring challenge");
    } else if (choice === 88) {
        addChoiceToReceipt("Declined a sparring challenge");
    } else if (choice === 90) {
        addChoiceToReceipt("Opened the training shop");
    } else if (choice === 92) {
        addChoiceToReceipt("Attempted to settle sigil debt");
    } else if (choice >= 100 && choice <= 107) {
        addChoiceToReceipt("Bought a sigil from the shop");
    } else if (choice >= 200 && choice <= 260) {
        addChoiceToReceipt("Sold explored goods at the shop");
    } else if (choice === 91) {
        addChoiceToReceipt("Led the next rescue mission");
    } else if (choice === 48) {
        addChoiceToReceipt("Answered Jatayu question 1 correctly");
    } else if (choice === 49) {
        addChoiceToReceipt("Answered Jatayu question 2 correctly");
    } else if (choice === 33) {
        addChoiceToReceipt("Answered Jatayu question 3 correctly");
    } else if (choice === 51) {
        addChoiceToReceipt("Let fate decide Jatayu's final attack");
    } else if (choice === 44) {
        addChoiceToReceipt("Answered correctly");
    } else if (choice === 34 || choice === 35 || choice === 45 || choice === 46) {
        addChoiceToReceipt("Answered incorrectly");
    } else if (choice === 38) {
        addChoiceToReceipt("Fought Ravana in the forest");
    } else if (choice === 14) {
        addChoiceToReceipt("Entered battle");
    } else if (choice === 15) {
        addChoiceToReceipt("Tried one last peaceful appeal");
    } else if (choice === 16) {
        addChoiceToReceipt("Met Ravana");
    } else if (choice === 17) {
        addChoiceToReceipt("Claimed the throne beside Ravana");
    } else if (choice === 44) {
        addChoiceToReceipt("Answered Sugriva's question correctly");
    } else if (choice === 45 || choice === 46) {
        addChoiceToReceipt("Answered Sugriva's question incorrectly");
    }

    if (choice === 75 && miniGamesUnlocked && currentScene >= 53 &&
        !isMiniGameScene(currentScene) && !isTerminalScene(currentScene)) {
        miniGameReturnScene = currentScene;
        currentScene = 47;
    } else if (currentScene === 1 || currentScene === 2) {
        if (choice === 3) {
            currentScene = 3;
        } else if (choice === 4) {
            currentScene = 4;
        }
    } else if (currentScene === 3) {
        if (choice === 4) {
            currentScene = 4;
        }
    } else if (currentScene === 4) {
        if (choice === 5) {
            wentAlone = true;
            currentScene = 5;
        } else if (choice === 6) {
            wentAlone = false;
            currentScene = 6;
        }
    } else if (currentScene === 5) {
        if (choice === 8) {
            currentScene = 8;
        }
    } else if (currentScene === 6) {
        if (choice === 8) {
            currentScene = 7;
        }
    } else if (currentScene === 7) {
        if (choice === 12) {
            currentScene = 12;
        } else if (choice === 9) {
            currentScene = 9;
        } else if (choice === 10) {
            currentScene = 10;
        } else if (choice === 11) {
            currentScene = 11;
        }
    } else if (currentScene === 8) {
        if (choice === 12) {
            currentScene = 12;
        } else if (choice === 13) {
            currentScene = 13;
        }
    } else if (currentScene === 9) {
        if (choice === 14) {
            if (randomizer() < getChallengeOdds("fight")) {
                if (wentAlone) {
                    currentScene = 52;
                } else {
                    currentScene = 14;
                    grantGold(30, "defeated Surphanaka");
                }
            } else {
                currentScene = 18;
            }
        }
    } else if (currentScene === 11) {
        if (choice === 15) {
            currentScene = 15;
        } else if (choice === 9) {
            currentScene = 9;
        }
    } else if (currentScene === 10 || currentScene === 14) {
        if (choice === 19) {
            currentScene = 19;
        }
    } else if (currentScene === 12) {
        if (choice === 16) {
            currentScene = 16;
        }
    } else if (currentScene === 13) {
        if (choice === 9) {
            currentScene = 9;
        }
    } else if (currentScene === 16) {
        if (choice === 17) {
            currentScene = 17;
        }
    } else if (currentScene === 19) {
        if (choice === 95) {
            addArtifact("Maricha's Gleaming Horn Fragment");
            addArtifact("Forest Hermit's Palm-Leaf Note");
            currentScene = 95;
        } else if (choice === 20) {
            currentScene = 20;
            broughtLakshmana = false;
        } else if (choice === 21) {
            currentScene = 21;
        }
    } else if (currentScene === 95) {
        if (choice === 20) {
            currentScene = 20;
            broughtLakshmana = false;
        } else if (choice === 21) {
            currentScene = 21;
        }
    } else if (currentScene === 20) {
        if (choice === 22) {
            currentScene = 22;
            broughtLakshmana = true;
        } else if (choice === 23) {
            currentScene = 23;
            broughtLakshmana = false;
        }
    } else if (currentScene === 22 || currentScene === 23) {
        if (choice === 24) {
            currentScene = 24;
        }
    } else if (currentScene === 24) {
        if (choice === 25) {
            currentScene = 25;
        }
    } else if (currentScene === 25) {
        if (choice === 26) {
            if (broughtLakshmana) {
                currentScene = 26;
            } else {
                currentScene = 27;
            }
        }
    } else if (currentScene === 26) {
        if (choice === 27) {
            currentScene = 29;
        }
    } else if (currentScene === 27) {
        if (choice === 28) {
            currentScene = 28;
        }
    } else if (currentScene === 28) {
        if (choice === 29) {
            if (randomizer() < 50) {
                currentScene = 29;
            } else {
                currentScene = 39;
            }
        }
    } else if (currentScene === 29) {
        if (choice === 30) {
            currentScene = 30;
        }
    } else if (currentScene === 30) {
        if (choice === 96) {
            addArtifact("Jatayu's Wind-Sworn Plume");
            currentScene = 96;
        } else if (choice === 31) {
            currentScene = 31;
        } else if (choice === 32) {
            addArtifact("Jatayu's Feather");
            currentScene = 32;
        }
    } else if (currentScene === 96) {
        if (choice === 31) {
            currentScene = 31;
        } else if (choice === 32) {
            addArtifact("Jatayu's Feather");
            currentScene = 32;
        }
    } else if (currentScene === 32) {
        if (choice === 48) {
            currentScene = 48;
        } else if (choice === 34) {
            currentScene = 34;
        } else if (choice === 35) {
            currentScene = 35;
        }
    } else if (currentScene === 48) {
        if (choice === 49) {
            currentScene = 49;
        } else if (choice === 34) {
            currentScene = 34;
        } else if (choice === 35) {
            currentScene = 35;
        }
    } else if (currentScene === 49) {
        if (choice === 33) {
            currentScene = 50;
        } else if (choice === 34) {
            currentScene = 34;
        } else if (choice === 35) {
            currentScene = 35;
        }
    } else if (currentScene === 50) {
        if (choice === 51) {
            if (randomizer() >= 90) {
                currentScene = 33;
            } else {
                currentScene = 34;
            }
        }
    } else if (currentScene === 33) {
        if (choice === 36) {
            currentScene = 36;
        }
    } else if (currentScene === 34 || currentScene === 35) {
        if (choice === 37) {
            currentScene = 37;
        }
    } else if (currentScene === 31 || currentScene === 37) {
        if (choice === 65) {
            currentScene = 65;
        }
    } else if (currentScene === 65) {
        if (choice === 66) {
            currentScene = 66;
        }
    } else if (currentScene === 66) {
        if (choice === 67) {
            currentScene = 67;
        } else if (choice === 68) {
            addArtifact("Rama's Sandals (Paduka)");
            currentScene = 68;
        }
    } else if (currentScene === 36) {
        if (choice === 38) {
            currentScene = 38;
        }
    } else if (currentScene === 68) {
        if (choice === 40) {
            currentScene = 40;
        }
    } else if (currentScene === 40) {
        if (choice === 97) {
            addArtifact("Kishkindha Cave Mural Tablet");
            currentScene = 97;
        } else if (choice === 41) {
            addArtifact("Sugriva Alliance Oath");
            currentScene = 41;
        }
    } else if (currentScene === 97) {
        if (choice === 41) {
            addArtifact("Sugriva Alliance Oath");
            currentScene = 41;
        }
    } else if (currentScene === 41) {
        if (choice === 42) {
            currentScene = 42;
        }
    } else if (currentScene === 42) {
        if (choice === 43) {
            currentScene = 43;
        }
    } else if (currentScene === 43) {
        if (choice === 44) {
            currentScene = 44;
            grantGold(45, "helped Sugriva defeat Vali");
        } else if (choice === 45) {
            currentScene = 45;
        } else if (choice === 46) {
            currentScene = 46;
        }
    } else if (currentScene === 44) {
        if (choice === 47) {
            miniGamesUnlocked = true;
            currentScene = 47;
        }
    } else if (currentScene === 47) {
        if (choice === 70) {
            currentScene = 70;
        } else if (choice === 93) {
            currentScene = 93;
        } else if (choice === 80 || choice === 81 || choice === 82 || choice === 83) {
            beginCharacterConversation(trainingCharacters[choice - 80]);
            currentScene = 77;
        } else if (choice === 69 && dasharathaStoryUnlocked) {
            currentScene = 69;
        }
    } else if (currentScene === 77) {
        if (choice === 84) {
            processCharacterReply("humble");
        } else if (choice === 85) {
            processCharacterReply("bold");
        } else if (choice === 86) {
            processCharacterReply("playful");
        } else if (choice === 87 && characterConversationState && characterConversationState.fightOffered) {
            resolveCharacterFight();
            if (pendingSigilDebt) {
                currentScene = 79;
            }
        } else if (choice === 88) {
            if (characterConversationState) {
                characterConversationState.followUp = characterConversationState.character + " nods and postpones the sparring match.";
                characterConversationState.fightOffered = false;
            }
        } else if (choice === 47) {
            characterConversationState = null;
            currentScene = 47;
        }
    } else if (currentScene === 79) {
        if (choice >= 100 && choice <= 107) {
            var catalogKeys = Object.keys(trainingShopCatalog);
            var selectedSigil = catalogKeys[choice - 100];
            if (selectedSigil && trySpendGold(trainingShopCatalog[selectedSigil])) {
                addSigilToSatchel(selectedSigil, 1);
                registerTrade();
                alert("Purchased " + selectedSigil + ".");
            } else {
                alert("Not enough gold.");
            }
        } else if (choice >= 200 && choice <= 260) {
            var marketKeys = Object.keys(shopGoods);
            var selectedGood = marketKeys[choice - 200];
            var marketInfo = explorationDiscoveries.filter(function (entry) { return entry.name === selectedGood; })[0];
            var saleValue = marketInfo ? marketInfo.value : 10;
            if (selectedGood && removeGoodsFromShop(selectedGood, 1)) {
                grantGold(saleValue, "sold " + selectedGood);
                registerTrade();
                alert("Sold " + selectedGood + " for " + saleValue + " gold.");
            }
        } else if (choice === 92) {
            if (!pendingSigilDebt) {
                alert("No sigil debt right now.");
            } else if (spendSigil(pendingSigilDebt)) {
                alert("Debt paid with " + pendingSigilDebt + ".");
                pendingSigilDebt = "";
                currentScene = 47;
            } else {
                alert("You still need " + pendingSigilDebt + ".");
            }
        } else if (choice === 47) {
            currentScene = 47;
        }
    } else if (currentScene === 55) {
        if (choice === 160) {
            handleMiniGameRound("duel", 10, "Duel", { defense: 1, weaponMastery: 1, smarts: 1 });
        } else if (choice === 161) {
            handleMiniGameRound("duel", 5, "Duel", { defense: 1, weaponMastery: 1, smarts: 1 });
        } else if (choice === 162) {
            handleMiniGameRound("duel", -5, "Duel", { defense: 1, weaponMastery: 1, smarts: 1 });
        } else if (choice === 47) {
            miniGameSession = null;
            currentScene = 47;
        }
    } else if (currentScene === 56) {
        if (choice === 163) {
            handleMiniGameRound("brawl", 10, "Brawl", { strength: 1, stamina: 1 });
        } else if (choice === 164) {
            handleMiniGameRound("brawl", 5, "Brawl", { strength: 1, stamina: 1 });
        } else if (choice === 165) {
            handleMiniGameRound("brawl", -5, "Brawl", { strength: 1, stamina: 1 });
        } else if (choice === 47) {
            miniGameSession = null;
            currentScene = 47;
        }
    } else if (currentScene === 57) {
        if (choice === 166) {
            handleMiniGameRound("shooting", 10, "Shooting Range", { stamina: 1, weaponMastery: 1 });
        } else if (choice === 167) {
            handleMiniGameRound("shooting", 5, "Shooting Range", { stamina: 1, weaponMastery: 1 });
        } else if (choice === 168) {
            handleMiniGameRound("shooting", -5, "Shooting Range", { stamina: 1, weaponMastery: 1 });
        } else if (choice === 47) {
            miniGameSession = null;
            currentScene = 47;
        }
    } else if (currentScene === 58) {
        if (choice === 169) {
            handleMiniGameRound("chase", 10, "Chase", { speedAgility: 1 });
        } else if (choice === 170) {
            handleMiniGameRound("chase", 5, "Chase", { speedAgility: 1 });
        } else if (choice === 171) {
            handleMiniGameRound("chase", -5, "Chase", { speedAgility: 1 });
        } else if (choice === 47) {
            miniGameSession = null;
            currentScene = 47;
        }
    } else if (currentScene === 59) {
        if (choice === 172) {
            handleMiniGameRound("maze", 10, "Maze Trivia", { speedAgility: 1, magicalPower: 1, smarts: 1 });
        } else if (choice === 173) {
            handleMiniGameRound("maze", 5, "Maze Trivia", { speedAgility: 1, magicalPower: 1, smarts: 1 });
        } else if (choice === 174) {
            handleMiniGameRound("maze", -5, "Maze Trivia", { speedAgility: 1, magicalPower: 1, smarts: 1 });
        } else if (choice === 47) {
            miniGameSession = null;
            currentScene = 47;
        }
    } else if (currentScene === 70) {
        if (choice === 71) {
            buildJourneyTriviaState();
            currentScene = 71;
        } else if (choice === 47) {
            currentScene = 47;
        }
    } else if (currentScene === 93) {
        if (choice === 130) {
            var guessInput = document.getElementById("guessInput");
            var userGuess = guessInput ? guessInput.value.trim() : "";
            if (!userGuess) {
                alert("Please type a Ramayana guess first.");
            } else {
                alert(runGuessingGame(userGuess));
            }
        } else if (choice === 47) {
            currentScene = 47;
        }
    } else if (currentScene === 94) {
        if (choice === 133) {
            alert("Exploration returns: " + runExplorationMiniGame());
        } else if (choice === 47) {
            currentScene = 47;
        }
    } else if (currentScene === 71) {
        if (choice === 72) {
            journeyTriviaState.score += 1;
            currentScene = 72;
        } else if (choice === 73) {
            journeyTriviaState.wrong += 1;
            currentScene = 73;
        } else if (choice === 70) {
            currentScene = 70;
        }
    } else if (currentScene === 72 || currentScene === 73) {
        if (choice === 74) {
            journeyTriviaState.askedCount += 1;
            journeyTriviaState.currentQuestion += 1;
            if (journeyTriviaState.wrong >= 3 || journeyTriviaState.currentQuestion >= journeyTriviaState.questions.length) {
                if (journeyTriviaState.wrong === 0) {
                    perfectTriviaSessionsInRow += 1;
                } else {
                    perfectTriviaSessionsInRow = 0;
                }
                if (perfectTriviaSessionsInRow >= 20) {
                    dasharathaStoryUnlocked = true;
                }
                alert("Trivia session complete. Correct: " + journeyTriviaState.score + ", Wrong: " + journeyTriviaState.wrong +
                    ". Perfect streak: " + perfectTriviaSessionsInRow + "/20.");
                journeyTriviaState = null;
                currentScene = 47;
            } else {
                currentScene = 71;
            }
        } else if (choice === 70) {
            currentScene = 70;
        }
    } else if (currentScene === 69) {
        if (choice === 67) {
            currentScene = 67;
        } else if (choice === 47) {
            currentScene = 47;
        }
    } else if (currentScene === 54) {
        if (choice === 75) {
            miniGameReturnScene = 54;
            currentScene = 47;
        } else if (choice === 91) {
            grantGold(60, "advanced the rescue campaign");
            alert("You lead a successful raid and secure 60 gold for the war effort. More Part 2 scenes can be added here next.");
        }
    }
    if (previousScene !== currentScene) {
        takenTransitions.push(previousScene + "->" + currentScene);
    }

    showScene();
}

function makeDecision(decision){
    if (decision === 1){
        miniGameReturnScene = null;
        currentScene = 53;
    } else if (decision === 2){
        currentScene = 54; // begin the rescue
    }
    showScene();
}

document.addEventListener("DOMContentLoaded", function () {
    renderTimeline(timelineModalOpen);
    updatePlayerStatsCard();
    updateInventoryCard();
    var startButton = document.getElementById("startBtn");
    var playerNameInput = document.getElementById("playerName");

    if (startButton) {
        startButton.addEventListener("click", startAdventure);
    }

    if (playerNameInput) {
        playerNameInput.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                startAdventure();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeTimelineModal();
            closePlayerStatsModal();
            closeInventoryModal();
        }
    });
});
