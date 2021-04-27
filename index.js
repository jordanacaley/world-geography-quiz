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
let correctAnswer = '';
let incorrectAnswers = [];
let difficulty = '';
const setLevelDiv = document.getElementById('set-level');
const displayLevel = document.getElementById('display-level');
const scoreboard = document.getElementById('scoreboard');
const qaDisplay = document.getElementById("qa-display");
const difficultyBtns = document.querySelectorAll('.level');
const earthAnimation = document.getElementById("earth");
const timingDiv = document.getElementById("timing-div");
const myAudio = document.getElementById("beach-audio");
const reloadBtn = document.getElementById("reload")

difficultyBtns.forEach((btn) => (btn.onclick = setLevel));

function newGame() {
  chronometer.resetClick();
  printTime();
  setLevelDiv.classList.toggle("hidden");
  displayLevel.classList.toggle("hidden");
  scoreboard.classList.toggle("hidden");
  playAgainBtn.classList.toggle("hidden");
  if (!qaDisplay.classList.contains("hidden")) {
    qaDisplay.classList.toggle("hidden");
  }
  counterCorrect = 0;
  scoreboardCorrect.textContent = `${counterCorrect}`;
  counterIncorrect = 0;
  scoreboardIncorrect.textContent = `${counterIncorrect}`;
  setLevel;
  checkAnswer;
}

function setLevel(evt) {
  const level = evt.target.id;
  myAudio.play();
  console.log(level);
  if (level === 'easy') {
    nextQuestion(easyQuestions);
    difficulty = easyQuestions;
  } else if (level === 'medium') {
    nextQuestion(mediumQuestions);
    difficulty = mediumQuestions;
  } else {
    nextQuestion(hardQuestions);
    difficulty = hardQuestions;
  }
  reloadBtn.classList.remove("hidden");
  setLevelDiv.classList.toggle("hidden");
  displayLevel.classList.toggle("hidden");
  scoreboard.classList.toggle("hidden");
  if (!earthAnimation.classList.contains("hidden")) {
    earthAnimation.classList.toggle("hidden");
  }
  if (timingDiv.classList.contains("hidden")) {
    timingDiv.classList.toggle("hidden");
  }
  displayLevel.textContent = `Difficulty: ${level.charAt(0).toUpperCase() + level.slice(1)}`;
  chronometer.startClick(printTime);
}

function nextQuestion(setLevel) {    
  // Randomly select a number from the questionNumberArray, which will be the question asked
  let randomQuestion = questionNumberArray[Math.floor(Math.random()*questionNumberArray.length)];
  console.log(randomQuestion);

  // Remove that question from the array so it can't be asked again
  for (let i = 0; i < questionNumberArray.length; i++) {
    if (questionNumberArray[i] === randomQuestion) {
      questionNumberArray.splice(i, 1);
    }
  }
  console.log(questionNumberArray);

  let results = setLevel[randomQuestion];
  const newQuestion = results.question; 
  correctAnswer = results.correct_answer;
  incorrectAnswers = results.incorrect_answers;
  console.log(correctAnswer);
  console.log(incorrectAnswers);
  if (qaDisplay.classList.contains("hidden")) {
    qaDisplay.classList.toggle("hidden");
  }
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

const optionsCards = document.querySelectorAll('.option');  

function displayOptions(correctAnswer, incorrectAnswers) {
  let optionsArray = [];
  optionsArray.push(correctAnswer);
  optionsArray.push(incorrectAnswers);
  optionsArray = shuffleArray(optionsArray.flat()); // puts all 4 options into array and shuffles order

  const optionsCards = document.querySelectorAll('.option');  
  for (let i = 0; i < optionsCards.length; i++) {
    optionsCards[i].textContent = `${optionsArray[i]}`
  }
}

optionsCards.forEach((btn) => (btn.onclick = checkAnswer));

const scoreboardCorrect = document.getElementById('correct');
const scoreboardIncorrect = document.getElementById('incorrect');
let counterCorrect = 0;
let counterIncorrect = 0;
const playAgainBtn = document.getElementById('play-again');

// Play sound when user answers question
function playAudio(url) {
  new Audio(url).play();
}

function checkAnswer(evt) {
  myAudio.pause();
  const choice = evt.target.textContent;
  console.log(choice === correctAnswer); // compare user's choice to correct answer
  if (choice === correctAnswer) {
    counterCorrect += 1;
    playAudio("audio/lightapplause.mp3");
    scoreboardCorrect.textContent = `${counterCorrect}`;
    if (counterCorrect === 3) {
      console.log("You beat the game!");
      playAgainBtn.classList.toggle("hidden");
      qaDisplay.classList.toggle("hidden");
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
      console.log("Game over for you!");
      playAgainBtn.classList.toggle("hidden");
      chronometer.stopClick()
      myAudio.play();
    } else {
      nextQuestion(difficulty);
    }
  }
}

playAgainBtn.onclick = newGame;



function refreshPage(){
  window.location.reload();
} 

reloadBtn.onclick = refreshPage;


// TO DO: 
// Write game over function so that user can't keep playing once the game ends. Celebration pop up? Remove QA display and replace it with Play Again button
// Last button selected stays dark when you move to the next question
// Keep navbar? About page?