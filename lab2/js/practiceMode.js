import { quizConfig, QuizTimer, QuizStats } from './quizBase.js';

export class PracticeMode {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.selectedAnswers = {};
    this.lockedQuestions = {};
    this.initializeDOM();
    this.setupEventListeners();
  }

  initializeDOM() {
    // Get all DOM elements
    this.elements = {
      questionInfo: document.getElementById("question-info"),
      questionText: document.getElementById("question-text"),
      optionsContainer: document.getElementById("options-container"),
      prevBtn: document.getElementById("prev-btn"),
      nextBtn: document.getElementById("next-btn"),
      submitBtn: document.getElementById("submit-btn"),
      timerBox: document.getElementById("timer-box"),
      resultsContainer: document.getElementById("results-container")
    };

    // Initialize stats
    this.stats = new QuizStats({
      attempted: document.getElementById("attempted"),
      marked: document.getElementById("marked"),
      attemptedMarked: document.getElementById("attempted-marked"),
      notVisited: document.getElementById("not-visited"),
      progressBar: document.getElementById("progress-bar")
    });

    // Initialize timer
    this.timer = new QuizTimer(this.elements.timerBox, () => this.finishPractice());
    this.timer.start();

    // Create question navigation
    this.createQuestionNav();
  }

  createQuestionNav() {
    const container = document.getElementById("qnum-container");
    this.questionNavButtons = quizConfig.questions.map((q, index) => {
      const btn = document.createElement("button");
      btn.className = "qnum-btn";
      btn.textContent = q.id;
      btn.addEventListener("click", () => {
        this.currentQuestionIndex = index;
        this.renderQuestion();
      });
      container.appendChild(btn);
      return btn;
    });
  }

  setupEventListeners() {
    this.elements.prevBtn.addEventListener("click", () => this.navigateQuestion(-1));
    this.elements.nextBtn.addEventListener("click", () => this.navigateQuestion(1));
    this.elements.submitBtn.addEventListener("click", () => this.finishPractice());
  }

  navigateQuestion(direction) {
    const newIndex = this.currentQuestionIndex + direction;
    if (newIndex >= 0 && newIndex < quizConfig.questions.length) {
      this.currentQuestionIndex = newIndex;
      this.renderQuestion();
    }
  }

  renderQuestion() {
    const question = quizConfig.questions[this.currentQuestionIndex];
    this.elements.questionInfo.textContent = `Question ${question.id}/${quizConfig.questions.length}`;
    this.elements.questionText.textContent = question.question;
    this.elements.optionsContainer.innerHTML = "";
  
    // Update nav buttons: add "active" class for current question
    this.questionNavButtons.forEach((btn, index) => {
      btn.classList.toggle("active", index === this.currentQuestionIndex);
    });
  
    // Render options
    Object.entries(question.options).forEach(([key, value]) => {
      const optionBtn = document.createElement("button");
      optionBtn.className = "option";
      optionBtn.innerHTML = `<strong>${key}.</strong> ${value}`;
  
      if (this.lockedQuestions[question.id]) {
        if (key === question.answer) {
          optionBtn.style.backgroundColor = "#4caf50";
        } else if (key === this.answers[question.id]) {
          optionBtn.style.backgroundColor = "#f44336";
        }
        optionBtn.disabled = true;
      } else {
        if (this.selectedAnswers[question.id] === key) {
          optionBtn.classList.add("selected");
        }
        optionBtn.addEventListener("click", () => {
          this.selectedAnswers[question.id] = key;
          this.renderQuestion();
        });
      }
      this.elements.optionsContainer.appendChild(optionBtn);
    });
  
    // If the question is not locked, show the action buttons
    if (!this.lockedQuestions[question.id]) {
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";
  
      // Clear Selection button (left)
      const clearSelectionBtn = document.createElement("button");
      clearSelectionBtn.className = "clear-selection-btn";
      clearSelectionBtn.textContent = "Clear Selection";
      clearSelectionBtn.addEventListener("click", () => {
        delete this.selectedAnswers[question.id];
        this.renderQuestion();
      });
      buttonContainer.appendChild(clearSelectionBtn);
  
      // Submit Answer button (right)
      const submitQuestionBtn = document.createElement("button");
      submitQuestionBtn.className = "submit-question-btn";
      submitQuestionBtn.textContent = "Submit Answer";
      submitQuestionBtn.addEventListener("click", () => {
        if (!this.selectedAnswers[question.id]) {
          alert("Please select an answer first!");
          return;
        }
        this.answers[question.id] = this.selectedAnswers[question.id];
        this.lockedQuestions[question.id] = true;
        // Immediately update the nav button color
        if (this.selectedAnswers[question.id] === question.answer) {
          this.questionNavButtons[question.id - 1].classList.add("correct");
        } else {
          this.questionNavButtons[question.id - 1].classList.add("wrong");
        }
        this.stats.update(Object.keys(this.answers).length);
        this.renderQuestion();
      });
      buttonContainer.appendChild(submitQuestionBtn);
  
      this.elements.optionsContainer.appendChild(buttonContainer);
    }
  }  

  finishPractice() {
    this.timer.stop();
    let score = 0;
    quizConfig.questions.forEach(q => {
      if (this.answers[q.id] === q.answer) score++;
    });

    const resultsBox = document.createElement('div');
    resultsBox.style.position = 'fixed';
    resultsBox.style.top = '50%';
    resultsBox.style.left = '50%';
    resultsBox.style.transform = 'translate(-50%, -50%)';
    resultsBox.style.backgroundColor = '#f8f9fa';
    resultsBox.style.border = '1px solid #ccc';
    resultsBox.style.padding = '20px';
    resultsBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    resultsBox.style.borderRadius = '8px';
    resultsBox.style.textAlign = 'center';

    const message = document.createElement('p');
    message.innerText = `Practice completed! You got ${score} out of ${quizConfig.questions.length} questions correct.`;
    resultsBox.appendChild(message);

    const retryButton = document.createElement('button');
    retryButton.innerText = 'Retry';
    retryButton.style.backgroundColor = '#007bff';
    retryButton.style.color = '#fff';
    retryButton.style.border = 'none';
    retryButton.style.padding = '10px 20px';
    retryButton.style.borderRadius = '5px';
    retryButton.style.cursor = 'pointer';
    retryButton.style.marginTop = '10px';

    retryButton.addEventListener('click', () => {
      window.location.href = 'index.html';
    });

    resultsBox.appendChild(retryButton);
    document.body.appendChild(resultsBox);
  }
}