import './index.html';
import './index.scss';
import 'animate.css';
import refs from './modules/refs';
import props from './modules/props';
import lion from './img/lion.svg';

// Variables

const {
  gameEl,
  targetEl,
  heroEl,
  counterEl,
  scoreValEl,
  backdropEl,
  modalStartEl,
  modalEndEl,
  btnStartEl,
  btnRetryEl,
  soundBoxEl,
} = refs;

let {
  counter,
  timeInterval,
  timeoutEnemy,
  startPositionY,
  startPositionX,
  intervalId,
} = props;

// Base options

heroEl.style.top = `${startPositionY}px`;
heroEl.style.left = `${startPositionX}px`;

if (localStorage.getItem('score')) {
  scoreValEl.textContent = localStorage.getItem('score');
}

/**
  |============================
  | Functrions
  |============================
*/

// Handlers

const onBtnClickStartHandler = () => {
  makeTrack(soundBoxEl, 1);
  window.addEventListener('keydown', gameControllerHandler);
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
  makeTrack(soundBoxEl, 1);
  window.addEventListener('keydown', gameControllerHandler);
  btnRetryEl.removeEventListener('click', onBtnClickRetryHandler);
  backdropEl.classList.remove('active');
  modalEndEl.classList.remove('active');
  onStartPositionMaker();
  intervalId = setInterval(() => {
    startPositionX += 1;
    checkPosition();
    btnStartEl.remove('click', onBtnClickStartHandler);
    return (heroEl.style.left = `${startPositionX}px`);
  }, timeInterval);
};

const onPressKeyStartGameHandler = evt => {
  makeTrack(soundBoxEl, 1);
  if (evt.code === 'Enter') {
    window.removeEventListener('keydown', onPressKeyStartGameHandler);
    window.addEventListener('keydown', gameControllerHandler);
    backdropEl.classList.remove('active');
    modalStartEl.classList.remove('active');
    modalEndEl.classList.remove('active');
    onStartPositionMaker();
    intervalId = setInterval(() => {
      startPositionX += 1;
      checkPosition();
      btnStartEl.remove('click', onBtnClickStartHandler);
      return (heroEl.style.left = `${startPositionX}px`);
    }, timeInterval);
  }
};

const getRandomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

/**
  |============================
  | Checks
  |============================
*/

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
    return plusPointMaker();
  }
  if (document.querySelector('.enemy')) {
    if (
      Math.abs(
        parseInt(
          heroEl.getBoundingClientRect().top -
            document.querySelector('.enemy').getBoundingClientRect().top
        )
      ) <= 40 &&
      Math.abs(
        parseInt(
          heroEl.getBoundingClientRect().left -
            document.querySelector('.enemy').getBoundingClientRect().left
        )
      ) <= 40
    ) {
      return openGameOverModal();
    }
  }
  if (
    startPositionX > 560 ||
    startPositionX < 0 ||
    startPositionY > 370 ||
    startPositionY < 0
  ) {
    return openGameOverModal();
  }
};

/**
  |============================
  | Makers
  |============================
*/

const onStartPositionMaker = () => {
  counter = 0;

  timeInterval = 10;
  timeoutEnemy = 2000;

  startPositionY = 200;
  startPositionX = 300;

  intervalId = 0;

  counterEl.textContent = counter;

  heroEl.style.top = `${startPositionY}px`;
  heroEl.style.left = `${startPositionX}px`;

  targetEl.style.top = `${getRandomNumber(0, 360)}px`;
  targetEl.style.left = `${getRandomNumber(0, 560)}px`;
};

const plusPointMaker = () => {
  makeTrack(soundBoxEl, 2);
  counter += 1;
  timeInterval -= 1;
  counterEl.textContent = counter;
  targetEl.style.top = `${getRandomNumber(0, 350)}px`;
  targetEl.style.left = `${getRandomNumber(0, 550)}px`;
  counterEl.classList.add('animate__animated', 'animate__heartBeat');
  setTimeout(() => {
    counterEl.classList.remove('animate__animated', 'animate__heartBeat');
  }, 500);
  createEnemyMaker();
};

const createEnemyMaker = () => {
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

/**
  |============================
  | Controllers
  |============================
*/

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

const gameControllerHandler = evt => {
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
};

// Open Modal

const openGameOverModal = () => {
  makeTrack(soundBoxEl, 3);
  window.removeEventListener('keydown', gameControllerHandler);
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
  window.addEventListener('keydown', onPressKeyStartGameHandler);
};

/**
  |============================
  | Maker Audio
  |============================
*/

const makeTrack = (box, num) => {
  const track = new Audio(box.children[num - 1].src);
  track.autoplay = true;
  track.loop = false;
  track.volume = 0.5;
  if (num === 2) track.volume = 0.1;
};

/**
  |============================
  | Base Listeners
  |============================
*/

btnStartEl.addEventListener('click', onBtnClickStartHandler);
window.addEventListener('keydown', onPressKeyStartGameHandler);
