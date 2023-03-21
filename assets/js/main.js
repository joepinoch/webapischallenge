// Start the quiz with a timer set to 75. Timer left also will be the final score.
var timeLeft = 20;
var timerID;
var timerEl = document.getElementById("timer");
var startButton = document.getElementById("test-btn");
var nextButton = document.getElementById("nxt-btn");
var questionContainerEl = document.getElementById("prompt-cntnr");
var startContainerEl = document.getElementById("start");
var questionEl = document.getElementById("prompt");
var answerButtonsEl = document.getElementById("answr-btns");
var checkAnswerEl = document.getElementById("chck-answr");
var viewHighScores = document.getElementById("highscores-link");
var submitButton = document.getElementById("submit-btn");
var clearScoreButton = document.getElementById("dlt-btn");
var initialsField = document.getElementById("player-name");
var restartButton = document.getElementById("tryagn-btn");
var scoreField = document.getElementById("player-score");
var scores = JSON.parse(localStorage.getItem("scores")) || [];

var shuffledQuestions, currentQuestionIndex;

startButton.addEventListener("click", startGame);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

// Timer
function timeTick() {
  timeLeft--;
  timerEl.textContent = "Time: " + timeLeft;
  if (timeLeft <= 0) {
    saveScore();
  }
}

// Start Function
function startGame() {
  timerID = setInterval(timeTick, 1000);
  startContainerEl.classList.add("hide");
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  questionContainerEl.classList.remove("hide");

  // Timer start
  timeTick();
  setNextQuestion();
}

function setNextQuestion() {
  resetState();
  showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// Display questions
function showQuestion(question) {
  questionEl.innerText = question.question;
  question.answers.forEach((answer) => {
    var button = document.createElement("button");
    button.innerText = answer.text;
    button.classList.add("btn");
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsEl.appendChild(button);
  });
}

// Reset state function
function resetState() {
  //clearStatusClass(document.body)
  nextButton.classList.add("hide");
  checkAnswerEl.classList.add("hide");
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  }
}

function selectAnswer(e) {
  var selectedButton = e.target;
  var correct = selectedButton.dataset.correct;
  checkAnswerEl.classList.remove("hide");
  if (correct) {
    checkAnswerEl.innerHTML = "You got it right!";
  } else {
    checkAnswerEl.innerHTML = "Sorry that was not the correct answer.";
    if (timeLeft <= 10) {
      timeLeft = 0;
    } else {
      timeLeft -= 10;
    }
  }

  Array.from(answerButtonsEl.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct);
  });

  if (shuffledQuestions.length > currentQuestionIndex + 1) {
    nextButton.classList.remove("hide");
    checkAnswerEl.classList.remove("hide");
  } else {
    startButton.classList.remove("hide");
    saveScore();
  }
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}
