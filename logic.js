var answer;
var score = 0;
backgrounds = [];

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function nextQuestion() {
    const n1 = getRandomInt(5);
    document.querySelector('#n1').innerHTML = n1;
    const n2 = getRandomInt(5);
    document.querySelector('#n2').innerHTML = n2;

    answer = n1 + n2;
}

function checkAnswer() {
    prediction = predictImage();
    console.log(`Answer: ${answer} - User: ${prediction}`);
    if (prediction == answer) {
        score++;
        if (score < 7)
            backgrounds.push(`url("images/background${score}.svg")`);
        else {
            restartGame(win=true);
        }
    } else {
        backgrounds.pop();
        score--;
        if (score < 0)
            restartGame(win=false);
    }
    setTimeout(() => {        
        document.body.style.backgroundImage = backgrounds;
    }, 200);
    console.log(`Score: ${score}`);
}

function restartGame(win=true) {
    if (win)
        alert('Victory! Restarting the Game...');
    else
        alert('Loser! Try again...');
    score = 0;
    backgrounds.length = 0;
}