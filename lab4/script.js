// Simulation for loading bars and captchas
document.addEventListener('DOMContentLoaded', function() {
  // Generate math captcha
  generateMathCaptcha();
  
  // Hide overlay loader after 2 seconds (simulating page load)
  const overlayLoader = document.getElementById('overlayLoader');
  overlayLoader.style.opacity = '1';
  overlayLoader.style.visibility = 'visible';
  
  setTimeout(() => {
    overlayLoader.style.opacity = '0';
    setTimeout(() => {
      overlayLoader.style.visibility = 'hidden';
    }, 300);
  }, 2000);
  
  // Update countdown timer
  setInterval(updateCountdown, 1000);
});

// Generate simple math captcha
function generateMathCaptcha() {
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  document.getElementById('mathCaptcha').textContent = `${num1} + ${num2} = ?`;
  // Store answer for verification later
  document.getElementById('mathCaptcha').dataset.answer = num1 + num2;
}

// Simulate file upload progress
function simulateUpload() {
  const progressBar = document.getElementById('uploadProgress');
  let width = 0;
  
  // Reset progress
  progressBar.style.width = '0%';
  
  // Simulate upload progress
  const interval = setInterval(() => {
    if (width >= 100) {
      clearInterval(interval);
    } else {
      width++;
      progressBar.style.width = width + '%';
    }
  }, 20);
}

// Form submission with loading indicator
function submitForm(event) {
  event.preventDefault();
  
  // Show loading indicator
  const loader = document.getElementById('formLoader');
  const submitButton = event.target.querySelector('button[type="submit"]');
  
  submitButton.disabled = true;
  loader.hidden = false;
  
  // Validate captcha answers
  const mathCaptcha = document.getElementById('mathCaptcha');
  const mathAnswer = document.getElementById('captchaAnswer').value;
  const correctAnswer = parseInt(mathCaptcha.dataset.answer);
  
  const notRobotChecked = document.getElementById('notRobot').checked;
  const wordCheck = document.getElementById('wordCheck').value;
  const sliderValue = document.getElementById('slider').value;
  
  // Simulate form processing (2 seconds)
  setTimeout(() => {
    if (parseInt(mathAnswer) === correctAnswer &&
        notRobotChecked &&
        wordCheck.toLowerCase() === 'learnhub' &&
        sliderValue === '100') {
      
      // Success - could show success message
      alert('Thank you for your message! Our team will contact you shortly.');
      event.target.reset();
    } else {
      // Failed validation
      alert('Please complete all captcha challenges correctly.');
    }
    
    // Reset UI
    submitButton.disabled = false;
    loader.hidden = true;
  }, 2000);
}

// Claim free course function (Reciprocity principle)
function claimFreeCourse() {
  // Simulate loading
  const overlayLoader = document.getElementById('overlayLoader');
  overlayLoader.style.opacity = '1';
  overlayLoader.style.visibility = 'visible';
  overlayLoader.querySelector('p').textContent = 'Preparing your free course...';
  
  setTimeout(() => {
    overlayLoader.style.opacity = '0';
    setTimeout(() => {
      overlayLoader.style.visibility = 'hidden';
      // Show thank you message or redirect to free course page
      alert('Congratulations! Your free "Introduction to Programming" course is now available. Thank you for joining LearnHub!');
    }, 300);
  }, 1500);
}

// Countdown timer function (Scarcity principle)
function updateCountdown() {
  const countdownElement = document.getElementById('countdown');
  
  // Parse current time
  const timeString = countdownElement.textContent;
  const timeParts = timeString.split(':');
  
  let hours = parseInt(timeParts[0]);
  let minutes = parseInt(timeParts[1]);
  let seconds = parseInt(timeParts[2]);
  
  // Decrement seconds
  seconds--;
  
  // Handle time rollover
  if (seconds < 0) {
    seconds = 59;
    minutes--;
    
    if (minutes < 0) {
      minutes = 59;
      hours--;
      
      if (hours < 0) {
        // Reset to some random time when it hits zero to maintain scarcity
        hours = Math.floor(Math.random() * 24) + 24;
        minutes = Math.floor(Math.random() * 60);
        seconds = Math.floor(Math.random() * 60);
      }
    }
  }
  
  // Format and update countdown
  countdownElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Simulate selecting cat images (on click)
document.addEventListener('DOMContentLoaded', function() {
  const captchaBoxes = document.querySelectorAll('.box');
  
  captchaBoxes.forEach(box => {
    box.addEventListener('click', function() {
      // Toggle selected state
      this.classList.toggle('selected');
      
      if (this.classList.contains('selected')) {
        this.style.backgroundColor = 'rgba(67, 97, 238, 0.2)';
        this.style.border = '2px solid var(--primary)';
      } else {
        this.style.backgroundColor = 'var(--light)';
        this.style.border = '1px solid var(--gray-dark)';
      }
    });
  });
});