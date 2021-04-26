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

difficultyBtns.forEach((btn) => (btn.onclick = setLevel));

function newGame() {
  chronometer.resetClick();
  printTime();
  setLevelDiv.classList.toggle("hidden");
  displayLevel.classList.toggle("hidden");
  scoreboard.classList.toggle("hidden");
  playAgainBtn.classList.toggle("hidden");
  qaDisplay.classList.toggle("hidden");
  counterCorrect = 0;
  scoreboardCorrect.textContent = `${counterCorrect}`;
  counterIncorrect = 0;
  scoreboardIncorrect.textContent = `${counterIncorrect}`;
  setLevel;
  checkAnswer;
}

function setLevel(evt) {
  const level = evt.target.id;
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
  setLevelDiv.classList.toggle("hidden");
  displayLevel.classList.toggle("hidden");
  scoreboard.classList.toggle("hidden");
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
    optionsCards[i].innerHTML = `<p>${optionsArray[i]}</p>`
  }
}

optionsCards.forEach((btn) => (btn.onclick = checkAnswer));

const scoreboardCorrect = document.getElementById('correct');
const scoreboardIncorrect = document.getElementById('incorrect');
let counterCorrect = 0;
let counterIncorrect = 0;
const playAgainBtn = document.getElementById('play-again');

function checkAnswer(evt) {
  const choice = evt.target.textContent;
  console.log(choice === correctAnswer); // compare user's choice to correct answer
  if (choice === correctAnswer) {
    console.log("Eres un(a) crack de la geografía!")
    counterCorrect += 1;
    scoreboardCorrect.textContent = `${counterCorrect}`;
    if (counterCorrect === 10) {
      console.log("You beat the game!");
      playAgainBtn.classList.toggle("hidden");
      chronometer.stopClick()
      printSplit(difficulty);
    } else {
      nextQuestion(difficulty);
    }
  } else {
    console.log("Womp womp... wrong.");
    counterIncorrect += 1;
    scoreboardIncorrect.textContent = `${counterIncorrect}`;
    if (counterIncorrect === 3) {
      console.log("Game over for you!");
      playAgainBtn.classList.toggle("hidden");
      chronometer.stopClick()
    } else {
      nextQuestion(difficulty);
    }
  }
}

playAgainBtn.onclick = newGame;



// //play audio with out html audio tag
// const myAudio = new Audio('audio/mbb-beach.mp3');
// myAudio.play();