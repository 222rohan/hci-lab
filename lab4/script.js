  // Page loading simulation
document.addEventListener('DOMContentLoaded', function() {
  // Start with overlay loader
  const overlayLoader = document.getElementById('overlayLoader');
  const overlayProgress = document.getElementById('overlayProgress');
  const pageProgress = document.getElementById('pageLoadProgress').querySelector('.loader-bar-progress');
  
  // Check if elements exist before using them
  if (overlayLoader && overlayProgress && pageProgress) {
    overlayLoader.classList.add('active');
    
    // Simulate loading progress
    let progress = 0;
    const loadInterval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);
        setTimeout(() => {
          overlayLoader.classList.remove('active');
          loadCourses();
        }, 500);
      }
      
      overlayProgress.style.width = progress + '%';
      pageProgress.style.width = progress + '%';
    }, 200);
  }
});

// Course loading simulation
function loadCourses() {
  const courseLoadProgress = document.getElementById('courseLoadProgress');
  const coursesSection = document.getElementById('courses');
  const coursesLoading = document.getElementById('coursesLoading');
  
  // Check if elements exist
  if (courseLoadProgress && coursesSection && coursesLoading) {
    let progress = 0;
    const loadInterval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loadInterval);
        setTimeout(() => {
          coursesLoading.style.display = 'none';
          coursesSection.style.display = 'block';
          loadVideoPreview();
        }, 500);
      }
      
      courseLoadProgress.style.width = progress + '%';
    }, 100);
  }
}

// Video preview loading simulation
function loadVideoPreview() {
  const videoLoading = document.getElementById('videoLoading');
  const videoPlayer = document.getElementById('videoPlayer');
  
  if (videoLoading && videoPlayer) {
    setTimeout(() => {
      videoLoading.style.display = 'none';
      videoPlayer.style.display = 'block';
    }, 2000);
  }
}

// Free course claim function
function claimFreeCourse() {
  const claimBtn = document.getElementById('freeClaimBtn');
  const claimLoader = document.getElementById('claimLoader');
  
  if (!claimBtn || !claimLoader) return;
  
  claimBtn.disabled = true;
  claimLoader.style.display = 'inline-block';
  
  setTimeout(() => {
    claimLoader.style.display = 'none';
    claimBtn.disabled = false;
    claimBtn.textContent = 'Course Claimed Successfully!';
    claimBtn.style.backgroundColor = '#28a745';
  }, 3000);
}

// File upload simulation
function simulateUpload() {
  const uploadBtn = document.getElementById('uploadBtn');
  if (uploadBtn) {
    uploadBtn.disabled = false;
  }
}

function startUpload() {
  const projectUpload = document.getElementById('projectUpload');
  const progressContainer = document.getElementById('uploadProgressContainer');
  const progressBar = document.getElementById('uploadProgress');
  const uploadBtn = document.getElementById('uploadBtn');
  const uploadStatus = document.getElementById('uploadStatus');
  
  if (!projectUpload || !progressContainer || !progressBar || !uploadBtn || !uploadStatus) return;
  
  if (!projectUpload.value) {
    alert('Please select a file first.');
    return;
  }
  
  uploadBtn.disabled = true;
  progressContainer.style.display = 'block';
  uploadStatus.textContent = 'Uploading...';
  
  let progress = 0;
  const uploadInterval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress >= 100) {
      progress = 100;
      clearInterval(uploadInterval);
      uploadStatus.textContent = 'Upload complete!';
      uploadBtn.textContent = 'File Uploaded';
      uploadBtn.style.backgroundColor = '#28a745';
      
      // Reset after some time
      setTimeout(() => {
        projectUpload.value = '';
        progressBar.style.width = '0%';
        progressContainer.style.display = 'none';
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload Files';
        uploadBtn.style.backgroundColor = '';
        uploadStatus.textContent = '';
      }, 3000);
    }
    
    progressBar.style.width = progress + '%';
  }, 200);
}

// Contact modal
function openContactModal() {
  const contactModal = document.getElementById('contactModal');
  const mathCaptcha = document.getElementById('mathCaptcha');
  const mathCaptchaResult = document.getElementById('mathCaptchaResult');
  const imageCaptchaResult = document.getElementById('imageCaptchaResult');
  const wordCheckResult = document.getElementById('wordCheckResult');
  const captchaWord = document.getElementById('captchaWord');
  
  if (!contactModal || !mathCaptcha || !captchaWord) return;
  
  contactModal.style.display = 'block';
  
  // Generate random math captcha
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);
  mathCaptcha.textContent = `${num1} + ${num2} = ?`;
  mathCaptcha.dataset.answer = String(num1 + num2);
  
  // Reset captcha results
  if (mathCaptchaResult) mathCaptchaResult.textContent = '';
  if (imageCaptchaResult) imageCaptchaResult.textContent = '';
  if (wordCheckResult) wordCheckResult.textContent = '';
  
  // Generate random word for text verification
  const words = ['LearnHub', 'Education', 'Knowledge', 'Courses', 'Learning'];
  captchaWord.textContent = words[Math.floor(Math.random() * words.length)];
  
  initializeDrawingCaptcha();
}

function closeContactModal() {
  const contactModal = document.getElementById('contactModal');
  if (contactModal) {
    contactModal.style.display = 'none';
  }
}

// Initialize event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Handle checkbox captcha
  const notRobotCheckbox = document.getElementById('notRobot');
  if (notRobotCheckbox) {
    notRobotCheckbox.addEventListener('change', function() {
      const robotCheckLoader = document.getElementById('robotCheckLoader');
      if (!robotCheckLoader) return;
      
      if (this.checked) {
        robotCheckLoader.style.display = 'inline-block';
        
        setTimeout(() => {
          robotCheckLoader.style.display = 'none';
          this.parentElement.style.backgroundColor = '#d4edda';
        }, 1500);
      } else {
        this.parentElement.style.backgroundColor = '';
      }
    });
  }
});

// Image selection captcha
function selectImage(element) {
  if (!element) return;
  
  element.classList.toggle('selected');
  
  // Check if all cats are selected and no dogs
  const selectedCats = document.querySelectorAll('.box[data-type="cat"].selected');
  const selectedDogs = document.querySelectorAll('.box[data-type="dog"].selected');
  
  const result = document.getElementById('imageCaptchaResult');
  if (!result) return;
  
  if (selectedCats.length === 2 && selectedDogs.length === 0) {
    result.textContent = '✓ Correct!';
    result.style.color = 'green';
  } else {
    result.textContent = '';
  }
}

// Slider verification
function updateSliderValue(value) {
  const sliderValue = document.getElementById('sliderValue');
  if (sliderValue) {
    sliderValue.textContent = value + '%';
  }
}

// Word matching verification
function checkWordMatch(value) {
  const captchaWord = document.getElementById('captchaWord');
  const result = document.getElementById('wordCheckResult');
  
  if (!captchaWord || !result || !value) return;
  
  const targetWord = captchaWord.textContent;
  
  if (value === targetWord) {
    result.textContent = '✓ Correct!';
    result.style.color = 'green';
  } else {
    result.textContent = '';
  }
}

// Drawing captcha
function initializeDrawingCaptcha() {
  const canvas = document.getElementById('drawCaptcha');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let pathPoints = [];
  
  // Draw start and end indicators
  ctx.fillStyle = 'green';
  ctx.fillRect(10, 50, 10, 10);
  ctx.fillStyle = 'red';
  ctx.fillRect(canvas.width - 20, 50, 10, 10);
  
  // Add text instructions
  ctx.fillStyle = 'black';
  ctx.font = '12px Arial';
  ctx.fillText('Start', 5, 40);
  ctx.fillText('End', canvas.width - 30, 40);
  
  // Remove any existing event listeners to prevent duplicates
  canvas.removeEventListener('mousedown', canvasMouseDown);
  canvas.removeEventListener('mousemove', canvasMouseMove);
  canvas.removeEventListener('mouseup', canvasMouseUp);
  canvas.removeEventListener('mouseout', canvasMouseOut);
  
  // Define event handler functions with proper closure
  function canvasMouseDown(e) {
    isDrawing = true;
    lastX = e.offsetX;
    lastY = e.offsetY;
    pathPoints = [[lastX, lastY]];
  }
  
  function canvasMouseMove(e) {
    if (!isDrawing) return;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    
    pathPoints.push([e.offsetX, e.offsetY]);
    lastX = e.offsetX;
    lastY = e.offsetY;
  }
  
  function canvasMouseUp() {
    isDrawing = false;
    
    // Check if path goes from left to right
    if (pathPoints.length > 0) {
      const startX = pathPoints[0][0];
      const endX = pathPoints[pathPoints.length - 1][0];
      
      if (startX < 30 && endX > canvas.width - 30) {
        canvas.style.borderColor = 'green';
      }
    }
  }
  
  function canvasMouseOut() {
    isDrawing = false;
  }
  
  // Add the event listeners with named functions
  canvas.addEventListener('mousedown', canvasMouseDown);
  canvas.addEventListener('mousemove', canvasMouseMove);
  canvas.addEventListener('mouseup', canvasMouseUp);
  canvas.addEventListener('mouseout', canvasMouseOut);
}

// Reset drawing captcha
function resetDrawing() {
  initializeDrawingCaptcha();
}

// Form submission handling
function submitForm(event) {
  if (event) {
    event.preventDefault();
  }
  
  // Validate math captcha
  const mathCaptcha = document.getElementById('mathCaptcha');
  const captchaAnswer = document.getElementById('captchaAnswer');
  const mathCaptchaResult = document.getElementById('mathCaptchaResult');
  
  if (!mathCaptcha || !captchaAnswer || !mathCaptchaResult) {
    alert('Form elements not found.');
    return;
  }
  
  const correctAnswer = mathCaptcha.dataset.answer;
  
  if (captchaAnswer.value !== correctAnswer) {
    mathCaptchaResult.textContent = '✗ Incorrect. Please try again.';
    mathCaptchaResult.style.color = 'red';
    return;
  }
  
  // Validate checkbox captcha
  const notRobot = document.getElementById('notRobot');
  if (!notRobot || !notRobot.checked) {
    alert('Please verify that you are not a robot.');
    return;
  }
  
  // Validate image captcha
  const selectedCats = document.querySelectorAll('.box[data-type="cat"].selected');
  const selectedDogs = document.querySelectorAll('.box[data-type="dog"].selected');
  const imageCaptchaResult = document.getElementById('imageCaptchaResult');
  
  if (!imageCaptchaResult) {
    alert('Image captcha result element not found.');
    return;
  }
  
  if (selectedCats.length !== 2 || selectedDogs.length !== 0) {
    imageCaptchaResult.textContent = '✗ Please select all cats and only cats.';
    imageCaptchaResult.style.color = 'red';
    return;
  }
  
  // Validate slider
  const slider = document.getElementById('slider');
  if (!slider || parseInt(slider.value) < 100) {
    alert('Please slide the verification slider all the way to the right.');
    return;
  }
  
  // Validate word match
  const captchaWord = document.getElementById('captchaWord');
  const wordCheck = document.getElementById('wordCheck');
  const wordCheckResult = document.getElementById('wordCheckResult');
  
  if (!captchaWord || !wordCheck || !wordCheckResult) {
    alert('Word check elements not found.');
    return;
  }
  
  const targetWord = captchaWord.textContent;
  
  if (wordCheck.value !== targetWord) {
    wordCheckResult.textContent = '✗ Words do not match.';
    wordCheckResult.style.color = 'red';
    return;
  }
  
  // Check if canvas border is green (meaning drawing captcha passed)
  const canvas = document.getElementById('drawCaptcha');
  if (!canvas || canvas.style.borderColor !== 'green') {
    alert('Please complete the drawing captcha correctly.');
    return;
  }
  
  // Show loading
  const submitButton = document.getElementById('submitButton');
  const formLoader = document.getElementById('formLoader');
  const formStatus = document.getElementById('formStatus');
  
  if (!submitButton || !formLoader || !formStatus) {
    alert('Form submission elements not found.');
    return;
  }
  
  submitButton.disabled = true;
  formLoader.style.display = 'inline-block';
  formStatus.textContent = 'Submitting your message...';
  
  // Simulate form submission
  setTimeout(() => {
    formLoader.style.display = 'none';
    formStatus.textContent = 'Message sent successfully!';
    formStatus.style.color = 'green';
    
    // Reset the form after some time
    setTimeout(() => {
      const contactForm = document.getElementById('contactForm');
      if (contactForm) contactForm.reset();
      closeContactModal();
      submitButton.disabled = false;
      formStatus.textContent = '';
    }, 2000);
  }, 3000);
}

// Course enrollment handling
function enrollCourse(courseId) {
  if (!courseId) return;
  
  // Show enrollment modal
  const enrollmentModal = document.getElementById('enrollmentModal');
  const courseName = document.getElementById('courseName');
  const enrollCaptcha = document.getElementById('enrollCaptcha');
  
  if (!enrollmentModal || !courseName || !enrollCaptcha) {
    alert('Enrollment elements not found.');
    return;
  }
  
  // Set course name based on ID
  switch (courseId) {
    case 'web-dev':
      courseName.textContent = 'Full Stack Web Development';
      break;
    case 'data-science':
      courseName.textContent = 'Data Science with Python';
      break;
    case 'ui-ux':
      courseName.textContent = 'UI/UX Design Essentials';
      break;
    default:
      courseName.textContent = 'Course';
  }
  
  // Generate random math problem for enrollment captcha
  const num1 = Math.floor(Math.random() * 15);
  const num2 = Math.floor(Math.random() * 15);
  enrollCaptcha.textContent = `${num1} + ${num2}`;
  enrollCaptcha.dataset.answer = (num1 + num2).toString();
  
  // Store course ID for processing
  enrollmentModal.dataset.courseId = courseId;
  
  // Show modal
  enrollmentModal.style.display = 'block';
}

// Process enrollment after captcha verification
function processEnrollment() {
  const enrollmentModal = document.getElementById('enrollmentModal');
  const enrollCaptcha = document.getElementById('enrollCaptcha');
  const enrollCaptchaAnswer = document.getElementById('enrollCaptchaAnswer');
  const enrollmentProcessLoader = document.getElementById('enrollmentProcessLoader');
  
  if (!enrollmentModal || !enrollCaptcha || !enrollCaptchaAnswer || !enrollmentProcessLoader) {
    alert('Enrollment elements not found.');
    return;
  }
  
  const courseId = enrollmentModal.dataset.courseId;
  const captchaAnswer = enrollCaptchaAnswer.value;
  const correctAnswer = enrollCaptcha.dataset.answer;
  
  if (!courseId) {
    alert('Course ID not found.');
    return;
  }
  
  if (captchaAnswer !== correctAnswer) {
    alert('Incorrect captcha answer. Please try again.');
    return;
  }
  
  // Show enrollment loading animation
  enrollmentProcessLoader.style.display = 'inline-block';
  
  // Hide enrollment modal and show course-specific loader
  setTimeout(() => {
    enrollmentModal.style.display = 'none';
    enrollmentProcessLoader.style.display = 'none';
    
    // Show loader for the specific course
    const courseLoader = document.getElementById(`loader-${courseId}`);
    if (!courseLoader) {
      alert(`Loader for course ${courseId} not found.`);
      return;
    }
    
    courseLoader.style.display = 'block';
    
    // Complete enrollment after some time
    setTimeout(() => {
      courseLoader.style.display = 'none';
      
      // Find button for this course and update it
      const courseButtons = document.querySelectorAll('.course-card button');
      let buttonFound = false;
      
      courseButtons.forEach(button => {
        if (button.getAttribute('onclick') && button.getAttribute('onclick').includes(courseId)) {
          button.textContent = 'Enrolled ✓';
          button.style.backgroundColor = '#28a745';
          button.disabled = true;
          buttonFound = true;
        }
      });
      
      if (!buttonFound) {
        alert(`Button for course ${courseId} not found.`);
        return;
      }
      
      // Show success message
      const courseName = document.getElementById('courseName');
      alert(`Successfully enrolled in ${courseName ? courseName.textContent : 'the course'}!`);
    }, 3000);
  }, 2000);
}

// Countdown timer simulation
function updateCountdown() {
  const countdownElement = document.getElementById('countdown');
  if (!countdownElement) return;
  
  const timeparts = countdownElement.textContent.split(':');
  if (timeparts.length !== 3) {
    countdownElement.textContent = '10:00:00'; // Reset to default if format is wrong
    return;
  }
  
  let [hours, minutes, seconds] = timeparts.map(Number);
  
  // Handle NaN values
  if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
    countdownElement.textContent = '10:00:00'; // Reset to default if values are not numbers
    return;
  }
  
  seconds--;
  if (seconds < 0) {
    seconds = 59;
    minutes--;
    if (minutes < 0) {
      minutes = 59;
      hours--;
      if (hours < 0) {
        // Reset to a new countdown when it ends
        hours = 10;
        minutes = 0;
        seconds = 0;
      }
    }
  }
  
  // Format with leading zeros
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');
  const formattedSeconds = seconds.toString().padStart(2, '0');
  
  countdownElement.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

// Start countdown timer when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const countdownElement = document.getElementById('countdown');
  if (countdownElement) {
    // Initialize timer
    setInterval(updateCountdown, 1000);
  }
});

// Close the modal if clicked outside
window.onclick = function(event) {
  const contactModal = document.getElementById('contactModal');
  const enrollmentModal = document.getElementById('enrollmentModal');
  
  if (contactModal && event.target === contactModal) {
    contactModal.style.display = 'none';
  } else if (enrollmentModal && event.target === enrollmentModal) {
    enrollmentModal.style.display = 'none';
  }
};

// Add animation to buttons on hover - moved inside DOMContentLoaded to ensure elements exist
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
      button.style.animation = 'pulse 1s infinite';
    });
    
    button.addEventListener('mouseleave', () => {
      button.style.animation = '';
    });
  });
});