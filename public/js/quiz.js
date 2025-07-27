document.addEventListener('DOMContentLoaded', () => {
  const generateQuestionBtn = document.getElementById('generateQuestionBtn');
  const quizActiveArea = document.getElementById('quizActiveArea');
  const questionTextEl = document.getElementById('questionText');
  const answerOptionsContainer = document.getElementById('answerOptionsContainer');
  const quizFeedbackEl = document.getElementById('quizFeedback');

  const sampleQuestions = [
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: "Paris"
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: "Mars"
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: "Pacific Ocean"
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
      correctAnswer: "Leonardo da Vinci"
    },
    {
      question: "What is the chemical symbol for water?",
      options: ["O2", "H2O", "CO2", "NaCl"],
      correctAnswer: "H2O"
    }
  ];

  let currentQuestion = null;
  let questionsAnsweredInSession = 0; // Could be used for cycling or limiting

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function displayQuestion() {
    // Select a random question that hasn't been shown recently (simple random for now)
    // For a more robust system, you'd track used questions.
    currentQuestion = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];

    questionTextEl.textContent = currentQuestion.question;
    answerOptionsContainer.innerHTML = ''; // Clear previous options
    quizFeedbackEl.textContent = '';
    quizFeedbackEl.className = 'quiz-feedback'; // Reset feedback class

    const shuffledOptions = shuffleArray([...currentQuestion.options]);

    shuffledOptions.forEach(option => {
      const button = document.createElement('button');
      button.classList.add('answer-option-btn');
      button.textContent = option;
      button.addEventListener('click', handleAnswerSelection);
      answerOptionsContainer.appendChild(button);
    });

    quizActiveArea.style.display = 'flex';
  }

  function handleAnswerSelection(event) {
    const selectedButton = event.target;
    const selectedAnswer = selectedButton.textContent;

    // Disable all answer buttons
    const answerButtons = answerOptionsContainer.querySelectorAll('.answer-option-btn');
    answerButtons.forEach(btn => btn.disabled = true);

    selectedButton.classList.add('selected');

    if (selectedAnswer === currentQuestion.correctAnswer) {
      selectedButton.classList.add('correct');
      quizFeedbackEl.textContent = "Correct!";
      quizFeedbackEl.classList.add('correct');
    } else {
      selectedButton.classList.add('incorrect');
      quizFeedbackEl.textContent = `Incorrect. The correct answer is: ${currentQuestion.correctAnswer}`;
      quizFeedbackEl.classList.add('incorrect');
      // Highlight the correct answer as well
      answerButtons.forEach(btn => {
        if (btn.textContent === currentQuestion.correctAnswer) {
          btn.classList.add('correct');
        }
      });
    }
    questionsAnsweredInSession++;
  }

  generateQuestionBtn.addEventListener('click', () => {
    displayQuestion();
  });

  // Optional: Load a question on initial page load if desired
  // displayQuestion(); 
});
