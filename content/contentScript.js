// Initialize state variables
let panelActive = false;
let floatingPanel;
let isMinimized = false;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleOrCreate") {
        toggleOrCreatePanel();
        sendResponse({ toggled: true, isActive: panelActive });
    } else if (request.action === "checkStatus") {
        sendResponse({ isActive: panelActive });
    }
    return true;
});

// Function to create or toggle the floating panel
function toggleOrCreatePanel() {
    if (!panelActive || !document.getElementById('floatingPanel')) {
        createFloatingPanel();
    } else {
        floatingPanel.style.display = floatingPanel.style.display === 'none' ? 'block' : 'none'; // Toggle visibility
    }
    panelActive = !panelActive;
}

// Function to create the floating panel
function createFloatingPanel() {
    if (document.getElementById('floatingPanel')) return;

    // Create the floating panel container
    floatingPanel = document.createElement('div');
    floatingPanel.id = 'floatingPanel';
    floatingPanel.role = 'dialog';
    floatingPanel.setAttribute('aria-labelledby', 'emoGaugeTitle');
    floatingPanel.classList.add('floating-panel');

    // Panel HTML content
    floatingPanel.innerHTML = `
        <div class="panel-header">
            <button id="minimizePanel" class="panel-button">−</button>
            <button id="closePanel" class="panel-button">✖</button>
        </div>
        <h3 id="emoGaugeTitle" class="panel-title">EmoGauge</h3>
        <select id="modelSelector" class="model-selector">
            <option value="distilbert">DistilBERT</option>
            <option value="bert">BERT</option>
            <option value="roberta">RoBERTa</option>
        </select>
        <textarea id="inputText" class="input-text" rows="4" placeholder="Enter your text..."></textarea>
        <button id="analyzeButton" class="analyze-button">Analyze Sentiment</button>
        <div id="loadingSpinner" class="spinner hidden"></div>
        <div id="result" class="hidden">
            <p>Model Used: <span id="modelUsed"></span></p>
            <p class="sentiment-label">Sentiment: <span id="sentimentResult"></span></p>
            <p>Confidence: <span id="confidence"></span>%</p>
        </div>
    `;

    document.body.appendChild(floatingPanel);

    // Event listeners for closing and minimizing the panel
    document.getElementById('closePanel').addEventListener('click', () => {
        floatingPanel.remove();
        panelActive = false;
    });

    document.getElementById('minimizePanel').addEventListener('click', togglePanelMinimize);

    document.getElementById('analyzeButton').addEventListener('click', analyzeSentiment);
}

// Function to toggle panel minimize/maximize
function togglePanelMinimize() {
    if (!isMinimized) {
        floatingPanel.dataset.originalHeight = floatingPanel.style.height;
        floatingPanel.style.height = '40px';
        floatingPanel.style.padding = '5px 15px';
        floatingPanel.style.overflow = 'hidden';
        floatingPanel.querySelector('h3').style.display = 'none';
        document.querySelector('#floatingPanel > div').style.display = 'flex';
        document.getElementById('minimizePanel').textContent = '⤢';
        isMinimized = true;
    } else {
        floatingPanel.style.height = floatingPanel.dataset.originalHeight || 'auto';
        floatingPanel.style.padding = '15px';
        floatingPanel.style.overflow = 'visible';
        floatingPanel.querySelector('h3').style.display = 'block';
        document.getElementById('minimizePanel').textContent = '−';
        isMinimized = false;
    }
}

// Function to handle sentiment analysis
function analyzeSentiment() {
    const text = document.getElementById('inputText').value.trim();
    const selectedModel = document.getElementById('modelSelector').value;
    const resultDiv = document.getElementById('result');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const analyzeButton = document.getElementById('analyzeButton');

    if (text === '') {
        resultDiv.innerHTML = '<p style="color: red;">Please enter some text!</p>';
        resultDiv.classList.remove('hidden');
        return;
    }

    // Show loading spinner and disable UI elements
    loadingSpinner.style.display = 'block';
    loadingSpinner.style.opacity = '1';
    analyzeButton.disabled = true;
    document.getElementById('inputText').disabled = true;
    document.getElementById('modelSelector').disabled = true;
    resultDiv.classList.add('hidden');

    // Fetch sentiment analysis result
    fetch('https://x-vibes.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model: selectedModel })
    })
    .then(response => response.json())
    .then(data => {
        resultDiv.classList.remove('hidden');
        document.getElementById('modelUsed').textContent = data.model_used;
        document.getElementById('sentimentResult').textContent = data.result.label;
        document.getElementById('confidence').textContent = (data.result.score * 100).toFixed(2);

        const sentimentResult = document.getElementById('sentimentResult');
        sentimentResult.style.color = data.result.label === 'POSITIVE' ? 'green' : data.result.label === 'NEGATIVE' ? 'red' : 'goldenrod';
    })
    .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = `<p style="color: red;">An error occurred: ${error.message}</p>`;
        resultDiv.classList.remove('hidden');
    })
    .finally(() => {
        loadingSpinner.style.opacity = '0';
        setTimeout(() => loadingSpinner.style.display = 'none', 300);
        analyzeButton.disabled = false;
        document.getElementById('inputText').disabled = false;
        document.getElementById('modelSelector').disabled = false;
    });
}

// Adjust the panel layout on window resize
window.addEventListener('resize', () => {
    if (floatingPanel) {
        floatingPanel.style.maxHeight = `${window.innerHeight * 0.8}px`;
    }
});
