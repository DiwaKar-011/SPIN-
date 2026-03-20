document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const teamNameInput = document.getElementById('team-name');
    const teamNumberInput = document.getElementById('team-number');
    const categorySelect = document.getElementById('category');
    const generateBtn = document.getElementById('generate-btn');
    const errorMessage = document.getElementById('error-message');
    
    const configPanel = document.getElementById('config-panel');
    const resultsArea = document.getElementById('results-area');
    const displayTeamName = document.getElementById('display-team-name');
    const cardsContainer = document.getElementById('cards-container');
    const actionFooter = document.getElementById('action-footer');
    
    const confirmBtn = document.getElementById('confirm-btn');

    
    const successModal = document.getElementById('success-modal');
    const lockedTeam = document.getElementById('locked-team');
    const lockedTeamNumber = document.getElementById('locked-team-number');
    const lockedDomain = document.getElementById('locked-domain');
    const lockedProblem = document.getElementById('locked-problem');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const finalizeBtn = document.getElementById('finalize-btn');

    // State
    let state = {
        teamName: '',
        teamNumber: '',
        category: '',
        selectedCardId: null,
        currentCards: []
    };

    // Database of problem statements by category
    const problemDatabase = {
        "ML": [
            { id: 'ml-1', title: 'Image Classifier', desc: 'Build a model to classify images of handwritten digits.' },
            { id: 'ml-2', title: 'Spam Email Detector', desc: 'Create a machine learning system to detect spam emails.' },
            { id: 'ml-3', title: 'Stock Price Predictor', desc: 'Develop a regression model to predict stock prices based on historical data.' }
        ],
        "Cyber": [
            { id: 'cy-1', title: 'Phishing URL Detector', desc: 'Design a tool to identify and block phishing URLs in real-time.' },
            { id: 'cy-2', title: 'Network Intrusion Simulator', desc: 'Simulate and detect network intrusions using anomaly detection.' },
            { id: 'cy-3', title: 'Password Strength Analyzer', desc: 'Create a web app to analyze and suggest improvements for password strength.' }
        ],
        "Chatbots and AI": [
            { id: 'cb-1', title: 'Customer Support Bot', desc: 'Develop a chatbot to answer customer queries for an e-commerce site.' },
            { id: 'cb-2', title: 'Mental Health Assistant', desc: 'Create an AI chatbot to provide mental health support and resources.' },
            { id: 'cb-3', title: 'Language Learning Partner', desc: 'Build a conversational AI to help users practice a new language.' }
        ],
        "Blockchain web3": [
            { id: 'bc-1', title: 'NFT Marketplace', desc: 'Develop a decentralized marketplace for trading NFTs.' },
            { id: 'bc-2', title: 'Crypto Wallet', desc: 'Create a secure crypto wallet with multi-chain support.' },
            { id: 'bc-3', title: 'Voting DApp', desc: 'Build a decentralized application for secure online voting.' }
        ],
        "Data science": [
            { id: 'ds-1', title: 'Data Visualization Dashboard', desc: 'Create a dashboard to visualize and analyze large datasets.' },
            { id: 'ds-2', title: 'Sales Forecasting', desc: 'Develop a model to forecast sales for a retail company.' },
            { id: 'ds-3', title: 'Customer Segmentation', desc: 'Use clustering to segment customers based on purchasing behavior.' }
        ],
        "Ar/vr": [
            { id: 'ar-1', title: 'AR Navigation App', desc: 'Build an augmented reality app for indoor navigation.' },
            { id: 'ar-2', title: 'VR Art Gallery', desc: 'Create a virtual reality experience for exploring digital art.' },
            { id: 'ar-3', title: 'AR Educational Tool', desc: 'Develop an AR tool to teach science concepts interactively.' }
        ],
        "Iot": [
            { id: 'iot-1', title: 'Smart Home Monitor', desc: 'Design an IoT system to monitor and control home appliances.' },
            { id: 'iot-2', title: 'Wearable Health Tracker', desc: 'Create a wearable device to track health metrics and sync with a mobile app.' },
            { id: 'iot-3', title: 'Environmental Sensor Network', desc: 'Deploy IoT sensors to monitor air and water quality in real-time.' }
        ],
        "Robotics and automation": [
            { id: 'rb-1', title: 'Line Following Robot', desc: 'Build a robot that can follow a line using sensors.' },
            { id: 'rb-2', title: 'Automated Sorting System', desc: 'Create a robotic system to sort packages based on size and weight.' },
            { id: 'rb-3', title: 'Voice-Controlled Robot', desc: 'Develop a robot that responds to voice commands for basic tasks.' }
        ],
        "Cloud computing and devops": [
            { id: 'cc-1', title: 'CI/CD Pipeline', desc: 'Implement a continuous integration and deployment pipeline for a web app.' },
            { id: 'cc-2', title: 'Serverless Function App', desc: 'Build a serverless application using cloud functions.' },
            { id: 'cc-3', title: 'Cloud Cost Optimizer', desc: 'Create a tool to monitor and optimize cloud resource usage.' }
        ],
        "Cryptography": [
            { id: 'cr-1', title: 'File Encryption Tool', desc: 'Develop a tool to encrypt and decrypt files using modern cryptography.' },
            { id: 'cr-2', title: 'Secure Messaging App', desc: 'Create a messaging app with end-to-end encryption.' },
            { id: 'cr-3', title: 'Password Manager', desc: 'Build a password manager that securely stores and retrieves user credentials.' }
        ]
    };

    // Helper: Shuffle Array
    const shuffleArray = (array) => {
        const newArr = [...array];
        for (let i = newArr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
        }
        return newArr;
    };

    // Helper: Show Error
    const showError = (msg) => {
        errorMessage.textContent = msg;
        errorMessage.classList.add('show');
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    };

    // Generate ONE random card
    const generateCards = () => {
        const teamName = teamNameInput.value.trim();
        const teamNumber = teamNumberInput.value.trim();
        const category = categorySelect.value;

        if (!teamName) {
            showError('Please enter your team name.');
            teamNameInput.focus();
            return;
        }

        if (!teamNumber) {
            showError('Please enter your team number.');
            teamNumberInput.focus();
            return;
        }

        if (!category) {
            showError('Please select an operation domain.');
            categorySelect.focus();
            return;
        }

        // Update State
        state.teamName = teamName;
        state.teamNumber = teamNumber;
        state.category = category;

        // Pick exactly ONE problem at random
        const categoryProblems = problemDatabase[category];
        if (!categoryProblems) {
            showError('System Error: Domain data inaccessible.');
            return;
        }
        const randomIndex = Math.floor(Math.random() * categoryProblems.length);
        const picked = categoryProblems[randomIndex];
        state.currentCards = [picked];
        state.selectedCardId = picked.id; // auto-selected immediately

        // Update UI Text
        displayTeamName.textContent = state.teamName + ' (Team ' + state.teamNumber + ')';

        // Transition panels
        configPanel.classList.add('hidden');
        resultsArea.classList.remove('hidden');
        actionFooter.classList.remove('hidden');
        confirmBtn.disabled = false; // already picked, no manual selection needed

        // Render the single card
        renderCards();
    };

    // Render the single assigned card
    const renderCards = () => {
        cardsContainer.innerHTML = '';

        const card = state.currentCards[0];
        if (!card) return;

        const categoryName = categorySelect.options[categorySelect.selectedIndex].text.split('&')[0].trim();
        const difficulty = Math.floor(Math.random() * 3) + 3;

        const cardEl = document.createElement('div');
        cardEl.className = 'problem-card';
        cardEl.dataset.id = card.id;
        cardEl.innerHTML = `
            <div class="card-badge">${categoryName}</div>
            <h3 class="card-title">${card.title}</h3>
            <p class="card-desc">${card.desc}</p>
            <div class="card-meta">
                <span>Difficulty: ${difficulty}/5</span>
                <span>ID: ${card.id.toUpperCase()}</span>
            </div>
        `;

        cardsContainer.appendChild(cardEl);
    };


    // Confirm Selection
    const confirmSelection = () => {
        if (!state.selectedCardId) return;

        const selectedCard = state.currentCards.find(c => c.id === state.selectedCardId);
        const categoryName = categorySelect.options[categorySelect.selectedIndex].text;
        
        // Update Modal
        lockedTeam.textContent = state.teamName;
        lockedTeamNumber.textContent = state.teamNumber;
        lockedDomain.textContent = categoryName;

        lockedProblem.innerHTML = `
            <div class="locked-title">${selectedCard.title}</div>
            <div class="locked-desc">${selectedCard.desc}</div>
        `;

        // Show Modal
        successModal.classList.remove('hidden');
    };

    if (cancelModalBtn) {
        cancelModalBtn.addEventListener('click', () => {
            successModal.classList.add('hidden');
        });
    }

    if (finalizeBtn) {
        finalizeBtn.addEventListener('click', async () => {
            if (!state.selectedCardId) return;

            const selectedCard = state.currentCards.find(c => c.id === state.selectedCardId);
            const categoryName = categorySelect.options[categorySelect.selectedIndex].text;

            // Change button state
            finalizeBtn.disabled = true;
            finalizeBtn.textContent = 'Locking...';

            try {

                // Send data to Google Apps Script Web App
                const response = await fetch('https://script.google.com/macros/s/AKfycbxvroLGghY4pEnc919IW5yuWjwhnhOwlhPTdrHb3p3gFpIa0Fu0Qir_QD87XFBGGB0/exec', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        teamName: state.teamName,
                        teamNumber: state.teamNumber,
                        domain: categoryName,
                        problemId: selectedCard.id,
                        problemTitle: selectedCard.title,
                        problemDesc: selectedCard.desc
                    })
                });

                if (response.ok) {
                    finalizeBtn.textContent = 'Success!';
                    finalizeBtn.style.background = 'var(--success)';
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                } else {
                    const data = await response.json();
                    alert('Error saving data: ' + (data.error || 'Unknown error'));
                    finalizeBtn.disabled = false;
                    finalizeBtn.textContent = 'Lock & Finalize';
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Network error while saving data.');
                finalizeBtn.disabled = false;
                finalizeBtn.textContent = 'Lock & Finalize';
            }
        });
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateCards);
    
    // Allow enter key submission directly from inputs
    teamNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateCards();
    });

    teamNumberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateCards();
    });



    confirmBtn.addEventListener('click', confirmSelection);
});
