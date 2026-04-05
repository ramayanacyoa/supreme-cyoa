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

        peopleCategory.addEventListener("change", function (event) {
            renderPeople(event.target.value);
        });
    });
})();
