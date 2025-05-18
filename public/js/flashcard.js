
document.addEventListener('DOMContentLoaded', () => {
  const cardQuestionEl = document.getElementById('cardQuestion');
  const navIndicatorsEl = document.getElementById('navIndicators');
  const prevCardBtn = document.getElementById('prevCardBtn');
  const nextCardBtn = document.getElementById('nextCardBtn');
  const shuffleBtn = document.getElementById('shuffleBtn');
  const hintBtn = document.getElementById('hintBtn');
  const hintPopupEl = document.getElementById('hintPopup');
  const hintTextEl = document.getElementById('hintText');
  const closeHintBtn = document.getElementById('closeHintBtn');
  const starCardIconBtn = document.getElementById('starCardIconBtn');
  const starBtn = document.getElementById('starBtn'); // Action button
  const editCardBtn = document.getElementById('editCardBtn');
  const manageBtn = document.getElementById('manageBtn');
  const manageModalOverlay = document.getElementById('manageModalOverlay');
  const closeManageModalBtn = document.getElementById('closeManageModalBtn');

  let currentCardIndex = 0;
  let cards = [
    { id: 1, question: "What is the powerhouse of the cell?", answer: "Mitochondria", hint: "It generates most of the cell's supply of ATP.", starred: false },
    { id: 2, question: "What is the chemical symbol for water?", answer: "H₂O", hint: "Two hydrogen atoms and one oxygen atom.", starred: false },
    { id: 3, question: "In which year did World War II end?", answer: "1945", hint: "The war lasted from 1939 to this year.", starred: true },
    { id: 4, question: "Who wrote 'Romeo and Juliet'?", answer: "William Shakespeare", hint: "A famous English playwright.", starred: false },
    { id: 5, question: "What is the largest planet in our solar system?", answer: "Jupiter", hint: "It's a gas giant.", starred: false },
    { id: 6, question: "What is the capital of France?", answer: "Paris", hint: "Known for the Eiffel Tower.", starred: true },
    { id: 7, question: "What is 2 + 2 * 2?", answer: "6", hint: "Remember operator precedence (multiplication before addition).", starred: false },
    { id: 8, question: "Which element has the atomic number 1?", answer: "Hydrogen", hint: "It's the lightest element.", starred: false },
  ];

  function updateStarUI(isStarred) {
    const starIconSvgs = [starCardIconBtn.querySelector('.star-empty'), starCardIconBtn.querySelector('.star-filled')];
    const starButtonSvgs = [starBtn.querySelector('.star-empty'), starBtn.querySelector('.star-filled')];

    if (isStarred) {
      starCardIconBtn.classList.add('starred');
      starBtn.classList.add('starred');
      starIconSvgs[0].style.display = 'none';
      starIconSvgs[1].style.display = 'inline-block';
      starButtonSvgs[0].style.display = 'none';
      starButtonSvgs[1].style.display = 'inline-block';
    } else {
      starCardIconBtn.classList.remove('starred');
      starBtn.classList.remove('starred');
      starIconSvgs[0].style.display = 'inline-block';
      starIconSvgs[1].style.display = 'none';
      starButtonSvgs[0].style.display = 'inline-block';
      starButtonSvgs[1].style.display = 'none';
    }
  }

  function loadCard() {
    if (cards.length === 0) {
      cardQuestionEl.textContent = "No cards available.";
      navIndicatorsEl.textContent = "0 / 0";
      prevCardBtn.disabled = true;
      nextCardBtn.disabled = true;
      updateStarUI(false);
      return;
    }
    const card = cards[currentCardIndex];
    cardQuestionEl.textContent = card.question;
    navIndicatorsEl.textContent = `${currentCardIndex + 1} / ${cards.length}`;
    
    // prevCardBtn.disabled = currentCardIndex === 0; // Disable if not looping
    // nextCardBtn.disabled = currentCardIndex === cards.length - 1; // Disable if not looping
    
    updateStarUI(card.starred);
    hideHint(); // Hide hint when card changes
  }

  function showNextCard() {
    currentCardIndex = (currentCardIndex + 1) % cards.length;
    loadCard();
  }

  function showPrevCard() {
    currentCardIndex = (currentCardIndex - 1 + cards.length) % cards.length;
    loadCard();
  }

  function shuffleCards() {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    currentCardIndex = 0;
    loadCard();
    console.log("Cards shuffled.");
  }

  function showHint() {
    if (cards.length > 0) {
      hintTextEl.textContent = cards[currentCardIndex].hint || "No hint available for this card.";
      hintPopupEl.classList.add('visible');
    }
  }

  function hideHint() {
    hintPopupEl.classList.remove('visible');
  }

  function toggleStarCurrentCard() {
    if (cards.length > 0) {
      cards[currentCardIndex].starred = !cards[currentCardIndex].starred;
      updateStarUI(cards[currentCardIndex].starred);
      console.log(`Card ${cards[currentCardIndex].id} starred: ${cards[currentCardIndex].starred}`);
    }
  }
  
  function editCurrentCard() {
    if (cards.length > 0) {
      console.log("Editing card:", cards[currentCardIndex]);
      alert(`Mock edit for: "${cards[currentCardIndex].question}"`);
    }
  }

  function openManageModal() {
    manageModalOverlay.style.display = 'flex';
  }

  function closeManageModal() {
    manageModalOverlay.style.display = 'none';
  }

  // Event Listeners
  nextCardBtn.addEventListener('click', showNextCard);
  prevCardBtn.addEventListener('click', showPrevCard);
  shuffleBtn.addEventListener('click', shuffleCards);
  hintBtn.addEventListener('click', showHint);
  closeHintBtn.addEventListener('click', hideHint);
  
  starCardIconBtn.addEventListener('click', toggleStarCurrentCard);
  starBtn.addEventListener('click', toggleStarCurrentCard); // Action button also toggles star

  editCardBtn.addEventListener('click', editCurrentCard);
  manageBtn.addEventListener('click', openManageModal);
  closeManageModalBtn.addEventListener('click', closeManageModal);
  manageModalOverlay.addEventListener('click', (event) => {
    if (event.target === manageModalOverlay) {
      closeManageModal();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (manageModalOverlay.style.display === 'flex') return; // Don't navigate if modal is open

    if (e.key === 'ArrowRight') {
      showNextCard();
    } else if (e.key === 'ArrowLeft') {
      showPrevCard();
    } else if (e.key === 's' || e.key === 'S') {
        if(document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault(); // Prevent 's' from typing if not in input
            toggleStarCurrentCard();
        }
    } else if (e.key === 'h' || e.key === 'H') {
         if(document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            hintPopupEl.classList.contains('visible') ? hideHint() : showHint();
        }
    }
  });

  // Initial load
  loadCard();
});
</boltArtifact>

This creates a responsive flashcard component with the requested features.
-   **HTML (`public/flashcard.html`)** sets up the structure including the card, navigation, action buttons, hint popup, and a mock "Manage" modal.
-   **CSS (`public/css/flashcard.css`)** provides the dark theme styling, layout using Flexbox, and responsiveness for different screen sizes.
-   **JavaScript (`public/js/flashcard.js`)** handles loading cards, navigation (looping), shuffling, showing/hiding hints, starring cards, and opening/closing the mock "Manage" modal. Basic keyboard navigation (left/right arrows for cards, 's' for star, 'h' for hint) is also included.

You can open `public/flashcard.html` in your browser to interact with the component.