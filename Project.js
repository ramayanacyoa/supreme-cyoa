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
    54: "Part 2 Start"
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
    [36, 40],
    [38, 41],
    [42],
    [43],
    [44, 45, 46],
    [47],
    [53],
    [54]
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
    { from: 19, to: 20, label: "Chase deer" },
    { from: 19, to: 21, label: "Ignore deer" },
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
    { from: 30, to: 31, label: "Do nothing" },
    { from: 30, to: 32, label: "Try rescue" },
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
    { from: 31, to: 40, label: "Continue search" },
    { from: 37, to: 40, label: "Continue search" },
    { from: 40, to: 41, label: "Hear request" },
    { from: 41, to: 42, label: "Consider plan" },
    { from: 42, to: 43, label: "Set trap" },
    { from: 43, to: 44, label: "Correct answer" },
    { from: 43, to: 45, label: "Wrong answer" },
    { from: 43, to: 46, label: "Wrong answer" },
    { from: 44, to: 47, label: "Meet Hanuman" },
    { from: 47, to: 53, label: "Continue" },
    { from: 53, to: 54, label: "Begin rescue" }
];


function randomizer() {
    return Math.floor(Math.random() * 101);
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
        currentScene !== 52 &&
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
    receiptScenes = [];
    receiptChoices = [];
    oldStates = [];
    visitedSceneIds = [];
    takenTransitions = [];
    clearStoryCard();
    renderTimeline(timelineModalOpen);
    setUndoButton();
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
    currentScene = 1;
    showScene();
}

function isTerminalScene(sceneId) {
    return sceneId === 17 || sceneId === 18 || sceneId === 21 || sceneId === 38 ||
        sceneId === 39 || sceneId === 45 || sceneId === 46 || sceneId === 52;
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
    timelineZoom = Math.max(0.6, Math.min(1.8, timelineZoom + change));
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
            "<button onclick='makeChoice(20)'>Chase the deer</button>" +
            "<button onclick='makeChoice(21)'>Ignore it</button>" +
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
            "<button onclick='makeChoice(31)'>Do nothing</button>" +
            "<button onclick='makeChoice(32)'>Try to rescue Sita</button>" +
            "</div>";
    } else if (currentScene === 31) {
        storyCard.innerHTML =
            "<h2>Sita is Taken</h2>" +
            "<p>Jatayu does not intervene. Ravana escapes with Sita, and when you return, your exile has become a desperate rescue mission.</p>" +
            "<p>Your search soon leads you deeper into the forest, where new allies may be waiting.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(40)'>Continue the search</button>" +
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
            "<p>The search carries you onward into the forest, where fate prepares another meeting.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(40)'>Continue the search</button>" +
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
            "<button onclick='makeChoice(41)'>Hear Sugriva's request</button>" +
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
            "<p>A powerful new alliance has begun.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeDecision(1)'>Continue</button>" +
            "</div>";
    } else if (currentScene === 53) {
        storyCard.innerhtml = 
            "<h1>Part 2: The Rescue</h1>" +
            "<h2>The Rescue Begins</h2>" +
            "<p>You cannot undo anything from here on.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeDecision(2)'>Begin The Rescue</button>" +
            "</div>"
        var disableUndo = document.getElementById("undoButton");
        disableUndo.innerhtml = 
            "<button title = 'No longer work in this Part.' id='undoButton' onclick='undoChoice()' type='button' style='opacity = 0.6;'>Undo</button>"
    } else if (currentScene === 54) {
        
    }

    addSceneToReceipt();
    if (visitedSceneIds.indexOf(currentScene) === -1) {
        visitedSceneIds.push(currentScene);
    }
    makeReceipt();
    setUndoButton();
    renderTimeline(timelineModalOpen);
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
    } else if (choice === 41) {
        addChoiceToReceipt("Listened to Sugriva's request");
    } else if (choice === 42) {
        addChoiceToReceipt("Considered Sugriva's plan");
    } else if (choice === 43) {
        addChoiceToReceipt("Set the trap for Vali");
    } else if (choice === 47) {
        addChoiceToReceipt("Met Hanuman");
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

    if (currentScene === 1 || currentScene === 2) {
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
            if (randomizer() < 70) {
                if (wentAlone) {
                    currentScene = 52;
                } else {
                    currentScene = 14;
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
        if (choice === 31) {
            currentScene = 31;
        } else if (choice === 32) {
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
    } else if (currentScene === 36) {
        if (choice === 38) {
            currentScene = 38;
        }
    } else if (currentScene === 31 || currentScene === 37) {
        if (choice === 40) {
            currentScene = 40;
        }
    } else if (currentScene === 40) {
        if (choice === 41) {
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
        } else if (choice === 45) {
            currentScene = 45;
        } else if (choice === 46) {
            currentScene = 46;
        }
    } else if (currentScene === 44) {
        if (choice === 47) {
            currentScene = 47;
        }
    }
    if (previousScene !== currentScene) {
        takenTransitions.push(previousScene + "->" + currentScene);
    }

    showScene();
}

function makeDecision(decision){
    if (decision === 1){
        currentScene = 53;
    } else if (decision === 2){
        currentScene = 54; // begin the rescue
    }
    showScene();
}

document.addEventListener("DOMContentLoaded", function () {
    renderTimeline(timelineModalOpen);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeTimelineModal();
        }
    });
});
