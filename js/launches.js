/* eslint-disable no-console */
function getCountDownTimer(launchDate) {
  // Set the date we're counting down to
  const countDownDate = new Date(launchDate).getTime();
  // Update the count down every 1 second
  // LANZA LA FUNCION CADA CIERTO TIEMPO, devuelve un ID de proceso
  const x = setInterval(() => {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Output the result in an element with id="countdown-upcoming"
    document.getElementById('countdown-upcoming').innerHTML = `${days}days ${hours}hours ${minutes}minutes ${seconds}seconds `;

    // If the count down is over, write some text
    if (distance < 0) {
      clearInterval(x);
      document.getElementById('countdown-upcoming').innerHTML = 'EXPIRED';
    }
  }, 1000);
}

function printLaunch(result, selector) {
  const title = document.querySelector(`#title${selector}`);
  title.textContent = `${result.name}`;

  const img = document.querySelector(`#img${selector}`);
  let imgUrl = `${result.links.patch.small}`;

  if (imgUrl === 'null' || imgUrl == null) {
    imgUrl = 'img/astronauta.png';
    img.setAttribute('width', '60%');
  }

  img.setAttribute('src', imgUrl);

  const date = document.querySelector(`#date${selector}`);
  date.textContent = `${result.date_local}`;

  const moreInfo = document.querySelector(`#more${selector}`);
  moreInfo.setAttribute('href', `launch.html?id=${result.id}`);

  if (selector === '-upcoming') {
    getCountDownTimer(result.date_local);
  }
}

function getApiData(api, selector) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  fetch(api, requestOptions)
    .then((response) => response.json())
    .then((result) => printLaunch(result, selector))
    .catch((error) => console.log('error', error));
}

function createElement(launch, count) {
  const div = document.createElement('div');
  // el método setAttribute, que toma dos parametros, primero el nombre de la propiedad a setear y el valor
  div.setAttribute('id', `card-${count}`);
  div.setAttribute('class', 'col-sm-6');
  div.style.display = 'inline-block';

  const link = document.createElement('a');
  link.setAttribute('id', `link-${count}`);
  link.setAttribute('class', 'badge badge-secondary');
  link.setAttribute('href', `launch.html?id=${launch.id}`);
  div.appendChild(link);

  const launchNumber = parseInt(count, 10) + 1;

  const paragraph = document.createElement('p');
  paragraph.setAttribute('id', `item-${count}`);
  paragraph.textContent = `${launchNumber}. ${launch.name}`;
  link.appendChild(paragraph);

  return div;
}

function printPastLaunchesList(result) {
  const launchesDiv = document.querySelector('#past-launches');
  Object.keys(result).forEach((k) => launchesDiv.appendChild(createElement(result[k], k)));
}

function getPastLaunches(api) {
  const requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  fetch(api, requestOptions)
    .then((response) => response.json())
    .then((result) => printPastLaunchesList(result))
    .catch((error) => console.log('error', error));
}
// forma de llamar a la API 

const apiBaseUrl = 'https://api.spacexdata.com/v4/';

const upcomingApi = `${apiBaseUrl}launches/next`;
const upcomingSelector = '-upcoming';

const latestApi = `${apiBaseUrl}launches/latest`;
const latestSelector = '-latest';

const pastLaunchesApi = `${apiBaseUrl}launches/past`;

getApiData(upcomingApi, upcomingSelector);
getApiData(latestApi, latestSelector);

getPastLaunches(pastLaunchesApi);
