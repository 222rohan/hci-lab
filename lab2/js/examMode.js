// examMode.js
import { quizConfig, QuizTimer, QuizStats } from './quizBase.js';

export class ExamMode {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.selectedAnswers = {};  // holds current selection
    this.lockedQuestions = {};  // once submitted, lock the question
    this.markedQuestions = {};  // tracks marked-for-review
    this.testSubmitted = false; // flag for exam finished
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
      resultsContainer: document.getElementById("results-container"),
      scoreText: document.getElementById("score-text"),
      resultsQnumContainer: document.getElementById("results-qnum-container")
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
    this.timer = new QuizTimer(this.elements.timerBox, () => this.submitTest());
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
    this.elements.submitBtn.addEventListener("click", () => this.submitTest());
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
  
    // Update the navigation buttons (active state)
    this.questionNavButtons.forEach((btn, index) => {
      btn.classList.toggle("active", index === this.currentQuestionIndex);
    });
  
    // Render each option
    Object.entries(question.options).forEach(([key, value]) => {
      const optionBtn = document.createElement("button");
      optionBtn.className = "option";
      optionBtn.innerHTML = `<strong>${key}.</strong> ${value}`;
      
      if (this.testSubmitted) {
        if (key === question.answer) {
          optionBtn.style.backgroundColor = "#4caf50";
        }
        if (this.answers[question.id] && this.answers[question.id] !== question.answer && key === this.answers[question.id]) {
          optionBtn.style.backgroundColor = "#f44336";
        }
      } else {
        if (this.selectedAnswers[question.id] === key) {
          optionBtn.classList.add("selected");
        }
        if (!this.lockedQuestions[question.id]) {
          optionBtn.addEventListener("click", () => {
            this.selectedAnswers[question.id] = key;
            this.renderQuestion();
          });
        }
      }
      this.elements.optionsContainer.appendChild(optionBtn);
    });
  
    // Only add action buttons if the question is not locked and test not submitted
    if (!this.lockedQuestions[question.id] && !this.testSubmitted) {
      const buttonContainer = document.createElement("div");
      buttonContainer.className = "button-container";
  
      // Clear Selection (left)
      const clearSelectionBtn = document.createElement("button");
      clearSelectionBtn.className = "clear-selection-btn";
      clearSelectionBtn.textContent = "Clear Selection";
      clearSelectionBtn.addEventListener("click", () => {
        delete this.selectedAnswers[question.id];
        this.renderQuestion();
      });
      buttonContainer.appendChild(clearSelectionBtn);
  
      // Submit Answer (right)
      const submitAnswerBtn = document.createElement("button");
      submitAnswerBtn.className = "submit-question-btn";
      submitAnswerBtn.textContent = "Submit Answer";
      submitAnswerBtn.addEventListener("click", () => {
        if (!this.selectedAnswers[question.id]) {
          alert("Please select an answer first!");
          return;
        }
        this.answers[question.id] = this.selectedAnswers[question.id];
        this.lockedQuestions[question.id] = true;
        this.questionNavButtons[question.id - 1].classList.add("answered");
        this.stats.update(Object.keys(this.answers).length);
        this.renderQuestion();
      });
      buttonContainer.appendChild(submitAnswerBtn);
  
      this.elements.optionsContainer.appendChild(buttonContainer);
    }
  }   

  submitTest() {
    this.timer.stop();
    let score = 0;
    quizConfig.questions.forEach(q => {
      if (this.answers[q.id] === q.answer) score++;
    });
    this.testSubmitted = true;
    // Hide the submit test button so it cannot be used again
    this.elements.submitBtn.style.display = 'none';
  
    this.elements.resultsContainer.classList.remove("hidden");
    this.elements.scoreText.textContent = `You scored ${score} out of ${quizConfig.questions.length}`;
  
    // Build results navigation with color-coded buttons
    quizConfig.questions.forEach((q, index) => {
      const btn = document.createElement("button");
      btn.className = "results-qnum-btn";
      btn.textContent = q.id;
      btn.style.backgroundColor = this.answers[q.id] === q.answer ? "#4caf50" : "#f44336";
      btn.addEventListener("click", () => {
        this.currentQuestionIndex = index;
        this.renderQuestion();
      });
      this.elements.resultsQnumContainer.appendChild(btn);
    });
  
    alert("Test submitted!");
  }  
}