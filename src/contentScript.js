let panelActive = false; // Track whether the panel is currently active
let floatingPanel; // Store the floating panel reference

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleOrCreate") {
    toggleOrCreatePanel();
    sendResponse({ toggled: true, isActive: panelActive });
  } else if (request.action === "checkStatus") {
    sendResponse({ isActive: panelActive });
  }
  return true; // Keeps the connection open for async responses
});

// Function to create or toggle the floating panel
function toggleOrCreatePanel() {
  if (!panelActive || !document.getElementById('floatingPanel')) {
    createFloatingPanel(); // Create the panel if it doesn't exist
  } else {
    // Toggle the panel's visibility
    floatingPanel.style.display = floatingPanel.style.display === 'none' ? 'block' : 'none';
  }
  panelActive = !panelActive; // Toggle the panelActive state
}

function createFloatingPanel() {
    if (document.getElementById('floatingPanel')) {
        return; // Panel already exists, do not create another
    }

    floatingPanel = document.createElement('div');
    floatingPanel.id = 'floatingPanel';
    floatingPanel.role = 'dialog';
    floatingPanel.setAttribute('aria-labelledby', 'emoGaugeTitle');

    const styles = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        max-width: 90vw;
        max-height: 80vh;
        background-color: rgba(20, 20, 30, 0.95);
        border: 1px solid rgba(0, 255, 255, 0.5);
        border-radius: 12px;
        padding: 15px;
        z-index: 2147483647;
        box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
        font-family: 'Roboto', Arial, sans-serif;
        color: #fff;
        overflow: hidden;
        transition: transform 0.3s ease, opacity 0.3s ease;
    `;

    floatingPanel.style.cssText = styles;

    floatingPanel.innerHTML = `
        <div style="text-align: right;">
            <button id="minimizePanel" style="background: transparent; border: none; font-size: 18px; color: #fff; cursor: pointer;">−</button>
            <button id="closePanel" style="background: transparent; border: none; font-size: 18px; color: #fff; cursor: pointer;">✖</button>
        </div>
        <h3 id="emoGaugeTitle" style="color: #00ffff; text-align: center; font-family: 'Roboto', sans-serif; text-shadow: 0 0 5px rgba(0, 255, 255, 0.8);">EmoGauge</h3>
        <select id="modelSelector" style="width: 100%; padding: 10px; margin-bottom: 15px; background-color: rgba(255, 255, 255, 0.1); color: #fff; border: 1px solid #00ffff;">
            <option value="distilbert">DistilBERT</option>
            <option value="bert">BERT</option>
            <option value="roberta">RoBERTa</option>
        </select>
        <textarea id="inputText" rows="4" placeholder="Enter your text..." style="width: calc(100% - 20px); height: 100px; padding: 10px; border-radius: 4px; border: 1px solid #00ffff; background-color: rgba(255, 255, 255, 0.1); color: #fff; margin-bottom: 15px; resize: vertical; max-height: 150px;"></textarea>
        <button id="analyzeButton" style="width: 100%; padding: 10px; background-color: #00ffff; color: #141414; border: none; border-radius: 5px; font-size: 16px; font-weight: bold; cursor: pointer;">Analyze Sentiment</button>
        <div id="loadingSpinner" class="spinner hidden" style="margin: 15px auto; border: 5px solid #f3f3f3; border-top: 5px solid #00ffff; border-radius: 50%; width: 30px; height: 30px; animation: spin 2s linear infinite;"></div>
        <div id="result" class="hidden" style="text-align: center; margin-top: 10px;">
            <p>Model Used: <span id="modelUsed"></span></p>
            <p class="sentiment-label">Sentiment: <span id="sentimentResult"></span></p>
            <p>Confidence: <span id="confidence"></span>%</p>
        </div>
    `;

    document.body.appendChild(floatingPanel);

    // Event listeners for panel controls
    document.getElementById('closePanel').addEventListener('click', () => {
        floatingPanel.remove();
        panelActive = false;
    });

    let isMinimized = false;
    document.getElementById('minimizePanel').addEventListener('click', () => {
        if (!isMinimized) {
            floatingPanel.style.height = '50px';
            floatingPanel.style.overflow = 'hidden';
            document.getElementById('minimizePanel').textContent = '⤢';
            isMinimized = true;
        } else {
            floatingPanel.style.height = 'auto';
            floatingPanel.style.overflow = 'visible';
            document.getElementById('minimizePanel').textContent = '−';
            isMinimized = false;
        }
    });

    document.getElementById('analyzeButton').addEventListener('click', analyzeSentiment);

    // Message handler for communication with popup or background script
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "toggleEmoGauge") {
            if (panelActive) {
                floatingPanel.remove();
                panelActive = false;
            } else {
                createFloatingPanel();
                panelActive = true;
            }
            sendResponse({toggled: true, isActive: panelActive});
        } else if (request.action === "checkStatus") {
            sendResponse({isActive: panelActive});
        }
    });
}

function analyzeSentiment() {
  const text = document.getElementById('inputText').value.trim();
  const selectedModel = document.getElementById('modelSelector').value;
  const resultDiv = document.getElementById('result');
  const loadingSpinner = document.getElementById('loadingSpinner');

  if (text === '') {
    resultDiv.innerHTML = '<p style="color: red;">Please enter some text!</p>';
    resultDiv.classList.remove('hidden');
    return;
  }

  loadingSpinner.classList.remove('hidden');
  resultDiv.classList.add('hidden');
  document.getElementById('analyzeButton').disabled = true;
  document.getElementById('inputText').disabled = true;
  document.getElementById('modelSelector').disabled = true;

  fetch('https://x-vibes.onrender.com/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json'
    },
    body: JSON.stringify({text, model: selectedModel})
  })
  .then(response => {
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  })
  .then(data => {
    loadingSpinner.classList.add('hidden');
    resultDiv.classList.remove('hidden');
    document.getElementById('modelUsed').textContent = data.model_used;
    document.getElementById('sentimentResult').textContent = data.result.label;
    document.getElementById('confidence').textContent = (data.result.score * 100).toFixed(2);

    const sentimentResult = document.getElementById('sentimentResult');
    if (data.result.label === 'POSITIVE') sentimentResult.style.color = 'green';
    else if (data.result.label === 'NEGATIVE') sentimentResult.style.color = 'red';
    else sentimentResult.style.color = 'goldenrod';
  })
  .catch(error => {
    resultDiv.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
    resultDiv.classList.remove('hidden');
  })
  .finally(() => {
    loadingSpinner.classList.add('hidden');
    document.getElementById('analyzeButton').disabled = false;
    document.getElementById('inputText').disabled = false;
    document.getElementById('modelSelector').disabled = false;
  });
}

// Debounce resize event for responsive design
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        timeout = setTimeout(later, wait);
    };
}

window.addEventListener('resize', debounce(adjustPanelLayout, 250));

function adjustPanelLayout() {
    if (floatingPanel) {
        floatingPanel.style.maxHeight = `${window.innerHeight * 0.8}px`;
    }
}