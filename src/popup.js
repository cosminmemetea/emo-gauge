// Function to send text and model to the sentiment analysis API
async function analyzeSentiment(text) {
  try {
    const response = await fetch('https://x-vibes.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model: 'distilbert'  // Using distilbert for this example
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return null;
  }
}

// DOM elements
const analyzeButton = document.getElementById('analyzeButton');
const inputText = document.getElementById('inputText');
const resultDiv = document.getElementById('result');
const sentimentLabel = document.getElementById('sentimentResult');
const modelUsed = document.getElementById('modelUsed');
const confidence = document.getElementById('confidence');
const loadingSpinner = document.getElementById('loadingSpinner');

// Add event listener to the analyze button
analyzeButton.addEventListener('click', async () => {
  const text = inputText.value.trim();

  if (text === '') {
    sentimentLabel.textContent = 'Please enter some text!';
    return;
  }

  // Show loading spinner and disable inputs
  loadingSpinner.classList.remove('hidden');
  analyzeButton.disabled = true;
  inputText.disabled = true;
  
  // Get sentiment analysis result
  const response = await analyzeSentiment(text);
  
  // Hide loading spinner
  loadingSpinner.classList.add('hidden');
  analyzeButton.disabled = false;
  inputText.disabled = false;

  if (response && response.result) {
    // Display the result smoothly
    resultDiv.classList.remove('hidden');

    // Update model and confidence
    modelUsed.textContent = response.model_used;
    confidence.textContent = (response.result.score * 100).toFixed(2);

    // Update sentiment label with smooth styling
    sentimentLabel.textContent = response.result.label;
    
    if (response.result.label === 'POSITIVE') {
      sentimentLabel.className = 'positive';
    } else if (response.result.label === 'NEGATIVE') {
      sentimentLabel.className = 'negative';
    } else {
      sentimentLabel.className = 'neutral';
    }
  } else {
    sentimentLabel.textContent = 'Error analyzing sentiment!';
  }
});
