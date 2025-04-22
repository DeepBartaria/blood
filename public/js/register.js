document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const bloodGroup = document.getElementById('bloodGroup').value;
        const age = parseInt(document.getElementById('age').value);
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validate password match
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return;
        }
        
        try {
            // In a real application, you would send this to your server for registration
            // For demo purposes, we'll use localStorage to simulate registration
            
            // Check if email already exists
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const existingUser = users.find(u => u.email === email);
            
            if (existingUser) {
                alert('Email already registered. Please use a different email or login.');
                return;
            }
            
            // Create new user
            const newUser = {
                name,
                bloodGroup,
                age,
                phone,
                email,
                address,
                password,
                lastDonation: null
            };
            
            // Add user to users array
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            // Store current user in localStorage
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            
            // Show success message
            alert('Registration successful! Redirecting to dashboard...');
            
            // Redirect to dashboard
            window.location.href = '/dashboard.html';
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });
}); 