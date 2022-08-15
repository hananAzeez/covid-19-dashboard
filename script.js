"strict";
//https://covid-api.mmediagroup.fr/v1/cases ?country=India
//https://api.covid19api.com/summary

const aggregatedConfirmed = document.getElementById("aggregated-confirmed");
const lifeExpectancy = document.getElementById("life-expectancy");
const recovered = document.getElementById("recovered");
const deaths = document.getElementById("death");
const countryList = document.getElementById("country-list");
const allCountryUl = document.getElementById("allCountry");
const searchBox = document.querySelector("[search-box]");
const liTemplate = document.querySelector("[country-li-template]");
const skeleton = document.querySelectorAll(".skeleton");
const skeletonBig = document.querySelectorAll(".skeleton-big");
const skeletonFlag = document.querySelector(".skeleton-flag");
const smallInfoBox = document.querySelectorAll(".info-small");
const graphBox = document.querySelectorAll(".countryItem");
const selectedCountryFlag = document.querySelector(".selected-country");

// ====NAV SELECT👇====
// const navItems = document.querySelectorAll(".nav-items");
// navItems.forEach((item) => {
//   item.addEventListener("click", () => {
//     item.classList.add("select");
//   });
// });
// // navItems.addEventListener("click", () => {});
// ====NAV SELECT👆====

let countries = [];

searchBox.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  countries.forEach((country) => {
    const isVisible = country.name.toLowerCase().includes(value);
    country.element.classList.toggle("hide", !isVisible);
  });
});

//Put commas in number
const comma = (x) => {
  return x.toLocaleString();
};

//Dropdown list
const fetchData = () => {
  fetch(`https://api.covid19api.com/summary`)
    .then((response) => response.json())
    .then((data) => {
      const list = data?.Countries;
      countries = data.Countries.map((country) => {
        //DISPLAY COUNTRIES AS LIST ITEMS
        const li = liTemplate.content.cloneNode(true).children[0];
        const liItem = document.createTextNode(country?.Country);
        // countries.push(liItem.data);
        li.appendChild(liItem);
        allCountryUl.appendChild(li);

        li.addEventListener("click", () => {
          console.log(li);
          let clickedCountry = li.innerHTML;
          displayResults(li.innerHTML);
          getData(clickedCountry);
          getCountryData(clickedCountry);
          // chart1();
        });

        return { name: country?.Country, element: li };
      });
    });
};
//DISPLAY RESULTS
const displayResults = (country) => {
  // ===skeleton animation👇===
  skeleton.forEach((info) => {
    info.classList.remove("hide");
  });
  smallInfoBox.forEach((info) => {
    info.classList.add("hide");
  });

  skeletonBig.forEach((info) => {
    info.classList.remove("hide");
  });
  graphBox.forEach((info) => {
    info.classList.add("hide");
  });
  selectedCountryFlag.classList.add("hide");
  // skeletonFlag.classList.remove("hide");
  // ===skeleton animation👆===
  fetch(`https://covid-api.mmediagroup.fr/v1/cases?country=${country}`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      let aggConfirmedNum = data?.All?.confirmed;
      let deathsNum = data?.All?.deaths;
      let lifeExpectancyNum = data?.All?.life_expectancy;
      let recoveredNum = aggConfirmedNum - deathsNum - 2000;
      aggregatedConfirmed.innerText = comma(aggConfirmedNum);
      recovered.innerText =
        recoveredNum < 2000
          ? comma((recovered.innerText = aggConfirmedNum - deathsNum))
          : comma(aggConfirmedNum - deathsNum - 2000);
      lifeExpectancy.innerText =
        lifeExpectancyNum == null ? 100 : lifeExpectancyNum;
      deaths.innerText = comma(deathsNum);
      // ===skeleton animation👇
      skeleton.forEach((info) => {
        info.classList.toggle("hide");
      });
      smallInfoBox.forEach((info) => {
        info.classList.toggle("hide");
      });

      skeletonBig.forEach((info) => {
        info.classList.toggle("hide");
      });
      graphBox.forEach((info) => {
        info.classList.toggle("hide");
      });
      // skeletonFlag.classList.toggle("hide");
      selectedCountryFlag.classList.toggle("hide");
      // ===skeleton animation👆
    });
};

fetchData();

//GRAPHS
async function getData(countryName) {
  const response = await fetch("demo.csv");
  const data = await response.text();
  const rows = data.split("\n").slice(1);
  let dateArr = [];
  let aggConfirmedArr = [];
  let deathArr = [];
  rows.forEach((element) => {
    const row = element.split(",");
    const csvCountryName = row[2];
    // console.log(csvCountryName);
    // console.log(countryName);
    // if (csvCountryName == countryName) {
    const date = row[0];
    const aggConf = row[4]; //newCases=row[4] / aggconf=row[5]
    const death = row[6]; //dailyDeath=row[6] / totDeath=row[7]
    dateArr.push(date);
    aggConfirmedArr.push(aggConf);
    deathArr.push(death);
    // }
  });
  return { dateArr, aggConfirmedArr, deathArr };
}

const confirmedGraph = document
  .getElementById("confirmedGraph")
  .getContext("2d");
async function chart1() {
  const { dateArr = [], aggConfirmedArr = [] } = await getData();
  const myChart = new Chart(confirmedGraph, {
    type: "bar",
    data: {
      labels: dateArr,
      datasets: [
        {
          label: "Daily Cases",
          data: aggConfirmedArr,
          backgroundColor: ["#f9345f8c", "#1cb1417f", "#6236ff76"],
          borderColor: ["#f9345e", "#1cb142", "#6236ff"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}
chart1();
//DEATH GRAPH
const deathGraph = document.getElementById("deathGraph").getContext("2d");
async function chart2() {
  const { dateArr = [], aggConfirmedArr = [], deathArr = [] } = await getData();
  const myGraph2 = new Chart(deathGraph, {
    type: "line",
    data: {
      labels: dateArr,
      datasets: [
        {
          label: "Daily Deaths",
          data: deathArr,
          backgroundColor: ["#6236ff"],
        },
      ],
    },
  });
}
chart2();
// const sample = function () {
//   fetch("https://data.covid19india.org/v4/min/data.min.json")
//     .then((res) => res.json())
//     .then((data) => console.log(data));
// };

// sample();

// //Display dropdown items as list
// const demo = fetch("https://api.covid19api.com/summary")
//   .then((res) => res.json())
//   .then((data) => console.log(data));

//DISPLAY COUNTRIES AS LIST ITEMS
// const option = document.createElement("option");
// const optionText = document.createTextNode(country?.Country);
// option.appendChild(optionText);
// option.setAttribute("value", country?.Country);
// countryList.appendChild(option);

//to put commas in number .toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const countriesContainer = document.querySelector(".selected-country-info");

const renderCountry = function (data, className = "") {
  const html = `
  <article class="country ${className}">
  <img class="country__img" src="${data.flags.svg}" />
  <div class="country__data">
  <h3 class="country__name">${data.name.common}</h3>
  <h4 class="country__region">${data.region}</h4>
      </div>
      </article>
      `;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

const getCountryData = function (country) {
  const cards = document.getElementById("cards");
  cards.innerHTML = "";
  //Country 1
  // const country = countriesSel.value;
  console.log("country", country);
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => response.json())
    .then((data) => {
      renderCountry(data[0]);
    });
};
