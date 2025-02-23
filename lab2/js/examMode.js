// examMode.js
import { quizConfig, QuizTimer, QuizStats } from './quizBase.js';

export class ExamMode {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};
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

    // Update navigation buttons
    this.elements.prevBtn.disabled = this.currentQuestionIndex === 0;
    this.elements.nextBtn.disabled = this.currentQuestionIndex === quizConfig.questions.length - 1;

    Object.entries(question.options).forEach(([key, value]) => {
      const optionBtn = document.createElement("button");
      optionBtn.className = "option";
      if (this.answers[question.id] === key) {
        optionBtn.classList.add("selected");
      }
      optionBtn.innerHTML = `<strong>${key}.</strong> ${value}`;
      
      optionBtn.addEventListener("click", () => {
        this.answers[question.id] = key;
        this.questionNavButtons[question.id - 1].classList.add("answered");
        this.stats.update(Object.keys(this.answers).length);
        this.renderQuestion();
      });

      this.elements.optionsContainer.appendChild(optionBtn);
    });
  }

  submitTest() {
    this.timer.stop();
    let score = 0;
    quizConfig.questions.forEach(q => {
      if (this.answers[q.id] === q.answer) score++;
    });

    this.elements.resultsContainer.classList.remove("hidden");
    this.elements.scoreText.textContent = `You scored ${score} out of ${quizConfig.questions.length}`;
    
    // Show correct/incorrect answers
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