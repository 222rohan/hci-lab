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
  
    const isLocked = this.lockedQuestions[question.id];
    
    // Render each option
    Object.entries(question.options).forEach(([key, value]) => {
      const optionBtn = document.createElement('button');
      optionBtn.innerHTML = `<strong>${key}.</strong> ${value}`;
  
      // Base class
      let classes = ['option'];
  
      if (isLocked) {
        const isCorrectAnswer = key === question.answer;
        const isUserChoice = key === this.answers[question.id];
      
        if (isCorrectAnswer) {
          classes.push('correct-answer');
        } else if (isUserChoice) {
          classes.push('wrong-answer');
        }
      
        optionBtn.disabled = true; // Lock options after submission
      } else {
        if (key === this.selectedAnswers[question.id]) {
          classes.push('selected'); // Highlight selected option before submission
        }
        optionBtn.addEventListener('click', () => {
          this.selectedAnswers[question.id] = key;
          this.renderQuestion();
        });
      }
      
  
      optionBtn.className = classes.join(' ');
      this.elements.optionsContainer.appendChild(optionBtn);
    });
  
    if (!isLocked) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';
  
      const clearSelectionBtn = document.createElement('button');
      clearSelectionBtn.className = 'clear-selection-btn';
      clearSelectionBtn.textContent = 'Clear Selection';
      clearSelectionBtn.addEventListener('click', () => {
        delete this.selectedAnswers[question.id];
        this.renderQuestion();
      });
      buttonContainer.appendChild(clearSelectionBtn);
  
      const submitAnswerBtn = document.createElement('button');
      submitAnswerBtn.className = 'submit-question-btn';
      submitAnswerBtn.textContent = 'Submit Answer';
      submitAnswerBtn.addEventListener('click', () => {
        if (!this.selectedAnswers[question.id]) {
          alert('Please select an answer first!');
          return;
        }
      
        // Lock the question and save the answer
        this.lockedQuestions[question.id] = true;
        this.answers[question.id] = this.selectedAnswers[question.id];
      
        // Update sidebar button color
        const isCorrect = this.answers[question.id] === question.answer;
        this.questionNavButtons[this.currentQuestionIndex].classList.add(
          isCorrect ? 'correct' : 'wrong'
        );
      
        // Re-render immediately to show green/red feedback
        this.renderQuestion();
      });
      
      buttonContainer.appendChild(submitAnswerBtn);
  
      this.elements.optionsContainer.appendChild(buttonContainer);
    }
  
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