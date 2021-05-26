const username = document.getElementById('username');
const finalScore = document.getElementById('finalScore');
const chosenquiz = document.getElementById('chosenquiz');
const chosenpercent = document.getElementById('percent');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const quizChosen = localStorage.getItem('quiz');
const quizPercent = localStorage.getItem('percent');

finalScore.innerText = 'Score ' + mostRecentScore;
chosenquiz.innerText = quizChosen;
chosenpercent.innerText = 'Percent ' + quizPercent;

username.addEventListener('keyup', () => {
    console.log("Inside here");
    saveScoreBtn.disabled = !username.value;
})

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 25;

saveHighScore = e => {
    console.log("Clicked the save button!");
    e.preventDefault();

    var d = new Date();
    let result = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDay() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getMinutes();
    const score = {
        quiz: quizChosen,
        percent: quizPercent,
        score: mostRecentScore,
        name: username.value,
        takendate: result
    };
    highScores.push(score);
    highScores.sort((a, b) => b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);

    localStorage.setItem("highScores", JSON.stringify(highScores));
    window.location.assign("./");
};