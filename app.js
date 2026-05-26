let words = [];
let currentWord = null;

const categoryFiles = {
    Basics: "data/basics.json",
    Greetings: "data/greetings.json",
    Food: "data/food.json",
    Travel: "data/travel.json",
    Family: "data/family.json",
    Business: "data/business.json",
    Technology: "data/technology.json",
    Verbs: "data/verbs.json",
    Adjectives: "data/adjectives.json",
    Numbers: "data/numbers.json",
    Colors: "data/colors.json"
};

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;

document.getElementById("xp").innerText = xp;
document.getElementById("streak").innerText = streak;

async function loadWords() {

    const category =
        document.getElementById("category").value;

    const file =
        categoryFiles[category];

    try {

        const response =
            await fetch(file);

        words =
            await response.json();

        currentWord =
            words[Math.floor(
                Math.random() * words.length
            )];

        document.getElementById("englishWord")
            .innerText = currentWord.english;

        document.getElementById("answer").value = "";
        document.getElementById("result").innerText = "";

    } catch (error) {

        document.getElementById("englishWord")
            .innerText =
            "Category file not found";

        console.error(error);
    }
}

function checkAnswer() {

    if (!currentWord) return;

    const userAnswer =
        document.getElementById("answer")
        .value
        .trim()
        .toLowerCase();

    const correctAnswer =
        currentWord.french
        .toLowerCase();

    if (userAnswer === correctAnswer) {

        xp += 10;

        localStorage.setItem("xp", xp);

        document.getElementById("xp")
            .innerText = xp;

        document.getElementById("result")
            .innerText = "✅ Correct";

        updateDailyStreak();

        setTimeout(loadWords, 1000);

    } else {

        document.getElementById("result")
            .innerText =
            `❌ Correct answer: ${currentWord.french}`;
    }
}

function updateDailyStreak() {

    const today =
        new Date().toDateString();

    const lastDate =
        localStorage.getItem("lastStudyDate");

    if (lastDate !== today) {

        streak++;

        localStorage.setItem(
            "streak",
            streak
        );

        localStorage.setItem(
            "lastStudyDate",
            today
        );

        document.getElementById("streak")
            .innerText = streak;
    }
}
