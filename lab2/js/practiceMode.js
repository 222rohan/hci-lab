// practiceMode.js
import { quizConfig, QuizTimer, QuizStats } from './quizBase.js';

export class PracticeMode {
  constructor() {
    this.currentQuestionIndex = 0;
    this.answers = {};          // Final locked answers
    this.selectedAnswers = {};  // User’s selection before locking
    this.lockedQuestions = {};  // Tracks which questions are locked
    this.initializeDOM();
    this.setupEventListeners();
  }

  initializeDOM() {
    // Get DOM elements from quiz.html
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

    // Initialize stats
    this.stats = new QuizStats({
      attempted: document.getElementById('attempted'),
      progressBar: document.getElementById('progress-bar')
    });

    // Initialize timer
    this.timer = new QuizTimer(this.elements.timerBox, () => this.finishPractice());
    this.timer.start();

    // Create question navigation
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
    this.elements.submitBtn.addEventListener('click', () => this.finishPractice());
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

    // Highlight the current question button in the sidebar
    this.questionNavButtons.forEach((btn, index) => {
      btn.classList.toggle('active', index === this.currentQuestionIndex);
    });

    // Render each option as a button
    Object.entries(question.options).forEach(([key, value]) => {
      const optionBtn = document.createElement('button');
      optionBtn.className = 'option';
      optionBtn.innerHTML = `<strong>${key}.</strong> ${value}`;

      // Handle click on option
      optionBtn.addEventListener('click', () => {
        // Store the selected answer
        this.selectedAnswers[question.id] = key;
        this.answers[question.id] = key;
        this.lockedQuestions[question.id] = true;

        // Update the question nav button in sidebar
        if (key === question.answer) {
          this.questionNavButtons[this.currentQuestionIndex].classList.add('correct');
        } else {
          this.questionNavButtons[this.currentQuestionIndex].classList.add('wrong');
        }

        // Show feedback for all options immediately
        const allOptions = this.elements.optionsContainer.querySelectorAll('.option');
        allOptions.forEach((opt, index) => {
          const optKey = Object.keys(question.options)[index];
          
          // Show correct answer in green
          if (optKey === question.answer) {
            opt.style.backgroundColor = '#4caf50';
          }
          
          // Show selected wrong answer in red
          if (optKey === key && key !== question.answer) {
            opt.style.backgroundColor = '#f44336';
          }
          
          // Disable all options
          opt.disabled = true;
        });

        // Update stats
        this.stats.update(Object.keys(this.answers).length);
      });

      // If question was previously answered, show the colors
      if (this.lockedQuestions[question.id]) {
        // Show correct answer in green
        if (key === question.answer) {
          optionBtn.style.backgroundColor = '#4caf50';
        }
        // Show wrong selection in red
        if (this.answers[question.id] === key && key !== question.answer) {
          optionBtn.style.backgroundColor = '#f44336';
        }
        optionBtn.disabled = true;
      }

      this.elements.optionsContainer.appendChild(optionBtn);
    });

    // Navigation buttons
    this.elements.prevBtn.disabled = (this.currentQuestionIndex === 0);
    this.elements.nextBtn.disabled = (this.currentQuestionIndex === quizConfig.questions.length - 1);
  }

  finishPractice() {
    // Called when "Submit Test" is clicked or time runs out
    this.timer.stop();

    // Calculate final score
    let score = 0;
    quizConfig.questions.forEach(q => {
      if (this.answers[q.id] === q.answer) {
        score++;
      }
    });

    // Hide quiz interface
    document.getElementById('sticky-bar').style.display = 'none';
    document.querySelector('.quiz-container').style.display = 'none';
    document.getElementById('submit-container').style.display = 'none';

    // Show results container
    this.elements.resultsContainer.classList.remove('hidden');
    this.elements.scoreText.textContent = `You scored ${score} out of ${quizConfig.questions.length}`;

    // Build question nav in results area
    this.elements.resultsQnumContainer.innerHTML = '';
    quizConfig.questions.forEach((q, index) => {
      const btn = document.createElement('button');
      btn.className = 'results-qnum-btn';
      btn.textContent = q.id;
      btn.addEventListener('click', () => {
        this.renderReviewQuestion(index);
      });
      this.elements.resultsQnumContainer.appendChild(btn);
    });
  }

  renderReviewQuestion(index) {
    // Show the question + correct/wrong in #review-question-container
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