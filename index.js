import { easyQuestions as source } from "./data/easy.js";
import { mediumQuestions as source2 } from "./data/medium.js";
import { hardQuestions as source3 } from "./data/hard.js";
import { Chronometer } from "./chrono.js";

const easyQuestions = JSON.parse(JSON.stringify(source));
const mediumQuestions = JSON.parse(JSON.stringify(source2));
const hardQuestions = JSON.parse(JSON.stringify(source3));

// Chrono
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

// Create an array with numbers 0 - 49 for each question
let questionNumberArray = [];
for (let i = 0; i < 50; i++) {
  questionNumberArray.push(i);
}

// Initialize variables
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
let difficulty = '';
let correctAnswer = '';
let incorrectAnswers = [];
let counterCorrect = 0;
let counterIncorrect = 0;

difficultyBtns.forEach((btn) => (btn.onclick = setLevel));

function toggleHidden(elem) {
  elem.classList.toggle("hidden");
}

function removeHidden() {
  reloadBtn.classList.remove("hidden");
}

function showHidden(elem) {
  if (!elem.classList.contains("hidden")) {
    elem.classList.toggle("hidden");
  }
}

function hideElement(elem) {
  if (elem.classList.contains("hidden")) {
    elem.classList.toggle("hidden");
  }
}

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
  toggleHidden(setLevelDiv);
  toggleHidden(displayLevel);
  toggleHidden(scoreboard);
  removeHidden();
  showHidden(earthAnimation);
  hideElement(timingDiv);
  nextQuestion(difficulty);
}

function nextQuestion(level) {    
  // Randomly select a number from the questionNumberArray, which will be the question asked
  let randomQuestion = questionNumberArray[Math.floor(Math.random()*questionNumberArray.length)];

  // Remove that question from the array so it can't be asked again
  for (let i = 0; i < questionNumberArray.length; i++) {
    if (questionNumberArray[i] === randomQuestion) {
      questionNumberArray.splice(i, 1);
    }
  }

  const results = level[randomQuestion];
  const newQuestion = results.question; 
  correctAnswer = results.correct_answer;
  incorrectAnswers = results.incorrect_answers;
  console.log(correctAnswer);
  console.log(incorrectAnswers);
  hideElement(qaDisplay);
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

// Play sound when user answers question
function playAudio(url) {
  new Audio(url).play();
}

function checkAnswer(evt) {
  myAudio.pause();
  evt.target.blur();
  const choice = evt.target.textContent;
  if (choice === correctAnswer) {
    counterCorrect += 1;
    playAudio("audio/lightapplause.mp3");
    scoreboardCorrect.textContent = `${counterCorrect}`;
    if (counterCorrect === 3) {
      toggleHidden(roundOverDisplay);
      toggleHidden(qaDisplay);
      finalResultMessage.innerHTML = `<span>Woo hoo! 10 right <i class="fas fa-trophy"></i></span>`
      chronometer.stopClick()
      printSplit(difficulty);
      myAudio.play();
    } else {
      nextQuestion(difficulty);
    }
  } else {
    counterIncorrect += 1;
    playAudio("audio/fail-buzzer-03.mp3");
    scoreboardIncorrect.textContent = `${counterIncorrect}`;
    if (counterIncorrect === 3) {
      toggleHidden(roundOverDisplay);
      toggleHidden(qaDisplay);
      finalResultMessage.innerHTML = `<span>Ouch! 3 wrong <i class="fas fa-user-injured"></i></span>`
      chronometer.stopClick()
      myAudio.play();
    } else {
      nextQuestion(difficulty);
    }
  }
}

playAgainBtn.onclick = newGame;

function newGame() {
  chronometer.resetClick();
  printTime();
  toggleHidden(setLevelDiv);
  toggleHidden(displayLevel);
  toggleHidden(scoreboard);
  showHidden(roundOverDisplay);
  showHidden(qaDisplay);
  counterCorrect = 0;
  scoreboardCorrect.textContent = `${counterCorrect}`;
  counterIncorrect = 0;
  scoreboardIncorrect.textContent = `${counterIncorrect}`;
  setLevel;
  checkAnswer;
}

reloadBtn.onclick = refreshPage;

function refreshPage(){
  window.location.reload();
} 

// TO DO: 
// Refactor checkAnswer DRY
// Fireworks or pop-up when you win/lose? Use z-index to move things back/forward, size from 0 to 100vh&vw, transition
// Keep navbar? About page?