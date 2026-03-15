// Number Generator Logic
const Generator = {
    // Generate random phone number based on country
    generateNumber(country) {
        const formats = {
            us: () => `+1 (${this.random(200, 999)}) ${this.random(200, 999)}-${this.random(1000, 9999)}`,
            uk: () => `+44 ${this.random(7000, 7999)} ${this.random(100000, 999999)}`,
            ca: () => `+1 (${this.random(200, 999)}) ${this.random(200, 999)}-${this.random(1000, 9999)}`,
            au: () => `+61 ${this.random(4, 9)} ${this.random(1000, 9999)} ${this.random(1000, 9999)}`,
            in: () => `+91 ${this.random(70000, 99999)} ${this.random(10000, 99999)}`,
            bd: () => `+880 ${this.random(13, 19)}${this.random(10000000, 99999999)}`,
            pk: () => `+92 ${this.random(300, 399)} ${this.random(1000000, 9999999)}`,
            ae: () => `+971 ${this.random(50, 59)} ${this.random(1000000, 9999999)}`,
            sa: () => `+966 ${this.random(50, 59)} ${this.random(1000000, 9999999)}`,
            eg: () => `+20 ${this.random(100, 999)} ${this.random(1000000, 9999999)}`
        };
        
        return formats[country] ? formats[country]() : formats.us();
    },
    
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    // Generate fake SMS messages
    generateSMS() {
        const messages = [
            { from: 'Google', text: 'Your Google verification code: 123456' },
            { from: 'Facebook', text: 'Your Facebook login code: 789012' },
            { from: 'WhatsApp', text: 'Your WhatsApp code: 345678' },
            { from: 'Instagram', text: 'Your Instagram verification: 901234' },
            { from: 'Twitter', text: 'Your Twitter confirmation: 567890' },
            { from: 'Amazon', text: 'Your Amazon OTP: 123789' },
            { from: 'PayPal', text: 'Your PayPal security code: 456123' },
            { from: 'Binance', text: 'Your Binance 2FA code: 890567' }
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
};

// CAPTCHA Generator
function generateCaptcha() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars[Math.floor(Math.random() * chars.length)];
    }
    document.getElementById('captchaCode').textContent = captcha;
    return captcha;
}

function refreshCaptcha() {
    generateCaptcha();
}

// Main generate function
async function generateNumber() {
    const country = document.getElementById('country').value;
    const service = document.getElementById('service').value;
    const type = document.getElementById('type').value;
    const captchaInput = document.getElementById('captchaInput').value;
    const captchaCode = document.getElementById('captchaCode').textContent;
    
    // Validate inputs
    if (!country) {
        showNotification('Please select a country', 'error');
        return;
    }
    
    if (!service) {
        showNotification('Please select a service', 'error');
        return;
    }
    
    if (!captchaInput || captchaInput !== captchaCode) {
        showNotification('Invalid CAPTCHA', 'error');
        refreshCaptcha();
        document.getElementById('captchaInput').value = '';
        return;
    }
    
    // Disable button and show loading
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    
    // Simulate API call
    setTimeout(() => {
        // Generate number
        const number = Generator.generateNumber(country);
        document.getElementById('generatedNumber').textContent = number;
        document.getElementById('generatedNumberCard').style.display = 'block';
        
        // Start timer
        startTimer(type);
        
        // Generate fake SMS
        startSMSGenerator();
        
        // Save to history
        saveToHistory({
            number: number,
            country: country,
            service: service,
            type: type,
            generatedAt: new Date().toISOString()
        });
        
        // Reset button
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-magic"></i> Generate Number';
        
        // Refresh CAPTCHA
        refreshCaptcha();
        document.getElementById('captchaInput').value = '';
        
        showNotification('Number generated successfully!', 'success');
    }, 2000);
}

// Timer function
function startTimer(type) {
    const timerElement = document.getElementById('timer');
    const times = {
        temporary: 3600, // 1 hour in seconds
        daily: 86400,    // 24 hours
        weekly: 604800,  // 7 days
        monthly: 2592000 // 30 days
    };
    
    let timeLeft = times[type] || 3600;
    
    const timer = setInterval(() => {
        timeLeft--;
        
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timerElement.textContent = 'EXPIRED';
            document.getElementById('generatedNumber').style.opacity = '0.5';
        }
    }, 1000);
}

// SMS Generator
function startSMSGenerator() {
    const smsList = document.getElementById('smsList');
    smsList.innerHTML = '';
    
    // Generate SMS every 30 seconds
    const smsInterval = setInterval(() => {
        const sms = Generator.generateSMS();
        const time = new Date().toLocaleTimeString();
        
        const smsItem = document.createElement('div');
        smsItem.className = 'sms-item';
        smsItem.innerHTML = `
            <span class="time">${time}</span>
            <span class="message"><strong>${sms.from}:</strong> ${sms.text}</span>
        `;
        
        smsList.insertBefore(smsItem, smsList.firstChild);
        
        // Limit to 10 messages
        if (smsList.children.length > 10) {
            smsList.removeChild(smsList.lastChild);
        }
    }, 30000);
    
    // Store interval ID to clear later
    window.currentSMSInterval = smsInterval;
}

// Copy number to clipboard
function copyNumber() {
    const number = document.getElementById('generatedNumber').textContent;
    navigator.clipboard.writeText(number).then(() => {
        showNotification('Number copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy number', 'error');
    });
}

// Save to history
function saveToHistory(data) {
    let history = JSON.parse(localStorage.getItem('numberHistory')) || [];
    history.unshift(data);
    
    // Keep only last 50 items
    if (history.length > 50) {
        history = history.slice(0, 50);
    }
    
    localStorage.setItem('numberHistory', JSON.stringify(history));
    loadHistory();
}

// Load history
function loadHistory() {
    const history = JSON.parse(localStorage.getItem('numberHistory')) || [];
    const historyList = document.getElementById('historyList');
    const searchTerm = document.getElementById('historySearch')?.value.toLowerCase() || '';
    const filter = document.getElementById('historyFilter')?.value || 'all';
    
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    if (history.length === 0) {
        historyList.innerHTML = '<p class="text-center text-muted">No history yet</p>';
        return;
    }
    
    const filteredHistory = history.filter(item => {
        const matchesSearch = item.number.toLowerCase().includes(searchTerm);
        const now = new Date();
        const itemDate = new Date(item.generatedAt);
        const hoursDiff = (now - itemDate) / (1000 * 60 * 60);
        
        if (filter === 'active') {
            return hoursDiff < 1 && matchesSearch;
        } else if (filter === 'expired') {
            return hoursDiff >= 1 && matchesSearch;
        }
        return matchesSearch;
    });
    
    filteredHistory.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        const date = new Date(item.generatedAt).toLocaleString();
        const isActive = (new Date() - new Date(item.generatedAt)) / (1000 * 60 * 60) < 1;
        
        historyItem.innerHTML = `
            <div class="history-item-header">
                <span class="history-number">${item.number}</span>
                <span class="history-status ${isActive ? 'active' : 'expired'}">${isActive ? 'Active' : 'Expired'}</span>
            </div>
            <div class="history-item-body">
                <span><i class="fas fa-globe"></i> ${item.country}</span>
                <span><i class="fas fa-service"></i> ${item.service}</span>
                <span><i class="far fa-clock"></i> ${date}</span>
            </div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Clear history
function clearHistory() {
    if (confirm('Are you sure you want to clear all history?')) {
        localStorage.removeItem('numberHistory');
        loadHistory();
        showNotification('History cleared', 'success');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    generateCaptcha();
    loadHistory();
    
    // Search and filter
    document.getElementById('historySearch')?.addEventListener('input', loadHistory);
    document.getElementById('historyFilter')?.addEventListener('change', loadHistory);
});
