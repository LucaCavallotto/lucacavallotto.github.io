document.addEventListener("DOMContentLoaded", () => {
  const phrases = [
    "Computer Science student",
    "Programmer",
    "Runner",
    "Dreamer",
    "Motorsport enthusiast",
    "Technology lover",
    "Problem solver",
    "Lifelong learner",
    "Coffee-powered coder",
    "Minimalist designer",
    "Human-centered designer",
    "Detail addict",
    "Challenge seeker",
    "AI enthusiast",
    "Ferrari fan"
  ];

  const el = document.getElementById("typing-text");
  let currentPhraseIndex = -1; // start with no phrase
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetween = 1500;

  function getRandomIndex() {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * phrases.length);
    } while (newIndex === currentPhraseIndex);
    return newIndex;
  }

  function type() {
    if (currentPhraseIndex === -1) {
      currentPhraseIndex = getRandomIndex();
    }

    const currentPhrase = phrases[currentPhraseIndex];
    
    if (isDeleting) {
      charIndex--;
      el.textContent = currentPhrase.substring(0, charIndex);
    } else {
      charIndex++;
      el.textContent = currentPhrase.substring(0, charIndex);
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      setTimeout(() => (isDeleting = true), delayBetween);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentPhraseIndex = getRandomIndex();
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(type, speed);
  }

  type();
});
