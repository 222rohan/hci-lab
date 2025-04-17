document.addEventListener("DOMContentLoaded", () => {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        const isDarkMode = body.classList.contains('dark-theme');
        themeToggle.setAttribute('aria-label', isDarkMode ? 'Toggle light mode' : 'Toggle dark mode');
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navBar = document.querySelector('.nav-bar');

    mobileMenuToggle.addEventListener('click', () => {
        navBar.classList.toggle('active');
    });

    // Add Habit functionality
    const addHabitBtn = document.getElementById('add-habit-btn');
    const habitInput = document.getElementById('new-habit-input');
    const habitCategory = document.getElementById('habit-category');
    const habitsList = document.getElementById('habits-list');
    const habitTemplate = document.getElementById('habit-template');

    addHabitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const habitName = habitInput.value.trim();
        const category = habitCategory.value;

        if (habitName) {
            const newHabit = document.importNode(habitTemplate.content, true);
            const habitItem = newHabit.querySelector('.habit-item');
            const habitNameElement = habitItem.querySelector('.habit-name');
            const habitCategoryBadge = habitItem.querySelector('.habit-category-badge');
            habitNameElement.textContent = habitName;
            habitCategoryBadge.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            habitCategoryBadge.classList.add(category);

            // Handle completion toggle
            const toggleBtn = habitItem.querySelector('.toggle-btn');
            toggleBtn.addEventListener('click', () => {
                habitItem.classList.toggle('completed');
            });

            // Handle delete habit
            const deleteBtn = habitItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                habitItem.remove();
            });

            // Handle edit habit
            const editBtn = habitItem.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => {
                habitInput.value = habitName;
                habitCategory.value = category;
                habitItem.remove();
            });

            habitsList.appendChild(habitItem);
            habitInput.value = ''; // Clear input
        }
    });

    // Habit Search
    const searchInput = document.getElementById('search');
    const searchResults = document.getElementById('search-results');
    const resultsList = searchResults.querySelector('.results-list');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const habitItems = Array.from(habitsList.children);
        resultsList.innerHTML = ''; // Clear previous search results

        if (query) {
            habitItems.forEach((item) => {
                const habitName = item.querySelector('.habit-name').textContent.toLowerCase();
                if (habitName.includes(query)) {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('search-result');
                    resultItem.textContent = item.querySelector('.habit-name').textContent;
                    resultsList.appendChild(resultItem);
                }
            });

            searchResults.hidden = resultsList.children.length === 0;
        } else {
            searchResults.hidden = true;
        }
    });

    const clearSearchBtn = document.getElementById('clear-search');
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchResults.hidden = true;
    });

    // Notification system
    const notificationContainer = document.getElementById('notification-container');

    function showNotification(message) {
        const notificationTemplate = document.getElementById('notification-template');
        const notification = document.importNode(notificationTemplate.content, true);
        const notificationMessage = notification.querySelector('.notification-message');
        notificationMessage.textContent = message;

        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notificationContainer.removeChild(notification);
        });

        notificationContainer.appendChild(notification);
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 5000);
    }

    // Simulate showing a notification after adding a habit
    setTimeout(() => {
        showNotification('New habit added successfully!');
    }, 2000);

    // Progress Bar
    const progressBar = document.getElementById('progress-bar');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressSummary = document.getElementById('progress-summary');

    // Simulate daily progress (e.g., 2 out of 5 habits completed)
    let completedHabits = 2;
    let totalHabits = 5;
    let progress = (completedHabits / totalHabits) * 100;

    progressBar.style.width = `${progress}%`;
    progressPercentage.textContent = `${progress}%`;
    progressSummary.textContent = `${completedHabits} of ${totalHabits} habits completed today`;
});
