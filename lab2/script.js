document.addEventListener("DOMContentLoaded", function() {
  // Determine mode from URL parameter (default = exam)
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "exam";

  // Quiz Data
  const questions = [
    {
      id: 1,
      question: "What is 2 + 2?",
      options: { A: "3", B: "4", C: "5", D: "6" },
      answer: "B"
    },
    {
      id: 2,
      question: "What is the capital of France?",
      options: { A: "Berlin", B: "Madrid", C: "Paris", D: "Rome" },
      answer: "C"
    },
    {
      id: 3,
      question: "Which planet is known as the Red Planet?",
      options: { A: "Venus", B: "Mars", C: "Jupiter", D: "Saturn" },
      answer: "B"
    },
    {
      id: 4,
      question: "What is the boiling point of water (°C)?",
      options: { A: "90", B: "100", C: "110", D: "120" },
      answer: "B"
    },
    {
      id: 5,
      question: "What is the largest ocean on Earth?",
      options: { A: "Atlantic", B: "Indian", C: "Arctic", D: "Pacific" },
      answer: "D"
    }
  ];

  // State
  const totalQuestions = questions.length;
  let answers = {};         // user’s chosen options
  let lockedQuestions = {}; // for practice mode immediate feedback
  let currentQuestionIndex = 0;

  // Timer
  let timeLeft = 600; // 10 min
  const timerBox = document.getElementById("timer-box");
  const timerInterval = setInterval(updateTimer, 1000);

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerBox.textContent = `Time Left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Color transitions
    if (timeLeft > 300) {
      timerBox.style.background = "#4caf50";
      timerBox.style.color = "#fff";
    } else if (timeLeft > 150) {
      timerBox.style.background = "#ffeb3b";
      timerBox.style.color = "#000";
    } else {
      timerBox.style.background = "#f44336";
      timerBox.style.color = "#fff";
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("Time is up! Submitting the test.");
      submitTest();
    }
    timeLeft--;
  }

  // DOM Elements
  const questionInfo = document.getElementById("question-info");
  const questionText = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options-container");
  const progressBar = document.getElementById("progress-bar");
  const attemptedSpan = document.getElementById("attempted");
  const markedSpan = document.getElementById("marked");
  const attemptedMarkedSpan = document.getElementById("attempted-marked");
  const notVisitedSpan = document.getElementById("not-visited");
  const submitBtn = document.getElementById("submit-btn");
  const resultsContainer = document.getElementById("results-container");
  const scoreText = document.getElementById("score-text");
  const resultsQnumContainer = document.getElementById("results-qnum-container");

  // Prev/Next Buttons
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // Initialize stats
  document.getElementById("total-qs").textContent = totalQuestions;
  updateStats();
  renderQuestion(currentQuestionIndex);

  // Sidebar Question Buttons
  const qnumContainer = document.getElementById("qnum-container");
  let questionNavButtons = [];
  questions.forEach((q, index) => {
    const btn = document.createElement("button");
    btn.className = "qnum-btn";
    btn.textContent = q.id;
    btn.addEventListener("click", () => {
      currentQuestionIndex = index;
      renderQuestion(currentQuestionIndex);
    });
    qnumContainer.appendChild(btn);
    questionNavButtons.push(btn);
  });

  // Prev/Next Handlers
  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      renderQuestion(currentQuestionIndex);
    }
  });
  nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex);
    }
  });

  // Sidebar Toggle
  const rightSidebar = document.getElementById("right-sidebar");
  const toggleSidebarBtn = document.getElementById("toggle-sidebar");
  toggleSidebarBtn.addEventListener("click", function() {
    if (!rightSidebar.classList.contains("collapsed")) {
      rightSidebar.classList.add("collapsed");
      toggleSidebarBtn.textContent = ">>";
    } else {
      rightSidebar.classList.remove("collapsed");
      toggleSidebarBtn.textContent = "<<";
    }
  });

  // Submit
  submitBtn.addEventListener("click", submitTest);

  // Render a single question
  function renderQuestion(index) {
    const q = questions[index];
    questionInfo.textContent = `Question ${q.id}/${totalQuestions}`;
    questionText.textContent = q.question;
    optionsContainer.innerHTML = "";

    // Build options
    for (let key in q.options) {
      const optionBtn = document.createElement("button");
      optionBtn.className = "option";
      optionBtn.innerHTML = `<strong>${key}.</strong> ${q.options[key]}`;
      optionBtn.setAttribute("data-qid", q.id);
      optionBtn.setAttribute("data-option", key);

      // Mark selected if user previously chose it
      if (answers[q.id] === key) {
        optionBtn.classList.add("selected");
      }

      // Practice mode locked => immediate feedback
      if (mode === "practice" && lockedQuestions[q.id]) {
        const correctOpt = q.answer;
        const userOpt = answers[q.id];
        if (key === correctOpt) {
          optionBtn.style.background = "#8bc34a"; // green
        } else if (key === userOpt) {
          optionBtn.style.background = "#f44336"; // red
        }
        optionBtn.disabled = true;
      } else {
        // Click event
        optionBtn.addEventListener("click", () => {
          // If practice + not locked => lock after first selection
          if (mode === "practice" && !lockedQuestions[q.id]) {
            answers[q.id] = key;
            lockedQuestions[q.id] = true;
            const correct = (q.answer === key);

            optionBtn.style.background = correct ? "#8bc34a" : "#f44336";
            // disable all
            const allOptions = optionsContainer.querySelectorAll(".option");
            allOptions.forEach(btn => {
              btn.disabled = true;
              // highlight correct if user was wrong
              if (!correct && btn.getAttribute("data-option") === q.answer) {
                btn.style.background = "#8bc34a";
              }
            });
          }
          else if (mode === "exam") {
            answers[q.id] = key;
            // re-render to update selected highlight
            renderQuestion(index);
          }
          updateStats();
          // Mark question nav as answered
          questionNavButtons[q.id - 1].classList.add("answered");
        });
      }
      optionsContainer.appendChild(optionBtn);
    }
  }

  // Update stats
  function updateStats() {
    const attempted = Object.keys(answers).length;
    attemptedSpan.textContent = attempted;
    markedSpan.textContent = attempted;
    attemptedMarkedSpan.textContent = attempted;
    notVisitedSpan.textContent = totalQuestions - attempted;
    updateProgressBar();
  }

  function updateProgressBar() {
    const progressPercent = (Object.keys(answers).length / totalQuestions) * 100;
    progressBar.style.width = progressPercent + "%";
  }

  // Submit test
  function submitTest() {
    clearInterval(timerInterval);

    if (mode === "exam") {
      // Calculate score
      let score = 0;
      questions.forEach(q => {
        if (answers[q.id] === q.answer) {
          score++;
        }
      });
      // Lock all in exam mode
      questions.forEach(q => { lockedQuestions[q.id] = true; });

      // Show results
      resultsContainer.classList.remove("hidden");
      scoreText.textContent = `You scored ${score} out of ${totalQuestions}`;
      resultsQnumContainer.innerHTML = "";

      // Create review buttons
      questions.forEach((q, index) => {
        const reviewBtn = document.createElement("button");
        reviewBtn.className = "results-qnum-btn";
        reviewBtn.textContent = q.id;
        reviewBtn.addEventListener("click", () => {
          currentQuestionIndex = index;
          renderQuestion(currentQuestionIndex);
        });
        resultsQnumContainer.appendChild(reviewBtn);
      });

      // Re-render current question to show final correct/wrong colors
      renderQuestion(currentQuestionIndex);
    }

    alert("Test submitted!");
  }
});