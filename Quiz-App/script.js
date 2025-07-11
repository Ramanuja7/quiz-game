const quizData = [
  { question: "Which city is called Pearl City of India?", options: ["Kolkata", "Delhi", "Hyderabad", "Chennai"], answer: "Hyderabad" },
  { question: "Which city has Jantar Mantar?", options: ["Hyderabad", "Delhi", "Mumbai", "Bhopal"], answer: "Delhi" },
  { question: "Who is the Yellow Flash of the Leaf Village?", options: ["Kakashi Hatake", "Shisui Uchiha", "Minato Namikaze", "Sakura Haruno"], answer: "Minato Namikaze" },
  { question: "What is the relation between Naruto & Minato?", options: ["Grandpa & Grandson", "Grandson & Grandpa", "Father & Son", "Son & Father"], answer: "Son & Father" },
  { question: "Who is the wife of Sasuke?", options: ["Hinata", "Ino", "Sakura", "Naruto"], answer: "Sakura" },
  { question: "Who started the 4th Great Ninja War?", options: ["Madara Uchiha", "Kakashi", "Obito", "Black Zetsu"], answer: "Black Zetsu" },
  { question: "Where was Naruto born?", options: ["Leaf Village", "Sand Village", "Mist Village", "Stone Village"], answer: "Leaf Village" },
  { question: "What is the gender of Orochimaru?", options: ["Male", "Female", "Transgender", "Other"], answer: "Other" },
  { question: "Who is considered the Father of Anime?", options: ["Osamu Tezuka", "Naruto", "Bleach", "Dragon Ball"], answer: "Osamu Tezuka" },
  { question: "Who has the scariest laugh?", options: ["Light", "Black Beard", "Vegeta", "Brook"], answer: "Black Beard" },
  { question: "What is the capital of France?", options: ["Paris", "Berlin", "Madrid", "Rome"], answer: "Paris" },
  { question: "Which planet is called the Red Planet?", options: ["Earth", "Venus", "Mars", "Jupiter"], answer: "Mars" },
  { question: "What is the capital of Japan?", options: ["Tokyo", "Kokyo", "Beijing", "Wenzhou"], answer: "Tokyo" }
];

let currentQuestionIndex = 0, currentScore = 0, countdownTimer, timeLeft = 10;

const questionText = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const timerDisplay = document.getElementById('timer');
const progressBar = document.getElementById('progress');

function startNewQuiz() {
  currentQuestionIndex = currentScore = 0;
  document.getElementById('result-modal').classList.add('hide');
  document.querySelector(".quiz-box").classList.remove("hide");
  showNextQuestion();
}

function startCountdown() {
  timeLeft = 10;
  updateProgressUI();
  timerDisplay.textContent = timeLeft;
  countdownTimer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    updateProgressUI();
    if (timeLeft <= 0) {
      clearInterval(countdownTimer);
      revealCorrectAnswer();
    }
  }, 1000);
}

function updateProgressUI() {
  progressBar.style.transform = `scaleX(${timeLeft / 10})`;
}

function showNextQuestion() {
  clearInterval(countdownTimer);
  const currentQ = quizData[currentQuestionIndex];
  questionText.textContent = currentQ.question;
  optionsContainer.innerHTML = "";

  currentQ.options.forEach(opt => {
    const optId = `opt-${opt}`;
    optionsContainer.innerHTML += `
      <input type="radio" name="option" id="${optId}" value="${opt}">
      <label for="${optId}">${opt}</label>
    `;
  });

  startCountdown();
  nextButton.disabled = true;
}

function revealCorrectAnswer() {
  const selectedOption = document.querySelector("input[name='option']:checked");
  const correctAnswer = quizData[currentQuestionIndex].answer;

  document.querySelectorAll("label").forEach(label => {
    if (label.textContent === correctAnswer) {
      label.classList.add("correct");
    } else if (selectedOption && label.htmlFor === selectedOption.id) {
      label.classList.add("incorrect");
    }
  });

  if (selectedOption && selectedOption.value === correctAnswer) {
    currentScore++;
  }

  nextButton.disabled = false;
}

nextButton.onclick = () => {
  clearInterval(countdownTimer);
  currentQuestionIndex++;
  if (currentQuestionIndex < quizData.length) {
    showNextQuestion();
  } else {
    showFinalResults();
  }
};

function showFinalResults() {
  document.querySelector(".quiz-box").classList.add("hide");
  document.getElementById('result-modal').classList.remove("hide");

  const starRating = Math.round((currentScore / quizData.length) * 5);
  const starsDisplay = "★".repeat(starRating) + "☆".repeat(5 - starRating);
  document.getElementById("stars").textContent = starsDisplay;
  document.getElementById("final-score").textContent = `You scored ${currentScore}/${quizData.length}`;

  saveToLeaderboard();
  displayLeaderboard();
}

function saveToLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ score: currentScore, date: new Date().toLocaleString() });
  leaderboard.sort((a, b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard.slice(0, 5)));
}

function displayLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const leaderboardList = document.getElementById("leaderboard");
  leaderboardList.innerHTML = leaderboard.map((entry, i) =>
    `<li>${i + 1}. ${entry.score} points - ${entry.date}</li>`).join("");
}

function restartQuiz() {
  startNewQuiz();
}

// Start the quiz on page load
startNewQuiz();
