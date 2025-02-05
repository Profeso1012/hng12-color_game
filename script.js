// script.js

// Game state
let score = 0;
let targetColor = '';
let colorOptions = [];

// DOM Elements
const targetColorBox = document.querySelector('[data-testid="colorBox"]');
const colorOptionElements = document.querySelectorAll('[data-testid="colorOption"]');
const scoreDisplay = document.querySelector('[data-testid="score"] .score-value');
const gameInstructions = document.querySelector('[data-testid="gameInstructions"]');
const newGameButton = document.querySelector('[data-testid="newGameButton"]');

// Generate a random color in RGB format
function generateRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// Generate a random color that is significantly different from the given color
function generateDistinctColor(baseColor) {
  let newColor;
  do {
    newColor = generateRandomColor();
  } while (colorDistance(baseColor, newColor) < 100); // Adjust distance threshold as needed
  return newColor;
}

// Calculate color distance using Euclidean distance in RGB space
function colorDistance(color1, color2) {
  const rgb1 = color1.match(/\d+/g).map(Number);
  const rgb2 = color2.match(/\d+/g).map(Number);
  return Math.sqrt(
    Math.pow(rgb1[0] - rgb2[0], 2) +
    Math.pow(rgb1[1] - rgb2[1], 2) +
    Math.pow(rgb1[2] - rgb2[2], 2)
  );
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize a new game
function initGame() {
  // Generate target color
  targetColor = generateRandomColor();
  targetColorBox.style.backgroundColor = targetColor;

  // Generate distinct color options
  colorOptions = [targetColor]; 
  while (colorOptions.length < 6) {
    const newColor = generateDistinctColor(targetColor);
    if (!colorOptions.includes(newColor)) {
      colorOptions.push(newColor);
    }
  }

  // Shuffle colors and assign to buttons
  colorOptions = shuffleArray(colorOptions);
  colorOptionElements.forEach((element, index) => {
    element.style.backgroundColor = colorOptions[index]; 
    // Remove any previous animation classes
    element.classList.remove('animate__animated', 'animate__tada', 'animate__shakeX');
  });

  // Reset game instructions
  gameInstructions.textContent = "Guess the correct color!";
  gameInstructions.classList.remove('correct', 'wrong');
}

// Handle color selection
function handleColorSelect(selectedColor, element) {
  if (selectedColor === targetColor) {
    // Correct guess
    score++;
    scoreDisplay.textContent = score;
    element.classList.add('animate__animated', 'animate__tada');
    gameInstructions.textContent = "Correct!";
    gameInstructions.classList.add('correct');

    // Start new round after delay
    setTimeout(() => {
      initGame();
    }, 1500);
  } else {
    // Wrong guess
    element.classList.add('animate__animated', 'animate__shakeX');
    gameInstructions.textContent = "Wrong!";
    gameInstructions.classList.add('wrong');

    setTimeout(() => {
      gameInstructions.textContent = "Guess the correct color!";
      gameInstructions.classList.remove('wrong');
    }, 1000);
  }
}

// Event Listeners
colorOptionElements.forEach(element => {
  element.addEventListener('click', function() {
    const selectedColor = this.style.backgroundColor;
    handleColorSelect(selectedColor, this);
  });
});

newGameButton.addEventListener('click', function() {
  score = 0;
  scoreDisplay.textContent = score;
  initGame();
  this.classList.add('animate__animated', 'animate__pulse');
  setTimeout(() => {
    this.classList.remove('animate__animated', 'animate__pulse');
  }, 1000);
});

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
  initGame();
});

// Add hover effect handlers
colorOptionElements.forEach(element => {
  element.addEventListener('mouseover', function() {
    this.style.transform = 'scale(1.05)';
  });

  element.addEventListener('mouseout', function() {
    this.style.transform = 'scale(1)';
  });
});

// Add keyboard support for accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'r' || e.key === 'R') {
    newGameButton.click(); // Reset game with 'R' key
  }
});