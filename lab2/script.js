const questions = [
    { text: "Which is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], correct: 2 },
    { text: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Lisbon"], correct: 2 },
    { text: "Which gas do plants absorb from the atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 1 },
    { text: "What is the square root of 64?", options: ["6", "8", "10", "12"], correct: 1 },
    { text: "Who wrote 'Hamlet'?", options: ["Shakespeare", "Dickens", "Hemingway", "Tolstoy"], correct: 0 }
];

let currentQuestion = 0;
let score = 0;

const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextButton = document.getElementById("next-btn");
const progressBar = document.getElementById("progress-bar");
const resultContainer = document.getElementById("result-container");
const scoreText = document.getElementById("score-text");
const feedbackText = document.getElementById("feedback-text");
const restartButton = document.getElementById("restart-btn");

function loadQuestion() {
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    const q = questions[currentQuestion];
    questionText.textContent = q.text;
    optionsContainer.innerHTML = "";
    q.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.classList.add("option");
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });

    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
    nextButton.classList.add("hidden");
}

function selectAnswer(selectedIndex) {
    if (selectedIndex === questions[currentQuestion].correct) {
        score++;
    }
    currentQuestion++;
    nextButton.classList.remove("hidden");
}

nextButton.addEventListener("click", loadQuestion);

function showResults() {
    document.getElementById("question-container").classList.add("hidden");
    resultContainer.classList.remove("hidden");
    scoreText.textContent = `You scored ${score} out of ${questions.length}`;

    let feedback = "";
    if (score === questions.length) {
        feedback = "🎉 Excellent! You mastered this quiz!";
    } else if (score > questions.length / 2) {
        feedback = "👍 Good job! Keep practicing.";
    } else {
        feedback = "😢 Don't worry! Try again and improve!";
    }
    feedbackText.textContent = feedback;
}

restartButton.addEventListener("click", () => {
    score = 0;
    currentQuestion = 0;
    resultContainer.classList.add("hidden");
    document.getElementById("question-container").classList.remove("hidden");
    loadQuestion();
});

loadQuestion();