// Function to create and inject the floating panel (like a sidebar) into the webpage
function createFloatingPanel() {
  // Create the floating panel container
  const panel = document.createElement('div');
  panel.id = 'floatingPanel';
  panel.style.position = 'fixed';
  panel.style.top = '20px';
  panel.style.right = '20px';
  panel.style.width = '320px';
  panel.style.height = 'auto';
  panel.style.backgroundColor = '#ffffff';
  panel.style.border = '2px solid #4CAF50';
  panel.style.borderRadius = '8px';
  panel.style.padding = '15px';
  panel.style.zIndex = '9999';
  panel.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
  panel.style.fontFamily = 'Arial, sans-serif';

  // Create the inner HTML structure of the panel
  panel.innerHTML = `
    <div style="text-align: right;">
      <button id="closePanel" style="background-color: transparent; border: none; font-size: 18px; cursor: pointer;">✖</button>
    </div>
    <h3 style="color: #4CAF50; text-align: center;">EmoGauge Sentiment Analyzer</h3>
    <textarea id="inputText" rows="4" placeholder="Enter your text..." style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ccc; margin-bottom: 15px; resize: none;"></textarea>
    <button id="analyzeButton" style="width: 100%; padding: 10px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Analyze Sentiment</button>
    <div id="loadingSpinner" class="spinner hidden" style="margin: 15px 0;"></div>
    <div id="result" class="hidden" style="text-align: center; margin-top: 10px;">
      <p>Model Used: <span id="modelUsed"></span></p>
      <p class="sentiment-label">Sentiment: <span id="sentimentResult"></span></p>
      <p>Confidence: <span id="confidence"></span>%</p>
    </div>
  `;

  // Append the floating panel to the body
  document.body.appendChild(panel);

  // Close button functionality
  document.getElementById('closePanel').addEventListener('click', () => {
    panel.remove();
  });

  // Add event listener to the analyze button
  document.getElementById('analyzeButton').addEventListener('click', async () => {
    const text = document.getElementById('inputText').value.trim();
    const resultDiv = document.getElementById('result');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Show error if no text entered
    if (text === '') {
      resultDiv.innerHTML = '<p style="color: red;">Please enter some text!</p>';
      resultDiv.classList.remove('hidden');
      return;
    }

    // Show loading spinner, hide result section
    loadingSpinner.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    
    // Disable input and analyze button
    document.getElementById('analyzeButton').disabled = true;
    document.getElementById('inputText').disabled = true;

    // Perform sentiment analysis (API call)
    const response = await fetch('https://x-vibes.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model: 'distilbert' // Default model
      })
    });
    const data = await response.json();

    // Hide loading spinner
    loadingSpinner.classList.add('hidden');
    
    // Enable input and analyze button again
    document.getElementById('analyzeButton').disabled = false;
    document.getElementById('inputText').disabled = false;

    // Display the sentiment analysis result
    resultDiv.classList.remove('hidden');
    document.getElementById('modelUsed').textContent = data.model_used;
    document.getElementById('sentimentResult').textContent = data.result.label;
    document.getElementById('confidence').textContent = (data.result.score * 100).toFixed(2);

    // Color the sentiment label
    const sentimentResult = document.getElementById('sentimentResult');
    if (data.result.label === 'POSITIVE') {
      sentimentResult.style.color = 'green';
    } else if (data.result.label === 'NEGATIVE') {
      sentimentResult.style.color = 'red';
    } else {
      sentimentResult.style.color = 'goldenrod';
    }
  });
}

// Function to inject the floating panel when the page is fully loaded
window.addEventListener('load', () => {
  createFloatingPanel();
});
