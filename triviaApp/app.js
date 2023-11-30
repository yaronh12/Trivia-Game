
const qDiv = document.querySelector('#question');
const answers = document.querySelectorAll('#answers label');
const radios = document.querySelectorAll('#answers input');
const num = document.querySelector('#howMany');
const btnNext = document.querySelector('#next');
const countSpan = document.querySelector('#qNum');
const modalUpBtn = document.querySelector('button');
const correctAns = document.querySelector('#correctAns');
const howManyQ = document.querySelector('#howManyQ');
const startBtn = document.querySelector('#startOver');
const closeModalBtn = document.querySelector('#close');
const modalH1 = document.querySelector('h1');
const results = document.querySelector('#results');
const settingsBtn = document.querySelector('#settingsBtn');
const settingsForm = document.querySelector('#settingsForm');
const categoriesSelect = document.querySelector('#categories');
const inputNum = document.querySelector('#quantity');
const inputDifficulty = document.querySelector('#userInputDiff');
const categoryNameSpan = document.querySelector('#categoryNameSpan');
const diffBadgeSpan = document.querySelector('#diffBadge');
const alertBtn = document.querySelector('#showAlert');
const alertDiv = document.querySelector('#alert');
const alertSpan = document.querySelector('#alertText');
const menuBtn = document.querySelector('#menuBtn');
let rightAnswerLabelIndex;
let howMany;
let questions = [];
let correctCount;
let selectedId = 9;
let reqCatNumQ;


const categoriesList = async () => {
    const reqCat = await axios.get("https://opentdb.com/api_category.php");
    console.dir(reqCat);
    let newOption = document.createElement('option');
    newOption.innerText = reqCat.data.trivia_categories[0].name;
    newOption.value = 9;
    newOption.selected = true;
    categoriesSelect.append(newOption);
    for (let i = 1; i < reqCat.data.trivia_categories.length; i++) {
        let newOption = document.createElement('option');
        newOption.innerHTML = reqCat.data.trivia_categories[i].name;
        newOption.value = reqCat.data.trivia_categories[i].id;
        categoriesSelect.append(newOption);
    }
}

categoriesList()
    .then(() => {
        console.log("resolved");
    })
    .catch(() => {
        console.log('ERROR!!!Here');
    })

modalUpBtn.click();

categoriesSelect.addEventListener('change', async () => {
    selectedId = categoriesSelect.options[categoriesSelect.selectedIndex].value;
    console.log(selectedId);
    reqCatNumQ = await axios.get(`https://opentdb.com/api_count.php?category=${selectedId}`);
    console.dir(reqCatNumQ);
    const diff = inputDifficulty.value;
    switch (diff) {
        case 'easy': {
            inputNum.max = reqCatNumQ.data.category_question_count.total_easy_question_count - 1;
            break;
        }
        case 'medium': {
            inputNum.max = reqCatNumQ.data.category_question_count.total_medium_question_count - 1;
            break;
        }
        case 'hard': {
            inputNum.max = reqCatNumQ.data.category_question_count.total_hard_question_count - 1;
            break;
        }
        default: {
            inputNum.max = 50;
            break;
        }
    }
    if (inputNum.max < parseInt(inputNum.value))
        inputNum.value = inputNum.max;
})



inputDifficulty.addEventListener('change', () => {
    const diff = inputDifficulty.value;
    switch (diff) {
        case 'easy': {
            inputNum.max = reqCatNumQ.data.category_question_count.total_easy_question_count - 1;
            break;
        }
        case 'medium': {
            inputNum.max = reqCatNumQ.data.category_question_count.total_medium_question_count - 1;
            break;
        }
        case 'hard': {
            inputNum.max = reqCatNumQ.data.category_question_count.total_hard_question_count - 1;
            break;
        }
        default: {
            inputNum.max = 50;
            break;
        }
    }

    if (inputNum.max < parseInt(inputNum.value))
        inputNum.value = inputNum.max;

})


const startGame = async (numOfQ, category, difficulty) => {
    console.log(numOfQ, category, difficulty);
    const reqCat = await axios.get(`https://opentdb.com/api.php?amount=${numOfQ}&category=${category}&difficulty=${difficulty}&type=multiple`);
    howMany = reqCat.data.results.length;
    correctCount = 0;
    let q, r, w1, w2, w3;
    for (let i = 0; i < howMany; i++) {
        q = decode(reqCat.data.results[i].question);
        r = decode(reqCat.data.results[i].correct_answer);
        w1 = decode(reqCat.data.results[i].incorrect_answers[0]);
        w2 = decode(reqCat.data.results[i].incorrect_answers[1]);
        w3 = decode(reqCat.data.results[i].incorrect_answers[2]);
        questions[i] = {
            q: q,
            r: r,
            w1: w1,
            w2: w2,
            w3: w3
        };
    }
}

function decode(str) {

    let txt = document.createElement("textarea");

    txt.innerHTML = str;

    return txt.value;

}

const printQuestion = (question) => {

    qDiv.innerText = question.q;
    const answersMix = [question.r, question.w1, question.w2, question.w3];
    let rnd;
    while (answersMix.length != 0) {
        rnd = Math.floor(Math.random() * (answersMix.length));
        if (answersMix[rnd] === question.r) {
            rightAnswerLabelIndex = answersMix.length - 1;
        }
        answers[answersMix.length - 1].innerText = `${answersMix.length}. ${answersMix.splice(rnd, 1)}`;


    }

}




settingsBtn.addEventListener('click', () => {
    settingsForm.classList.remove('d-none');
    settingsBtn.classList.add('d-none');
    alertDiv.classList.add('d-none');
    inputNum.value = 10;
})

alertBtn.addEventListener('click', () => {
    alertDiv.classList.remove('d-none');
})

menuBtn.addEventListener('click', () => {
    modalUpBtn.click();
    closeModalBtn.classList.remove('d-none');
    modalH1.innerText = 'To continue press - X';
    results.classList.add('d-none');
    alertDiv.classList.add('d-none');
})


startBtn.addEventListener('click', () => {
    if (parseInt(inputNum.value) >= 1 && parseInt(inputNum.value) <= 50) {
        startGame(inputNum.value, categoriesSelect.value, inputDifficulty.value)
            .then(() => {
                btnNext.classList.remove('disabled');
                console.log("IN!!!");
                qDiv.classList.remove('text-center');
                printQuestion(questions[0]);
                num.innerText = howMany;
                countSpan.innerText = '1';
                categoryNameSpan.innerText = categoriesSelect.options[categoriesSelect.selectedIndex].text;
                diffBadgeSpan.innerText = inputDifficulty.value;
                closeModalBtn.click();

                if (modalH1.innerText != 'Trivia App') {
                    btnNext.classList.remove('disabled');
                }
                else {
                    setTimeout(() => {
                        modalH1.innerText = 'Game Over';
                        startBtn.innerText = 'Start Over';
                        results.classList.toggle('d-none');

                    }, 1000)
                }
            })
            .catch(() => {
                qDiv.innerText = 'Loading...';
                qDiv.classList.add('text-center');
                alertSpan.innerText = `too many questions. please select fewer than ${inputNum.max}. if still doesnwt work, select fewer questions.`;
                alertBtn.click();
                console.log('ERROR!!!!');
            })
    }
    else {
        if (inputNum.value == '' || parseInt(inputNum.value) < 1) {
            alertSpan.innerText = 'please enter at least 1';
        }
        else {
            if (parseInt(inputNum.value) > inputNum.max)
                alertSpan.innerText = `please enter number lower than ${inputNum.max}`;
        }
        alertBtn.click();
    }
})



btnNext.addEventListener('click', () => {
    const checkedRadio = document.querySelector('input[name="options"]:checked');
    let isCorrect;
    btnNext.classList.add('disabled');
    radios.forEach((radio) => {
        radio.disabled = !radio.disabled;
    });

    if (checkedRadio) {
        const userAnswer = checkedRadio.nextElementSibling.innerText.substring(3);
        const rightAnswer = questions[parseInt(countSpan.innerText) - 1].r;
        if (userAnswer === rightAnswer) {
            checkedRadio.nextElementSibling.classList.replace('btn-outline-primary', 'btn-outline-success');
            isCorrect = true;
            correctCount++;
        }
        else {
            checkedRadio.nextElementSibling.classList.replace('btn-outline-primary', 'btn-outline-danger');
            answers[rightAnswerLabelIndex].classList.replace('btn-outline-primary', 'btn-success');
            isCorrect = false;
        }
        setTimeout(() => {
            checkedRadio.checked = false;
            radios.forEach((radio) => {
                radio.disabled = !radio.disabled;
            });
            if (isCorrect) {
                checkedRadio.nextElementSibling.classList.replace('btn-outline-success', 'btn-outline-primary');
            }
            else {
                checkedRadio.nextElementSibling.classList.replace('btn-outline-danger', 'btn-outline-primary');
                answers[rightAnswerLabelIndex].classList.replace('btn-success', 'btn-outline-primary');
            }
            if (parseInt(countSpan.innerText) != howMany) {
                countSpan.innerText = parseInt(countSpan.innerText) + 1;
                printQuestion(questions[parseInt(countSpan.innerText) - 1]);
                btnNext.classList.remove('disabled');
            }
            else {
                settingsBtn.classList.remove('d-none');
                settingsForm.classList.add('d-none');
                correctAns.innerText = correctCount;
                howManyQ.innerText = howMany;
                closeModalBtn.classList.add('d-none');
                modalH1.innerText = 'Game Over';
                results.classList.remove('d-none');
                modalUpBtn.click();
            }
        }, 2000)
    }
    else {
        btnNext.classList.remove('disabled');
        radios.forEach((radio) => {
            radio.disabled = !radio.disabled;
        });
        alert(`Please select an answer.`)
    }


})








