// Function to create and inject the floating panel (EmoGauge) into the webpage
function createFloatingPanel() {
  // Create the floating panel container
  const panel = document.createElement('div');
  panel.id = 'floatingPanel';
  panel.style.position = 'fixed';
  panel.style.top = '20px';
  panel.style.right = '20px';
  panel.style.width = '320px';
  panel.style.height = 'auto';
  panel.style.maxHeight = '80vh'; // Ensure it doesn't exceed the window height
  panel.style.backgroundColor = 'rgba(30, 30, 30, 0.8)'; // Nano transparent, dark futuristic theme
  panel.style.border = '1px solid rgba(255, 255, 255, 0.5)';
  panel.style.borderRadius = '12px';
  panel.style.padding = '15px';
  panel.style.zIndex = '9999';
  panel.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
  panel.style.fontFamily = 'Arial, sans-serif';
  panel.style.color = '#fff';
  panel.style.transition = 'width 0.3s, height 0.3s'; // For smooth resizing

  // Create the inner HTML structure of the panel
  panel.innerHTML = `
    <div style="text-align: right;">
      <button id="minimizePanel" style="background-color: transparent; border: none; font-size: 18px; color: #fff; cursor: pointer;">−</button>
      <button id="closePanel" style="background-color: transparent; border: none; font-size: 18px; color: #fff; cursor: pointer;">✖</button>
    </div>
    <h3 style="color: #00ffcc; text-align: center; font-family: 'Roboto', sans-serif;">EmoGauge</h3>
    <select id="modelSelector" style="width: 100%; padding: 10px; margin-bottom: 15px; background-color: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid #00ffcc;">
      <option value="distilbert">DistilBERT</option>
      <option value="bert">BERT</option>
      <option value="roberta">RoBERTa</option>
    </select>
    <textarea id="inputText" rows="4" placeholder="Enter your text..." style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #00ffcc; background-color: rgba(255, 255, 255, 0.1); color: #fff; margin-bottom: 15px; resize: none; max-height: 100px;"></textarea>
    <button id="analyzeButton" style="width: 100%; padding: 10px; background-color: #00ffcc; color: black; border: none; border-radius: 5px; font-size: 16px; cursor: pointer;">Analyze Sentiment</button>
    <div id="loadingSpinner" class="spinner hidden" style="margin: 15px 0;"></div>
    <div id="result" class="hidden" style="text-align: center; margin-top: 10px;">
      <p>Model Used: <span id="modelUsed"></span></p>
      <p class="sentiment-label">Sentiment: <span id="sentimentResult"></span></p>
      <p>Confidence: <span id="confidence"></span>%</p>
    </div>
  `;

  // Append the floating panel to the body
  document.body.appendChild(panel);

  // Close panel functionality
  document.getElementById('closePanel').addEventListener('click', () => {
    panel.remove();
  });

  // Minimize panel functionality
  let isMinimized = false;
  document.getElementById('minimizePanel').addEventListener('click', () => {
    if (!isMinimized) {
      panel.style.height = '50px';
      panel.style.overflow = 'hidden';
      document.getElementById('minimizePanel').textContent = '⤢';
      isMinimized = true;
    } else {
      panel.style.height = 'auto';
      panel.style.overflow = 'visible';
      document.getElementById('minimizePanel').textContent = '−';
      isMinimized = false;
    }
  });

  // Add event listener to the analyze button
  document.getElementById('analyzeButton').addEventListener('click', async () => {
    const text = document.getElementById('inputText').value.trim();
    const selectedModel = document.getElementById('modelSelector').value;
    const resultDiv = document.getElementById('result');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Show error if no text entered
    if (text === '') {
      resultDiv.innerHTML = '<p style="color: red;">Please enter some text!</p>';
      resultDiv.classList.remove('hidden');
      return;
    }

    // Show loading spinner, hide result section, lock inputs and button
    loadingSpinner.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    document.getElementById('analyzeButton').disabled = true;
    document.getElementById('inputText').disabled = true;
    document.getElementById('modelSelector').disabled = true;

    // Perform sentiment analysis (API call)
    const response = await fetch('https://x-vibes.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model: selectedModel // Use the selected model
      })
    });
    const data = await response.json();

    // Hide loading spinner
    loadingSpinner.classList.add('hidden');
    
    // Enable input and analyze button again
    document.getElementById('analyzeButton').disabled = false;
    document.getElementById('inputText').disabled = false;
    document.getElementById('modelSelector').disabled = false;

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

  // Handle window resizing to adjust the panel dynamically
  window.addEventListener('resize', () => {
    const maxHeight = window.innerHeight * 0.8; // 80% of window height
    panel.style.maxHeight = `${maxHeight}px`;
  });
}

// Function to inject the floating panel when the page is fully loaded
window.addEventListener('load', () => {
  createFloatingPanel();
});
