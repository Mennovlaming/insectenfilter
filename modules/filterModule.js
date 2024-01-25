// import de charts
import { createLineChart, createBarChart } from './chartModule.js';


let dataset = [];
let monthCounts = [];

export function filterData() {
  // haalt de waarde(value) uit de dropdowns
  const selectedProvincie = document.getElementById("provincieDropdown").value;
  const selectedLocatie = document.getElementById("locatieDropdown").value;
  const selectedLandschap = document.getElementById("landschapDropdown").value;

  //zet ook de checkboxes in een variabele
  const provincieCheckbox = document.getElementById("provincieCheckbox");
  const locatieCheckbox = document.getElementById("locatieCheckbox");
  const landschapCheckbox = document.getElementById("landschapCheckbox");

  // Disable dropdowns als ze niet gecheckt zijn (!)
  document.getElementById("provincieDropdown").disabled = !provincieCheckbox.checked;
  document.getElementById("locatieDropdown").disabled = !locatieCheckbox.checked;
  document.getElementById("landschapDropdown").disabled = !landschapCheckbox.checked;

  // Update de style als ze gechecked of niet zijn
  updateDropdownStyle("provincieDropdown", provincieCheckbox.checked);
  updateDropdownStyle("locatieDropdown", locatieCheckbox.checked);
  updateDropdownStyle("landschapDropdown", landschapCheckbox.checked);

  // filter de set op de checkboxes en status van de dropdowns
  const filteredData = dataset.filter(entry => {
    const provincieMatch = !provincieCheckbox.checked || selectedProvincie === '' || entry.region === selectedProvincie;
    const locatieMatch = !locatieCheckbox.checked || selectedLocatie === '' || entry.location === selectedLocatie;
    const landschapMatch = !landschapCheckbox.checked || selectedLandschap === '' || entry.type === selectedLandschap;

    return provincieMatch && locatieMatch && landschapMatch;
  });

  // Maak een array voor de maanden, tel op tot 12
  const monthCounts = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));

  // Update monthCounts met de gefilterde data
  filteredData.forEach(entry => {
    const month = entry.month;
    monthCounts[month - 1].count += 1;
  });

  //roep de chart functie aan met als parameter monthcounts
  createLineChart(monthCounts);

  //Hier word bepaald welke families worden getoond op basis van of het filter actief is of niet. 
  const familiesToDisplay = isFilterActive() ? getAllFamilies(filteredData) : getAllFamilies(dataset);
  updateFilteredFamilies(familiesToDisplay);
  
}

export function initFilter() { 
  // Promise, zo ja, resolve, zo nee, reject
  return new Promise((resolve, reject) => {
    //fetch de dataset
    fetch('/data21.json')
      .then(response => response.json())
      .then(data => {
        dataset = data;
        // Log de dataset
        console.log('Data fetched:', dataset);

        //Hier pak je alle unieke provincies, zodat je niet letterlijk alles krijgt.
        const uniqueProvinces = [...new Set(dataset.map(entry => entry.region))];

        // Plaats deze unieke gegevens in de  provinciedropdown, 
        // HIeronder gebeurt hetzelfde voor landschap en locatie.
        const provincieDropdown = document.getElementById("provincieDropdown");
        provincieDropdown.innerHTML = "<option value=''>Selecteer</option>";
        uniqueProvinces.forEach(province => {
          provincieDropdown.innerHTML += `<option value='${province}'>${province}</option>`;
        });

        const uniqueLandschapTypes = [...new Set(dataset.map(entry => entry.type))];

        const landschapDropdown = document.getElementById("landschapDropdown");
        landschapDropdown.innerHTML = "<option value=''>Selecteer</option>";
        uniqueLandschapTypes.forEach(landschap => {
          landschapDropdown.innerHTML += `<option value='${landschap}'>${landschap}</option>`;
        });

        const uniqueLocations = [...new Set(dataset.map(entry => entry.location))];

        const locatieDropdown = document.getElementById("locatieDropdown");
        locatieDropdown.innerHTML = "<option value=''>Selecteer</option>";
        uniqueLocations.forEach(location => {
          locatieDropdown.innerHTML += `<option value='${location}'>${location}</option>`;
        });

        // NOg een keer de tellen naar 12 functie ivm veel errors hiermee.
        const monthCounts = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, count: 0 }));
        dataset.forEach(entry => {
          const month = entry.month;
          monthCounts[month - 1].count += 1;
        });

        //Roep de linechart nog een keer
        createLineChart(monthCounts);

        // Filter de data, update de dropdowns
        filterData();

        resolve(); // Als de data gefetcht is, en de dropdowns zijn geupdate.
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        reject(error); 
      });
  });
}

export function setupFilterButton() {
  // voeg eventlisteners aan de filterButton en checkboxes
  document.getElementById('filterButton').addEventListener('click', filterData);
  document.getElementById('provincieCheckbox').addEventListener('change', filterData);
  document.getElementById('locatieCheckbox').addEventListener('change', filterData);
  document.getElementById('landschapCheckbox').addEventListener('change', filterData);
}

export function getMonthCounts() {
  //zorgt ervoor dat montcounts geexporteerd kan worden
  return monthCounts || [];
}
// update styling gebasseerd op de checkbox
function updateDropdownStyle(dropdownId, isEnabled) {
  const dropdown = document.getElementById(dropdownId);
  dropdown.style.opacity = isEnabled ? "1" : "0.5";
  dropdown.disabled = !isEnabled;
}

export function updateDropdownOptions(selectedDropdown, selectedValue) {
  const dropdowns = ['provincieDropdown', 'locatieDropdown', 'landschapDropdown'];
  const selectedDropdownIndex = dropdowns.indexOf(selectedDropdown);

  // Check if "Selecteer" option geselecteerd is, dan wil je namelijk alles laten zien.
  if (selectedValue === '') {
    // Reset alle dropdowns
    for (let i = 0; i < dropdowns.length; i++) {
      const dropdown = document.getElementById(dropdowns[i]);
      dropdown.innerHTML = "<option value=''>Selecteer</option>";
    }

    // Roep filter na het resetten van de dropdowns
    filterData();
    return; // exit/return zodat het niet verder gaat
  }

  // REset dropdowns
  for (let i = selectedDropdownIndex + 1; i < dropdowns.length; i++) {
    const dropdown = document.getElementById(dropdowns[i]);
    dropdown.innerHTML = "<option value=''>Selecteer</option>";
  }

  // Update opaties, zoals eerst uitgelegd.
  const filteredData = dataset.filter(entry => entry.region === selectedValue);


  if (selectedDropdownIndex + 1 < dropdowns.length) {
    const locatieDropdown = document.getElementById(dropdowns[selectedDropdownIndex + 1]);
    locatieDropdown.innerHTML = "<option value=''>Selecteer</option>";

    const uniqueLocations = [...new Set(filteredData.map(entry => entry.location))];

    uniqueLocations.forEach(location => {
      locatieDropdown.innerHTML += `<option value='${location}'>${location}</option>`;
    });
  }

  if (selectedDropdownIndex + 2 < dropdowns.length) {
    const landschapDropdown = document.getElementById(dropdowns[selectedDropdownIndex + 2]);
    landschapDropdown.innerHTML = "<option value=''>Selecteer</option>";

    const uniqueLandTypes = [...new Set(filteredData.map(entry => entry.type))];

    uniqueLandTypes.forEach(landType => {
      landschapDropdown.innerHTML += `<option value='${landType}'>${landType}</option>`;
    });
  }

  // filter data
  filterData();
}

function getAllFamilies(data) {

  if (!Array.isArray(data)) {
    console.error('Data is not an array:', data);
    return [];
  }

  const allFamilies = data.map(entry => entry.family);
  return allFamilies;
}

export async function updateFilteredFamilies(families) {
  // Roep createBarChart aan met de data van de families
  createBarChart(generateFamilyCounts(families));
}

function generateFamilyCounts(families) {
  const frequencyMap = {};
  families.forEach(family => {
    frequencyMap[family] = (frequencyMap[family] || 0) + 1;
  });
  //returned een object met hoeveelheid dat een bepaalde soort voorkomt.
  return Object.entries(frequencyMap).map(([family, count]) => ({ family, count }));
}


function isFilterActive() {
  //kijkt of er een filter aan staat.
  const provincieCheckbox = document.getElementById("provincieCheckbox");
  const locatieCheckbox = document.getElementById("locatieCheckbox");
  const landschapCheckbox = document.getElementById("landschapCheckbox");

  return provincieCheckbox.checked || locatieCheckbox.checked || landschapCheckbox.checked;
}




