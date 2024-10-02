# EmoGauge - Sentiment Analysis Extension

EmoGauge is a groundbreaking sentiment analysis tool designed to help solopreneurs, freelancers, recruiters, and digital professionals understand the emotional tone of their writing in real-time. EmoGauge integrates various sentiment analysis models to provide insightful feedback on written content, empowering users to communicate more effectively and become more self-aware.

## Features
- **Real-time Sentiment Analysis**: Analyze the emotional tone (positive, neutral, negative) of text input across websites.
- **Model Selection**: Choose from various pre-trained sentiment models like DistilBERT, BERT, and RoBERTa.
- **Futuristic UI**: Modern and minimalistic nano-transparent user interface.
- **Floating Panel**: A floating sentiment analysis panel that can be minimized and closed at will.
- **Cross-Platform Compatibility**: Works across various websites, including forms and input fields (tested on GitHub, Render, DockerHub).

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
- Node.js: Make sure you have Node.js installed on your machine. 
- Git: Ensure Git is installed to clone the repository.

## Installation
### 1. Clone the Repository

Open your terminal or command prompt and run the following command to clone the repository from GitHub:

```
git clone https://github.com/cosminmemetea/emo-gauge.git
```

Navigate into the project directory:

```cd emo-gauge```

### 2. Initialize the Project

Initialize the project using npm:

```npm init -y```

### 3. Install Dependencies

Install the required dependencies:


```npm install webpack webpack-cli babel-loader @babel/core @babel/preset-env style-loader css-loader```

### 4. Build the Project

Use Webpack to bundle the JavaScript and CSS files. Run the following command to compile the code:


```npx webpack```
This will generate the bundled files in the dist folder.

## Running EmoGauge in Chrome/Brave
Now that you have the extension built, you can load it into Chrome or Brave for testing.

### 1. Load the Extension in Chrome/Brave

- Open Chrome or Brave and navigate to the chrome://extensions/ page.
- Enable Developer mode in the top-right corner.
- Click on "Load unpacked" and select the project’s directory where you cloned the project (emo-gauge).
- Your extension should now appear in the list and be active.
### 2. Activate EmoGauge

- Click on the EmoGauge extension icon in the Chrome/Brave toolbar to bring up the popup.
- Click the "Toggle EmoGauge Panel" button to display the floating sentiment analysis panel.
- Use the sentiment analysis panel on any web page by typing text into the input field and clicking "Analyze Sentiment".

Contributing
We welcome contributions! If you’d like to help improve EmoGauge, please fork the repository and submit a pull request. If you find any issues, feel free to report them on the GitHub Issues page.

