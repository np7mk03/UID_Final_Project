
// Quiz functionality for StrengthWise - 10 Minute Version

function initQuizOptions() {
    // Quiz state
    let currentQuestionIndex = 0;
    const userAnswers = new Array(5).fill(null);
    let quizSubmitted = false;

    // Correct answers (index of correct option for each question)
    const correctAnswers = [1, 1, 2, 2, 2];

    // DOM elements
    const questionsContainer = document.getElementById('questions-container');
    const currentQuestionEl = document.getElementById('current-question');
    const progressBar = document.getElementById('quiz-progress-bar');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    const resultsCard = document.getElementById('results-card');
    const scoreValue = document.getElementById('score-value');
    const correctCount = document.getElementById('correct-count');

    function updateQuestion() {
        currentQuestionEl.textContent = currentQuestionIndex + 1;
        const progressPercentage = ((currentQuestionIndex + 1) / 5) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        progressBar.setAttribute('aria-valuenow', progressPercentage);

        document.querySelectorAll('.quiz-question').forEach((question, index) => {
            question.style.display = index === currentQuestionIndex ? 'block' : 'none';
        });

        prevBtn.disabled = currentQuestionIndex === 0;
        nextBtn.disabled = currentQuestionIndex === 4;
    }

    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function () {
            if (quizSubmitted) return;
            const questionIndex = parseInt(this.dataset.questionIndex);
            const optionIndex = parseInt(this.dataset.optionIndex);

            userAnswers[questionIndex] = optionIndex;

            document.querySelectorAll(`.quiz-option[data-question-index="${questionIndex}"]`).forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    prevBtn?.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            updateQuestion();
        }
    });

    nextBtn?.addEventListener('click', () => {
        if (currentQuestionIndex < 4) {
            currentQuestionIndex++;
            updateQuestion();
        }
    });

    submitBtn?.addEventListener('click', () => {
        quizSubmitted = true;
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === correctAnswers[index]) {
                score++;
            }
        });

        scoreValue.textContent = `${(score / 5) * 100}%`;
        correctCount.textContent = score;
        resultsCard.style.display = 'block';
    });

    updateQuestion(); // Initialize quiz on page load
}

// Automatically initialize if this is the quiz page
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('quiz-page')) {
        initQuizOptions();
    }
});
