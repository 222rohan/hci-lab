// examMode.js
import { quizConfig, QuizTimer, QuizStats } from './quizBase.js';

export class ExamMode {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};           // Locked (final) answers
    this.selectedAnswers = {};   // Temporary selection before locking
    this.lockedQuestions = {};   // Marks questions as locked after submission
    this.testSubmitted = false;  // Flag: entire test is finished
    this.initializeDOM();
    this.setupEventListeners();
  }

  initializeDOM() {
    // Cache DOM elements from quiz.html
    this.elements = {
      questionInfo: document.getElementById('question-info'),
      questionText: document.getElementById('question-text'),
      optionsContainer: document.getElementById('options-container'),
      prevBtn: document.getElementById('prev-btn'),
      nextBtn: document.getElementById('next-btn'),
      submitBtn: document.getElementById('submit-btn'),
      timerBox: document.getElementById('timer-box'),
      resultsContainer: document.getElementById('results-container'),
      scoreText: document.getElementById('score-text'),
      resultsQnumContainer: document.getElementById('results-qnum-container'),
      reviewQuestionContainer: document.getElementById('review-question-container'),
      reviewQuestionText: document.getElementById('review-question-text'),
      reviewOptionsList: document.getElementById('review-options-list')
    };

    // Initialize stats (shows "Attempted: X / Y")
    this.stats = new QuizStats({
      attempted: document.getElementById('attempted'),
      progressBar: document.getElementById('progress-bar')
    });

    // Start timer; on time-up, auto-submit test
    this.timer = new QuizTimer(this.elements.timerBox, () => this.submitTest());
    this.timer.start();

    // Build the question navigation sidebar
    this.createQuestionNav();
  }

  createQuestionNav() {
    const container = document.getElementById('qnum-container');
    container.innerHTML = '';
    this.questionNavButtons = quizConfig.questions.map((q, index) => {
      const btn = document.createElement('button');
      btn.className = 'qnum-btn';
      btn.textContent = q.id;
      btn.addEventListener('click', () => {
        this.currentQuestionIndex = index;
        this.renderQuestion();
      });
      container.appendChild(btn);
      return btn;
    });
  }

  setupEventListeners() {
    this.elements.prevBtn.addEventListener('click', () => this.navigateQuestion(-1));
    this.elements.nextBtn.addEventListener('click', () => this.navigateQuestion(1));
    this.elements.submitBtn.addEventListener('click', () => this.submitTest());
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
    this.elements.questionInfo.textContent = `Question ${question.id} / ${quizConfig.questions.length}`;
    this.elements.questionText.textContent = question.question;
    this.elements.optionsContainer.innerHTML = '';

    // Update nav buttons active state
    this.questionNavButtons.forEach((btn, index) => {
      btn.classList.toggle('active', index === this.currentQuestionIndex);
    });

    // Render options
    Object.entries(question.options).forEach(([key, value]) => {
      const optionBtn = document.createElement('button');
      optionBtn.className = 'option';
      optionBtn.innerHTML = `<strong>${key}.</strong> ${value}`;

      if (this.testSubmitted) {
        // After overall test submission: show final color coding
        if (key === question.answer) {
          optionBtn.style.backgroundColor = '#4caf50';
        }
        if (
          this.answers[question.id] &&
          this.answers[question.id] !== question.answer &&
          key === this.answers[question.id]
        ) {
          optionBtn.style.backgroundColor = '#f44336';
        }
        optionBtn.disabled = true;
      } else {
        if (this.lockedQuestions[question.id]) {
          // Already submitted this question; disable changes
          if (this.answers[question.id] === key) {
            optionBtn.classList.add('selected');
          }
          optionBtn.disabled = true;
        } else {
          // Allow selection if not locked
          if (this.selectedAnswers[question.id] === key) {
            optionBtn.classList.add('selected');
          }
          optionBtn.addEventListener('click', () => {
            this.selectedAnswers[question.id] = key;
            this.renderQuestion();
          });
        }
      }
      this.elements.optionsContainer.appendChild(optionBtn);
    });

    // Show Clear/Submit buttons if question not yet locked and test not fully submitted
    if (!this.lockedQuestions[question.id] && !this.testSubmitted) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';

      // Clear Selection (left)
      const clearSelectionBtn = document.createElement('button');
      clearSelectionBtn.className = 'clear-selection-btn';
      clearSelectionBtn.textContent = 'Clear Selection';
      clearSelectionBtn.addEventListener('click', () => {
        delete this.selectedAnswers[question.id];
        this.renderQuestion();
      });
      buttonContainer.appendChild(clearSelectionBtn);

      // Submit Answer (right) – auto-moves to next question
      const submitAnswerBtn = document.createElement('button');
      submitAnswerBtn.className = 'submit-question-btn';
      submitAnswerBtn.textContent = 'Submit Answer';
      submitAnswerBtn.addEventListener('click', () => {
        if (!this.selectedAnswers[question.id]) {
          alert('Please select an answer first!');
          return;
        }
        // Lock question and store final answer
        this.answers[question.id] = this.selectedAnswers[question.id];
        this.lockedQuestions[question.id] = true;
        this.questionNavButtons[question.id - 1].classList.add('answered');
        this.stats.update(Object.keys(this.answers).length);

        // Automatically move to the next question (if any)
        if (this.currentQuestionIndex < quizConfig.questions.length - 1) {
          this.currentQuestionIndex++;
        }
        this.renderQuestion();
      });
      buttonContainer.appendChild(submitAnswerBtn);

      this.elements.optionsContainer.appendChild(buttonContainer);
    }

    // Enable/disable prev/next buttons as needed
    this.elements.prevBtn.disabled = this.currentQuestionIndex === 0;
    this.elements.nextBtn.disabled = this.currentQuestionIndex === quizConfig.questions.length - 1;
  }

  submitTest() {
    this.timer.stop();
    this.testSubmitted = true;

    // Calculate final score
    let score = 0;
    quizConfig.questions.forEach(q => {
      if (this.answers[q.id] === q.answer) score++;
    });

    // Hide the quiz interface
    document.getElementById('sticky-bar').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'none';
    document.getElementById('submit-container').style.display = 'none';

    // Show the results container
    this.elements.resultsContainer.classList.remove('hidden');
    this.elements.scoreText.textContent = `You scored ${score} out of ${quizConfig.questions.length}`;

    // Build results nav: each button lets the user review that question
    this.elements.resultsQnumContainer.innerHTML = '';
    quizConfig.questions.forEach((q, index) => {
      const btn = document.createElement('button');
      btn.className = 'results-qnum-btn';
      btn.textContent = q.id;
      
      if (this.answers[q.id]) {
        if (this.answers[q.id] === q.answer) {
          btn.classList.add('correct'); // Styles defined in style.css: green background, white text
        } 
        else {
          btn.classList.add('wrong');   // Styles defined in style.css: red background, white text
        }
      }
      btn.addEventListener('click', () => {
        this.renderReviewQuestion(index);
      });
      this.elements.resultsQnumContainer.appendChild(btn);
    });

    alert('Test submitted!');
  }

  renderReviewQuestion(index) {
    // Show detailed review for a given question
    const question = quizConfig.questions[index];
    this.elements.reviewQuestionContainer.classList.remove('hidden');
    this.elements.reviewQuestionText.textContent = `Question ${question.id}: ${question.question}`;
    this.elements.reviewOptionsList.innerHTML = '';

    const userAnswer = this.answers[question.id] || '(none)';
    Object.entries(question.options).forEach(([key, value]) => {
      const li = document.createElement('li');
      li.textContent = `${key}. ${value}`;
      if (key === question.answer) {
        li.style.color = 'green';
        li.style.fontWeight = 'bold';
      }
      if (key === userAnswer && userAnswer !== question.answer) {
        li.style.color = 'red';
        li.style.fontWeight = 'bold';
      }
      this.elements.reviewOptionsList.appendChild(li);
    });
  }
}