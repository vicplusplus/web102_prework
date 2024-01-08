/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let game in games) {

        // create a new div element, which will become the game card
        let gameCard = document.createElement("div");

        // add the class game-card to the list
        gameCard.classList.add("game-card");

        // set the inner HTML using a template literal to display some info 
        // about each game
        gameCard.innerHTML = `
            <h2>${games[game].name}</h2>
            <img src="${games[game].img}" alt="${games[game].name}" class="game-img" />
            <p>Goal: $${games[game].goal.toLocaleString()}</p>
            <p>Backers: ${games[game].backers.toLocaleString()}</p>
            <p>Pledged: $${games[game].pledged.toLocaleString()}</p>
        `;
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")


        // append the game to the games-container
        gamesContainer.appendChild(gameCard);
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);


/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
let totalContributions = GAMES_JSON.reduce((total, game) => { return total + game.backers }, 0);

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `<h2>${totalContributions.toLocaleString('en-US')}</h2>`;

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");
let totalRaised = GAMES_JSON.reduce((total, game) => { return total + game.pledged }, 0);

// set inner HTML using template literal
raisedCard.innerHTML = `<h2>$${totalRaised.toLocaleString('en-US')}</h2>`;

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `<h2>${GAMES_JSON.length}</h2>`;


/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/
var funded = null;
var search = "";

function updateFilters(funded, search) {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games based on the funded parameter and search string
    let filteredGames;
    if (funded === true) {
        filteredGames = GAMES_JSON.filter(game => game.pledged >= game.goal && game.name.toLowerCase().includes(search.toLowerCase()));
    } else if (funded === false) {
        filteredGames = GAMES_JSON.filter(game => game.pledged < game.goal && game.name.toLowerCase().includes(search.toLowerCase()));
    } else {
        filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(search.toLowerCase()));
    }

    // use the function we previously created to add the filtered games to the DOM
    addGamesToPage(filteredGames);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");
const searchBar = document.getElementById("search-bar");


// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", () => {
    funded = false;
    updateFilters(funded, search);
});
fundedBtn.addEventListener("click", () => {
    funded = true;
    updateFilters(funded, search);
});
allBtn.addEventListener("click", () => {
    funded = null;
    updateFilters(funded, search);
});
searchBar.addEventListener("keyup", () => {
    search = searchBar.value;
    updateFilters(funded, search);
});


/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
let unfundedGamesCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;


// create a string that explains the number of unfunded games using the ternary operator
let displayString = `
    A total of \$${totalRaised.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length} game${GAMES_JSON.length == 1 ? "" : "s"}. 
    Currently, ${unfundedGamesCount} game${unfundedGamesCount == 1 ? " remains" : "s remain"} unfunded.
    We need your help to fund ${unfundedGamesCount == 1 ? "this amazing game" : "these amazing games"}!
`;

// create a new DOM element containing the template string and append it to the description container
let description = document.createElement("p");
description.innerHTML = displayString;
descriptionContainer.appendChild(description);

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames = GAMES_JSON.sort((item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [topGame, runnerUp] = sortedGames;

// create a new element to hold the name of the top pledge game, then append it to the correct element
const topGameName = document.createElement("h2");
topGameName.innerHTML = topGame.name;
firstGameContainer.appendChild(topGameName);

// do the same for the runner up item
const runnerUpName = document.createElement("h2");
runnerUpName.innerHTML = runnerUp.name;
secondGameContainer.appendChild(runnerUpName);