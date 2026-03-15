// Initialize AOS
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Loader
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('fade-out');
    }, 500);
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Mobile menu toggle
document.getElementById('mobileMenuBtn')?.addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('show');
});

// Theme toggle
document.getElementById('themeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('#themeToggle i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    document.querySelector('#themeToggle i').className = 'fas fa-sun';
}

// Back to top
document.getElementById('backToTop')?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// FAQ toggle
function toggleFaq(element) {
    const faqItem = element.closest('.faq-item');
    faqItem.classList.toggle('active');
}

// Contact form
function sendMessage(event) {
    event.preventDefault();
    showNotification('Message sent successfully!', 'success');
    event.target.reset();
    return false;
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Counter animation
function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString() + '+';
        }
    }, 20);
}

// Start counters when in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('totalUsers'), 50000);
            animateCounter(document.getElementById('totalNumbers'), 100000);
            animateCounter(document.getElementById('countries'), 50);
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(document.querySelector('.stats'));

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: white;
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 10px;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 9999;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification.error {
        border-left: 4px solid var(--danger-color);
    }
    
    .notification.info {
        border-left: 4px solid var(--primary-color);
    }
    
    .notification i {
        font-size: 20px;
    }
    
    .notification.success i {
        color: var(--success-color);
    }
    
    .notification.error i {
        color: var(--danger-color);
    }
    
    .notification.info i {
        color: var(--primary-color);
    }
    
    .history-item {
        background: white;
        border-radius: var(--border-radius-md);
        padding: 15px;
        margin-bottom: 10px;
        box-shadow: var(--shadow-sm);
        transition: var(--transition);
    }
    
    .history-item:hover {
        transform: translateX(5px);
        box-shadow: var(--shadow-md);
    }
    
    .history-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }
    
    .history-number {
        font-size: 16px;
        font-weight: 600;
        color: var(--primary-color);
    }
    
    .history-status {
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .history-status.active {
        background: var(--success-color);
        color: white;
    }
    
    .history-status.expired {
        background: var(--danger-color);
        color: white;
    }
    
    .history-item-body {
        display: flex;
        gap: 15px;
        font-size: 12px;
        color: var(--gray-color);
    }
    
    .history-item-body i {
        margin-right: 5px;
    }
    
    .history-filters {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .clear-btn {
        padding: 10px 20px;
        background: var(--danger-color);
        color: white;
        border: none;
        border-radius: var(--border-radius-md);
        cursor: pointer;
        transition: var(--transition);
    }
    
    .clear-btn:hover {
        background: #c82333;
    }
`;

document.head.appendChild(style);