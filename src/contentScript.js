// Function to send text and model to the sentiment analysis API
async function analyzeSentiment(text, model) {
  try {
    const response = await fetch('https://x-vibes.onrender.com/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        model: model
      })
    });
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    return 'Error';
  }
}

// Function to add an "Analyze" button and a model selector next to input fields
function addAnalyzeButton(inputElement) {
  // Create the "Analyze Sentiment" button
  const analyzeButton = document.createElement('button');
  analyzeButton.textContent = 'Analyze Sentiment';
  analyzeButton.style.marginLeft = '10px';
  analyzeButton.style.padding = '5px';
  analyzeButton.style.fontSize = '12px';

  // Create a dropdown to select the model
  const modelSelect = document.createElement('select');
  modelSelect.style.marginLeft = '10px';
  modelSelect.innerHTML = `
    <option value="bert">BERT</option>
    <option value="roberta">RoBERTa</option>
    <option value="distilbert">DistilBERT</option>
  `;

  // Create a div to display the result of the sentiment analysis
  const resultDiv = document.createElement('div');
  resultDiv.style.marginTop = '5px';
  resultDiv.style.fontSize = '12px';

  // Insert the dropdown, button, and result div next to the input field
  inputElement.parentNode.insertBefore(modelSelect, inputElement.nextSibling);
  inputElement.parentNode.insertBefore(analyzeButton, modelSelect.nextSibling);
  inputElement.parentNode.insertBefore(resultDiv, analyzeButton.nextSibling);

  // Add an event listener to the button
  analyzeButton.addEventListener('click', async function () {
    const text = inputElement.value;
    const selectedModel = modelSelect.value;

    if (text) {
      const sentiment = await analyzeSentiment(text, selectedModel);
      resultDiv.textContent = `Sentiment: ${sentiment}`;

      // Update the background color of the input field based on the sentiment
      if (sentiment === 'POSITIVE') {
        inputElement.style.backgroundColor = '#d4edda'; // Green for positive
      } else if (sentiment === 'NEGATIVE') {
        inputElement.style.backgroundColor = '#f8d7da'; // Red for negative
      } else {
        inputElement.style.backgroundColor = '#fff3cd'; // Yellow for neutral
      }
    } else {
      resultDiv.textContent = 'Please enter some text.';
    }
  });
}

// Function to find all input fields and textareas
function findInputFields() {
  const textInputs = document.querySelectorAll('input[type="text"], textarea');

  // Add the "Analyze Sentiment" button and model selector to each input field
  textInputs.forEach(input => {
    addAnalyzeButton(input);
  });
}

// Run the script when the document is fully loaded
window.addEventListener('load', findInputFields);
