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

      // If the question is already locked => show immediate feedback
      if (this.lockedQuestions[question.id]) {
        // Always highlight the correct answer in green
        if (key === question.answer) {
          optionBtn.style.backgroundColor = '#4caf50'; // correct
        }
        // If user chose a wrong answer, highlight that choice in red
        if (this.answers[question.id] === key && key !== question.answer) {
          optionBtn.style.backgroundColor = '#f44336'; // user's incorrect
        }
        // Disable further changes
        optionBtn.disabled = true;
      } else {
        // Not locked => user can select
        if (this.selectedAnswers[question.id] === key) {
          // Just highlight the user's selection (light color)
          optionBtn.classList.add('selected');
        }
        // On click, store selection but don't finalize yet
        optionBtn.addEventListener('click', () => {
          this.selectedAnswers[question.id] = key;
          this.renderQuestion();
        });
      }

      this.elements.optionsContainer.appendChild(optionBtn);
    });

    // If question is not locked, show "Clear Selection" + "Submit Answer"
    if (!this.lockedQuestions[question.id]) {
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

      // Submit Answer (right)
      const submitAnswerBtn = document.createElement('button');
      submitAnswerBtn.className = 'submit-question-btn';
      submitAnswerBtn.textContent = 'Submit Answer';
      submitAnswerBtn.addEventListener('click', () => {
        if (!this.selectedAnswers[question.id]) {
          alert('Please select an answer first!');
          return;
        }
        // Lock the question
        this.answers[question.id] = this.selectedAnswers[question.id];
        this.lockedQuestions[question.id] = true;

        // Also color the nav button (sidebar) green or red
        if (this.answers[question.id] === question.answer) {
          this.questionNavButtons[question.id - 1].classList.add('correct');
        } else {
          this.questionNavButtons[question.id - 1].classList.add('wrong');
        }

        // Update stats, re-render so we see green/red in the question
        this.stats.update(Object.keys(this.answers).length);
        this.renderQuestion();
      });
      buttonContainer.appendChild(submitAnswerBtn);

      this.elements.optionsContainer.appendChild(buttonContainer);
    }

    // Enable/disable prev/next arrow as needed
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