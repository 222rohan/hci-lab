// DOM Elements
const currentDateElement = document.getElementById('current-date');
const progressBarElement = document.getElementById('progress-bar');
const progressPercentageElement = document.getElementById('progress-percentage');
const progressSummaryElement = document.getElementById('progress-summary');
const newHabitInput = document.getElementById('new-habit-input');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitsListElement = document.getElementById('habits-list');
const prevDayBtn = document.getElementById('prev-day');
const nextDayBtn = document.getElementById('next-day');
const habitTemplate = document.getElementById('habit-template');

// State
let habits = [];
let currentDate = new Date();

// Format date as YYYY-MM-DD (for storage)
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Format date for display
function formatDisplayDate(date) {
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
}

// Initialize
function init() {
    loadHabits();
    updateDateDisplay();
    renderHabits();
    updateProgress();
    
    // Event listeners
    addHabitBtn.addEventListener('click', addHabit);
    newHabitInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addHabit();
    });
    prevDayBtn.addEventListener('click', () => changeDate(-1));
    nextDayBtn.addEventListener('click', () => changeDate(1));
}

// Load habits from localStorage
function loadHabits() {
    const savedHabits = localStorage.getItem('habits');
    habits = savedHabits ? JSON.parse(savedHabits) : [];
}

// Save habits to localStorage
function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Update date display
function updateDateDisplay() {
    currentDateElement.textContent = formatDisplayDate(currentDate);
}

// Change current date
function changeDate(direction) {
    currentDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + direction);
    updateDateDisplay();
    renderHabits();
    updateProgress();
}

// Add new habit
function addHabit() {
    const habitName = newHabitInput.value.trim();
    if (habitName === '') return;
    
    const newHabit = {
        id: Date.now(),
        name: habitName,
        completedDates: {}
    };
    
    habits.push(newHabit);
    saveHabits();
    newHabitInput.value = '';
    renderHabits();
    updateProgress();
}

// Delete habit
function deleteHabit(id) {
    habits = habits.filter(habit => habit.id !== id);
    saveHabits();
    renderHabits();
    updateProgress();
}

// Toggle habit completion status
function toggleCompletion(habit) {
    const formattedDate = formatDate(currentDate);
    
    if (habit.completedDates[formattedDate]) {
        delete habit.completedDates[formattedDate];
    } else {
        habit.completedDates[formattedDate] = true;
    }
    
    saveHabits();
    renderHabits();
    updateProgress();
}

// Update progress bar and summary
function updateProgress() {
    const formattedDate = formatDate(currentDate);
    const completedCount = habits.filter(habit => habit.completedDates[formattedDate]).length;
    const totalHabits = habits.length;
    const progress = totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0;
    
    // Update progress bar
    progressBarElement.style.width = `${progress}%`;
    
    // Update color based on progress
    if (progress < 30) {
        progressBarElement.style.backgroundColor = '#f87171'; // Red
    } else if (progress < 70) {
        progressBarElement.style.backgroundColor = '#facc15'; // Yellow
    } else {
        progressBarElement.style.backgroundColor = '#4ade80'; // Green
    }
    
    // Update text
    progressPercentageElement.textContent = `${progress}%`;
    progressSummaryElement.textContent = `${completedCount} of ${totalHabits} habits completed today`;
}

// Render habits list
function renderHabits() {
    // Clear list
    habitsListElement.innerHTML = '';
    
    const formattedDate = formatDate(currentDate);
    
    if (habits.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No habits added yet. Add your first habit above!';
        habitsListElement.appendChild(emptyState);
        return;
    }
    
    // Add each habit
    habits.forEach(habit => {
        const habitElement = habitTemplate.content.cloneNode(true);
        const habitItemElement = habitElement.querySelector('.habit-item');
        const habitNameElement = habitElement.querySelector('.habit-name');
        const toggleBtn = habitElement.querySelector('.toggle-btn');
        const deleteBtn = habitElement.querySelector('.delete-btn');
        
        // Set habit name
        habitNameElement.textContent = habit.name;
        
        // Check if completed
        const isCompleted = habit.completedDates[formattedDate];
        if (isCompleted) {
            toggleBtn.classList.add('completed');
        }
        
        // Add event listeners
        toggleBtn.addEventListener('click', () => toggleCompletion(habit));
        deleteBtn.addEventListener('click', () => deleteHabit(habit.id));
        
        habitsListElement.appendChild(habitElement);
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', init);