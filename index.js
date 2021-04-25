const easyURL = "https://opentdb.com/api.php?amount=50&category=22&difficulty=easy&type=multiple";
const mediumURL = "https://opentdb.com/api.php?amount=50&category=22&difficulty=medium&type=multiple";
const difficultURL = "https://opentdb.com/api.php?amount=50&category=22&difficulty=hard&type=multiple ";

// Create an array with numbers 0 - 49 for each question
let questionNumberArray = [];
for (let i = 0; i < 50; i++) {
  questionNumberArray.push(i);
}

let correctAnswer = '';
let incorrectAnswers = [];
  
axios
  .get(easyURL)
  .then((serverResponse) => {
    console.log(serverResponse.data.results);

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

    const results = serverResponse.data.results[randomQuestion];
    const newQuestion = results.question; 
    correctAnswer = results.correct_answer;
    incorrectAnswers = results.incorrect_answers;
    console.log(correctAnswer);
    console.log(incorrectAnswers);
    displayQuestion(newQuestion);
    displayOptions(correctAnswer, incorrectAnswers)
  })
  .catch((serverError) => {
    console.error(serverError);
  });
  
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

  for (let i = 0; i < optionsCards.length; i++) {
    optionsCards[i].innerHTML = `<p>${optionsArray[i]}</p>`
  }
}

optionsCards.forEach((btn) => (btn.onclick = checkAnswer));

function checkAnswer(evt) {
  const choice = evt.target.textContent;
  console.log(choice === correctAnswer); // compare user's choice to correct answer
  if (choice === correctAnswer) {
    console.log("Eres un crack de la geografía!")
  } else {
    console.log("Womp womp... wrong.")
  }
  // figure out how to display next question
}