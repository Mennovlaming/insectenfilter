// imports, css en andere modules
import './style.css';
import * as filter from './modules/filterModule.js';
import * as addFilterModule from './modules/addFilterModule.js';

// wacht tot de DOM geladen is
document.addEventListener('DOMContentLoaded', () => {
    // initFilter met fetch
    filter.initFilter().then(() => {
      filter.setupFilterButton();

      // Eventlisteners voor de dropdowns
      document.getElementById('provincieDropdown').addEventListener('change', function() {
        // update deze met info van de provincie, locatie en landschap
        filter.updateDropdownOptions('provincieDropdown', this.value);
      });
  
      document.getElementById('locatieDropdown').addEventListener('change', function() {
        filter.updateDropdownOptions('locatieDropdown', this.value);
      });
  
      document.getElementById('landschapDropdown').addEventListener('change', function() {
        filter.updateDropdownOptions('landschapDropdown', this.value);
      });
  
      // initalize filter, mogelijk voor de extra filter
      addFilterModule.initializeAddFilter();
    });
  });