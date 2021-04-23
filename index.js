const easyURL = "https://opentdb.com/api.php?amount=50&category=22&difficulty=easy&type=multiple";
const mediumURL = "https://opentdb.com/api.php?amount=50&category=22&difficulty=medium&type=multiple";
const difficultURL = "https://opentdb.com/api.php?amount=50&category=22&difficulty=hard&type=multiple ";

  
axios
  .get(easyURL)
  .then((serverResponse) => {
    console.log(serverResponse.data.results);
    const results = serverResponse.data.results[0]; // to do: randomize index & once question has been asked, remove it from the array
    const newQuestion = results.question; 
    const correctAnswer = results.correct_answer;
    const incorrectAnswers = results.incorrect_answers;
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

// Fisher-Yates shuffle
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
  console.log(choice);
  return choice;
}

// need to figure out how to compare this to correct answer