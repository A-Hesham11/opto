// Select Element
let category = document.querySelector(".quiz-info .category");
let countSpan = document.querySelector(".quiz-info .count span");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area")
let bullets = document.querySelector(".bullets")
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");

// Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
    
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function() {

        if (this.readyState === 4 && this.status === 200) {

            let questionsObject = JSON.parse(this.responseText);

            let qCount = questionsObject.length;
            console.log(qCount)

            // Create Bullets + Set Questions Number
            createBullets(qCount);

            // Add Question Data
            addQuestionData(questionsObject[currentIndex], qCount);

            // Start Count Down
            countDown(60, qCount);

            // Click On Submit
            submitButton.onclick = () => {

                // Get Right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;

                // Increase The Index
                currentIndex++;

                // Check The Answer
                checkAnswer(theRightAnswer, qCount);

                // Remove Previous Question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";

                // Add Next Question Data
                addQuestionData(questionsObject[currentIndex], qCount);

                // Handle Bullets Class
                handleBullets();

                // Start Count Down 
                clearInterval(countDownInterval);
                countDown(60, qCount);

                // Show Results
                showResults(qCount);
            
            };
        };
    };

    myRequest.open("GET", "Opto.json", true);
    myRequest.send();

};
getQuestions();

function createBullets(num) {

    countSpan.innerHTML = num;

    // Create Spans 
    for (let i = 1; i <= num; i++) {

        // Create Span 
        let theBullets = document.createElement("span");

        // Check If Its First Span
        if (i === 1) {

            theBullets.className = "active";

        };

        // Append Bullets To Main Bullet Container
        bulletsSpanContainer.appendChild(theBullets);
    };

};


function addQuestionData(obj, count) {

    if (currentIndex < count) {

            // Create H2 Question Title
    let questionTitle = document.createElement("h2");

    // Create Question Text
    let questionText = document.createTextNode(obj.title);

    // Append Text To H2
    questionTitle.appendChild(questionText);

    // Append H2 To Quiz Area
    quizArea.appendChild(questionTitle);

    // Create The Answer
    for (let i = 1; i <= 4; i++) {

        // Create Main Answer div
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";

        // Create Radio Input
        let inputRadio = document.createElement("input");
        
        // Add Type + Name + Id + Data-Attrebute
        inputRadio.name = "question";
        inputRadio.type = "radio";
        inputRadio.id = `answer_${i}`;
        inputRadio.dataset.answer = obj[`answer_${i}`];

        // Create label
        let TheLabel = document.createElement("label");

        // Add For Attribute
        TheLabel.htmlFor = `answer_${i}`;

        // Create Label Text
        let TheLabelText = document.createTextNode(obj[`answer_${i}`]);

        // Add The Text To Label
        TheLabel.appendChild(TheLabelText);

        // Add The Radio To Main Div
        mainDiv.appendChild(inputRadio);

        // Add The Label To Main Div
        mainDiv.appendChild(TheLabel);

        // Add All Divs To Answers Area
        answerArea.appendChild(mainDiv);

    };

    };

};

function checkAnswer(rightAnswer, count) {

    let answers = document.getElementsByName("question");
    let theChoosenAnswer ;

    for (let i = 0; i < answers.length; i++) {

        if (answers[i].checked) {

            theChoosenAnswer = answers[i].dataset.answer;
        };
    };

    if (rightAnswer === theChoosenAnswer) {

        rightAnswers++;

    };
};

// Function Handle Bullets Class
function handleBullets() {

    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpan = Array.from(bulletsSpan);

    arrayOfSpan.forEach((span, index) => {

        if (currentIndex === index) {

            span.className = "active";

        };
    });
};

function showResults(count) {

    let theResults;

    if (currentIndex === count) {

        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > count / 2 && rightAnswers < count) {

            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count} Is Good`;

        } else if(rightAnswers === count) {

            theResults = `<span class="perfect">Perfect</span>, All Answer Is Good`;

        } else {

            theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;

        };

        resultsContainer.innerHTML = theResults;

    };
};

function countDown(duration, count) {

    if (currentIndex < count) {

        let minutes, seconds;
        countDownInterval = setInterval(function() {

            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 60 ? `0${minutes}` : minutes;
            seconds = seconds < 60 ? `0${seconds}` : seconds;

            countDownElement.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {

                clearInterval(countDownInterval);

                submitButton.click();
                
            };

        }, 1000);
    };
};
