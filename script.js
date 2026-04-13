// ===== DATA STORAGE =====
const funFacts = [
    "JavaScript was created in just 10 days in 1995!",
    "The first website ever created is still online!",
    "There are over 1.8 billion websites on the internet.",
    "CSS stands for Cascading Style Sheets.",
    "HTML is not a programming language, it's a markup language!",
    "The @ symbol in emails is called 'At Sign' or 'Ampersand'.",
    "Computers process data in binary - only 1s and 0s!"
];

// ===== MAIN FUNCTION: FETCH AND DISPLAY DATA =====
async function fetchDashboardData() {
    // Show loading message
    showLoadingMessage(true);

    try {
        // ==> Fetch Bitcoin Price
        await fetchBitcoinData();

        // ==> Fetch Ethereum Price
        await fetchEthereumData();

        // ==> Fetch Random User
        await fetchRandomUser();

        // ==> Fetch Fun Fact
        displayRandomFact();

    } catch (error) {
        console.error('Error fetching data:', error);
        showError('Failed to load some data. Please try again.');
    } finally {
        // Hide loading message when done
        showLoadingMessage(false);
    }
}

// ===== FETCH BITCOIN PRICE =====
async function fetchBitcoinData() {
    try {
        // API Request
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );

        // Check if response is okay
        if (!response.ok) {
            throw new Error('Failed to fetch Bitcoin data');
        }

        // Parse JSON response
        const data = await response.json();

        // Extract price
        const price = data.bitcoin.usd;

        // Update DOM
        document.getElementById('bitcoinPrice').textContent = `$${price.toLocaleString()}`;
        document.getElementById('bitcoinDesc').textContent = 'Current market price (USD)';

    } catch (error) {
        console.error('Bitcoin fetch error:', error);
        document.getElementById('bitcoinPrice').textContent = 'N/A';
        document.getElementById('bitcoinDesc').textContent = 'Unable to fetch data';
    }
}

// ===== FETCH ETHEREUM PRICE =====
async function fetchEthereumData() {
    try {
        // API Request
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
        );

        // Check if response is okay
        if (!response.ok) {
            throw new Error('Failed to fetch Ethereum data');
        }

        // Parse JSON response
        const data = await response.json();

        // Extract price
        const price = data.ethereum.usd;

        // Update DOM
        document.getElementById('ethereumPrice').textContent = `$${price.toLocaleString()}`;
        document.getElementById('ethereumDesc').textContent = 'Current market price (USD)';

    } catch (error) {
        console.error('Ethereum fetch error:', error);
        document.getElementById('ethereumPrice').textContent = 'N/A';
        document.getElementById('ethereumDesc').textContent = 'Unable to fetch data';
    }
}

// ===== FETCH RANDOM USER =====
async function fetchRandomUser() {
    try {
        // API Request
        const response = await fetch('https://randomuser.me/api/');

        // Check if response is okay
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        // Parse JSON response
        const data = await response.json();

        // Extract user info
        const user = data.results[0];
        const fullName = `${user.name.first} ${user.name.last}`;
        const email = user.email;

        // Update DOM
        document.getElementById('userName').textContent = fullName;
        document.getElementById('userEmail').textContent = email;

    } catch (error) {
        console.error('User fetch error:', error);
        document.getElementById('userName').textContent = 'N/A';
        document.getElementById('userEmail').textContent = 'Unable to fetch data';
    }
}

// ===== DISPLAY RANDOM FUN FACT =====
function displayRandomFact() {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    const fact = funFacts[randomIndex];
    document.getElementById('factText').textContent = fact;
}

// ===== HELPER: SHOW/HIDE LOADING MESSAGE =====
function showLoadingMessage(show) {
    const loadingMsg = document.getElementById('loadingMessage');
    loadingMsg.style.display = show ? 'block' : 'none';
}

// ===== HELPER: SHOW ERROR MESSAGE =====
function showError(message) {
    // You can enhance this with a toast notification
    console.warn(message);
}

// ===== EVENT LISTENERS =====
// Run on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded! Fetching initial data...');
    fetchDashboardData();
});

// Refresh button click
document.getElementById('refreshBtn').addEventListener('click', function() {
    console.log('Refresh button clicked!');
    fetchDashboardData();
});
