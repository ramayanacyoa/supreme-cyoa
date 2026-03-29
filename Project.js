// Global variables to track the current scene and player name.
var currentScene = 0;
var playerName = "";
var broughtLakshmana = false;
var wentAlone = false;
var receiptScenes = [];
var receiptChoices = [];
var oldStates = [];

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
        receiptChoices: receiptChoices.slice()
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

    if (currentScene === 0) {
        clearStoryCard();
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
    clearStoryCard();
    setUndoButton();
}

function startAdventure() {
    playerName = document.getElementById("playerName").value.trim();

    if (playerName === "") {
        alert("Please enter your name!");
        return;
    }

    oldStates = [];
    currentScene = 1;
    showScene();
}

function showScene() {
    var storyCard = document.getElementById("storyCard");

    if (currentScene === 1) {
        storyCard.innerHTML =
            "<h1>Part 1: The Exile</h1>
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
    makeReceipt();
    setUndoButton();
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
    showScene();
}

function makeDecision(decision){
    if (decision === 1){
        currentScene = 53;
    } else if (decision === 2){
        currentScene = 54; // begin the rescue
    }
}
