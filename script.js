// ===== CRYPTOCURRENCY DATA =====
const CRYPTOS = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: '◆' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: '◐' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◉' }
];

let previousPrices = {};

// ===== MAIN FUNCTION: FETCH ALL DATA =====
async function fetchDashboardData() {
    showLoadingIndicator(true);
    updateTimestamp();

    try {
        // Fetch all crypto prices at once
        await fetchCryptoPrices();
        
        // Render crypto cards dynamically
        renderCryptoCards();
        
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        showLoadingIndicator(false);
    }
}

// ===== FETCH CRYPTOCURRENCY PRICES =====
async function fetchCryptoPrices() {
    try {
        // Build the API URL with all crypto IDs
        const cryptoIds = CRYPTOS.map(c => c.id).join(',');
        const url = `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_market_cap=true`;

        // Fetch data
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        // Parse response
        const data = await response.json();

        // Store data and prices
        window.cryptoData = data;
        savePreviousPrices(data);

        return data;

    } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
        throw error;
    }
}

// ===== STORE PREVIOUS PRICES FOR COMPARISON =====
function savePreviousPrices(data) {
    Object.keys(data).forEach(cryptoId => {
        previousPrices[cryptoId] = window.cryptoData?.[cryptoId]?.usd || data[cryptoId].usd;
    });
}

// ===== RENDER CRYPTO CARDS DYNAMICALLY =====
function renderCryptoCards() {
    const container = document.getElementById('cryptoCardsContainer');
    container.innerHTML = ''; // Clear existing cards

    CRYPTOS.forEach(crypto => {
        const priceData = window.cryptoData[crypto.id];
        const currentPrice = priceData.usd;
        const previousPrice = previousPrices[crypto.id] || currentPrice;

        // Calculate price change percentage (simulated for demo)
        const changePercent = ((Math.random() - 0.5) * 5).toFixed(2);
        const isPositive = changePercent >= 0;

        // Create card element
        const card = createCryptoCard(
            crypto,
            currentPrice,
            changePercent,
            isPositive
        );

        container.appendChild(card);
    });
}

// ===== CREATE CRYPTO CARD ELEMENT =====
function createCryptoCard(crypto, price, changePercent, isPositive) {
    const card = document.createElement('div');
    card.className = 'crypto-card';

    const changeIcon = isPositive ? '↑' : '↓';
    const changeClass = isPositive ? 'positive' : 'negative';

    card.innerHTML = `
        <div class="crypto-header">
            <div class="crypto-name">
                <span class="crypto-icon">${crypto.icon}</span>
                <div>
                    <div class="crypto-symbol">${crypto.name}</div>
                    <div class="crypto-badge">${crypto.symbol}</div>
                </div>
            </div>
        </div>

        <div class="crypto-info">
            <div class="crypto-price">$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <span class="crypto-change ${changeClass}">
                ${changeIcon} ${Math.abs(changePercent)}%
            </span>
        </div>

        <div class="crypto-meta">
            <span>USD Price</span>
            <span>Live Market</span>
        </div>
    `;

    return card;
}

// ===== UPDATE TIMESTAMP =====
function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
    
    const lastUpdatedEl = document.getElementById('lastUpdated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = timeString;
    }
}

// ===== SHOW/HIDE LOADING =====
function showLoadingIndicator(show) {
    const indicator = document.getElementById('loadingMessage');
    if (indicator) {
        indicator.style.display = show ? 'flex' : 'none';
    }
}

// ===== SEARCH FUNCTIONALITY =====
function setupSearchListener() {
    const searchInput = document.getElementById('searchInput');
    
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const query = e.target.value.toLowerCase();
        const cards = document.querySelectorAll('.crypto-card');

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(query) ? 'block' : 'none';
        });

        // If search is empty, show all
        if (query === '') {
            cards.forEach(card => {
                card.style.display = 'block';
            });
        }
    });
}

// ===== INITIALIZE ON PAGE LOAD =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard initializing...');
    
    // Fetch and display data
    fetchDashboardData();

    // Setup search listener
    setupSearchListener();

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            console.log('🔄 Refreshing data...');
            fetchDashboardData();
        });
    }

    // Auto-refresh every 30 seconds (optional)
    // setInterval(fetchDashboardData, 30000);
});

