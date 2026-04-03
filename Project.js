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
var timelineRevealAll = false;
var journeyTriviaState = null;
var perfectTriviaSessionsInRow = 0;
var dasharathaStoryUnlocked = false;
var playerStats = {};
var inventoryItems = [];
var inventoryArtifacts = [];
var artifactLoreCatalog = {};
var trainingCharacters = ["Hanuman", "Sugriva", "Lakshmana", "Angada"];
var characterConversationState = null;
var guessGameState = null;
var inventoryModalOpen = false;
var defaultSoundtrackSrc = "Sacred Path Of Rama.mp3";
var lankaSoundtrackSrc = "Lanka Burns At Dawn.mp3";
var rescueSoundtrackMode = false;
var applyingSceneRoute = false;
var routableSceneIds = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
    52, 53, 54, 55, 65, 66, 67, 68, 69, 70, 71, 72, 73, 77, 93, 95, 96, 97
];

function parseSceneFromHash() {
    var match = window.location.hash.match(/^#scene-(\d+)$/);

    if (!match) {
        return null;
    }

    return parseInt(match[1], 10);
}

function isRoutableScene(sceneId) {
    return routableSceneIds.indexOf(sceneId) !== -1;
}

function syncHashWithCurrentScene() {
    var nextHash = currentScene === 0 ? "" : "#scene-" + currentScene;

    if (applyingSceneRoute) {
        return;
    }

    if (window.location.hash !== nextHash) {
        history.replaceState(null, "", nextHash || window.location.pathname + window.location.search);
    }
}

function applySceneFromHash() {
    var routeScene = parseSceneFromHash();
    var playerNameInput;

    if (routeScene === null || !isRoutableScene(routeScene) || routeScene === currentScene) {
        return;
    }

    playerNameInput = document.getElementById("playerName");
    if (!playerName && playerNameInput) {
        playerName = playerNameInput.value.trim();
    }
    if (!playerName) {
        playerName = "Traveler";
    }

    applyingSceneRoute = true;
    currentScene = routeScene;
    showScene();
    applyingSceneRoute = false;
}

function updateBackgroundMusicForScene() {
    var backgroundMusic = document.getElementById("backgroundMusic");
    var trackName = document.getElementById("currentTrackName");
    var targetTrack;
    var changedTrack = false;

    if (!backgroundMusic) {
        return;
    }

    if (currentScene === 0) {
        rescueSoundtrackMode = false;
    }

    if (currentScene === 54 || currentScene === 55) {
        rescueSoundtrackMode = true;
    }

    targetTrack = rescueSoundtrackMode ? lankaSoundtrackSrc : defaultSoundtrackSrc;

    if (!backgroundMusic.src || backgroundMusic.src.indexOf(targetTrack) === -1) {
        backgroundMusic.src = targetTrack;
        backgroundMusic.load();
        changedTrack = true;
    }

    if (changedTrack) {
        backgroundMusic.play().catch(function () {
            return null;
        });
    }

    if (trackName) {
        trackName.textContent = targetTrack.replace(".mp3", "");
    }
}

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
    { answer: "Rama", type: "Person", clues: ["Prince of Ayodhya exiled for 14 years.", "Wields the Kodanda bow against Ravana.", "Seventh avatar of Vishnu in this epic."] },
    { answer: "Sita", type: "Person", clues: ["Found in a furrow and raised in Mithila.", "Kidnapped and held in Ashoka Vatika.", "Wife of Rama and daughter of Janaka."] },
    { answer: "Lakshmana", type: "Person", clues: ["Follows his elder brother into exile.", "Draws a protective boundary near the hut.", "Brother of Rama known for fierce loyalty."] },
    { answer: "Hanuman", type: "Person", clues: ["Leaps across the ocean to scout Lanka.", "Carries a mountain to save Lakshmana.", "Devoted vanara hero and messenger of Rama."] },
    { answer: "Ravana", type: "Person", clues: ["Scholar-king of a golden island kingdom.", "Kidnaps Sita through deception.", "Ten-headed ruler and main antagonist."] },
    { answer: "Dasharatha", type: "Person", clues: ["A king bound by an old promise.", "Father of four princes including Rama.", "Ruler of Ayodhya before the exile crisis."] },
    { answer: "Bharata", type: "Person", clues: ["Refuses to take the throne in full.", "Rules in his brother's name using symbolic footwear.", "Brother who keeps Rama's place in Ayodhya."] },
    { answer: "Shatrughna", type: "Person", clues: ["Youngest son in the royal family.", "Closely associated with Bharata.", "Brother of Rama less prominent in forest episodes."] },
    { answer: "Kaikeyi", type: "Person", clues: ["Requests two boons at a crucial court moment.", "Sends Rama to the forest through her demand.", "Queen and mother of Bharata."] },
    { answer: "Kausalya", type: "Person", clues: ["Senior queen in Ayodhya's palace.", "Mother of the eldest prince.", "Maternal figure who grieves the exile deeply."] },
    { answer: "Sumitra", type: "Person", clues: ["Wise queen known for calm counsel.", "Mother of Lakshmana and Shatrughna.", "Encourages duty over comfort."] },
    { answer: "Janaka", type: "Person", clues: ["Philosopher-king of Mithila.", "Adopts the child found in the earth.", "Father of Sita."] },
    { answer: "Vibhishana", type: "Person", clues: ["Counsels righteousness in a hostile court.", "Leaves Lanka to join Rama's side.", "Ravana's brother who chooses dharma."] },
    { answer: "Kumbhakarna", type: "Person", clues: ["Known for legendary sleep cycles.", "A giant warrior in Lanka's army.", "Brother of Ravana awakened for battle."] },
    { answer: "Indrajit", type: "Person", clues: ["Earned a name after defeating Indra.", "Master of illusion and celestial weapons.", "Son of Ravana also called Meghanada."] },
    { answer: "Meghanada", type: "Person", clues: ["Alternative name of Lanka's great prince.", "Uses serpentine and magical astras in war.", "Another title of Indrajit."] },
    { answer: "Sugriva", type: "Person", clues: ["Exiled vanara leader who seeks an alliance.", "Regains his throne with Rama's help.", "Monkey king allied with Rama."] },
    { answer: "Vali", type: "Person", clues: ["Powerful vanara king with immense combat strength.", "Brother-rival of Sugriva.", "Defeated in the Kishkindha episode."] },
    { answer: "Angada", type: "Person", clues: ["Young prince among the vanaras.", "Sent as envoy before the final war.", "Son of Vali."] },
    { answer: "Jatayu", type: "Person", clues: ["Aged bird-king who intervenes mid-abduction.", "Falls heroically after fighting Ravana.", "Ally who gives Rama crucial clues."] },
    { answer: "Shabari", type: "Person", clues: ["Devotee waiting years for Rama's arrival.", "Offers forest berries with love.", "Ascetic woman famous for bhakti hospitality."] },
    { answer: "Surpanakha", type: "Person", clues: ["Rakshasi whose encounter sparks major conflict.", "Proposes marriage and faces rejection.", "Sister of Ravana linked to the forest turning point."] },
    { answer: "Trijata", type: "Person", clues: ["Compassionate figure among Lanka's women.", "Comforts Sita in captivity.", "Rakshasi who dreams of Rama's victory."] },
    { answer: "Mandodari", type: "Person", clues: ["Voice of restraint in Lanka's palace.", "Wife of Ravana.", "Queen who warns against adharma."] },
    { answer: "Maricha", type: "Person", clues: ["Rakshasa used in a deceptive hunt.", "Takes the form of a shimmering animal.", "Creates the golden deer diversion."] },
    { answer: "Nala", type: "Person", clues: ["Engineer among the vanara forces.", "Helps build a path over the sea.", "Associated with constructing Rama Setu."] },
    { answer: "Nila", type: "Person", clues: ["Vanara commander in the southern campaign.", "Works with Nala on bridge operations.", "Warrior-chief in Rama's monkey army."] },
    { answer: "Jambavan", type: "Person", clues: ["Ancient wise ally in the vanara camp.", "Reminds Hanuman of his latent power.", "Bear-king strategist."] },
    { answer: "Tara", type: "Person", clues: ["Known for political wisdom in Kishkindha.", "Connected to both Vali and Sugriva courts.", "Vanara queen with sharp counsel."] },
    { answer: "Urmila", type: "Person", clues: ["Princess of Mithila and royal bride.", "Married to Lakshmana.", "Sita's sister who remains in Ayodhya."] },
    { answer: "Ahalya", type: "Person", clues: ["Freed from a curse during Rama's journey.", "Wife of sage Gautama.", "Early episode of redemption in the epic."] },
    { answer: "Vishwamitra", type: "Person", clues: ["Sage who trains Rama in divine weapons.", "Takes princes to protect yajnas.", "Rishi connected to early heroic quests."] },
    { answer: "Vasistha", type: "Person", clues: ["Royal preceptor in Ayodhya.", "Guides courtly and dharmic decisions.", "Family guru of the Ikshvaku line."] },
    { answer: "Agastya", type: "Person", clues: ["Revered southern sage encountered in exile.", "Blesses Rama with spiritual guidance.", "Rishi associated with Dandaka region."] },
    { answer: "Guha", type: "Person", clues: ["Forest chieftain and boat ally.", "Helps Rama near the river crossing.", "Nishada king loyal to Rama."] },
    { answer: "Sumantra", type: "Person", clues: ["Trusted charioteer and court servant.", "Accompanies Rama at the start of exile.", "Messenger figure from Ayodhya palace."] },
    { answer: "Shrutakirti", type: "Person", clues: ["Princess tied to Ayodhya through marriage.", "Wife of Shatrughna.", "One of Janaka's extended family connections."] },
    { answer: "Mandavi", type: "Person", clues: ["Royal bride in the Ayodhya-Mithila alliance.", "Wife of Bharata.", "Known from the four-couple wedding set."] },
    { answer: "Atikaya", type: "Person", clues: ["Powerful warrior on Ravana's side.", "Part of Lanka's later war defense.", "Rakshasa prince defeated in battle."] },
    { answer: "Akshayakumara", type: "Person", clues: ["Young son sent to stop Hanuman.", "Falls during Lanka reconnaissance conflict.", "Prince of Ravana defeated early in the war."] },
    { answer: "Prahasta", type: "Person", clues: ["Senior military commander of Lanka.", "Leads rakshasa forces in war.", "General serving Ravana."] },
    { answer: "Ayodhya", type: "Place", clues: ["Capital of the Kosala kingdom.", "City Rama leaves at the start of exile.", "Homeland of Dasharatha's dynasty."] },
    { answer: "Lanka", type: "Place", clues: ["Island fortress ruled by Ravana.", "Destination of Hanuman's giant leap.", "Main battlefield of the final war."] },
    { answer: "Mithila", type: "Place", clues: ["Kingdom ruled by Janaka.", "Hosts the great bow challenge.", "Birthplace-home of Sita."] },
    { answer: "Kishkindha", type: "Place", clues: ["Vanara kingdom in the southern forests.", "Scene of Sugriva-Vali rivalry.", "Alliance base before searching for Sita."] },
    { answer: "Panchavati", type: "Place", clues: ["Forest dwelling area during exile.", "Golden deer episode unfolds here.", "Location tied to Surpanakha encounter."] },
    { answer: "Dandaka Forest", type: "Place", clues: ["Vast wilderness traversed in exile years.", "Home to many sages and dangers.", "Major forest region of the epic journey."] },
    { answer: "Ashoka Vatika", type: "Place", clues: ["Garden in Lanka where Sita is kept.", "Hanuman secretly meets Sita here.", "Captivity grove central to the rescue plot."] },
    { answer: "Chitrakoot", type: "Place", clues: ["Early exile refuge amid hills and rivers.", "Bharata visits Rama here.", "Peaceful forest location before deeper wanderings."] },
    { answer: "Sarayu River", type: "Place", clues: ["River associated with Ayodhya.", "Symbolic flow through Rama's homeland.", "Sacred waterway of Kosala."] },
    { answer: "Godavari River", type: "Place", clues: ["River region near Panchavati.", "Linked with key exile events.", "Southern river in forest chapters."] },
    { answer: "Rameshwaram", type: "Place", clues: ["Coastal launch point toward Lanka.", "Associated with bridge preparations.", "Pilgrimage site tied to Rama's sea crossing."] },
    { answer: "Setubandha", type: "Place", clues: ["Name linked to the ocean bridge zone.", "Where vanaras connect shore to island.", "Bridge-building front toward Lanka."] },
    { answer: "Nandigrama", type: "Place", clues: ["Site where Bharata waits in austerity.", "Symbolic regency base outside Ayodhya.", "Place tied to sandals and vow."] },
    { answer: "Kosala", type: "Place", clues: ["Ancient kingdom whose capital is Ayodhya.", "Dynastic realm of Dasharatha.", "Region ruled by Rama's family."] },
    { answer: "Tamasa River", type: "Place", clues: ["River crossed at an early exile stage.", "Marks emotional departure from citizens.", "Waypoint soon after leaving Ayodhya."] },
    { answer: "Sringaverapura", type: "Place", clues: ["Settlement linked to Guha's support.", "Near key river crossing in exile.", "Nishada-associated location."] },
    { answer: "Pampa Lake", type: "Place", clues: ["Scenic area near Kishkindha episodes.", "Linked to meetings with vanara allies.", "Water body in southern search arc."] },
    { answer: "Prasravana", type: "Place", clues: ["Mountain area used as a monsoon halt.", "Strategic wait before campaign advances.", "Highland shelter in Kishkindha phase."] },
    { answer: "Suvela Mountain", type: "Place", clues: ["Elevated vantage near Lanka campaign.", "Used before final assault planning.", "Hill from which enemy city is viewed."] },
    { answer: "Nikumbhila", type: "Place", clues: ["Sacrificial ground tied to Indrajit.", "Battle event triggers here.", "Lanka-site of a crucial ritual interruption."] },
    { answer: "Rama Setu", type: "Thing", clues: ["Massive structure across the sea.", "Built with vanara effort and devotion.", "Bridge used to reach Lanka."] },
    { answer: "Pushpaka Vimana", type: "Thing", clues: ["Mythic aerial vehicle.", "Used for royal travel after victory.", "Flying chariot associated with Lanka's king."] },
    { answer: "Kodanda Bow", type: "Thing", clues: ["Weapon carried by Rama.", "Symbol of righteous warfare.", "Famous bow linked to the hero-prince."] },
    { answer: "Shiva Dhanush", type: "Thing", clues: ["Gigantic bow in Sita's swayamvara.", "Lifted and broken by Rama.", "Trial object proving worth in Mithila."] },
    { answer: "Brahmastra", type: "Thing", clues: ["Supreme celestial weapon.", "Used with caution due to destructive force.", "Divine missile invoked by mantra."] },
    { answer: "Agneyastra", type: "Thing", clues: ["Astral weapon of fire.", "One among many divine missiles.", "Represents elemental flame in battle."] },
    { answer: "Nagapasha", type: "Thing", clues: ["Serpent-binding weapon.", "Used to immobilize opponents.", "Mystic noose formed by snake power."] },
    { answer: "Sanjivani Herb", type: "Thing", clues: ["Life-restoring medicinal plant.", "Sought urgently to save a fallen warrior.", "Reason Hanuman carried a mountain."] },
    { answer: "Ring of Rama", type: "Thing", clues: ["Token proving Hanuman's authenticity.", "Given to Sita in captivity.", "Small royal emblem used as a message."] },
    { answer: "Chudamani", type: "Thing", clues: ["Personal ornament sent as proof to Rama.", "Given by Sita to Hanuman.", "Jewel that confirms contact in Lanka."] },
    { answer: "Lakshmana Rekha", type: "Thing", clues: ["Protective boundary near the hut.", "Crossing it triggers danger.", "Mythic safety line drawn by Lakshmana."] },
    { answer: "Sandals of Rama", type: "Thing", clues: ["Placed on throne in symbolic regency.", "Represents rightful sovereignty during exile.", "Footwear revered by Bharata."] },
    { answer: "Crown of Ayodhya", type: "Thing", clues: ["Symbol of kingship and duty.", "Delayed due to exile events.", "Royal headpiece tied to succession."] },
    { answer: "Golden Deer", type: "Thing", clues: ["Dazzling lure in the forest.", "Actually a demon's illusion.", "Object that splits Rama and Lakshmana from Sita."] },
    { answer: "Ocean Crossing", type: "Thing", clues: ["Major challenge before reaching Lanka.", "Solved through alliance and engineering.", "Strategic passage over the sea."] },
    { answer: "Vanara Banner", type: "Thing", clues: ["War standard of monkey allies.", "Raised during march to Lanka.", "Army symbol in the southern campaign."] },
    { answer: "Boon of Kaikeyi", type: "Thing", clues: ["Two promises once granted by a king.", "Invoked to alter royal succession.", "Political trigger of Rama's exile."] },
    { answer: "Exile Vow", type: "Thing", clues: ["Commitment to fulfill a hard promise.", "Accepted without rebellion.", "Fourteen-year duty embraced by Rama."] },
    { answer: "Dharma", type: "Thing", clues: ["Moral order guiding difficult choices.", "Theme behind sacrifices in the epic.", "Righteous duty central to Rama's decisions."] },
    { answer: "Bhakti", type: "Thing", clues: ["Devotional love shown by figures like Hanuman.", "Expressed through service and surrender.", "Spiritual theme of heartfelt devotion."] },
    { answer: "Yajna", type: "Thing", clues: ["Sacred ritual needing protection from demons.", "Reason young princes accompany a sage.", "Vedic fire ceremony."] },
    { answer: "Arrow of Rama", type: "Thing", clues: ["Precision weapon used in decisive duels.", "Represents focused righteous force.", "Projectile from the hero's bow."] },
    { answer: "Mace", type: "Thing", clues: ["Blunt weapon favored by many warriors.", "Common in epic combat scenes.", "Heavy club used in melee battles."] },
    { answer: "Conch Signal", type: "Thing", clues: ["Sound cue used in martial settings.", "Calls troops to order.", "Shell instrument for battlefield signaling."] },
    { answer: "War Drum", type: "Thing", clues: ["Beating rhythm before clashes.", "Used to raise morale and cadence.", "Percussion instrument of marching armies."] },
    { answer: "Royal Chariot", type: "Thing", clues: ["Vehicle for kings and nobles.", "Connected to court departures and returns.", "Wheeled carriage of epic warfare."] },
    { answer: "Hermitage Hut", type: "Thing", clues: ["Simple forest dwelling of sages.", "Frequent refuge during exile travels.", "Leaf-and-wood shelter in the wilderness."] },
    { answer: "Forest Berries", type: "Thing", clues: ["Offered with devotion by a humble host.", "Small fruit gift with great emotional weight.", "Shabari's famous offering."] },
    { answer: "Sacred Fire", type: "Thing", clues: ["Witness to vows and rituals.", "Represents purity and divine presence.", "Central flame of Vedic ceremony."] },
    { answer: "Celestial Chariot", type: "Thing", clues: ["Divine transport seen in epic warfare.", "Different from ordinary war carriages.", "Heavenly vehicle used by gods or heroes."] },
    { answer: "Bridge Stones", type: "Thing", clues: ["Materials assembled for the sea crossing.", "Linked to collective vanara labor.", "Foundational blocks of Rama Setu."] },
    { answer: "Messenger Scroll", type: "Thing", clues: ["Written communication across camps.", "Carries strategy and assurance.", "Portable document for wartime messaging."] },
    { answer: "Healing Salve", type: "Thing", clues: ["Battlefield remedy for injuries.", "Supports warriors between clashes.", "Medicinal paste used in camp treatment."] },
    { answer: "Quiver", type: "Thing", clues: ["Container for arrows.", "Essential accessory for archers.", "Back-worn case in bow combat."] },
    { answer: "Battle Armor", type: "Thing", clues: ["Protective gear in major conflicts.", "Worn by elite warriors and commanders.", "Defensive outfit for war scenes."] },
    { answer: "Royal Seal", type: "Thing", clues: ["Mark of authority in governance.", "Used to validate orders and claims.", "Emblem proving official command."] },
    { answer: "Victory Garland", type: "Thing", clues: ["Ceremonial wreath for honor.", "Given after achievements or alliances.", "Floral token of triumph."] },
    { answer: "Temple Bell", type: "Thing", clues: ["Rung for ritual timing and reverence.", "Echoes through sacred spaces.", "Metal instrument in worship settings."] },
    { answer: "Prayer Mala", type: "Thing", clues: ["Beads counted in devotion.", "Used by sages and devotees.", "Meditative counting string."] }
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
    55: "Part 2: The Rescue",
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
    93: "Guessing Game",
    95: "Deer Lore Artifact",
    96: "Jatayu Lore Artifact",
    97: "Kishkindha Lore Artifact"
};

artifactLoreCatalog = {
    "Maricha's Gleaming Horn Fragment": "A polished shard from Maricha's illusory golden deer. It reminds you that dazzling beauty can conceal grave danger.",
    "Forest Hermit's Palm-Leaf Note": "A weathered leaf manuscript warning travelers to trust dharma over appearances when the forest turns strangely silent.",
    "Jatayu's Wind-Sworn Plume": "A strong feather from Jatayu's wings, honoring the bird-king's courage in challenging Ravana to protect Sita.",
    "Jatayu's Feather": "A fallen feather from the battlefield in the sky, preserved as a vow to remember sacrifice in the face of tyranny.",
    "Rama's Sandals (Paduka)": "The sacred Paduka symbolizing rightful rule, duty, and Bharata's pledge to govern Ayodhya only in Rama's name.",
    "Kishkindha Cave Mural Tablet": "A carved tablet showing old vanara heroes. Its scenes teach alliance, strategy, and patience before war.",
    "Sugriva Alliance Oath": "A signed oath of friendship and mutual duty between Rama and Sugriva, sealed under witness of fire and honor."
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
    [70, 93, 77, 53],
    [71, 72, 73, 54, 55]
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
    { from: 47, to: 69, label: "Unlock new storyline" },
    { from: 47, to: 70, label: "Journey trivia" },
    { from: 47, to: 93, label: "Guessing game" },
    { from: 47, to: 77, label: "Talk to ally" },
    { from: 77, to: 47, label: "Back to hub" },
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
    { from: 47, to: 53, label: "Continue main story" },
    { from: 53, to: 54, label: "Begin rescue" },
    { from: 54, to: 47, label: "Return to camp" },
    { from: 54, to: 55, label: "Lead the next story mission" },
    { from: 69, to: 47, label: "Remain with the rescue campaign" },
    { from: 72, to: 47, label: "Session complete" },
    { from: 73, to: 47, label: "Session complete" },
];

timelineEdges = timelineEdges.map(function (edge) {
    return {
        from: edge.from,
        to: edge.to,
        label: timelineNodeTitles[edge.to] || ("Scene " + edge.to),
        type: edge.type
    };
});


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
        journeyTrivia: getChallengeOdds("journeyTrivia"),
        guessing: getChallengeOdds("guessing")
    };
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
    return getArtifactLoreByName(artifactName);
}

function beginGuessingRound() {
    guessGameState = guessGameState || { solved: 0, attempted: 0 };
    guessGameState.current = randomFrom(ramayanaGuessPool);
    guessGameState.clueIndex = 0;
}

function getGuessingClueText() {
    if (!guessGameState || !guessGameState.current) {
        beginGuessingRound();
    }
    return guessGameState.current.clues.slice(0, guessGameState.clueIndex + 1).join(" ");
}

function normalizeGuessText(value) {
    return (value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function runGuessingGame(guess) {
    var normalizedGuess;
    var normalizedAnswer;

    if (!guessGameState || !guessGameState.current) {
        beginGuessingRound();
    }

    guessGameState.attempted += 1;
    normalizedGuess = normalizeGuessText(guess);
    normalizedAnswer = normalizeGuessText(guessGameState.current.answer);

    if (normalizedGuess === normalizedAnswer) {
        var solvedAnswer = guessGameState.current.answer;
        var solvedType = guessGameState.current.type;
        guessGameState.solved += 1;
        beginGuessingRound();
        return "Correct! It was " + solvedAnswer + " (" + solvedType + "). New round started.";
    }

    guessGameState.clueIndex = Math.min(guessGameState.clueIndex + 1, guessGameState.current.clues.length - 1);
    return "Not quite. Category: " + guessGameState.current.type + ". Hint: " + getGuessingClueText();
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
    var inventoryButton = document.getElementById("inventoryButton");

    if (!inventoryButton) {
        return;
    }

    inventoryButton.textContent = "Inventory (" + inventoryArtifacts.length + ")";
}

function openInventoryModal() {
    var modal = document.getElementById("inventoryModal");
    var inventoryList = document.getElementById("inventoryList");
    var emptyMessage = document.getElementById("inventoryEmpty");
    var i;
    var listHtml = "";
    var artifactName;

    if (!modal || !inventoryList || !emptyMessage) {
        return;
    }

    if (inventoryArtifacts.length === 0) {
        emptyMessage.style.display = "block";
        inventoryList.innerHTML = "";
    } else {
        emptyMessage.style.display = "none";
        for (i = 0; i < inventoryArtifacts.length; i++) {
            artifactName = inventoryArtifacts[i];
            listHtml += "<li class='inventory-item'>" +
                "<h4>" + escapeHtml(artifactName) + "</h4>" +
                "<p>" + escapeHtml(getArtifactLoreByName(artifactName)) + "</p>" +
                "</li>";
        }
        inventoryList.innerHTML = listHtml;
    }

    inventoryModalOpen = true;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}

function closeInventoryModal() {
    var modal = document.getElementById("inventoryModal");

    if (!modal) {
        return;
    }

    inventoryModalOpen = false;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

function handleInventoryModalBackdrop(event) {
    if (event.target && event.target.id === "inventoryModal") {
        closeInventoryModal();
    }
}

function handlePlayerStatsModalBackdrop(event) {
    return;
}

function awardPowerup(statName, amount) {
    return;
}

function addArtifact(artifactName) {
    if (inventoryArtifacts.indexOf(artifactName) === -1) {
        inventoryArtifacts.push(artifactName);
    }

    updateInventoryCard();
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
        inventoryArtifacts: inventoryArtifacts.slice(),
        playerStats: JSON.parse(JSON.stringify(playerStats)),
        inventoryItems: inventoryItems.slice(),
        journeyTriviaState: journeyTriviaState ? JSON.parse(JSON.stringify(journeyTriviaState)) : null,
        perfectTriviaSessionsInRow: perfectTriviaSessionsInRow,
        dasharathaStoryUnlocked: dasharathaStoryUnlocked,
        characterConversationState: characterConversationState ? JSON.parse(JSON.stringify(characterConversationState)) : null,
        guessGameState: guessGameState ? JSON.parse(JSON.stringify(guessGameState)) : null,
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
    inventoryArtifacts = oldState.inventoryArtifacts;
    playerStats = oldState.playerStats;
    inventoryItems = oldState.inventoryItems || [];
    journeyTriviaState = oldState.journeyTriviaState || null;
    perfectTriviaSessionsInRow = oldState.perfectTriviaSessionsInRow || 0;
    dasharathaStoryUnlocked = !!oldState.dasharathaStoryUnlocked;
    characterConversationState = oldState.characterConversationState || null;
    guessGameState = oldState.guessGameState || null;
    receiptScenes = oldState.receiptScenes;
    receiptChoices = oldState.receiptChoices;
    visitedSceneIds = oldState.visitedSceneIds;
    takenTransitions = oldState.takenTransitions;

    if (currentScene === 0) {
        clearStoryCard();
        syncHashWithCurrentScene();
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
    inventoryArtifacts = [];
    playerStats = {};
    inventoryItems = [];
    journeyTriviaState = null;
    perfectTriviaSessionsInRow = 0;
    dasharathaStoryUnlocked = false;
    characterConversationState = null;
    guessGameState = null;
    receiptScenes = [];
    receiptChoices = [];
    oldStates = [];
    visitedSceneIds = [];
    takenTransitions = [];
    rescueSoundtrackMode = false;
    clearStoryCard();
    syncHashWithCurrentScene();
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
    rescueSoundtrackMode = false;
    characterConversationState = null;
    guessGameState = null;
    currentScene = 1;
    updatePlayerStatsCard();
    showScene();
    focusStoryCard();
}

function isTerminalScene(sceneId) {
    return sceneId === 17 || sceneId === 18 || sceneId === 21 || sceneId === 38 ||
        sceneId === 39 || sceneId === 45 || sceneId === 46 || sceneId === 52 ||
        sceneId === 67;
}

function isMiniGameScene(sceneId) {
    return sceneId === 47 || sceneId === 70 || sceneId === 71 || sceneId === 72 ||
        sceneId === 73 || sceneId === 77 || sceneId === 93;
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

function focusStoryCard() {
    var storyCard = document.getElementById("storyCard");

    if (!storyCard) {
        return;
    }

    window.requestAnimationFrame(function () {
        storyCard.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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

function updateTimelineRevealButton() {
    var revealButton = document.getElementById("timelineRevealButton");

    if (!revealButton) {
        return;
    }

    if (timelineRevealAll) {
        revealButton.textContent = "Unreveal";
    } else {
        revealButton.textContent = "Reveal";
    }
}

function revealTimelinePossibilities() {
    timelineRevealAll = !timelineRevealAll;
    updateTimelineRevealButton();
    renderTimeline(timelineModalOpen);
}

function renderTimeline(showHighlight) {
    var container = document.getElementById("timelineFlowchart");
    var svg = "";
    var nodeWidth = 260;
    var nodeHeight = 100;
    var levelGap = 390;
    var rowGap = 230;
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
    var pathClass;
    var nodeClass;
    var labelX;
    var labelY;
    var titleLines;
    var titleLine;
    var k;
    var columnLabel;
    var columnStartX;
    var edgeLabelPositions = [];
    var laneOffset;
    var midX;
    var labelWidth;
    var labelHeight;
    var labelPaddingX = 8;
    var labelPaddingY = 5;
    var labelText;
    var collisionFound;

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

        if (!timelineRevealAll && !edgeKeyMap[edge.from + "->" + edge.to]) {
            continue;
        }

        fromX = fromNode.x + nodeWidth;
        fromY = fromNode.y + nodeHeight / 2;
        toX = toNode.x;
        toY = toNode.y + nodeHeight / 2;
        laneOffset = Math.max(-120, Math.min(120, (toY - fromY) * 0.35)) + ((i % 3) - 1) * 24;
        midX = fromX + ((toX - fromX) / 2) + laneOffset;
        pathClass = "timeline-edge";

        if (edge.type === "chance") {
            pathClass += " chance";
        }

        if (edgeKeyMap[edge.from + "->" + edge.to]) {
            pathClass += " active";
        }

        svg += "<path class='" + pathClass + "' d='M " + fromX + " " + fromY +
            " H " + midX + " V " + toY + " H " + toX + "' />";

        labelText = escapeHtml(edge.label || "");
        labelX = midX;
        labelY = ((fromY + toY) / 2) - 8 + ((i % 4) - 1.5) * 8;
        labelWidth = Math.max(56, labelText.length * 7 + labelPaddingX * 2);
        labelHeight = 22;

        do {
            collisionFound = false;
            for (k = 0; k < edgeLabelPositions.length; k++) {
                if (Math.abs(edgeLabelPositions[k].x - labelX) < (labelWidth / 2 + edgeLabelPositions[k].w / 2 + 12) &&
                    Math.abs(edgeLabelPositions[k].y - labelY) < (labelHeight + 8)) {
                    labelY += 18;
                    collisionFound = true;
                    break;
                }
            }
        } while (collisionFound);

        edgeLabelPositions.push({ x: labelX, y: labelY, w: labelWidth });

        svg += "<g class='edge-label-group'>";
        svg += "<rect class='edge-label-bg' x='" + (labelX - labelWidth / 2) + "' y='" + (labelY - labelHeight + labelPaddingY) +
            "' width='" + labelWidth + "' height='" + labelHeight + "' rx='8' ry='8'></rect>";
        svg += "<text class='edge-label' x='" + labelX + "' y='" + labelY + "'>" + labelText + "</text>";
        svg += "</g>";
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

            if (!timelineRevealAll && visitedSceneIds.indexOf(nodeId) === -1 && nodeId !== currentScene) {
                continue;
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
    timelineRevealAll = false;
    updateTimelineZoomLabel();
    updateTimelineRevealButton();
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

    updateBackgroundMusicForScene();

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
            "<p>The war-camp is focused now: conversation, sparring, and two knowledge challenges to sharpen your mind.</p>" +
            "<p><strong>Trivia streak (perfect sessions in a row):</strong> " + perfectTriviaSessionsInRow + "/20</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(70)'>Journey Trivia</button>" +
            "<button onclick='makeChoice(93)'>Guessing Game</button>" +
            "<button onclick='makeChoice(80)'>Talk to Hanuman</button>" +
            "<button onclick='makeChoice(81)'>Talk to Sugriva</button>" +
            "<button onclick='makeChoice(82)'>Talk to Lakshmana</button>" +
            "<button onclick='makeChoice(83)'>Talk to Angada</button>" +
            (dasharathaStoryUnlocked ? "<button onclick='makeChoice(69)'>New Storyline: Dasharatha's Demand</button>" : "") +
            "<button onclick='makeChoice(76)'>Return to Main Story</button>" +
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
        if (!guessGameState || !guessGameState.current) {
            beginGuessingRound();
        }
        storyCard.innerHTML =
            "<h2>Game: Ramayana Guessing (100 Answer Types)</h2>" +
            "<p>Each round gives stronger clues. Categories are <strong>Person</strong>, <strong>Place</strong>, or <strong>Thing</strong>.</p>" +
            "<p><strong>Category:</strong> " + guessGameState.current.type + "</p>" +
            "<p><strong>Clues:</strong> " + getGuessingClueText() + "</p>" +
            "<p><strong>Solved:</strong> " + guessGameState.solved + " / <strong>Attempts:</strong> " + guessGameState.attempted + "</p>" +
            "<input id='guessInput' type='text' placeholder='Type your guess here' />" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(130)'>Submit Guess</button>" +
            "<button onclick='makeChoice(175)'>Skip & New Puzzle</button>" +
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
        storyCard.innerHTML =
            "<h2>Part 2: War Council</h2>" +
            "<p>The rescue campaign begins. Scouts bring reports from coastlines, forests, and hidden roads toward Lanka.</p>" +
            "<p>You can continue with Hanuman's council activities or lead the next mission immediately.</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(47)'>Return to Hanuman's camp</button>" +
            "<button onclick='makeDecision(3)'>Lead the next story mission</button>" +
            "</div>";
    } else if (currentScene === 77) {
        storyCard.innerHTML =
            "<h2>Training Grounds Conversation: " + (characterConversationState ? characterConversationState.character : "Companion") + "</h2>" +
            "<p>" + (characterConversationState ? characterConversationState.opener : "You begin a conversation.") + "</p>" +
            "<p>" + (characterConversationState && characterConversationState.followUp ? characterConversationState.followUp : "Choose a reply style. Responses are different every time.") + "</p>" +
            "<div id='choices'>" +
            "<button onclick='makeChoice(84)'>Reply Humbly</button>" +
            "<button onclick='makeChoice(85)'>Reply Boldly</button>" +
            "<button onclick='makeChoice(86)'>Reply Playfully</button>" +
            ((characterConversationState && characterConversationState.fightOffered) ? "<button onclick='makeChoice(87)'>Accept Sparring Fight</button><button onclick='makeChoice(88)'>Decline Fight</button>" : "") +
            "<button onclick='makeChoice(47)'>Back to Training Hub</button>" +
            "</div>";
    } else if (currentScene === 55){
        storyCard.innerHTML =
            "<h2>Part 2: The Rescue</h2>" +
            "<p>Hanuman plans to cross the ocean to Lanka.</P>" +
             "</div>";
    }

    addSceneToReceipt();
    syncHashWithCurrentScene();
    renderTimeline(timelineModalOpen);
    setUndoButton();
    updatePlayerStatsCard();
    updateInventoryCard();
    makeReceipt();
}

function makeChoice(choice) {
    var previousScene = currentScene;
    var selectedButton;
    var choices = document.querySelectorAll("#storyCard #choices button");
    var i;

    for (i = 0; i < choices.length; i++) {
        if (choices[i].getAttribute("onclick") === "makeChoice(" + choice + ")") {
            selectedButton = choices[i];
            break;
        }
    }

    if (selectedButton) {
        addChoiceToReceipt(selectedButton.textContent.trim());
    }

    saveOldState();

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
            if (randomizer() < getChallengeOdds("fight")) {
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
        } else if (choice === 45) {
            currentScene = 45;
        } else if (choice === 46) {
            currentScene = 46;
        }
    } else if (currentScene === 44) {
        if (choice === 47) {
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
        } else if (choice === 76) {
            miniGameReturnScene = null;
            currentScene = 53;
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
        } else if (choice === 88) {
            if (characterConversationState) {
                characterConversationState.followUp = characterConversationState.character + " nods and postpones the sparring match.";
                characterConversationState.fightOffered = false;
            }
        } else if (choice === 47) {
            characterConversationState = null;
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
        } else if (choice === 175) {
            beginGuessingRound();
            alert("New guessing puzzle loaded.");
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
        if (choice === 47) {
            currentScene = 47;
        } 
    }
    if (previousScene !== currentScene) {
        takenTransitions.push(previousScene + "->" + currentScene);
    }

    showScene();
    focusStoryCard();
}

function makeDecision(decision){
    var previousScene = currentScene;

    if (decision === 1){
            currentScene = 53;
    } else if (decision === 2){
        currentScene = 54; // begin the rescue 1
    } else if (decision === 3){
        currentScene = 55; // lead the next story mission
    }

    if (previousScene !== currentScene) {
        takenTransitions.push(previousScene + "->" + currentScene);
    }

    showScene();
    focusStoryCard();
}

document.addEventListener("DOMContentLoaded", function () {
    renderTimeline(timelineModalOpen);
    updatePlayerStatsCard();
    updateInventoryCard();

    var startButton = document.getElementById("startBtn");
    var playerNameInput = document.getElementById("playerName");
    var backgroundMusic = document.getElementById("backgroundMusic");
    var musicVolume = document.getElementById("musicVolume");

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

    if (backgroundMusic && musicVolume) {
        backgroundMusic.volume = parseFloat(musicVolume.value);
        musicVolume.addEventListener("change", function () {
            var selectedVolume = parseFloat(musicVolume.value);
            if (!isNaN(selectedVolume)) {
                backgroundMusic.volume = selectedVolume;
                backgroundMusic.muted = selectedVolume === 0;
            }
        });
    }

    applySceneFromHash();
    window.addEventListener("hashchange", applySceneFromHash);

    document.addEventListener("contextmenu", function (event) {
        if (event.target && event.target.id === "backgroundMusic") {
            event.preventDefault();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeTimelineModal();
            closePlayerStatsModal();
            closeInventoryModal();
        }
    });

    window.addEventListener("resize", function () {
        if (currentScene > 0) {
            focusStoryCard();
        }
    });
});
