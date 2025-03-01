document.addEventListener('DOMContentLoaded', function() {
    // --- Pre-populate Booking Form from Query Parameters ---
    const urlParams = new URLSearchParams(window.location.search);
    const locationParam = urlParams.get('location');
    const startDateParam = urlParams.get('start');
    const endDateParam = urlParams.get('end');
    const travelersParam = urlParams.get('travelers');
  
    if (locationParam) {
      const destinationField = document.getElementById('destination');
      if (destinationField) {
        destinationField.value = locationParam;
      }
    }
    if (startDateParam) {
      const startField = document.getElementById('start-date');
      if (startField) {
        startField.value = startDateParam;
      }
    }
    if (endDateParam) {
      const endField = document.getElementById('end-date');
      if (endField) {
        endField.value = endDateParam;
      }
    }
    if (travelersParam) {
      const travelersField = document.getElementById('travelers');
      if (travelersField) {
        travelersField.value = travelersParam;
      }
    }
  
    // --- Manual "Places to Explore" Addition ---
    const addPlaceBtn = document.getElementById('add-place-btn');
    const exploreInput = document.getElementById('explore-place');
    const placesList = document.getElementById('places-list');
    const hiddenPlaces = document.getElementById('places-to-explore');
    let manualPlaces = [];
  
    addPlaceBtn.addEventListener('click', function() {
      const place = exploreInput.value.trim();
      if (place !== "") {
        manualPlaces.push(place);
        hiddenPlaces.value = manualPlaces.join(',');
        const li = document.createElement('li');
        li.textContent = place;
        placesList.appendChild(li);
        exploreInput.value = "";
      }
    });
  
    // --- Flight Cost Handling ---
    const flightCard = document.querySelector('.flight-card');
    const flightRadios = document.getElementsByName('flight-type');
    flightRadios.forEach(function(radio) {
      radio.addEventListener('change', recalcBudget);
    });
  
    // --- Lodging Options Handling ---
    const lodgingRadios = document.getElementsByName('lodging');
    lodgingRadios.forEach(function(radio) {
      radio.addEventListener('change', recalcBudget);
    });
  
    // --- Rental Car Options Handling ---
    const rentalCarRadios = document.getElementsByName('rental-car');
    rentalCarRadios.forEach(function(radio) {
      radio.addEventListener('change', recalcBudget);
    });
  
    // --- Explore Cards Selection (Toggle via click) ---
    const exploreCards = document.querySelectorAll('.explore-card');
    exploreCards.forEach(function(card) {
      card.addEventListener('click', function() {
        // Toggle the "selected" class on the card
        card.classList.toggle('selected');
        recalcBudget();
      });
    });
  
    // --- Final Budget Calculation ---
    function recalcBudget() {
      let total = 0;
  
      // Calculate flight cost based on selected option
      const selectedFlight = document.querySelector('input[name="flight-type"]:checked').value;
      if (selectedFlight === 'single') {
        total += parseInt(flightCard.dataset.costSingle);
      } else if (selectedFlight === 'round') {
        total += parseInt(flightCard.dataset.costRound);
      }
  
      // Sum cost for each selected explore card
      exploreCards.forEach(function(card) {
        if (card.classList.contains('selected')) {
          total += parseInt(card.dataset.cost);
        }
      });
  
      // Add lodging cost if an option is selected
      const selectedLodging = document.querySelector('input[name="lodging"]:checked');
      if (selectedLodging) {
        const lodgingCard = selectedLodging.closest('.option-card');
        if (lodgingCard) {
          total += parseInt(lodgingCard.dataset.cost);
        }
      }
  
      // Add rental car cost if an option is selected
      const selectedRental = document.querySelector('input[name="rental-car"]:checked');
      if (selectedRental) {
        const rentalCard = selectedRental.closest('.option-card');
        if (rentalCard) {
          total += parseInt(rentalCard.dataset.cost);
        }
      }
  
      // Add an extra fee (e.g., service fee)
      const extraFee = 5000;
      total += extraFee;
  
      // Update final estimated budget display and hidden field
      document.getElementById('estimate-value').textContent = total;
      document.getElementById('final-budget').value = total;
    }
  
    // Initialize budget calculation on page load
    recalcBudget();
  });
  