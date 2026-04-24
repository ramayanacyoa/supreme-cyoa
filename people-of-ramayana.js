(function () {
    function setupScrollRevealTransitions() {
        var revealedCards = document.querySelectorAll(".scroll-reveal");

        if (!revealedCards.length) {
            return;
        }

        if (typeof window.IntersectionObserver !== "function") {
            revealedCards.forEach(function (card) {
                card.classList.add("in-view");
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries, scrollObserver) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("in-view");
                    scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            root: null,
            threshold: 0.14,
            rootMargin: "0px 0px -8% 0px"
        });

        revealedCards.forEach(function (card) {
            observer.observe(card);
        });
    }

    function setupNavbarToggle() {
        var navbarToggle = document.getElementById("navbarToggle");
        var topNavbar = document.getElementById("topNavbar");

        if (!navbarToggle || !topNavbar) {
            return;
        }

        navbarToggle.addEventListener("click", function () {
            var isOpen = topNavbar.classList.toggle("nav-open");
            navbarToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        document.addEventListener("click", function (event) {
            if (!window.matchMedia("(max-width: 768px)").matches) {
                return;
            }

            if (!topNavbar.classList.contains("nav-open")) {
                return;
            }

            if (topNavbar.contains(event.target)) {
                return;
            }

            topNavbar.classList.remove("nav-open");
            navbarToggle.setAttribute("aria-expanded", "false");
        });
    }

    function setupPersistentAudio() {
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
                autoplayAttempt.catch(function () { });
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

    var peopleEntries = [
        {
            name: "Rama",
            type: "individual",
            role: "Prince of Ayodhya",
            description: "The protagonist, son of King Dasharatha, representing righteousness (dharma).",
            wikiUrl: "https://en.wikipedia.org/wiki/Rama"
        },
        {
            name: "Sita",
            type: "individual",
            role: "Princess of Mithila",
            description: "Daughter of King Janaka, Rama's wife, who is abducted by Ravana.",
            wikiUrl: "https://en.wikipedia.org/wiki/Sita"
        },
        {
            name: "Ravana",
            type: "individual",
            role: "Rakshasa king of Lanka",
            description: "The Rakshasa king of Lanka who abducts Sita.",
            wikiUrl: "https://en.wikipedia.org/wiki/Ravana"
        },
        {
            name: "Lakshmana",
            type: "individual",
            role: "Prince of Ayodhya",
            description: "Rama's younger brother who accompanies him into exile.",
            wikiUrl: "https://en.wikipedia.org/wiki/Lakshmana"
        },
        {
            name: "Hanuman",
            type: "individual",
            role: "Vanara devotee",
            description: "A Vanara (monkey) deity, devotee of Rama, who plays a key role in finding Sita.",
            wikiUrl: "https://en.wikipedia.org/wiki/Hanuman"
        },
        {
            name: "Dasharatha",
            type: "individual",
            role: "King of Ayodhya",
            description: "King of Ayodhya and father of Rama, Bharata, Lakshmana, and Shatrughna.",
            wikiUrl: "https://en.wikipedia.org/wiki/Dasharatha"
        },
        {
            name: "Bharata",
            type: "individual",
            role: "Prince of Ayodhya",
            description: "Rama's brother who rules in his stead, known for his righteousness.",
            wikiUrl: "https://en.wikipedia.org/wiki/Bharata_(Ramayana)"
        },
        {
            name: "Shatrughna",
            type: "individual",
            role: "Prince of Ayodhya",
            description: "Another brother of Rama.",
            wikiUrl: "https://en.wikipedia.org/wiki/Shatrughna"
        },
        {
            name: "Sugriva",
            type: "individual",
            role: "Vanara king",
            description: "King of the Vanaras who helps Rama, following his brother Vali's death.",
            wikiUrl: "https://en.wikipedia.org/wiki/Sugriva"
        },
        {
            name: "Vibhishana",
            type: "individual",
            role: "Prince of Lanka",
            description: "Ravana's righteous brother who joins Rama's side.",
            wikiUrl: "https://en.wikipedia.org/wiki/Vibhishana"
        },
        {
            name: "Kumbhakarna",
            type: "individual",
            role: "Prince of Lanka",
            description: "Ravana's giant brother known for sleeping and eating.",
            wikiUrl: "https://en.wikipedia.org/wiki/Kumbhakarna"
        },
        {
            name: "Mandodari",
            type: "individual",
            role: "Queen of Lanka",
            description: "Ravana's noble wife.",
            wikiUrl: "https://en.wikipedia.org/wiki/Mandodari"
        },
        {
            name: "Kaikeyi",
            type: "individual",
            role: "Queen of Ayodhya",
            description: "Dasharatha's wife who demands Rama's exile.",
            wikiUrl: "https://en.wikipedia.org/wiki/Kaikeyi"
        },
        {
            name: "Manthara",
            type: "individual",
            role: "Maid of Ayodhya",
            description: "Kaikeyi's maid who influences her to send Rama away.",
            wikiUrl: "https://en.wikipedia.org/wiki/Manthara"
        },
        {
            name: "Kausalya",
            type: "individual",
            role: "Queen of Ayodhya",
            description: "Rama's mother.",
            wikiUrl: "https://en.wikipedia.org/wiki/Kausalya"
        },
        {
            name: "Sumitra",
            type: "individual",
            role: "Queen of Ayodhya",
            description: "Mother of Lakshmana and Shatrughna.",
            wikiUrl: "https://en.wikipedia.org/wiki/Sumitra"
        },
        {
            name: "Vali (Bali)",
            type: "individual",
            role: "Vanara warrior",
            description: "Sugriva's brother, killed by Rama.",
            wikiUrl: "https://en.wikipedia.org/wiki/Vali_(Ramayana)"
        },
        {
            name: "Jatayu",
            type: "individual",
            role: "Vulture ally",
            description: "A vulture who attempts to save Sita.",
            wikiUrl: "https://en.wikipedia.org/wiki/Jatayu"
        },
        {
            name: "Lava & Kush",
            type: "individual",
            role: "Princes of Ayodhya",
            description: "Twin sons of Rama and Sita.",
            wikiUrl: "https://en.wikipedia.org/wiki/Lava_and_Kusha"
        },
        {
            name: "Angada",
            type: "individual",
            role: "Vanara prince",
            description: "Son of Vali.",
            wikiUrl: "https://en.wikipedia.org/wiki/Angada"
        },
        {
            name: "Sampati",
            type: "individual",
            role: "Vulture elder",
            description: "Brother of Jatayu.",
            wikiUrl: "https://en.wikipedia.org/wiki/Sampati"
        },
        {
            name: "Jambaavan",
            type: "individual",
            role: "Bear king",
            description: "Bear king.",
            wikiUrl: "https://en.wikipedia.org/wiki/Jambavan"
        },
        {
            name: "Ayodhya",
            type: "group",
            role: "Kingdom",
            description: "Capital kingdom of Rama's royal house.",
            wikiUrl: "https://en.wikipedia.org/wiki/Ayodhya"
        },
        {
            name: "Lanka",
            type: "group",
            role: "Kingdom",
            description: "Island kingdom ruled by Ravana.",
            wikiUrl: "https://en.wikipedia.org/wiki/Lanka"
        },
        {
            name: "Mithila",
            type: "group",
            role: "Kingdom",
            description: "Kingdom of Janaka and homeland of Sita.",
            wikiUrl: "https://en.wikipedia.org/wiki/Mithila_(region)"
        },
        {
            name: "Kishkindha",
            type: "group",
            role: "Kingdom",
            description: "Vanara kingdom allied with Rama through Sugriva.",
            wikiUrl: "https://en.wikipedia.org/wiki/Kishkindha"
        }
    ];

    function createPeopleCard(entry) {
        var article = document.createElement("article");
        article.className = "people-card scroll-reveal";

        var heading = document.createElement("h3");
        heading.textContent = entry.name;

        var badge = document.createElement("p");
        badge.className = "people-card-role";
        badge.textContent = entry.role;

        var type = document.createElement("p");
        type.className = "people-card-type";
        type.textContent = entry.type === "individual" ? "Individual" : "Kingdom";

        var text = document.createElement("p");
        text.textContent = entry.description;

        article.appendChild(heading);
        article.appendChild(badge);
        article.appendChild(type);
        article.appendChild(text);

        if (entry.wikiUrl) {
            var wikiButton = document.createElement("a");
            wikiButton.className = "wiki-link-button btn";
            wikiButton.href = entry.wikiUrl;
            wikiButton.target = "_blank";
            wikiButton.rel = "noopener noreferrer";
            wikiButton.textContent = "Wikipedia";
            article.appendChild(wikiButton);
        }

        return article;
    }

    function renderPeople(category) {
        var peopleGrid = document.getElementById("peopleGrid");
        var filtered = peopleEntries.filter(function (entry) {
            return category === "all" || entry.type === category;
        });

        peopleGrid.innerHTML = "";

        filtered.forEach(function (entry) {
            peopleGrid.appendChild(createPeopleCard(entry));
        });

        setupScrollRevealTransitions();
    }

    document.addEventListener("DOMContentLoaded", function () {
        var peopleCategory = document.getElementById("peopleCategory");

        renderPeople("all");
        setupNavbarToggle();
        setupPersistentAudio();

        peopleCategory.addEventListener("change", function (event) {
            renderPeople(event.target.value);
        });
    });
})();
