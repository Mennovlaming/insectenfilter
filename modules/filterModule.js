// filterModule.js
import { filter } from 'd3-array';
import { createLineChart, createBarChart } from './chartModule.js';

let dataset = [];
let monthCounts = [];

export function filterData() {
  const selectedProvincie = document.getElementById("provincieDropdown").value;
  const selectedLocatie = document.getElementById("locatieDropdown").value;
  const selectedLandschap = document.getElementById("landschapDropdown").value;

  const provincieCheckbox = document.getElementById("provincieCheckbox");
  const locatieCheckbox = document.getElementById("locatieCheckbox");
  const landschapCheckbox = document.getElementById("landschapCheckbox");

  // Disable dropdowns based on checkbox status
  document.getElementById("provincieDropdown").disabled = !provincieCheckbox.checked;
  document.getElementById("locatieDropdown").disabled = !locatieCheckbox.checked;
  document.getElementById("landschapDropdown").disabled = !landschapCheckbox.checked;

  // Update styling based on checkbox status
  updateDropdownStyle("provincieDropdown", provincieCheckbox.checked);
  updateDropdownStyle("locatieDropdown", locatieCheckbox.checked);
  updateDropdownStyle("landschapDropdown", landschapCheckbox.checked);

  console.log('Selected Province:', selectedProvincie);
  console.log('Selected Locatie:', selectedLocatie);
  console.log('Selected Landschap:', selectedLandschap);

  // Filter the dataset based on selected values and checkbox status
  const filteredData = dataset.filter(entry => {
    const provincieMatch = !provincieCheckbox.checked || selectedProvincie === '' || entry.region === selectedProvincie;
    const locatieMatch = !locatieCheckbox.checked || selectedLocatie === '' || entry.location === selectedLocatie;
    const landschapMatch = !landschapCheckbox.checked || selectedLandschap === '' || entry.type === selectedLandschap;

    return provincieMatch && locatieMatch && landschapMatch;
  });

  console.log('Filtered Data:', filteredData);

  // Initialize monthCounts with zero values for all months
  const monthCounts = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));

  // Update monthCounts with counts from the filtered data
  filteredData.forEach(entry => {
    const month = entry.month;
    monthCounts[month - 1].count += 1;
  });


  
  console.log('Month Counts:', monthCounts);

  // Call the function to create the line chart

  createLineChart(monthCounts);

  const familiesToDisplay = isFilterActive() ? getAllFamilies(filteredData) : getAllFamilies(dataset);
  updateFilteredFamilies(familiesToDisplay);
  
}

export function initFilter() {
  // Return a promise to signal when the data is ready
  return new Promise((resolve, reject) => {
    fetch('/data/data21.json')
      .then(response => response.json())
      .then(data => {
        dataset = data;
        console.log('Data fetched:', dataset);

        // Extract unique provinces from the dataset
        const uniqueProvinces = [...new Set(dataset.map(entry => entry.region))];

        // Populate the provincieDropdown with the unique provinces
        const provincieDropdown = document.getElementById("provincieDropdown");
        provincieDropdown.innerHTML = "<option value=''>Selecteer</option>";
        uniqueProvinces.forEach(province => {
          provincieDropdown.innerHTML += `<option value='${province}'>${province}</option>`;
        });

        // Extract unique landschap types from the dataset
        const uniqueLandschapTypes = [...new Set(dataset.map(entry => entry.type))];

        // Populate the landschapDropdown with the unique landschap types
        const landschapDropdown = document.getElementById("landschapDropdown");
        landschapDropdown.innerHTML = "<option value=''>Selecteer</option>";
        uniqueLandschapTypes.forEach(landschap => {
          landschapDropdown.innerHTML += `<option value='${landschap}'>${landschap}</option>`;
        });

        // Extract unique locations from the dataset
        const uniqueLocations = [...new Set(dataset.map(entry => entry.location))];

        // Populate the locatieDropdown with the unique locations
        const locatieDropdown = document.getElementById("locatieDropdown");
        locatieDropdown.innerHTML = "<option value=''>Selecteer</option>";
        uniqueLocations.forEach(location => {
          locatieDropdown.innerHTML += `<option value='${location}'>${location}</option>`;
        });

        // Initialize monthCounts with zero values for all months
        const monthCounts = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));

        // Update monthCounts with counts from the entire dataset
        dataset.forEach(entry => {
          const month = entry.month;
          monthCounts[month - 1].count += 1;
        });

        // Call createLineChart with the entire dataset
        
        createLineChart(monthCounts);

        filterData();

        resolve(); // Resolve the promise once data is fetched, dropdowns are populated, and chart is initialized
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        reject(error); // Reject the promise if there's an error
      });
  });
}

export function setupFilterButton() {
  // Add event listeners to the filterButton and checkboxes
  document.getElementById('filterButton').addEventListener('click', filterData);
  document.getElementById('provincieCheckbox').addEventListener('change', filterData);
  document.getElementById('locatieCheckbox').addEventListener('change', filterData);
  document.getElementById('landschapCheckbox').addEventListener('change', filterData);
}

export function getMonthCounts() {
  // Return the monthCounts array
  return monthCounts || [];
}

// Function to update dropdown styling based on checkbox status
function updateDropdownStyle(dropdownId, isEnabled) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.style.opacity = isEnabled ? "1" : "0.5";
  dropdown.disabled = !isEnabled;
}

export function updateDropdownOptions(selectedDropdown, selectedValue) {
  const dropdowns = ['provincieDropdown', 'locatieDropdown', 'landschapDropdown'];
  const selectedDropdownIndex = dropdowns.indexOf(selectedDropdown);

  // Check if "Selecteer" option is selected
  if (selectedValue === '') {
    // Reset all dropdowns
    for (let i = 0; i < dropdowns.length; i++) {
      const dropdown = document.getElementById(dropdowns[i]);
      dropdown.innerHTML = "<option value=''>Selecteer</option>";
    }

    // Call filterData after resetting dropdowns
    filterData();
    return; // Exit the function to prevent further processing
  }

  // Clear options in dependent dropdowns
  for (let i = selectedDropdownIndex + 1; i < dropdowns.length; i++) {
    const dropdown = document.getElementById(dropdowns[i]);
    dropdown.innerHTML = "<option value=''>Selecteer</option>";
  }

  // Update options based on selected value
  const filteredData = dataset.filter(entry => entry.region === selectedValue);

  // Update locatie dropdown
  if (selectedDropdownIndex + 1 < dropdowns.length) {
    const locatieDropdown = document.getElementById(dropdowns[selectedDropdownIndex + 1]);
    locatieDropdown.innerHTML = "<option value=''>Selecteer</option>";

    // Extract unique locatienames from the filtered dataset
    const uniqueLocations = [...new Set(filteredData.map(entry => entry.location))];

    uniqueLocations.forEach(location => {
      locatieDropdown.innerHTML += `<option value='${location}'>${location}</option>`;
    });
  }

  // Update landschap dropdown
  if (selectedDropdownIndex + 2 < dropdowns.length) {
    const landschapDropdown = document.getElementById(dropdowns[selectedDropdownIndex + 2]);
    landschapDropdown.innerHTML = "<option value=''>Selecteer</option>";

    // Extract unique landstypes from the filtered dataset
    const uniqueLandTypes = [...new Set(filteredData.map(entry => entry.type))];

    uniqueLandTypes.forEach(landType => {
      landschapDropdown.innerHTML += `<option value='${landType}'>${landType}</option>`;
    });
  }

  // Call filterData after updating dropdown options
  filterData();
}

function getAllFamilies(data) {
  console.log('Data received in getAllFamilies:', data);

  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data);
    return [];
  }

  const allFamilies = data.map(entry => entry.family);
  return allFamilies;
}

export async function updateFilteredFamilies(families) {
  const filteredFamiliesList = document.getElementById('filteredFamiliesList');
  filteredFamiliesList.innerHTML = ""; // Clear previous content

  const frequencyMap = {};
  families.forEach(family => {
    frequencyMap[family] = (frequencyMap[family] || 0) + 1;
  });

  const familyCounts = Object.entries(frequencyMap).map(([family, count]) => ({ family, count }));

  families.sort((a, b) => frequencyMap[b] - frequencyMap[a] || a.localeCompare(b));

  families.forEach(family => {
    const listItem = document.createElement('li');
    listItem.textContent = family;
    filteredFamiliesList.appendChild(listItem);
  });

  // Roep createBarChart aan met de tellingen van de families
  createBarChart(familyCounts);
}


function isFilterActive() {
  const provincieCheckbox = document.getElementById("provincieCheckbox");
  const locatieCheckbox = document.getElementById("locatieCheckbox");
  const landschapCheckbox = document.getElementById("landschapCheckbox");

  return provincieCheckbox.checked || locatieCheckbox.checked || landschapCheckbox.checked;
}




