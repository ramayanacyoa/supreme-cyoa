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

    var peopleEntries = [
        {
            name: "Rama",
            type: "individual",
            role: "Prince of Ayodhya",
            description: "Avatar of Vishnu and central hero of the epic, known for dharma, discipline, and kingship."
        },
        {
            name: "Sita",
            type: "individual",
            role: "Princess of Mithila / Queen of Ayodhya",
            description: "Daughter of Janaka and embodiment of strength, devotion, and dignity through exile and trial."
        },
        {
            name: "Lakshmana",
            type: "individual",
            role: "Prince of Ayodhya",
            description: "Rama's younger brother, famed for unwavering loyalty, vigilance, and battlefield skill."
        },
        {
            name: "Bharata",
            type: "individual",
            role: "Prince of Ayodhya / Regent of Kosala",
            description: "Rama's brother who refuses the throne, governing in Rama's name while awaiting his return."
        },
        {
            name: "Shatrughna",
            type: "individual",
            role: "Prince of Ayodhya",
            description: "Youngest royal brother, closely aligned with Bharata and important in Ayodhya's political stability."
        },
        {
            name: "Hanuman",
            type: "individual",
            role: "Vanara champion",
            description: "Messenger, warrior, and devotee whose courage and intelligence are pivotal to Sita's rescue."
        },
        {
            name: "Ravana",
            type: "individual",
            role: "King of Lanka",
            description: "Powerful rakshasa ruler and scholar whose pride drives the central conflict."
        },
        {
            name: "Dasharatha",
            type: "individual",
            role: "King of Ayodhya",
            description: "Father of Rama whose vows and succession choices trigger the exile arc."
        },
        {
            name: "Kaikeyi",
            type: "individual",
            role: "Queen of Ayodhya",
            description: "Mother of Bharata whose invoked boons redirect succession and begin Rama's exile."
        },
        {
            name: "Kausalya",
            type: "individual",
            role: "Queen of Ayodhya",
            description: "Rama's mother and a key moral center in the royal household."
        },
        {
            name: "Sumitra",
            type: "individual",
            role: "Queen of Ayodhya",
            description: "Mother of Lakshmana and Shatrughna, known for calm counsel and duty-first wisdom."
        },
        {
            name: "Janaka",
            type: "individual",
            role: "King of Mithila",
            description: "Philosopher-king and Sita's father, associated with wisdom and sacred kingship."
        },
        {
            name: "Urmila",
            type: "individual",
            role: "Princess of Mithila",
            description: "Lakshmana's wife and Sita's sister, a major figure in family and exile traditions."
        },
        {
            name: "Mandavi",
            type: "individual",
            role: "Princess of Mithila",
            description: "Bharata's wife and one of the four royal brides linking Ayodhya and Mithila."
        },
        {
            name: "Shrutakirti",
            type: "individual",
            role: "Princess of Mithila",
            description: "Shatrughna's wife and member of the core Mithila-Ayodhya alliance."
        },
        {
            name: "Vibhishana",
            type: "individual",
            role: "Prince of Lanka",
            description: "Ravana's brother who defects to Rama's side, embodying dharma over blood ties."
        },
        {
            name: "Kumbhakarna",
            type: "individual",
            role: "War champion of Lanka",
            description: "Ravana's giant brother, remembered for immense strength and tragic loyalty."
        },
        {
            name: "Indrajit (Meghanada)",
            type: "individual",
            role: "Crown prince of Lanka",
            description: "Ravana's formidable son whose mastery of astras makes him one of the war's deadliest foes."
        },
        {
            name: "Sugriva",
            type: "individual",
            role: "King of Kishkindha",
            description: "Vanara ruler allied with Rama, providing troops and intelligence for Sita's rescue."
        },
        {
            name: "Vali",
            type: "individual",
            role: "Former king of Kishkindha",
            description: "Powerful vanara warrior whose rivalry with Sugriva shapes the southern alliance."
        },
        {
            name: "Angada",
            type: "individual",
            role: "Vanara prince",
            description: "Vali's son and a key commander in the campaign against Lanka."
        },
        {
            name: "Jambavan",
            type: "individual",
            role: "Bear-king strategist",
            description: "Ancient ally who guides war planning and rekindles Hanuman's confidence."
        },
        {
            name: "Nala",
            type: "individual",
            role: "Vanara engineer",
            description: "Bridge architect associated with Setubandha and the crossing to Lanka."
        },
        {
            name: "Nila",
            type: "individual",
            role: "Vanara commander",
            description: "Campaign leader who works with Nala during the sea-bridge operation."
        },
        {
            name: "Jatayu",
            type: "individual",
            role: "Bird-king ally",
            description: "Aged warrior who confronts Ravana during Sita's abduction."
        },
        {
            name: "Shabari",
            type: "individual",
            role: "Forest ascetic devotee",
            description: "Bhakti exemplar whose hospitality and devotion become iconic in the exile journey."
        },
        {
            name: "Guha",
            type: "individual",
            role: "Nishada chief",
            description: "River ally who assists Rama's exile passage and represents early forest support."
        },
        {
            name: "Vishwamitra",
            type: "individual",
            role: "Rishi and royal mentor",
            description: "Sage who trains Rama and Lakshmana in divine weaponry before exile."
        },
        {
            name: "Agastya",
            type: "individual",
            role: "Revered southern sage",
            description: "Influential rishi encountered in exile traditions, associated with spiritual guidance."
        },
        {
            name: "Ahalya",
            type: "individual",
            role: "Redeemed ascetic figure",
            description: "Early-episode figure whose liberation marks one of Rama's foundational acts."
        },
        {
            name: "Maricha",
            type: "individual",
            role: "Rakshasa deceiver",
            description: "Demon who takes golden deer form, creating the opening for Sita's abduction."
        },
        {
            name: "Surpanakha",
            type: "individual",
            role: "Rakshasi noble of Lanka",
            description: "Catalyst figure whose forest encounter escalates conflict between Rama and Lanka."
        },
        {
            name: "Trijata",
            type: "individual",
            role: "Compassionate rakshasi",
            description: "Supportive voice in Lanka who comforts Sita and foretells Rama's victory in some traditions."
        },
        {
            name: "Sumantra",
            type: "individual",
            role: "Royal charioteer",
            description: "Trusted Ayodhya court servant who accompanies Rama at the beginning of exile."
        },
        {
            name: "Ayodhya (Ikshvaku / Solar dynasty)",
            type: "group",
            role: "Kingdom and royal house",
            description: "Rama's homeland and one of the primary royal lineages in the story's political world."
        },
        {
            name: "Mithila (House of Janaka)",
            type: "group",
            role: "Kingdom and royal house",
            description: "Sita's homeland, associated with wisdom, philosophy, and sacred royal duty."
        },
        {
            name: "Vanaras of Kishkindha",
            type: "group",
            role: "Forest alliance",
            description: "Monkey-warrior confederation led by Sugriva, vital for reconnaissance, bridge-building, and war."
        },
        {
            name: "Rakshasas of Lanka",
            type: "group",
            role: "Island kingdom and war host",
            description: "Ravana's court and military power centered in Lanka, including many elite commanders."
        },
        {
            name: "Nishada community",
            type: "group",
            role: "Riverine tribe",
            description: "Allies in the forest routes, represented by Guha's friendship and support during exile."
        },
        {
            name: "Sages and Hermit Orders",
            type: "group",
            role: "Ascetic lineages",
            description: "Rishis, teachers, and forest hermitages who preserve sacred knowledge and guide the heroes."
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
        type.textContent = entry.type === "individual" ? "Individual" : "Group";

        var text = document.createElement("p");
        text.textContent = entry.description;

        article.appendChild(heading);
        article.appendChild(badge);
        article.appendChild(type);
        article.appendChild(text);

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

        peopleCategory.addEventListener("change", function (event) {
            renderPeople(event.target.value);
        });
    });
})();
