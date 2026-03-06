// Sample Data
const workersData = [
    {
        id: 1,
        name: "Rajesh Kumar",
        skill: "Plumber",
        category: "plumber",
        photo: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=2563eb&color=fff&size=200",
        distance: "1.2 km",
        rating: 4.8,
        reviews: 156,
        price: "₹350/hr",
        availability: "available",
        experience: "8 years",
        phone: "+91 98765 43210",
        description: "Expert plumber with extensive experience in all types of plumbing work."
    },
    {
        id: 2,
        name: "Amit Singh",
        skill: "Electrician",
        category: "electrician",
        photo: "https://ui-avatars.com/api/?name=Amit+Singh&background=16a34a&color=fff&size=200",
        distance: "2.5 km",
        rating: 4.9,
        reviews: 203,
        price: "₹400/hr",
        availability: "available",
        experience: "10 years",
        phone: "+91 98765 43211",
        description: "Licensed electrician specializing in residential and commercial electrical work."
    },
    {
        id: 3,
        name: "Suresh Patel",
        skill: "Carpenter",
        category: "carpenter",
        photo: "https://ui-avatars.com/api/?name=Suresh+Patel&background=f59e0b&color=fff&size=200",
        distance: "0.8 km",
        rating: 4.7,
        reviews: 98,
        price: "₹300/hr",
        availability: "available",
        experience: "6 years",
        phone: "+91 98765 43212",
        description: "Skilled carpenter for furniture making and home repairs."
    },
    {
        id: 4,
        name: "Vikram Sharma",
        skill: "Painter",
        category: "painter",
        photo: "https://ui-avatars.com/api/?name=Vikram+Sharma&background=dc2626&color=fff&size=200",
        distance: "3.1 km",
        rating: 4.6,
        reviews: 75,
        price: "₹280/hr",
        availability: "busy",
        experience: "5 years",
        phone: "+91 98765 43213",
        description: "Professional painter with expertise in interior and exterior painting."
    },
    {
        id: 5,
        name: "Mohammed Ali",
        skill: "Cleaner",
        category: "cleaner",
        photo: "https://ui-avatars.com/api/?name=Mohammed+Ali&background=7c3aed&color=fff&size=200",
        distance: "1.9 km",
        rating: 4.5,
        reviews: 134,
        price: "₹250/hr",
        availability: "available",
        experience: "4 years",
        phone: "+91 98765 43214",
        description: "Reliable cleaning service for homes and offices."
    },
    {
        id: 6,
        name: "Prakash Reddy",
        skill: "Electrician",
        category: "electrician",
        photo: "https://ui-avatars.com/api/?name=Prakash+Reddy&background=16a34a&color=fff&size=200",
        distance: "2.8 km",
        rating: 4.7,
        reviews: 112,
        price: "₹380/hr",
        availability: "available",
        experience: "7 years",
        phone: "+91 98765 43215",
        description: "Experienced electrician for all electrical installations and repairs."
    }
];

const historyData = [
    {
        id: 1,
        workerId: 1,
        workerName: "Rajesh Kumar",
        workerSkill: "Plumber",
        workerPhoto: "https://ui-avatars.com/api/?name=Rajesh+Kumar&background=2563eb&color=fff&size=200",
        status: "completed",
        date: "2026-02-10",
        price: "₹700",
        duration: "2 hours",
        feedback: "Excellent work! Very professional and punctual.",
        rating: 5
    },
    {
        id: 2,
        workerId: 2,
        workerName: "Amit Singh",
        workerSkill: "Electrician",
        workerPhoto: "https://ui-avatars.com/api/?name=Amit+Singh&background=16a34a&color=fff&size=200",
        status: "pending",
        date: "2026-02-13",
        price: "₹800",
        duration: "2 hours",
        feedback: null,
        rating: null
    },
    {
        id: 3,
        workerId: 3,
        workerName: "Suresh Patel",
        workerSkill: "Carpenter",
        workerPhoto: "https://ui-avatars.com/api/?name=Suresh+Patel&background=f59e0b&color=fff&size=200",
        status: "completed",
        date: "2026-02-08",
        price: "₹900",
        duration: "3 hours",
        feedback: "Good quality work. Would hire again.",
        rating: 4
    },
    {
        id: 4,
        workerId: 4,
        workerName: "Vikram Sharma",
        workerSkill: "Painter",
        workerPhoto: "https://ui-avatars.com/api/?name=Vikram+Sharma&background=dc2626&color=fff&size=200",
        status: "cancelled",
        date: "2026-02-05",
        price: "₹560",
        duration: "2 hours",
        feedback: null,
        rating: null
    }
];

// State Management
let currentFilter = 'all';
let currentWorkers = [...workersData];
let selectedWorker = null;
let currentHistoryFilter = 'all';

// DOM Elements
const notificationBtn = document.getElementById('notificationBtn');
const notificationPanel = document.getElementById('notificationPanel');
const closeNotifications = document.getElementById('closeNotifications');
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const closeProfile = document.getElementById('closeProfile');
const searchInput = document.getElementById('searchInput');
const categoryChips = document.querySelectorAll('.chip');
const workersList = document.getElementById('workersList');
const sortBy = document.getElementById('sortBy');
const viewHistoryBtn = document.getElementById('viewHistoryBtn');
const historySection = document.getElementById('historySection');
const backToWorkers = document.getElementById('backToWorkers');
const workerModal = document.getElementById('workerModal');
const closeWorkerModal = document.getElementById('closeWorkerModal');
const confirmModal = document.getElementById('confirmModal');
const feedbackModal = document.getElementById('feedbackModal');
const historyFilters = document.querySelectorAll('.history-filter');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderWorkers();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    // Notification Panel
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationPanel.classList.toggle('active');
    });

    closeNotifications.addEventListener('click', () => {
        notificationPanel.classList.remove('active');
    });

    // Profile Modal
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        profileModal.classList.add('active');
    });

    closeProfile.addEventListener('click', () => {
        profileModal.classList.remove('active');
    });

    document.getElementById('cancelEdit').addEventListener('click', () => {
        profileModal.classList.remove('active');
    });

    document.getElementById('saveProfile').addEventListener('click', () => {
        showToast('Profile updated successfully!', 'success');
        profileModal.classList.remove('active');
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        filterWorkers(e.target.value);
    });

    // Category Chips
    categoryChips.forEach(chip => {
        chip.addEventListener('click', () => {
            categoryChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.category;
            filterWorkers(searchInput.value);
        });
    });

    // Sort
    sortBy.addEventListener('change', (e) => {
        sortWorkers(e.target.value);
    });

    // History
    viewHistoryBtn.addEventListener('click', () => {
        showHistory();
    });

    backToWorkers.addEventListener('click', () => {
        hideHistory();
    });

    historyFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            historyFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            currentHistoryFilter = filter.dataset.filter;
            renderHistory();
        });
    });

    // Worker Modal
    closeWorkerModal.addEventListener('click', () => {
        workerModal.classList.remove('active');
    });

    // Confirm Modal
    document.getElementById('cancelConfirm').addEventListener('click', () => {
        confirmModal.classList.remove('active');
    });

    document.getElementById('proceedConfirm').addEventListener('click', () => {
        confirmModal.classList.remove('active');
        sendWorkRequest();
    });

    // Feedback Modal
    document.getElementById('closeFeedback').addEventListener('click', () => {
        feedbackModal.classList.remove('active');
    });

    document.getElementById('cancelFeedback').addEventListener('click', () => {
        feedbackModal.classList.remove('active');
    });

    document.getElementById('submitFeedback').addEventListener('click', () => {
        submitFeedback();
    });

    // Star Rating
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = star.dataset.rating;
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });

    // Close modals on outside click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
        if (!notificationPanel.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationPanel.classList.remove('active');
        }
    });
}

// Render Workers
function renderWorkers() {
    workersList.innerHTML = '';
    
    if (currentWorkers.length === 0) {
        workersList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" style="margin-bottom: 1rem;">
                    <circle cx="40" cy="40" r="35" stroke="currentColor" stroke-width="2" opacity="0.3"/>
                    <path d="M30 45 L40 55 L60 35" stroke="currentColor" stroke-width="3" stroke-linecap="round" opacity="0.3"/>
                </svg>
                <h3>No workers found</h3>
                <p>Try adjusting your search or filters</p>
            </div>
        `;
        return;
    }

    currentWorkers.forEach(worker => {
        const card = createWorkerCard(worker);
        workersList.appendChild(card);
    });
}

function createWorkerCard(worker) {
    const card = document.createElement('div');
    card.className = 'worker-card';
    card.innerHTML = `
        <img src="${worker.photo}" alt="${worker.name}" class="worker-avatar">
        <div class="worker-info">
            <div class="worker-header">
                <div>
                    <div class="worker-name">${worker.name}</div>
                    <div class="worker-skill">${worker.skill}</div>
                </div>
            </div>
            <div class="worker-meta">
                <span class="meta-item">
                    📍 ${worker.distance}
                </span>
                <span class="meta-item">
                    ⭐ <span class="rating">${worker.rating}</span> (${worker.reviews})
                </span>
                <span class="meta-item">
                    💼 ${worker.experience}
                </span>
            </div>
        </div>
        <div class="worker-actions">
            <span class="status-badge ${worker.availability}">${worker.availability === 'available' ? 'Available' : 'Busy'}</span>
            <div class="worker-price">${worker.price}</div>
            ${worker.availability === 'available' ? '<button class="btn btn-primary" onclick="showWorkerDetail(' + worker.id + ')">View Details</button>' : '<button class="btn btn-secondary" disabled>Not Available</button>'}
        </div>
    `;
    
    return card;
}

// Filter Workers
function filterWorkers(searchTerm) {
    let filtered = workersData;

    // Filter by category
    if (currentFilter !== 'all') {
        filtered = filtered.filter(w => w.category === currentFilter);
    }

    // Filter by search term
    if (searchTerm) {
        filtered = filtered.filter(w => 
            w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.skill.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    currentWorkers = filtered;
    sortWorkers(sortBy.value);
}

// Sort Workers
function sortWorkers(criteria) {
    switch(criteria) {
        case 'distance':
            currentWorkers.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            break;
        case 'rating':
            currentWorkers.sort((a, b) => b.rating - a.rating);
            break;
        case 'price':
            currentWorkers.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
            break;
    }
    renderWorkers();
}

// Show Worker Detail
function showWorkerDetail(workerId) {
    const worker = workersData.find(w => w.id === workerId);
    if (!worker) return;

    selectedWorker = worker;
    
    const content = document.getElementById('workerDetailContent');
    content.innerHTML = `
        <div class="worker-detail-header">
            <img src="${worker.photo}" alt="${worker.name}" class="worker-detail-avatar">
            <div class="worker-detail-info">
                <h3>${worker.name}</h3>
                <p class="worker-detail-skill">${worker.skill}</p>
                <div class="worker-detail-rating">
                    ⭐ ${worker.rating} (${worker.reviews} reviews)
                </div>
            </div>
        </div>
        <div class="worker-detail-body">
            <div class="detail-section">
                <h4>About</h4>
                <p style="color: var(--text-secondary);">${worker.description}</p>
            </div>
            <div class="detail-section">
                <h4>Details</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <strong>Experience:</strong> ${worker.experience}
                    </div>
                    <div class="detail-item">
                        <strong>Distance:</strong> ${worker.distance}
                    </div>
                    <div class="detail-item">
                        <strong>Price:</strong> ${worker.price}
                    </div>
                    <div class="detail-item">
                        <strong>Status:</strong> <span class="status-badge ${worker.availability}">${worker.availability === 'available' ? 'Available' : 'Busy'}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="worker-detail-actions">
            <button class="btn btn-secondary" onclick="closeWorkerModalFunc()">Cancel</button>
            ${worker.availability === 'available' ? '<button class="btn btn-primary" onclick="confirmRequest()">Request Work</button>' : '<button class="btn btn-secondary" disabled>Not Available</button>'}
        </div>
    `;
    
    workerModal.classList.add('active');
}

function closeWorkerModalFunc() {
    workerModal.classList.remove('active');
}

// Confirm Request
function confirmRequest() {
    workerModal.classList.remove('active');
    document.getElementById('confirmTitle').textContent = 'Confirm Work Request';
    document.getElementById('confirmMessage').textContent = `Send work request to ${selectedWorker.name}?`;
    confirmModal.classList.add('active');
}

// Send Work Request
function sendWorkRequest() {
    showToast(`Work request sent to ${selectedWorker.name}!`, 'success');
    addNotification('Request Sent', `Your request has been sent to ${selectedWorker.name}`, 'info');
    
    // Simulate response after 3 seconds
    setTimeout(() => {
        addNotification('Request Accepted', `${selectedWorker.name} accepted your work request`, 'success');
    }, 3000);
}

// History Functions
function showHistory() {
    document.querySelector('.workers-list').style.display = 'none';
    document.querySelector('.content-header').style.display = 'none';
    historySection.style.display = 'block';
    renderHistory();
}

function hideHistory() {
    document.querySelector('.workers-list').style.display = 'grid';
    document.querySelector('.content-header').style.display = 'flex';
    historySection.style.display = 'none';
}

function renderHistory() {
    const historyList = document.getElementById('historyList');
    let filtered = historyData;

    if (currentHistoryFilter !== 'all') {
        filtered = historyData.filter(h => h.status === currentHistoryFilter);
    }

    historyList.innerHTML = '';

    if (filtered.length === 0) {
        historyList.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                <h3>No history found</h3>
                <p>Your completed work will appear here</p>
            </div>
        `;
        return;
    }

    filtered.forEach(item => {
        const historyItem = createHistoryItem(item);
        historyList.appendChild(historyItem);
    });
}

function createHistoryItem(item) {
    const div = document.createElement('div');
    div.className = 'history-item';
    
    const statusClass = item.status === 'completed' ? 'available' : item.status === 'pending' ? 'busy' : '';
    
    div.innerHTML = `
        <div class="history-header">
            <div class="history-worker">
                <img src="${item.workerPhoto}" alt="${item.workerName}">
                <div class="history-worker-info">
                    <h4>${item.workerName}</h4>
                    <p>${item.workerSkill}</p>
                </div>
            </div>
            <div class="history-status">
                <span class="status-badge ${statusClass}">${item.status}</span>
            </div>
        </div>
        <div class="history-details">
            <span>📅 ${formatDate(item.date)}</span>
            <span>⏱️ ${item.duration}</span>
            <span>💰 ${item.price}</span>
        </div>
        ${item.feedback ? `
            <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                <div style="display: flex; gap: 0.25rem; margin-bottom: 0.5rem;">
                    ${'⭐'.repeat(item.rating)}${'☆'.repeat(5 - item.rating)}
                </div>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">"${item.feedback}"</p>
            </div>
        ` : ''}
        <div class="history-actions">
            ${item.status === 'completed' && !item.feedback ? '<button class="btn btn-primary" onclick="showFeedbackModal(' + item.id + ')">Rate Worker</button>' : ''}
            ${item.status === 'pending' ? '<button class="btn btn-secondary">View Status</button>' : ''}
            ${item.status === 'completed' ? '<button class="btn btn-text">Book Again</button>' : ''}
        </div>
    `;
    
    return div;
}

// Feedback Modal
function showFeedbackModal(historyId) {
    const item = historyData.find(h => h.id === historyId);
    if (!item) return;

    const feedbackWorkerInfo = document.getElementById('feedbackWorkerInfo');
    feedbackWorkerInfo.innerHTML = `
        <img src="${item.workerPhoto}" alt="${item.workerName}" style="width: 50px; height: 50px; border-radius: 8px;">
        <div>
            <h4 style="margin-bottom: 0.25rem;">${item.workerName}</h4>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">${item.workerSkill}</p>
        </div>
    `;
    
    feedbackModal.classList.add('active');
    feedbackModal.dataset.historyId = historyId;
}

function submitFeedback() {
    const historyId = parseInt(feedbackModal.dataset.historyId);
    const rating = document.querySelectorAll('.star.active').length;
    const feedback = document.getElementById('feedbackText').value;

    if (rating === 0) {
        showToast('Please select a rating', 'warning');
        return;
    }

    // Update history item
    const item = historyData.find(h => h.id === historyId);
    if (item) {
        item.rating = rating;
        item.feedback = feedback || 'No feedback provided';
    }

    showToast('Thank you for your feedback!', 'success');
    feedbackModal.classList.remove('active');
    
    // Reset form
    document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    document.getElementById('feedbackText').value = '';
    
    // Refresh history if it's visible
    if (historySection.style.display === 'block') {
        renderHistory();
    }
}

// Notification Functions
function addNotification(title, text, type) {
    const notificationList = document.getElementById('notificationList');
    const badge = document.getElementById('notificationBadge');
    
    const notification = document.createElement('div');
    notification.className = 'notification-item unread';
    notification.innerHTML = `
        <div class="notification-icon ${type}">
            ${type === 'success' ? '✓' : type === 'info' ? 'ℹ' : '!'}
        </div>
        <div class="notification-content">
            <p class="notification-title">${title}</p>
            <p class="notification-text">${text}</p>
            <span class="notification-time">Just now</span>
        </div>
    `;
    
    notificationList.insertBefore(notification, notificationList.firstChild);
    
    // Update badge
    const currentCount = parseInt(badge.textContent);
    badge.textContent = currentCount + 1;
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 2rem;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'warning' ? 'var(--warning-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        font-weight: 500;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-IN', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
    });
}

// Simulate real-time updates
setInterval(() => {
    // Randomly update worker availability
    const randomWorker = workersData[Math.floor(Math.random() * workersData.length)];
    randomWorker.availability = randomWorker.availability === 'available' ? 'busy' : 'available';
    
    if (historySection.style.display === 'none') {
        renderWorkers();
    }
}, 30000); // Every 30 seconds
