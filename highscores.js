const highScoresList = document.getElementById('highScoresList');
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

highScoresList.innerHTML = highScores.map( score => {
    return `<li class="high-score">${score.quiz} - ${score.name} - ${score.score} - ${score.percent}% - ${score.takendate}</li>`;
}).join("");