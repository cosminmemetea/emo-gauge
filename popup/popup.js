document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('togglePanel');
  const statusDiv = document.getElementById('status');

  // Initial status check
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: "checkStatus" }, function (response) {
      if (response && response.isActive) {
        updateStatusAndButton(true);
      } else {
        updateStatusAndButton(false);
      }
    });
  });

  toggleButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleOrCreate" }, function (response) {
        if (chrome.runtime.lastError) {
          statusDiv.textContent = "Error: Cannot communicate with page. Refresh the page or check if the content script is running.";
        } else {
          updateStatusAndButton(response.isActive);
        }
      });
    });
  });

  function updateStatusAndButton(isActive) {
    if (isActive) {
      statusDiv.textContent = 'EmoGauge is now active.';
      toggleButton.textContent = 'Hide EmoGauge Panel';
    } else {
      statusDiv.textContent = 'EmoGauge is now inactive.';
      toggleButton.textContent = 'Show EmoGauge Panel';
    }
  }
});
