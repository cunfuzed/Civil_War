const BORDER = 11;
const CELL   = 72;


function generateSpiral(border, cell, grid = 10, gap = 1) {

  const center = n =>
    Math.round(border + n * cell + cell / 2);

  const step = gap + 1;

  const path = [];

  let top = 0;
  let bottom = grid - 1;
  let left = 0;
  let right = grid - 1;

  // Clockwise spiral starting bottom-left
  while (top <= bottom && left <= right) {

    // ↑ up left column
    for (let r = bottom; r >= top; r--) {
      path.push([center(left), center(r)]);
    }
    left += step;

    // → across top row
    for (let c = left; c <= right; c++) {
      path.push([center(c), center(top)]);
    }
    top += step;

    // ↓ down right column
    if (left <= right) {
      for (let r = top; r <= bottom; r++) {
        path.push([center(right), center(r)]);
      }
      right -= step;
    }

    // ← across bottom row
    if (top <= bottom) {
      for (let c = right; c >= left; c--) {
        path.push([center(c), center(bottom)]);
      }
      bottom -= step;
    }
  }

  return path;
}

const boardSpaces   = generateSpiral(BORDER, CELL);
const TOTAL_SPACES  = boardSpaces.length;


const DEBUG = false;

function debugOverlay() {
  if (!DEBUG) return;
  // Remove any old overlay dots first
  document.querySelectorAll('.debug-dot').forEach(d => d.remove());

  boardSpaces.forEach(([x, y], i) => {
    const dot = document.createElement('div');
    dot.className = 'debug-dot';
    dot.style.cssText = `
      position: absolute;
      width: 18px; height: 18px;
      background: rgba(255,255,0,0.85);
      border: 1px solid black;
      border-radius: 50%;
      left: ${x}px; top: ${y}px;
      transform: translate(-50%, -50%);
      z-index: 50;
      font-size: 7px;
      display: flex; align-items: center; justify-content: center;
      pointer-events: none;
    `;
    dot.textContent = i;
    const wrap = document.getElementById('board-wrap');
    if (wrap) wrap.appendChild(dot);
  });
}

// Player state
let playerPos  = 0;
let lastDieRoll = 0;

// DOM refs (keep yours)
const button1 = document.getElementById("button1");
const button2 = document.getElementById("button2");
const button3 = document.getElementById("button3");
const button4 = document.getElementById("button4");
const questionText   = document.getElementById("questionText");
const difficultyText = document.getElementById("difficulty-text");
const timer = document.getElementById("timer");
const buttons = [button1, button2, button3, button4];

// ── Render token on board ──
function renderPlayer() {
  let token = document.getElementById("player-token");
  if (!token) {
    token = document.createElement("div");
    token.id = "player-token";
    token.style.cssText = `
      position: absolute;
      width: 34px;
      height: 34px;
      background: gold;
      border: 4px solid black;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: left 0.45s ease, top 0.45s ease;
      pointer-events: none;
      z-index: 10;
      box-shadow: 0 0 8px rgba(0,0,0,0.6);
    `;
    document.getElementById("board-wrap").appendChild(token);
  }

  const [x, y] = boardSpaces[playerPos];
  token.style.left = x + "px";
  token.style.top  = y + "px";
}

function moveForward(value) {
  let lastPlayerPos = playerPos;
  playerPos = Math.min(playerPos + value, TOTAL_SPACES - 1);
  changeScene("board");
  setTimeout(renderPlayer, 50);

  if (playerPos >= TOTAL_SPACES - 1) {
    setTimeout(() => alert("GG"), 600);
    playerPos = 0;
    changeScene("menu");
  }

  if(lastPlayerPos<9&&playerPos>9){
    nextQuestionIsImpossible = true;
  }

  if(lastPlayerPos<17&&playerPos>17){
    nextQuestionIsImpossible = true;
  }

  if(lastPlayerPos<25&&playerPos>25){
    nextQuestionIsImpossible = true;
  }

  if(lastPlayerPos<31&&playerPos>31){
    nextQuestionIsImpossible = true;
  }

  if(lastPlayerPos<37&&playerPos>37){
    nextQuestionIsImpossible = true;
  }

  if(lastPlayerPos<41&&playerPos>41){
    nextQuestionIsImpossible = true;
  }

  if(lastPlayerPos<45&&playerPos>45){
    nextQuestionIsImpossible = true;
  }

  if(lastPlayerPos<47&&playerPos>47){
    nextQuestionIsImpossible = true;
  }
}

function moveBackward(amount) {
  changeScene("board");
  setTimeout(renderPlayer, 50);
  const penalty = Math.floor(lastDieRoll / 2);
  if(playerPos>=penalty){
    playerPos = Math.max(playerPos - amount, 0);
  }
}

function changeScene(scene) {
  document.querySelectorAll('.scene').forEach(el => el.classList.remove('visible'));
  document.getElementById(scene).classList.add('visible');

  if (scene === 'game') { 
    lastDieRoll = Math.floor(Math.random() * 6) + 1; 
    const imp = nextQuestionIsImpossible; 
    nextQuestionIsImpossible = false; 
    if(playerPos<49){generateQuestion(imp);}
  }
  if (scene === 'board') {
    for(let i = 0;i < buttons.length;i++){
      buttons[i].disabled = false;
    }
    if (boardTimeout) clearTimeout(boardTimeout);
    boardTimeout = setTimeout(()=>{ boardTimeout = null; changeScene("game"); }, 3000);
  }
}

let countDownInterval = null;
let boardTimeout = null;
let nextQuestionIsImpossible = false;

function countDown(){
  if (countDownInterval) clearInterval(countDownInterval);
  let timeLeft = 15;
  timer.innerHTML = timeLeft + " seconds left";
  countDownInterval = setInterval(() =>{
    timeLeft--;
    timer.innerHTML = timeLeft + " seconds left";
    if(timeLeft<=0){
      clearInterval(countDownInterval);
      countDownInterval = null;
      timer.innerHTML = "Time's up!";
      questionText.innerHTML = "INCORRECT";
      questionText.style.color = "red";
      setTimeout(() =>{
        questionText.style.color = "black";
        generateQuestion(false);
      },2000);
      switch(difficulty){
        case "easy":
          moveBackward(1);
        break;
        case "medium":
          moveBackward(2);
        break;
        case "hard":
          moveBackward(3);
        break;
      }
    }
  },1000);
}


let difficulty = "loading";
let currentQuestion;

let easyQuestions = [
  ["What was the first battle of the Civil War?", "Sumter", "Bull Run", "Appomattox Court House", "Antitem"],
  ["What did the president aim to abolish if the union won the Civil War?", "Slavery", "Taxes", "Civil Rights", "The Constitution"],
  ["Who won the Civil War?", "The Union", "Republicans", "Democrats", "The Confederacy"],
  ["Which side of America supported slavery?", "South", "North", "East", "West"],
  ["Who was the union president during the Civil War?", "Abraham Lincoln", "Andrew Johnson", "Jefferson Davis", "Ryan Gosling"],
  ["Who killed Abraham Lincoln?", "John Wilkes Booth", "Lee Harvey Oswald", " Jefferson Davis", "Adolf Hitler"],
  ["Which \"battle\" had no deaths?","Battle of Fort Sumter", "Battle of Bull Run", "Appomattox", "D-day"],
  ["What was the Union's original cause to fight in the civil war?","Reunite the North and South", "Abolish slavery", "Reclaim land", "Assert Dominance"],
  ["Who did Lincoln argue with in the debates that brought him to fame?", "Stephen Douglas", "Jefferson Davis", "Robert E. Lee", "John Wilkes Booth"],
  ["What was Lincoln's opinion on the secession of the South?","Outrageous", "Reasonable", "Beneficial", "Indifferent"],
];
let mediumQuestions = [
  ["Which side created the world's first Ironclad war ship?", "Confederacy", "Union", "Great Britain", "The Roman Empire"],
  ["How was General Stonewall Jackson killed?","Friendly fire", "Natural causes", "Drowning", "Diseases"],
  ["How many times did the South attempt to invade the north?", "2", "1", "3","0"],
  ["How did General Burnside lose to the confederacy during antietam?","he delayed the attack for too long", "The reinforcements never arrived", "His position was overrun", "he ordered an uphill charge"],
  ["How many years did the Civil War last?","4","3","7","12"],
  ["How many years was the Reconstruction Era right after the Civil War?","12","7","5","2"],
  ["What battle split the Confederacy in half?","Vicksburg", "Antietam", "Second Battle of Bull Run", "Fredericksburg"],
  ["General Ulysses S. Grant later became the _ U.S president","18th", "17th", "19th", "20th"],
  ["Where was Abraham Lincoln born?","Kentucky", "Washington DC", "Virginia", "Louisiana"],
];
let hardQuestions = [
  ["Which of Abraham Lincoln's sons died during the civil war?", "William Lincoln","Robert Todd Lincoln", "William Wallace Lincoln", "Thomas Lincoln"],
  ["Which of the following was not a Union general?", "James Longstreet", "Ulysses S. Grant", "George McClellan", "George Meade"],
  ["What was the union's Ironclad called?","Monitor", "Constitution", "Enterprise","Merrimack"],
  ["What was the confederacy's Ironclad called?","Manassas", "Constitution", "Montauk","Monitor"],
  ["How did 2 people die after the Battle of Fort Sumter?","Explosion", "Stray Bullet", "None, no one died during the battle", "Drowning"],
  ["What battle did Stonewall Jackson get his nickname?","Battle of Bull Run", "Battle of Antietam", "Battle of Chancellorsville","Shiloh"],
  ["Roughly how many more troops did the Union have than the Confederates at the Battle of Fredericksburg?","45 thousand", "2 times", "70 thousand", "1.25 times"],
  ["What was the name of the man who was at the start and end of the Civil War?","Wilmer Mclean", "Ambrose Burnside", "George Smith", "John Mclean"],
];
let impossibleQuestions = [
  ["How much money a month did the African American soldiers make?","$7", "$13", "$5", "$10"],
  ["Who originally owned the land that the Arlington National Cemetery is now built on?","Robert E. Lee", "It was always government owned", "George Washington", "Albert Sidney Johnston"],
  ["What nickname did John Wilkes Booth call Abraham Lincoln right before he killed him?","He didn’t call him anything", "Old Abe", "Tyrant", "Just his last name"],
  ["What did the U.S army invent during the Civil War?","Hip pocket", "Typewriter", "Wristwatch", "Crackers"],
  ["Who is Louis Powell?","John Wilkes Booth’s fellow conspirator", "A Union general", "A good friend of Abraham Lincoln", "A governer"],
  ["How many more medals of honor were administered during the Civil War than all of the other wars combined?","1942", "2574", "The other wars combined produced more medal recipients than the Civil War", "575"],
  ["What battle could be heard from 100 miles away?","Gettysburg", "Vicksburg", "Antietam", "Fredricksburg"],
  ["What was the average age of drummers during the Civil War?","18", "16", "14", "20"],
  ["What Thanksgiving food was popularized because of the Civil War?","Cranberry Sauce", "Mashed Potatoes", "Casserole", "Corn"],
  ["What was the name of one of Abraham Lincoln's pets?","Jip", "He had no pets", "Buck", "Link"],
];

function findDifficulty(isImpossible){
  if(isImpossible){
    return "impossible";
  }
  let r = Math.floor(Math.random() * 100);
  return r < 40 ? "easy" : r < 80 ? "medium" : "hard";
}

function generateQuestion(isImpossible) {
  difficulty = findDifficulty(isImpossible);
  difficultyText.innerHTML = difficulty;
  difficultyText.style.color = difficulty === "easy" ? "lightgreen" : difficulty === "medium" ? "yellow" : "red";
  difficultyText.classList.remove("animate-difficulty");
  void difficultyText.offsetWidth;
  difficultyText.classList.add("animate-difficulty");

  const pool = difficulty === "easy" ? easyQuestions : difficulty === "medium" ? mediumQuestions : difficulty === "hard" ? hardQuestions : impossibleQuestions;
  currentQuestion = pool[Math.floor(Math.random() * pool.length)];

  questionText.innerHTML = currentQuestion[0];
  let answers = currentQuestion.slice(1).sort(() => Math.random() - 0.5);
  for (let i = 0; i < 4; i++) buttons[i].innerHTML = answers[i];
  countDown();
}

// ── Answer click handler (updated) ──
window.addEventListener("DOMContentLoaded", () => {
  buttons.forEach(button => {
    button.addEventListener("click", () => {
      for(let i = 0;i<buttons.length;i++){
        buttons[i].disabled = true;
      }
      clearInterval(countDownInterval);
      countDownInterval = null;
      if (button.innerHTML === currentQuestion[1]) {
        switch(difficulty){
            case "easy":
                questionText.innerHTML = "CORRECT";
                questionText.style.color = "green";
                setTimeout(() => {
                    moveForward(1);
                    questionText.style.color = "black";
                }, 2000);
                break;
            case "medium":
                questionText.innerHTML = "CORRECT";
                questionText.style.color = "green";
                setTimeout(() => {
                    moveForward(2);
                    questionText.style.color = "black";
                }, 2000);
                break;
            case "hard":
                questionText.innerHTML = "CORRECT";
                questionText.style.color = "green";
                setTimeout(() => {
                    moveForward(3);
                    questionText.style.color = "black";
                }, 2000);
                break;
            case "impossible":
                questionText.innerHTML = "CORRECT";
                questionText.style.color = "green";
                setTimeout(() => {
                    moveForward(4);
                    questionText.style.color = "black";
                }, 2000);
                break;
        }
      } else {
        switch(difficulty){
          case "easy":
            questionText.innerHTML = "INCORRECT";
            questionText.style.color = "red";
            setTimeout(() => {
                moveBackward(1);
                questionText.style.color = "black";
                generateQuestion(false);
            }, 2000);
          break;
          case "medium":
            questionText.innerHTML = "INCORRECT";
            questionText.style.color = "red";
            setTimeout(() => {
                moveBackward(2);
                questionText.style.color = "black";
                generateQuestion(false);
            }, 2000);
          break;
          case "hard":
            questionText.innerHTML = "INCORRECT";
            questionText.style.color = "red";
            setTimeout(() =>{
                moveBackward(3);
                questionText.style.color = "black";
                generateQuestion(false);
            }, 2000);
          break;
          case "impossible":
            questionText.innerHTML = "INCORRECT";
            questionText.style.color = "red";
            setTimeout(() =>{
                moveBackward(4);
                questionText.style.color = "black";
                generateQuestion(false);
            }, 2000);
          break;
        }
      }
    });
  });
});
