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
  
      const hardcodedData = [
        {
          "id": 1,
          "location": "Lelystad-Boer-Kok",
          "region": "Flevoland",
          "type": "Agrarisch",
          "latitude": 52.4718,
          "longitude": 5.5103,
          "date": "27-7-2021",
          "month": "07",
          "time": "00:00:00",
          "datetime": "2021-07-27-00:00:00",
          "order": "Limoniidae",
          "family": "Steltmuggen",
          "confidence": 0.6390138814846674,
          "image": "20210727000000.jpg"
        },
        {
          "id": 2,
          "location": "Lelystad-Boer-Kok",
          "region": "Flevoland",
          "type": "Agrarisch",
          "latitude": 52.4718,
          "longitude": 5.5103,
          "date": "27-7-2021",
          "month": "07",
          "time": "00:00:00",
          "datetime": "2021-07-27-00:00:00",
          "order": "Lepidoptera",
          "family": "Vlinders",
          "confidence": 0.7703519503275553,
          "value1": 61453474760329500.0,
          "value2": 18825000133086100,
          "image": "20210727000000.jpg"
        },
        {
          "id": 3,
          "location": "Lelystad-Boer-Kok",
          "region": "Flevoland",
          "type": "Agrarisch",
          "latitude": 52.4718,
          "longitude": 5.5103,
          "date": "27-7-2021",
          "month": "07",
          "time": "00:00:00",
          "datetime": "2021-07-27-00:00:00",
          "order": "Chironomidae",
          "family": "Dansmuggen",
          "confidence": 0.9960399504863856,
          "value1": 15509737884711000.0,
          "value2": 4058924564545320,
          "image": "20210727000000.jpg"
        },
        {
          "id": 4,
          "location": "Lelystad-Vredeveld",
          "region": "Flevoland",
          "type": "Agrarisch",
          "latitude": 52.5008,
          "longitude": 5.5823,
          "date": "15-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-15-00:00:00",
          "order": "Chironomidae",
          "family": "Dansmuggen",
          "confidence": 0.9991815047604696,
          "value1": 5423550994787450.0,
          "value2": 2560279973853890,
          "image": "20210815000000.jpg"
        },
        {
          "id": 5,
          "location": "Lelystad-Vredeveld",
          "region": "Flevoland",
          "type": "Agrarisch",
          "latitude": 52.5008,
          "longitude": 5.5823,
          "date": "15-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-15-00:00:00",
          "order": "Chironomidae",
          "family": "Dansmuggen",
          "confidence": 0.9992780884106954,
          "value1": 4991952329441320.0,
          "value2": 2058602444092050,
          "image": "20210815000000.jpg"
        },
        {
          "id": 6,
          "location": "Lelystad-Vredeveld",
          "region": "Flevoland",
          "type": "Agrarisch",
          "latitude": 52.5008,
          "longitude": 5.5823,
          "date": "15-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-15-00:00:00",
          "order": "Chironomidae",
          "family": "Dansmuggen",
          "confidence": 0.9999806880950928,
          "value1": 10028064077647400.0,
          "value2": 12892057346553800,
          "image": "20210815000000.jpg"
        },
        {
          "id": 7,
          "location": "Staverden",
          "region": "Gelderland",
          "type": "Stedelijk",
          "latitude": 52.2669,
          "longitude": 5.7409,
          "date": "8-9-2021",
          "month": "09",
          "time": "00:00:00",
          "datetime": "2021-09-08-00:00:00",
          "order": "Chironomidae",
          "family": "Dansmuggen",
          "confidence": 0.9430813392003378,
          "value1": 38023520406132200.0,
          "value2": 10061410436575500,
          "image": "20210908000000.jpg"
        },
        {
          "id": 8,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Lepidoptera",
          "family": "Vlinders",
          "confidence": 0.7129467791981168,
          "value1": 3627828135757030.0,
          "value2": 3631700293344727,
          "image": "20210822000000.jpg"
        },
        {
          "id": 9,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Lepidoptera",
          "family": "Vlinders",
          "confidence": 0.7129467791981168,
          "value1": 3627828135757030.0,
          "value2": 3631700293344727,
          "image": "20210822000000.jpg"
        },
        {
          "id": 10,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Lepidoptera",
          "family": "Vlinders",
          "confidence": 0.7882368916814978,
          "value1": 9527171435260570.0,
          "value2": 7399775349055430,
          "image": "20210822000000.jpg"
        },
        {
          "id": 11,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Lepidoptera",
          "family": "Vlinders",
          "confidence": 0.7882368916814978,
          "value1": 9527171435260570.0,
          "value2": 7399775349055430,
          "image": "20210822000000.jpg"
        },
        {
          "id": 12,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Caenidae",
          "family": "Caenidae",
          "confidence": 0.7901396155357361,
          "value1": 40293312672358000.0,
          "value2": 11718822497199300,
          "image": "20210822000000.jpg"
        },
        {
          "id": 13,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Caenidae",
          "family": "Caenidae",
          "confidence": 0.7901396155357361,
          "value1": 40293312672358000.0,
          "value2": 11718822497199300,
          "image": "20210822000000.jpg"
        },
        {
          "id": 14,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Lepidoptera",
          "family": "Vlinders",
          "confidence": 0.8030581350127856,
          "value1": 48699091374111500.0,
          "value2": 9106114536631328,
          "image": "20210822000000.jpg"
        },
        {
          "id": 15,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Lepidoptera",
          "family": "Vlinders",
          "confidence": 0.8030581350127856,
          "value1": 48699091374111500.0,
          "value2": 9106114536631328,
          "image": "20210822000000.jpg"
        },
        {
          "id": 16,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Chironomidae",
          "family": "Dansmuggen",
          "confidence": 0.9969009094768101,
          "value1": 5057343193713920.0,
          "value2": 21302826744040800,
          "image": "20210822000000.jpg"
        },
        {
          "id": 17,
          "location": "Korenburgerveen",
          "region": "Gelderland",
          "type": "Landelijk",
          "latitude": 51.9886,
          "longitude": 6.6629,
          "date": "22-8-2021",
          "month": "08",
          "time": "00:00:00",
          "datetime": "2021-08-22-00:00:00",
          "order": "Chironomidae",
          "family": "Dansmuggen",
          "confidence": 0.9969009094768101,
          "value1": 5057343193713920.0,
          "value2": 21302826744040800,
          "image": "20210822000000.jpg"
        },
        {
          "id": 18,
          "location": "Broek-in-Waterland",
          "region": "Noord-Holland",
          "type": "Stedelijk",
          "latitude": 52.4239,
          "longitude": 5.0196,
          "date": "5-9-2021",
          "month": "09",
          "time": "00:00:00",
          "datetime": "2021-09-05-00:00:00",
          "order": "Chironomidae",
          "family": "Dansmuggen",
          "confidence": 0.9943640232086182,
          "value1": 4345471287287620.0,
          "value2": 14294147571116800,
          "image": "20210905000000.jpg"
        },
        {
            "id": 19,
            "location": "Engewormer",
            "region": "Noord-Holland",
            "type": "Stedelijk",
            "latitude": 52.4819,
            "longitude": 4.8237,
            "date": "21-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-21-00:00:00",
            "order": "Lepidoptera",
            "family": "Vlinders",
            "confidence": 0.3092068944658552,
            "value1": 9298755356383550.00,
            "value2": 6859860483244340,
            "image": "20210821000000.jpg"
          },
          {
            "id": 20,
            "location": "Engewormer",
            "region": "Noord-Holland",
            "type": "Agrarisch",
            "latitude": 52.4819,
            "longitude": 4.8237,
            "date": "21-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-21-00:00:00",
            "order": "Auchenorrhyncha indet.",
            "family": "Cicaden",
            "confidence": 0.6515552401542664,
            "value1": 435863827750942.00,
            "value2": 14408339519353400,
            "image": "20210821000000.jpg"
          },
          {
            "id": 21,
            "location": "Engewormer",
            "region": "Noord-Holland",
            "type": "Agrarisch",
            "latitude": 52.4819,
            "longitude": 4.8237,
            "date": "21-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-21-00:00:00",
            "order": "Leptoceridae",
            "family": "Leptoceridae",
            "confidence": 0.8257010281085968,
            "value1": 636587228596966.00,
            "value2": 3901823212441520,
            "image": "20210821000000.jpg"
          },
          {
            "id": 22,
            "location": "Engewormer",
            "region": "Noord-Holland",
            "type": "Agrarisch",
            "latitude": 52.4819,
            "longitude": 4.8237,
            "date": "21-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-21-00:00:00",
            "order": "Caenidae",
            "family": "Caenidae",
            "confidence": 0.9998412330945332,
            "value1": 55429914278310300.00,
            "value2": 27112434699995320,
            "image": "20210821000000.jpg"
          },
          {
            "id": 23,
            "location": "Saeftinge",
            "region": "Zeeland",
            "type": "Landelijk",
            "latitude": 51.3601,
            "longitude": 4.2185,
            "date": "16-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-16-00:00:00",
            "order": "Chironomidae",
            "family": "Dansmuggen",
            "confidence": 0.9924506225756236,
            "value1": 4752549722931740.00,
            "value2": 18089992841669500,
            "image": "20210816000000.jpg"
          },
          {
            "id": 24,
            "location": "Leiden-tuin",
            "region": "Zuid-Holland",
            "type": "Stedelijk",
            "latitude": 52.1808,
            "longitude": 4.5093,
            "date": "25-9-2021",
            "month": "09",
            "time": "00:00:00",
            "datetime": "2021-09-25-00:00:00",
            "order": "Chironomidae",
            "family": "Dansmuggen",
            "confidence": 0.9999128580093384,
            "value1": 5115255479381910.00,
            "value2": 21950394536338000,
            "image": "20210925000000.jpg"
          },
          {
            "id": 25,
            "location": "Lelystad-Heerenveen",
            "region": "Flevoland",
            "type": "Agrarisch",
            "latitude": 52.5283,
            "longitude": 5.6211,
            "date": "10-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-10-00:00:00",
            "order": "Chironomidae",
            "family": "Dansmuggen",
            "confidence": 0.999491812295087,
            "value1": 18113680914625300.00,
            "value2": 69751890775040000,
            "image": "20210810000000.jpg"
          },
          {
            "id": 26,
            "location": "Leiden-tuin",
            "region": "Zuid-Holland",
            "type": "Stedelijk",
            "latitude": 52.1808,
            "longitude": 4.5093,
            "date": "27-9-2021",
            "month": "09",
            "time": "00:00:00",
            "datetime": "2021-09-27-00:00:00",
            "order": "Chironomidae",
            "family": "Dansmuggen",
            "confidence": 0.9999998825645856,
            "value1": 28174268237817700.00,
            "value2": 98789363413181000,
            "image": "20210927000000.jpg"
          },
          {
            "id": 27,
            "location": "Engewormer",
            "region": "Noord-Holland",
            "type": "Agrarisch",
            "latitude": 52.4819,
            "longitude": 4.8237,
            "date": "21-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-21-00:00:00",
            "order": "Ephemeroptera",
            "family": "Eendagsvliegen",
            "confidence": 0.9255376570320123,
            "value1": 53480298847939700.00,
            "value2": 34366380009573190,
            "image": "20210821000000.jpg"
          },
          {
            "id": 28,
            "location": "Engewormer",
            "region": "Noord-Holland",
            "type": "Agrarisch",
            "latitude": 52.4819,
            "longitude": 4.8237,
            "date": "21-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-21-00:00:00",
            "order": "Oligochaeta",
            "family": "Oligochaeta",
            "confidence": 0.9918296933553948,
            "value1": 1146837878457810.00,
            "value2": 3251397779711100,
            "image": "20210821000000.jpg"
          },
          {
            "id": 29,
            "location": "Lelystad-Heerenveen",
            "region": "Flevoland",
            "type": "Agrarisch",
            "latitude": 52.5283,
            "longitude": 5.6211,
            "date": "10-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-10-00:00:00",
            "order": "Orthocladiinae",
            "family": "Dansmuggen",
            "confidence": 0.9999767743355297,
            "value1": 7106101564280790.00,
            "value2": 25996531985567700,
            "image": "20210810000000.jpg"
          },
          {
            "id": 30,
            "location": "Lelystad-Heerenveen",
            "region": "Flevoland",
            "type": "Agrarisch",
            "latitude": 52.5283,
            "longitude": 5.6211,
            "date": "10-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-10-00:00:00",
            "order": "Aeshnidae",
            "family": "Glazenmakers",
            "confidence": 0.9642602205236407,
            "value1": 28909872433132700.00,
            "value2": 11752951699860780,
            "image": "20210810000000.jpg"
          },
          {
            "id": 31,
            "location": "Leiden-tuin",
            "region": "Zuid-Holland",
            "type": "Stedelijk",
            "latitude": 52.1808,
            "longitude": 4.5093,
            "date": "27-9-2021",
            "month": "09",
            "time": "00:00:00",
            "datetime": "2021-09-27-00:00:00",
            "order": "Aeshnidae",
            "family": "Glazenmakers",
            "confidence": 0.9981512157640297,
            "value1": 7809432112666670.00,
            "value2": 33179883859319840,
            "image": "20210927000000.jpg"
          },
          {
            "id": 32,
            "location": "Saeftinge",
            "region": "Zeeland",
            "type": "Landelijk",
            "latitude": 51.3601,
            "longitude": 4.2185,
            "date": "17-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-17-00:00:00",
            "order": "Cicadellidae",
            "family": "Cicaden",
            "confidence": 0.9999998366313054,
            "value1": 14089483759049910.00,
            "value2": 64055759195828400,
            "image": "20210817000000.jpg"
          },
          {
            "id": 33,
            "location": "Saeftinge",
            "region": "Zeeland",
            "type": "Landelijk",
            "latitude": 51.3601,
            "longitude": 4.2185,
            "date": "16-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-16-00:00:00",
            "order": "Bivalvia",
            "family": "Bivalven",
            "confidence": 0.8427351576115696,
            "value1": 83613853614571500.00,
            "value2": 48919895112112240,
            "image": "20210816000000.jpg"
          },
          {
            "id": 34,
            "location": "Leiden-tuin",
            "region": "Zuid-Holland",
            "type": "Stedelijk",
            "latitude": 52.1808,
            "longitude": 4.5093,
            "date": "27-9-2021",
            "month": "09",
            "time": "00:00:00",
            "datetime": "2021-09-27-00:00:00",
            "order": "Bivalvia",
            "family": "Bivalven",
            "confidence": 0.8694512309350709,
            "value1": 69768773157175300.00,
            "value2": 43867038872404610,
            "image": "20210927000000.jpg"
          },
          {
            "id": 35,
            "location": "Saeftinge",
            "region": "Zeeland",
            "type": "Landelijk",
            "latitude": 51.3601,
            "longitude": 4.2185,
            "date": "17-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-17-00:00:00",
            "order": "Odonata",
            "family": "Libellen",
            "confidence": 0.9596789385108948,
            "value1": 32378994316633630.00,
            "value2": 13386668252646200,
            "image": "20210817000000.jpg"
          },
          {
            "id": 36,
            "location": "Engewormer",
            "region": "Noord-Holland",
            "type": "Agrarisch",
            "latitude": 52.4819,
            "longitude": 4.8237,
            "date": "21-8-2021",
            "month": "08",
            "time": "00:00:00",
            "datetime": "2021-08-21-00:00:00",
            "order": "Cicadellidae",
            "family": "Cicaden",
            "confidence": 0.9999347922380864,
            "value1": 3539296790776120.00,
            "value2": 15008682647724840,
            "image": "20210821000000.jpg"
          },
          {
            "id": 37,
            "location": "Lelystad-Zeeasterweg-vogelakker",
            "region": "Flevoland",
            "type": "Agrarisch",
            "latitude": 52.4945,
            "longitude": 5.549,
            "date": "28-7-2021",
            "month": "07",
            "time": "00:00:07",
            "datetime": "2021-07-28-00:00:07",
            "order": "Miridae",
            "family": "Blindwantsen",
            "confidence": 0.3126640021800995,
            "value1": 4544026843312760.00,
            "value2": 16076473568723000,
            "image": "20210728000007.jpg"
          },
          {
            "id": 38,
            "location": "Bildtpollen",
            "region": "Friesland",
            "type": "Landelijk",
            "latitude": 53.3279,
            "longitude": 5.7009,
            "date": "24-7-2021",
            "month": "07",
            "time": "00:00:07",
            "datetime": "2021-07-24-00:00:07",
            "order": "Limoniidae",
            "family": "Steltmuggen",
            "confidence": 0.4937285482883453,
            "value1": 23043606220009000.00,
            "value2": 11498175299950600,
            "image": "20210724000007.jpg"
          },
          {
            "id": 39,
            "location": "Bildtpollen",
            "region": "Friesland",
            "type": "Landelijk",
            "latitude": 53.3279,
            "longitude": 5.7009,
            "date": "24-7-2021",
            "month": "07",
            "time": "00:00:07",
            "datetime": "2021-07-24-00:00:07",
            "order": "Chironomidae",
            "family": "Dansmuggen",
            "confidence": 0.9999395608901978,
            "value1": 9864333857219420.00,
            "value2": 12345806619604600,
            "image": "20210724000007.jpg"
          },
          {
            "id": 40,
            "location": "Den Helder",
            "region": "Noord-Holland",
            "type": "Stedelijk",
            "latitude": 53.3279,
            "longitude": 5.7009,
            "date": "19-01-2021",
            "month": "01",
            "time": "00:00:07",
            "datetime": "2021-07-24-00:00:07",
            "order": "Chironomidae",
            "family": "Dansmuggen",
            "confidence": 0.9999395608901978,
            "value1": 9864333857219420.00,
            "value2": 12345806619604600,
            "image": "20210724000007.jpg"
          },
          {
            "id": 41,
            "location": "Engewormer",
            "region": "Noord-Holland",
            "type": "Agrarisch",
            "latitude": 52.4819,
            "longitude": 4.8237,
            "date": "21-9-2021",
            "month": "09",
            "time": "00:00:00",
            "datetime": "2021-08-21-00:00:00",
            "order": "Oligochaeta",
            "family": "Oligochaeta",
            "confidence": 0.9918296933553948,
            "value1": 1146837878457810.00,
            "value2": 3251397779711100,
            "image": "20210821000000.jpg"
          }
    ]
    
        dataset = hardcodedData;

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




