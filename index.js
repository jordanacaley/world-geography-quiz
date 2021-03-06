import { easyQuestions as source } from "./data/easy.js";
import { mediumQuestions as source2 } from "./data/medium.js";
import { hardQuestions as source3 } from "./data/hard.js";
import { Chronometer } from "./chrono.js";

const easyQuestions = JSON.parse(JSON.stringify(source));
const mediumQuestions = JSON.parse(JSON.stringify(source2));
const hardQuestions = JSON.parse(JSON.stringify(source3));

// Chrono functionality
const chronometer = new Chronometer();

// get the DOM elements that will serve us to display the time:
let minDec = document.getElementById('minDec');
let minUni = document.getElementById('minUni');
let secDec = document.getElementById('secDec');
let secUni = document.getElementById('secUni');
let splits = document.getElementById('splits');

function printTime() {
  printMinutes();
  printSeconds();
}

function printMinutes() {
  minUni.textContent = "";
  minDec.textContent = chronometer.twoDigitsNumber(chronometer.getMinutes()); 
}

function printSeconds() {
  secUni.textContent = "";
  secDec.textContent = chronometer.twoDigitsNumber(chronometer.getSeconds()); 
}

function printSplit(difficulty) {
  splits.innerHTML += `<li>${difficulty[0].difficulty.charAt(0).toUpperCase() + difficulty[0].difficulty.slice(1)}: ${chronometer.splitClick()}</li>`
}
// End Chrono functionality

// Create an array for each level with numbers 0 - 49 for each question
let easyNumberArray = [];
let medNumberArray = [];
let hardNumberArray = [];

for (let i = 0; i < 50; i++) {
  easyNumberArray.push(i);
  medNumberArray.push(i);
  hardNumberArray.push(i);
}

// Initialize other variables
const myAudio = document.getElementById("beach-audio");
const setLevelDiv = document.getElementById('set-level');
const displayLevel = document.getElementById('display-level');
const scoreboard = document.getElementById('scoreboard');
const qaDisplay = document.getElementById("qa-display");
const difficultyBtns = document.querySelectorAll('.level');
const earthAnimation = document.getElementById("earth");
const timingDiv = document.getElementById("timing-div");
const reloadBtn = document.getElementById("reload")
const optionsCards = document.querySelectorAll('.option');  
const scoreboardCorrect = document.getElementById('correct');
const scoreboardIncorrect = document.getElementById('incorrect');
const playAgainBtn = document.getElementById('play-again');
const roundOverDisplay = document.getElementById('round-over-display');
const finalResultMessage = document.getElementById('final-result-message');
const fireworksDiv = document.getElementById('fireworks-div');
let difficulty = '';
let correctAnswer = '';
let incorrectAnswers = [];
let counterCorrect = 0;
let counterIncorrect = 0;
let randomQuestion = '';

function hideElement(elem) {
  if (!elem.classList.contains("hidden")) {
    elem.classList.toggle("hidden");
  }
}

function showElement(elem) {
  if (elem.classList.contains("hidden")) {
    elem.classList.toggle("hidden");
  }
}

difficultyBtns.forEach((btn) => (btn.onclick = setLevel));

function setLevel(evt) {
  const level = evt.target.id;
  myAudio.play();
  if (level === 'easy') {
    difficulty = easyQuestions;
  } else if (level === 'medium') {
    difficulty = mediumQuestions;
  } else {
    difficulty = hardQuestions;
  }
  displayLevel.textContent = `Difficulty: ${level.charAt(0).toUpperCase() + level.slice(1)}`;
  chronometer.startClick(printTime);
  hideElement(earthAnimation);
  hideElement(setLevelDiv);
  showElement(displayLevel);
  showElement(scoreboard);
  showElement(timingDiv);
  showElement(reloadBtn);
  handleQuestion(difficulty);
}

function handleQuestion(difficulty) {
  let difficultyArray = [];
  if (difficulty === easyQuestions) {
    difficultyArray = easyNumberArray;
  } else if (difficulty === mediumQuestions) {
    difficultyArray = medNumberArray;
  } else {
    difficultyArray = hardNumberArray;
  }

  // Randomly select a number from the questionNumberArray, which will be the question asked
  randomQuestion = difficultyArray[Math.floor(Math.random()*difficultyArray.length)];
  
  // Remove that question from the array so it can't be asked again
  for (let i = 0; i < difficultyArray.length; i++) {
    if (difficultyArray[i] === randomQuestion) {
      difficultyArray.splice(i, 1);
    }
  }
  nextQuestion(difficulty);
}

function nextQuestion(difficulty) {    
  const results = difficulty[randomQuestion];
  const newQuestion = results.question; 
  correctAnswer = results.correct_answer;
  incorrectAnswers = results.incorrect_answers;
  // console.log(correctAnswer); // Uncomment if you want the answer to each question displayed in the console
  showElement(qaDisplay);
  displayQuestion(newQuestion);
  displayOptions(correctAnswer, incorrectAnswers)
}

function displayQuestion(newQuestion) {
  document.querySelector(".question").textContent = newQuestion;
}

// Fisher-Yates shuffle to mix up order of correct and incorrect answers
function shuffleArray(arr) {
  let counter = arr.length;
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);
    counter--;
    // And swap the last element with it
    let temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }
  return arr;
}

function displayOptions(correctAnswer, incorrectAnswers) {
  let optionsArray = [];
  optionsArray.push(correctAnswer);
  optionsArray.push(incorrectAnswers);
  optionsArray = shuffleArray(optionsArray.flat()); // puts all 4 options into array and shuffles order

  for (let i = 0; i < optionsCards.length; i++) {
    optionsCards[i].textContent = `${optionsArray[i]}`
  }
}

optionsCards.forEach((btn) => (btn.onclick = checkAnswer));

function checkAnswer(evt) {
  myAudio.pause();
  evt.target.blur();
  const choice = evt.target.textContent;  
  if (choice === correctAnswer) {
    counterCorrect += 1;
    playAudio("audio/lightapplause.mp3");
    scoreboardCorrect.textContent = `${counterCorrect}`;    
  } else {
    counterIncorrect += 1;
    playAudio("audio/fail-buzzer-03.mp3");
    scoreboardIncorrect.textContent = `${counterIncorrect}`;     
  }
  checkScores();
  checkEndOfRound();
}

// Play sound when user answers question
function playAudio(url) {
  new Audio(url).play();
}

function checkScores() {
  if (counterCorrect === 10) {
    finalResultMessage.innerHTML = `<span>Woo hoo! 10 right <i class="fas fa-trophy"></i></span>`
    showElement(fireworksDiv);
    printSplit(difficulty);
  } else if (counterIncorrect === 3) {
    finalResultMessage.innerHTML = `<span>Ouch! 3 wrong <i class="fas fa-user-injured"></i></span>`      
  } else {
    handleQuestion(difficulty);
  }
}

function checkEndOfRound() {
  if (counterCorrect === 10 || counterIncorrect === 3) {
    showElement(roundOverDisplay);
    hideElement(qaDisplay);
    chronometer.stopClick()
    myAudio.play();
  }
}

playAgainBtn.onclick = newGame;

function newGame() {
  chronometer.resetClick();
  printTime();
  showElement(setLevelDiv);
  hideElement(displayLevel);
  hideElement(scoreboard);
  hideElement(fireworksDiv);
  hideElement(roundOverDisplay);
  hideElement(qaDisplay);
  counterCorrect = 0;
  scoreboardCorrect.textContent = `${counterCorrect}`;
  counterIncorrect = 0;
  scoreboardIncorrect.textContent = `${counterIncorrect}`;
  setLevel;
}

reloadBtn.onclick = refreshPage;

function refreshPage(){
  window.location.reload();
} 