let words = [];
let currentWord = null;

let xp = Number(localStorage.getItem("xp")) || 0;
let streak = Number(localStorage.getItem("streak")) || 0;

document.getElementById("xp").innerText = xp;
document.getElementById("streak").innerText = streak;

async function loadWords() {

    const category =
        document.getElementById("category").value;

    const response =
        await fetch("words.json");

    words = await response.json();

    const filtered =
        words.filter(
            w => w.category === category
        );

    currentWord =
        filtered[
            Math.floor(
                Math.random() * filtered.length
            )
        ];

    document.getElementById("englishWord")
        .innerText = currentWord.english;

    document.getElementById("answer").value = "";
    document.getElementById("result").innerText = "";
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

        document.getElementById("result")
            .innerText = "✅ Correct";

        localStorage.setItem("xp", xp);

        document.getElementById("xp")
            .innerText = xp;

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
