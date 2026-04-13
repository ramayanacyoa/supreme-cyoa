var currentScene = "intro";
var playerName = "Traveler";
var storyHistory = [];

var scenes = {
  intro: function () {
    return "<h2>Welcome, " + escapeHtml(playerName) + "</h2>"
      + "<p>You are Rama of Ayodhya. Exile has been decreed, and every decision now changes the path ahead.</p>"
      + "<div id='choices'>"
      + "<button type='button' onclick=\"choose('acceptExile')\">Accept exile calmly</button>"
      + "<button type='button' onclick=\"choose('argueExile')\">Argue against the order</button>"
      + "</div>";
  },
  argueExile: function () {
    return "<h2>You argue in the court</h2>"
      + "<p>Your protest shakes the hall, but the old promise to Kaikeyi cannot be undone. Exile still stands.</p>"
      + "<div id='choices'>"
      + "<button type='button' onclick=\"choose('forestDeparture')\">Leave for the forest</button>"
      + "</div>";
  },
  acceptExile: function () {
    return "<h2>You accept the exile</h2>"
      + "<p>You choose duty over comfort. Sita and Lakshmana prepare to walk beside you into the forest.</p>"
      + "<div id='choices'>"
      + "<button type='button' onclick=\"choose('forestDeparture')\">Begin the forest journey</button>"
      + "</div>";
  },
  forestDeparture: function () {
    return "<h2>Forest Crossroads</h2>"
      + "<p>Far from Ayodhya, a golden deer appears near your hut. Sita asks you to follow it.</p>"
      + "<div id='choices'>"
      + "<button type='button' onclick=\"choose('chaseDeer')\">Chase the golden deer</button>"
      + "<button type='button' onclick=\"choose('ignoreDeer')\">Ignore it and stay together</button>"
      + "</div>";
  },
  chaseDeer: function () {
    return "<h2>The trap is sprung</h2>"
      + "<p>The deer was Maricha in disguise. Ravana uses the moment to seize Sita and flee south.</p>"
      + "<div id='choices'>"
      + "<button type='button' onclick=\"choose('alliance')\">Seek allies and continue</button>"
      + "</div>";
  },
  ignoreDeer: function () {
    return "<h2>Danger avoided</h2>"
      + "<p>You resist the illusion. Ravana loses his opening, and your family remains safe.</p>"
      + "<div id='choices'>"
      + "<button type='button' onclick='restart()'>Restart</button>"
      + "</div>";
  },
  alliance: function () {
    return "<h2>Alliance with Sugriva and Hanuman</h2>"
      + "<p>You forge an alliance, gather scouts, and prepare a southern campaign to rescue Sita.</p>"
      + "<div id='choices'>"
      + "<button type='button' onclick=\"choose('finale')\">Launch the Lanka campaign</button>"
      + "</div>";
  },
  finale: function () {
    return "<h2>Final Duel</h2>"
      + "<p>With Hanuman's intelligence and your allies at your side, you defeat Ravana and restore order.</p>"
      + "<div id='choices'>"
      + "<button type='button' onclick='restart()'>Play again</button>"
      + "</div>";
  }
};

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;");
}

function renderScene() {
  var storyCard = document.getElementById("storyCard");
  var renderer = scenes[currentScene];

  if (!storyCard || !renderer) {
    return;
  }

  storyCard.innerHTML = renderer();
}

function choose(nextScene) {
  if (!scenes[nextScene]) {
    return;
  }

  storyHistory.push(currentScene);
  currentScene = nextScene;
  renderScene();
}

function startAdventure() {
  var playerNameInput = document.getElementById("playerName");
  var rawName = playerNameInput ? playerNameInput.value.trim() : "";

  playerName = rawName || "Traveler";
  currentScene = "intro";
  storyHistory = [];
  renderScene();
}

function restart() {
  currentScene = "intro";
  storyHistory = [];
  renderScene();
}

function toggleNavbarMenu(forceOpen) {
  var navbar = document.getElementById("topNavbar");
  var toggleButton = document.getElementById("navbarToggle");
  var isMobileNavbar = window.matchMedia("(max-width: 768px)").matches;
  var shouldOpen = typeof forceOpen === "boolean" ? forceOpen : true;

  if (!navbar || !toggleButton) {
    return;
  }

  if (!isMobileNavbar) {
    navbar.classList.add("nav-open");
    toggleButton.setAttribute("aria-expanded", "true");
    toggleButton.textContent = "✕";
    return;
  }

  if (typeof forceOpen !== "boolean") {
    shouldOpen = !navbar.classList.contains("nav-open");
  }

  navbar.classList.toggle("nav-open", shouldOpen);
  toggleButton.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
  toggleButton.textContent = shouldOpen ? "✕" : "☰";
}

function syncNavbarLayout() {
  var isMobileNavbar = window.matchMedia("(max-width: 768px)").matches;
  toggleNavbarMenu(isMobileNavbar ? false : true);
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("Update 3");

  var startButton = document.getElementById("startBtn");
  var playerNameInput = document.getElementById("playerName");
  var backgroundMusic = document.getElementById("backgroundMusic");
  var musicVolume = document.getElementById("musicVolume");
  var navbarToggle = document.getElementById("navbarToggle");
  var topNavbar = document.getElementById("topNavbar");

  window.startAdventure = startAdventure;

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

  if (navbarToggle && topNavbar) {
    syncNavbarLayout();

    navbarToggle.addEventListener("click", function () {
      toggleNavbarMenu();
    });

    document.addEventListener("click", function (event) {
      if (window.matchMedia("(max-width: 768px)").matches
        && topNavbar.classList.contains("nav-open")
        && !topNavbar.contains(event.target)) {
        toggleNavbarMenu(false);
      }
    });

    window.addEventListener("resize", function () {
      syncNavbarLayout();
    });
  }

  if (backgroundMusic && musicVolume) {
    backgroundMusic.volume = parseFloat(musicVolume.value);
    backgroundMusic.muted = parseFloat(musicVolume.value) === 0;

    musicVolume.addEventListener("change", function () {
      var selectedVolume = parseFloat(musicVolume.value);

      if (!isNaN(selectedVolume)) {
        backgroundMusic.volume = selectedVolume;
        backgroundMusic.muted = selectedVolume === 0;

        if (backgroundMusic.paused) {
          backgroundMusic.play().catch(function () {
            return null;
          });
        }
      }
    });

    document.addEventListener("click", function () {
      if (backgroundMusic.paused) {
        backgroundMusic.play().catch(function () {
          return null;
        });
      }
    }, { once: true });
  }
});
