
import { ExamMode } from './examMode.js';
import { PracticeMode } from './practiceMode.js';

document.addEventListener("DOMContentLoaded", function() {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode") || "exam";

  // Initialize appropriate mode
  let quiz;
  if (mode === 'practice') {
    quiz = new PracticeMode();
  } else {
    quiz = new ExamMode();
  }
  quiz.renderQuestion();

  // Setup sidebar toggle
  const rightSidebar = document.getElementById("right-sidebar");
  const toggleSidebarBtn = document.getElementById("toggle-sidebar");
  
  if (toggleSidebarBtn && rightSidebar) {
    toggleSidebarBtn.addEventListener('click', function() {
      rightSidebar.classList.toggle('collapsed');
      toggleSidebarBtn.textContent = rightSidebar.classList.contains('collapsed') ? '>>' : '<<';
    });
  }
});