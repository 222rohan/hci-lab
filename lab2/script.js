/********************************************
 * SAMPLE QUESTIONS
 ********************************************/
const questions = [
  {
    text: "Which is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correct: 2
  },
  {
    text: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    correct: 2
  },
  {
    text: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    correct: 1
  },
  {
    text: "What is the square root of 64?",
    options: ["6", "8", "10", "12"],
    correct: 1
  },
  {
    text: "Who wrote 'Hamlet'?",
    options: ["Shakespeare", "Dickens", "Hemingway", "Tolstoy"],
    correct: 0
  }
];

/********************************************
 * GLOBAL VARIABLES
 ********************************************/
let currentQuestion = 0;
let score = 0;
let userAnswers = new Array(questions.length).fill(null);

// Mode can be "practice" or "exam"
let mode = null;

// If inReviewMode = true, we are showing a specific question from the results screen
let inReviewMode = false;

/********************************************
 * DOM ELEMENTS
 ********************************************/
const modeSelectionDiv = document.getElementById("mode-selection");
const practiceBtn = document.getElementById("practice-btn");
const examBtn = document.getElementById("exam-btn");

const quizContainer = document.getElementById("quiz-container");
const modeTitle = document.getElementById("mode-title");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const immediateFeedback = document.getElementById("immediate-feedback");

const nextButton = document.getElementById("next-btn");
const prevButton = document.getElementById("prev-btn");
const returnResultsBtn = document.getElementById("return-results-btn");

const progressBar = document.getElementById("progress-bar");

const resultContainer = document.getElementById("result-container");
const scoreText = document.getElementById("score-text");
const feedbackText = document.getElementById("feedback-text");
const questionReview = document.getElementById("question-review");
const restartButton = document.getElementById("restart-btn");

/********************************************
 * MODE SELECTION
 ********************************************/
practiceBtn.addEventListener("click", () => {
  startQuiz("practice");
});
examBtn.addEventListener("click", () => {
  startQuiz("exam");
});

function startQuiz(selectedMode) {
  mode = selectedMode;
  // Hide mode selection screen
  modeSelectionDiv.classList.add("hidden");
  // Show quiz container
  quizContainer.classList.remove("hidden");

  // Set the title based on the mode
  modeTitle.textContent = mode === "practice"
    ? "Practice Mode"
    : "Exam Mode";

  // Initialize or reset variables
  currentQuestion = 0;
  score = 0;
  userAnswers.fill(null);

  // Make sure we are not in review mode
  inReviewMode = false;
  returnResultsBtn.classList.add("hidden");

  // Load the first question
  loadQuestion();
}

/********************************************
 * LOAD QUESTION
 ********************************************/
function loadQuestion() {
  // If in review mode, we simply show the question with correct & user answer
  // otherwise, we do normal quiz logic
  if (inReviewMode) {
    showQuestionInReviewMode();
    return;
  }

  // If we've reached beyond the last question, show results
  if (currentQuestion >= questions.length) {
    showResults();
    return;
  }

  const q = questions[currentQuestion];

  // Update question text
  questionText.textContent = q.text;
  // Clear previous options
  optionsContainer.innerHTML = "";
  immediateFeedback.textContent = "";

  // Generate option buttons
  q.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.textContent = option;

    // If user has already selected an answer for this question
    // (this can happen if user navigates back)
    if (userAnswers[currentQuestion] !== null) {
      // Disable the button
      btn.disabled = true;
      // If it's the chosen answer, color it according to correctness in practice mode
      if (index === userAnswers[currentQuestion]) {
        if (mode === "practice") {
          // In practice mode, we highlight correct/wrong right away
          if (index === q.correct) {
            btn.style.background = "#28a745"; // green
          } else {
            btn.style.background = "#dc3545"; // red
          }
          immediateFeedback.textContent =
            index === q.correct ? "Correct!" : "Wrong!";
          immediateFeedback.style.color =
            index === q.correct ? "#28a745" : "#dc3545";
        }
      }
    } else {
      // If not answered yet, allow clicking
      btn.addEventListener("click", () => selectAnswer(index));
    }

    optionsContainer.appendChild(btn);
  });

  // Update progress bar
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

  // Next button should be enabled only if we have an answer for this question
  nextButton.disabled = (userAnswers[currentQuestion] === null);

  // On the last question, change "Next" text to "Finish Quiz"
  if (currentQuestion === questions.length - 1) {
    nextButton.textContent = "Finish Quiz";
  } else {
    nextButton.textContent = "Next →";
  }

  // Show or hide Previous button
  if (currentQuestion === 0) {
    prevButton.classList.add("hidden");
  } else {
    prevButton.classList.remove("hidden");
  }
}

/********************************************
 * SELECT ANSWER
 ********************************************/
function selectAnswer(index) {
  // Only allow selection if the user hasn't chosen yet
  if (userAnswers[currentQuestion] === null) {
    userAnswers[currentQuestion] = index;

    // If in practice mode, we show immediate feedback and highlight
    if (mode === "practice") {
      const q = questions[currentQuestion];
      if (index === q.correct) {
        score++;
        immediateFeedback.textContent = "Correct!";
        immediateFeedback.style.color = "#28a745";
      } else {
        immediateFeedback.textContent = "Wrong!";
        immediateFeedback.style.color = "#dc3545";
      }
      // Highlight the chosen option
      highlightChosenOption(index);
    } else {
      // In exam mode, do not show correctness yet
      // We'll compute score at the end
    }

    // Enable next button
    nextButton.disabled = false;

    // Disallow changing the answer once selected
    disableAllOptions();
  }
}

/********************************************
 * HIGHLIGHT CHOSEN OPTION (Practice Mode)
 ********************************************/
function highlightChosenOption(chosenIndex) {
  const q = questions[currentQuestion];
  const buttons = optionsContainer.querySelectorAll("button");
  buttons.forEach((btn, idx) => {
    if (idx === chosenIndex) {
      if (idx === q.correct) {
        btn.style.background = "#28a745"; // correct
      } else {
        btn.style.background = "#dc3545"; // wrong
      }
    }
  });
}

/********************************************
 * DISABLE ALL OPTIONS
 ********************************************/
function disableAllOptions() {
  const buttons = optionsContainer.querySelectorAll("button");
  buttons.forEach(btn => {
    btn.disabled = true;
  });
}

/********************************************
 * NEXT & PREVIOUS BUTTONS
 ********************************************/
nextButton.addEventListener("click", () => {
  // If we are on the last question, show results
  if (currentQuestion === questions.length - 1) {
    showResults();
  } else {
    currentQuestion++;
    loadQuestion();
  }
});

prevButton.addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    loadQuestion();
  }
});

/********************************************
 * SHOW RESULTS
 ********************************************/
function showResults() {
  // If exam mode, compute score now
  if (mode === "exam") {
    score = 0;
    // Tally correct answers
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].correct) {
        score++;
      }
    }
  }

  // Hide quiz container
  quizContainer.classList.add("hidden");
  // Show results container
  resultContainer.classList.remove("hidden");

  // Display score
  scoreText.textContent = `You scored ${score} out of ${questions.length}`;

  // Feedback
  let feedback = "";
  if (score === questions.length) {
    feedback = "🎉 Excellent! You mastered this quiz!";
  } else if (score > questions.length / 2) {
    feedback = "👍 Good job! Keep practicing.";
  } else {
    feedback = "😢 Don't worry! Try again and improve!";
  }
  feedbackText.textContent = feedback;

  // Build the review list of questions
  generateReviewList();
}

/********************************************
 * GENERATE REVIEW LIST
 ********************************************/
function generateReviewList() {
  questionReview.innerHTML = "<h3>Click a question to review:</h3>";
  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.classList.add("review-item");
    div.textContent = `Question ${index + 1}: ${q.text}`;
    div.addEventListener("click", () => {
      enterReviewMode(index);
    });
    questionReview.appendChild(div);
  });
}

/********************************************
 * ENTER REVIEW MODE
 * - Hide results
 * - Show quiz container
 * - Mark inReviewMode = true
 * - Load the specific question
 ********************************************/
function enterReviewMode(questionIndex) {
  inReviewMode = true;
  currentQuestion = questionIndex;
  resultContainer.classList.add("hidden");
  quizContainer.classList.remove("hidden");
  loadQuestion();
  returnResultsBtn.classList.remove("hidden");
}

/********************************************
 * SHOW QUESTION IN REVIEW MODE
 ********************************************/
function showQuestionInReviewMode() {
  const q = questions[currentQuestion];
  questionText.textContent = q.text;
  optionsContainer.innerHTML = "";
  immediateFeedback.textContent = "";

  // Create buttons, highlight user answer & correct answer
  q.options.forEach((option, idx) => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.textContent = option;
    btn.disabled = true; // no changes in review mode

    // Compare with userAnswers
    if (idx === questions[currentQuestion].correct) {
      // Correct answer => green
      btn.style.background = "#28a745";
    }
    if (userAnswers[currentQuestion] === idx && idx !== q.correct) {
      // User's chosen answer (but wrong)
      btn.style.background = "#dc3545";
    }
    optionsContainer.appendChild(btn);
  });

  // In review mode, no next/prev navigation for the quiz itself
  nextButton.disabled = true;
  prevButton.classList.add("hidden");
  nextButton.classList.add("hidden");
}

/********************************************
 * RETURN TO RESULTS
 ********************************************/
returnResultsBtn.addEventListener("click", () => {
  exitReviewMode();
});

function exitReviewMode() {
  inReviewMode = false;
  quizContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  returnResultsBtn.classList.add("hidden");
  nextButton.classList.remove("hidden");
}

/********************************************
 * RESTART BUTTON
 ********************************************/
restartButton.addEventListener("click", () => {
  // Reset
  mode = null;
  score = 0;
  currentQuestion = 0;
  userAnswers.fill(null);

  // Hide results container, show mode selection
  resultContainer.classList.add("hidden");
  modeSelectionDiv.classList.remove("hidden");
});
