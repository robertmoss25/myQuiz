const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score'); 
const progressBarFull = document.getElementById('progressBarFull'); 
const loader = document.getElementById('loader'); 
const game = document.getElementById('game');
const questionlistchosen = document.getElementById('questionlistchosen');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];

let answers = [];

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

let selectedGame = getParameterByName('myGame');
let selectedTitle = getParameterByName('myTitle');
console.log(selectedGame);
questionlistchosen.innerText = selectedTitle;

////fetch("questions.json")
fetch(selectedGame)
    .then(res => {
        return res.json();
}).then(loadedQuestions => {
    questions = loadedQuestions;
    startGame();
}).catch(err => {
    console.error(err);
});

// fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
//     .then(res => {
//         return res.json();
// }).then(loadedQuestions => {
//     console.log(loadedQuestions.results);
//     questions = loadedQuestions.results.map( loadedQuestion => {
//         const formattedQuestion = {
//             question: loadedQuestion.question,
//         }
//         const answerChoices = [...loadedQuestion.incorrect_answers];
//         formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
//         answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

//         answerChoices.forEach((choice, index) => {
//             formattedQuestion["choice" + (index+1)] = choice;
//         });

//         return formattedQuestion;
//     })
//     ////questions = loadedQuestions;
//     startGame();
// }).catch(err => {
//     console.error(err);
// });

// CONSTANTS
const CORRECT_BONUS = 10;
let MAX_QUESTIONS = 3;

startGame = () => {
    questionCounter = 0;
    MAX_QUESTIONS = questions.length;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
}

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("./end.html");
    }
    questionCounter++;
    progressText.innerHTML = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // Update the progress bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    let value = parseInt(currentQuestion.multi);
    if (value > 1)
        question.innerText = currentQuestion.question + " ( Pick " + value + ")";
    else
        question.innerText = currentQuestion.question;
    if (currentQuestion.question.length > 450)
    {
        question.classList.remove('question');
        question.classList.add('questionlong');
    }
    else
    {
        question.classList.add('question');
        question.classList.remove('questionlong');
    }

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        let questionID = null; 
        if (number == '1')
            questionID = document.getElementById('One');
        else if (number == '2')
            questionID = document.getElementById('Two');
        else if (number == '3')
            questionID = document.getElementById('Three');
        else if (number == '4')
            questionID = document.getElementById('Four'); 
        else if (number == '5')
            questionID = document.getElementById('Five');
        else if (number == '6')
            questionID = document.getElementById('Six'); 
        else if (number == '7')
            questionID = document.getElementById('Seven'); 
        if (currentQuestion["choice" + number] == undefined || currentQuestion["choice" + number] == 'Filler')
        {   
            questionID.setAttribute("style", "display: none;");
        }
        else
        {
            choice.innerText = currentQuestion["choice" + number];
            questionID.removeAttribute("style", "display: none;");
        }
    });

    availableQuestions.splice(questionIndex,1);
    answers.length = 0;

    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers)
            return;
        console.log("multi is " + currentQuestion.multi);
        if (currentQuestion.multi != 0)
        {
            answers.push(e.target);
            if (answers.length == currentQuestion.multi)
            {
                let correctAnswer = 0;
                let answerArr = currentQuestion.answer.split(',');
                for (let index = 0; index < answerArr.length; index++) 
                {
                    const element = answerArr[index];
                    for (let index2 = 0; index2 < answers.length; index2++) 
                    {
                        const element2 = answers[index2];
                        const selectedAnswer = element2.dataset["number"];
                        if (element == selectedAnswer)
                        {
                            console.log(element + " " + selectedAnswer);
                            correctAnswer++;
                            break;
                        }
                    }   
                }

                if (correctAnswer == answers.length)
                {
                    for (let index = 0; index < answers.length; index++)
                    {
                        classToApply = 'correct';
                        answers[index].parentElement.classList.remove('chosen');
                        answers[index].parentElement.classList.add(classToApply);
                    }
                    incrementScore(classToApply == "correct" ? CORRECT_BONUS : 0);

                    setTimeout( () => {
                        for (let index = 0; index < answers.length; index++)
                        {
                            answers[index].parentElement.classList.remove(classToApply);
                        }                        
                        getNewQuestion();
                    }, 1000);
                }
                else
                {
                    for (let index = 0; index < answers.length; index++)
                    {
                        classToApply = 'incorrect';
                        answers[index].parentElement.classList.add(classToApply);
                        answers[index].parentElement.classList.remove('chosen');
                    }
                    incrementScore(classToApply == "correct" ? CORRECT_BONUS : 0);

                    setTimeout( () => {
                        for (let index = 0; index < answers.length; index++)
                        {
                            answers[index].parentElement.classList.remove(classToApply);
                        }                        
                        getNewQuestion();
                    }, 1000);
                }
            }
            else
            {
                const selectedChoice = e.target;
                const selectedAnswer = selectedChoice.dataset["number"];

                classToApply = 'chosen';
                selectedChoice.parentElement.classList.add(classToApply);
            }
        }
        else
        {
            acceptingAnswers = false;
            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset["number"];

            let classToApply = 'incorrect';
            if (selectedAnswer == currentQuestion.answer) {
                classToApply = 'correct';
            }
            incrementScore(classToApply == "correct" ? CORRECT_BONUS : 0);
            selectedChoice.parentElement.classList.add(classToApply);

            setTimeout( () => {
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();
            }, 1000);
        }
    })
});

incrementScore = num => {
    score += num;
    let currentPercent = ((score / 10) / questionCounter) * 100;
    scoreText.innerText = score + " (" + currentPercent.toFixed(2) + "%)";
};

// startGame();