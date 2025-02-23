const quizConfig = {
  totalTime: 600, // 10 minutes in seconds
  questions: [
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
  ]
};

class QuizTimer {
  constructor(timerElement, onTimeUp) {
    this.timeLeft = quizConfig.totalTime;
    this.timerElement = timerElement;
    this.onTimeUp = onTimeUp;
    this.interval = null;
  }

  start() {
    this.interval = setInterval(() => this.updateTimer(), 1000);
  }

  stop() {
    clearInterval(this.interval);
  }

  updateTimer() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    this.timerElement.textContent = `Time Left: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (this.timeLeft > 300) {
      this.timerElement.style.background = "#4caf50";
    } else if (this.timeLeft > 150) {
      this.timerElement.style.background = "#ffeb3b";
    } else {
      this.timerElement.style.background = "#f44336";
    }

    if (this.timeLeft <= 0) {
      this.stop();
      this.onTimeUp();
    }
    this.timeLeft--;
  }
}

class QuizStats {
  constructor(elements) {
    this.elements = elements;
    this.totalQuestions = quizConfig.questions.length;
  }

  update(attempted) {
    this.elements.attempted.textContent = attempted;
    this.elements.marked.textContent = attempted;
    this.elements.attemptedMarked.textContent = attempted;
    this.elements.notVisited.textContent = this.totalQuestions - attempted;
    
    const progressPercent = (attempted / this.totalQuestions) * 100;
    this.elements.progressBar.style.width = progressPercent + "%";
  }
}

export { quizConfig, QuizTimer, QuizStats };