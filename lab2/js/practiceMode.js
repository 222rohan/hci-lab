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
  
    // Mark the current question button in the sidebar as active
    this.questionNavButtons.forEach((btn, index) => {
      btn.classList.toggle('active', index === this.currentQuestionIndex);
    });
  
    // Render each option
    Object.entries(question.options).forEach(([key, value]) => {
      const optionBtn = document.createElement('button');
      optionBtn.className = 'option';
      optionBtn.innerHTML = `<strong>${key}.</strong> ${value}`;
  
      // If question is locked (user clicked "Submit Answer"), show final feedback
      if (this.lockedQuestions[question.id]) {
        const userAnswer = this.answers[question.id];
        const isCorrectOption = (key === question.answer);
        const isUserChoice   = (key === userAnswer);
  
        // Always highlight the correct answer in green
        if (isCorrectOption) {
          optionBtn.style.backgroundColor = '#4caf50';
          optionBtn.style.color = '#fff';
        }
        // If the user chose a wrong option, highlight it in red
        if (isUserChoice && !isCorrectOption) {
          optionBtn.style.backgroundColor = '#f44336';
          optionBtn.style.color = '#fff';
        }
        // Disable all options after submission
        optionBtn.disabled = true;
  
      } else {
        // Question is not locked yet, so the user can freely select
        if (this.answers[question.id] === key) {
          // Highlight the currently selected option in blue
          optionBtn.style.backgroundColor = '#2196f3';
          optionBtn.style.color = '#fff';
        }
  
        // Clicking an option just marks it as "selected" (not locked yet)
        optionBtn.addEventListener('click', () => {
          this.answers[question.id] = key;
          this.selectedAnswers[question.id] = key;
          this.renderQuestion(); // Re-render to highlight the new selection
        });
      }
  
      this.elements.optionsContainer.appendChild(optionBtn);
    });
  
    // If question is not locked, show Clear & Submit buttons
    if (!this.lockedQuestions[question.id]) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';
  
      // Clear Selection button
      const clearSelectionBtn = document.createElement('button');
      clearSelectionBtn.className = 'clear-selection-btn';
      clearSelectionBtn.textContent = 'Clear Selection';
      clearSelectionBtn.addEventListener('click', () => {
        delete this.answers[question.id];
        delete this.selectedAnswers[question.id];
        this.renderQuestion();
      });
      buttonContainer.appendChild(clearSelectionBtn);
  
      // Submit Answer button
      const submitAnswerBtn = document.createElement('button');
      submitAnswerBtn.className = 'submit-question-btn';
      submitAnswerBtn.textContent = 'Submit Answer';
      submitAnswerBtn.addEventListener('click', () => {
        if (!this.answers[question.id]) {
          alert('Please select an answer first!');
          return;
        }
        // Lock the question and show feedback
        this.lockedQuestions[question.id] = true;
  
        // Update sidebar button color: green if correct, red if wrong
        if (this.answers[question.id] === question.answer) {
          this.questionNavButtons[this.currentQuestionIndex].classList.add('correct');
        } else {
          this.questionNavButtons[this.currentQuestionIndex].classList.add('wrong');
        }
  
        // Update stats (# of locked questions, etc.)
        this.stats.update(Object.keys(this.lockedQuestions).length);
  
        // Re-render to show correct/wrong feedback
        this.renderQuestion();
      });
      buttonContainer.appendChild(submitAnswerBtn);
  
      this.elements.optionsContainer.appendChild(buttonContainer);
    }
  
    // Enable or disable navigation arrows appropriately
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
      
      if (this.answers[q.id]) {
        if (this.answers[q.id] === q.answer) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('wrong');
        }
      }
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