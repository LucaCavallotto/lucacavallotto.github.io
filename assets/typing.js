document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("typing-text");
  if (!el) return;

  let phrases = [];
  let currentPhraseIndex = -1;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const delayBetween = 1500;

  function getRandomIndex() {
    if (phrases.length <= 1) return 0;
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * phrases.length);
    } while (newIndex === currentPhraseIndex);
    return newIndex;
  }

  function type() {
    if (phrases.length === 0) return;

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

  // Fetch phrases from JSON and start animation
  fetch("phrases.json")
    .then(response => response.json())
    .then(data => {
      phrases = data;
      type();
    })
    .catch(error => console.error("Error loading phrases:", error));
});
