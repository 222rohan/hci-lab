const questions = [
    {
      text: "Which is the largest planet in our solar system?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correct: 2,
    },
    {
      text: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Lisbon"],
      correct: 2,
    },
    {
      text: "Which gas do plants absorb from the atmosphere?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
      correct: 1,
    },
    {
      text: "What is the square root of 64?",
      options: ["6", "8", "10", "12"],
      correct: 1,
    },
    {
      text: "Who wrote 'Hamlet'?",
      options: ["Shakespeare", "Dickens", "Hemingway", "Tolstoy"],
      correct: 0,
    },
  ];
  
  let currentQuestion = 0;
  let score = 0;
  // Array to store the user's selected answer for each question (null = unanswered)
  const userAnswers = new Array(questions.length).fill(null);
  
  // DOM Elements
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const immediateFeedback = document.getElementById("immediate-feedback");
  const nextButton = document.getElementById("next-btn");
  const prevButton = document.getElementById("prev-btn");
  const progressBar = document.getElementById("progress-bar");
  const resultContainer = document.getElementById("result-container");
  const scoreText = document.getElementById("score-text");
  const feedbackText = document.getElementById("feedback-text");
  const restartButton = document.getElementById("restart-btn");
  
  function loadQuestion() {
    // If out of range, show results
    if (currentQuestion >= questions.length) {
      showResults();
      return;
    }
  
    // Clear any immediate feedback message
    immediateFeedback.textContent = "";
  
    // Update the question text and clear previous options
    const q = questions[currentQuestion];
    questionText.textContent = q.text;
    optionsContainer.innerHTML = "";
  
    // Create option buttons
    q.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.classList.add("option");
      button.textContent = option;
  
      // If this question was already answered, disable buttons and highlight the chosen option
      if (userAnswers[currentQuestion] !== null) {
        button.disabled = true;
        if (index === userAnswers[currentQuestion]) {
          if (index === q.correct) {
            button.style.background = "#28a745"; // green for correct
          } else {
            button.style.background = "#dc3545"; // red for wrong
          }
        }
      } else {
        // Allow selection only if not answered yet
        button.onclick = () => selectAnswer(index);
      }
      optionsContainer.appendChild(button);
    });
  
    // If already answered, show immediate feedback
    if (userAnswers[currentQuestion] !== null) {
      if (userAnswers[currentQuestion] === q.correct) {
        immediateFeedback.textContent = "Correct!";
        immediateFeedback.style.color = "#28a745";
      } else {
        immediateFeedback.textContent = "Wrong!";
        immediateFeedback.style.color = "#dc3545";
      }
    }
  
    // Update the progress bar (based on current question index)
    progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  
    // Enable next button only if an answer has been selected for this question
    nextButton.disabled = userAnswers[currentQuestion] === null;
  
    // Change next button text on the last question
    if (currentQuestion === questions.length - 1) {
      nextButton.textContent = "Finish Quiz";
    } else {
      nextButton.textContent = "Next →";
    }
  
    // Hide previous button on first question; otherwise, show it.
    if (currentQuestion === 0) {
      prevButton.classList.add("hidden");
    } else {
      prevButton.classList.remove("hidden");
    }
  }
  
  function selectAnswer(selectedIndex) {
    // Only allow selection if not already answered
    if (userAnswers[currentQuestion] === null) {
      userAnswers[currentQuestion] = selectedIndex;
      const q = questions[currentQuestion];
  
      // Check answer and update immediate feedback
      if (selectedIndex === q.correct) {
        score++;
        immediateFeedback.textContent = "Correct!";
        immediateFeedback.style.color = "#28a745";
      } else {
        immediateFeedback.textContent = "Wrong!";
        immediateFeedback.style.color = "#dc3545";
      }
  
      // Disable all option buttons and highlight the chosen answer
      const buttons = optionsContainer.querySelectorAll("button");
      buttons.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === selectedIndex) {
          btn.style.background = selectedIndex === q.correct ? "#28a745" : "#dc3545";
        }
      });
  
      // Enable the next button now that an answer has been chosen
      nextButton.disabled = false;
    }
  }
  
  nextButton.addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
      currentQuestion++;
      loadQuestion();
    } else {
      // If on the last question, finish the quiz
      showResults();
    }
  });
  
  prevButton.addEventListener("click", () => {
    if (currentQuestion > 0) {
      currentQuestion--;
      loadQuestion();
    }
  });
  
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
    // Reset values and clear previous answers
    score = 0;
    currentQuestion = 0;
    for (let i = 0; i < userAnswers.length; i++) {
      userAnswers[i] = null;
    }
    resultContainer.classList.add("hidden");
    document.getElementById("question-container").classList.remove("hidden");
    loadQuestion();
  });
  
  loadQuestion();  