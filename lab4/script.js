// Math CAPTCHA
let num1 = Math.floor(Math.random() * 10);
let num2 = Math.floor(Math.random() * 10);
document.getElementById("mathCaptcha").textContent = `${num1} + ${num2}`;

// Image box click
document.querySelectorAll(".box").forEach(box => {
  box.addEventListener("click", () => box.classList.toggle("selected"));
});

// Fake File Upload
function simulateUpload() {
  let progress = 0;
  const bar = document.getElementById("uploadProgress");
  const interval = setInterval(() => {
    if (progress >= 100) clearInterval(interval);
    else {
      progress += 5;
      bar.style.width = progress + "%";
    }
  }, 200);
}

function claimFreeCourse() {
  alert("🎁 You've successfully claimed your free course!");
}

// Contact Form Submission with validation
function submitForm(event) {
  event.preventDefault();

  const answer = parseInt(document.getElementById("captchaAnswer").value);
  const check = document.getElementById("notRobot").checked;
  const slider = parseInt(document.getElementById("slider").value);
  const word = document.getElementById("wordCheck").value.trim();
  const selected = document.querySelectorAll(".box.selected");

  if (answer !== num1 + num2) {
    alert("Wrong math answer!");
    return;
  }
  if (!check) {
    alert("Please confirm you're not a robot.");
    return;
  }
  if (slider < 90) {
    alert("Slide verification failed.");
    return;
  }
  if (word.toLowerCase() !== "learnhub") {
    alert("Please type the correct word.");
    return;
  }
  if (selected.length < 2) {
    alert("Select all cat images.");
    return;
  }

  document.getElementById("formLoader").hidden = false;

  setTimeout(() => {
    document.getElementById("formLoader").hidden = true;
    alert("✅ Message sent successfully!");
  }, 2000);
}

// Full-screen loader
window.onload = () => {
  const overlay = document.getElementById("overlayLoader");
  overlay.style.display = "block";
  setTimeout(() => overlay.style.display = "none", 2000);
};

// Enroll buttons loading
document.querySelectorAll(".course-card button").forEach(btn => {
  btn.addEventListener("click", () => {
    const original = btn.textContent;
    btn.textContent = "Loading...";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = "Enrolled!";
    }, 2000);
  });
});