import swapi from './swapi.js';

let currentInfoDisplay;

//Exemple d'inicialització de la llista de pel·lícules. Falten dades!
async function setMovieHeading(movieId, titleSelector, infoSelector, directorSelector) {
  // Obtenim els elements del DOM amb QuerySelector
  const title = document.querySelector(titleSelector);
  const info = document.querySelector(infoSelector);
  const director = document.querySelector(directorSelector);

  // Obtenim la informació de la pelicula
  const movieInfo = await swapi.getMovieInfo(movieId);
  // Injectem
  title.innerHTML = movieInfo.name;
  info.innerHTML = `Episode ID: ${movieInfo.episodeID}<br>Release Date: ${movieInfo.release}`
  director.innerHTML = movieInfo.director
}

async function initMovieSelect(selector) {
  const movies = await swapi.listMovies();

  const select = document.querySelector(selector);

  const opcio = document.createElement('option');
  opcio.value = '';
  opcio.textContent = '-- Selecciona una opció --';
  opcio.disabled = true;
  opcio.defaultSelected = true;
  select.appendChild(opcio);

  for (const movie of movies) {
    const opcio = document.createElement('option')
    opcio.value = _episodeIdToFilmId(movie.episodeID);
    opcio.textContent = movie.name;
    select.appendChild(opcio);
  }
}

function deleteAllCharacterTokens() {
  const charactersList = document.querySelector('.list');
  charactersList.innerHTML = '';
}

// EVENT HANDLERS //

function addChangeEventToSelectHomeworld() {
  const homeworldSelector = document.querySelector('#select-homeworld');

  homeworldSelector.addEventListener('change', _createCharacterTokens);
}

async function _createCharacterTokens(event) {
  deleteAllCharacterTokens();
  const ul = document.querySelector('.list');
  const homeworld = event.target.value;
  const characters = currentInfoDisplay.characters.filter(character => character.homeworld == homeworld);

  for (const character of characters) {
    const li = document.createElement('li');
    const img = document.createElement('img');
    const h2 = document.createElement('h2');
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    const div4 = document.createElement('div');
    li.classList.add("list__item", "item", "character");
    img.src = "assets/user.svg";
    img.className = 'character__image';
    h2.className = "character__name";

    div1.className = 'character__birth';
    div1.innerHTML = `<strong>Birth Year:</strong> ${character.birth_year}`;

    div2.className = 'character__eye';
    div2.innerHTML = `<strong>Eye color:</strong> ${character.eye_color}`

    div3.className = 'character__gender';
    div3.innerHTML = `<strong>Gender:</strong> ${character.gender}`

    div4.className = 'character__home'
    div4.innerHTML = `<strong>Home World:</strong> ${character.homeworld}`;

    li.append(img, h2, div1, div2, div3, div4);
    ul.appendChild(li);
  }
}

function _addDivChild(parent, className, html) { }

function setMovieSelectCallbacks() {
  const selector = document.querySelector("#select-movie")
  selector.addEventListener('change', _handleOnSelectMovieChanged);
}

async function _handleOnSelectMovieChanged(event) {
  const movieID = event.target.value;
  setMovieHeading(movieID, '.movie__title', '.movie__info', '.movie__director')

  currentInfoDisplay = await swapi.getMovieCharactersAndHomeworlds(movieID)
  const homeWorldsTrobats = currentInfoDisplay.characters.map(character => character.homeworld);

  const homeworlds = _removeDuplicatesAndSort(homeWorldsTrobats)
  _populateHomeWorldSelector(homeworlds)
}

function _episodeIdToFilmId(episodeID) {
  return episodeToMovieIDs.find(episode => episode.e == episodeID).m
}

// "https://swapi.dev/api/films/1/" --> Episode_id = 4 (A New Hope)
// "https://swapi.dev/api/films/2/" --> Episode_id = 5 (The Empire Strikes Back)
// "https://swapi.dev/api/films/3/" --> Episode_id = 6 (Return of the Jedi)
// "https://swapi.dev/api/films/4/" --> Episode_id = 1 (The Phantom Menace)
// "https://swapi.dev/api/films/5/" --> Episode_id = 2 (Attack of the Clones)
// "https://swapi.dev/api/films/6/" --> Episode_id = 3 (Revenge of the Sith)

let episodeToMovieIDs = [
  { m: 1, e: 4 },
  { m: 2, e: 5 },
  { m: 3, e: 6 },
  { m: 4, e: 1 },
  { m: 5, e: 2 },
  { m: 6, e: 3 },
];

function _populateHomeWorldSelector(homeworlds) {
  const homeworldSelector = document.querySelector('#select-homeworld');
  homeworldSelector.innerHTML = ''
  const opcio = document.createElement('option');
  opcio.value = '';
  opcio.textContent = '-- Selecciona una opció --';
  opcio.disabled = true;
  opcio.defaultSelected = true;
  homeworldSelector.appendChild(opcio)

  for (const homeworld of homeworlds) {
    const option = document.createElement('option');
    option.value = homeworld;
    option.textContent = homeworld;

    homeworldSelector.appendChild(option);
  }
}

/**
 * Funció auxiliar que podem reutilitzar: eliminar duplicats i ordenar alfabèticament un array.
 */
function _removeDuplicatesAndSort(elements) {
  // Al crear un Set eliminem els duplicats
  const set = new Set(elements);
  // tornem a convertir el Set en un array
  const array = Array.from(set);
  // i ordenem alfabèticament
  return array.sort(swapi._compareByName);
}

const act7 = {
  setMovieHeading,
  setMovieSelectCallbacks,
  initMovieSelect,
  deleteAllCharacterTokens,
  addChangeEventToSelectHomeworld,
};

export default act7;
