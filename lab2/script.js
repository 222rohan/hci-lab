document.addEventListener("DOMContentLoaded", function() {
  // Determine mode from URL parameter (default is exam mode)
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "exam";

  // Quiz Data (5 questions with options labeled A, B, C, D)
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

  // State Variables
  const totalQuestions = questions.length;
  let answers = {};       // Store user's selected option per question
  let lockedQuestions = {}; // For practice mode: track if question is locked after first selection

  // Timer: Countdown from 10 minutes (600 seconds)
  let timeLeft = 600;
  const timerBox = document.getElementById("timer-box");

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerBox.textContent = `Time Left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Color transitions (green > yellow > red)
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
  const timerInterval = setInterval(updateTimer, 1000);

  // Generate Quiz Cards (Center Section)
  const quizCardsContainer = document.getElementById("quiz-cards");
  questions.forEach(q => {
    const card = document.createElement("div");
    card.className = "question-card";
    card.id = `q${q.id}`;

    let optionsHtml = "";
    for (let key in q.options) {
      optionsHtml += `
        <button class="option" data-qid="${q.id}" data-option="${key}">
          <strong>${key}.</strong> ${q.options[key]}
        </button>
      `;
    }

    card.innerHTML = `
      <h3>${q.question}</h3>
      <div class="options">
        ${optionsHtml}
      </div>
    `;
    quizCardsContainer.appendChild(card);
  });

  // Attach event listeners to option buttons
  function attachOptionListeners() {
    document.querySelectorAll(".option").forEach(btn => {
      btn.addEventListener("click", function() {
        const qid = this.getAttribute("data-qid");
        const selectedOption = this.getAttribute("data-option");

        // For practice mode: If question is locked, do nothing
        if (mode === "practice" && lockedQuestions[qid]) {
          return;
        }

        // Deselect other options for same question
        const siblings = this.parentElement.querySelectorAll(".option");
        siblings.forEach(sib => {
          sib.classList.remove("selected");
          // If practice mode immediate feedback was applied, revert background if needed
          if (mode === "practice") {
            sib.style.background = "#ececec";
          }
        });

        this.classList.add("selected");
        answers[qid] = selectedOption;
        updateStats();

        // Practice mode => lock after first selection + show immediate feedback
        if (mode === "practice") {
          lockedQuestions[qid] = true; // lock this question
          const correct = questions.find(q => q.id == qid).answer === selectedOption;
          if (correct) {
            this.style.background = "#8bc34a";
          } else {
            this.style.background = "#f44336";
          }

          // Disable all options for that question
          siblings.forEach(sib => {
            sib.disabled = true;
          });
        }
      });
    });
  }
  attachOptionListeners();

  // Update Statistics in Right Sidebar
  function updateStats() {
    const attempted = Object.keys(answers).length;
    document.getElementById("attempted").textContent = attempted;
    document.getElementById("marked").textContent = attempted;
    document.getElementById("attempted-marked").textContent = attempted;
    document.getElementById("not-visited").textContent = totalQuestions - attempted;
    updateProgressBar();
  }
  function updateProgressBar() {
    const progressPercent = (Object.keys(answers).length / totalQuestions) * 100;
    // The #progress-bar *container* is static; we’ll adjust its background size:
    document.getElementById("progress-bar").style.width = progressPercent + "%";
  }

  // Generate Right Sidebar Question Navigation Buttons
  const qnumContainer = document.getElementById("qnum-container");
  questions.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "qnum-btn";
    btn.textContent = q.id;
    btn.addEventListener("click", () => {
      document.getElementById(`q${q.id}`).scrollIntoView({ behavior: "smooth" });
    });
    qnumContainer.appendChild(btn);
  });

  // Sticky Top Bar Navigation Buttons (< and >)
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  let currentQuestionIndex = 0; // track which question is "in view"

  prevBtn.addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      document.getElementById(`q${questions[currentQuestionIndex].id}`)
        .scrollIntoView({ behavior: "smooth" });
    }
  });

  nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      currentQuestionIndex++;
      document.getElementById(`q${questions[currentQuestionIndex].id}`)
        .scrollIntoView({ behavior: "smooth" });
    }
  });

  // IntersectionObserver to update current question in sticky bar
  const observerOptions = { threshold: 0.5 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const qid = entry.target.id.replace("q", "");
        currentQuestionIndex = questions.findIndex(q => q.id == qid);
        document.getElementById("question-info").textContent = `Question ${qid}/${totalQuestions}`;
      }
    });
  }, observerOptions);

  document.querySelectorAll(".question-card").forEach(card => {
    observer.observe(card);
  });

  // Right Sidebar Toggle Functionality
  const rightSidebar = document.getElementById("right-sidebar");
  const toggleSidebarBtn = document.getElementById("toggle-sidebar");
  toggleSidebarBtn.addEventListener("click", function() {
    if (!rightSidebar.classList.contains("collapsed")) {
      rightSidebar.classList.add("collapsed");
      toggleSidebarBtn.textContent = ">>"; // When collapsed, show >> to expand
    } else {
      rightSidebar.classList.remove("collapsed");
      toggleSidebarBtn.textContent = "<<"; // When expanded, show << to collapse
    }
  });

  // Submit Test Functionality
  const submitBtn = document.getElementById("submit-btn");
  submitBtn.addEventListener("click", submitTest);

  function submitTest() {
    clearInterval(timerInterval);

    // Show correct/incorrect feedback for EXAM MODE only after submission
    if (mode === "exam") {
      // Calculate score
      let score = 0;

      questions.forEach(q => {
        const correctOption = q.answer;
        const userOption = answers[q.id];

        if (userOption === correctOption) {
          score++;
        }
      });

      // Highlight correct/wrong in the question cards
      document.querySelectorAll(".option").forEach(btn => {
        const qid = btn.getAttribute("data-qid");
        const option = btn.getAttribute("data-option");
        const correctOption = questions.find(q => q.id == qid).answer;
        const userOption = answers[qid];

        // If this is the correct option
        if (option === correctOption) {
          btn.style.background = "#8bc34a";
        }
        // If this option was the user's (incorrect) choice
        else if (option === userOption) {
          btn.style.background = "#f44336";
        }

        // Disable all options after submission
        btn.disabled = true;
      });

      // Show results container
      const resultsContainer = document.getElementById("results-container");
      const scoreText = document.getElementById("score-text");
      const resultsQnumContainer = document.getElementById("results-qnum-container");

      scoreText.textContent = `You scored ${score} out of ${totalQuestions}`;
      resultsContainer.classList.remove("hidden");

      // Populate question number buttons for review
      resultsQnumContainer.innerHTML = ""; // clear first
      questions.forEach(q => {
        const reviewBtn = document.createElement("button");
        reviewBtn.className = "results-qnum-btn";
        reviewBtn.textContent = q.id;
        reviewBtn.addEventListener("click", () => {
          document.getElementById(`q${q.id}`).scrollIntoView({ behavior: "smooth" });
        });
        resultsQnumContainer.appendChild(reviewBtn);
      });
    }

    alert("Test submitted!");
  }
});