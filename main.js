// main.js
import './style.css';
import * as filter from '/modules/filterModule.js';
import * as addFilterModule from '/modules/addFilterModule.js';

// Wacht op het DOMContentLoaded-evenement om ervoor te zorgen dat alle DOM-elementen gereed zijn
document.addEventListener('DOMContentLoaded', () => {
    // Initialize filter and set up event listeners after data is fetched
    filter.initFilter().then(() => {
      // Set up the event listener for the filterButton
      filter.setupFilterButton();
  
      // Add event listeners for dropdowns
      document.getElementById('provincieDropdown').addEventListener('change', function() {
        filter.updateDropdownOptions('provincieDropdown', this.value);
      });
  
      document.getElementById('locatieDropdown').addEventListener('change', function() {
        filter.updateDropdownOptions('locatieDropdown', this.value);
      });
  
      document.getElementById('landschapDropdown').addEventListener('change', function() {
        filter.updateDropdownOptions('landschapDropdown', this.value);
      });
  
      // Initialize the addFilter functionality
      addFilterModule.initializeAddFilter();
    });
  });