const easyURL = "https://opentdb.com/api.php?amount=50&category=22&difficulty=easy&type=multiple";
const mediumURL = "https://opentdb.com/api.php?amount=50&category=22&difficulty=medium&type=multiple";
const difficultURL = "https://opentdb.com/api.php?amount=50&category=22&difficulty=hard&type=multiple ";

  
axios
  .get(easyURL)
  .then((serverResponse) => {
    console.log(serverResponse.data.results);
    displayInfo(serverResponse.data.results[8].question);
  })
  .catch((serverError) => {
    console.error(serverError);
  });
  
function displayInfo(info) {
  document.querySelector(".question").textContent = info;
}