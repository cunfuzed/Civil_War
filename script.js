const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");

const questionText = document.getElementById("questionText");

const buttons = [button1, button2, button3, button4];

let questions = [
  ["what is 6", "6", "5", "2", "1"]
];

let currentQuestion;

function changeScene(scene) {

  document.querySelectorAll('.scene').forEach(el => {
    el.classList.remove('visible');
  });

  document.getElementById(scene).classList.add('visible');

  if(scene === "game"){
    generateQuestion();
  }
}

function generateQuestion() {

  currentQuestion =
    questions[Math.floor(Math.random() * questions.length)];

  questionText.innerHTML = currentQuestion[0];

  let answers = currentQuestion.slice(1);

  answers.sort(() => Math.random() - 0.5);

  for(let i = 0; i < 4; i++){
    buttons[i].innerHTML = answers[i];
  }
}

window.addEventListener("DOMContentLoaded", () => {

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      if(button.innerHTML === currentQuestion[1]){
        console.log("correct");
      } else {
        console.log("incorrect");
      }

    });

  });

});
