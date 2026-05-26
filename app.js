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

let xp =
    Number(localStorage.getItem("xp")) || 0;

let streak =
    Number(localStorage.getItem("streak")) || 0;

let dailyGoal =
    Number(localStorage.getItem("dailyGoal")) || 0;

let difficultWords =
JSON.parse(
localStorage.getItem("difficultWords")
) || [];

document.getElementById("xp").innerText = xp;
document.getElementById("streak").innerText = streak;
document.getElementById("goalProgress").innerText = dailyGoal;

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

        if (
            difficultWords.length > 0 &&
            Math.random() < 0.20
        ) {

            currentWord =
                difficultWords[
                    Math.floor(
                        Math.random() *
                        difficultWords.length
                    )
                ];

        } else {

            currentWord =
                words[
                    Math.floor(
                        Math.random() *
                        words.length
                    )
                ];
        }

        document.getElementById(
            "englishWord"
        ).innerText =
        currentWord.english;

        document.getElementById(
            "answer"
        ).value = "";

        document.getElementById(
            "result"
        ).innerText = "";

    } catch (error) {

        document.getElementById(
            "englishWord"
        ).innerText =
        "Category file not found";

        console.error(error);
    }
}

function addCorrectAnswerReward() {

    xp += 10;
    dailyGoal++;

    localStorage.setItem("xp", xp);
    localStorage.setItem(
        "dailyGoal",
        dailyGoal
    );

    document.getElementById(
        "xp"
    ).innerText = xp;

    document.getElementById(
        "goalProgress"
    ).innerText = dailyGoal;

    updateDailyStreak();
}

function checkAnswer() {

    if (!currentWord) return;

    const userAnswer =
        document
        .getElementById("answer")
        .value
        .trim()
        .toLowerCase();

    const correctAnswer =
        currentWord.french
        .trim()
        .toLowerCase();

    if (
        userAnswer === correctAnswer
    ) {

        addCorrectAnswerReward();

        document.getElementById(
            "result"
        ).innerText =
        "✅ Correct";

        setTimeout(
            loadWords,
            1000
        );

    } else {

        difficultWords.push(
            currentWord
        );

        localStorage.setItem(
            "difficultWords",
            JSON.stringify(
                difficultWords
            )
        );

        document.getElementById(
            "result"
        ).innerText =
        `❌ Correct answer: ${currentWord.french}`;
    }
}

function updateDailyStreak() {

    const today =
        new Date().toDateString();

    const lastDate =
        localStorage.getItem(
            "lastStudyDate"
        );

    if (
        lastDate !== today
    ) {

        streak++;

        localStorage.setItem(
            "streak",
            streak
        );

        localStorage.setItem(
            "lastStudyDate",
            today
        );

        document.getElementById(
            "streak"
        ).innerText =
        streak;
    }
}

function shuffle(array) {

    for (
        let i =
        array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );

        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];
    }

    return array;
}

function loadQuizQuestion() {

    if (
        !words.length
    ) {

        loadWords();

        return;
    }

    const question =
        words[
            Math.floor(
                Math.random() *
                words.length
            )
        ];

    const options =
        [question.french];

    while (
        options.length < 4
    ) {

        const randomWord =
            words[
                Math.floor(
                    Math.random() *
                    words.length
                )
            ];

        if (
            !options.includes(
                randomWord.french
            )
        ) {

            options.push(
                randomWord.french
            );
        }
    }

    shuffle(options);

    let html =
        `<p><strong>${question.english}</strong></p>`;

    options.forEach(
        option => {

        html += `
        <button
        onclick="checkQuizAnswer(
        '${option.replace(/'/g,"\\'")}',
        '${question.french.replace(/'/g,"\\'")}'
        )">

        ${option}

        </button><br><br>
        `;
    });

    document
    .getElementById(
        "quizContainer"
    )
    .innerHTML =
    html;
}

function checkQuizAnswer(
    selected,
    correct
) {

    if (
        selected === correct
    ) {

        addCorrectAnswerReward();

        alert(
            "✅ Correct"
        );

    } else {

        const word =
            words.find(
                w =>
                w.french === correct
            );

        if (
            word
        ) {

            difficultWords.push(
                word
            );

            localStorage.setItem(
                "difficultWords",
                JSON.stringify(
                    difficultWords
                )
            );
        }

        alert(
            "❌ Correct: " +
            correct
        );
    }

    loadQuizQuestion();
}

async function updateWordCount() {

    let total = 0;

    for (
        const file
        of Object.values(
            categoryFiles
        )
    ) {

        try {

            const response =
                await fetch(file);

            const data =
                await response.json();

            total +=
                data.length;

        } catch (
            error
        ) {

            console.error(
                error
            );
        }
    }

    document
    .getElementById(
        "wordCount"
    )
    .innerText =
    total;
}

updateWordCount();
