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
        aiml: [
            { id: 'ai-1', title: 'Predictive Resource Allocation', desc: 'Develop an ML model that optimizes cloud computing resource allocation in real-time based on traffic patterns to reduce energy consumption.' },
            { id: 'ai-2', title: 'Deepfake Detection System', desc: 'Create a lightweight inference engine capable of detecting AI-generated media (video/audio) using localized edge computing.' },
            { id: 'ai-3', title: 'Generative UI Synthesizer', desc: 'Train a model to generate fully functional, accessible user interfaces based on natural language descriptions and wireframe sketches.' },
            { id: 'ai-4', title: 'Automated Code Review Assistant', desc: 'Build an LLM-powered tool that analyzes pull requests not just for syntax, but for architectural flaws and security vulnerabilities.' },
            { id: 'ai-5', title: 'Personalized Health Sentinel', desc: 'Develop an algorithm that analyzes wearable data patterns to predict potential health anomalies before they become critical.' },
            { id: 'ai-6', title: 'Smart Urban Traffic Orchestrator', desc: 'Implement reinforcement learning to optimize traffic light patterns in a simulated city environment, prioritizing emergency vehicles.' },
            { id: 'ai-7', title: 'Sentiment-Aware Customer Agent', desc: 'Create a conversational AI that adjusts its tone, empathy, and response strategies based on the real-time emotional state of the user.' },
            { id: 'ai-8', title: 'Supply Chain Anomaly Detector', desc: 'Build a forecast model that identifies potential logistical bottlenecks by analyzing global news events, weather patterns, and shipping data.' }
        ],
        agentic: [
            { id: 'ag-1', title: 'Autonomous Dev Environment', desc: 'Create an agentic system that can read a GitHub issue, write the code, run tests, and open a PR without human intervention.' },
            { id: 'ag-2', title: 'Multi-Agent Negotiation Protocol', desc: 'Develop a framework where specialized AI agents negotiate resource sharing (like API rate limits) through a consensus mechanism.' },
            { id: 'ag-3', title: 'Self-Healing Infrastructure', desc: 'Build agents capable of monitoring server health, diagnosing root causes of failures, and autonomously applying mitigation scripts.' },
            { id: 'ag-4', title: 'Automated Market Researcher', desc: 'Design an agent that scrapes competitor data, analyzes market trends, and outputs a synthesized strategy report weekly.' },
            { id: 'ag-5', title: 'Personal Knowledge Librarian', desc: 'Create an autonomous agent that organizing disorganized notes, categorizes links, and proactively suggests connections between concepts.' },
            { id: 'ag-6', title: 'Cyber-Defense Swarm', desc: 'Implement a swarm of lightweight agents that patrol a network simulation, hunting for anomalies and autonomously isolating compromised nodes.' },
            { id: 'ag-7', title: 'Agentic Workflow Orchestrator', desc: 'Build a visual platform for chaining specialized LLM agents together to accomplish complex, multi-step enterprise workflows.' },
            { id: 'ag-8', title: 'Continuous Compliance Checker', desc: 'Develop an agent that continuously scans codebases and infrastructure configurations against changing regulatory compliance standards (GDPR, HIPAA).' }
        ],
        cybersecurity: [
            { id: 'cy-1', title: 'Zero-Trust Network Simulator', desc: 'Develop a proof-of-concept environment demonstrating strict zero-trust principles applied down to the microservice level.' },
            { id: 'cy-2', title: 'Ransomware Containment Sandbox', desc: 'Build a honeypot system that rapidly detects encryption-like behavior and instantly sandboxes the offending process.' },
            { id: 'cy-3', title: 'Post-Quantum Cryptography Bridge', desc: 'Create a migration tool designed to upgrade legacy cryptographic protocols to NIST-approved post-quantum standards.' },
            { id: 'cy-4', title: 'Phishing Threat Correlator', desc: 'Develop an engine that analyzes email headers, body content, and links to build graph relationships of coordinated phishing campaigns.' },
            { id: 'cy-5', title: 'IoT Device Identity Ledger', desc: 'Implement a decentralized or cryptographic identity management system specifically designed to authenticate millions of low-power IoT devices.' },
            { id: 'cy-6', title: 'Automated Pen-Testing Engine', desc: 'Build a tool that maps attack surfaces and safely executes benign exploits to generate actionable remediation reports.' },
            { id: 'cy-7', title: 'Biometric Spoofing Defender', desc: 'Create a computer vision pipeline capable of distinguishing between live human traits and deepfake/physical mask spoofing attempts.' },
            { id: 'cy-8', title: 'Privacy-Preserving Threat Intel', desc: 'Develop a mechanism for competing organizations to share actionable threat intelligence without revealing sensitive internal network structures.' }
        ],
        web3: [
            { id: 'w3-1', title: 'Cross-Chain Asset Bridge', desc: 'Develop a secure protocol for transferring digital assets across incompatible blockchain networks using atomic swaps.' },
            { id: 'w3-2', title: 'Decentralized Data Marketplace', desc: 'Build a smart contract platform where users can monetize their personal data while maintaining cryptographic ownership.' },
            { id: 'w3-3', title: 'DAO Governance Aggregator', desc: 'Create a unified dashboard allowing users to track proposals, manage voting power, and execute logic across multiple DAOs simultaneously.' },
            { id: 'w3-4', title: 'Zero-Knowledge Proof Identity Verification', desc: 'Implement a KYC system that allows users to prove attributes (like age or citizenship) without revealing their actual identity.' },
            { id: 'w3-5', title: 'Smart Contract Vulnerability Scanner', desc: 'Develop a static analysis tool that detects common logic flaws and reentrancy vulnerabilities in Solidity/Rust contracts.' },
            { id: 'w3-6', title: 'Tokenized Green Energy Grid', desc: 'Build a system for tokenizing solar/wind energy production, allowing peers to trade energy credits on a micro-grid.' },
            { id: 'w3-7', title: 'Decentralized Storage Node Optimizer', desc: 'Create an algorithm to optimize file sharding and retrieval latency across IPFS or similar decentralized file networks.' },
            { id: 'w3-8', title: 'NFT Proof of Authorship', desc: 'Develop a standard for binding digital signatures of code commits or academic papers to non-fungible tokens to prove original authorship.' }
        ],
        sustainability: [
            { id: 'su-1', title: 'Carbon Footprint API', desc: 'Develop an easily integrable API that calculates the real-time carbon cost of computational workloads running in datacenters.' },
            { id: 'su-2', title: 'Supply Chain Waste Optimizer', desc: 'Build a predictive model identifying inefficient routing in cold-chain logistics to minimize perishable food waste.' },
            { id: 'su-3', title: 'Smart Grid Demand Balancer', desc: 'Create simulation software that incentivizes consumers to shift power usage to times of peak renewable generation.' },
            { id: 'su-4', title: 'Circular Economy Material Tracker', desc: 'Implement a ledger system tracking electronic components from manufacturing to end-of-life to facilitate efficient recycling.' },
            { id: 'su-5', title: 'Precision Agriculture AI', desc: 'Develop computer vision models analyzing drone imagery to apply water and fertilizer only to specific plants that require it.' },
            { id: 'su-6', title: 'Urban Heat Island Analyzer', desc: 'Build a tool using satellite data to identify urban heat islands and propose optimal locations for green infrastructure (trees, green roofs).' },
            { id: 'su-7', title: 'Water Quality Sensor Dashboard', desc: 'Create an IoT platform aggregating low-cost sensor data to map micro-pollutants in local river systems in real-time.' },
            { id: 'su-8', title: 'Sustainable Routing Algorithm', desc: 'Develop a navigation API that calculates routes optimized for lowest fuel consumption / battery usage rather than strictly shortest time.' }
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
                const response = await fetch('/api/save-selection', {
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
