import './index.html';
import './index.scss';
import 'animate.css';
import lion from './img/lion.svg';

const gameEl = document.querySelector('.game');
const targetEl = document.querySelector('.target');
const heroEl = document.querySelector('.hero');
const counterEl = document.querySelector('.counter');
const scoreValEl = document.querySelector('.score-val');
const backdropEl = document.querySelector('.backdrop');
const modalStartEl = document.querySelector('[data-modal="1"]');
const modalEndEl = document.querySelector('[data-modal="2"]');
const btnStartEl = document.querySelector('.btn-start');
const btnRetryEl = document.querySelector('.btn-retry');

if (localStorage.getItem('score')) {
  scoreValEl.textContent = localStorage.getItem('score');
}

let counter = 0;
let timeInterval = 10;
let timeoutEnemy = 2000;

let startPositionY = 200;
let startPositionX = 300;

let intervalId = 0;

heroEl.style.top = `${startPositionY}px`;
heroEl.style.left = `${startPositionX}px`;

targetEl.style.top = `${getRandomNumber(0, 360)}px`;
targetEl.style.left = `${getRandomNumber(0, 560)}px`;

const moveToRight = () => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    startPositionX += 1;
    checkPosition();
    return (heroEl.style.left = `${startPositionX}px`);
  }, timeInterval);
};

const moveToLeft = () => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    startPositionX -= 1;
    checkPosition();
    return (heroEl.style.left = `${startPositionX}px`);
  }, timeInterval);
};

const moveToUp = () => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    startPositionY -= 1;
    checkPosition();
    return (heroEl.style.top = `${startPositionY}px`);
  }, timeInterval);
};

const moveToDown = () => {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    startPositionY += 1;
    checkPosition();
    return (heroEl.style.top = `${startPositionY}px`);
  }, timeInterval);
};

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + 10;
}

const checkPosition = () => {
  if (
    Math.abs(
      parseInt(
        heroEl.getBoundingClientRect().top -
          targetEl.getBoundingClientRect().top
      )
    ) <= 20 &&
    Math.abs(
      parseInt(
        heroEl.getBoundingClientRect().left -
          targetEl.getBoundingClientRect().left
      )
    ) <= 20
  ) {
    return plusPoint();
  }
  if (document.querySelector('.enemy')) {
    if (
      Math.abs(
        parseInt(
          heroEl.getBoundingClientRect().top -
            document.querySelector('.enemy').getBoundingClientRect().top
        )
      ) <= 50 &&
      Math.abs(
        parseInt(
          heroEl.getBoundingClientRect().left -
            document.querySelector('.enemy').getBoundingClientRect().left
        )
      ) <= 50
    ) {
      return gameOverHandler();
    }
  }
  if (
    startPositionX > 560 ||
    startPositionX < 0 ||
    startPositionY > 370 ||
    startPositionY < 0
  ) {
    return gameOverHandler();
  }
};

const createEnemy = () => {
  if (counter % 10 === 0) {
    const enemyMarkup = `<div class="enemy"><img src="${lion}" alt="Lion"/></div>`;
    gameEl.insertAdjacentHTML('beforeend', enemyMarkup);
    document.querySelector('.enemy').style.top = `${getRandomNumber(0, 350)}px`;
    document.querySelector('.enemy').style.left = `${getRandomNumber(
      0,
      550
    )}px`;
    timeoutEnemy += 1000;
    setTimeout(() => {
      gameEl.lastElementChild.remove();
    }, timeoutEnemy);
  }
};

const onBtnClickStartHandler = () => {
  backdropEl.classList.remove('active');
  modalStartEl.classList.remove('active');
  intervalId = setInterval(() => {
    startPositionX += 1;
    checkPosition();
    btnStartEl.remove('click', onBtnClickStartHandler);
    return (heroEl.style.left = `${startPositionX}px`);
  }, timeInterval);
};

const onBtnClickRetryHandler = () => {
  btnRetryEl.removeEventListener('click', onBtnClickRetryHandler);
  backdropEl.classList.remove('active');
  modalEndEl.classList.remove('active');
  startPositionY = 200;
  startPositionX = 300;
  timeInterval = 10;
  timeoutEnemy = 2000;
  heroEl.style.top = `${startPositionY}px`;
  heroEl.style.left = `${startPositionX}px`;
  counter = 0;
  counterEl.textContent = counter;
  targetEl.style.top = `${getRandomNumber(0, 360)}px`;
  targetEl.style.left = `${getRandomNumber(0, 560)}px`;
  intervalId = setInterval(() => {
    startPositionX += 1;
    checkPosition();
    btnStartEl.remove('click', onBtnClickStartHandler);
    return (heroEl.style.left = `${startPositionX}px`);
  }, timeInterval);
};

const plusPoint = () => {
  counter += 1;
  timeInterval -= 1;
  counterEl.textContent = counter;
  targetEl.style.top = `${getRandomNumber(0, 350)}px`;
  targetEl.style.left = `${getRandomNumber(0, 550)}px`;
  counterEl.classList.add('animate__animated', 'animate__heartBeat');
  setTimeout(() => {
    counterEl.classList.remove('animate__animated', 'animate__heartBeat');
  }, 500);
  createEnemy();
};

const gameOverHandler = () => {
  if (
    !localStorage.getItem('score') ||
    JSON.parse(localStorage.getItem('score')) < counter
  ) {
    localStorage.setItem('score', counter);
    scoreValEl.textContent = localStorage.getItem('score');
  }
  clearInterval(intervalId);
  backdropEl.classList.add('active');
  modalEndEl.classList.add('active');
  btnRetryEl.addEventListener('click', onBtnClickRetryHandler);
};

window.addEventListener('keydown', evt => {
  if (evt.code === 'ArrowUp') {
    moveToUp();
  }
  if (evt.code === 'ArrowDown') {
    moveToDown();
  }
  if (evt.code === 'ArrowLeft') {
    moveToLeft();
  }
  if (evt.code === 'ArrowRight') {
    moveToRight();
  }
});

btnStartEl.addEventListener('click', onBtnClickStartHandler);
