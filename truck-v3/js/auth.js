// Authentication logic
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simple authentication logic
        if (email === 'driver@helpfastpersonnel.com' && password === 'driver123') {
            localStorage.setItem('userRole', 'driver');
            localStorage.setItem('userEmail', email);
            window.location.href = 'driver-portal.html';
        } else if (email === 'staff@helpfastpersonnel.com' && password === 'staff123') {
            localStorage.setItem('userRole', 'staff');
            localStorage.setItem('userEmail', email);
            window.location.href = 'staff-portal.html';
        } else {
            showError('Invalid email or password. Please try again.');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 3000);
    }
});

// Check if user is already logged in
function checkAuth() {
    const userRole = localStorage.getItem('userRole');
    const currentPage = window.location.pathname.split('/').pop();
    
    if (!userRole) {
        if (currentPage !== 'index.html' && currentPage !== '') {
            window.location.href = 'index.html';
        }
        return;
    }
    
    // Redirect based on role
    if (userRole === 'driver' && currentPage !== 'driver-portal.html') {
        window.location.href = 'driver-portal.html';
    } else if (userRole === 'staff' && currentPage !== 'staff-portal.html') {
        window.location.href = 'staff-portal.html';
    }
}

// Logout function
function logout() {
    // Clear user-specific data but preserve sample data
    // localStorage.removeItem('userRole');
    // localStorage.removeItem('userEmail');
    // localStorage.removeItem('todayData');
    // localStorage.removeItem('uploadedFiles');
    // localStorage.removeItem('uniformPhotoData');
    // localStorage.removeItem('uniformConfirmed');
    window.location.href = 'index.html';
} 