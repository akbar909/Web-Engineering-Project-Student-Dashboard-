// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const addReminderBtn = document.getElementById('add-reminder');
const reminderModal = document.getElementById('reminder-modal');
const reminderForm = document.getElementById('reminder-form');
const remindersContainer = document.getElementById('reminders-container');
const closeModalBtns = document.querySelectorAll('.close-modal');
const profilePic = document.getElementById('profile-pic');
const profileModal = document.getElementById('profile-modal');
const profileUpload = document.getElementById('profile-upload');
const previewImage = document.getElementById('preview-image');
const saveProfileBtn = document.getElementById('save-profile');
const navItems = document.querySelectorAll('.nav-menu li');
const pageContents = document.querySelectorAll('.page-content');
const viewAllLinks = document.querySelectorAll('.view-all[data-navigate]');
const notificationBell = document.querySelector('.notifications');

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Update button text and icon
    if (document.body.classList.contains('dark-theme')) {
        themeToggle.innerHTML = '<span class="icon">☀️</span> Light Mode';
    } else {
        themeToggle.innerHTML = '<span class="icon">🌙</span> Dark Mode';
    }
    
    // Save theme preference to localStorage
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
});

// Check for saved theme preference
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<span class="icon">☀️</span> Light Mode';
    }
    
    // Set up theme radio buttons in settings
    const themeRadios = document.querySelectorAll('input[name="theme"]');
    themeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'dark') {
                document.body.classList.add('dark-theme');
                themeToggle.innerHTML = '<span class="icon">☀️</span> Light Mode';
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-theme');
                themeToggle.innerHTML = '<span class="icon">🌙</span> Dark Mode';
                localStorage.setItem('theme', 'light');
            }
        });
    });
    
    // Set the correct radio button based on current theme
    if (savedTheme === 'dark') {
        document.getElementById('dark-theme').checked = true;
    } else {
        document.getElementById('light-theme').checked = true;
    }
});

// Mobile Sidebar Toggle
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target) && 
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// Navigation functionality
function navigateToPage(pageName) {
    // Hide all pages
    pageContents.forEach(page => {
        page.style.display = 'none';
    });
    
    // Show selected page
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }
    
    // Update active state in sidebar
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageName) {
            item.classList.add('active');
        }
    });
    
    // Close mobile sidebar after navigation
    if (window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

// Add click event to sidebar navigation items
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const pageName = item.dataset.page;
        navigateToPage(pageName);
    });
});

// Add click event to "View All" links
viewAllLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const pageName = link.dataset.navigate;
        navigateToPage(pageName);
    });
});

// Notification bell click to navigate to notifications page
notificationBell.addEventListener('click', () => {
    navigateToPage('notifications');
});

// Modal Functions
function openModal(modal) {
    modal.style.display = 'flex';
}

function closeModal(modal) {
    modal.style.display = 'none';
}

// Close modals with close button
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Add Reminder Modal
addReminderBtn.addEventListener('click', () => {
    openModal(reminderModal);
});

// Handle Reminder Form Submission
reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('reminder-title').value;
    const time = document.getElementById('reminder-time').value;
    const days = document.getElementById('reminder-days').value;
    
    // Format time for display (convert from 24h to 12h format)
    const timeDisplay = formatTime(time);
    
    // Create new reminder item
    const reminderItem = document.createElement('div');
    reminderItem.className = 'reminder-item';
    reminderItem.innerHTML = `
        <div class="reminder-time">${timeDisplay}</div>
        <div class="reminder-details">
            <h4>${title}</h4>
            <p>${days}</p>
        </div>
        <div class="reminder-actions">
            <button class="edit-btn"><span class="icon">✏️</span></button>
            <button class="delete-btn"><span class="icon">🗑️</span></button>
        </div>
    `;
    
    // Add event listeners to new buttons
    const deleteBtn = reminderItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        reminderItem.remove();
    });
    
    // Add reminder to list
    remindersContainer.appendChild(reminderItem);
    
    // Reset form and close modal
    reminderForm.reset();
    closeModal(reminderModal);
});

// Format time function (24h to 12h)
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
}

// Profile Picture Update
profilePic.addEventListener('click', () => {
    openModal(profileModal);
});

// Preview uploaded image
profileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            previewImage.src = event.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Save profile picture
saveProfileBtn.addEventListener('click', () => {
    if (previewImage.src) {
        profilePic.src = previewImage.src;
        closeModal(profileModal);
    }
});

// Add event listeners to existing delete buttons
document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.reminder-item').remove();
    });
});

// Mark notification as read
document.querySelectorAll('.mark-read-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const notification = btn.closest('.notification-item');
        notification.classList.remove('unread');
        btn.parentNode.innerHTML = `<button class="delete-notification-btn"><span class="icon">🗑️</span></button>`;
        
        // Add event listener to the new delete button
        const deleteBtn = notification.querySelector('.delete-notification-btn');
        deleteBtn.addEventListener('click', () => {
            notification.remove();
        });
        
        // Update notification count
        updateNotificationCount();
    });
});

// Delete notification
document.querySelectorAll('.delete-notification-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.notification-item').remove();
        updateNotificationCount();
    });
});

// Update notification count
function updateNotificationCount() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    const badge = document.querySelector('.notification-badge');
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

// Responsive adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

// Initialize the dashboard
updateNotificationCount();